/**
 * Workflow Engine Service
 *
 * Integrated with Backend APIs for Workflow Builder
 */

import { api } from './api';

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
 * Kept for frontend usage, though backend might handle cloning templates
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
      {
        id: 'start',
        type: NODE_TYPE.START,
        next: 'send_reminder'
      },
      {
        id: 'send_reminder',
        type: NODE_TYPE.NOTIFICATION,
        label: 'Send Renewal Reminder',
        action: {
          type: ACTION_TYPE.SEND_EMAIL,
          params: {
            to: '{{customer.email}}',
            template: 'renewal_reminder'
          }
        },
        next: 'create_task'
      },
      {
        id: 'create_task',
        type: NODE_TYPE.ACTION,
        label: 'Create Follow-up Task',
        action: {
          type: ACTION_TYPE.CREATE_TASK,
          params: {
            title: 'Follow up on renewal',
            dueDate: '+7 days',
            assignTo: '{{policy.agent}}'
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
  claimProcessing: {
    name: 'Claim Processing Workflow',
    description: 'Automated claim verification and approval',
    trigger: TRIGGER_TYPE.ON_CREATE,
    nodes: [
      {
        id: 'start',
        type: NODE_TYPE.START,
        next: 'verify_documents'
      },
      {
        id: 'verify_documents',
        type: NODE_TYPE.CONDITION,
        label: 'Verify Documents',
        condition: {
          field: 'documentsComplete',
          operator: CONDITION_OPERATOR.EQUALS,
          value: true
        },
        trueNext: 'check_amount',
        falseNext: 'request_documents'
      },
      {
        id: 'request_documents',
        type: NODE_TYPE.NOTIFICATION,
        label: 'Request Missing Documents',
        action: {
          type: ACTION_TYPE.SEND_EMAIL,
          params: {
            to: '{{customer.email}}',
            template: 'documents_required'
          }
        },
        next: 'end'
      },
      {
        id: 'check_amount',
        type: NODE_TYPE.CONDITION,
        label: 'Check Claim Amount',
        condition: {
          field: 'claimAmount',
          operator: CONDITION_OPERATOR.GREATER_THAN,
          value: 50000
        },
        trueNext: 'senior_approval',
        falseNext: 'auto_process'
      },
      {
        id: 'senior_approval',
        type: NODE_TYPE.APPROVAL,
        label: 'Senior Manager Approval',
        approvers: ['senior_manager'],
        next: 'process_claim'
      },
      {
        id: 'auto_process',
        type: NODE_TYPE.ACTION,
        label: 'Auto Process Claim',
        action: {
          type: ACTION_TYPE.UPDATE_FIELD,
          params: {
            field: 'status',
            value: 'approved'
          }
        },
        next: 'process_claim'
      },
      {
        id: 'process_claim',
        type: NODE_TYPE.ACTION,
        label: 'Process Payment',
        action: {
          type: ACTION_TYPE.WEBHOOK,
          params: {
            url: '/api/payments/process',
            method: 'POST'
          }
        },
        next: 'notify_customer'
      },
      {
        id: 'notify_customer',
        type: NODE_TYPE.NOTIFICATION,
        label: 'Notify Customer',
        action: {
          type: ACTION_TYPE.SEND_EMAIL,
          params: {
            to: '{{customer.email}}',
            template: 'claim_processed'
          }
        },
        next: 'end'
      },
      {
        id: 'end',
        type: NODE_TYPE.END
      }
    ]
  }
};

/**
 * Validate workflow locally before sending
 */
export const validateWorkflow = (workflow) => {
  const errors = [];
  const { nodes } = workflow;

  if (!nodes || nodes.length === 0) {
    return { valid: true, errors: [] }; // Allow empty for drafts
  }

  // Check for start node
  if (!nodes.find(n => n.type === NODE_TYPE.START)) {
    errors.push('Workflow must have a START node');
  }

  // Check for end node
  if (!nodes.find(n => n.type === NODE_TYPE.END)) {
    errors.push('Workflow must have an END node');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// API Calls

const listWorkflows = async () => {
  const response = await api.get('/workflow_builder/list/');
  return response.data;
};

const createWorkflow = async (workflowData) => {
  const response = await api.post('/workflow_builder/create/', workflowData);
  return response.data;
};

const updateWorkflow = async (id, workflowData) => {
  const response = await api.put(`/workflow_builder/update/${id}/`, workflowData);
  return response.data;
};

const deleteWorkflow = async (id) => {
  const response = await api.delete(`/workflow_builder/delete/${id}/`);
  return response.data;
};

const getWorkflow = async (id) => {
  const response = await api.get(`/workflow_builder/workflow-details/${id}/`);
  return response.data;
};

const getWorkflowExecutions = async (id) => {
  const response = await api.get(`/workflow_builder/executions/${id}/`);
  return response.data;
};

const runWorkflow = async (id, data) => {
  const response = await api.post(`/workflow_builder/run-workflow/${id}/`, data);
  return response.data;
};

const addStep = async (id, stepData) => {
  const response = await api.post(`/workflow_builder/add-step/${id}/`, stepData);
  return response.data;
};

const activateWorkflow = async (id) => {
  const response = await api.patch(`/workflow_builder/activate/${id}/`);
  return response.data;
};

const pauseWorkflow = async (id) => {
  const response = await api.patch(`/workflow_builder/pause/${id}/`);
  return response.data;
};

const getStats = async () => {
  const response = await api.get('/workflow_builder/stats/');
  return response.data;
};

const cloneTemplate = async (templateData) => {
  const response = await api.post('/workflow_builder/clone-template/', templateData);
  return response.data;
};

/**
 * Legacy support / Client-side Helper
 * Kept if needed by UI for specialized rendering logic not yet moved to backend,
 * or removed if fully replaced.
 * For now, we rely on backend for execution, so executeWorkflow logic is removed or deprecated.
 * We'll export the API functions.
 */

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
