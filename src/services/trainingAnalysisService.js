import api from './api';

const BASE_PATH = '/training_management/training-modules';

/**
 * Training Management Service
 * Handles all API calls for Training and Management module
 */

// Helper to transform API response if needed or map fields
const toApiPayload = (data) => {
    // Map dropdown values to backend enums
    const categoryMap = {
        'Soft Skills': 'soft_skills',
        'Technical': 'technical',
        'Product Knowledge': 'product_knowledge',
        'Compliance': 'compliance',
        'Process Training': 'process_training',
        'Portal Training': 'portal_training'
    };

    const difficultyMap = {
        'Beginner': 'beginner',
        'Intermediate': 'intermediate',
        'Advanced': 'advanced'
    };

    return {
        ...data,
        module_title: data.title || data.module_title,
        category: categoryMap[data.category] || data.category,
        level: difficultyMap[data.level || data.difficulty] || data.level || data.difficulty,
        duration: data.duration,
        passing_score: data.passingScore || data.passing_score,
        // Ensure other fields are passed correctly
    };
};

/**
 * List all training modules
 * GET /api/training_management/training-modules/
 */
export const getTrainingModules = async () => {
    try {
        const response = await api.get(`${BASE_PATH}/`);
        // Return results directly or data if already array/results
        return response.data;
    } catch (error) {
        console.error('Error fetching training modules:', error);
        throw error;
    }
};

/**
 * Create a new training module
 * POST /api/training_management/training-modules/
 */
export const createTrainingModule = async (moduleData) => {
    try {
        const payload = {
            module_title: moduleData.title,
            category: moduleData.category?.toLowerCase().replace(' ', '_'), // e.g. "Portal Training" -> "portal_training"
            level: moduleData.level,
            duration: moduleData.duration,
            passing_score: moduleData.passingScore,
            description: moduleData.description,
            status: moduleData.status,
            topics_covered: moduleData.topics_covered || [], // Assuming array of strings
            completion_rate: moduleData.completionRate || 0
        };
        const response = await api.post(`${BASE_PATH}/`, payload);
        return response.data;
    } catch (error) {
        console.error('Error creating training module:', error);
        throw error;
    }
};

/**
 * Update a training module
 * PUT /api/training_management/training-modules/{id}/
 */
export const updateTrainingModule = async (moduleId, updates) => {
    try {
        // Construct payload specifically matching update_module request
        const payload = {
            module_title: updates.title || updates.module_title,
            category: updates.category?.toLowerCase().replace(' ', '_'),
            level: updates.level,
            duration: updates.duration,
            description: updates.description,
            passing_score: updates.passingScore || updates.passing_score,
            status: updates.status,
            topics_covered: updates.topics || updates.topics_covered || []
        };
        const response = await api.put(`${BASE_PATH}/${moduleId}/`, payload);
        return response.data;
    } catch (error) {
        console.error(`Error updating training module ${moduleId}:`, error);
        throw error;
    }
};

/**
 * Delete a training module
 * DELETE /api/training_management/training-modules/{id}/
 */
export const deleteTrainingModule = async (moduleId) => {
    try {
        const response = await api.delete(`${BASE_PATH}/${moduleId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting training module ${moduleId}:`, error);
        throw error;
    }
};

/**
 * Enroll Agent
 * POST /api/training_management/training-modules/{id}/enroll/
 */
export const enrollAgent = async (moduleId, enrollmentData) => {
    try {
        const payload = {
            agent_id: enrollmentData.agentId,
            agent_name: enrollmentData.agentName,
            department: enrollmentData.department,
            modules_completed: enrollmentData.modulesCompleted,
            modules_total: enrollmentData.modulesTotal,
            hours_completed: enrollmentData.hoursCompleted,
            hours_target: enrollmentData.hoursTarget,
            score: enrollmentData.score,
            progress: enrollmentData.progress,
            certificates: enrollmentData.certificates,
            completed: enrollmentData.completed,
            last_activity: enrollmentData.lastActivity
        };
        const response = await api.post(`${BASE_PATH}/${moduleId}/enroll/`, payload);
        return response.data;
    } catch (error) {
        console.error('Error enrolling agent:', error);
        throw error;
    }
};

// Alias for compatibility
export const enrollEmployee = enrollAgent;

/**
 * Add Document
 * POST /api/training_management/training-modules/{id}/documents/add/
 */
export const uploadDocument = async (moduleId, documentData) => {
    try {
        const payload = {
            name: documentData.name,
            file_path: documentData.filePath || `training_docs/${documentData.name}`, // Fallback if backend handles storage path
            type: documentData.type,
            size: documentData.size
        };
        const response = await api.post(`${BASE_PATH}/${moduleId}/documents/add/`, payload);
        return response.data;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

/**
 * Add Assessment
 * POST /api/training_management/training-modules/{id}/assessments/add/
 */
export const addAssessment = async (moduleId, assessmentData) => {
    try {
        const payload = {
            title: assessmentData.title,
            total_marks: assessmentData.totalMarks,
            passing_marks: assessmentData.passingMarks
        };
        const response = await api.post(`${BASE_PATH}/${moduleId}/assessments/add/`, payload);
        return response.data;
    } catch (error) {
        console.error('Error adding assessment:', error);
        throw error;
    }
};

/**
 * Get Training Module Stats
 * GET /api/training_management/training-modules/training-modules-stats/
 */
export const getTrainingStats = async () => {
    try {
        const response = await api.get(`${BASE_PATH}/training-modules-stats/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        throw error;
    }
};
export const getTrainingAnalytics = getTrainingStats;

/**
 * Get Analytics Overview
 * GET /api/training_management/training-modules/analytics-overview/
 */
export const getAnalyticsOverview = async () => {
    try {
        const response = await api.get(`${BASE_PATH}/analytics-overview/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching analytics overview:', error);
        throw error;
    }
};

/**
 * Get Agent Training Progress
 * GET /api/training_management/training-modules/agent-training-progress/
 */
export const getAgentProgress = async () => {
    try {
        const response = await api.get(`${BASE_PATH}/agent-training-progress/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching agent progress:', error);
        throw error;
    }
};

/**
 * Start Module (Process Training)
 * POST /api/training_management/training-modules/{id}/process-training/start-module/
 */
export const startProcessModule = async (moduleId) => {
    try {
        const response = await api.post(`${BASE_PATH}/${moduleId}/process-training/start-module/`);
        return response.data;
    } catch (error) {
        console.error('Error starting process module:', error);
        throw error;
    }
};

/**
 * Start Module (Portal Training)
 * POST /api/training_management/training-modules/{id}/portal-training/start-module/
 */
export const startPortalModule = async (moduleId) => {
    try {
        const response = await api.post(`${BASE_PATH}/${moduleId}/portal-training/start-module/`);
        return response.data;
    } catch (error) {
        console.error('Error starting portal module:', error);
        throw error;
    }
};

/**
 * View Detail (Process Training)
 * GET /api/training_management/training-modules/{id}/process-training/view-details/
 */
export const getProcessModuleDetails = async (moduleId) => {
    try {
        const response = await api.get(`${BASE_PATH}/${moduleId}/process-training/view-details/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching process module details:', error);
        throw error;
    }
};

/**
 * View Detail (Portal Training)
 * GET /api/training_management/training-modules/{id}/portal-training/view-details/
 * (Assuming similar structure based on 'portal-training' request name in collection)
 */
export const getPortalModuleDetails = async (moduleId) => {
    try {
        const response = await api.get(`${BASE_PATH}/${moduleId}/portal-training/view-details/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching portal module details:', error);
        throw error;
    }
};

/**
 * Delete Document - NOT IN POSTMAN COLLECTION explicitly, but good to have placeholder or implementation guess.
 * Since DELETE module exists, maybe DELETE document exists at .../documents/{docId}/?
 * Keeping placeholder for now or omit if strict.
 */
export const deleteDocument = async (moduleId, documentId) => {
    try {
        // Guessing the endpoint structure based on common patterns
        const response = await api.delete(`${BASE_PATH}/${moduleId}/documents/${documentId}/`);
        return response.data;
    } catch (error) {
        console.warn('deleteDocument API might not exist or failed:', error);
        // Fallback: throw error so UI knows it failed
        throw error;
    }
};

export const getTrainingRecords = async () => {
    // This seems to be covered by getAgentProgress or similar.
    // Keeping backward compatibility returning empty list or fetching progress.
    return [];
};


export default {
    getTrainingModules,
    createTrainingModule,
    updateTrainingModule,
    deleteTrainingModule,
    enrollAgent,
    enrollEmployee,
    uploadDocument,
    addAssessment,
    getTrainingStats,
    getTrainingAnalytics,
    getAnalyticsOverview,
    getAgentProgress,
    startProcessModule,
    startPortalModule,
    getProcessModuleDetails,
    getPortalModuleDetails,
    deleteDocument,
    getTrainingRecords
};
