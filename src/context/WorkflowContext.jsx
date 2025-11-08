import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WORKFLOW_STATUS,
  NODE_TYPE,
  TRIGGER_TYPE,
  WORKFLOW_TEMPLATES,
  executeWorkflow,
  validateWorkflow
} from '../services/workflowService';

const WorkflowContext = createContext();

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return context;
};

export const WorkflowProvider = ({ children }) => {
  // Workflows state
  const [workflows, setWorkflows] = useState(() => {
    const saved = localStorage.getItem('workflows');
    return saved ? JSON.parse(saved) : [];
  });

  // Workflow executions
  const [executions, setExecutions] = useState(() => {
    const saved = localStorage.getItem('workflowExecutions');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('workflowExecutions', JSON.stringify(executions));
  }, [executions]);

  /**
   * Create workflow
   */
  const createWorkflow = useCallback((workflowData) => {
    const newWorkflow = {
      id: `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: workflowData.name || 'Untitled Workflow',
      description: workflowData.description || '',
      trigger: workflowData.trigger || TRIGGER_TYPE.MANUAL,
      status: WORKFLOW_STATUS.DRAFT,
      nodes: workflowData.nodes || [
        { id: 'start', type: NODE_TYPE.START, next: 'end' },
        { id: 'end', type: NODE_TYPE.END }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...workflowData
    };

    setWorkflows(prev => [newWorkflow, ...prev]);
    return newWorkflow;
  }, []);

  /**
   * Create workflow from template
   */
  const createFromTemplate = useCallback((templateKey) => {
    const template = WORKFLOW_TEMPLATES[templateKey];
    if (!template) {
      throw new Error(`Template ${templateKey} not found`);
    }

    return createWorkflow(template);
  }, [createWorkflow]);

  /**
   * Update workflow
   */
  const updateWorkflow = useCallback((workflowId, updates) => {
    setWorkflows(prev => prev.map(wf =>
      wf.id === workflowId
        ? { ...wf, ...updates, updatedAt: new Date().toISOString() }
        : wf
    ));
  }, []);

  /**
   * Delete workflow
   */
  const deleteWorkflow = useCallback((workflowId) => {
    setWorkflows(prev => prev.filter(wf => wf.id !== workflowId));
  }, []);

  /**
   * Activate workflow
   */
  const activateWorkflow = useCallback((workflowId) => {
    const workflow = workflows.find(wf => wf.id === workflowId);
    if (!workflow) return { success: false, error: 'Workflow not found' };

    // Validate before activating
    const validation = validateWorkflow(workflow);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    updateWorkflow(workflowId, { status: WORKFLOW_STATUS.ACTIVE });
    return { success: true };
  }, [workflows, updateWorkflow]);

  /**
   * Pause workflow
   */
  const pauseWorkflow = useCallback((workflowId) => {
    updateWorkflow(workflowId, { status: WORKFLOW_STATUS.PAUSED });
  }, [updateWorkflow]);

  /**
   * Execute workflow
   */
  const runWorkflow = useCallback(async (workflowId, data, context = {}) => {
    const workflow = workflows.find(wf => wf.id === workflowId);
    if (!workflow) {
      return { success: false, error: 'Workflow not found' };
    }

    if (workflow.status !== WORKFLOW_STATUS.ACTIVE && workflow.status !== WORKFLOW_STATUS.DRAFT) {
      return { success: false, error: 'Workflow is not active' };
    }

    // Execute
    const result = await executeWorkflow(workflow, data, context);

    // Save execution
    const execution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      workflowName: workflow.name,
      data,
      result,
      startedAt: new Date().toISOString(),
      completedAt: result.status === WORKFLOW_STATUS.COMPLETED ? new Date().toISOString() : null,
      status: result.status
    };

    setExecutions(prev => [execution, ...prev].slice(0, 1000)); // Keep last 1000

    return { success: result.success, execution };
  }, [workflows]);

  /**
   * Get workflow by ID
   */
  const getWorkflow = useCallback((workflowId) => {
    return workflows.find(wf => wf.id === workflowId);
  }, [workflows]);

  /**
   * Get active workflows
   */
  const getActiveWorkflows = useCallback(() => {
    return workflows.filter(wf => wf.status === WORKFLOW_STATUS.ACTIVE);
  }, [workflows]);

  /**
   * Get executions for workflow
   */
  const getWorkflowExecutions = useCallback((workflowId) => {
    return executions.filter(exec => exec.workflowId === workflowId);
  }, [executions]);

  /**
   * Get execution statistics
   */
  const getExecutionStats = useCallback(() => {
    const stats = {
      total: executions.length,
      successful: 0,
      failed: 0,
      pending: 0,
      byWorkflow: {}
    };

    executions.forEach(exec => {
      if (exec.status === WORKFLOW_STATUS.COMPLETED) stats.successful++;
      else if (exec.status === WORKFLOW_STATUS.FAILED) stats.failed++;
      else stats.pending++;

      if (!stats.byWorkflow[exec.workflowId]) {
        stats.byWorkflow[exec.workflowId] = {
          workflowName: exec.workflowName,
          count: 0
        };
      }
      stats.byWorkflow[exec.workflowId].count++;
    });

    return stats;
  }, [executions]);

  /**
   * Clear old executions
   */
  const clearExecutions = useCallback((daysOld = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    setExecutions(prev => prev.filter(exec =>
      new Date(exec.startedAt) > cutoffDate
    ));
  }, []);

  const value = {
    // State
    workflows,
    executions,

    // Workflow Operations
    createWorkflow,
    createFromTemplate,
    updateWorkflow,
    deleteWorkflow,
    activateWorkflow,
    pauseWorkflow,
    getWorkflow,
    getActiveWorkflows,

    // Execution Operations
    runWorkflow,
    getWorkflowExecutions,
    getExecutionStats,
    clearExecutions,

    // Constants
    WORKFLOW_STATUS,
    NODE_TYPE,
    TRIGGER_TYPE,
    WORKFLOW_TEMPLATES
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowContext;
