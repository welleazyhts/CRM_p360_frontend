// Document Service for Previous Policy Records
// Handles document operations like download, view, and metadata retrieval

/**
 * Get documents for a specific policy
 * @param {string} policyNumber - Policy number to fetch documents for
 * @returns {Promise<Object>} Documents organized by type
 */
export const getPolicyDocuments = async (policyNumber) => {
  try {
    // In a real implementation, this would call the backend API
    // return apiRequest(`/policies/${policyNumber}/documents`);
    
    // Mock implementation with comprehensive document data
    const mockDocuments = {
      'POL-2024-001': {
        premiumCertificates: [
          {
            id: 1,
            name: 'Premium Payment Certificate - Q1 2024',
            date: '2024-03-31',
            amount: '₹15,000',
            status: 'Verified',
            fileSize: '245 KB',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/cert-q1-2024.pdf',
            viewUrl: '/api/documents/view/cert-q1-2024.pdf',
            uploadedBy: 'System',
            uploadDate: '2024-04-01'
          },
          {
            id: 2,
            name: 'Premium Payment Certificate - Q4 2023',
            date: '2023-12-31',
            amount: '₹15,000',
            status: 'Verified',
            fileSize: '238 KB',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/cert-q4-2023.pdf',
            viewUrl: '/api/documents/view/cert-q4-2023.pdf',
            uploadedBy: 'System',
            uploadDate: '2024-01-02'
          }
        ],
        healthCards: [
          {
            id: 1,
            name: 'Digital Health Card - Rajesh Sharma',
            memberName: 'Rajesh Sharma',
            cardNumber: 'HC-2024-001-001',
            validUpto: '2025-01-01',
            status: 'Active',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/health-card-rajesh.pdf',
            viewUrl: '/api/documents/view/health-card-rajesh.pdf',
            issuedDate: '2024-01-01',
            qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
          },
          {
            id: 2,
            name: 'Digital Health Card - Priya Sharma',
            memberName: 'Priya Sharma',
            cardNumber: 'HC-2024-001-002',
            validUpto: '2025-01-01',
            status: 'Active',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/health-card-priya.pdf',
            viewUrl: '/api/documents/view/health-card-priya.pdf',
            issuedDate: '2024-01-01',
            qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
          }
        ],
        policyDocuments: [
          {
            id: 1,
            name: 'Health Insurance Policy Document',
            type: 'Master Policy',
            version: '2.1',
            date: '2024-01-01',
            fileSize: '2.8 MB',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/policy-master-2024.pdf',
            viewUrl: '/api/documents/view/policy-master-2024.pdf',
            description: 'Complete policy terms and conditions',
            language: 'English'
          },
          {
            id: 2,
            name: 'Policy Schedule',
            type: 'Schedule',
            version: '1.0',
            date: '2024-01-01',
            fileSize: '156 KB',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/policy-schedule-2024.pdf',
            viewUrl: '/api/documents/view/policy-schedule-2024.pdf',
            description: 'Policy coverage details and member information',
            language: 'English'
          },
          {
            id: 3,
            name: 'Terms & Conditions',
            type: 'T&C',
            version: '3.2',
            date: '2024-01-01',
            fileSize: '892 KB',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/terms-conditions-2024.pdf',
            viewUrl: '/api/documents/view/terms-conditions-2024.pdf',
            description: 'Detailed terms and conditions',
            language: 'English'
          }
        ],
        renewalNotices: [
          {
            id: 1,
            name: 'Renewal Notice - 2025',
            noticeDate: '2024-11-01',
            dueDate: '2025-01-01',
            status: 'Sent',
            channel: 'Email & SMS',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/renewal-notice-2025.pdf',
            viewUrl: '/api/documents/view/renewal-notice-2025.pdf',
            remindersSent: 2,
            lastReminderDate: '2024-12-15'
          },
          {
            id: 2,
            name: 'Renewal Reminder - Final Notice',
            noticeDate: '2024-12-15',
            dueDate: '2025-01-01',
            status: 'Delivered',
            channel: 'WhatsApp',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/renewal-final-2025.pdf',
            viewUrl: '/api/documents/view/renewal-final-2025.pdf',
            remindersSent: 1,
            lastReminderDate: '2024-12-15'
          }
        ]
      },
      'POL-2023-458': {
        premiumCertificates: [
          {
            id: 1,
            name: 'Premium Payment Certificate - 2024',
            date: '2024-06-15',
            amount: '₹25,000',
            status: 'Verified',
            fileSize: '267 KB',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/life-cert-2024.pdf',
            viewUrl: '/api/documents/view/life-cert-2024.pdf',
            uploadedBy: 'System',
            uploadDate: '2024-06-16'
          }
        ],
        healthCards: [],
        policyDocuments: [
          {
            id: 1,
            name: 'Life Insurance Policy Document',
            type: 'Master Policy',
            version: '1.5',
            date: '2023-06-15',
            fileSize: '3.2 MB',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/life-policy-2023.pdf',
            viewUrl: '/api/documents/view/life-policy-2023.pdf',
            description: 'Life insurance policy terms and benefits',
            language: 'English'
          }
        ],
        renewalNotices: [
          {
            id: 1,
            name: 'Renewal Notice - 2025',
            noticeDate: '2024-04-15',
            dueDate: '2025-06-15',
            status: 'Sent',
            channel: 'Email',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/life-renewal-2025.pdf',
            viewUrl: '/api/documents/view/life-renewal-2025.pdf',
            remindersSent: 1,
            lastReminderDate: '2024-04-15'
          }
        ]
      },
      'POL-2022-789': {
        premiumCertificates: [
          {
            id: 1,
            name: 'Premium Payment Certificate - 2023',
            date: '2023-03-20',
            amount: '₹12,000',
            status: 'Verified',
            fileSize: '198 KB',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/vehicle-cert-2023.pdf',
            viewUrl: '/api/documents/view/vehicle-cert-2023.pdf',
            uploadedBy: 'System',
            uploadDate: '2023-03-21'
          }
        ],
        healthCards: [],
        policyDocuments: [
          {
            id: 1,
            name: 'Vehicle Insurance Policy',
            type: 'Master Policy',
            version: '1.0',
            date: '2022-03-20',
            fileSize: '1.8 MB',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/vehicle-policy-2022.pdf',
            viewUrl: '/api/documents/view/vehicle-policy-2022.pdf',
            description: 'Vehicle insurance coverage details',
            language: 'English'
          }
        ],
        renewalNotices: [
          {
            id: 1,
            name: 'Renewal Notice - 2024 (Expired)',
            noticeDate: '2024-01-20',
            dueDate: '2024-03-20',
            status: 'Expired',
            channel: 'Email & SMS',
            fileType: 'PDF',
            downloadUrl: '/api/documents/download/vehicle-renewal-2024.pdf',
            viewUrl: '/api/documents/view/vehicle-renewal-2024.pdf',
            remindersSent: 3,
            lastReminderDate: '2024-03-15'
          }
        ]
      }
    };

    return mockDocuments[policyNumber] || {
      premiumCertificates: [],
      healthCards: [],
      policyDocuments: [],
      renewalNotices: []
    };
  } catch (error) {
    console.error('Error fetching policy documents:', error);
    throw error;
  }
};

/**
 * Download a document
 * @param {Object} document - Document object with download URL
 * @returns {Promise<void>}
 */
export const downloadDocument = async (document) => {
  try {
    // In a real implementation, this would handle the actual download
    // const response = await fetch(document.downloadUrl);
    // const blob = await response.blob();
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = document.name;
    // document.body.appendChild(a);
    // a.click();
    // window.URL.revokeObjectURL(url);
    // document.body.removeChild(a);

    // Mock implementation
    console.log('Downloading document:', document.name);
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock download link
    const link = window.document.createElement('a');
    link.href = '#';
    link.download = `${document.name}.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    
    return { success: true, message: 'Document downloaded successfully' };
  } catch (error) {
    console.error('Error downloading document:', error);
    throw new Error('Failed to download document');
  }
};

/**
 * View a document in browser/modal
 * @param {Object} document - Document object with view URL
 * @returns {Promise<void>}
 */
export const viewDocument = async (document) => {
  try {
    // In a real implementation, this would open the document viewer
    // window.open(document.viewUrl, '_blank');
    
    // Mock implementation
    console.log('Viewing document:', document.name);
    
    // Simulate opening in new tab with proper error handling
    try {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        const content = `
          <html>
            <head><title>${document.name}</title></head>
            <body>
              <h1>Document Viewer</h1>
              <p><strong>Document:</strong> ${document.name}</p>
              <p><strong>Type:</strong> ${document.fileType || 'PDF'}</p>
              <p><strong>Size:</strong> ${document.fileSize || 'Unknown'}</p>
              <p>This is a mock document viewer. In a real implementation, the actual document would be displayed here.</p>
            </body>
          </html>
        `;
        newWindow.document.write(content);
        newWindow.document.close();
      } else {
        throw new Error('Popup blocked or failed to open');
      }
    } catch (popupError) {
      console.warn('Failed to open popup, using alert fallback:', popupError);
      alert(`Document: ${document.name}\nType: ${document.fileType || 'PDF'}\nSize: ${document.fileSize || 'Unknown'}`);
    }
    
    return { success: true, message: 'Document opened successfully' };
  } catch (error) {
    console.error('Error viewing document:', error);
    throw new Error('Failed to view document');
  }
};

/**
 * Get document statistics for a policy
 * @param {string} policyNumber - Policy number
 * @returns {Promise<Object>} Document statistics
 */
export const getDocumentStats = async (policyNumber) => {
  try {
    const documents = await getPolicyDocuments(policyNumber);
    
    const stats = {
      totalDocuments: 0,
      premiumCertificates: documents.premiumCertificates.length,
      healthCards: documents.healthCards.length,
      policyDocuments: documents.policyDocuments.length,
      renewalNotices: documents.renewalNotices.length,
      totalSize: 0,
      lastUpdated: null
    };
    
    // Calculate total documents and size
    Object.values(documents).forEach(docArray => {
      if (Array.isArray(docArray)) {
        stats.totalDocuments += docArray.length;
        docArray.forEach(doc => {
          if (doc.fileSize) {
            // Convert file size to bytes for calculation
            const sizeMatch = doc.fileSize.match(/(\d+(?:\.\d+)?)\s*(KB|MB|GB)/i);
            if (sizeMatch) {
              const size = parseFloat(sizeMatch[1]);
              const unit = sizeMatch[2].toUpperCase();
              let bytes = size;
              if (unit === 'KB') bytes *= 1024;
              else if (unit === 'MB') bytes *= 1024 * 1024;
              else if (unit === 'GB') bytes *= 1024 * 1024 * 1024;
              stats.totalSize += bytes;
            }
          }
          
          // Find latest update date
          const docDate = new Date(doc.date || doc.uploadDate || doc.noticeDate);
          if (!stats.lastUpdated || docDate > new Date(stats.lastUpdated)) {
            stats.lastUpdated = docDate.toISOString().split('T')[0];
          }
        });
      }
    });
    
    // Format total size
    if (stats.totalSize > 1024 * 1024 * 1024) {
      stats.totalSizeFormatted = `${(stats.totalSize / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    } else if (stats.totalSize > 1024 * 1024) {
      stats.totalSizeFormatted = `${(stats.totalSize / (1024 * 1024)).toFixed(1)} MB`;
    } else if (stats.totalSize > 1024) {
      stats.totalSizeFormatted = `${(stats.totalSize / 1024).toFixed(1)} KB`;
    } else {
      stats.totalSizeFormatted = `${stats.totalSize} bytes`;
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting document stats:', error);
    throw error;
  }
};

/**
 * Search documents across all types
 * @param {string} policyNumber - Policy number
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Filtered documents
 */
export const searchDocuments = async (policyNumber, searchTerm) => {
  try {
    const documents = await getPolicyDocuments(policyNumber);
    const searchResults = [];
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search through all document types
    Object.entries(documents).forEach(([type, docArray]) => {
      if (Array.isArray(docArray)) {
        docArray.forEach(doc => {
          const searchableText = [
            doc.name,
            doc.type,
            doc.description,
            doc.memberName,
            doc.cardNumber
          ].filter(Boolean).join(' ').toLowerCase();
          
          if (searchableText.includes(searchLower)) {
            searchResults.push({
              ...doc,
              documentType: type,
              matchScore: searchableText.split(searchLower).length - 1
            });
          }
        });
      }
    });
    
    // Sort by match score (higher score = more matches)
    return searchResults.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};