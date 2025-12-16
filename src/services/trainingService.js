// src/services/trainingService.js
// Training management service: handles API calls for training modules, agent progress, and analytics
// When backend is ready, update API_BASE_URL in .env file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const TRAINING_ENDPOINT = `${API_BASE_URL}/training`;

// Helper function to simulate API delay (remove when using real backend)
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all training modules
 * @returns {Promise<Array>} Array of training module objects
 */
export const getTrainingModules = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ENDPOINT}/modules`);
        // if (!response.ok) throw new Error('Failed to fetch training modules');
        // return await response.json();

        // Mock data for now
        await simulateDelay();
        return [
            {
                id: 1,
                title: 'Insurance Products Deep Dive',
                category: 'Product Knowledge',
                level: 'Advanced',
                duration: '4 hours',
                enrolledAgents: 15,
                completionRate: 87,
                documents: [
                    { id: 1, name: 'Health Insurance Guide.pdf', type: 'pdf', size: '2.5 MB', uploadDate: '2025-01-05' },
                    { id: 2, name: 'Product Overview Video.mp4', type: 'video', size: '45 MB', uploadDate: '2025-01-05' },
                    { id: 3, name: 'Policy Terms.docx', type: 'doc', size: '1.2 MB', uploadDate: '2025-01-06' },
                ],
                assessments: 3,
                passingScore: 80,
                createdBy: 'Admin',
                createdDate: '2025-01-05',
                status: 'Active',
                description: 'Comprehensive training on all insurance products including health, life, and motor insurance',
            },
            {
                id: 2,
                title: 'Customer Communication Skills',
                category: 'Soft Skills',
                level: 'Intermediate',
                duration: '3 hours',
                enrolledAgents: 22,
                completionRate: 95,
                documents: [
                    { id: 4, name: 'Communication Techniques.pdf', type: 'pdf', size: '1.8 MB', uploadDate: '2025-01-03' },
                    { id: 5, name: 'Role Play Examples.mp4', type: 'video', size: '32 MB', uploadDate: '2025-01-03' },
                ],
                assessments: 2,
                passingScore: 75,
                createdBy: 'Admin',
                createdDate: '2025-01-03',
                status: 'Active',
                description: 'Essential communication skills for effective customer interactions and objection handling',
            },
            {
                id: 3,
                title: 'CRM System Navigation',
                category: 'Portal Training',
                level: 'Beginner',
                duration: '2 hours',
                enrolledAgents: 30,
                completionRate: 78,
                documents: [
                    { id: 6, name: 'CRM User Manual.pdf', type: 'pdf', size: '3.2 MB', uploadDate: '2025-01-01' },
                    { id: 7, name: 'CRM Tutorial.mp4', type: 'video', size: '28 MB', uploadDate: '2025-01-01' },
                    { id: 8, name: 'Quick Reference Guide.pdf', type: 'pdf', size: '800 KB', uploadDate: '2025-01-02' },
                ],
                assessments: 1,
                passingScore: 70,
                createdBy: 'Admin',
                createdDate: '2025-01-01',
                status: 'Active',
                description: 'Learn how to navigate and utilize all features of our CRM portal effectively',
            },
            {
                id: 4,
                title: 'Sales Process & Best Practices',
                category: 'Process Training',
                level: 'Intermediate',
                duration: '5 hours',
                enrolledAgents: 18,
                completionRate: 72,
                documents: [
                    { id: 9, name: 'Sales Process Guide.pdf', type: 'pdf', size: '2.1 MB', uploadDate: '2024-12-28' },
                    { id: 10, name: 'Best Practices Video.mp4', type: 'video', size: '52 MB', uploadDate: '2024-12-28' },
                    { id: 11, name: 'Sales Scripts.docx', type: 'doc', size: '1.5 MB', uploadDate: '2024-12-29' },
                ],
                assessments: 4,
                passingScore: 85,
                createdBy: 'Admin',
                createdDate: '2024-12-28',
                status: 'Active',
                description: 'Complete sales process from lead generation to policy closure with proven techniques',
            },
        ];
    } catch (error) {
        console.error('Error fetching training modules:', error);
        throw error;
    }
};

/**
 * Create a new training module
 * @param {Object} moduleData - Training module data to create
 * @returns {Promise<Object>} Created training module object
 */
export const createTrainingModule = async (moduleData) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ENDPOINT}/modules`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(moduleData)
        // });
        // if (!response.ok) throw new Error('Failed to create training module');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        const newModule = {
            ...moduleData,
            id: Math.floor(Math.random() * 10000),
            enrolledAgents: 0,
            completionRate: 0,
            documents: [],
            assessments: 0,
            createdBy: 'Admin',
            createdDate: new Date().toISOString().split('T')[0],
        };
        return newModule;
    } catch (error) {
        console.error('Error creating training module:', error);
        throw error;
    }
};

/**
 * Update an existing training module
 * @param {number} moduleId - ID of the module to update
 * @param {Object} updates - Updated module data
 * @returns {Promise<Object>} Updated module object
 */
export const updateTrainingModule = async (moduleId, updates) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ENDPOINT}/modules/${moduleId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(updates)
        // });
        // if (!response.ok) throw new Error('Failed to update training module');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return {
            ...updates,
            id: moduleId,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
    } catch (error) {
        console.error('Error updating training module:', error);
        throw error;
    }
};

/**
 * Delete a training module
 * @param {number} moduleId - ID of the module to delete
 * @returns {Promise<Object>} Success response
 */
export const deleteTrainingModule = async (moduleId) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ENDPOINT}/modules/${moduleId}`, {
        //   method: 'DELETE'
        // });
        // if (!response.ok) throw new Error('Failed to delete training module');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return { success: true, message: 'Training module deleted successfully' };
    } catch (error) {
        console.error('Error deleting training module:', error);
        throw error;
    }
};

/**
 * Upload a document to a training module
 * @param {number} moduleId - ID of the module
 * @param {Object} documentData - Document data to upload
 * @returns {Promise<Object>} Uploaded document object
 */
export const uploadDocument = async (moduleId, documentData) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const formData = new FormData();
        // formData.append('file', documentData.file);
        // formData.append('name', documentData.name);
        // formData.append('type', documentData.type);
        // const response = await fetch(`${TRAINING_ENDPOINT}/modules/${moduleId}/documents`, {
        //   method: 'POST',
        //   body: formData
        // });
        // if (!response.ok) throw new Error('Failed to upload document');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return {
            id: Date.now(),
            name: documentData.name,
            type: documentData.type,
            size: documentData.size,
            uploadDate: new Date().toISOString().split('T')[0],
        };
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

/**
 * Delete a document from a training module
 * @param {number} moduleId - ID of the module
 * @param {number} documentId - ID of the document to delete
 * @returns {Promise<Object>} Success response
 */
export const deleteDocument = async (moduleId, documentId) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ENDPOINT}/modules/${moduleId}/documents/${documentId}`, {
        //   method: 'DELETE'
        // });
        // if (!response.ok) throw new Error('Failed to delete document');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return { success: true, message: 'Document deleted successfully' };
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
};

/**
 * Get agent training progress
 * @returns {Promise<Array>} Array of agent progress objects
 */
export const getAgentProgress = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ENDPOINT}/agent-progress`);
        // if (!response.ok) throw new Error('Failed to fetch agent progress');
        // return await response.json();

        // Mock data for now
        await simulateDelay();
        return [
            {
                agentId: 'EMP001',
                agentName: 'Rajesh Kumar',
                department: 'Sales',
                totalModules: 12,
                completedModules: 10,
                inProgressModules: 2,
                totalHours: 48,
                completedHours: 42,
                averageScore: 88,
                certificatesEarned: 8,
                lastActivity: '2025-01-10',
                rank: 1,
            },
            {
                agentId: 'EMP002',
                agentName: 'Priya Sharma',
                department: 'Sales',
                totalModules: 12,
                completedModules: 11,
                inProgressModules: 1,
                totalHours: 48,
                completedHours: 46,
                averageScore: 92,
                certificatesEarned: 10,
                lastActivity: '2025-01-11',
                rank: 2,
            },
            {
                agentId: 'EMP003',
                agentName: 'Amit Patel',
                department: 'Sales',
                totalModules: 10,
                completedModules: 7,
                inProgressModules: 2,
                totalHours: 40,
                completedHours: 28,
                averageScore: 76,
                certificatesEarned: 5,
                lastActivity: '2025-01-09',
                rank: 3,
            },
        ];
    } catch (error) {
        console.error('Error fetching agent progress:', error);
        throw error;
    }
};

/**
 * Get training analytics and statistics
 * @returns {Promise<Object>} Analytics object
 */
export const getTrainingAnalytics = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ENDPOINT}/analytics`);
        // if (!response.ok) throw new Error('Failed to fetch training analytics');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        const modules = await getTrainingModules();
        const agentProgress = await getAgentProgress();

        return {
            totalModules: modules.length,
            totalEnrollments: modules.reduce((sum, m) => sum + m.enrolledAgents, 0),
            averageCompletion: Math.round(modules.reduce((sum, m) => sum + m.completionRate, 0) / modules.length),
            totalDocuments: modules.reduce((sum, m) => sum + m.documents.length, 0),
            totalTrainingHours: agentProgress.reduce((sum, a) => sum + a.completedHours, 0),
            averageScore: Math.round(agentProgress.reduce((sum, a) => sum + a.averageScore, 0) / agentProgress.length),
            certificatesIssued: agentProgress.reduce((sum, a) => sum + a.certificatesEarned, 0),
        };
    } catch (error) {
        console.error('Error fetching training analytics:', error);
        throw error;
    }
};

/**
 * Enroll an agent in a training module
 * @param {number} moduleId - ID of the module
 * @param {string} agentId - ID of the agent
 * @returns {Promise<Object>} Success response
 */
export const enrollAgent = async (moduleId, agentId) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ENDPOINT}/modules/${moduleId}/enroll`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ agentId })
        // });
        // if (!response.ok) throw new Error('Failed to enroll agent');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return {
            success: true,
            message: 'Agent enrolled successfully',
            moduleId,
            agentId,
            enrolledDate: new Date().toISOString().split('T')[0]
        };
    } catch (error) {
        console.error('Error enrolling agent:', error);
        throw error;
    }
};

export default {
    getTrainingModules,
    createTrainingModule,
    updateTrainingModule,
    deleteTrainingModule,
    uploadDocument,
    deleteDocument,
    getAgentProgress,
    getTrainingAnalytics,
    enrollAgent
};
