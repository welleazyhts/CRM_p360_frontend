import api from './api';

const delay = (ms = 500) => new Promise(res => setTimeout(res, ms));

// In-memory fallback storage
let mockInsurers = [];
let mockProducts = [];

// Insurer operations
export const fetchInsurers = async () => {
  try {
    const response = await api.get('/insurers');
    if (response.data && Array.isArray(response.data)) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching insurers, using mock:', error);
    await delay(200);
    return [...mockInsurers];
  }
};

export const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    if (response.data && Array.isArray(response.data)) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching products, using mock:', error);
    await delay(200);
    return [...mockProducts];
  }
};

export const fetchAll = async () => {
  try {
    const response = await api.get('/insurers-products');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching all, using mock:', error);
    await delay(200);
    return {
      insurers: [...mockInsurers],
      products: [...mockProducts]
    };
  }
};

export const addInsurer = async (insurerData) => {
  try {
    const response = await api.post('/insurers', insurerData);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding insurer, using mock:', error);
    await delay(300);
    const newInsurer = {
      id: insurerData.id || `insurer-${Date.now()}`,
      ...insurerData,
      integrationStatus: insurerData.integrationStatus || 'pending',
      lastSyncedAt: insurerData.lastSyncedAt || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    mockInsurers.push(newInsurer);
    return newInsurer;
  }
};

export const updateInsurer = async (insurerId, updates) => {
  try {
    const response = await api.put(`/insurers/${insurerId}`, updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating insurer, using mock:', error);
    await delay(200);
    const idx = mockInsurers.findIndex(i => i.id === insurerId);
    if (idx === -1) throw new Error('Insurer not found');
    mockInsurers[idx] = { ...mockInsurers[idx], ...updates, updatedAt: new Date().toISOString() };
    return mockInsurers[idx];
  }
};

export const deleteInsurer = async (insurerId) => {
  try {
    const response = await api.delete(`/insurers/${insurerId}`);
    return response.data || { success: true };
  } catch (error) {
    console.error('Error deleting insurer, using mock:', error);
    await delay(200);
    const using = mockProducts.filter(p => p.insurerId === insurerId);
    if (using.length > 0) {
      return { success: false, error: `Cannot delete - ${using.length} product(s) reference this insurer` };
    }
    mockInsurers = mockInsurers.filter(i => i.id !== insurerId);
    return { success: true };
  }
};

export const testInsurerConnection = async (insurerId) => {
  try {
    const response = await api.post(`/insurers/${insurerId}/test`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error testing insurer connection, using mock:', error);
    await delay(1500);
    const idx = mockInsurers.findIndex(i => i.id === insurerId);
    if (idx === -1) return { success: false, error: 'Insurer not found' };
    const success = Math.random() > 0.25;
    mockInsurers[idx].integrationStatus = success ? 'connected' : 'error';
    mockInsurers[idx].lastSyncedAt = new Date().toISOString();
    return success ? { success: true, message: 'Connection successful' } : { success: false, error: 'Connection failed' };
  }
};

// Product operations
export const addProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error adding product, using mock:', error);
    await delay(300);
    const newProduct = {
      id: productData.id || `prod-${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProducts.push(newProduct);
    return newProduct;
  }
};

export const updateProduct = async (productId, updates) => {
  try {
    const response = await api.put(`/products/${productId}`, updates);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error updating product, using mock:', error);
    await delay(200);
    const idx = mockProducts.findIndex(p => p.id === productId);
    if (idx === -1) throw new Error('Product not found');
    mockProducts[idx] = { ...mockProducts[idx], ...updates, updatedAt: new Date().toISOString() };
    return mockProducts[idx];
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data || { success: true };
  } catch (error) {
    console.error('Error deleting product, using mock:', error);
    await delay(200);
    mockProducts = mockProducts.filter(p => p.id !== productId);
    return { success: true };
  }
};

export const duplicateProduct = async (productId) => {
  try {
    const response = await api.post(`/products/${productId}/duplicate`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error duplicating product, using mock:', error);
    await delay(250);
    const prod = mockProducts.find(p => p.id === productId);
    if (!prod) return { success: false, error: 'Product not found' };
    const dup = {
      ...prod,
      id: `prod-${Date.now()}`,
      name: `${prod.name} (Copy)`,
      status: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProducts.push(dup);
    return { success: true, product: dup };
  }
};

// Query operations
export const getInsurerById = async (insurerId) => {
  try {
    const response = await api.get(`/insurers/${insurerId}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching insurer by id, using mock:', error);
    await delay(100);
    return mockInsurers.find(i => i.id === insurerId) || null;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching product by id, using mock:', error);
    await delay(100);
    return mockProducts.find(p => p.id === productId) || null;
  }
};

export const getProductsByInsurer = async (insurerId) => {
  try {
    const response = await api.get(`/products/by-insurer/${insurerId}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching products by insurer, using mock:', error);
    await delay(100);
    return mockProducts.filter(p => p.insurerId === insurerId);
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/products/by-category/${category}`);
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching products by category, using mock:', error);
    await delay(100);
    return mockProducts.filter(p => p.category === category);
  }
};

export const getStatistics = async () => {
  try {
    const response = await api.get('/insurers-products/stats');
    if (response.data) return response.data;
    throw new Error('No data from API');
  } catch (error) {
    console.error('Error fetching statistics, using mock:', error);
    await delay(150);
    return {
      totalInsurers: mockInsurers.length,
      activeInsurers: mockInsurers.filter(i => i.status === 'active').length,
      connectedInsurers: mockInsurers.filter(i => i.integrationStatus === 'connected').length,
      totalProducts: mockProducts.length,
      activeProducts: mockProducts.filter(p => p.status === 'active').length
    };
  }
};
