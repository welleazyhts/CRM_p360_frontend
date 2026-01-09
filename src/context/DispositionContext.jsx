import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import DispositionService from '../services/DispositionService';

const DispositionContext = createContext();

export const useDisposition = () => {
  const context = useContext(DispositionContext);
  if (!context) {
    throw new Error('useDisposition must be used within DispositionProvider');
  }
  return context;
};

export const DispositionProvider = ({ children }) => {
  const [dispositions, setDispositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dispositions on mount
  const refreshDispositions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DispositionService.fetchDispositions();
      // Ensure data is array
      setDispositions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to load dispositions", err);
      setError("Failed to load dispositions");
      // Fallback to empty if API fails
      setDispositions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDispositions();
  }, [refreshDispositions]);

  // ============ DISPOSITION FUNCTIONS ============

  const addDisposition = async (dispositionData) => {
    try {
      const newDisposition = await DispositionService.addDisposition(dispositionData);
      setDispositions(prev => [...prev, newDisposition]);
      return { success: true, disposition: newDisposition };
    } catch (err) {
      console.error("Error adding disposition:", err);
      return { success: false, error: err.message };
    }
  };

  const updateDisposition = async (dispId, updates) => {
    try {
      const updatedDisp = await DispositionService.updateDisposition(dispId, updates);
      setDispositions(prev => prev.map(disp =>
        disp.id === dispId ? updatedDisp : disp
      ));
      return { success: true };
    } catch (err) {
      console.error("Error updating disposition:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteDisposition = async (dispId) => {
    if (window.confirm('Are you sure? This will also delete all sub-dispositions.')) {
      try {
        await DispositionService.deleteDisposition(dispId);
        setDispositions(prev => prev.filter(disp => disp.id !== dispId));
        return { success: true };
      } catch (err) {
        console.error("Error deleting disposition:", err);
        return { success: false, error: err.message };
      }
    }
    return { success: false };
  };

  const reorderDispositions = async (newOrder) => {
    // Optimistic update
    const originalOrder = [...dispositions];
    setDispositions(newOrder);

    try {
      await DispositionService.reorderDispositions(newOrder);
      return { success: true };
    } catch (err) {
      console.error("Error reordering dispositions:", err);
      setDispositions(originalOrder); // Revert on failure
      return { success: false, error: err.message };
    }
  };

  const toggleDisposition = async (dispId) => {
    // Find current status to toggle
    const disp = dispositions.find(d => d.id === dispId);
    if (!disp) return { success: false };

    try {
      const updatedDisp = await DispositionService.toggleDisposition(dispId, !disp.active);
      setDispositions(prev => prev.map(d =>
        d.id === dispId ? { ...d, active: updatedDisp.active !== undefined ? updatedDisp.active : !d.active } : d
      ));
      return { success: true };
    } catch (err) {
      console.error("Error toggling disposition:", err);
      return { success: false, error: err.message };
    }
  };

  // ============ SUB-DISPOSITION FUNCTIONS ============

  const addSubDisposition = async (dispId, subDispData) => {
    try {
      const newSubDisp = await DispositionService.addSubDisposition(dispId, subDispData);

      setDispositions(prev => prev.map(disp => {
        if (disp.id === dispId) {
          const currentSubs = disp.subDispositions || [];
          return { ...disp, subDispositions: [...currentSubs, newSubDisp] };
        }
        return disp;
      }));

      return { success: true, subDisposition: newSubDisp };
    } catch (err) {
      console.error("Error adding sub-disposition:", err);
      return { success: false, error: err.message };
    }
  };

  const updateSubDisposition = async (dispId, subDispId, updates) => {
    try {
      const updatedSub = await DispositionService.updateSubDisposition(dispId, subDispId, updates);

      setDispositions(prev => prev.map(disp => {
        if (disp.id === dispId) {
          return {
            ...disp,
            subDispositions: (disp.subDispositions || []).map(sub =>
              sub.id === subDispId ? updatedSub : sub
            )
          };
        }
        return disp;
      }));

      return { success: true };
    } catch (err) {
      console.error("Error updating sub-disposition:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteSubDisposition = async (dispId, subDispId) => {
    try {
      await DispositionService.deleteSubDisposition(dispId, subDispId);

      setDispositions(prev => prev.map(disp =>
        disp.id === dispId
          ? {
            ...disp,
            subDispositions: (disp.subDispositions || []).filter(sub => sub.id !== subDispId)
          }
          : disp
      ));
      return { success: true };
    } catch (err) {
      console.error("Error deleting sub-disposition:", err);
      return { success: false, error: err.message };
    }
  };

  const toggleSubDisposition = async (dispId, subDispId) => {
    try {
      const disp = dispositions.find(d => d.id === dispId);
      const sub = disp?.subDispositions?.find(s => s.id === subDispId);
      if (!sub) return { success: false };

      const updatedSub = await DispositionService.toggleSubDisposition(dispId, subDispId, !sub.active);

      setDispositions(prev => prev.map(d =>
        d.id === dispId
          ? {
            ...d,
            subDispositions: (d.subDispositions || []).map(s =>
              s.id === subDispId ? { ...s, active: updatedSub.active !== undefined ? updatedSub.active : !s.active } : s
            )
          }
          : d
      ));
      return { success: true };
    } catch (err) {
      console.error("Error toggling sub-disposition:", err);
      return { success: false, error: err.message };
    }
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
    return disp?.subDispositions?.find(sub => sub.id === subDispId);
  };

  const getAllSubDispositions = (dispId) => {
    const disp = getDispositionById(dispId);
    return disp?.subDispositions || [];
  };

  // ============ STATISTICS ============

  const getStatistics = () => {
    const totalDisp = dispositions.length;
    const activeDisp = dispositions.filter(d => d.active).length;

    // Safety check for subDispositions being undefined
    const subDispositions = dispositions.flatMap(d => d.subDispositions || []);
    const totalSubDisp = subDispositions.length;
    const activeSubDisp = subDispositions.filter(s => s.active).length;

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
    error,
    refreshDispositions,

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
