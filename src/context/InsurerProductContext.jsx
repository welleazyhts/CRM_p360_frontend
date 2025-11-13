import React, { createContext, useContext, useState, useEffect } from 'react';

const InsurerProductContext = createContext();

export const useInsurerProduct = () => {
  const context = useContext(InsurerProductContext);
  if (!context) {
    throw new Error('useInsurerProduct must be used within InsurerProductProvider');
  }
  return context;
};

// Mock data for insurers
const INITIAL_INSURERS = [
  {
    id: 'tata-aig',
    name: 'Tata AIG',
    fullName: 'Tata AIG General Insurance Company Limited',
    status: 'active',
    logo: 'https://via.placeholder.com/150?text=Tata+AIG',
    apiEndpoint: 'https://api.tataaig.com/v1',
    apiKey: 'test_key_tataaig_***',
    apiSecret: '***hidden***',
    supportedProducts: ['motor', 'health', 'travel'],
    contactEmail: 'support@tataaig.com',
    contactPhone: '+91-1800-266-7780',
    integrationStatus: 'connected',
    lastSyncedAt: '2025-01-10T10:30:00Z',
    settings: {
      autoQuote: true,
      realTimeVerification: true,
      webhookUrl: 'https://api.yourapp.com/webhooks/tataaig',
      timeout: 30,
      retryAttempts: 3
    }
  },
  {
    id: 'reliance',
    name: 'Reliance General',
    fullName: 'Reliance General Insurance Company Limited',
    status: 'active',
    logo: 'https://via.placeholder.com/150?text=Reliance',
    apiEndpoint: 'https://api.reliancegeneral.com/v2',
    apiKey: 'test_key_reliance_***',
    apiSecret: '***hidden***',
    supportedProducts: ['motor', 'health', 'home', 'travel'],
    contactEmail: 'support@reliancegeneral.co.in',
    contactPhone: '+91-1800-3009',
    integrationStatus: 'connected',
    lastSyncedAt: '2025-01-10T09:15:00Z',
    settings: {
      autoQuote: true,
      realTimeVerification: false,
      webhookUrl: 'https://api.yourapp.com/webhooks/reliance',
      timeout: 45,
      retryAttempts: 2
    }
  },
  {
    id: 'godigit',
    name: 'Go Digit',
    fullName: 'Go Digit General Insurance Limited',
    status: 'active',
    logo: 'https://via.placeholder.com/150?text=Go+Digit',
    apiEndpoint: 'https://api.godigit.com/api/v1',
    apiKey: 'test_key_godigit_***',
    apiSecret: '***hidden***',
    supportedProducts: ['motor', 'health', 'travel'],
    contactEmail: 'support@godigit.com',
    contactPhone: '+91-1800-258-5956',
    integrationStatus: 'testing',
    lastSyncedAt: '2025-01-09T16:45:00Z',
    settings: {
      autoQuote: false,
      realTimeVerification: true,
      webhookUrl: 'https://api.yourapp.com/webhooks/godigit',
      timeout: 30,
      retryAttempts: 3
    }
  },
  {
    id: 'hdfc-ergo',
    name: 'HDFC ERGO',
    fullName: 'HDFC ERGO General Insurance Company Limited',
    status: 'inactive',
    logo: 'https://via.placeholder.com/150?text=HDFC+ERGO',
    apiEndpoint: 'https://api.hdfcergo.com/v1',
    apiKey: 'test_key_hdfc_***',
    apiSecret: '***hidden***',
    supportedProducts: ['motor', 'health', 'home'],
    contactEmail: 'support@hdfcergo.com',
    contactPhone: '+91-1800-266-9655',
    integrationStatus: 'error',
    lastSyncedAt: '2025-01-08T12:00:00Z',
    settings: {
      autoQuote: false,
      realTimeVerification: false,
      webhookUrl: '',
      timeout: 30,
      retryAttempts: 3
    }
  },
  {
    id: 'iffco-tokio',
    name: 'Iffco Tokio',
    fullName: 'IFFCO Tokio General Insurance Company Limited',
    status: 'active',
    logo: 'https://via.placeholder.com/150?text=Iffco+Tokio',
    apiEndpoint: 'https://api.iffcotokio.co.in/api',
    apiKey: 'test_key_iffco_***',
    apiSecret: '***hidden***',
    supportedProducts: ['motor', 'health', 'crop'],
    contactEmail: 'support@iffcotokio.co.in',
    contactPhone: '+91-1800-103-0300',
    integrationStatus: 'connected',
    lastSyncedAt: '2025-01-10T08:20:00Z',
    settings: {
      autoQuote: true,
      realTimeVerification: true,
      webhookUrl: 'https://api.yourapp.com/webhooks/iffco',
      timeout: 30,
      retryAttempts: 3
    }
  }
];

// Mock data for products
const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Comprehensive Motor Insurance',
    insurerId: 'tata-aig',
    category: 'motor',
    subCategory: 'four-wheeler',
    status: 'active',
    description: 'Complete coverage for your car including own damage and third-party liability',
    premiumRules: {
      '3M': { baseRate: 0.02, minPremium: 2000, maxPremium: 50000 },
      '6M': { baseRate: 0.035, minPremium: 3500, maxPremium: 85000 },
      '12M': { baseRate: 0.06, minPremium: 6000, maxPremium: 150000 }
    },
    features: ['Own Damage Cover', 'Third Party Liability', 'Personal Accident Cover', 'Zero Depreciation'],
    eligibility: {
      vehicleAge: { min: 0, max: 15 },
      vehicleTypes: ['car', 'suv', 'sedan']
    },
    addOns: ['Engine Protection', 'NCB Protection', 'Roadside Assistance'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-01-05T10:30:00Z'
  },
  {
    id: 'prod-002',
    name: 'Third Party Motor Insurance',
    insurerId: 'reliance',
    category: 'motor',
    subCategory: 'two-wheeler',
    status: 'active',
    description: 'Mandatory third-party liability coverage for bikes',
    premiumRules: {
      '12M': { baseRate: 0.015, minPremium: 500, maxPremium: 2000 }
    },
    features: ['Third Party Liability', 'Personal Accident Cover'],
    eligibility: {
      vehicleAge: { min: 0, max: 20 },
      vehicleTypes: ['bike', 'scooter']
    },
    addOns: [],
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-12-20T14:15:00Z'
  },
  {
    id: 'prod-003',
    name: 'Individual Health Insurance',
    insurerId: 'godigit',
    category: 'health',
    subCategory: 'individual',
    status: 'active',
    description: 'Comprehensive health coverage for individuals',
    premiumRules: {
      '12M': { baseRate: 0.05, minPremium: 5000, maxPremium: 50000 }
    },
    features: ['Hospitalization', 'Pre & Post Hospitalization', 'Day Care Procedures', 'Ambulance Cover'],
    eligibility: {
      ageRange: { min: 18, max: 65 },
      sumInsured: { min: 100000, max: 5000000 }
    },
    addOns: ['Maternity Cover', 'Critical Illness', 'OPD Cover'],
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2025-01-08T09:45:00Z'
  },
  {
    id: 'prod-004',
    name: 'Travel Insurance - International',
    insurerId: 'tata-aig',
    category: 'travel',
    subCategory: 'international',
    status: 'active',
    description: 'Coverage for international travel',
    premiumRules: {
      '3M': { baseRate: 0.01, minPremium: 500, maxPremium: 10000 },
      '6M': { baseRate: 0.018, minPremium: 900, maxPremium: 18000 },
      '12M': { baseRate: 0.03, minPremium: 1500, maxPremium: 30000 }
    },
    features: ['Medical Emergency', 'Trip Cancellation', 'Lost Baggage', 'Passport Loss'],
    eligibility: {
      ageRange: { min: 6, max: 70 }
    },
    addOns: ['Adventure Sports', 'Home Burglary'],
    createdAt: '2024-04-20T00:00:00Z',
    updatedAt: '2024-11-15T16:30:00Z'
  }
];

export const InsurerProductProvider = ({ children }) => {
  const [insurers, setInsurers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedInsurers = localStorage.getItem('insurers');
    const savedProducts = localStorage.getItem('products');

    if (savedInsurers) {
      setInsurers(JSON.parse(savedInsurers));
    } else {
      setInsurers(INITIAL_INSURERS);
      localStorage.setItem('insurers', JSON.stringify(INITIAL_INSURERS));
    }

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (insurers.length > 0) {
      localStorage.setItem('insurers', JSON.stringify(insurers));
    }
  }, [insurers]);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  // Insurer Management Functions
  const addInsurer = (insurerData) => {
    const newInsurer = {
      ...insurerData,
      id: `insurer-${Date.now()}`,
      integrationStatus: 'pending',
      lastSyncedAt: new Date().toISOString()
    };
    setInsurers(prev => [...prev, newInsurer]);
    return { success: true, insurer: newInsurer };
  };

  const updateInsurer = (insurerId, updates) => {
    setInsurers(prev => prev.map(ins =>
      ins.id === insurerId ? { ...ins, ...updates } : ins
    ));
    return { success: true };
  };

  const deleteInsurer = (insurerId) => {
    // Check if any products use this insurer
    const productsUsingInsurer = products.filter(p => p.insurerId === insurerId);
    if (productsUsingInsurer.length > 0) {
      return {
        success: false,
        error: `Cannot delete. ${productsUsingInsurer.length} product(s) are using this insurer.`
      };
    }
    setInsurers(prev => prev.filter(ins => ins.id !== insurerId));
    return { success: true };
  };

  const testInsurerConnection = async (insurerId) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.3; // 70% success rate

    if (success) {
      updateInsurer(insurerId, { integrationStatus: 'connected', lastSyncedAt: new Date().toISOString() });
      setLoading(false);
      return { success: true, message: 'Connection successful' };
    } else {
      updateInsurer(insurerId, { integrationStatus: 'error' });
      setLoading(false);
      return { success: false, error: 'Connection failed. Please check credentials.' };
    }
  };

  const toggleInsurerStatus = (insurerId) => {
    const insurer = insurers.find(ins => ins.id === insurerId);
    if (insurer) {
      const newStatus = insurer.status === 'active' ? 'inactive' : 'active';
      updateInsurer(insurerId, { status: newStatus });
      return { success: true, status: newStatus };
    }
    return { success: false, error: 'Insurer not found' };
  };

  // Product Management Functions
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    return { success: true, product: newProduct };
  };

  const updateProduct = (productId, updates) => {
    setProducts(prev => prev.map(prod =>
      prod.id === productId ? { ...prod, ...updates, updatedAt: new Date().toISOString() } : prod
    ));
    return { success: true };
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(prod => prod.id !== productId));
    return { success: true };
  };

  const toggleProductStatus = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      updateProduct(productId, { status: newStatus });
      return { success: true, status: newStatus };
    }
    return { success: false, error: 'Product not found' };
  };

  const duplicateProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const duplicated = {
        ...product,
        id: `prod-${Date.now()}`,
        name: `${product.name} (Copy)`,
        status: 'inactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProducts(prev => [...prev, duplicated]);
      return { success: true, product: duplicated };
    }
    return { success: false, error: 'Product not found' };
  };

  // Query Functions
  const getInsurerById = (insurerId) => {
    return insurers.find(ins => ins.id === insurerId);
  };

  const getProductById = (productId) => {
    return products.find(prod => prod.id === productId);
  };

  const getProductsByInsurer = (insurerId) => {
    return products.filter(prod => prod.insurerId === insurerId);
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
    return {
      totalInsurers: insurers.length,
      activeInsurers: insurers.filter(i => i.status === 'active').length,
      connectedInsurers: insurers.filter(i => i.integrationStatus === 'connected').length,
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length,
      productsByCategory: {
        motor: products.filter(p => p.category === 'motor').length,
        health: products.filter(p => p.category === 'health').length,
        travel: products.filter(p => p.category === 'travel').length,
        home: products.filter(p => p.category === 'home').length,
        other: products.filter(p => !['motor', 'health', 'travel', 'home'].includes(p.category)).length
      }
    };
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
