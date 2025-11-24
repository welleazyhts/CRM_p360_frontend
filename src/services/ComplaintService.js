// src/services/ComplaintService.js
// Complaint management service: handles API calls for complaints
// When backend is ready, update API_BASE_URL in .env file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const COMPLAINTS_ENDPOINT = `${API_BASE_URL}/complaints`;

// Helper function to simulate API delay (remove when using real backend)
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all complaints
 * @returns {Promise<Array>} Array of complaint objects
 */
export const fetchComplaints = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(COMPLAINTS_ENDPOINT);
        // if (!response.ok) throw new Error('Failed to fetch complaints');
        // return await response.json();

        // Mock data for now
        await simulateDelay();
        return [
            {
                id: 'CMP-001',
                customerName: 'Rajesh Kumar',
                email: 'rajesh@example.com',
                phone: '+91 98765 43210',
                complaintType: 'Claim Processing',
                severity: 'High',
                subject: 'Delayed claim settlement',
                description: 'My claim has been pending for over 30 days without any update',
                status: 'In Progress',
                assignedTo: 'Priya Sharma',
                createdDate: '2025-01-08',
                lastUpdated: '2025-01-12',
                resolutionDeadline: '2025-01-15',
                timeline: [
                    { date: '2025-01-08', action: 'Complaint registered', user: 'System' },
                    { date: '2025-01-09', action: 'Assigned to Priya Sharma', user: 'Admin' },
                    { date: '2025-01-12', action: 'Investigation in progress', user: 'Priya Sharma' }
                ]
            },
            {
                id: 'CMP-002',
                customerName: 'Anita Desai',
                email: 'anita@example.com',
                phone: '+91 98765 43211',
                complaintType: 'Service Quality',
                severity: 'Medium',
                subject: 'Poor customer service experience',
                description: 'The customer service representative was unhelpful and rude',
                status: 'Open',
                assignedTo: 'Amit Patel',
                createdDate: '2025-01-10',
                lastUpdated: '2025-01-10',
                resolutionDeadline: '2025-01-17',
                timeline: [
                    { date: '2025-01-10', action: 'Complaint registered', user: 'System' }
                ]
            },
            {
                id: 'CMP-003',
                customerName: 'Vikram Singh',
                email: 'vikram@example.com',
                phone: '+91 98765 43212',
                complaintType: 'Policy Terms',
                severity: 'Low',
                subject: 'Confusion about policy coverage',
                description: 'Need clarification on what is covered under my health policy',
                status: 'Resolved',
                assignedTo: 'Priya Sharma',
                createdDate: '2025-01-05',
                lastUpdated: '2025-01-09',
                resolutionDeadline: '2025-01-12',
                resolvedDate: '2025-01-09',
                timeline: [
                    { date: '2025-01-05', action: 'Complaint registered', user: 'System' },
                    { date: '2025-01-06', action: 'Assigned to Priya Sharma', user: 'Admin' },
                    { date: '2025-01-09', action: 'Resolved with explanation provided', user: 'Priya Sharma' }
                ]
            }
        ];
    } catch (error) {
        console.error('Error fetching complaints:', error);
        throw error;
    }
};

/**
 * Create a new complaint
 * @param {Object} complaintData - Complaint data to create
 * @returns {Promise<Object>} Created complaint object
 */
export const createComplaint = async (complaintData) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(COMPLAINTS_ENDPOINT, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(complaintData)
        // });
        // if (!response.ok) throw new Error('Failed to create complaint');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        const newComplaint = {
            ...complaintData,
            id: `CMP-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            assignedTo: 'Unassigned',
            createdDate: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString().split('T')[0],
            resolutionDeadline: complaintData.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            timeline: [
                { date: new Date().toISOString().split('T')[0], action: 'Complaint registered', user: 'System' }
            ]
        };
        return newComplaint;
    } catch (error) {
        console.error('Error creating complaint:', error);
        throw error;
    }
};

/**
 * Update an existing complaint
 * @param {string} complaintId - ID of the complaint to update
 * @param {Object} updates - Updated complaint data
 * @returns {Promise<Object>} Updated complaint object
 */
export const updateComplaint = async (complaintId, updates) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${COMPLAINTS_ENDPOINT}/${complaintId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(updates)
        // });
        // if (!response.ok) throw new Error('Failed to update complaint');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return {
            ...updates,
            id: complaintId,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
    } catch (error) {
        console.error('Error updating complaint:', error);
        throw error;
    }
};

/**
 * Delete a complaint
 * @param {string} complaintId - ID of the complaint to delete
 * @returns {Promise<Object>} Success response
 */
export const deleteComplaint = async (complaintId) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${COMPLAINTS_ENDPOINT}/${complaintId}`, {
        //   method: 'DELETE'
        // });
        // if (!response.ok) throw new Error('Failed to delete complaint');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return { success: true, message: 'Complaint deleted successfully' };
    } catch (error) {
        console.error('Error deleting complaint:', error);
        throw error;
    }
};

/**
 * Get complaint statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getComplaintStats = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${COMPLAINTS_ENDPOINT}/stats`);
        // if (!response.ok) throw new Error('Failed to fetch complaint stats');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        const complaints = await fetchComplaints();
        return {
            total: complaints.length,
            open: complaints.filter(c => c.status === 'Open').length,
            inProgress: complaints.filter(c => c.status === 'In Progress').length,
            resolved: complaints.filter(c => c.status === 'Resolved').length,
            closed: complaints.filter(c => c.status === 'Closed').length
        };
    } catch (error) {
        console.error('Error fetching complaint stats:', error);
        throw error;
    }
};

/**
 * Assign complaint to a user
 * @param {string} complaintId - ID of the complaint
 * @param {string} userId - ID of the user to assign to
 * @returns {Promise<Object>} Updated complaint object
 */
export const assignComplaint = async (complaintId, userId) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${COMPLAINTS_ENDPOINT}/${complaintId}/assign`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ userId })
        // });
        // if (!response.ok) throw new Error('Failed to assign complaint');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return {
            success: true,
            message: 'Complaint assigned successfully',
            assignedTo: userId
        };
    } catch (error) {
        console.error('Error assigning complaint:', error);
        throw error;
    }
};

/**
 * Add a timeline event to a complaint
 * @param {string} complaintId - ID of the complaint
 * @param {Object} event - Timeline event data
 * @returns {Promise<Object>} Updated complaint object
 */
export const addTimelineEvent = async (complaintId, event) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${COMPLAINTS_ENDPOINT}/${complaintId}/timeline`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(event)
        // });
        // if (!response.ok) throw new Error('Failed to add timeline event');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return {
            success: true,
            message: 'Timeline event added successfully',
            event: {
                ...event,
                date: new Date().toISOString().split('T')[0]
            }
        };
    } catch (error) {
        console.error('Error adding timeline event:', error);
        throw error;
    }
};

export default {
    fetchComplaints,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    getComplaintStats,
    assignComplaint,
    addTimelineEvent
};
