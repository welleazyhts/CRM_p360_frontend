import api from './api';

// Insurer operations
export const fetchInsurers = async () => {
  try {
    const response = await api.get('/insurers/list/');
    // Handle pagination or direct array
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    if (data && Array.isArray(data.data)) return data.data; // Some APIs wrap in data field
    return [];
  } catch (error) {
    console.error('Error fetching insurers:', error);
    throw error;
  }
};

export const addInsurer = async (insurerData) => {
  try {
    const response = await api.post('/insurers/create/', insurerData);
    return response.data;
  } catch (error) {
    console.error('Error adding insurer:', error);
    throw error;
  }
};

export const testInsurerConnection = async (insurerId) => {
  try {
    const response = await api.post(`/insurers/test-connection/${insurerId}/`, { mock: true }); // Found mock: true in Postman body, might need it or dynamic
    return response.data;
  } catch (error) {
    console.error('Error testing insurer connection:', error);
    throw error;
  }
};

export const updateInsurer = async (insurerId, updates) => {
  try {
    const response = await api.patch(`/insurers/update/${insurerId}/`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating insurer:', error);
    throw error;
  }
};

export const deleteInsurer = async (insurerId) => {
  try {
    const response = await api.delete(`/insurers/delete/${insurerId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting insurer:', error);
    throw error;
  }
};

export const toggleInsurer = async (insurerId) => {
  try {
    const response = await api.patch(`/insurers/toggle/${insurerId}/`);
    return response.data;
  } catch (error) {
    console.error('Error toggling insurer:', error);
    throw error;
  }
};

// Product operations
export const addProduct = async (productData) => {
  try {
    const response = await api.post('/insurers/products/create/', productData);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await api.get('/insurers/products/list/');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const duplicateProduct = async (productId) => {
  try {
    const response = await api.post(`/insurers/products/copy/${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error duplicating product:', error);
    throw error;
  }
};

export const toggleProduct = async (productId) => {
  try {
    const response = await api.patch(`/insurers/products/toggle/${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error toggling product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, updates) => {
  try {
    const response = await api.patch(`/insurers/products/update/${productId}/`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/insurers/products/delete/${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Dashboard/Stats
export const getStatistics = async () => {
  try {
    const response = await api.get('/insurers/stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

// Composite fetch for convenience, if needed, or we can just fetch separately in the UI
export const fetchAll = async () => {
  try {
    const [insurers, products, stats] = await Promise.all([
      fetchInsurers(),
      fetchProducts(),
      getStatistics()
    ]);
    return {
      insurers,
      products,
      stats
    };
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw error;
  }
};

export const getInsurerById = async (insurerId) => {
  // There isn't a direct "get by id" in the Postman collection,
  // so we might need tof etch all and find, OR assume the standard pattern if supported.
  // For now, let's fetch all and filter to be safe, or just rely on the list we have in state.
  // However, usually detailed view might need a specific call.
  // Given the collection, let's try reading from list.
  const insurers = await fetchInsurers();
  return insurers.find(i => i.id === insurerId || i.id === parseInt(insurerId));
};

export default {
  fetchInsurers,
  addInsurer,
  testInsurerConnection,
  updateInsurer,
  deleteInsurer,
  toggleInsurer,
  addProduct,
  fetchProducts,
  duplicateProduct,
  toggleProduct,
  updateProduct,
  deleteProduct,
  getStatistics,
  fetchAll,
  getInsurerById
};
