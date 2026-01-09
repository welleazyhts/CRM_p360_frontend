import React, { createContext, useContext, useState, useEffect } from 'react';
import InsurerProductService from '../services/InsurerProductService';

const InsurerProductContext = createContext();

export const useInsurerProduct = () => {
  const context = useContext(InsurerProductContext);
  if (!context) {
    throw new Error('useInsurerProduct must be used within InsurerProductProvider');
  }
  return context;
};

export const InsurerProductProvider = ({ children }) => {
  const [insurers, setInsurers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalInsurers: 0,
    activeInsurers: 0,
    connectedInsurers: 0,
    totalProducts: 0,
    activeProducts: 0,
    productsByCategory: {
      motor: 0,
      health: 0,
      travel: 0,
      home: 0,
      other: 0
    }
  });

  // Helper functions to normalize API data (snake_case) to frontend model (camelCase)
  const normalizeInsurer = (data) => {
    if (!data) return null;
    return {
      ...data,
      id: data.id,
      name: data.name || data.short_name || '',
      fullName: data.fullName || data.legal_name || '',
      logo: data.logo || data.logo_url || '',
      apiEndpoint: data.apiEndpoint || data.api_endpoint || '',
      apiKey: data.apiKey || data.api_key || '',
      apiSecret: data.apiSecret || data.api_secret || '',
      supportedProducts: data.supportedProducts || data.supported_categories || [],
      contactEmail: data.contactEmail || data.contact_email || '',
      contactPhone: data.contactPhone || data.contact_phone || '',
      integrationStatus: (data.integrationStatus || data.IntegrationStatus || data.integration_status || 'pending').toLowerCase(),
      lastSyncedAt: data.lastSyncedAt || data.last_synced_at || new Date().toISOString(),
      // Ensure status is handled if API uses different values
      status: (data.status || data.Status || (data.is_active ? 'active' : 'inactive')).toLowerCase(),
      settings: data.settings || {
        autoQuote: data.enable_auto_quote ?? true,
        realTimeVerification: data.enable_real_time_verification ?? true,
        webhookUrl: data.webhook_url || '',
        webhookSecret: data.webhook_secret || '',
        timeout: data.timeout_seconds || 30,
        retryAttempts: data.retry_attempts || 3
      }
    };
  };

  const normalizeProduct = (data) => {
    if (!data) return null;
    return {
      ...data,
      id: data.id,
      name: data.name || data.product_name || '',
      insurerId: data.insurerId || data.insurer || '',
      category: data.category || '',
      subCategory: data.subCategory || data.sub_category || '',
      description: data.description || '',
      premiumRules: data.premiumRules || data.premium_rules || {},
      features: data.features || [],
      addOns: data.addOns || data.add_ons || [],
      status: data.status || (data.is_active ? 'active' : 'inactive'),
      createdAt: data.createdAt || data.created_at || new Date().toISOString(),
      updatedAt: data.updatedAt || data.updated_at || new Date().toISOString()
    };
  };

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await InsurerProductService.fetchAll();

      const normalizedInsurers = (data.insurers || []).map(normalizeInsurer);
      const normalizedProducts = (data.products || []).map(normalizeProduct);

      if (normalizedInsurers.length === 0) {
        // Fallback demo insurer if API returns empty, per user request to "add insurer"
        normalizedInsurers.push(normalizeInsurer({
          id: 'demo-insurer-1',
          name: 'Demo Insurer',
          short_name: 'Demo',
          legal_name: 'Demo General Insurance Ltd',
          logo_url: '',
          integration_status: 'connected',
          is_active: true,
          settings: {}
        }));
      }

      setInsurers(normalizedInsurers);
      setProducts(normalizedProducts);

      if (data.stats) {
        updateLocalStats(normalizedInsurers, normalizedProducts, data.stats);
      } else {
        updateLocalStats(normalizedInsurers, normalizedProducts);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      // Fallback empty state is already set, but let's ensure we have the demo one even on error if needed
      // For now, only on empty success response.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateLocalStats = (currentInsurers, currentProducts, apiStats = null) => {
    // If API provides stats, we can use them or merge.
    // For now, let's calculate locally for immediate UI updates if API stats are not granular enough
    // or simply rely on what we have.
    const calculatedStats = {
      totalInsurers: currentInsurers.length,
      activeInsurers: currentInsurers.filter(i => i.status === 'active').length,
      connectedInsurers: currentInsurers.filter(i => i.integrationStatus === 'connected').length,
      totalProducts: currentProducts.length,
      activeProducts: currentProducts.filter(p => p.status === 'active').length,
      productsByCategory: {
        motor: currentProducts.filter(p => p.category === 'motor').length,
        health: currentProducts.filter(p => p.category === 'health').length,
        travel: currentProducts.filter(p => p.category === 'travel').length,
        home: currentProducts.filter(p => p.category === 'home').length,
        other: currentProducts.filter(p => !['motor', 'health', 'travel', 'home'].includes(p.category)).length
      }
    };
    setStats(calculatedStats);
  };


  // Insurer Management Functions
  const addInsurer = async (insurerData) => {
    setLoading(true);
    try {
      // Map frontend keys to backend keys if needed, but usually we send what we have 
      // and backend might be flexible or we map before sending.
      // For now, assuming backend accepts what we send or we adjust Service to map.
      // Ideally Service should handle Request mapping, Context handles Response mapping.
      // But let's verify what `addInsurer` returns.
      const rawNewInsurer = await InsurerProductService.addInsurer(insurerData);
      const newInsurer = normalizeInsurer(rawNewInsurer);

      setInsurers(prev => {
        const updated = [...prev, newInsurer];
        updateLocalStats(updated, products);
        return updated;
      });
      return { success: true, insurer: newInsurer };
    } catch (error) {
      console.error('Error adding insurer:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateInsurer = async (insurerId, updates) => {
    setLoading(true);
    try {
      const rawUpdatedInsurer = await InsurerProductService.updateInsurer(insurerId, updates);
      const updatedInsurer = normalizeInsurer(rawUpdatedInsurer);

      setInsurers(prev => {
        const updated = prev.map(ins => ins.id === insurerId ? updatedInsurer : ins);
        updateLocalStats(updated, products);
        return updated;
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating insurer:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteInsurer = async (insurerId) => {
    setLoading(true);
    try {
      const result = await InsurerProductService.deleteInsurer(insurerId);
      if (result.success !== false) {
        setInsurers(prev => {
          const updated = prev.filter(ins => ins.id !== insurerId);
          updateLocalStats(updated, products);
          return updated;
        });
        return { success: true };
      }
      return { success: false, error: result.error || 'Failed to delete insurer' };
    } catch (error) {
      console.error('Error deleting insurer:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const testInsurerConnection = async (insurerId) => {
    setLoading(true);
    try {
      const response = await InsurerProductService.testInsurerConnection(insurerId);
      if (response && (response.success || response.status === 'success' || response.message === 'Connection successful')) {
        // Optionally refresh data to get latest status if the backend updates it
        // Or optimistically update
        setInsurers(prev => prev.map(ins =>
          ins.id === insurerId ? { ...ins, integrationStatus: 'connected', lastSyncedAt: new Date().toISOString() } : ins
        ));
        return { success: true, message: 'Connection successful' };
      }
      return { success: false, error: response.error || 'Connection failed' };
    } catch (error) {
      console.error('Error testing connection:', error);
      // Optimistically update to error
      setInsurers(prev => prev.map(ins =>
        ins.id === insurerId ? { ...ins, integrationStatus: 'error' } : ins
      ));
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleInsurerStatus = async (insurerId) => {
    try {
      const result = await InsurerProductService.toggleInsurer(insurerId);
      // The API might return the updated insurer object or just success
      // If it returns object, normalize it.

      const insurer = insurers.find(i => i.id === insurerId);
      if (insurer) {
        // Fallback toggle if API doesn't return status
        const newStatus = insurer.status === 'active' ? 'inactive' : 'active';
        // If result has status, use it
        const finalStatus = result.status || (result.is_active ? 'active' : 'inactive') || newStatus;

        setInsurers(prev => {
          const updated = prev.map(ins => ins.id === insurerId ? { ...ins, status: finalStatus } : ins);
          updateLocalStats(updated, products);
          return updated;
        });
        return { success: true, status: finalStatus };
      }
      return { success: false, error: "Insurer not found local" };
    } catch (error) {
      console.error("Error toggling insurer:", error);
      return { success: false, error: error.message };
    }
  };

  // Product Management Functions
  const addProduct = async (productData) => {
    setLoading(true);
    try {
      const rawNewProduct = await InsurerProductService.addProduct(productData);
      const newProduct = normalizeProduct(rawNewProduct);

      setProducts(prev => {
        const updated = [...prev, newProduct];
        updateLocalStats(insurers, updated);
        return updated;
      });
      return { success: true, product: newProduct };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, updates) => {
    setLoading(true);
    try {
      const rawUpdatedProduct = await InsurerProductService.updateProduct(productId, updates);
      const updatedProduct = normalizeProduct(rawUpdatedProduct);

      setProducts(prev => {
        const updated = prev.map(prod => prod.id === productId ? updatedProduct : prod);
        updateLocalStats(insurers, updated);
        return updated;
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      await InsurerProductService.deleteProduct(productId);
      setProducts(prev => {
        const updated = prev.filter(prod => prod.id !== productId);
        updateLocalStats(insurers, updated);
        return updated;
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId) => {
    try {
      const result = await InsurerProductService.toggleProduct(productId);
      const product = products.find(p => p.id === productId);
      if (product) {
        const newStatus = product.status === 'active' ? 'inactive' : 'active';
        const finalStatus = result.status || (result.is_active ? 'active' : 'inactive') || newStatus;

        setProducts(prev => {
          const updated = prev.map(p => p.id === productId ? { ...p, status: finalStatus } : p);
          updateLocalStats(insurers, updated);
          return updated;
        });
        return { success: true, status: finalStatus };
      }
      return { success: false, error: "Product not found local" };
    } catch (error) {
      console.error('Error toggling product:', error);
      return { success: false, error: error.message };
    }
  };

  const duplicateProduct = async (productId) => {
    setLoading(true);
    try {
      const result = await InsurerProductService.duplicateProduct(productId);
      const rawNewProduct = result.product || result;
      const newProduct = normalizeProduct(rawNewProduct);

      setProducts(prev => {
        const updated = [...prev, newProduct];
        updateLocalStats(insurers, updated);
        return updated;
      });
      return { success: true, product: newProduct };
    } catch (error) {
      console.error('Error duplicating product:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Query Functions
  const getInsurerById = (insurerId) => {
    return insurers.find(ins => ins.id === insurerId || ins.id == insurerId);
  };

  const getProductById = (productId) => {
    return products.find(prod => prod.id === productId || prod.id == productId);
  };

  const getProductsByInsurer = (insurerId) => {
    return products.filter(prod => prod.insurerId === insurerId || prod.insurerId == insurerId);
  };

  const getProductsByCategory = (category) => {
    return products.filter(prod => prod.category === category);
  };

  const getActiveInsurers = () => {
    return insurers.filter(ins => ins.status === 'active');
  };

  const getActiveProducts = () => {
    return products.filter(prod => prod.status === 'active');
  };

  // Statistics
  const getStatistics = () => {
    return stats;
  };

  const value = {
    // State
    insurers,
    products,
    loading,

    // Insurer Functions
    addInsurer,
    updateInsurer,
    deleteInsurer,
    testInsurerConnection,
    toggleInsurerStatus,
    getInsurerById,
    getActiveInsurers,

    // Product Functions
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    duplicateProduct,
    getProductById,
    getProductsByInsurer,
    getProductsByCategory,
    getActiveProducts,

    // Statistics
    getStatistics
  };

  return (
    <InsurerProductContext.Provider value={value}>
      {children}
    </InsurerProductContext.Provider>
  );
};
