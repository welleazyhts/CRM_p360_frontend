// src/services/trainingAnalysisService.js
// Training analysis service: handles API calls for training analytics, modules, and employee records
// When backend is ready, update API_BASE_URL in .env file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const TRAINING_ANALYSIS_ENDPOINT = `${API_BASE_URL}/training-analysis`;

// Helper function to simulate API delay (remove when using real backend)
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all training modules with analytics data
 * @returns {Promise<Array>} Array of training module objects
 */
export const getTrainingModules = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ANALYSIS_ENDPOINT}/modules`);
        // if (!response.ok) throw new Error('Failed to fetch training modules');
        // return await response.json();

        // Mock data for now
        await simulateDelay();
        return [
            {
                id: 1,
                title: 'Customer Service Excellence',
                description: 'Learn best practices for exceptional customer service',
                duration: '2 hours',
                category: 'Soft Skills',
                difficulty: 'Beginner',
                completionRate: 85,
                enrolledCount: 45
            },
            {
                id: 2,
                title: 'Claims Processing Fundamentals',
                description: 'Comprehensive guide to processing insurance claims',
                duration: '3 hours',
                category: 'Technical',
                difficulty: 'Intermediate',
                completionRate: 72,
                enrolledCount: 38
            },
            {
                id: 3,
                title: 'Product Knowledge - Health Insurance',
                description: 'Deep dive into health insurance products and features',
                duration: '4 hours',
                category: 'Product Knowledge',
                difficulty: 'Advanced',
                completionRate: 68,
                enrolledCount: 35
            },
            {
                id: 4,
                title: 'Complaint Resolution Strategies',
                description: 'Effective techniques for resolving customer complaints',
                duration: '1.5 hours',
                category: 'Soft Skills',
                difficulty: 'Intermediate',
                completionRate: 90,
                enrolledCount: 42
            }
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
        // const response = await fetch(`${TRAINING_ANALYSIS_ENDPOINT}/modules`, {
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
            completionRate: 0,
            enrolledCount: 0
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
        // const response = await fetch(`${TRAINING_ANALYSIS_ENDPOINT}/modules/${moduleId}`, {
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
            id: moduleId
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
        // const response = await fetch(`${TRAINING_ANALYSIS_ENDPOINT}/modules/${moduleId}`, {
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
 * Fetch employee training records
 * @returns {Promise<Array>} Array of training record objects
 */
export const getTrainingRecords = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ANALYSIS_ENDPOINT}/records`);
        // if (!response.ok) throw new Error('Failed to fetch training records');
        // return await response.json();

        // Mock data for now
        await simulateDelay();
        return [
            {
                id: 1,
                employeeName: 'Priya Sharma',
                moduleTitle: 'Customer Service Excellence',
                status: 'Completed',
                score: 92,
                completedDate: '2025-01-10',
                timeSpent: '2.1 hours'
            },
            {
                id: 2,
                employeeName: 'Amit Patel',
                moduleTitle: 'Claims Processing Fundamentals',
                status: 'In Progress',
                progress: 65,
                startedDate: '2025-01-08',
                timeSpent: '1.8 hours'
            },
            {
                id: 3,
                employeeName: 'Rajesh Kumar',
                moduleTitle: 'Product Knowledge - Health Insurance',
                status: 'Completed',
                score: 88,
                completedDate: '2025-01-09',
                timeSpent: '4.2 hours'
            },
            {
                id: 4,
                employeeName: 'Anita Desai',
                moduleTitle: 'Complaint Resolution Strategies',
                status: 'Completed',
                score: 95,
                completedDate: '2025-01-11',
                timeSpent: '1.6 hours'
            }
        ];
    } catch (error) {
        console.error('Error fetching training records:', error);
        throw error;
    }
};

/**
 * Get performance trend data over time
 * @returns {Promise<Array>} Array of performance data points
 */
export const getPerformanceData = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ANALYSIS_ENDPOINT}/performance`);
        // if (!response.ok) throw new Error('Failed to fetch performance data');
        // return await response.json();

        // Mock data for now
        await simulateDelay();
        return [
            { month: 'Jul', avgScore: 78, completionRate: 65 },
            { month: 'Aug', avgScore: 82, completionRate: 70 },
            { month: 'Sep', avgScore: 85, completionRate: 75 },
            { month: 'Oct', avgScore: 88, completionRate: 78 },
            { month: 'Nov', avgScore: 90, completionRate: 82 },
            { month: 'Dec', avgScore: 92, completionRate: 85 }
        ];
    } catch (error) {
        console.error('Error fetching performance data:', error);
        throw error;
    }
};

/**
 * Get module distribution by category
 * @param {Array} modules - Array of training modules
 * @returns {Promise<Array>} Array of category distribution data
 */
export const getCategoryDistribution = async (modules = []) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ANALYSIS_ENDPOINT}/category-distribution`);
        // if (!response.ok) throw new Error('Failed to fetch category distribution');
        // return await response.json();

        // Mock implementation - calculate from modules
        await simulateDelay();
        return [
            { name: 'Soft Skills', count: modules.filter(m => m.category === 'Soft Skills').length },
            { name: 'Technical', count: modules.filter(m => m.category === 'Technical').length },
            { name: 'Product Knowledge', count: modules.filter(m => m.category === 'Product Knowledge').length },
            { name: 'Compliance', count: modules.filter(m => m.category === 'Compliance').length }
        ];
    } catch (error) {
        console.error('Error fetching category distribution:', error);
        throw error;
    }
};

/**
 * Get overall training statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getTrainingStats = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ANALYSIS_ENDPOINT}/stats`);
        // if (!response.ok) throw new Error('Failed to fetch training stats');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        const modules = await getTrainingModules();
        const records = await getTrainingRecords();

        const avgCompletionRate = modules.reduce((sum, m) => sum + m.completionRate, 0) / modules.length || 0;
        const totalEnrolled = modules.reduce((sum, m) => sum + m.enrolledCount, 0);
        const completedCount = records.filter(r => r.status === 'Completed').length;
        const avgScore = records
            .filter(r => r.score)
            .reduce((sum, r) => sum + r.score, 0) / records.filter(r => r.score).length || 0;

        return {
            totalModules: modules.length,
            totalEnrolled,
            avgCompletionRate: avgCompletionRate.toFixed(0),
            avgScore: avgScore.toFixed(0),
            completedCount,
            inProgressCount: records.filter(r => r.status === 'In Progress').length
        };
    } catch (error) {
        console.error('Error fetching training stats:', error);
        throw error;
    }
};

/**
 * Enroll an employee in a training module
 * @param {number} moduleId - ID of the module
 * @param {string} employeeId - ID of the employee
 * @returns {Promise<Object>} Success response
 */
export const enrollEmployee = async (moduleId, employeeId) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TRAINING_ANALYSIS_ENDPOINT}/enroll`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ moduleId, employeeId })
        // });
        // if (!response.ok) throw new Error('Failed to enroll employee');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return {
            success: true,
            message: 'Employee enrolled successfully',
            moduleId,
            employeeId,
            enrolledDate: new Date().toISOString().split('T')[0]
        };
    } catch (error) {
        console.error('Error enrolling employee:', error);
        throw error;
    }
};

export default {
    getTrainingModules,
    createTrainingModule,
    updateTrainingModule,
    deleteTrainingModule,
    getTrainingRecords,
    getPerformanceData,
    getCategoryDistribution,
    getTrainingStats,
    enrollEmployee
};
