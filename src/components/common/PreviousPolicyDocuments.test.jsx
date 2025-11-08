import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PreviousPolicyDocuments from './PreviousPolicyDocuments';

// Mock the document service
jest.mock('../../services/documentService', () => ({
  getPolicyDocuments: jest.fn(() => Promise.resolve({
    premiumCertificates: [],
    healthCards: [],
    policyDocuments: [],
    renewalNotices: []
  })),
  downloadDocument: jest.fn(() => Promise.resolve({ success: true })),
  viewDocument: jest.fn(() => Promise.resolve({ success: true }))
}));

const mockPolicy = {
  id: 1,
  policyNumber: 'POL-2024-001',
  type: 'Health Insurance',
  status: 'Active'
};

describe('PreviousPolicyDocuments', () => {
  test('renders policy documents component', () => {
    render(<PreviousPolicyDocuments policy={mockPolicy} />);
    
    expect(screen.getByText(/POL-2024-001 - Related Documents/)).toBeInTheDocument();
    expect(screen.getByText(/0 documents/)).toBeInTheDocument();
  });

  test('expands when clicked', () => {
    render(<PreviousPolicyDocuments policy={mockPolicy} />);
    
    const expandButton = screen.getByRole('button');
    fireEvent.click(expandButton);
    
    // Should show loading or empty state
    expect(screen.getByText(/Loading documents.../)).toBeInTheDocument();
  });
});