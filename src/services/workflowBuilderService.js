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

const getUserId = () => {
    try {
        // 1. Try "user" object from storage
        const userStr = localStorage.getItem('user') || localStorage.getItem('userInfo');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.id || user.user_id) return user.id || user.user_id;
        }

        // 2. Try "user_id" directly
        const directId = localStorage.getItem('user_id');
        if (directId) return directId;

        // 3. Try to decode JWT from authToken
        const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.user_id || payload.id || payload.sub;
        }

        return null;
    } catch (e) {
        console.warn('Error retrieving user ID', e);
        return null;
    }
};

export const validateWorkflow = (workflow) => {
    const errors = [];
    if (!workflow.name) errors.push('Name is required');

    // If nodes is undefined, we might be looking at a summary object (from list).
    // In that case, we shouldn't block validation locally; let the backend decide.
    if (workflow.nodes === undefined) {
        return { valid: true, errors: [] };
    }

    const nodes = workflow.nodes || [];
    if (nodes.length === 0) {
        errors.push('Workflow must have at least one node');
        return { valid: false, errors };
    }

    // Case-insensitive check for start/end nodes
    const hasStart = nodes.some(n => n.type?.toLowerCase() === NODE_TYPE.START.toLowerCase());
    if (!hasStart) errors.push('Start node is missing');

    const hasEnd = nodes.some(n => n.type?.toLowerCase() === NODE_TYPE.END.toLowerCase());
    if (!hasEnd) errors.push('End node is missing');

    return { valid: errors.length === 0, errors };
};


// --- API Functions (Matching Postman Collection) ---

const listWorkflows = async () => {
    const userId = getUserId();
    console.log('Fetching workflows for user ID:', userId);

    try {
        if (userId) {
            // GET /api/workflow_builder/list/:userId/
            const response = await api.get(`/workflow_builder/list/${userId}/`);
            return response.data;
        }
    } catch (error) {
        console.warn('User specific list failed, trying generic...', error);
    }

    // Fallback: Generic list
    const response = await api.get('/workflow_builder/list/');
    return response.data;
};

const createWorkflow = async (workflowData) => {
    // POST /api/workflow_builder/create/
    const userId = getUserId();

    // Default nodes if none provided
    const defaultNodes = [
        { id: 'start', type: NODE_TYPE.START, label: 'Start' },
        { id: 'end', type: NODE_TYPE.END, label: 'End' }
    ];

    const payload = {
        ...workflowData,
        nodes: workflowData.nodes && workflowData.nodes.length > 0 ? workflowData.nodes : defaultNodes,
        user: userId, // explicit association
        user_id: userId // try both common keys
    };

    const response = await api.post('/workflow_builder/create/', payload);
    return response.data;
};

const updateWorkflow = async (id, workflowData) => {
    // PUT /api/workflow_builder/update/:id/
    const response = await api.put(`/workflow_builder/update/${id}/`, workflowData);
    return response.data;
};

const deleteWorkflow = async (id) => {
    // DELETE /api/workflow_builder/delete/:id/
    const userId = getUserId();
    const config = { params: { user_id: userId } };

    try {
        const response = await api.delete(`/workflow_builder/delete/${id}/`, config);
        return response.data;
    } catch (error) {
        console.warn('Primary delete endpoint failed, trying fallback...');
        // Fallback: /workflow_builder/:id/ (Standard REST)
        const response = await api.delete(`/workflow_builder/${id}/`, config);
        return response.data;
    }
};

const getWorkflow = async (id) => {
    // GET /api/workflow_builder/workflow-details/:id/
    const response = await api.get(`/workflow_builder/workflow-details/${id}/`);
    return response.data;
};

const getWorkflowExecutions = async (id) => {
    // GET /api/workflow_builder/executions/:id/
    const response = await api.get(`/workflow_builder/executions/${id}/`);
    return response.data;
};

const runWorkflow = async (id, data) => {
    // POST /api/workflow_builder/run-workflow/:id/
    const response = await api.post(`/workflow_builder/run-workflow/${id}/`, data);
    return response.data;
};

const addStep = async (id, stepData) => {
    // POST /api/workflow_builder/add-step/:id/
    const response = await api.post(`/workflow_builder/add-step/${id}/`, stepData);
    return response.data;
};

const activateWorkflow = async (id) => {
    // PATCH /api/workflow_builder/activate/:id/
    const response = await api.patch(`/workflow_builder/activate/${id}/`);
    return response.data;
};

const pauseWorkflow = async (id) => {
    // PATCH /api/workflow_builder/pause/:id/
    const response = await api.patch(`/workflow_builder/pause/${id}/`);
    return response.data;
};

const getStats = async () => {
    // GET /api/workflow_builder/stats/
    const response = await api.get('/workflow_builder/stats/');
    return response.data;
};

const cloneTemplate = async (templateData) => {
    // POST /api/workflow_builder/clone-template/
    const response = await api.post('/workflow_builder/clone-template/', templateData);
    return response.data;
};

export const workflowBuilderService = {
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

export default workflowBuilderService;
