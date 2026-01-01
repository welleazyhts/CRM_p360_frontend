import api from './api';

// Base endpoint for customer feedback management
const FEEDBACK_BASE = '/customer_feedback_management';

// Helper to convert snake_case or lowercase to Title Case
const toTitleCase = (str) => {
  if (!str) return '';
  // Replace underscores with spaces and capitalize words
  return str.toString().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper to map backend data (snake_case) to frontend data (camelCase)
const transformFeedbackData = (data) => {
  if (!data) return null;
  return {
    id: data.id,
    customer: data.customer_name || data.customer, // Map to 'customer' as likely expected by Feedback.jsx
    customerName: data.customer_name, // keep both for compatibility
    email: data.email,
    customerEmail: data.email, // compatibility
    phone: data.phone,
    customerPhone: data.phone, // compatibility
    rating: data.rating,
    category: toTitleCase(data.category),
    message: data.comments, // 'comments' from backend maps to 'message' in frontend usually
    comments: data.comments,
    fullMessage: data.comments, // fallback
    date: data.created_at || data.date || new Date().toISOString(),
    sentiment: toTitleCase(data.sentiment),
    status: toTitleCase(data.status) || 'Unaddressed',
    channel: data.channel || 'web',
    flagged: data.flagged || false,
    priority: data.priority || 'medium'
  };
};

const mapToBackendData = (data) => {
  return {
    customer_name: data.customerName || data.customer,
    email: data.email || data.customerEmail,
    phone: data.phone || data.customerPhone,
    rating: data.rating,
    category: data.category?.toLowerCase().replace(/ /g, '_'),
    comments: data.comments || data.message,
    sentiment: data.sentiment?.toLowerCase(),
    status: data.status?.toLowerCase(),
    priority: data.priority,
    flagged: data.flagged
  };
};

/** Feedback API **/
export async function listFeedback() {
  try {
    const response = await api.get(`${FEEDBACK_BASE}/list/`);
    return response.data.map(transformFeedbackData);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
}

export async function getRecentFeedback() {
  try {
    const response = await api.get(`${FEEDBACK_BASE}/recent_feedback/`);
    return response.data.map(transformFeedbackData);
  } catch (error) {
    console.error('Error fetching recent feedback:', error);
    throw error;
  }
}

export async function submitFeedback(payload) {
  try {
    const backendPayload = mapToBackendData(payload);
    if (!backendPayload.sentiment && payload.rating) {
      backendPayload.sentiment = payload.rating >= 4 ? 'positive' : payload.rating === 3 ? 'neutral' : 'negative';
    }

    const response = await api.post(`${FEEDBACK_BASE}/create/`, backendPayload);
    const responseData = response.data;

    if (responseData && responseData.customer_name) {
      return transformFeedbackData(responseData);
    }

    // Fallback
    return {
      id: responseData.id || 'temp-' + Date.now(),
      ...payload,
      date: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}

export async function getFeedbackStats() {
  try {
    const response = await api.get(`${FEEDBACK_BASE}/dashboard_summary/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    throw error;
  }
}

// Stubbed Survey functions (as no API provided yet)
export async function listSurveys() {
  return []; // Return empty or keep mock if crucial, but "remove hardcoded data" suggests clearing it.
}

export async function getSurvey(id) {
  return null;
}

export async function saveSurvey(survey) {
  // Minimal mock implementation to prevent crash if used
  return { ...survey, id: survey.id || 's-' + Date.now() };
}

export async function publishSurvey(id, info) {
  return { id, status: 'published', ...info };
}

export async function deleteSurvey(id) {
  return { success: true };
}

// Retain compatibility with existing calls
export const updateFeedback = async (id, updates) => {
  // Implement if backend supports update, otherwise just return mock success or error
  // No update endpoint provided in Postman, maybe PATCH on create?
  // For now, minimal stub
  return { id, ...updates };
}

export const deleteFeedback = async (id) => {
  // No delete endpoint provided
  return { success: true };
}

export default {
  listFeedback,
  getRecentFeedback,
  submitFeedback,
  updateFeedback, // provisional
  deleteFeedback, // provisional
  getFeedbackStats,
  listSurveys,
  getSurvey,
  saveSurvey,
  publishSurvey,
  deleteSurvey
};
