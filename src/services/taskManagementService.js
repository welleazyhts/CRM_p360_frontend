/**
 * Task Management Service
 *
 * Provides comprehensive task management functionality including:
 * - Task CRUD operations
 * - Task dependencies and subtasks
 * - Recurring tasks
 * - Task templates
 * - Calendar integration
 * - Task prioritization
 * - Reminders and notifications
 */

import api from './api';

// Task statuses
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Task priorities
export const TASK_PRIORITY = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Task types
export const TASK_TYPE = {
  CALL: 'call',
  MEETING: 'meeting',
  EMAIL: 'email',
  FOLLOW_UP: 'follow_up',
  DOCUMENT: 'document',
  CLAIM_PROCESSING: 'claim_processing',
  POLICY_REVIEW: 'policy_review',
  QUOTE_PREPARATION: 'quote_preparation',
  CUSTOM: 'custom'
};

// Recurrence patterns
export const RECURRENCE_PATTERN = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CUSTOM: 'custom'
};

// Task templates
export const TASK_TEMPLATES = {
  followUpCall: {
    title: 'Follow-up Call',
    type: TASK_TYPE.CALL,
    priority: TASK_PRIORITY.MEDIUM,
    estimatedDuration: 15,
    description: 'Follow up with lead/customer',
    defaultChecklist: [
      'Review previous interaction notes',
      'Prepare talking points',
      'Make the call',
      'Document outcome'
    ]
  },
  policyRenewal: {
    title: 'Policy Renewal Follow-up',
    type: TASK_TYPE.FOLLOW_UP,
    priority: TASK_PRIORITY.HIGH,
    estimatedDuration: 30,
    description: 'Contact customer for policy renewal',
    defaultChecklist: [
      'Review current policy details',
      'Prepare renewal quote',
      'Contact customer',
      'Send renewal documents',
      'Follow up on decision'
    ]
  },
  claimVerification: {
    title: 'Claim Verification',
    type: TASK_TYPE.CLAIM_PROCESSING,
    priority: TASK_PRIORITY.HIGH,
    estimatedDuration: 45,
    description: 'Verify and process insurance claim',
    defaultChecklist: [
      'Review claim documents',
      'Verify policy coverage',
      'Contact customer for additional info if needed',
      'Process claim',
      'Update claim status'
    ]
  },
  quotePreparation: {
    title: 'Prepare Insurance Quote',
    type: TASK_TYPE.QUOTE_PREPARATION,
    priority: TASK_PRIORITY.MEDIUM,
    estimatedDuration: 30,
    description: 'Prepare and send insurance quote',
    defaultChecklist: [
      'Gather customer requirements',
      'Calculate premium',
      'Prepare quote document',
      'Review with manager',
      'Send to customer'
    ]
  },
  customerMeeting: {
    title: 'Customer Meeting',
    type: TASK_TYPE.MEETING,
    priority: TASK_PRIORITY.HIGH,
    estimatedDuration: 60,
    description: 'Meet with customer to discuss insurance needs',
    defaultChecklist: [
      'Prepare meeting agenda',
      'Review customer history',
      'Conduct meeting',
      'Document meeting notes',
      'Schedule follow-up actions'
    ]
  }
};

/**
 * Create a new task from template
 */
export const createTaskFromTemplate = (templateKey, overrides = {}) => {
  const template = TASK_TEMPLATES[templateKey];
  if (!template) {
    throw new Error(`Template ${templateKey} not found`);
  }

  return {
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...template,
    checklist: template.defaultChecklist.map((item, index) => ({
      id: `check_${index}`,
      text: item,
      completed: false
    })),
    status: TASK_STATUS.TODO,
    progress: 0,
    createdAt: new Date().toISOString(),
    ...overrides
  };
};

/**
 * Calculate task progress based on checklist
 */
export const calculateTaskProgress = (checklist = []) => {
  if (checklist.length === 0) return 0;
  const completed = checklist.filter(item => item.completed).length;
  return Math.round((completed / checklist.length) * 100);
};

/**
 * Check if task is overdue
 */
export const isTaskOverdue = (task) => {
  if (!task.dueDate || task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.CANCELLED) {
    return false;
  }
  return new Date(task.dueDate) < new Date();
};

/**
 * Check if task is due soon (within 24 hours)
 */
export const isTaskDueSoon = (task) => {
  if (!task.dueDate || task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.CANCELLED) {
    return false;
  }
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const hoursDiff = (dueDate - now) / (1000 * 60 * 60);
  return hoursDiff > 0 && hoursDiff <= 24;
};

/**
 * Get task duration label
 */
export const getTaskDurationLabel = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Calculate next occurrence for recurring task
 */
export const calculateNextOccurrence = (startDate, pattern, interval = 1, options = {}) => {
  const date = new Date(startDate);

  switch (pattern) {
    case RECURRENCE_PATTERN.DAILY:
      date.setDate(date.getDate() + interval);
      break;

    case RECURRENCE_PATTERN.WEEKLY:
      date.setDate(date.getDate() + (7 * interval));
      break;

    case RECURRENCE_PATTERN.MONTHLY:
      date.setMonth(date.getMonth() + interval);
      break;

    case RECURRENCE_PATTERN.YEARLY:
      date.setFullYear(date.getFullYear() + interval);
      break;

    case RECURRENCE_PATTERN.CUSTOM:
      // Custom pattern based on options
      if (options.daysOfWeek) {
        // Find next occurrence on specified days of week
        const currentDay = date.getDay();
        const targetDays = options.daysOfWeek.sort((a, b) => a - b);
        let daysToAdd = 1;
        let found = false;

        for (let i = 0; i < 7; i++) {
          const checkDay = (currentDay + daysToAdd) % 7;
          if (targetDays.includes(checkDay)) {
            found = true;
            break;
          }
          daysToAdd++;
        }

        date.setDate(date.getDate() + daysToAdd);
      }
      break;

    default:
      throw new Error(`Unknown recurrence pattern: ${pattern}`);
  }

  return date.toISOString();
};

/**
 * Check if recurring task should create new instance
 */
export const shouldCreateRecurrence = (task) => {
  if (!task.recurring || !task.recurrence) return false;
  if (task.status !== TASK_STATUS.COMPLETED) return false;
  if (task.recurrence.endDate && new Date(task.recurrence.endDate) < new Date()) return false;
  if (task.recurrence.occurrences && task.recurrence.currentOccurrence >= task.recurrence.occurrences) return false;
  return true;
};

/**
 * Create next recurring task instance
 */
export const createRecurringInstance = (completedTask) => {
  const nextDueDate = calculateNextOccurrence(
    completedTask.dueDate,
    completedTask.recurrence.pattern,
    completedTask.recurrence.interval,
    completedTask.recurrence.options
  );

  const newTask = {
    ...completedTask,
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: TASK_STATUS.TODO,
    progress: 0,
    dueDate: nextDueDate,
    completedAt: null,
    createdAt: new Date().toISOString(),
    parentTaskId: completedTask.parentTaskId || completedTask.id,
    checklist: completedTask.checklist.map(item => ({
      ...item,
      completed: false
    })),
    recurrence: {
      ...completedTask.recurrence,
      currentOccurrence: (completedTask.recurrence.currentOccurrence || 1) + 1
    }
  };

  return newTask;
};

/**
 * Get task dependency status
 */
export const getTaskDependencyStatus = (task, allTasks) => {
  if (!task.dependencies || task.dependencies.length === 0) {
    return { canStart: true, blockedBy: [] };
  }

  const blockedBy = [];

  for (const depId of task.dependencies) {
    const depTask = allTasks.find(t => t.id === depId);
    if (!depTask || depTask.status !== TASK_STATUS.COMPLETED) {
      blockedBy.push(depId);
    }
  }

  return {
    canStart: blockedBy.length === 0,
    blockedBy
  };
};

/**
 * Get subtasks for a parent task
 */
export const getSubtasks = (parentTaskId, allTasks) => {
  return allTasks.filter(task => task.parentTaskId === parentTaskId);
};

/**
 * Calculate parent task progress based on subtasks
 */
export const calculateParentProgress = (parentTaskId, allTasks) => {
  const subtasks = getSubtasks(parentTaskId, allTasks);
  if (subtasks.length === 0) return 0;

  const totalProgress = subtasks.reduce((sum, task) => sum + (task.progress || 0), 0);
  return Math.round(totalProgress / subtasks.length);
};

/**
 * Check if all subtasks are completed
 */
export const areAllSubtasksCompleted = (parentTaskId, allTasks) => {
  const subtasks = getSubtasks(parentTaskId, allTasks);
  if (subtasks.length === 0) return true;
  return subtasks.every(task => task.status === TASK_STATUS.COMPLETED);
};

/**
 * Get task reminder time
 */
export const getTaskReminderTime = (task) => {
  if (!task.reminder || !task.dueDate) return null;

  const dueDate = new Date(task.dueDate);
  const reminderMinutes = task.reminder.minutesBefore || 30;
  const reminderTime = new Date(dueDate.getTime() - (reminderMinutes * 60 * 1000));

  return reminderTime;
};

/**
 * Check if reminder should be triggered
 */
export const shouldTriggerReminder = (task) => {
  if (!task.reminder || task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.CANCELLED) {
    return false;
  }

  const reminderTime = getTaskReminderTime(task);
  if (!reminderTime) return false;

  const now = new Date();
  return now >= reminderTime && !task.reminderSent;
};

/**
 * Filter tasks by various criteria
 */
export const filterTasks = (tasks, filters) => {
  let filtered = [...tasks];

  if (filters.status) {
    filtered = filtered.filter(task => task.status === filters.status);
  }

  if (filters.priority) {
    filtered = filtered.filter(task => task.priority === filters.priority);
  }

  if (filters.type) {
    filtered = filtered.filter(task => task.type === filters.type);
  }

  if (filters.assignedTo) {
    filtered = filtered.filter(task => task.assignedTo === filters.assignedTo);
  }

  if (filters.entityType && filters.entityId) {
    filtered = filtered.filter(task =>
      task.entityType === filters.entityType && task.entityId === filters.entityId
    );
  }

  if (filters.overdue) {
    filtered = filtered.filter(task => isTaskOverdue(task));
  }

  if (filters.dueSoon) {
    filtered = filtered.filter(task => isTaskDueSoon(task));
  }

  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    filtered = filtered.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate >= new Date(start) && taskDate <= new Date(end);
    });
  }

  return filtered;
};

/**
 * Sort tasks by various criteria
 */
export const sortTasks = (tasks, sortBy = 'dueDate', order = 'asc') => {
  const sorted = [...tasks];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'dueDate':
        comparison = new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        break;

      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        comparison = (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
        break;

      case 'status':
        const statusOrder = { todo: 0, in_progress: 1, on_hold: 2, completed: 3, cancelled: 4 };
        comparison = (statusOrder[a.status] || 999) - (statusOrder[b.status] || 999);
        break;

      case 'createdAt':
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;

      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '');
        break;

      default:
        comparison = 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

/**
 * Get task statistics
 */
export const getTaskStatistics = (tasks) => {
  const stats = {
    total: tasks.length,
    byStatus: {},
    byPriority: {},
    byType: {},
    overdue: 0,
    dueSoon: 0,
    completed: 0,
    inProgress: 0,
    completionRate: 0
  };

  tasks.forEach(task => {
    // By status
    stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;

    // By priority
    stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;

    // By type
    stats.byType[task.type] = (stats.byType[task.type] || 0) + 1;

    // Overdue and due soon
    if (isTaskOverdue(task)) stats.overdue++;
    if (isTaskDueSoon(task)) stats.dueSoon++;

    // Completed and in progress
    if (task.status === TASK_STATUS.COMPLETED) stats.completed++;
    if (task.status === TASK_STATUS.IN_PROGRESS) stats.inProgress++;
  });

  // Completion rate
  if (stats.total > 0) {
    stats.completionRate = Math.round((stats.completed / stats.total) * 100);
  }

  return stats;
};

// In-memory task store (mock)
const _tasks = [
  createTaskFromTemplate('followUpCall', {
    id: 'task_mock_1',
    assignedTo: 'sarah.johnson',
    entityType: 'lead',
    entityId: 'LEAD-001',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    reminder: { minutesBefore: 60 },
    createdAt: new Date().toISOString()
  }),
  createTaskFromTemplate('policyRenewal', {
    id: 'task_mock_2',
    assignedTo: 'mike.wilson',
    entityType: 'policy',
    entityId: 'POL-2025-001',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    reminder: { minutesBefore: 24 * 60 },
    createdAt: new Date().toISOString()
  })
];

// Simple reminder registry to track scheduled reminders (mock)
const _reminders = new Map();

// Utility: generate id
const _genId = (prefix = 'task') => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

/**
 * listTasks(filters = {})
 */
export const listTasks = async (filters = {}) => {
  try {
    const response = await api.get('/tasks', { params: filters });
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching tasks from API, using mock:', error);
    // Fallback to in-memory implementation
    // validate filters
    if (typeof filters !== 'object') throw new Error('filters must be an object');

    const { page = 1, limit = 10, search, status, priority, type, assignedTo, entityType, entityId, dueDateRange, overdue, dueSoon, sortBy = 'dueDate', order = 'asc' } = filters;

    let items = [..._tasks];

    // search in title/description
    if (search) {
      const s = String(search).toLowerCase();
      items = items.filter(t => (t.title || '').toLowerCase().includes(s) || (t.description || '').toLowerCase().includes(s));
    }

    if (status) items = items.filter(t => t.status === status);
    if (priority) items = items.filter(t => t.priority === priority);
    if (type) items = items.filter(t => t.type === type);
    if (assignedTo) items = items.filter(t => t.assignedTo === assignedTo);
    if (entityType && entityId) items = items.filter(t => t.entityType === entityType && t.entityId === entityId);
    if (overdue) items = items.filter(t => isTaskOverdue(t));
    if (dueSoon) items = items.filter(t => isTaskDueSoon(t));
    if (dueDateRange && dueDateRange.start && dueDateRange.end) {
      const start = new Date(dueDateRange.start);
      const end = new Date(dueDateRange.end);
      items = items.filter(t => t.dueDate && new Date(t.dueDate) >= start && new Date(t.dueDate) <= end);
    }

    // sort
    items = sortTasks(items, sortBy, order);

    // paginate
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.max(1, parseInt(limit, 10) || 10);
    const start = (p - 1) * l;
    const paged = items.slice(start, start + l);

    return { tasks: paged, pagination: { page: p, limit: l, total: items.length } };
  }
};

/**
 * getTask(taskId)
 */
export const getTask = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching task from API, using mock:', error);
    // Fallback to in-memory
    if (!taskId) throw new Error('taskId is required');
    const task = _tasks.find(t => t.id === taskId);
    if (!task) throw new Error('task not found');

    // attach subtasks, dependencies info
    const subtasks = getSubtasks(taskId, _tasks);
    const dependencies = (task.dependencies || []).map(depId => _tasks.find(t => t.id === depId) || { id: depId });

    return { ...task, subtasks, dependencies };
  }
};

/**
 * createTask(taskData)
 */
export const createTask = async (taskData = {}) => {
  try {
    const response = await api.post('/tasks', taskData);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error creating task via API, using mock:', error);
    // Fallback to in-memory
    if (!taskData || typeof taskData !== 'object') throw new Error('taskData must be an object');
    if (!taskData.title && !taskData.templateKey) throw new Error('title is required unless templateKey is provided');

    let newTask = null;

    if (taskData.templateKey) {
      newTask = createTaskFromTemplate(taskData.templateKey, taskData);
    } else {
      newTask = {
        id: taskData.id || _genId('task'),
        title: String(taskData.title),
        description: taskData.description || '',
        type: taskData.type || TASK_TYPE.CUSTOM,
        priority: taskData.priority || TASK_PRIORITY.MEDIUM,
        status: taskData.status || TASK_STATUS.TODO,
        assignedTo: taskData.assignedTo || null,
        entityType: taskData.entityType || null,
        entityId: taskData.entityId || null,
        dueDate: taskData.dueDate || null,
        reminder: taskData.reminder || null,
        checklist: (taskData.checklist || []).map((c, i) => ({ id: c.id || `chk_${i}`, text: c.text || '', completed: !!c.completed })),
        recurrence: taskData.recurrence || null,
        parentTaskId: taskData.parentTaskId || null,
        dependencies: taskData.dependencies || [],
        progress: calculateTaskProgress(taskData.checklist || []),
        createdAt: new Date().toISOString()
      };
    }

    _tasks.push(newTask);

    // schedule reminder mock
    if (newTask.reminder && newTask.dueDate) {
      const reminderTime = getTaskReminderTime(newTask);
      if (reminderTime) {
        const ms = Math.max(0, new Date(reminderTime).getTime() - Date.now());
        const timer = setTimeout(() => {
          // mark reminderSent (mock)
          const t = _tasks.find(x => x.id === newTask.id);
          if (t) t.reminderSent = true;
        }, ms);
        _reminders.set(newTask.id, timer);
      }
    }

    return newTask;
  }
};

/**
 * updateTask(taskId, updates)
 */
export const updateTask = async (taskId, updates = {}) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, updates);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating task via API, using mock:', error);
    // Fallback to in-memory
    if (!taskId) throw new Error('taskId is required');
    if (!updates || typeof updates !== 'object') throw new Error('updates must be an object');

    const idx = _tasks.findIndex(t => t.id === taskId);
    if (idx === -1) throw new Error('task not found');

    const task = _tasks[idx];
    const allowed = ['title', 'dueDate', 'assignedTo', 'priority', 'status', 'checklist', 'recurrence', 'description'];
    for (const key of Object.keys(updates)) {
      if (allowed.includes(key)) task[key] = updates[key];
    }

    // update progress from checklist if provided
    if (updates.checklist) task.progress = calculateTaskProgress(updates.checklist);

    // if status moved to completed, run completeTask
    if (updates.status === TASK_STATUS.COMPLETED && task.status !== TASK_STATUS.COMPLETED) {
      const res = await completeTask(taskId, { createRecurrence: true });
      return res.task;
    }

    // update parent progress if this is a subtask
    if (task.parentTaskId) {
      const parentIdx = _tasks.findIndex(t => t.id === task.parentTaskId);
      if (parentIdx !== -1) {
        _tasks[parentIdx].progress = calculateParentProgress(task.parentTaskId, _tasks);
      }
    }

    _tasks[idx] = task;
    return task;
  }
};

/**
 * completeTask(taskId, options = { createRecurrence: true })
 */
export const completeTask = async (taskId, options = { createRecurrence: true }) => {
  try {
    const response = await api.post(`/tasks/${taskId}/complete`, options);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error completing task via API, using mock:', error);
    // Fallback to in-memory
    if (!taskId) throw new Error('taskId is required');
    const idx = _tasks.findIndex(t => t.id === taskId);
    if (idx === -1) throw new Error('task not found');

    const task = _tasks[idx];
    task.status = TASK_STATUS.COMPLETED;
    task.completedAt = new Date().toISOString();
    task.progress = 100;

    // clear any reminders
    if (_reminders.has(task.id)) {
      clearTimeout(_reminders.get(task.id));
      _reminders.delete(task.id);
    }

    // notify (mock)
    // In real implementation: send notification to assignee

    let newRecurring = null;
    if (options.createRecurrence && shouldCreateRecurrence(task)) {
      newRecurring = createRecurringInstance(task);
      _tasks.push(newRecurring);
    }

    // update parent progress
    if (task.parentTaskId) {
      const parentIdx = _tasks.findIndex(t => t.id === task.parentTaskId);
      if (parentIdx !== -1) {
        _tasks[parentIdx].progress = calculateParentProgress(task.parentTaskId, _tasks);
        if (areAllSubtasksCompleted(task.parentTaskId, _tasks)) {
          _tasks[parentIdx].status = TASK_STATUS.COMPLETED;
          _tasks[parentIdx].completedAt = new Date().toISOString();
        }
      }
    }

    return { success: true, task, newRecurringInstance: newRecurring };
  }
};

/**
 * deleteTask(taskId)
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data || { success: true, id: taskId };
  } catch (error) {
    console.error('Error deleting task via API, using mock:', error);
    // Fallback to in-memory
    if (!taskId) throw new Error('taskId is required');
    const idx = _tasks.findIndex(t => t.id === taskId);
    if (idx === -1) throw new Error('task not found');

    // cancel reminders
    if (_reminders.has(taskId)) {
      clearTimeout(_reminders.get(taskId));
      _reminders.delete(taskId);
    }

    _tasks.splice(idx, 1);
    return { success: true, id: taskId };
  }
};

/**
 * bulkComplete(taskIds)
 */
export const bulkComplete = async (taskIds = []) => {
  if (!Array.isArray(taskIds)) throw new Error('taskIds must be an array');
  const results = [];
  for (const id of taskIds) {
    try {
      const res = await completeTask(id, { createRecurrence: true });
      results.push({ id, success: true, task: res.task });
    } catch (err) {
      results.push({ id, success: false, error: err.message });
    }
  }
  return { results };
};

/** Subtask utilities */
export const addSubtask = async (parentTaskId, subtaskData = {}) => {
  if (!parentTaskId) throw new Error('parentTaskId is required');
  if (!subtaskData || typeof subtaskData !== 'object') throw new Error('subtaskData must be an object');
  const parent = _tasks.find(t => t.id === parentTaskId);
  if (!parent) throw new Error('parent task not found');

  const sub = await createTask({ ...subtaskData, parentTaskId });
  return sub;
};

export const updateSubtask = async (parentTaskId, subtaskId, updates = {}) => {
  if (!parentTaskId || !subtaskId) throw new Error('parentTaskId and subtaskId are required');
  const subIdx = _tasks.findIndex(t => t.id === subtaskId && t.parentTaskId === parentTaskId);
  if (subIdx === -1) throw new Error('subtask not found');
  return updateTask(subtaskId, updates);
};

export const deleteSubtask = async (parentTaskId, subtaskId) => {
  if (!parentTaskId || !subtaskId) throw new Error('parentTaskId and subtaskId are required');
  const subIdx = _tasks.findIndex(t => t.id === subtaskId && t.parentTaskId === parentTaskId);
  if (subIdx === -1) throw new Error('subtask not found');
  return deleteTask(subtaskId);
};

/**
 * assignTask(taskId, userId)
 */
export const assignTask = async (taskId, userId) => {
  if (!taskId || !userId) throw new Error('taskId and userId are required');
  const idx = _tasks.findIndex(t => t.id === taskId);
  if (idx === -1) throw new Error('task not found');
  _tasks[idx].assignedTo = userId;
  // mock notify
  return { success: true, task: _tasks[idx] };
};

/**
 * getTasksForEntity(entityType, entityId, filters)
 */
export const getTasksForEntity = async (entityType, entityId, filters = {}) => {
  if (!entityType || !entityId) throw new Error('entityType and entityId are required');
  const mergedFilters = { ...filters, entityType, entityId };
  return listTasks(mergedFilters);
};

const taskService = {
  TASK_STATUS,
  TASK_PRIORITY,
  TASK_TYPE,
  RECURRENCE_PATTERN,
  TASK_TEMPLATES,
  createTaskFromTemplate,
  calculateTaskProgress,
  isTaskOverdue,
  isTaskDueSoon,
  getTaskDurationLabel,
  calculateNextOccurrence,
  shouldCreateRecurrence,
  createRecurringInstance,
  getTaskDependencyStatus,
  getSubtasks,
  calculateParentProgress,
  areAllSubtasksCompleted,
  getTaskReminderTime,
  shouldTriggerReminder,
  filterTasks,
  sortTasks,
  getTaskStatistics,
  // CRUD + helpers
  listTasks,
  getTask,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
  bulkComplete,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  assignTask,
  getTasksForEntity
};

export default taskService;
