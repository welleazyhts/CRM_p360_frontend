/**
 * Auto Assignment Settings API
 * Handles settings, agents CRUD, strategies, and import/export
 */

import api, { getApiUrl } from './api';

const SETTINGS_BASE_PATH = '/auto-assignment';

/**
 * Update general auto-assignment settings
 * @param {Object} settings - Settings object
 * @returns {Promise} Updated settings
 */
export const updateSettings = async (settings) => {
    try {
        const response = await api.post(`${SETTINGS_BASE_PATH}/settings/`, settings);
        return response.data;
    } catch (error) {
        console.error('Error updating auto-assignment settings:', error);
        throw error;
    }
};

/**
 * Update assignment strategies
 * @param {Array} strategies - Array of strategy objects [{entity_type, strategy}]
 * @returns {Promise} Updated strategies
 */
export const updateStrategies = async (strategies) => {
    try {
        const response = await api.post(`${SETTINGS_BASE_PATH}/strategies/`, strategies);
        return response.data;
    } catch (error) {
        console.error('Error updating assignment strategies:', error);
        throw error;
    }
};

/**
 * Create a new agent
 * @param {Object} agentData - Agent data object
 * @returns {Promise} Created agent
 */
export const createAgent = async (agentData) => {
    try {
        const response = await api.post(`${SETTINGS_BASE_PATH}/agents/`, agentData);
        return response.data;
    } catch (error) {
        console.error('Error creating agent:', error);
        throw error;
    }
};

/**
 * Update an existing agent
 * @param {number|string} agentId - Agent ID
 * @param {Object} agentData - Updated agent data
 * @returns {Promise} Updated agent
 */
export const updateAgent = async (agentId, agentData) => {
    try {
        const response = await api.patch(`${SETTINGS_BASE_PATH}/agents/${agentId}/`, agentData);
        return response.data;
    } catch (error) {
        console.error(`Error updating agent ${agentId}:`, error);
        throw error;
    }
};

/**
 * Delete an agent
 * @param {number|string} agentId - Agent ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteAgent = async (agentId) => {
    try {
        const response = await api.delete(`${SETTINGS_BASE_PATH}/agents/${agentId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting agent ${agentId}:`, error);
        throw error;
    }
};

/**
 * Activate or deactivate an agent
 * @param {number|string} agentId - Agent ID
 * @returns {Promise} Updated agent status
 */
export const toggleAgentActivation = async (agentId) => {
    try {
        const response = await api.post(`${SETTINGS_BASE_PATH}/agents/${agentId}/activate/`);
        return response.data;
    } catch (error) {
        console.error(`Error toggling agent ${agentId} activation:`, error);
        throw error;
    }
};

/**
 * Export all auto-assignment settings and agents
 * @returns {Promise} File blob for download
 */
export const exportSettings = async () => {
    try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
        const url = getApiUrl(`${SETTINGS_BASE_PATH}/export/`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
        );

        if (!response.ok) {
            throw new Error(`Export failed: ${response.status}`);
        }

        return await response.blob();
    } catch (error) {
        console.error('Error exporting settings:', error);
        throw error;
    }
};

/**
 * Import auto-assignment settings and agents
 * @param {Object} configData - Configuration data to import
 * @returns {Promise} Import result
 */
export const importSettings = async (configData) => {
    try {
        const response = await api.post(`${SETTINGS_BASE_PATH}/import/`, configData);
        return response.data;
    } catch (error) {
        console.error('Error importing settings:', error);
        throw error;
    }
};

export default {
    updateSettings,
    updateStrategies,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgentActivation,
    exportSettings,
    importSettings
};
