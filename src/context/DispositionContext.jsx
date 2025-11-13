import React, { createContext, useContext, useState, useEffect } from 'react';

const DispositionContext = createContext();

export const useDisposition = () => {
  const context = useContext(DispositionContext);
  if (!context) {
    throw new Error('useDisposition must be used within DispositionProvider');
  }
  return context;
};

// Initial Dispositions
const INITIAL_DISPOSITIONS = [
  {
    id: 'disp-001',
    name: 'Interested',
    category: 'open',
    description: 'Lead shows interest in the product',
    color: '#4CAF50',
    icon: 'ThumbUp',
    active: true,
    order: 1,
    slaHours: 24,
    autoActions: {
      sendEmail: true,
      sendSMS: false,
      createTask: true,
      notifyManager: false
    },
    subDispositions: [
      {
        id: 'sub-001',
        name: 'Needs Quote',
        description: 'Customer requested a quote',
        active: true,
        order: 1,
        requiresFollowUp: true,
        followUpDays: 2
      },
      {
        id: 'sub-002',
        name: 'Comparing Options',
        description: 'Customer is comparing with other insurers',
        active: true,
        order: 2,
        requiresFollowUp: true,
        followUpDays: 3
      },
      {
        id: 'sub-003',
        name: 'Ready to Buy',
        description: 'Customer ready to purchase',
        active: true,
        order: 3,
        requiresFollowUp: true,
        followUpDays: 1
      }
    ]
  },
  {
    id: 'disp-002',
    name: 'Not Interested',
    category: 'lost',
    description: 'Lead not interested in the product',
    color: '#F44336',
    icon: 'ThumbDown',
    active: true,
    order: 2,
    slaHours: 0,
    autoActions: {
      sendEmail: false,
      sendSMS: false,
      createTask: false,
      notifyManager: false
    },
    subDispositions: [
      {
        id: 'sub-004',
        name: 'Already Insured',
        description: 'Customer already has insurance',
        active: true,
        order: 1,
        requiresFollowUp: false
      },
      {
        id: 'sub-005',
        name: 'Too Expensive',
        description: 'Customer finds premium too high',
        active: true,
        order: 2,
        requiresFollowUp: false
      },
      {
        id: 'sub-006',
        name: 'Not Required',
        description: 'Customer does not need insurance',
        active: true,
        order: 3,
        requiresFollowUp: false
      }
    ]
  },
  {
    id: 'disp-003',
    name: 'Call Back',
    category: 'open',
    description: 'Customer requested a callback',
    color: '#FF9800',
    icon: 'PhoneCallback',
    active: true,
    order: 3,
    slaHours: 4,
    autoActions: {
      sendEmail: false,
      sendSMS: true,
      createTask: true,
      notifyManager: false
    },
    subDispositions: [
      {
        id: 'sub-007',
        name: 'Specific Time',
        description: 'Customer mentioned specific callback time',
        active: true,
        order: 1,
        requiresFollowUp: true,
        followUpDays: 0
      },
      {
        id: 'sub-008',
        name: 'After Few Days',
        description: 'Customer wants callback after some days',
        active: true,
        order: 2,
        requiresFollowUp: true,
        followUpDays: 5
      }
    ]
  },
  {
    id: 'disp-004',
    name: 'Not Reachable',
    category: 'open',
    description: 'Unable to reach the customer',
    color: '#9E9E9E',
    icon: 'PhoneMissed',
    active: true,
    order: 4,
    slaHours: 12,
    autoActions: {
      sendEmail: false,
      sendSMS: true,
      createTask: true,
      notifyManager: false
    },
    subDispositions: [
      {
        id: 'sub-009',
        name: 'Switched Off',
        description: 'Phone is switched off',
        active: true,
        order: 1,
        requiresFollowUp: true,
        followUpDays: 1
      },
      {
        id: 'sub-010',
        name: 'Not Responding',
        description: 'No response to calls',
        active: true,
        order: 2,
        requiresFollowUp: true,
        followUpDays: 2
      },
      {
        id: 'sub-011',
        name: 'Busy',
        description: 'Line is busy',
        active: true,
        order: 3,
        requiresFollowUp: true,
        followUpDays: 0
      },
      {
        id: 'sub-012',
        name: 'Wrong Number',
        description: 'Incorrect phone number',
        active: true,
        order: 4,
        requiresFollowUp: false
      }
    ]
  },
  {
    id: 'disp-005',
    name: 'Converted',
    category: 'won',
    description: 'Lead converted to customer',
    color: '#2196F3',
    icon: 'CheckCircle',
    active: true,
    order: 5,
    slaHours: 0,
    autoActions: {
      sendEmail: true,
      sendSMS: true,
      createTask: false,
      notifyManager: true
    },
    subDispositions: [
      {
        id: 'sub-013',
        name: 'Payment Completed',
        description: 'Full payment received',
        active: true,
        order: 1,
        requiresFollowUp: false
      },
      {
        id: 'sub-014',
        name: 'Policy Issued',
        description: 'Policy documents issued',
        active: true,
        order: 2,
        requiresFollowUp: false
      }
    ]
  },
  {
    id: 'disp-006',
    name: 'DNC',
    category: 'lost',
    description: 'Do Not Call - Customer opted out',
    color: '#000000',
    icon: 'Block',
    active: true,
    order: 6,
    slaHours: 0,
    autoActions: {
      sendEmail: false,
      sendSMS: false,
      createTask: false,
      notifyManager: true
    },
    subDispositions: [
      {
        id: 'sub-015',
        name: 'Requested DNC',
        description: 'Customer requested to be added to DNC',
        active: true,
        order: 1,
        requiresFollowUp: false
      },
      {
        id: 'sub-016',
        name: 'Regulatory DNC',
        description: 'Number in government DNC registry',
        active: true,
        order: 2,
        requiresFollowUp: false
      }
    ]
  }
];

export const DispositionProvider = ({ children }) => {
  const [dispositions, setDispositions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dispositions');
    if (saved) {
      setDispositions(JSON.parse(saved));
    } else {
      setDispositions(INITIAL_DISPOSITIONS);
      localStorage.setItem('dispositions', JSON.stringify(INITIAL_DISPOSITIONS));
    }
  }, []);

  // Save to localStorage whenever dispositions change
  useEffect(() => {
    if (dispositions.length > 0) {
      localStorage.setItem('dispositions', JSON.stringify(dispositions));
    }
  }, [dispositions]);

  // ============ DISPOSITION FUNCTIONS ============

  const addDisposition = (dispositionData) => {
    const newDisposition = {
      ...dispositionData,
      id: `disp-${Date.now()}`,
      subDispositions: dispositionData.subDispositions || []
    };
    setDispositions(prev => [...prev, newDisposition]);
    return { success: true, disposition: newDisposition };
  };

  const updateDisposition = (dispId, updates) => {
    setDispositions(prev => prev.map(disp =>
      disp.id === dispId ? { ...disp, ...updates } : disp
    ));
    return { success: true };
  };

  const deleteDisposition = (dispId) => {
    if (window.confirm('Are you sure? This will also delete all sub-dispositions.')) {
      setDispositions(prev => prev.filter(disp => disp.id !== dispId));
      return { success: true };
    }
    return { success: false };
  };

  const reorderDispositions = (newOrder) => {
    setDispositions(newOrder);
    return { success: true };
  };

  const toggleDisposition = (dispId) => {
    setDispositions(prev => prev.map(disp =>
      disp.id === dispId ? { ...disp, active: !disp.active } : disp
    ));
    return { success: true };
  };

  // ============ SUB-DISPOSITION FUNCTIONS ============

  const addSubDisposition = (dispId, subDispData) => {
    const newSubDisp = {
      ...subDispData,
      id: `sub-${Date.now()}`
    };

    setDispositions(prev => prev.map(disp =>
      disp.id === dispId
        ? { ...disp, subDispositions: [...disp.subDispositions, newSubDisp] }
        : disp
    ));

    return { success: true, subDisposition: newSubDisp };
  };

  const updateSubDisposition = (dispId, subDispId, updates) => {
    setDispositions(prev => prev.map(disp =>
      disp.id === dispId
        ? {
            ...disp,
            subDispositions: disp.subDispositions.map(sub =>
              sub.id === subDispId ? { ...sub, ...updates } : sub
            )
          }
        : disp
    ));
    return { success: true };
  };

  const deleteSubDisposition = (dispId, subDispId) => {
    setDispositions(prev => prev.map(disp =>
      disp.id === dispId
        ? {
            ...disp,
            subDispositions: disp.subDispositions.filter(sub => sub.id !== subDispId)
          }
        : disp
    ));
    return { success: true };
  };

  const toggleSubDisposition = (dispId, subDispId) => {
    setDispositions(prev => prev.map(disp =>
      disp.id === dispId
        ? {
            ...disp,
            subDispositions: disp.subDispositions.map(sub =>
              sub.id === subDispId ? { ...sub, active: !sub.active } : sub
            )
          }
        : disp
    ));
    return { success: true };
  };

  // ============ QUERY FUNCTIONS ============

  const getDispositionById = (dispId) => {
    return dispositions.find(disp => disp.id === dispId);
  };

  const getDispositionsByCategory = (category) => {
    return dispositions.filter(disp => disp.category === category);
  };

  const getActiveDispositions = () => {
    return dispositions.filter(disp => disp.active);
  };

  const getSubDisposition = (dispId, subDispId) => {
    const disp = getDispositionById(dispId);
    return disp?.subDispositions.find(sub => sub.id === subDispId);
  };

  const getAllSubDispositions = (dispId) => {
    const disp = getDispositionById(dispId);
    return disp?.subDispositions || [];
  };

  // ============ STATISTICS ============

  const getStatistics = () => {
    const totalDisp = dispositions.length;
    const activeDisp = dispositions.filter(d => d.active).length;
    const totalSubDisp = dispositions.reduce((sum, d) => sum + d.subDispositions.length, 0);
    const activeSubDisp = dispositions.reduce(
      (sum, d) => sum + d.subDispositions.filter(s => s.active).length,
      0
    );

    return {
      totalDispositions: totalDisp,
      activeDispositions: activeDisp,
      totalSubDispositions: totalSubDisp,
      activeSubDispositions: activeSubDisp,
      byCategory: {
        open: dispositions.filter(d => d.category === 'open').length,
        won: dispositions.filter(d => d.category === 'won').length,
        lost: dispositions.filter(d => d.category === 'lost').length
      }
    };
  };

  const value = {
    // State
    dispositions,
    loading,

    // Disposition Functions
    addDisposition,
    updateDisposition,
    deleteDisposition,
    reorderDispositions,
    toggleDisposition,
    getDispositionById,
    getDispositionsByCategory,
    getActiveDispositions,

    // Sub-disposition Functions
    addSubDisposition,
    updateSubDisposition,
    deleteSubDisposition,
    toggleSubDisposition,
    getSubDisposition,
    getAllSubDispositions,

    // Statistics
    getStatistics
  };

  return (
    <DispositionContext.Provider value={value}>
      {children}
    </DispositionContext.Provider>
  );
};
