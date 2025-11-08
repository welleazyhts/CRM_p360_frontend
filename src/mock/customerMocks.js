const customers = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    phone: '9876543210',
    registrationDate: '2024-01-15',
    lastContact: '2025-01-10',
    status: 'Active',
    address: '123 MG Road, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    age: 35,
    gender: 'Male',
    lastCapturedDate: '2025-01-10',
    productType: 'Health Insurance',
    policyNumber: 'POL-2024-001',
    policyStatus: 'Active',
    premiumAmount: 25000,
    occupation: 'Software Engineer',
    annualIncome: 1200000,
    maritalStatus: 'Married',
    nomineeDetails: {
      name: 'Priya Sharma',
      relationship: 'Spouse',
      phone: '9876543211'
    },
    medicalHistory: {
      bloodGroup: 'O+',
      allergies: 'None',
      chronicConditions: 'None',
      lastCheckup: '2024-12-15'
    },
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      phone: false
    },
    kycStatus: 'Verified',
    kycDocuments: [
      { type: 'Aadhaar', number: '****-****-1234', verified: true },
      { type: 'PAN', number: 'ABCDE****F', verified: true }
    ],
    bankDetails: {
      accountNumber: '****-****-5678',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branch: 'MG Road Branch'
    },
    riskProfile: 'Low',
    customerSegment: 'Premium',
    loyaltyPoints: 2500,
    referralCode: 'REF123456',
    familyMembers: [
      { 
        id: 'M-1001', 
        name: 'Priya Sharma', 
        relationship: 'Spouse', 
        lastCapturedDate: '2025-01-10', 
        coveredPolicies: ['POL-2024-001'], 
        vehicles: []
      },
      { 
        id: 'M-1002', 
        name: 'Aarav Sharma', 
        relationship: 'Son', 
        lastCapturedDate: '2025-01-10', 
        coveredPolicies: ['POL-2024-001'], 
        vehicles: []
      }
    ],
    vehicles: [
      { id: 'VIN-2024-001', vin: 'VIN-2024-001', make: 'Honda', model: 'City', lastUpdated: '2025-01-10' },
      { id: 'VIN-2024-002', vin: 'VIN-2024-002', make: 'TVS', model: 'Apache', lastUpdated: '2025-01-10' }
    ],
    policies: [
      { id: 1, policyNumber: 'POL-2024-001', type: 'Health Insurance', lastUpdated: '2025-01-10', status: 'Active' },
      { id: 2, policyNumber: 'POL-2023-458', type: 'Life Insurance', lastUpdated: '2024-12-15', status: 'Active' },
      { id: 3, policyNumber: 'POL-2022-789', type: 'Vehicle Insurance', lastUpdated: '2024-03-20', status: 'Expired' }
    ]
  },
  {
    id: 2,
    name: 'Meera Kapoor',
    email: 'meera.kapoor@gmail.com',
    phone: '9876543211',
    registrationDate: '2023-08-20',
    lastContact: '2025-01-08',
    status: 'Active',
    address: '456 Park Street, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    age: 32,
    gender: 'Female',
    lastCapturedDate: '2025-01-08',
    productType: 'Vehicle Insurance',
    policyNumber: 'POL-2023-456',
    policyStatus: 'Active',
    premiumAmount: 18000,
    occupation: 'Marketing Manager',
    annualIncome: 800000,
    maritalStatus: 'Single',
    nomineeDetails: {
      name: 'Sunita Kapoor',
      relationship: 'Mother',
      phone: '9876543212'
    },
    medicalHistory: {
      bloodGroup: 'A+',
      allergies: 'Dust',
      chronicConditions: 'None',
      lastCheckup: '2024-11-20'
    },
    communicationPreferences: {
      email: true,
      sms: false,
      whatsapp: true,
      phone: true
    },
    kycStatus: 'Verified',
    kycDocuments: [
      { type: 'Aadhaar', number: '****-****-5678', verified: true },
      { type: 'PAN', number: 'FGHIJ****K', verified: true }
    ],
    bankDetails: {
      accountNumber: '****-****-9012',
      ifscCode: 'ICIC0001234',
      bankName: 'ICICI Bank',
      branch: 'Park Street Branch'
    },
    riskProfile: 'Medium',
    customerSegment: 'Standard',
    loyaltyPoints: 1800,
    referralCode: 'REF789012',
    familyMembers: [],
    vehicles: [
      { id: 'VIN-2023-001', vin: 'VIN-2023-001', make: 'Maruti', model: 'Swift', lastUpdated: '2025-01-08' }
    ],
    policies: [
      { id: 4, policyNumber: 'POL-2023-456', type: 'Health Insurance', lastUpdated: '2025-01-08', status: 'Active' },
      { id: 5, policyNumber: 'POL-2023-789', type: 'Vehicle Insurance', lastUpdated: '2024-11-15', status: 'Active' }
    ]
  },
  {
    id: 'CUST-1001',
    name: 'rakshith',
    email: 'rakshithb731@gmail.com',
    phone: '06303286099',
    registrationDate: '2025-10-29',
    lastContact: '2025-10-29',
    status: 'Active',
    address: 'Andhra pradhesh, CHITTOOR',
    city: 'CHITTOOR',
    state: 'Andhra Pradesh',
    age: 25,
    gender: 'Male',
    lastCapturedDate: '2025-10-29',
    productType: 'Health Insurance',
    policyNumber: 'POL-2025-001',
    policyStatus: 'Active',
    premiumAmount: 35000,
    occupation: 'Business Analyst',
    annualIncome: 600000,
    maritalStatus: 'Single',
    nomineeDetails: {
      name: 'Vimala B',
      relationship: 'Mother',
      phone: '06303286100'
    },
    medicalHistory: {
      bloodGroup: 'B+',
      allergies: 'None',
      chronicConditions: 'None',
      lastCheckup: '2025-01-15'
    },
    communicationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      phone: true
    },
    kycStatus: 'Verified',
    kycDocuments: [
      { type: 'Aadhaar', number: '****-****-3456', verified: true },
      { type: 'PAN', number: 'LMNOP****Q', verified: true }
    ],
    bankDetails: {
      accountNumber: '****-****-7890',
      ifscCode: 'SBI0001234',
      bankName: 'State Bank of India',
      branch: 'Chittoor Branch'
    },
    riskProfile: 'Low',
    customerSegment: 'Standard',
    loyaltyPoints: 500,
    referralCode: 'REF345678',
    familyMembers: [
      { 
        id: 'M-2001', 
        name: 'Vimala B', 
        relationship: 'Mother', 
        lastCapturedDate: '2025-10-29', 
        coveredPolicies: ['POL-2025-001'], 
        vehicles: [
          { id: 'VIN-2025-003', vin: 'VIN-2025-003', make: 'Honda', model: 'Activa', lastUpdated: '2025-10-29' }
        ]
      },
      { 
        id: 'M-2002', 
        name: 'Venkatesh B', 
        relationship: 'Father', 
        lastCapturedDate: '2025-10-29', 
        coveredPolicies: ['POL-2025-001', 'POL-2025-003'], 
        vehicles: [
          { id: 'VIN-2025-004', vin: 'VIN-2025-004', make: 'Toyota', model: 'Innova', lastUpdated: '2025-10-29' }
        ]
      },
      { 
        id: 'M-2003', 
        name: 'Bhavana B', 
        relationship: 'Sister',
        lastCapturedDate: '2025-10-29', 
        coveredPolicies: ['POL-2025-002'], 
        vehicles: []
      }
    ],
    vehicles: [
      { id: 'VIN-2025-001', vin: 'VIN-2025-001', make: 'Honda', model: 'City', lastUpdated: '2025-10-29' },
      { id: 'VIN-2025-002', vin: 'VIN-2025-002', make: 'TVS', model: 'Apache', lastUpdated: '2025-10-29' }
    ],
    policies: [
      { id: 'POL-2025-001', policyNumber: 'POL-2025-001', type: 'Health Insurance', lastUpdated: '2025-10-29', status: 'Active', members: ['M-2001', 'M-2002'] },
      { id: 'POL-2025-002', policyNumber: 'POL-2025-002', type: 'Vehicle Insurance', lastUpdated: '2025-10-29', status: 'Active', vehicles: ['VIN-2025-001', 'VIN-2025-002'] },
      { id: 'POL-2025-003', policyNumber: 'POL-2025-003', type: 'Life Insurance', lastUpdated: '2025-10-29', status: 'Active', members: ['M-2002'] }
    ]
  }
];

export default customers;