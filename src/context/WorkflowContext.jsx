import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import workflowService, {
  WORKFLOW_STATUS,
  NODE_TYPE,
  TRIGGER_TYPE,
  WORKFLOW_TEMPLATES,
  validateWorkflow
} from '../services/workflowBuilderService';

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
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0, pending: 0, byWorkflow: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      const response = await workflowService.listWorkflows();
      // Adjust handling based on exact API response structure
      let list = [];

      console.log('Workflow list raw response:', response);

      if (Array.isArray(response)) {
        list = response;
      } else if (response && Array.isArray(response.data)) {
        list = response.data;
      } else if (response && Array.isArray(response.workflows)) {
        list = response.workflows;
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.results)) list = response.results;
      }

      // Normalize IDs
      const normalizedList = list.map(item => ({
        ...item,
        id: item.id || item._id || item.pk || item.uuid || item.workflow_id
      }));

      console.log('Normalized workflows:', normalizedList);
      setWorkflows(normalizedList);
    } catch (err) {
      console.error('Fetch workflows error', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch stats (separate to not block main list)
   */
  const fetchStats = useCallback(async () => {
    try {
      await workflowService.getStats();
    } catch (e) {
      console.warn('Stats fetch failed', e);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchWorkflows();
    fetchStats();
  }, [fetchWorkflows, fetchStats]);

  /**
   * Create new workflow
   */
  const createWorkflow = useCallback(async (workflowData) => {
    setLoading(true);
    try {
      const response = await workflowService.createWorkflow(workflowData);

      // Handle the API response structure to find the created workflow
      let newWorkflow = null;
      console.log('Create workflow raw response:', response);

      if (response) {
        // Check deeper first
        if (response.data && (response.data.id || response.data.name)) {
          newWorkflow = response.data;
        } else if (response.workflow && (response.workflow.id || response.workflow.name)) {
          newWorkflow = response.workflow;
        } else if (response.id || response.name) {
          // Root object looks like a workflow
          newWorkflow = response;
        } else {
          // Fallback: assume the response itself is the object if it has any keys
          newWorkflow = response;
        }
      }

      // Optimistically update local state if we found a workflow object
      if (newWorkflow) {
        // Normalize ID
        newWorkflow.id = newWorkflow.id || newWorkflow._id || newWorkflow.pk || newWorkflow.uuid;

        setWorkflows(prev => {
          if (newWorkflow.id && prev.some(w => w.id === newWorkflow.id)) return prev;
          return [newWorkflow, ...prev];
        });
      }

      // Refresh list from server to ensure full consistency
      await fetchWorkflows();
    } catch (err) {
      console.error('Create workflow error', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkflows]);

  /**
   * Create workflow from template
   */
  const createFromTemplate = useCallback(async (templateKey) => {
    const template = WORKFLOW_TEMPLATES[templateKey];
    if (!template) {
      throw new Error(`Template ${templateKey} not found`);
    }

    setLoading(true);
    try {
      // Construct payload for clone if needed or just pass template data
      try {
        await workflowService.cloneTemplate({ template: templateKey, ...template });
      } catch (cloneErr) {
        console.warn('Clone failed, falling back to create', cloneErr);
        await workflowService.createWorkflow(template);
      }
      await fetchWorkflows();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchWorkflows]); // Changed dependency from createWorkflow to fetchWorkflows

  /**
   * Update workflow
   */
  const updateWorkflow = useCallback(async (id, data) => {
    setLoading(true);
    try {
      await workflowService.updateWorkflow(id, data);

      // Update local state
      setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...data } : w));

    } catch (err) {
      console.error('Update workflow error', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete workflow
   */
  const deleteWorkflow = useCallback(async (workflowId) => {
    if (!workflowId) return;

    setLoading(true);
    try {
      await workflowService.deleteWorkflow(workflowId);
      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    } catch (err) {
      console.error('Delete failed', err);
      setError(err.message);
      // If delete failed, maybe we are out of sync, try to fetch?
      fetchWorkflows();
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkflows]);

  /**
   * Activate workflow
   */
  const activateWorkflow = useCallback(async (workflowId) => {
    const workflow = workflows.find(wf => wf.id === workflowId);
    if (!workflow) return { success: false, error: 'Workflow not found' };

    // Validate before activating
    const validation = validateWorkflow(workflow);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    try {
      await workflowService.activateWorkflow(workflowId);

      // Update local status directly
      setWorkflows(prev => prev.map(w =>
        w.id === workflowId ? { ...w, status: WORKFLOW_STATUS.ACTIVE } : w
      ));

      return { success: true };
    } catch (err) {
      console.error('Activate failed', err);
      return { success: false, error: err.message };
    }
  }, [workflows]);

  /**
   * Pause workflow
   */
  const pauseWorkflow = useCallback(async (workflowId) => {
    try {
      await workflowService.pauseWorkflow(workflowId);

      // Update local status directly
      setWorkflows(prev => prev.map(w =>
        w.id === workflowId ? { ...w, status: WORKFLOW_STATUS.PAUSED } : w
      ));

    } catch (err) {
      console.error('Pause failed', err);
      setError(err.message);
    }
  }, []);

  /**
   * Execute workflow
   */
  const runWorkflow = useCallback(async (workflowId, data, context = {}) => {
    // Note: context might be unused if backend handles everything
    try {
      const response = await workflowService.runWorkflow(workflowId, data);

      // Refresh stats or executions list
      try {
        // Optimistically add execution if response contains it
        if (response.execution) {
          setExecutions(prev => [response.execution, ...prev]);
        } else {
          // otherwise fetch fresh executions
          loadWorkflowExecutions(workflowId);
          // Stats update
          fetchStats();
        }
      } catch (e) {
        console.warn('Background refresh failed', e);
      }

      return { success: true, result: response };
    } catch (err) {
      console.error('Execution failed', err);
      return { success: false, error: err.message };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
   * This now actually fetches from backend if needed or filters local if we decide to cache all.
   * Given potentially large history, better to fetch on demand or return promise.
   * However, to keep signature similar to before (synchronous return), we stick to returning what we have,
   * but we should add a separate "fetchExecutions" method or useEffect in the UI.
   * 
   * Updated approach: Return local, but provide method to load.
   */
  const getWorkflowExecutions = useCallback((workflowId) => {
    return executions.filter(exec => exec.workflowId === workflowId);
  }, [executions]);

  /**
   * Fetch executions for a specific workflow (to be called by UI when viewing details)
   */
  const loadWorkflowExecutions = useCallback(async (workflowId) => {
    try {
      const data = await workflowService.getWorkflowExecutions(workflowId);
      const list = Array.isArray(data) ? data : (data.results || []);
      // We can either merge this into global executions or just return it. 
      // Merging allows "getWorkflowExecutions" to work offline-ish.
      setExecutions(prev => {
        // Remove existing for this workflow to avoid dups, then add new
        const others = prev.filter(e => e.workflowId !== workflowId);
        return [...list, ...others].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
      });
      return list;
    } catch (err) {
      console.error('Failed to load executions', err);
      return [];
    }
  }, []);


  /**
   * Get execution statistics
   */
  const getExecutionStats = useCallback(() => {
    return stats;
  }, [stats]);

  /**
   * Clear old executions
   * Not applicable for backend usually, unless we have a cleanup endpoint. 
   * We will leave it as a no-op or implementation of local cleanup if needed.
   */
  const clearExecutions = useCallback((daysOld = 30) => {
    // Optional: Call a backend cleanup endpoint
  }, []);

  const value = {
    // State
    workflows,
    executions,
    loading,
    error,
    stats,

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
    loadWorkflowExecutions,
    getExecutionStats,
    clearExecutions,
    refreshWorkflows: fetchWorkflows,
    refreshStats: fetchStats,

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
