import api from './api';

// Task Management Service
const BASE_PATH = '/task_management';

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const TASK_PRIORITY = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

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

// Task templates (kept for reference or frontend creation helper)
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
 * Calculate task progress based on checklist
 */
export const calculateTaskProgress = (checklist = []) => {
  if (!checklist || checklist.length === 0) return 0;
  const completed = checklist.filter(item => item.completed).length;
  return Math.round((completed / checklist.length) * 100);
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
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // backend will eventually replace ID
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
      if (options.daysOfWeek) {
        const currentDay = date.getDay();
        const targetDays = options.daysOfWeek.sort((a, b) => a - b);
        let daysToAdd = 1;

        for (let i = 0; i < 7; i++) {
          const checkDay = (currentDay + daysToAdd) % 7;
          if (targetDays.includes(checkDay)) {
            break;
          }
          daysToAdd++;
        }
        date.setDate(date.getDate() + daysToAdd);
      }
      break;

    default:
      // default behavior or error, keeping simple for now
      break;
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
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // placeholder
    status: TASK_STATUS.TODO,
    progress: 0,
    dueDate: nextDueDate,
    completedAt: null,
    createdAt: new Date().toISOString(),
    parentTaskId: completedTask.parentTaskId || completedTask.id,
    checklist: (completedTask.checklist || []).map(item => ({
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
 * Get subtasks for a parent task
 */
export const getSubtasks = (parentTaskId, allTasks = []) => {
  if (!Array.isArray(allTasks)) return [];
  return allTasks.filter(task => task.parentTaskId === parentTaskId);
};

/**
 * Check if all subtasks are completed
 */
export const areAllSubtasksCompleted = (parentTaskId, allTasks = []) => {
  const subtasks = getSubtasks(parentTaskId, allTasks);
  if (subtasks.length === 0) return true;
  return subtasks.every(task => task.status === TASK_STATUS.COMPLETED);
};

/**
 * Get task dependency status
 */
export const getTaskDependencyStatus = (task, allTasks = []) => {
  if (!task.dependencies || task.dependencies.length === 0) {
    return { canStart: true, blockedBy: [] };
  }

  const blockedBy = [];
  for (const depId of task.dependencies) {
    const depTask = (allTasks || []).find(t => t.id === depId);
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
 * Filter tasks
 * (This logic is usually handled by backend, but kept for frontend filtering if needed)
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

  // Note: simplified version for frontend use if data is already loaded
  if (filters.overdue) {
    filtered = filtered.filter(task => isTaskOverdue(task));
  }

  if (filters.dueSoon) {
    filtered = filtered.filter(task => isTaskDueSoon(task));
  }

  return filtered;
};

/**
 * Sort tasks
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
export const getTaskStatistics = (tasks = []) => {
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
    stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;
    stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;
    stats.byType[task.type] = (stats.byType[task.type] || 0) + 1;

    if (isTaskOverdue(task)) stats.overdue++;
    if (isTaskDueSoon(task)) stats.dueSoon++;

    if (task.status === TASK_STATUS.COMPLETED) stats.completed++;
    if (task.status === TASK_STATUS.IN_PROGRESS) stats.inProgress++;
  });

  if (stats.total > 0) {
    stats.completionRate = Math.round((stats.completed / stats.total) * 100);
  }

  return stats;
};

// Helper to convert camelCase to snake_case for API
const toApiPayload = (data) => {
  const payload = {
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    type: data.type,
    due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    recurring_task: data.recurring,
    reminder_enabled: data.reminder ? data.reminder.enabled : false,

    // Potential extra fields mapping based on typical patterns
    assigned_to: data.assignedTo,
    estimated_duration: data.estimatedDuration,
    // Backend expects strings for these JSON fields
    tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : '[]',
    checklist: Array.isArray(data.checklist) ? JSON.stringify(data.checklist) : '[]',

    // Flatten recurrence/reminder details if backend expects them flat or map as objects if supported.
    // Based on limited postman info, we map what we know. 
    // If backend uses Django DRF default, nesting requires specific serializers.
    // For now, ensuring basic fields match snake_case.
  };
  return payload;
};

const taskManagementService = {
  /**
   * List all tasks
   * GET /api/task_management/list/
   */
  listTasks: async (params = {}) => {
    try {
      const response = await api.get(`${BASE_PATH}/list/`, { params });
      return response.data; // e.g. [{...}, {...}] or { results: [...] }
    } catch (error) {
      console.error('Error fetching tasks from API:', error);
      throw error;
    }
  },

  /**
   * Get a single task
   * GET /api/task_management/list/{id}/
   */
  getTask: async (taskId) => {
    try {
      const response = await api.get(`${BASE_PATH}/list/${taskId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new task
   * POST /api/task_management/create/
   */
  createTask: async (taskData) => {
    try {
      const payload = toApiPayload(taskData);
      const response = await api.post(`${BASE_PATH}/create/`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  /**
   * Update a task
   * PUT /api/task_management/update/{id}/
   */
  updateTask: async (taskId, updates) => {
    try {
      const payload = toApiPayload(updates);
      const response = await api.put(`${BASE_PATH}/update/${taskId}/`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a task
   * DELETE /api/task_management/delete/{id}/
   */
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`${BASE_PATH}/delete/${taskId}/`);
      return response.data || { success: true, id: taskId };
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Export tasks
   * GET /api/task_management/export/
   */
  exportTasks: async (params = {}) => {
    try {
      // Assuming export endpoint returns a file blob or JSON
      const response = await api.get(`${BASE_PATH}/export/`, { params, responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Error exporting tasks:', error);
      throw error;
    }
  },

  /**
   * Get dashboard stats
   * GET /api/task_management/dashboard-stats/
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/dashboard-stats/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // NOTE: Helper methods like calculations (progress, overdue) can remain if they are pure utility functions 
  // and do not rely on hardcoded data. 
  isTaskOverdue: (task) => {
    if (!task.dueDate || task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.CANCELLED) {
      return false;
    }
    return new Date(task.dueDate) < new Date();
  },

  isTaskDueSoon: (task) => {
    if (!task.dueDate || task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.CANCELLED) {
      return false;
    }
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const hoursDiff = (dueDate - now) / (1000 * 60 * 60);
    return hoursDiff > 0 && hoursDiff <= 24;
  }
};

export default taskManagementService;
