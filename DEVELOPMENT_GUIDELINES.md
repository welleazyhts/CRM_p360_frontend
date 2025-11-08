# Development Guidelines

## 📋 Overview

This document outlines the development standards, best practices, and guidelines for the Renewal Frontend application. Following the comprehensive ESLint cleanup and recent feature enhancements (January 2025), these guidelines ensure continued code quality and maintainability for the latest features including Outstanding Amounts Management, Social Media Integrations, and Advanced Analytics.

**Last Updated:** January 2025  
**Version:** 2.1 (includes recent feature updates)

---

## 🎯 Code Quality Standards

### **ESLint Compliance (MANDATORY)**
- ✅ **Zero warnings policy** - All code must pass ESLint without any warnings
- ✅ **Zero errors policy** - No ESLint errors allowed in production builds
- ✅ **Automatic fixing** - Use `npm run lint:fix` before committing
- ✅ **Pre-commit hooks** - Consider adding ESLint checks to git hooks

### **ESLint Rules Enforced:**
1. **no-unused-vars** - No unused variables, functions, or imports
2. **react-hooks/exhaustive-deps** - Complete and accurate dependency arrays
3. **no-use-before-define** - Functions must be defined before use
4. **no-console** - No console statements in production code

### **Code Quality Metrics:**
- **Current Status:** 0 ESLint warnings across all components
- **Target:** Maintain 0 warnings for all new code
- **Review Requirement:** All PRs must pass ESLint checks

---

## ⚛️ React Development Standards

### **Component Architecture:**
1. **Functional Components Only** - Use React Hooks instead of class components
2. **Single Responsibility** - Each component should have one clear purpose
3. **Prop Validation** - Use PropTypes or prepare for TypeScript integration
4. **Error Boundaries** - Implement error boundaries for robust error handling

### **React Hooks Best Practices:**

#### **useState:**
```javascript
// ✅ Good: Descriptive names and proper initialization
const [isLoading, setIsLoading] = useState(false);
const [outstandingAmounts, setOutstandingAmounts] = useState([]);
const [socialMediaConnections, setSocialMediaConnections] = useState({});

// ❌ Bad: Generic names and missing initialization
const [data, setData] = useState();
const [flag, setFlag] = useState();
```

#### **useEffect:**
```javascript
// ✅ Good: Complete dependency array for Outstanding Amounts
useEffect(() => {
  if (caseData?.outstandingAmounts) {
    calculateTotalOutstanding();
  }
}, [caseData?.outstandingAmounts, calculateTotalOutstanding]);

// ❌ Bad: Missing dependencies
useEffect(() => {
  fetchOutstandingAmounts();
}, []); // ESLint will warn about missing dependencies
```

#### **useCallback:**
```javascript
// ✅ Good: Memoize payment processing functions
const handlePaymentProcess = useCallback(async (paymentData) => {
  await processPayment(paymentData);
  setPaymentStatus('completed');
}, [processPayment]);

// ✅ Good: Memoize social media connection handlers
const handleSocialMediaConnect = useCallback((platform, credentials) => {
  connectToPlatform(platform, credentials);
}, [connectToPlatform]);

// ❌ Bad: Not memoizing functions that cause re-renders
const handlePayment = (data) => {
  // This creates a new function on every render
};
```

#### **useMemo:**
```javascript
// ✅ Good: Memoize expensive calculations for Outstanding Amounts
const totalOutstanding = useMemo(() => {
  return outstandingAmounts.reduce((total, amount) => total + amount.amount, 0);
}, [outstandingAmounts]);

// ✅ Good: Memoize AI recommendations
const policyRecommendations = useMemo(() => {
  return generatePolicyRecommendations(customerProfile);
}, [customerProfile]);

// ❌ Bad: Creating objects/arrays in render
const paymentOptions = ['UPI', 'Card', 'Net Banking']; // New array every render
```

---

## 🆕 New Feature Development Standards (January 2025)

### **Outstanding Amounts Management:**
```javascript
// ✅ Good: Proper Outstanding Amounts component structure
const OutstandingAmountsTab = ({ caseData, onPayment }) => {
  const [paymentDialog, setPaymentDialog] = useState(false);
  
  const totalOutstanding = useMemo(() => {
    return caseData.outstandingAmounts?.reduce((total, amount) => 
      total + amount.amount, 0) || 0;
  }, [caseData.outstandingAmounts]);

  const handlePaymentAction = useCallback(async (installmentId) => {
    try {
      await processPayment(installmentId);
      onPayment?.(installmentId);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Payment processing failed', 
        severity: 'error' 
      });
    }
  }, [onPayment]);

  return (
    // Component JSX with proper error handling
  );
};
```

### **Social Media Integrations:**
```javascript
// ✅ Good: Social Media Integration component
const SocialMediaIntegrations = () => {
  const [connections, setConnections] = useState({});
  const [verificationDialog, setVerificationDialog] = useState(null);
  
  const handlePlatformConnect = useCallback(async (platform) => {
    try {
      const result = await connectToPlatform(platform);
      setConnections(prev => ({
        ...prev,
        [platform]: { connected: true, timestamp: new Date() }
      }));
    } catch (error) {
      // Proper error handling
    }
  }, []);

  return (
    // Component JSX
  );
};
```

### **AI Policy Recommendations:**
```javascript
// ✅ Good: AI Recommendations with proper error handling
const PolicyRecommendations = ({ customerProfile }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecommendations = useCallback(async () => {
    if (!customerProfile) return;
    
    setIsGenerating(true);
    try {
      const aiRecommendations = await generatePolicyRecommendations(customerProfile);
      setRecommendations(aiRecommendations);
    } catch (error) {
      setRecommendations([]);
      // Error handling
    } finally {
      setIsGenerating(false);
    }
  }, [customerProfile]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  return (
    // Component JSX with loading states
  );
};
```

---

## 📦 Import Management

### **Import Organization for New Features:**
```javascript
// ✅ Good: Organized imports for Outstanding Amounts
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Stack,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  MonetizationOn as MonetizationOnIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Payments as PaymentsIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { processPayment, calculateOverdueDays } from '../utils/paymentHelpers';

// ❌ Bad: Unused imports
import {
  Box,
  Typography,
  Card,
  Paper, // Unused - ESLint will warn
  Tooltip // Unused - ESLint will warn
} from '@mui/material';
```

### **Import Rules for New Features:**
1. **Only import what you use** - Remove unused imports immediately
2. **Group by feature** - Outstanding amounts, social media, AI recommendations
3. **Use named imports** - Prefer named imports over default imports
4. **Alphabetical ordering** - Keep imports organized within groups

---

## 🎨 UI/UX Standards for New Features

### **Outstanding Amounts UI Standards:**
1. **Consistent Styling** - Use established theme colors (error for overdue, warning for upcoming)
2. **Scrollable Interfaces** - Implement custom scrollbar styling for lists
3. **Typography Consistency** - Use `h4` variant for all summary values
4. **Visual Indicators** - Red borders and warning icons for overdue amounts

```javascript
// ✅ Good: Consistent Outstanding Amounts styling
<Box
  sx={{
    maxHeight: '400px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: alpha(theme.palette.primary.main, 0.3),
      borderRadius: '4px',
    },
  }}
>
  {outstandingAmounts.map((amount, index) => (
    <Card 
      key={index}
      sx={{ 
        border: `1px solid ${isOverdue ? theme.palette.error.main : theme.palette.divider}`,
        minHeight: '120px'
      }}
    >
      {/* Card content */}
    </Card>
  ))}
</Box>
```

### **Social Media Integration UI Standards:**
1. **Platform Icons** - Use consistent platform-specific icons
2. **Connection Status** - Clear visual indicators for connected/disconnected state
3. **Verification Flow** - Modal dialogs for verification processes
4. **Timestamp Display** - Show connection timestamps in consistent format

### **AI Recommendations UI Standards:**
1. **Loading States** - Proper loading indicators during AI processing
2. **Recommendation Cards** - Consistent card layout for recommendations
3. **Reasoning Display** - Show AI reasoning for each recommendation
4. **Priority Indicators** - Visual priority levels for recommendations

---

## 🚀 Performance Guidelines for New Features

### **Outstanding Amounts Performance:**
```javascript
// ✅ Good: Optimized Outstanding Amounts calculations
const OutstandingAmountsManager = ({ caseData }) => {
  const totalOutstanding = useMemo(() => {
    return caseData.outstandingAmounts?.reduce((total, amount) => 
      total + amount.amount, 0) || 0;
  }, [caseData.outstandingAmounts]);

  const overdueCount = useMemo(() => {
    const currentDate = new Date();
    return caseData.outstandingAmounts?.filter(amount => 
      new Date(amount.dueDate) < currentDate
    ).length || 0;
  }, [caseData.outstandingAmounts]);

  // Memoize payment handler to prevent re-renders
  const handlePayment = useCallback(async (installmentId) => {
    // Payment processing logic
  }, []);
};
```

### **Social Media Integration Performance:**
```javascript
// ✅ Good: Efficient connection status checking
const SocialMediaStatus = ({ platforms }) => {
  const connectionStatus = useMemo(() => {
    return platforms.reduce((status, platform) => {
      status[platform.name] = platform.connected;
      return status;
    }, {});
  }, [platforms]);

  // Debounced verification to prevent excessive API calls
  const debouncedVerification = useMemo(
    () => debounce(verifyPlatformConnection, 500),
    []
  );
};
```

---

## 🔧 Development Workflow for New Features

### **Before Starting New Feature Development:**
1. **Review existing patterns** - Check how similar features are implemented
2. **Plan component structure** - Design component hierarchy
3. **Mock data preparation** - Prepare realistic mock data
4. **API integration points** - Identify required API endpoints

### **During New Feature Development:**
1. **Follow established patterns** - Use existing component structures
2. **Implement proper error handling** - Handle loading, error, and success states
3. **Add comprehensive logging** - Use proper logging for debugging
4. **Test with mock data** - Ensure functionality works with mock data

### **Feature-Specific Guidelines:**

#### **Outstanding Amounts Features:**
- Always handle empty states (no outstanding amounts)
- Implement proper date calculations for overdue status
- Use consistent currency formatting (Indian Rupees)
- Provide clear payment action feedback

#### **Social Media Integration Features:**
- Handle OAuth flows securely
- Implement proper token management
- Provide clear connection status feedback
- Handle platform-specific errors gracefully

#### **AI Recommendation Features:**
- Implement proper loading states during AI processing
- Handle AI service failures gracefully
- Provide fallback recommendations
- Cache recommendations to avoid repeated API calls

---

## 📊 Testing Standards for New Features

### **Component Testing for New Features:**
```javascript
// ✅ Good: Outstanding Amounts component test
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OutstandingAmountsTab } from './OutstandingAmountsTab';

test('should display total outstanding amount correctly', () => {
  const mockCaseData = {
    outstandingAmounts: [
      { amount: 15000, period: 'March 2024', dueDate: '2024-03-15' },
      { amount: 18500, period: 'April 2024', dueDate: '2024-04-15' }
    ]
  };

  render(<OutstandingAmountsTab caseData={mockCaseData} />);
  
  expect(screen.getByText('₹33,500')).toBeInTheDocument();
});

test('should handle payment action correctly', async () => {
  const mockOnPayment = jest.fn();
  const mockCaseData = { outstandingAmounts: [...] };

  render(<OutstandingAmountsTab caseData={mockCaseData} onPayment={mockOnPayment} />);
  
  const payButton = screen.getByText('Pay Now');
  fireEvent.click(payButton);
  
  await waitFor(() => {
    expect(mockOnPayment).toHaveBeenCalled();
  });
});
```

---

## 🔒 Security Guidelines for New Features

### **Payment Security (Outstanding Amounts):**
1. **PCI Compliance** - Never store payment card data
2. **Secure Transmission** - All payment data must be encrypted
3. **Input Validation** - Validate all payment amounts and data
4. **Audit Logging** - Log all payment attempts and results

### **Social Media Integration Security:**
1. **OAuth Security** - Implement proper OAuth flows
2. **Token Management** - Secure storage and rotation of tokens
3. **Data Privacy** - Minimal data collection from social platforms
4. **Platform Compliance** - Follow platform-specific security guidelines

### **AI Integration Security:**
1. **Data Sanitization** - Sanitize customer data before AI processing
2. **API Key Security** - Secure storage of AI service API keys
3. **Rate Limiting** - Implement proper rate limiting for AI calls
4. **Response Validation** - Validate AI responses before displaying

---

## 📝 Documentation Standards for New Features

### **Code Documentation for New Features:**
```javascript
/**
 * Processes outstanding amount payments and updates case status
 * @param {string} caseId - The case ID containing outstanding amounts
 * @param {Object} paymentData - Payment information including amount and method
 * @param {number} paymentData.amount - Amount to be paid
 * @param {string} paymentData.method - Payment method (UPI, Card, Net Banking)
 * @param {string} paymentData.installmentId - Specific installment ID
 * @returns {Promise<Object>} Payment processing result with status and transaction ID
 */
const processOutstandingPayment = async (caseId, paymentData) => {
  // Implementation with proper error handling
};

/**
 * Connects to social media platform and stores connection details
 * @param {string} platform - Platform name (facebook, twitter, linkedin, etc.)
 * @param {Object} credentials - Platform-specific credentials
 * @returns {Promise<Object>} Connection result with status and timestamp
 */
const connectSocialMediaPlatform = async (platform, credentials) => {
  // Implementation with OAuth handling
};
```

---

## 🌍 Internationalization (i18n) for New Features

### **i18n Implementation for New Features:**
```javascript
// ✅ Good: Proper i18n for Outstanding Amounts
import { useTranslation } from 'react-i18next';

const OutstandingAmountsTab = () => {
  const { t } = useTranslation();
  
  return (
    <Typography variant="h6">
      {t('outstandingAmounts.title')} 
    </Typography>
  );
};

// Translation keys structure
// en/common.json
{
  "outstandingAmounts": {
    "title": "Outstanding Amounts",
    "totalOutstanding": "Total Outstanding",
    "payNow": "Pay Now",
    "overdue": "{{days}} days overdue",
    "upcoming": "Due in {{days}} days"
  },
  "socialMedia": {
    "integrations": "Social Media Integrations",
    "connect": "Connect",
    "connected": "Connected",
    "verify": "Verify Connection"
  },
  "aiRecommendations": {
    "title": "AI Policy Recommendations",
    "generating": "Generating recommendations...",
    "noRecommendations": "No recommendations available"
  }
}
```

---

## 🚨 Error Handling for New Features

### **Outstanding Amounts Error Handling:**
```javascript
// ✅ Good: Comprehensive error handling
const OutstandingAmountsManager = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handlePayment = async (installmentId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await processPayment(installmentId);
      setSnackbar({
        open: true,
        message: t('payment.success'),
        severity: 'success'
      });
    } catch (err) {
      setError(t('payment.error'));
      if (process.env.NODE_ENV === 'development') {
        console.error('Payment processing error:', err);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={() => setError(null)}>
          {t('common.retry')}
        </Button>
      </Alert>
    );
  }
  
  // Component JSX
};
```

---

## 📈 Continuous Improvement for New Features

### **Regular Maintenance for New Features:**
1. **Performance Monitoring** - Monitor Outstanding Amounts calculation performance
2. **User Feedback** - Collect feedback on new features
3. **Error Tracking** - Monitor error rates for new features
4. **Usage Analytics** - Track feature adoption and usage patterns

### **Quality Metrics Tracking for New Features:**
- **Outstanding Amounts**: Payment success rate, error rate, user engagement
- **Social Media Integrations**: Connection success rate, verification rate
- **AI Recommendations**: Recommendation accuracy, user acceptance rate
- **Overall**: Feature adoption rate, user satisfaction scores

---

## ✅ Conclusion

These enhanced development guidelines ensure that all new features including Outstanding Amounts Management, Social Media Integrations, AI Policy Recommendations, and Advanced Analytics maintain the same high standards established during the ESLint cleanup. All developers should follow these guidelines to contribute effectively to the project while maintaining code quality, performance, and user experience.

**Remember:** The goal is to maintain the current **zero ESLint warnings** status while building new features that are performant, accessible, secure, and culturally appropriate for the Indian market.

**New Feature Checklist:**
- [ ] Follows established component patterns
- [ ] Implements proper error handling and loading states
- [ ] Uses consistent UI/UX patterns
- [ ] Includes comprehensive testing
- [ ] Maintains ESLint compliance
- [ ] Implements proper security measures
- [ ] Includes i18n support
- [ ] Documents all new functionality 