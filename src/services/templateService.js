// src/services/templateService.js
// Template downloads service: handles API calls for template management and downloads
// When backend is ready, update API_BASE_URL in .env file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const TEMPLATE_ENDPOINT = `${API_BASE_URL}/templates`;

// Helper function to simulate API delay (remove when using real backend)
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all available templates
 * @returns {Promise<Array>} Array of template objects
 */
export const getTemplates = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(TEMPLATE_ENDPOINT);
        // if (!response.ok) throw new Error('Failed to fetch templates');
        // return await response.json();

        // Mock data for now
        await simulateDelay();
        return [
            {
                id: 1,
                name: 'Policy Proposal Form',
                category: 'Proposal',
                description: 'Standard policy proposal form for new insurance applications',
                format: 'PDF',
                size: '2.5 MB',
                downloads: 1250,
                lastUpdated: '2024-01-15',
                url: '/templates/policy-proposal-form.pdf'
            },
            {
                id: 2,
                name: 'KYC Document Form',
                category: 'KYC',
                description: 'Know Your Customer documentation form for identity verification',
                format: 'PDF',
                size: '1.8 MB',
                downloads: 890,
                lastUpdated: '2024-01-10',
                url: '/templates/kyc-document-form.pdf'
            },
            {
                id: 3,
                name: 'Claim Request Form',
                category: 'Claims',
                description: 'Insurance claim request form for policy holders',
                format: 'PDF',
                size: '3.2 MB',
                downloads: 2100,
                lastUpdated: '2024-01-20',
                url: '/templates/claim-request-form.pdf'
            },
            {
                id: 4,
                name: 'Policy Renewal Form',
                category: 'Renewal',
                description: 'Policy renewal application form for existing customers',
                format: 'PDF',
                size: '2.1 MB',
                downloads: 1680,
                lastUpdated: '2024-01-18',
                url: '/templates/policy-renewal-form.pdf'
            },
            {
                id: 5,
                name: 'Vehicle Insurance Proposal',
                category: 'Proposal',
                description: 'Specialized proposal form for vehicle insurance policies',
                format: 'DOCX',
                size: '1.5 MB',
                downloads: 750,
                lastUpdated: '2024-01-12',
                url: '/templates/vehicle-insurance-proposal.docx'
            },
            {
                id: 6,
                name: 'Health Insurance KYC',
                category: 'KYC',
                description: 'Health insurance specific KYC form with medical declarations',
                format: 'PDF',
                size: '2.8 MB',
                downloads: 620,
                lastUpdated: '2024-01-08',
                url: '/templates/health-insurance-kyc.pdf'
            },
            {
                id: 7,
                name: 'Motor Claim Form',
                category: 'Claims',
                description: 'Motor vehicle insurance claim form with accident details',
                format: 'PDF',
                size: '4.1 MB',
                downloads: 1420,
                lastUpdated: '2024-01-22',
                url: '/templates/motor-claim-form.pdf'
            },
            {
                id: 8,
                name: 'Life Insurance Renewal',
                category: 'Renewal',
                description: 'Life insurance policy renewal form with beneficiary updates',
                format: 'DOCX',
                size: '1.9 MB',
                downloads: 980,
                lastUpdated: '2024-01-16',
                url: '/templates/life-insurance-renewal.docx'
            }
        ];
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
    }
};

/**
 * Download a template file
 * @param {number} templateId - ID of the template to download
 * @returns {Promise<Object>} Download response with URL
 */
export const downloadTemplate = async (templateId) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TEMPLATE_ENDPOINT}/${templateId}/download`, {
        //   method: 'POST'
        // });
        // if (!response.ok) throw new Error('Failed to download template');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return {
            success: true,
            message: 'Template download initiated',
            templateId,
            downloadUrl: `/templates/download/${templateId}`
        };
    } catch (error) {
        console.error('Error downloading template:', error);
        throw error;
    }
};

/**
 * Get template statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getTemplateStats = async () => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TEMPLATE_ENDPOINT}/stats`);
        // if (!response.ok) throw new Error('Failed to fetch template stats');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        const templates = await getTemplates();

        return {
            total: templates.length,
            totalDownloads: templates.reduce((sum, t) => sum + t.downloads, 0),
            categories: [...new Set(templates.map(t => t.category))].length,
            formats: [...new Set(templates.map(t => t.format))].length,
            mostDownloaded: templates.reduce((max, t) => t.downloads > max.downloads ? t : max, templates[0])
        };
    } catch (error) {
        console.error('Error fetching template stats:', error);
        throw error;
    }
};

/**
 * Upload a new template
 * @param {Object} templateData - Template data to upload
 * @returns {Promise<Object>} Created template object
 */
export const uploadTemplate = async (templateData) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const formData = new FormData();
        // Object.keys(templateData).forEach(key => {
        //   formData.append(key, templateData[key]);
        // });
        // const response = await fetch(TEMPLATE_ENDPOINT, {
        //   method: 'POST',
        //   body: formData
        // });
        // if (!response.ok) throw new Error('Failed to upload template');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        const newTemplate = {
            ...templateData,
            id: Math.floor(Math.random() * 10000),
            downloads: 0,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        return newTemplate;
    } catch (error) {
        console.error('Error uploading template:', error);
        throw error;
    }
};

/**
 * Update an existing template
 * @param {number} templateId - ID of the template to update
 * @param {Object} updates - Updated template data
 * @returns {Promise<Object>} Updated template object
 */
export const updateTemplate = async (templateId, updates) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TEMPLATE_ENDPOINT}/${templateId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(updates)
        // });
        // if (!response.ok) throw new Error('Failed to update template');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return {
            ...updates,
            id: templateId,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
    } catch (error) {
        console.error('Error updating template:', error);
        throw error;
    }
};

/**
 * Delete a template
 * @param {number} templateId - ID of the template to delete
 * @returns {Promise<Object>} Success response
 */
export const deleteTemplate = async (templateId) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TEMPLATE_ENDPOINT}/${templateId}`, {
        //   method: 'DELETE'
        // });
        // if (!response.ok) throw new Error('Failed to delete template');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        return { success: true, message: 'Template deleted successfully' };
    } catch (error) {
        console.error('Error deleting template:', error);
        throw error;
    }
};

/**
 * Get templates by category
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} Array of filtered template objects
 */
export const getTemplatesByCategory = async (category) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TEMPLATE_ENDPOINT}?category=${category}`);
        // if (!response.ok) throw new Error('Failed to fetch templates by category');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        const templates = await getTemplates();
        return templates.filter(t => t.category === category);
    } catch (error) {
        console.error('Error fetching templates by category:', error);
        throw error;
    }
};

/**
 * Search templates by name or description
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching template objects
 */
export const searchTemplates = async (searchTerm) => {
    try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${TEMPLATE_ENDPOINT}/search?q=${encodeURIComponent(searchTerm)}`);
        // if (!response.ok) throw new Error('Failed to search templates');
        // return await response.json();

        // Mock implementation
        await simulateDelay();
        const templates = await getTemplates();
        const term = searchTerm.toLowerCase();
        return templates.filter(t =>
            t.name.toLowerCase().includes(term) ||
            t.description.toLowerCase().includes(term)
        );
    } catch (error) {
        console.error('Error searching templates:', error);
        throw error;
    }
};

export default {
    getTemplates,
    downloadTemplate,
    getTemplateStats,
    uploadTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesByCategory,
    searchTemplates
};
