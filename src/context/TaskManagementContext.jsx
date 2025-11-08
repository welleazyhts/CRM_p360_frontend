import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_TYPE,
  RECURRENCE_PATTERN,
  createTaskFromTemplate,
  calculateTaskProgress,
  isTaskOverdue,
  isTaskDueSoon,
  shouldCreateRecurrence,
  createRecurringInstance,
  getTaskDependencyStatus,
  getSubtasks,
  calculateParentProgress,
  areAllSubtasksCompleted,
  shouldTriggerReminder,
  filterTasks,
  sortTasks,
  getTaskStatistics
} from '../services/taskManagementService';

const TaskManagementContext = createContext();

export const useTaskManagement = () => {
  const context = useContext(TaskManagementContext);
  if (!context) {
    throw new Error('useTaskManagement must be used within TaskManagementProvider');
  }
  return context;
};

export const TaskManagementProvider = ({ children }) => {
  // Tasks state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // Configuration state
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('taskManagementConfig');
    return saved ? JSON.parse(saved) : {
      defaultView: 'list', // list, kanban, calendar
      defaultDuration: 30,
      enableReminders: true,
      enableRecurring: true,
      enableDependencies: true,
      enableSubtasks: true,
      autoCompleteParent: true, // Auto-complete parent when all subtasks are done
      reminderDefaults: {
        minutesBefore: 30
      }
    };
  });

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem('taskManagementConfig', JSON.stringify(config));
  }, [config]);

  // Check for reminders periodically
  useEffect(() => {
    if (!config.enableReminders) return;

    const checkReminders = () => {
      tasks.forEach(task => {
        if (shouldTriggerReminder(task)) {
          // Trigger reminder notification
          if (window.Notification && Notification.permission === 'granted') {
            new Notification(`Task Reminder: ${task.title}`, {
              body: `Due ${task.dueDate ? new Date(task.dueDate).toLocaleString() : 'soon'}`,
              icon: '/task-icon.png'
            });
          }

          // Mark reminder as sent
          setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, reminderSent: true } : t
          ));
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [tasks, config.enableReminders]);

  /**
   * Create a new task
   */
  const createTask = useCallback((taskData) => {
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: taskData.title,
      description: taskData.description || '',
      type: taskData.type || TASK_TYPE.CUSTOM,
      priority: taskData.priority || TASK_PRIORITY.MEDIUM,
      status: TASK_STATUS.TODO,
      assignedTo: taskData.assignedTo || null,
      dueDate: taskData.dueDate || null,
      estimatedDuration: taskData.estimatedDuration || config.defaultDuration,
      checklist: taskData.checklist || [],
      tags: taskData.tags || [],
      entityType: taskData.entityType || null,
      entityId: taskData.entityId || null,
      parentTaskId: taskData.parentTaskId || null,
      dependencies: taskData.dependencies || [],
      recurring: taskData.recurring || false,
      recurrence: taskData.recurrence || null,
      reminder: taskData.reminder || null,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: taskData.createdBy || null,
      ...taskData
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, [config.defaultDuration]);

  /**
   * Create task from template
   */
  const createFromTemplate = useCallback((templateKey, overrides = {}) => {
    const taskData = createTaskFromTemplate(templateKey, overrides);
    return createTask(taskData);
  }, [createTask]);

  /**
   * Update a task
   */
  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;

      const updated = {
        ...task,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Recalculate progress if checklist changed
      if (updates.checklist) {
        updated.progress = calculateTaskProgress(updates.checklist);
      }

      // Auto-complete task if all checklist items are done
      if (updated.checklist && updated.checklist.length > 0 && updated.progress === 100) {
        if (updated.status !== TASK_STATUS.COMPLETED) {
          updated.status = TASK_STATUS.COMPLETED;
          updated.completedAt = new Date().toISOString();
        }
      }

      return updated;
    }));
  }, []);

  /**
   * Delete a task
   */
  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  /**
   * Complete a task
   */
  const completeTask = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Update task status
    updateTask(taskId, {
      status: TASK_STATUS.COMPLETED,
      completedAt: new Date().toISOString(),
      progress: 100
    });

    // Create recurring instance if needed
    if (config.enableRecurring && shouldCreateRecurrence(task)) {
      const newInstance = createRecurringInstance(task);
      setTasks(prev => [newInstance, ...prev]);
    }

    // Auto-complete parent task if all subtasks are done
    if (config.autoCompleteParent && task.parentTaskId) {
      const allSubtasksCompleted = areAllSubtasksCompleted(task.parentTaskId, tasks);
      if (allSubtasksCompleted) {
        updateTask(task.parentTaskId, {
          status: TASK_STATUS.COMPLETED,
          completedAt: new Date().toISOString(),
          progress: 100
        });
      }
    }
  }, [tasks, updateTask, config]);

  /**
   * Update checklist item
   */
  const updateChecklistItem = useCallback((taskId, checklistItemId, completed) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedChecklist = task.checklist.map(item =>
      item.id === checklistItemId ? { ...item, completed } : item
    );

    updateTask(taskId, { checklist: updatedChecklist });
  }, [tasks, updateTask]);

  /**
   * Add checklist item
   */
  const addChecklistItem = useCallback((taskId, text) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newItem = {
      id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false
    };

    const updatedChecklist = [...(task.checklist || []), newItem];
    updateTask(taskId, { checklist: updatedChecklist });
  }, [tasks, updateTask]);

  /**
   * Remove checklist item
   */
  const removeChecklistItem = useCallback((taskId, checklistItemId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedChecklist = task.checklist.filter(item => item.id !== checklistItemId);
    updateTask(taskId, { checklist: updatedChecklist });
  }, [tasks, updateTask]);

  /**
   * Add task dependency
   */
  const addDependency = useCallback((taskId, dependencyId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (!task.dependencies.includes(dependencyId)) {
      updateTask(taskId, {
        dependencies: [...task.dependencies, dependencyId]
      });
    }
  }, [tasks, updateTask]);

  /**
   * Remove task dependency
   */
  const removeDependency = useCallback((taskId, dependencyId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    updateTask(taskId, {
      dependencies: task.dependencies.filter(id => id !== dependencyId)
    });
  }, [tasks, updateTask]);

  /**
   * Create subtask
   */
  const createSubtask = useCallback((parentTaskId, subtaskData) => {
    return createTask({
      ...subtaskData,
      parentTaskId
    });
  }, [createTask]);

  /**
   * Get task by ID
   */
  const getTask = useCallback((taskId) => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  /**
   * Get tasks by entity
   */
  const getTasksByEntity = useCallback((entityType, entityId) => {
    return tasks.filter(task =>
      task.entityType === entityType && task.entityId === entityId
    );
  }, [tasks]);

  /**
   * Get tasks by assignee
   */
  const getTasksByAssignee = useCallback((assigneeId) => {
    return tasks.filter(task => task.assignedTo === assigneeId);
  }, [tasks]);

  /**
   * Get overdue tasks
   */
  const getOverdueTasks = useCallback(() => {
    return tasks.filter(task => isTaskOverdue(task));
  }, [tasks]);

  /**
   * Get tasks due soon
   */
  const getTasksDueSoon = useCallback(() => {
    return tasks.filter(task => isTaskDueSoon(task));
  }, [tasks]);

  /**
   * Get subtasks
   */
  const getTaskSubtasks = useCallback((parentTaskId) => {
    return getSubtasks(parentTaskId, tasks);
  }, [tasks]);

  /**
   * Get dependency status
   */
  const getDependencyStatus = useCallback((taskId) => {
    const task = getTask(taskId);
    if (!task) return { canStart: true, blockedBy: [] };
    return getTaskDependencyStatus(task, tasks);
  }, [tasks, getTask]);

  /**
   * Filter and sort tasks
   */
  const getFilteredTasks = useCallback((filters = {}, sortBy = 'dueDate', order = 'asc') => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, sortBy, order);
  }, [tasks]);

  /**
   * Get task statistics
   */
  const getStatistics = useCallback(() => {
    return getTaskStatistics(tasks);
  }, [tasks]);

  /**
   * Update configuration
   */
  const updateConfig = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Clear all tasks
   */
  const clearAllTasks = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
      setTasks([]);
      localStorage.removeItem('tasks');
    }
  }, []);

  /**
   * Export tasks
   */
  const exportTasks = useCallback(() => {
    return {
      tasks,
      config,
      exportDate: new Date().toISOString()
    };
  }, [tasks, config]);

  /**
   * Import tasks
   */
  const importTasks = useCallback((data) => {
    if (data.tasks) setTasks(data.tasks);
    if (data.config) setConfig(data.config);
  }, []);

  const value = {
    // State
    tasks,
    config,

    // Task Operations
    createTask,
    createFromTemplate,
    updateTask,
    deleteTask,
    completeTask,
    getTask,

    // Checklist Operations
    updateChecklistItem,
    addChecklistItem,
    removeChecklistItem,

    // Dependency Operations
    addDependency,
    removeDependency,
    getDependencyStatus,

    // Subtask Operations
    createSubtask,
    getTaskSubtasks,

    // Query Operations
    getTasksByEntity,
    getTasksByAssignee,
    getOverdueTasks,
    getTasksDueSoon,
    getFilteredTasks,
    getStatistics,

    // Configuration
    updateConfig,

    // Bulk Operations
    clearAllTasks,
    exportTasks,
    importTasks,

    // Constants
    TASK_STATUS,
    TASK_PRIORITY,
    TASK_TYPE,
    RECURRENCE_PATTERN
  };

  return (
    <TaskManagementContext.Provider value={value}>
      {children}
    </TaskManagementContext.Provider>
  );
};

export default TaskManagementContext;
