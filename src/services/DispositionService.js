import api from './api';

const delay = (ms = 200) => new Promise(res => setTimeout(res, ms));

// In‑memory fallback data
let mockDispositions = [];

/** Fetch all dispositions **/
export const fetchDispositions = async () => {
  try {
    const response = await api.get('/dispositions');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching dispositions, using mock:', error);
    await delay();
    return [...mockDispositions];
  }
};

/** Add a new disposition **/
export const addDisposition = async (dispositionData) => {
  try {
    const response = await api.post('/dispositions', dispositionData);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding disposition, using mock:', error);
    await delay();
    const newDisp = {
      ...dispositionData,
      id: dispositionData.id || `disp-${Date.now()}`,
      subDispositions: dispositionData.subDispositions || [],
      createdAt: new Date().toISOString()
    };
    mockDispositions.push(newDisp);
    return newDisp;
  }
};

/** Update an existing disposition **/
export const updateDisposition = async (dispId, updates) => {
  try {
    const response = await api.put(`/dispositions/${dispId}`, updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating disposition, using mock:', error);
    await delay();
    const idx = mockDispositions.findIndex(d => d.id === dispId);
    if (idx === -1) throw new Error('Disposition not found');
    mockDispositions[idx] = { ...mockDispositions[idx], ...updates, updatedAt: new Date().toISOString() };
    return mockDispositions[idx];
  }
};

/** Delete a disposition **/
export const deleteDisposition = async (dispId) => {
  try {
    const response = await api.delete(`/dispositions/${dispId}`);
    return response.data || { success: true };
  } catch (error) {
    console.error('Error deleting disposition, using mock:', error);
    await delay();
    mockDispositions = mockDispositions.filter(d => d.id !== dispId);
    return { success: true };
  }
};

/** Reorder dispositions **/
export const reorderDispositions = async (newOrderArray) => {
  try {
    const response = await api.put('/dispositions/reorder', newOrderArray);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error reordering dispositions, using mock:', error);
    await delay();
    mockDispositions = [...newOrderArray];
    return { success: true };
  }
};

/** Toggle active flag **/
export const toggleDisposition = async (dispId) => {
  try {
    const response = await api.post(`/dispositions/${dispId}/toggle`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error toggling disposition, using mock:', error);
    await delay();
    const idx = mockDispositions.findIndex(d => d.id === dispId);
    if (idx === -1) throw new Error('Disposition not found');
    mockDispositions[idx].active = !mockDispositions[idx].active;
    mockDispositions[idx].updatedAt = new Date().toISOString();
    return mockDispositions[idx];
  }
};

/** Sub‑disposition CRUD **/
export const addSubDisposition = async (dispId, subDispData) => {
  try {
    const response = await api.post(`/dispositions/${dispId}/sub`, subDispData);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding sub‑disposition, using mock:', error);
    await delay();
    const disp = mockDispositions.find(d => d.id === dispId);
    if (!disp) throw new Error('Disposition not found');
    const newSub = { ...subDispData, id: subDispData.id || `sub-${Date.now()}`, createdAt: new Date().toISOString() };
    disp.subDispositions = disp.subDispositions || [];
    disp.subDispositions.push(newSub);
    disp.updatedAt = new Date().toISOString();
    return newSub;
  }
};

export const updateSubDisposition = async (dispId, subDispId, updates) => {
  try {
    const response = await api.put(`/dispositions/${dispId}/sub/${subDispId}`, updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating sub‑disposition, using mock:', error);
    await delay();
    const disp = mockDispositions.find(d => d.id === dispId);
    if (!disp) throw new Error('Disposition not found');
    disp.subDispositions = disp.subDispositions || [];
    const idx = disp.subDispositions.findIndex(s => s.id === subDispId);
    if (idx === -1) throw new Error('Sub‑disposition not found');
    disp.subDispositions[idx] = { ...disp.subDispositions[idx], ...updates, updatedAt: new Date().toISOString() };
    disp.updatedAt = new Date().toISOString();
    return disp.subDispositions[idx];
  }
};

export const deleteSubDisposition = async (dispId, subDispId) => {
  try {
    const response = await api.delete(`/dispositions/${dispId}/sub/${subDispId}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error deleting sub‑disposition, using mock:', error);
    await delay();
    const disp = mockDispositions.find(d => d.id === dispId);
    if (!disp) throw new Error('Disposition not found');
    disp.subDispositions = (disp.subDispositions || []).filter(s => s.id !== subDispId);
    disp.updatedAt = new Date().toISOString();
    return { success: true };
  }
};

export const toggleSubDisposition = async (dispId, subDispId) => {
  try {
    const response = await api.post(`/dispositions/${dispId}/sub/${subDispId}/toggle`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error toggling sub‑disposition, using mock:', error);
    await delay();
    const disp = mockDispositions.find(d => d.id === dispId);
    if (!disp) throw new Error('Disposition not found');
    const sub = (disp.subDispositions || []).find(s => s.id === subDispId);
    if (!sub) throw new Error('Sub‑disposition not found');
    sub.active = !sub.active;
    sub.updatedAt = new Date().toISOString();
    disp.updatedAt = new Date().toISOString();
    return sub;
  }
};

/** Query helpers **/
export const getDispositionById = async (dispId) => {
  try {
    const response = await api.get(`/dispositions/${dispId}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching disposition by id, using mock:', error);
    await delay();
    return mockDispositions.find(d => d.id === dispId) || null;
  }
};

export const getDispositionsByCategory = async (category) => {
  try {
    const response = await api.get(`/dispositions/category/${category}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching dispositions by category, using mock:', error);
    await delay();
    return mockDispositions.filter(d => d.category === category);
  }
};

export const getActiveDispositions = async () => {
  try {
    const response = await api.get('/dispositions/active');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching active dispositions, using mock:', error);
    await delay();
    return mockDispositions.filter(d => d.active);
  }
};

export const getStatistics = async () => {
  try {
    const response = await api.get('/dispositions/stats');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching disposition stats, using mock:', error);
    await delay();
    const total = mockDispositions.length;
    const active = mockDispositions.filter(d => d.active).length;
    const totalSub = mockDispositions.reduce((sum, d) => sum + (d.subDispositions?.length || 0), 0);
    const activeSub = mockDispositions.reduce((sum, d) => sum + (d.subDispositions?.filter(s => s.active).length || 0), 0);
    const byCategory = {};
    mockDispositions.forEach(d => {
      const cat = d.category || 'uncategorized';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });
    return { totalDispositions: total, activeDispositions: active, totalSubDispositions: totalSub, activeSubDispositions: activeSub, byCategory };
  }
};

export default {
  fetchDispositions,
  addDisposition,
  updateDisposition,
  deleteDisposition,
  reorderDispositions,
  toggleDisposition,
  addSubDisposition,
  updateSubDisposition,
  deleteSubDisposition,
  toggleSubDisposition,
  getDispositionById,
  getDispositionsByCategory,
  getActiveDispositions,
  getStatistics
};
