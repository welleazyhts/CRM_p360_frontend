import api, { getApiUrl } from './api';

/**
 * Contact Database Service
 * Handles all API calls for Contact Database management
 */

// Contact Database API is on a different server
const BASE_PATH = '/contact_database';

/**
 * Fetch all contacts
 * @returns {Promise} List of contacts
 */
export const fetchContacts = async () => {
    try {
        const response = await api.get(`${BASE_PATH}/contacts/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
    }
};

/**
 * Add a new contact
 * @param {Object} contactData - Contact data (name, email, designation, company, source)
 * @returns {Promise} Created contact
 */
export const addContact = async (contactData) => {
    try {
        const response = await api.post(`${BASE_PATH}/contacts/`, contactData);
        return response.data;
    } catch (error) {
        console.error('Error adding contact:', error);

        // Provide more specific error messages
        if (error.message && error.message.includes('401')) {
            throw new Error('Authentication failed. Please log in again.');
        } else if (error.message && error.message.includes('403')) {
            throw new Error('You do not have permission to add contacts.');
        } else if (error.message && error.message.includes('400')) {
            throw new Error('Invalid contact data. Please check all required fields.');
        } else if (error.message && error.message.includes('500')) {
            throw new Error('Server error. Please try again later.');
        }

        throw error;
    }
};

/**
 * Update an existing contact
 * @param {string|number} id - Contact ID
 * @param {Object} contactData - Updated contact data
 * @returns {Promise} Updated contact
 */
export const updateContact = async (id, contactData) => {
    try {
        const response = await api.put(`${BASE_PATH}/contacts/${id}/`, contactData);
        return response.data;
    } catch (error) {
        console.error('Error updating contact:', error);
        throw error;
    }
};

/**
 * Delete a contact
 * @param {string|number} id - Contact ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteContact = async (id) => {
    try {
        const response = await api.delete(`${BASE_PATH}/contacts/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting contact:', error);
        throw error;
    }
};

/**
 * Search contacts by query
 * @param {string} query - Search query
 * @returns {Promise} Matching contacts
 */
export const searchContacts = async (query) => {
    try {
        const response = await api.get(`${BASE_PATH}/contacts/search/${query}`);
        return response.data;
    } catch (error) {
        console.error('Error searching contacts:', error);
        throw error;
    }
};

/**
 * Filter contacts by source, status, and name
 * @param {string} source - Contact source
 * @param {string} status - Contact status
 * @param {string} name - Contact name
 * @returns {Promise} Filtered contacts
 */
export const filterContacts = async (source, status, name) => {
    try {
        const response = await api.get(`${BASE_PATH}/contacts/filter/${source}/${status}/${name}`);
        return response.data;
    } catch (error) {
        console.error('Error filtering contacts:', error);
        throw error;
    }
};

/**
 * Bulk upload contacts from CSV file
 * @param {File} file - CSV file containing contacts
 * @returns {Promise} Upload result
 */
export const bulkUploadContacts = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        // Use fetch directly for file upload to handle FormData properly
        const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
        const url = getApiUrl(`${BASE_PATH}/bulk-upload/upload/`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || error.detail || `Upload failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading contacts:', error);
        throw error;
    }
};

/**
 * Get upload history
 * @returns {Promise} Upload history records
 */
export const getHistory = async () => {
    try {
        const response = await api.get(`${BASE_PATH}/history/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};

/**
 * Clear all upload history
 * @returns {Promise} Deletion confirmation
 */
export const clearHistory = async () => {
    try {
        const response = await api.delete(`${BASE_PATH}/history/clear/`);
        return response.data;
    } catch (error) {
        console.error('Error clearing history:', error);
        throw error;
    }
};

/**
 * Export failed records from a specific upload
 * @param {string|number} uploadId - Upload ID
 * @returns {Promise} Failed records file
 */
export const exportFailedRecords = async (uploadId) => {
    try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
        const url = getApiUrl(`${BASE_PATH}/bulk-upload/export-failed/${uploadId}/`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Export failed: ${response.statusText}`);
        }

        // Return blob for file download
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error('Error exporting failed records:', error);
        throw error;
    }
};

/**
 * Refresh contact data
 * @returns {Promise} Refresh confirmation
 */
export const refreshContacts = async () => {
    try {
        const response = await api.post(`${BASE_PATH}/refresh/`);
        return response.data;
    } catch (error) {
        console.error('Error refreshing contacts:', error);
        throw error;
    }
};
// ... rest of the file

export default {
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    searchContacts,
    filterContacts,
    bulkUploadContacts,
    getHistory,
    clearHistory,
    exportFailedRecords,
    refreshContacts
};
