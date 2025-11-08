import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import dedupeService from '../services/dedupeService';

const DedupeContext = createContext();

export const DedupeProvider = ({ children }) => {
  const [config, setConfig] = useState(dedupeService.getConfig());
  const [uploadHistory, setUploadHistory] = useState([]);

  // Load upload history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('dedupe_upload_history');
    if (savedHistory) {
      setUploadHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save upload history to localStorage
  const saveUploadHistory = (history) => {
    localStorage.setItem('dedupe_upload_history', JSON.stringify(history));
    setUploadHistory(history);
  };

  /**
   * Update dedupe configuration
   */
  const updateDedupeConfig = useCallback((newConfig) => {
    dedupeService.updateConfig(newConfig);
    setConfig(dedupeService.getConfig());
  }, []);

  /**
   * Get current dedupe configuration
   */
  const getDedupeConfig = useCallback(() => {
    return dedupeService.getConfig();
  }, []);

  /**
   * Check single record for duplicates
   */
  const checkDuplicate = useCallback((record, existingData, source = 'unknown') => {
    return dedupeService.checkDuplicate(record, existingData, source);
  }, []);

  /**
   * Batch check multiple records
   */
  const batchCheckDuplicates = useCallback((records, existingData, source = 'unknown') => {
    return dedupeService.batchCheckDuplicates(records, existingData, source);
  }, []);

  /**
   * Add custom dedupe field
   */
  const addCustomField = useCallback((fieldConfig) => {
    dedupeService.addCustomField(fieldConfig);
    setConfig(dedupeService.getConfig());
  }, []);

  /**
   * Remove custom dedupe field
   */
  const removeCustomField = useCallback((fieldId) => {
    dedupeService.removeCustomField(fieldId);
    setConfig(dedupeService.getConfig());
  }, []);

  /**
   * Update custom field
   */
  const updateCustomField = useCallback((fieldId, updates) => {
    dedupeService.updateCustomField(fieldId, updates);
    setConfig(dedupeService.getConfig());
  }, []);

  /**
   * Add upload record to history
   */
  const addUploadRecord = useCallback((uploadData) => {
    const newRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...uploadData
    };

    const updatedHistory = [newRecord, ...uploadHistory].slice(0, 50); // Keep last 50 uploads
    saveUploadHistory(updatedHistory);
  }, [uploadHistory]);

  /**
   * Get upload history
   */
  const getUploadHistory = useCallback((source = null, limit = 10) => {
    let history = uploadHistory;

    if (source) {
      history = history.filter(h => h.source === source);
    }

    return history.slice(0, limit);
  }, [uploadHistory]);

  /**
   * Clear upload history
   */
  const clearUploadHistory = useCallback(() => {
    saveUploadHistory([]);
  }, []);

  /**
   * Get failed records from upload history
   */
  const getFailedRecords = useCallback((uploadId) => {
    const upload = uploadHistory.find(u => u.id === uploadId);
    return upload?.failedRecords || [];
  }, [uploadHistory]);

  /**
   * Toggle dedupe field
   */
  const toggleDedupeField = useCallback((field, enabled) => {
    const newConfig = {
      ...config,
      enabledFields: {
        ...config.enabledFields,
        [field]: enabled
      }
    };
    updateDedupeConfig(newConfig);
  }, [config, updateDedupeConfig]);

  /**
   * Set strict mode
   */
  const setStrictMode = useCallback((enabled) => {
    const newConfig = {
      ...config,
      strictMode: enabled
    };
    updateDedupeConfig(newConfig);
  }, [config, updateDedupeConfig]);

  /**
   * Export dedupe configuration
   */
  const exportConfig = useCallback(() => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dedupe-config-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [config]);

  /**
   * Import dedupe configuration
   */
  const importConfig = useCallback((configData) => {
    try {
      const parsedConfig = typeof configData === 'string' ? JSON.parse(configData) : configData;
      updateDedupeConfig(parsedConfig);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [updateDedupeConfig]);

  const value = {
    // Configuration
    config,
    updateDedupeConfig,
    getDedupeConfig,
    toggleDedupeField,
    setStrictMode,
    exportConfig,
    importConfig,

    // Duplicate checking
    checkDuplicate,
    batchCheckDuplicates,

    // Custom fields
    addCustomField,
    removeCustomField,
    updateCustomField,

    // Upload history
    uploadHistory,
    addUploadRecord,
    getUploadHistory,
    clearUploadHistory,
    getFailedRecords
  };

  return (
    <DedupeContext.Provider value={value}>
      {children}
    </DedupeContext.Provider>
  );
};

export const useDedupe = () => {
  const context = useContext(DedupeContext);
  if (!context) {
    throw new Error('useDedupe must be used within a DedupeProvider');
  }
  return context;
};

export default DedupeContext;
