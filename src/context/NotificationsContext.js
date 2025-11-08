import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications = [
      {
        id: 'notif-001',
        title: 'New case assigned',
        message: 'Case CASE-006 has been assigned to you',
        timestamp: '2025-04-10T14:30:00',
        read: false,
        type: 'assignment'
      },
      {
        id: 'notif-002',
        title: 'Priority case update',
        message: 'Case CASE-003 has been marked as priority',
        timestamp: '2025-04-10T11:45:00',
        read: false,
        type: 'update'
      },
      {
        id: 'notif-003',
        title: 'System update',
        message: 'The system will be under maintenance tonight',
        timestamp: '2025-04-10T09:15:00',
        read: false,
        type: 'system'
      },
      {
        id: 'notif-004',
        title: 'Case status changed',
        message: 'Case CASE-002 status changed to "In Review"',
        timestamp: '2025-04-09T16:22:00',
        read: true,
        type: 'update'
      },
      {
        id: 'notif-005',
        title: 'Document uploaded',
        message: 'New document uploaded for case CASE-005',
        timestamp: '2025-04-09T14:10:00',
        read: true,
        type: 'document'
      },
      {
        id: 'notif-006',
        title: 'Renewal deadline approaching',
        message: 'Policy POL-12345 renewal deadline in 5 days',
        timestamp: '2025-04-09T10:30:00',
        read: true,
        type: 'reminder'
      },
      {
        id: 'notif-007',
        title: 'Weekly report available',
        message: 'Your weekly performance report is now available',
        timestamp: '2025-04-08T09:00:00',
        read: true,
        type: 'report'
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(notif => !notif.read).length);
  }, []);
  
  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Update unread count
    setUnreadCount(prevCount => Math.max(0, prevCount - 1));
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    
    setUnreadCount(0);
  };
  
  const getNotificationTypeIcon = (type) => {
    // This function will be used by components to determine which icon to show
    // based on notification type
    return type;
  };
  
  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationTypeIcon
  };
  
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};