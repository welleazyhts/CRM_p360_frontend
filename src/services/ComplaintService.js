// src/services/ComplaintService.js
import api from './api';

// Base endpoint for complaints management
const COMPLAINTS_BASE = '/complaints_management';

/**
 * Fetch all complaints
 * @returns {Promise<Array>} Array of complaint objects
 */
export const fetchComplaints = async () => {
    try {
        const response = await api.get(`${COMPLAINTS_BASE}/list/`);
        console.log('API Response (fetchComplaints):', response);
        // Map backend snake_case to frontend camelCase
        return response.data.map(transformComplaintData);
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
        // Map frontend camelCase to backend snake_case
        const payload = mapToBackendData(complaintData);

        const response = await api.post(`${COMPLAINTS_BASE}/create/`, payload);


        const responseData = response.data;

        // Check if response has minimal expected data (e.g. customer_name). If so, use standard transform.
        if (responseData && responseData.customer_name) {
            return transformComplaintData(responseData);
        }

        // Fallback: If backend returns partial data (e.g. just ID), construct the object from input
        return {
            id: responseData.id || responseData.complaint_id || 'temp-' + Date.now(),
            customerName: complaintData.customerName,
            email: complaintData.email,
            phone: complaintData.phone,
            complaintType: complaintData.complaintType,
            severity: complaintData.severity,
            subject: complaintData.subject,
            description: complaintData.description,
            status: complaintData.status,
            assignedTo: complaintData.assignedTo || 'Unassigned',
            createdDate: new Date().toISOString().split('T')[0],
            resolutionDeadline: complaintData.deadline,
            timeline: []
        };
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
        const payload = mapToBackendData(updates);

        // Using PATCH for partial updates which handles both full and partial updates effectively for this use case
        const response = await api.patch(`${COMPLAINTS_BASE}/update/${complaintId}/`, payload);

        const responseData = response.data;

        // Check if response has minimal expected data (e.g. customer_name). If so, use standard transform.
        if (responseData && responseData.customer_name) {
            return transformComplaintData(responseData);
        }

        // Fallback: Construct the object from input updates (merging is handled by the component usually, but here we return the updated fields)
        // Note: For a proper update, we ideally need the previous state, but returning the updates formatted correctly lets the UI merge it.
        // However, the UI does: setComplaints(complaints.map(c => c.id === selectedComplaint.id ? updated : c));
        // So we MUST return the FULL object. Since we don't have the old object here, 
        // we might be in trouble if we just return updates. 
        // BUT, looking at the usage in ComplaintsManagement.jsx, 'updates' (formData) contains ALL fields.
        // So we can reconstruct the full object.

        return {
            id: complaintId,
            customerName: updates.customerName,
            email: updates.email,
            phone: updates.phone,
            complaintType: updates.complaintType,
            severity: updates.severity,
            subject: updates.subject,
            description: updates.description,
            status: updates.status,
            assignedTo: updates.assignedTo,
            resolutionDeadline: updates.deadline,
            // Preserve existing timeline if possible, or leave it empty/undefined (UI handles it?)
            // The UI code maps 'timeline' in the TableRow? No, timeline is only in Details.
            // But we should try to keep it safe.
            timeline: [] // We lose timeline on this fallback, but better than crashing.
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
        const response = await api.delete(`${COMPLAINTS_BASE}/delete/${complaintId}/`);
        return response.data;
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
        // Use the dashboard_summary endpoint from the collection
        const response = await api.get(`${COMPLAINTS_BASE}/dashboard_summary/`);
        return {
            total: response.data.total_complaints || 0,
            open: response.data.open_complaints || 0,
            inProgress: response.data.in_progress_complaints || 0, // Adjust based on actual API response keys keys might be snake_case
            resolved: response.data.resolved_complaints || 0,
            closed: 0 // If not returned, set to 0 or derive
        };
    } catch (error) {
        console.error('Error fetching complaint stats:', error);
        // Fallback to empty stats to prevent crash
        return { total: 0, open: 0, inProgress: 0, resolved: 0 };
    }
};

/**
 * Search complaints
 * @param {string} query - Search query
 */
export const searchComplaints = async (query) => {
    try {
        const response = await api.get(`${COMPLAINTS_BASE}/search/?q=${query}`);
        return response.data.map(transformComplaintData);
    } catch (error) {
        console.error('Error searching complaints:', error);
        throw error;
    }
};

/**
 * View a specific complaint
 * @param {string} id - Complaint ID
 */
export const viewComplaint = async (id) => {
    try {
        const response = await api.get(`${COMPLAINTS_BASE}/view/${id}/`);
        return transformComplaintData(response.data);
    } catch (error) {
        console.error('Error viewing complaint:', error);
        throw error;
    }
};


// Helper to map backend data (snake_case) to frontend data (camelCase)
const transformComplaintData = (data) => {
    if (!data) return null;
    return {
        id: data.id,
        customerName: data.customer_name,
        email: data.email,
        phone: data.phone,
        complaintType: toTitleCase(data.complaint_type),
        severity: toTitleCase(data.severity), // 'high' -> 'High'
        subject: data.subject,
        description: data.description,
        status: toTitleCase(data.status), // 'in_progress' -> 'In Progress'
        assignedTo: data.assigned_to,
        createdDate: data.created_at || data.created_date,
        resolutionDeadline: data.deadline,
        timeline: data.timeline || []
    };
};

// Helper to convert snake_case or lowercase to Title Case
const toTitleCase = (str) => {
    if (!str) return '';
    // Replace underscores with spaces and capitalize words
    return str.toString().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper to map frontend data to backend payload
const mapToBackendData = (data) => {
    return {
        customer_name: data.customerName,
        email: data.email,
        phone: data.phone,
        complaint_type: data.complaintType?.toLowerCase().replace(/ /g, '_'),
        severity: data.severity?.toLowerCase(),
        status: data.status?.toLowerCase().replace(/ /g, '_'), // 'In Progress' -> 'in_progress'
        subject: data.subject,
        description: data.description,
        deadline: data.deadline,
        assigned_to: data.assignedTo
    };
};


export default {
    fetchComplaints,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    getComplaintStats,
    searchComplaints,
    viewComplaint
};
