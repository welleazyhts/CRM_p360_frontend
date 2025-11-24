import api from './api';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

// In‑memory fallback data
let mockFeedback = [
  {
    id: '1',
    customer: 'Arjun Sharma',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1234567890',
    rating: 5,
    category: 'Service Quality',
    message: 'Excellent service! Very satisfied with the claim process.',
    fullMessage: 'Excellent service! Very satisfied with the claim process. The agent was professional and resolved my issue quickly.',
    date: '2024-12-28T10:30:00Z',
    status: 'resolved',
    sentiment: 'positive',
    channel: 'email',
    flagged: false,
    hasAttachments: false,
    assignedTo: 'Alice Cooper',
    tags: ['Appreciation', 'Claims'],
    priority: 'low'
  }
];

let mockSurveys = [
  {
    id: 's-1',
    title: 'Customer Satisfaction Survey',
    description: 'Quarterly CSAT for product feedback',
    type: 'CSAT',
    theme: 'default',
    language: 'en',
    elements: [],
    status: 'draft',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    publishInfo: null
  }
];

/** Feedback API **/
export async function listFeedback() {
  try {
    const response = await api.get('/feedback');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching feedback, using mock:', error);
    await delay();
    return [...mockFeedback].reverse();
  }
}

export async function getFeedback(id) {
  try {
    const response = await api.get(`/feedback/${id}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching feedback item, using mock:', error);
    await delay();
    return mockFeedback.find(f => f.id === String(id)) || null;
  }
}

export async function submitFeedback(payload) {
  try {
    const response = await api.post('/feedback', payload);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error submitting feedback, using mock:', error);
    await delay();
    const newItem = { id: String(Date.now()), date: new Date().toISOString(), ...payload };
    mockFeedback.push(newItem);
    return newItem;
  }
}

export async function updateFeedback(id, updates) {
  try {
    const response = await api.put(`/feedback/${id}`, updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating feedback, using mock:', error);
    await delay();
    const idx = mockFeedback.findIndex(f => f.id === String(id));
    if (idx === -1) throw new Error('Feedback not found');
    mockFeedback[idx] = { ...mockFeedback[idx], ...updates };
    return mockFeedback[idx];
  }
}

export async function deleteFeedback(id) {
  try {
    const response = await api.delete(`/feedback/${id}`);
    return response.data || { success: true };
  } catch (error) {
    console.error('Error deleting feedback, using mock:', error);
    await delay();
    mockFeedback = mockFeedback.filter(f => f.id !== String(id));
    return { success: true };
  }
}

/** Survey API **/
export async function listSurveys() {
  try {
    const response = await api.get('/surveys');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching surveys, using mock:', error);
    await delay();
    return [...mockSurveys].reverse();
  }
}

export async function getSurvey(id) {
  try {
    const response = await api.get(`/surveys/${id}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching survey, using mock:', error);
    await delay();
    return mockSurveys.find(s => s.id === String(id)) || null;
  }
}

export async function saveSurvey(survey) {
  try {
    const response = await api.post('/surveys', survey);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error saving survey, using mock:', error);
    await delay();
    if (survey && survey.id) {
      const idx = mockSurveys.findIndex(s => s.id === survey.id);
      const updated = { ...mockSurveys[idx], ...survey, updatedAt: new Date().toISOString() };
      if (idx === -1) mockSurveys.push(updated); else mockSurveys[idx] = updated;
      return updated;
    }
    const newSurvey = { id: `s-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'draft', ...survey };
    mockSurveys.push(newSurvey);
    return newSurvey;
  }
}

export async function publishSurvey(id, publishInfo = {}) {
  try {
    const response = await api.post(`/surveys/${id}/publish`, publishInfo);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error publishing survey, using mock:', error);
    await delay();
    const idx = mockSurveys.findIndex(s => s.id === String(id));
    if (idx === -1) throw new Error('Survey not found');
    const shortLink = publishInfo.generateShortLink ? `https://short.local/${id}` : null;
    const qrCode = publishInfo.generateQrCode ? `data:image/svg+xml;utf8,<svg><!-- qr:${id} --></svg>` : null;
    const updated = {
      ...mockSurveys[idx],
      status: 'published',
      publishInfo: { ...publishInfo, shortLink, qrCode, publishedAt: new Date().toISOString() },
      updatedAt: new Date().toISOString()
    };
    mockSurveys[idx] = updated;
    return updated;
  }
}

export async function deleteSurvey(id) {
  try {
    const response = await api.delete(`/surveys/${id}`);
    return response.data || { success: true };
  } catch (error) {
    console.error('Error deleting survey, using mock:', error);
    await delay();
    mockSurveys = mockSurveys.filter(s => s.id !== String(id));
    return { success: true };
  }
}

export default {
  listFeedback,
  getFeedback,
  submitFeedback,
  updateFeedback,
  deleteFeedback,
  listSurveys,
  getSurvey,
  saveSurvey,
  publishSurvey,
  deleteSurvey
};
