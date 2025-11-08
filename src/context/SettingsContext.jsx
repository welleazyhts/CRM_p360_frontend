import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Settings context
const SettingsContext = createContext();

// Custom hook to use the Settings context
export const useSettings = () => useContext(SettingsContext);

// Provider component
export const SettingsProvider = ({ children }) => {
  // Initialize settings state with default values
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    language: 'en',
    timezone: 'IST',
    autoRefresh: true,
    showEditCaseButton: true,
    mfaEnabled: false,
    billing: {
      utilization: [
        { service: 'Email Notifications', count: 245, cost: 1850.00 },
        { service: 'SMS Notifications', count: 78, cost: 1200.00 },
        { service: 'API Calls', count: 1245, cost: 4950.00 }
      ],
      platform: [
        { service: 'Base Subscription', period: 'Monthly', cost: 15000.00 },
        { service: 'Additional Users (5)', period: 'Monthly', cost: 3750.00 },
        { service: 'Premium Support', period: 'Monthly', cost: 7500.00 }
      ],
      totalMonthly: 34250.00
    }
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  // Function to update settings
  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;