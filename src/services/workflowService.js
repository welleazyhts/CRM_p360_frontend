/**
 * Workflow Engine Service
 *
 * General-purpose workflow builder and execution engine for:
 * - Approval workflows
 * - Multi-step processes
 * - Automated actions
 * - Conditional logic
 * - Parallel and sequential execution
 */

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
 * Evaluate condition
 */
export const evaluateCondition = (condition, data) => {
  const fieldValue = getNestedValue(data, condition.field);
  const compareValue = condition.value;

  switch (condition.operator) {
    case CONDITION_OPERATOR.EQUALS:
      return fieldValue == compareValue;
    case CONDITION_OPERATOR.NOT_EQUALS:
      return fieldValue != compareValue;
    case CONDITION_OPERATOR.GREATER_THAN:
      return Number(fieldValue) > Number(compareValue);
    case CONDITION_OPERATOR.LESS_THAN:
      return Number(fieldValue) < Number(compareValue);
    case CONDITION_OPERATOR.CONTAINS:
      return String(fieldValue).includes(String(compareValue));
    case CONDITION_OPERATOR.IS_EMPTY:
      return !fieldValue || fieldValue === '';
    case CONDITION_OPERATOR.IS_NOT_EMPTY:
      return fieldValue && fieldValue !== '';
    default:
      return false;
  }
};

/**
 * Get nested value from object
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
};

/**
 * Replace template variables
 */
export const replaceTemplateVariables = (template, data) => {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    return getNestedValue(data, path.trim()) || match;
  });
};

/**
 * Execute workflow action
 */
export const executeAction = async (action, data, context = {}) => {
  const { type, params } = action;

  // Replace template variables in params
  const processedParams = {};
  for (const [key, value] of Object.entries(params || {})) {
    if (typeof value === 'string') {
      processedParams[key] = replaceTemplateVariables(value, data);
    } else {
      processedParams[key] = value;
    }
  }

  switch (type) {
    case ACTION_TYPE.SEND_EMAIL:
      // In real implementation, call email service
      console.log('Sending email:', processedParams);
      return { success: true, action: 'email_sent', params: processedParams };

    case ACTION_TYPE.SEND_SMS:
      console.log('Sending SMS:', processedParams);
      return { success: true, action: 'sms_sent', params: processedParams };

    case ACTION_TYPE.SEND_WHATSAPP:
      console.log('Sending WhatsApp:', processedParams);
      return { success: true, action: 'whatsapp_sent', params: processedParams };

    case ACTION_TYPE.CREATE_TASK:
      console.log('Creating task:', processedParams);
      // In real implementation, call task creation service
      return { success: true, action: 'task_created', params: processedParams };

    case ACTION_TYPE.UPDATE_FIELD:
      console.log('Updating field:', processedParams);
      return { success: true, action: 'field_updated', params: processedParams };

    case ACTION_TYPE.WEBHOOK:
      console.log('Calling webhook:', processedParams);
      // In real implementation, make HTTP request
      return { success: true, action: 'webhook_called', params: processedParams };

    case ACTION_TYPE.ASSIGN_TO:
      console.log('Assigning to:', processedParams);
      return { success: true, action: 'assigned', params: processedParams };

    default:
      return { success: false, error: `Unknown action type: ${type}` };
  }
};

/**
 * Execute workflow
 */
export const executeWorkflow = async (workflow, data, context = {}) => {
  const { nodes } = workflow;
  const executionLog = [];
  let currentNodeId = 'start';
  let maxSteps = 100; // Prevent infinite loops

  while (currentNodeId && maxSteps > 0) {
    const node = nodes.find(n => n.id === currentNodeId);
    if (!node) {
      executionLog.push({
        nodeId: currentNodeId,
        error: 'Node not found',
        timestamp: new Date().toISOString()
      });
      break;
    }

    const logEntry = {
      nodeId: currentNodeId,
      type: node.type,
      label: node.label,
      timestamp: new Date().toISOString()
    };

    try {
      switch (node.type) {
        case NODE_TYPE.START:
          logEntry.result = 'Started';
          currentNodeId = node.next;
          break;

        case NODE_TYPE.CONDITION:
          const conditionResult = evaluateCondition(node.condition, data);
          logEntry.result = conditionResult ? 'True' : 'False';
          currentNodeId = conditionResult ? node.trueNext : node.falseNext;
          break;

        case NODE_TYPE.ACTION:
        case NODE_TYPE.NOTIFICATION:
          const actionResult = await executeAction(node.action, data, context);
          logEntry.result = actionResult;
          currentNodeId = node.next;
          break;

        case NODE_TYPE.APPROVAL:
          // In real implementation, wait for approval
          logEntry.result = 'Approval pending';
          logEntry.pending = true;
          currentNodeId = null; // Stop execution, wait for approval
          break;

        case NODE_TYPE.DELAY:
          logEntry.result = `Delayed for ${node.duration}`;
          currentNodeId = node.next;
          break;

        case NODE_TYPE.END:
          logEntry.result = 'Completed';
          currentNodeId = null;
          break;

        default:
          logEntry.error = `Unknown node type: ${node.type}`;
          currentNodeId = null;
      }
    } catch (error) {
      logEntry.error = error.message;
      currentNodeId = null; // Stop on error
    }

    executionLog.push(logEntry);
    maxSteps--;
  }

  return {
    success: maxSteps > 0,
    executionLog,
    status: currentNodeId === null ? WORKFLOW_STATUS.COMPLETED : WORKFLOW_STATUS.PAUSED
  };
};

/**
 * Validate workflow
 */
export const validateWorkflow = (workflow) => {
  const errors = [];
  const { nodes } = workflow;

  // Check for start node
  if (!nodes.find(n => n.type === NODE_TYPE.START)) {
    errors.push('Workflow must have a START node');
  }

  // Check for end node
  if (!nodes.find(n => n.type === NODE_TYPE.END)) {
    errors.push('Workflow must have an END node');
  }

  // Check for orphaned nodes
  const reachableNodes = new Set(['start']);
  const queue = ['start'];

  while (queue.length > 0) {
    const currentId = queue.shift();
    const node = nodes.find(n => n.id === currentId);

    if (node) {
      if (node.next) {
        reachableNodes.add(node.next);
        queue.push(node.next);
      }
      if (node.trueNext) {
        reachableNodes.add(node.trueNext);
        queue.push(node.trueNext);
      }
      if (node.falseNext) {
        reachableNodes.add(node.falseNext);
        queue.push(node.falseNext);
      }
    }
  }

  const orphanedNodes = nodes.filter(n => !reachableNodes.has(n.id));
  if (orphanedNodes.length > 0) {
    errors.push(`Orphaned nodes: ${orphanedNodes.map(n => n.id).join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export default {
  WORKFLOW_STATUS,
  NODE_TYPE,
  ACTION_TYPE,
  CONDITION_OPERATOR,
  TRIGGER_TYPE,
  WORKFLOW_TEMPLATES,
  evaluateCondition,
  replaceTemplateVariables,
  executeAction,
  executeWorkflow,
  validateWorkflow
};
