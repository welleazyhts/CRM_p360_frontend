/**
 * Workflow Engine Service
 *
 * Local Storage Implementation for Workflow Builder
 */

// Storage Keys
const STORAGE_KEYS = {
  WORKFLOWS: 'workflow_builder_workflows',
  EXECUTIONS: 'workflow_builder_executions',
  SETTINGS: 'workflow_builder_settings'
};

// Workflow status
export const WORKFLOW_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Node types
export const NODE_TYPE = {
  START: 'start',
  ACTION: 'action',
  CONDITION: 'condition',
  APPROVAL: 'approval',
  NOTIFICATION: 'notification',
  DELAY: 'delay',
  END: 'end'
};

// Action types
export const ACTION_TYPE = {
  SEND_EMAIL: 'send_email',
  SEND_SMS: 'send_sms',
  SEND_WHATSAPP: 'send_whatsapp',
  CREATE_TASK: 'create_task',
  UPDATE_FIELD: 'update_field',
  WEBHOOK: 'webhook',
  ASSIGN_TO: 'assign_to'
};

// Condition operators
export const CONDITION_OPERATOR = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  CONTAINS: 'contains',
  IS_EMPTY: 'is_empty',
  IS_NOT_EMPTY: 'is_not_empty'
};

// Trigger types
export const TRIGGER_TYPE = {
  MANUAL: 'manual',
  ON_CREATE: 'on_create',
  ON_UPDATE: 'on_update',
  ON_STATUS_CHANGE: 'on_status_change',
  SCHEDULED: 'scheduled',
  WEBHOOK: 'webhook'
};

/**
 * Workflow templates for common scenarios
 */
export const WORKFLOW_TEMPLATES = {
  leadApproval: {
    name: 'Lead Approval Workflow',
    description: 'Multi-level approval for high-value leads',
    trigger: TRIGGER_TYPE.ON_CREATE,
    nodes: [
      {
        id: 'start',
        type: NODE_TYPE.START,
        next: 'check_value'
      },
      {
        id: 'check_value',
        type: NODE_TYPE.CONDITION,
        label: 'Check Lead Value',
        condition: {
          field: 'estimatedValue',
          operator: CONDITION_OPERATOR.GREATER_THAN,
          value: 100000
        },
        trueNext: 'manager_approval',
        falseNext: 'auto_approve'
      },
      {
        id: 'manager_approval',
        type: NODE_TYPE.APPROVAL,
        label: 'Manager Approval Required',
        approvers: ['manager'],
        next: 'notify_agent'
      },
      {
        id: 'auto_approve',
        type: NODE_TYPE.ACTION,
        label: 'Auto Approve',
        action: {
          type: ACTION_TYPE.UPDATE_FIELD,
          params: {
            field: 'status',
            value: 'approved'
          }
        },
        next: 'notify_agent'
      },
      {
        id: 'notify_agent',
        type: NODE_TYPE.NOTIFICATION,
        label: 'Notify Agent',
        action: {
          type: ACTION_TYPE.SEND_EMAIL,
          params: {
            to: '{{agent.email}}',
            template: 'lead_approved'
          }
        },
        next: 'end'
      },
      {
        id: 'end',
        type: NODE_TYPE.END
      }
    ]
  },
  policyRenewal: {
    name: 'Policy Renewal Reminder',
    description: 'Automated renewal reminders before expiry',
    trigger: TRIGGER_TYPE.SCHEDULED,
    nodes: [
      { id: '1', type: NODE_TYPE.START, next: '2' },
      { id: '2', type: NODE_TYPE.ACTION, action: { type: ACTION_TYPE.SEND_EMAIL, params: { template: 'renewal_notice_1' } }, next: '3' },
      { id: '3', type: NODE_TYPE.DELAY, config: { duration: '7d' }, next: '4' },
      { id: '4', type: NODE_TYPE.ACTION, action: { type: ACTION_TYPE.SEND_SMS, params: { template: 'renewal_sms' } }, next: '5' },
      { id: '5', type: NODE_TYPE.END }
    ]
  }
};

// --- Helper Functions ---

const getStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return [];
  }
};

const setStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
};

const generateId = () => {
  return 'wf_' + Math.random().toString(36).substr(2, 9);
};

export const validateWorkflow = (workflow) => {
  const errors = [];
  if (!workflow.name) errors.push('Name is required');

  const nodes = workflow.nodes || [];
  if (nodes.length === 0) {
    errors.push('Workflow must have at least one node');
  }

  const startNode = nodes.find(n => n.type === NODE_TYPE.START);
  if (!startNode) errors.push('Start node is missing');

  const endNode = nodes.find(n => n.type === NODE_TYPE.END);
  if (!endNode) errors.push('End node is missing');

  return { valid: errors.length === 0, errors };
};


// --- Service Functions (Mocking Async API) ---

const listWorkflows = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return getStorage(STORAGE_KEYS.WORKFLOWS);
};

const createWorkflow = async (workflowData) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const workflows = getStorage(STORAGE_KEYS.WORKFLOWS);

  // Default nodes if none provided
  const defaultNodes = [
    { id: 'start', type: NODE_TYPE.START, label: 'Start' },
    { id: 'end', type: NODE_TYPE.END, label: 'End' }
  ];

  const newWorkflow = {
    id: generateId(),
    ...workflowData,
    status: WORKFLOW_STATUS.DRAFT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: workflowData.nodes && workflowData.nodes.length > 0 ? workflowData.nodes : defaultNodes,
    executionCount: 0
  };

  workflows.unshift(newWorkflow); // Add to beginning
  setStorage(STORAGE_KEYS.WORKFLOWS, workflows);

  return newWorkflow;
};

const updateWorkflow = async (id, workflowData) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const workflows = getStorage(STORAGE_KEYS.WORKFLOWS);
  const index = workflows.findIndex(w => w.id === id);

  if (index === -1) throw new Error('Workflow not found');

  const updatedWorkflow = {
    ...workflows[index],
    ...workflowData,
    updatedAt: new Date().toISOString()
  };

  workflows[index] = updatedWorkflow;
  setStorage(STORAGE_KEYS.WORKFLOWS, workflows);

  return updatedWorkflow;
};

const deleteWorkflow = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  let workflows = getStorage(STORAGE_KEYS.WORKFLOWS);
  workflows = workflows.filter(w => w.id !== id);
  setStorage(STORAGE_KEYS.WORKFLOWS, workflows);

  return { success: true };
};

const getWorkflow = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const workflows = getStorage(STORAGE_KEYS.WORKFLOWS);
  return workflows.find(w => w.id === id);
};

const getWorkflowExecutions = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const executions = getStorage(STORAGE_KEYS.EXECUTIONS);
  return executions.filter(e => e.workflowId === id);
};

const runWorkflow = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const workflow = await getWorkflow(id);
  if (!workflow) throw new Error('Workflow not found');

  const execution = {
    id: 'exec_' + Math.random().toString(36).substr(2, 9),
    workflowId: id,
    workflowName: workflow.name,
    status: 'completed', // Mock success
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    data: data,
    result: {
      executionLog: [
        { step: 'Start', status: 'success', message: 'Workflow started' },
        { step: 'Process', status: 'success', message: 'Processed data: ' + JSON.stringify(data).substring(0, 50) + '...' },
        { step: 'End', status: 'success', message: 'Workflow completed successfully' }
      ]
    }
  };

  const executions = getStorage(STORAGE_KEYS.EXECUTIONS);
  executions.unshift(execution);
  setStorage(STORAGE_KEYS.EXECUTIONS, executions);

  // Update stats on workflow
  workflow.executionCount = (workflow.executionCount || 0) + 1;
  await updateWorkflow(id, { executionCount: workflow.executionCount });

  return { execution };
};

const addStep = async (id, stepData) => {
  // Not strictly needed if using updateWorkflow, but keeping signature
  const workflow = await getWorkflow(id);
  const nodes = workflow.nodes || [];
  nodes.push(stepData);
  return updateWorkflow(id, { nodes });
};

const activateWorkflow = async (id) => {
  const workflow = await getWorkflow(id);
  const validation = validateWorkflow(workflow);
  if (!validation.valid) throw new Error(validation.errors.join(', '));

  return updateWorkflow(id, { status: WORKFLOW_STATUS.ACTIVE });
};

const pauseWorkflow = async (id) => {
  return updateWorkflow(id, { status: WORKFLOW_STATUS.PAUSED });
};

const getStats = async () => {
  const workflows = getStorage(STORAGE_KEYS.WORKFLOWS);
  const executions = getStorage(STORAGE_KEYS.EXECUTIONS);

  return {
    total: executions.length,
    successful: executions.filter(e => e.status === 'completed').length,
    failed: executions.filter(e => e.status === 'failed').length,
    pending: executions.filter(e => e.status === 'running').length,
    byWorkflow: {} // Simplified mock
  };
};

const cloneTemplate = async (templateData) => {
  return createWorkflow(templateData);
};

export const workflowService = {
  listWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getWorkflow,
  getWorkflowExecutions,
  runWorkflow,
  addStep,
  activateWorkflow,
  pauseWorkflow,
  getStats,
  cloneTemplate,
  validateWorkflow
};

export default workflowService;
