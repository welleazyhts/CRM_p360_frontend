import api from './api';

// Base endpoint for customer feedback management
const FEEDBACK_BASE = '/customer_feedback_management';

/**
 * Fetch all feedbacks
 * @returns {Promise<Array>} Array of feedback objects
 */
export const fetchFeedbacks = async () => {
    try {
        const response = await api.get(`${FEEDBACK_BASE}/list/`);
        // console.log('API Response (fetchFeedbacks):', response);
        // Map backend snake_case to frontend camelCase
        return response.data.map(transformFeedbackData);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        throw error;
    }
};

/**
 * Report/Create a new feedback
 * @param {Object} feedbackData - Feedback data to create
 * @returns {Promise<Object>} Created feedback object
 */
export const createFeedback = async (feedbackData) => {
    try {
        // Map frontend camelCase to backend snake_case
        const payload = mapToBackendData(feedbackData);
        // Add sentiment if not present (simple logic or let backend handle it, but payload in Postman has it)
        if (!payload.sentiment && feedbackData.rating) {
            payload.sentiment = feedbackData.rating >= 4 ? 'positive' : feedbackData.rating === 3 ? 'neutral' : 'negative';
        }

        const response = await api.post(`${FEEDBACK_BASE}/create/`, payload);

        const responseData = response.data;
        // Check if response has minimal expected data. If so, use standard transform.
        if (responseData && responseData.customer_name) {
            return transformFeedbackData(responseData);
        }

        // Fallback
        return {
            id: responseData.id || 'temp-' + Date.now(),
            ...feedbackData,
            date: new Date().toISOString().split('T')[0],
            sentiment: toTitleCase(payload.sentiment)
        };
    } catch (error) {
        console.error('Error creating feedback:', error);
        throw error;
    }
};

/**
 * Get feedback dashboard summary/stats
 * @returns {Promise<Object>} Stats object
 */
export const getFeedbackStats = async () => {
    try {
        const response = await api.get(`${FEEDBACK_BASE}/dashboard_summary/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching feedback stats:', error);
        throw error;
    }
};

/**
 * Fetch recent feedbacks
 * @returns {Promise<Array>} Array of recent feedback objects
 */
export const fetchRecentFeedbacks = async () => {
    try {
        const response = await api.get(`${FEEDBACK_BASE}/recent_feedback/`);
        return response.data.map(transformFeedbackData);
    } catch (error) {
        console.error('Error fetching recent feedbacks:', error);
        throw error;
    }
};


// Helper to map backend data (snake_case) to frontend data (camelCase)
const transformFeedbackData = (data) => {
    if (!data) return null;
    return {
        id: data.id,
        customerName: data.customer_name,
        email: data.email,
        rating: data.rating,
        category: toTitleCase(data.category), // snake_case to Title Case if needed? Postman shows 'service_quality'
        comments: data.comments,
        date: data.created_at || data.date || new Date().toISOString().split('T')[0],
        sentiment: toTitleCase(data.sentiment)
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
        rating: data.rating,
        category: data.category?.toLowerCase().replace(/ /g, '_'),
        comments: data.comments,
        sentiment: data.sentiment?.toLowerCase()
    };
};

export default {
    fetchFeedbacks,
    createFeedback,
    getFeedbackStats,
    fetchRecentFeedbacks
};
