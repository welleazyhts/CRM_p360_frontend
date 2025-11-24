import api from './api';

// Mock data for fallback
const defaultProposals = [
  {
    id: '1',
    proposalNumber: 'PROP-2024-001',
    customerName: 'Rajesh Sharma',
    policyType: 'Vehicle Insurance',
    coverageAmount: 500000,
    premium: 25000,
    status: 'Generated',
    generatedDate: '2024-01-15',
    agentName: 'Priya Patel'
  }
];

const defaultTimelines = [
  {
    policyId: 'POL-VEHICLE-987',
    events: []
  }
];

const defaultServicing = [
  {
    policyId: 'POL-VEHICLE-987',
    records: []
  }
];

// In-memory fallback storage (replaces localStorage for mock mode)
let mockProposals = [...defaultProposals];
let mockTimelines = [...defaultTimelines];
let mockServicing = [...defaultServicing];

// Proposals API
export async function listProposals() {
  try {
    const response = await api.get('/policies/proposals');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching proposals, using mock data:', error);
    return [...mockProposals].reverse();
  }
}

export async function getProposal(id) {
  try {
    const response = await api.get(`/policies/proposals/${id}`);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching proposal, using mock data:', error);
    return mockProposals.find(p => p.id === String(id)) || null;
  }
}

export async function generateProposal(payload = {}) {
  try {
    const response = await api.post('/policies/proposals', payload);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error generating proposal, using mock:', error);
    // Mock implementation
    const id = String(Date.now());
    const proposalNumber = `PROP-${new Date().getFullYear()}-${String(mockProposals.length + 1).padStart(3, '0')}`;
    const created = {
      id,
      proposalNumber,
      customerName: payload.customerName || payload.name || 'Unknown',
      policyType: payload.policyType || 'General',
      coverageAmount: payload.coverageAmount ? Number(payload.coverageAmount) : (payload.coverage || 0),
      premium: payload.premium ? Number(payload.premium) : 0,
      status: 'Generated',
      generatedDate: new Date().toISOString().split('T')[0],
      agentName: payload.agentName || 'N/A',
      raw: payload
    };
    mockProposals.push(created);
    return created;
  }
}

export async function downloadProposal(id) {
  try {
    const response = await api.get(`/policies/proposals/${id}/download`);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error downloading proposal, using mock:', error);
    const proposal = await getProposal(id);
    if (!proposal) throw new Error('Proposal not found');
    return {
      url: `data:application/json;base64,${btoa(JSON.stringify(proposal))}`,
      name: `${proposal.proposalNumber}.json`
    };
  }
}

export async function sendProposal(id, opts = {}) {
  try {
    const response = await api.post(`/policies/proposals/${id}/send`, opts);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error sending proposal, using mock:', error);
    const idx = mockProposals.findIndex(p => p.id === String(id));
    if (idx === -1) throw new Error('Not found');
    mockProposals[idx] = {
      ...mockProposals[idx],
      status: 'Sent',
      sentAt: new Date().toISOString(),
      sentBy: opts.sentBy || 'system'
    };
    return mockProposals[idx];
  }
}

// Timeline API
export async function getPolicyTimeline(policyId) {
  try {
    const response = await api.get(`/policies/${policyId}/timeline`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching timeline, using mock data:', error);
    const found = mockTimelines.find(t => t.policyId === policyId);
    return found ? found.events : [];
  }
}

export async function addTimelineEvent(policyId, event) {
  try {
    const response = await api.post(`/policies/${policyId}/timeline`, event);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding timeline event, using mock:', error);
    let bucket = mockTimelines.find(t => t.policyId === policyId);
    if (!bucket) {
      bucket = { policyId, events: [] };
      mockTimelines.push(bucket);
    }
    const id = `ev-${Date.now()}`;
    const created = { id, date: new Date().toISOString().split('T')[0], ...event };
    bucket.events.push(created);
    return created;
  }
}

export async function updateTimelineEvent(policyId, eventId, updates = {}) {
  try {
    const response = await api.put(`/policies/${policyId}/timeline/${eventId}`, updates);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating timeline event, using mock:', error);
    const bucket = mockTimelines.find(t => t.policyId === policyId);
    if (!bucket) throw new Error('Policy timeline not found');
    const idx = bucket.events.findIndex(e => e.id === eventId);
    if (idx === -1) throw new Error('Event not found');
    bucket.events[idx] = { ...bucket.events[idx], ...updates };
    return bucket.events[idx];
  }
}

export async function deleteTimelineEvent(policyId, eventId) {
  try {
    const response = await api.delete(`/policies/${policyId}/timeline/${eventId}`);
    return response.data?.success || true;
  } catch (error) {
    console.error('Error deleting timeline event, using mock:', error);
    const bucket = mockTimelines.find(t => t.policyId === policyId);
    if (!bucket) return false;
    bucket.events = bucket.events.filter(e => e.id !== eventId);
    return true;
  }
}

// Servicing API
export async function listServicingRecords(policyId) {
  try {
    const response = await api.get(`/policies/${policyId}/servicing`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching servicing records, using mock data:', error);
    const found = mockServicing.find(s => s.policyId === policyId);
    return found ? found.records : [];
  }
}

export async function addServicingRecord(policyId, record) {
  try {
    const response = await api.post(`/policies/${policyId}/servicing`, record);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding servicing record, using mock:', error);
    let bucket = mockServicing.find(s => s.policyId === policyId);
    if (!bucket) {
      bucket = { policyId, records: [] };
      mockServicing.push(bucket);
    }
    const id = `sr-${Date.now()}`;
    const created = { id, createdAt: new Date().toISOString(), ...record };
    bucket.records.push(created);
    return created;
  }
}

export async function updateServicingRecord(policyId, recordId, updates = {}) {
  try {
    const response = await api.put(`/policies/${policyId}/servicing/${recordId}`, updates);
    if (response.data) {
      return response.data;
    }
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating servicing record, using mock:', error);
    const bucket = mockServicing.find(s => s.policyId === policyId);
    if (!bucket) throw new Error('Policy servicing not found');
    const idx = bucket.records.findIndex(r => r.id === recordId);
    if (idx === -1) throw new Error('Record not found');
    bucket.records[idx] = { ...bucket.records[idx], ...updates };
    return bucket.records[idx];
  }
}

export async function deleteServicingRecord(policyId, recordId) {
  try {
    const response = await api.delete(`/policies/${policyId}/servicing/${recordId}`);
    return response.data?.success || true;
  } catch (error) {
    console.error('Error deleting servicing record, using mock:', error);
    const bucket = mockServicing.find(s => s.policyId === policyId);
    if (!bucket) return false;
    bucket.records = bucket.records.filter(r => r.id !== recordId);
    return true;
  }
}

const policyService = {
  listProposals,
  getProposal,
  generateProposal,
  downloadProposal,
  sendProposal,
  getPolicyTimeline,
  addTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  listServicingRecords,
  addServicingRecord,
  updateServicingRecord,
  deleteServicingRecord
};

export default policyService;
