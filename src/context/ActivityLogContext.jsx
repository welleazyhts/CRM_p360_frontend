import React, { createContext, useContext, useState, useCallback } from 'react';

const ActivityLogContext = createContext();

export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  if (!context) {
    throw new Error('useActivityLog must be used within ActivityLogProvider');
  }
  return context;
};

export const ActivityLogProvider = ({ children }) => {
  const [logs, setLogs] = useState([
    // Mock initial logs for demonstration
    {
      id: 'LOG-001',
      timestamp: '2025-01-17 10:30:15',
      user: 'Sarah Johnson',
      action: 'Payment Recorded',
      entity: 'Debtor Account',
      entityId: 'ACC-10001',
      entityName: 'John Smith',
      details: 'Payment of $5,000 received via Credit Card',
      category: 'payment',
      status: 'success'
    },
    {
      id: 'LOG-002',
      timestamp: '2025-01-17 09:15:42',
      user: 'Mike Wilson',
      action: 'PTP Created',
      entity: 'Debtor Account',
      entityId: 'ACC-10002',
      entityName: 'Emily Davis',
      details: 'Promise to Pay created for $3,000 due on 2025-01-25',
      category: 'ptp',
      status: 'success'
    },
    {
      id: 'LOG-003',
      timestamp: '2025-01-17 08:45:20',
      user: 'Sarah Johnson',
      action: 'Account Updated',
      entity: 'Debtor Account',
      entityId: 'ACC-10003',
      entityName: 'Robert Brown',
      details: 'Status changed from Active to Legal',
      category: 'update',
      status: 'success'
    },
    {
      id: 'LOG-004',
      timestamp: '2025-01-16 16:20:30',
      user: 'John Adams',
      action: 'Settlement Proposed',
      entity: 'Debtor Account',
      entityId: 'ACC-10004',
      entityName: 'Maria Garcia',
      details: 'Settlement offer of $2,400 (60% of $4,000) proposed',
      category: 'settlement',
      status: 'pending'
    },
    {
      id: 'LOG-005',
      timestamp: '2025-01-16 14:10:15',
      user: 'Sarah Johnson',
      action: 'Contact Attempt',
      entity: 'Debtor Account',
      entityId: 'ACC-10001',
      entityName: 'John Smith',
      details: 'Phone call made - Debtor answered, discussed payment options',
      category: 'contact',
      status: 'success'
    },
    {
      id: 'LOG-006',
      timestamp: '2025-01-16 11:30:00',
      user: 'Mike Wilson',
      action: 'Portfolio Uploaded',
      entity: 'Portfolio',
      entityId: 'PF-2025-001',
      entityName: 'Q1 Credit Card Portfolio',
      details: '150 accounts uploaded, total value $2.5M',
      category: 'portfolio',
      status: 'success'
    },
    {
      id: 'LOG-007',
      timestamp: '2025-01-16 10:05:45',
      user: 'Sarah Johnson',
      action: 'Legal Case Filed',
      entity: 'Debtor Account',
      entityId: 'ACC-10003',
      entityName: 'Robert Brown',
      details: 'Legal case filed with reference #CASE-2025-089',
      category: 'legal',
      status: 'success'
    },
    {
      id: 'LOG-008',
      timestamp: '2025-01-15 15:40:20',
      user: 'John Adams',
      action: 'PTP Broken',
      entity: 'Debtor Account',
      entityId: 'ACC-10005',
      entityName: 'David Wilson',
      details: 'Promise to Pay of $2,000 was not honored on due date',
      category: 'ptp',
      status: 'failed'
    }
  ]);

  /**
   * Add a new activity log
   */
  const addLog = useCallback((logData) => {
    const newLog = {
      id: `LOG-${String(logs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: logData.user || 'System',
      action: logData.action,
      entity: logData.entity,
      entityId: logData.entityId,
      entityName: logData.entityName,
      details: logData.details,
      category: logData.category,
      status: logData.status || 'success'
    };

    setLogs(prevLogs => [newLog, ...prevLogs]);
    return newLog;
  }, [logs.length]);

  /**
   * Get logs filtered by various criteria
   */
  const getFilteredLogs = useCallback((filters = {}) => {
    let filteredLogs = [...logs];

    // Filter by entity ID
    if (filters.entityId) {
      filteredLogs = filteredLogs.filter(log => log.entityId === filters.entityId);
    }

    // Filter by category
    if (filters.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category);
    }

    // Filter by user
    if (filters.user) {
      filteredLogs = filteredLogs.filter(log => log.user === filters.user);
    }

    // Filter by status
    if (filters.status) {
      filteredLogs = filteredLogs.filter(log => log.status === filters.status);
    }

    // Filter by date range
    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate);
    }
    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.action.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term) ||
        log.entityName?.toLowerCase().includes(term) ||
        log.entityId?.toLowerCase().includes(term)
      );
    }

    return filteredLogs;
  }, [logs]);

  /**
   * Get logs for a specific entity
   */
  const getEntityLogs = useCallback((entityId) => {
    return logs.filter(log => log.entityId === entityId);
  }, [logs]);

  /**
   * Get recent logs
   */
  const getRecentLogs = useCallback((limit = 10) => {
    return logs.slice(0, limit);
  }, [logs]);

  const value = {
    logs,
    addLog,
    getFilteredLogs,
    getEntityLogs,
    getRecentLogs
  };

  return (
    <ActivityLogContext.Provider value={value}>
      {children}
    </ActivityLogContext.Provider>
  );
};

export default ActivityLogContext;
