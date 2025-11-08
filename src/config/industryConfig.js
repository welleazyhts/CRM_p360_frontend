// Industry-specific configurations for dynamic field labels and terminology
export const industryConfig = {
  insurance: {
    name: 'Insurance',
    icon: 'shield',
    terminology: {
      // Core business terms
      customer: 'Policyholder',
      customers: 'Policyholders',
      case: 'Policy',
      cases: 'Policies',
      lead: 'Prospect',
      leads: 'Prospects',
      deal: 'Policy Sale',
      deals: 'Policy Sales',

      // Operations
      tracking: 'Policy Tracking',
      management: 'Policy Management',
      pipeline: 'Sales Pipeline',
      analytics: 'Policy Analytics',

      // Fields
      caseId: 'Policy Number',
      caseStatus: 'Policy Status',
      caseType: 'Policy Type',
      caseValue: 'Premium Amount',
      renewalDate: 'Renewal Date',
      expiryDate: 'Expiry Date',

      // Additional fields
      product: 'Insurance Product',
      coverage: 'Coverage Amount',
      beneficiary: 'Beneficiary',
      claim: 'Claim',
      underwriting: 'Underwriting'
    },
    modules: [
      'Policy Management',
      'Claims Management',
      'Renewals',
      'Underwriting',
      'Customer Service',
      'Analytics & Reporting'
    ],
    additionalFields: [
      { name: 'policyType', label: 'Policy Type', type: 'select', options: ['Life', 'Health', 'Auto', 'Home', 'Commercial'], required: true },
      { name: 'coverageAmount', label: 'Default Coverage Amount', type: 'number', required: false },
      { name: 'renewalCycle', label: 'Renewal Cycle', type: 'select', options: ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually'], required: true }
    ]
  },

  automotive: {
    name: 'Automotive',
    icon: 'directions_car',
    terminology: {
      // Core business terms
      customer: 'Customer',
      customers: 'Customers',
      case: 'Vehicle',
      cases: 'Vehicles',
      lead: 'Lead',
      leads: 'Leads',
      deal: 'Sale',
      deals: 'Sales',

      // Operations
      tracking: 'Vehicle Tracking',
      management: 'Fleet Management',
      pipeline: 'Sales Pipeline',
      analytics: 'Sales Analytics',

      // Fields
      caseId: 'VIN / Vehicle ID',
      caseStatus: 'Vehicle Status',
      caseType: 'Vehicle Type',
      caseValue: 'Vehicle Value',
      renewalDate: 'Service Date',
      expiryDate: 'Warranty Expiry',

      // Additional fields
      product: 'Vehicle Model',
      coverage: 'Warranty Coverage',
      beneficiary: 'Owner',
      claim: 'Service Request',
      underwriting: 'Financing'
    },
    modules: [
      'Inventory Management',
      'Sales Management',
      'Service & Maintenance',
      'Fleet Management',
      'Customer Relations',
      'Analytics & Reporting'
    ],
    additionalFields: [
      { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Electric'], required: true },
      { name: 'dealershipType', label: 'Dealership Type', type: 'select', options: ['New Cars', 'Used Cars', 'Both'], required: true },
      { name: 'serviceCenter', label: 'Has Service Center', type: 'checkbox', required: false }
    ]
  },

  realestate: {
    name: 'Real Estate',
    icon: 'home',
    terminology: {
      // Core business terms
      customer: 'Client',
      customers: 'Clients',
      case: 'Property',
      cases: 'Properties',
      lead: 'Lead',
      leads: 'Leads',
      deal: 'Transaction',
      deals: 'Transactions',

      // Operations
      tracking: 'Property Tracking',
      management: 'Property Management',
      pipeline: 'Sales Pipeline',
      analytics: 'Market Analytics',

      // Fields
      caseId: 'Property ID',
      caseStatus: 'Property Status',
      caseType: 'Property Type',
      caseValue: 'Property Value',
      renewalDate: 'Lease Renewal',
      expiryDate: 'Lease Expiry',

      // Additional fields
      product: 'Property',
      coverage: 'Property Size',
      beneficiary: 'Owner/Tenant',
      claim: 'Maintenance Request',
      underwriting: 'Mortgage Processing'
    },
    modules: [
      'Property Listings',
      'Sales Management',
      'Lease Management',
      'Tenant Relations',
      'Maintenance',
      'Analytics & Reporting'
    ],
    additionalFields: [
      { name: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial', 'Industrial', 'Land'], required: true },
      { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Sales', 'Rental', 'Both'], required: true },
      { name: 'propertyManagement', label: 'Property Management Services', type: 'checkbox', required: false }
    ]
  },

  healthcare: {
    name: 'Healthcare',
    icon: 'local_hospital',
    terminology: {
      // Core business terms
      customer: 'Patient',
      customers: 'Patients',
      case: 'Case',
      cases: 'Cases',
      lead: 'Referral',
      leads: 'Referrals',
      deal: 'Appointment',
      deals: 'Appointments',

      // Operations
      tracking: 'Patient Tracking',
      management: 'Patient Management',
      pipeline: 'Appointment Pipeline',
      analytics: 'Clinical Analytics',

      // Fields
      caseId: 'Patient ID',
      caseStatus: 'Case Status',
      caseType: 'Case Type',
      caseValue: 'Treatment Cost',
      renewalDate: 'Follow-up Date',
      expiryDate: 'Treatment End Date',

      // Additional fields
      product: 'Treatment/Service',
      coverage: 'Insurance Coverage',
      beneficiary: 'Emergency Contact',
      claim: 'Insurance Claim',
      underwriting: 'Pre-Authorization'
    },
    modules: [
      'Patient Management',
      'Appointments',
      'Medical Records',
      'Billing',
      'Insurance Claims',
      'Analytics & Reporting'
    ],
    additionalFields: [
      { name: 'facilityType', label: 'Facility Type', type: 'select', options: ['Hospital', 'Clinic', 'Diagnostic Center', 'Pharmacy', 'Multi-Specialty'], required: true },
      { name: 'specializations', label: 'Primary Specializations', type: 'text', required: false },
      { name: 'emrSystem', label: 'EMR/EHR System', type: 'text', required: false }
    ]
  },

  retail: {
    name: 'Retail',
    icon: 'shopping_cart',
    terminology: {
      // Core business terms
      customer: 'Customer',
      customers: 'Customers',
      case: 'Order',
      cases: 'Orders',
      lead: 'Lead',
      leads: 'Leads',
      deal: 'Sale',
      deals: 'Sales',

      // Operations
      tracking: 'Order Tracking',
      management: 'Inventory Management',
      pipeline: 'Sales Pipeline',
      analytics: 'Sales Analytics',

      // Fields
      caseId: 'Order Number',
      caseStatus: 'Order Status',
      caseType: 'Order Type',
      caseValue: 'Order Value',
      renewalDate: 'Reorder Date',
      expiryDate: 'Delivery Date',

      // Additional fields
      product: 'Product',
      coverage: 'Warranty',
      beneficiary: 'Recipient',
      claim: 'Return/Exchange',
      underwriting: 'Credit Check'
    },
    modules: [
      'Sales Management',
      'Inventory Management',
      'Order Processing',
      'Customer Relations',
      'Returns & Exchanges',
      'Analytics & Reporting'
    ],
    additionalFields: [
      { name: 'retailType', label: 'Retail Type', type: 'select', options: ['E-commerce', 'Physical Store', 'Both'], required: true },
      { name: 'productCategories', label: 'Primary Product Categories', type: 'text', required: true },
      { name: 'posSystem', label: 'POS System', type: 'text', required: false }
    ]
  },

  banking: {
    name: 'Banking & Finance',
    icon: 'account_balance',
    terminology: {
      // Core business terms
      customer: 'Account Holder',
      customers: 'Account Holders',
      case: 'Account',
      cases: 'Accounts',
      lead: 'Prospect',
      leads: 'Prospects',
      deal: 'Account Opening',
      deals: 'Account Openings',

      // Operations
      tracking: 'Account Tracking',
      management: 'Account Management',
      pipeline: 'Sales Pipeline',
      analytics: 'Financial Analytics',

      // Fields
      caseId: 'Account Number',
      caseStatus: 'Account Status',
      caseType: 'Account Type',
      caseValue: 'Account Balance',
      renewalDate: 'Review Date',
      expiryDate: 'Maturity Date',

      // Additional fields
      product: 'Financial Product',
      coverage: 'Credit Limit',
      beneficiary: 'Beneficiary',
      claim: 'Dispute/Claim',
      underwriting: 'Credit Assessment'
    },
    modules: [
      'Account Management',
      'Loan Processing',
      'Transaction Management',
      'Customer Service',
      'Compliance',
      'Analytics & Reporting'
    ],
    additionalFields: [
      { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Retail Banking', 'Corporate Banking', 'Investment Services', 'Insurance', 'All'], required: true },
      { name: 'branchCount', label: 'Number of Branches', type: 'number', required: false },
      { name: 'coreSystem', label: 'Core Banking System', type: 'text', required: false }
    ]
  },

  education: {
    name: 'Education',
    icon: 'school',
    terminology: {
      // Core business terms
      customer: 'Student',
      customers: 'Students',
      case: 'Enrollment',
      cases: 'Enrollments',
      lead: 'Inquiry',
      leads: 'Inquiries',
      deal: 'Admission',
      deals: 'Admissions',

      // Operations
      tracking: 'Student Tracking',
      management: 'Student Management',
      pipeline: 'Admission Pipeline',
      analytics: 'Academic Analytics',

      // Fields
      caseId: 'Student ID',
      caseStatus: 'Enrollment Status',
      caseType: 'Program Type',
      caseValue: 'Tuition Fee',
      renewalDate: 'Semester Start',
      expiryDate: 'Program End Date',

      // Additional fields
      product: 'Course/Program',
      coverage: 'Scholarship',
      beneficiary: 'Guardian',
      claim: 'Fee Waiver',
      underwriting: 'Admission Review'
    },
    modules: [
      'Student Management',
      'Admissions',
      'Academics',
      'Fee Management',
      'Alumni Relations',
      'Analytics & Reporting'
    ],
    additionalFields: [
      { name: 'institutionType', label: 'Institution Type', type: 'select', options: ['K-12 School', 'College', 'University', 'Training Institute', 'Online Platform'], required: true },
      { name: 'programTypes', label: 'Program Types Offered', type: 'text', required: true },
      { name: 'studentCapacity', label: 'Student Capacity', type: 'number', required: false }
    ]
  },

  hospitality: {
    name: 'Hospitality',
    icon: 'hotel',
    terminology: {
      // Core business terms
      customer: 'Guest',
      customers: 'Guests',
      case: 'Reservation',
      cases: 'Reservations',
      lead: 'Inquiry',
      leads: 'Inquiries',
      deal: 'Booking',
      deals: 'Bookings',

      // Operations
      tracking: 'Reservation Tracking',
      management: 'Guest Management',
      pipeline: 'Booking Pipeline',
      analytics: 'Occupancy Analytics',

      // Fields
      caseId: 'Booking ID',
      caseStatus: 'Booking Status',
      caseType: 'Room Type',
      caseValue: 'Booking Value',
      renewalDate: 'Check-in Date',
      expiryDate: 'Check-out Date',

      // Additional fields
      product: 'Room/Service',
      coverage: 'Package Details',
      beneficiary: 'Primary Guest',
      claim: 'Complaint',
      underwriting: 'Cancellation Policy'
    },
    modules: [
      'Reservation Management',
      'Guest Services',
      'Housekeeping',
      'Billing',
      'Reviews & Feedback',
      'Analytics & Reporting'
    ],
    additionalFields: [
      { name: 'propertyType', label: 'Property Type', type: 'select', options: ['Hotel', 'Resort', 'Restaurant', 'Event Venue', 'Multi-property'], required: true },
      { name: 'roomCount', label: 'Number of Rooms (if applicable)', type: 'number', required: false },
      { name: 'pmsSystem', label: 'Property Management System', type: 'text', required: false }
    ]
  },

  other: {
    name: 'Other',
    icon: 'business',
    terminology: {
      // Core business terms (generic)
      customer: 'Customer',
      customers: 'Customers',
      case: 'Case',
      cases: 'Cases',
      lead: 'Lead',
      leads: 'Leads',
      deal: 'Deal',
      deals: 'Deals',

      // Operations
      tracking: 'Case Tracking',
      management: 'Case Management',
      pipeline: 'Sales Pipeline',
      analytics: 'Business Analytics',

      // Fields
      caseId: 'Case ID',
      caseStatus: 'Status',
      caseType: 'Type',
      caseValue: 'Value',
      renewalDate: 'Renewal Date',
      expiryDate: 'Expiry Date',

      // Additional fields
      product: 'Product/Service',
      coverage: 'Coverage',
      beneficiary: 'Beneficiary',
      claim: 'Request',
      underwriting: 'Review'
    },
    modules: [
      'Case Management',
      'Customer Management',
      'Sales',
      'Service',
      'Operations',
      'Analytics & Reporting'
    ],
    additionalFields: [
      { name: 'businessType', label: 'Business Type', type: 'text', required: true },
      { name: 'serviceOffered', label: 'Primary Service/Product Offered', type: 'text', required: true },
      { name: 'targetMarket', label: 'Target Market', type: 'text', required: false }
    ]
  }
};

// Helper function to get terminology for a specific industry
export const getTerminology = (industry, term) => {
  const config = industryConfig[industry] || industryConfig.other;
  return config.terminology[term] || term;
};

// Helper function to get all industries
export const getIndustries = () => {
  return Object.keys(industryConfig).map(key => ({
    value: key,
    label: industryConfig[key].name,
    icon: industryConfig[key].icon
  }));
};

// Helper function to get modules for an industry
export const getIndustryModules = (industry) => {
  const config = industryConfig[industry] || industryConfig.other;
  return config.modules;
};

// Helper function to get additional fields for an industry
export const getIndustryFields = (industry) => {
  const config = industryConfig[industry] || industryConfig.other;
  return config.additionalFields;
};

// Industry-specific subdivisions configuration
export const industrySubdivisions = {
  insurance: {
    businessType: {
      label: 'Business Type',
      options: ['Individual', 'Corporate', 'Both']
    },
    policyFocus: {
      label: 'Primary Policy Focus',
      options: ['Life Insurance', 'Health Insurance', 'Auto Insurance', 'Home Insurance', 'Commercial Insurance', 'All Types']
    },
    distributionChannel: {
      label: 'Distribution Channel',
      options: ['Direct Sales', 'Agents/Brokers', 'Bancassurance', 'Online', 'Multi-Channel']
    }
  },
  automotive: {
    businessType: {
      label: 'Business Type',
      options: ['Manufacturer', 'Dealer', 'Service Center', 'Parts Supplier']
    },
    dealershipType: {
      label: 'Dealership Type',
      options: ['New Cars Only', 'Used Cars Only', 'Both New & Used'],
      conditionalOn: { businessType: 'Dealer' }
    },
    vehicleTypes: {
      label: 'Vehicle Types Offered',
      options: ['Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Electric Vehicles', 'All Types']
    },
    services: {
      label: 'Services Offered',
      options: ['Sales', 'Service & Maintenance', 'Parts', 'Financing', 'Insurance', 'All']
    }
  },
  realestate: {
    businessType: {
      label: 'Business Type',
      options: ['Broker/Agent', 'Developer', 'Property Management', 'All']
    },
    propertyFocus: {
      label: 'Property Type Focus',
      options: ['Residential', 'Commercial', 'Industrial', 'Land', 'Mixed Use']
    },
    serviceType: {
      label: 'Service Type',
      options: ['Sales', 'Rentals', 'Property Management', 'All']
    }
  },
  healthcare: {
    facilityType: {
      label: 'Facility Type',
      options: ['Hospital', 'Clinic', 'Diagnostic Center', 'Pharmacy', 'Telemedicine', 'Multi-Specialty']
    },
    ownership: {
      label: 'Ownership',
      options: ['Private', 'Corporate Chain', 'Government', 'Non-Profit']
    },
    bedCapacity: {
      label: 'Bed Capacity',
      options: ['0-50', '51-100', '101-250', '251-500', '500+', 'N/A (Outpatient only)']
    }
  },
  retail: {
    businessType: {
      label: 'Business Type',
      options: ['E-commerce Only', 'Physical Store Only', 'Omnichannel']
    },
    storeFormat: {
      label: 'Store Format',
      options: ['Supermarket', 'Department Store', 'Specialty Store', 'Convenience Store', 'Online Marketplace']
    },
    productCategory: {
      label: 'Primary Product Category',
      options: ['Fashion & Apparel', 'Electronics', 'Groceries', 'Home & Furniture', 'Beauty & Health', 'Multiple Categories']
    }
  },
  banking: {
    institutionType: {
      label: 'Institution Type',
      options: ['Commercial Bank', 'Credit Union', 'Investment Bank', 'Microfinance', 'Digital Bank', 'NBFC']
    },
    serviceOffering: {
      label: 'Service Offering',
      options: ['Retail Banking', 'Corporate Banking', 'Investment Services', 'Insurance', 'All Services']
    },
    branchNetwork: {
      label: 'Branch Network',
      options: ['Single Branch', '2-10 Branches', '11-50 Branches', '50+ Branches', 'Digital Only']
    }
  },
  education: {
    institutionType: {
      label: 'Institution Type',
      options: ['K-12 School', 'College', 'University', 'Vocational Training', 'Online Platform', 'Coaching Center']
    },
    ownership: {
      label: 'Ownership',
      options: ['Private', 'Public/Government', 'Non-Profit', 'Corporate Chain']
    },
    programLevel: {
      label: 'Program Level',
      options: ['Primary', 'Secondary', 'Higher Secondary', 'Undergraduate', 'Postgraduate', 'Professional Courses', 'Multiple Levels']
    }
  },
  hospitality: {
    propertyType: {
      label: 'Property Type',
      options: ['Hotel', 'Resort', 'Restaurant', 'Cafe', 'Event Venue', 'Multi-Property']
    },
    classification: {
      label: 'Classification',
      options: ['Budget', 'Mid-Range', 'Upscale', 'Luxury', 'Mixed']
    },
    serviceType: {
      label: 'Service Type',
      options: ['Full Service', 'Limited Service', 'Fast Food', 'Fine Dining', 'Catering']
    }
  },
  other: {
    businessModel: {
      label: 'Business Model',
      options: ['B2B', 'B2C', 'B2B2C', 'Marketplace', 'SaaS', 'Other']
    },
    serviceArea: {
      label: 'Service Area',
      options: ['Local', 'Regional', 'National', 'International']
    }
  }
};

// Product structure for each industry
export const industryProductStructure = {
  insurance: {
    fields: [
      { name: 'policyName', label: 'Policy Name', type: 'text', required: true },
      { name: 'policyType', label: 'Policy Type', type: 'select', options: ['Life', 'Health', 'Auto', 'Home', 'Commercial'], required: true },
      { name: 'coverageAmount', label: 'Coverage Amount', type: 'number', required: true },
      { name: 'premiumAmount', label: 'Premium Amount', type: 'number', required: true },
      { name: 'premiumFrequency', label: 'Premium Frequency', type: 'select', options: ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually'], required: true },
      { name: 'term', label: 'Policy Term (Years)', type: 'number', required: true },
      { name: 'benefits', label: 'Key Benefits', type: 'textarea', required: false },
      { name: 'exclusions', label: 'Exclusions', type: 'textarea', required: false },
      { name: 'minAge', label: 'Minimum Age', type: 'number', required: false },
      { name: 'maxAge', label: 'Maximum Age', type: 'number', required: false },
      { name: 'isActive', label: 'Active', type: 'checkbox', required: false }
    ]
  },
  automotive: {
    useTabbedForm: true, // Enable tabbed form for automotive
    tabs: [
      {
        id: 'identification',
        label: 'Vehicle Identification',
        icon: 'fingerprint',
        fields: [
          { name: 'vin', label: 'VIN (Vehicle Identification Number)', type: 'text', required: true, placeholder: 'e.g., 1HGBH41JXMN109186' },
          { name: 'chassisNumber', label: 'Chassis Number', type: 'text', required: true, placeholder: 'Manufacturer internal build reference' },
          { name: 'engineNumber', label: 'Engine Number', type: 'text', required: true, placeholder: 'For warranty and servicing' },
          { name: 'registrationNumber', label: 'Registration Number', type: 'text', required: false, placeholder: 'If pre-registered/demo unit' },
          { name: 'stockNumber', label: 'Stock Number', type: 'text', required: true, placeholder: 'Internal dealership reference' }
        ]
      },
      {
        id: 'manufacturer',
        label: 'Manufacturer & Model',
        icon: 'precision_manufacturing',
        fields: [
          { name: 'manufacturerName', label: 'Manufacturer Name', type: 'text', required: true, placeholder: 'e.g., Toyota, BMW, Tata' },
          { name: 'modelName', label: 'Model Name', type: 'text', required: true, placeholder: 'e.g., Innova Crysta, X5, Nexon EV' },
          { name: 'variant', label: 'Variant/Trim', type: 'text', required: true, placeholder: 'e.g., ZX MT Diesel, Luxury Line' },
          { name: 'manufacturingYear', label: 'Manufacturing Year', type: 'number', required: true, placeholder: '2024' },
          { name: 'bodyType', label: 'Body Type', type: 'select', options: ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Coupe', 'Convertible', 'Van', 'Minivan', 'Wagon', 'Truck'], required: true },
          { name: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'CNG', 'LPG'], required: true },
          { name: 'transmission', label: 'Transmission', type: 'select', options: ['Manual', 'Automatic', 'CVT', 'DCT', 'AMT', 'iMT'], required: true },
          { name: 'driveType', label: 'Drive Type', type: 'select', options: ['FWD', 'RWD', 'AWD', '4WD'], required: true }
        ]
      },
      {
        id: 'specifications',
        label: 'Specifications',
        icon: 'settings',
        fields: [
          { name: 'exteriorColor', label: 'Exterior Color', type: 'text', required: true, placeholder: 'Standard manufacturer color' },
          { name: 'interiorColor', label: 'Interior Color', type: 'text', required: false, placeholder: 'Trim-specific detail' },
          { name: 'engineCapacity', label: 'Engine Capacity (cc)', type: 'number', required: false, placeholder: 'e.g., 1498' },
          { name: 'horsepower', label: 'Horsepower (HP)', type: 'number', required: false, placeholder: 'e.g., 150' },
          { name: 'torque', label: 'Torque (Nm)', type: 'number', required: false, placeholder: 'e.g., 250' },
          { name: 'mileage', label: 'Mileage (km/l or km/kWh)', type: 'number', required: false, step: 0.1, placeholder: 'e.g., 18.5' },
          { name: 'batteryCapacity', label: 'Battery Capacity (kWh)', type: 'number', required: false, step: 0.1, placeholder: 'For EVs, e.g., 40.5' },
          { name: 'dimensions', label: 'Dimensions (L×W×H in mm)', type: 'text', required: false, placeholder: 'e.g., 4500×1800×1700' },
          { name: 'weight', label: 'Weight (kg)', type: 'number', required: false, placeholder: 'e.g., 1450' },
          { name: 'seatingCapacity', label: 'Seating Capacity', type: 'number', required: false, placeholder: 'e.g., 5' },
          { name: 'features', label: 'Key Features', type: 'textarea', required: false, placeholder: 'List key features (comma-separated)' }
        ]
      },
      {
        id: 'pricing',
        label: 'Pricing & Costs',
        icon: 'payments',
        fields: [
          { name: 'exShowroomPrice', label: 'Ex-Showroom Price', type: 'number', required: true, step: 0.01, placeholder: 'Base price' },
          { name: 'dealerCost', label: 'Dealer Cost', type: 'number', required: false, step: 0.01, placeholder: 'Procurement price' },
          { name: 'onRoadPrice', label: 'On-Road Price', type: 'number', required: true, step: 0.01, placeholder: 'Customer-facing price' },
          { name: 'gstRate', label: 'GST Rate (%)', type: 'number', required: false, step: 0.01, placeholder: 'e.g., 28' },
          { name: 'roadTax', label: 'Road Tax', type: 'number', required: false, step: 0.01 },
          { name: 'registrationFee', label: 'Registration Fee', type: 'number', required: false, step: 0.01 },
          { name: 'insuranceCost', label: 'Insurance Cost', type: 'number', required: false, step: 0.01 },
          { name: 'discounts', label: 'Discounts / Offers', type: 'textarea', required: false, placeholder: 'Promotional field' },
          { name: 'financingAvailable', label: 'Financing Available', type: 'checkbox', required: false }
        ]
      },
      {
        id: 'inventory',
        label: 'Inventory & Logistics',
        icon: 'warehouse',
        fields: [
          { name: 'stockLocation', label: 'Stock Location', type: 'select', options: ['Warehouse', 'Showroom', 'Yard', 'In-Transit', 'Service Center'], required: true },
          { name: 'stockStatus', label: 'Stock Status', type: 'select', options: ['Available', 'Reserved', 'Sold', 'In-Transit', 'Pre-Booked'], required: true },
          { name: 'dateOfArrival', label: 'Date of Arrival', type: 'date', required: false },
          { name: 'expectedDeliveryDate', label: 'Expected Delivery Date', type: 'date', required: false },
          { name: 'supplier', label: 'Supplier / Distributor', type: 'text', required: false, placeholder: 'Vendor linkage' },
          { name: 'lotNumber', label: 'Lot Number / Batch', type: 'text', required: false, placeholder: 'For group imports' },
          { name: 'odometer', label: 'Odometer Reading (km)', type: 'number', required: false, placeholder: 'Current mileage' }
        ]
      },
      {
        id: 'documentation',
        label: 'Documentation & Compliance',
        icon: 'description',
        fields: [
          { name: 'pdiStatus', label: 'PDI (Pre-Delivery Inspection) Status', type: 'select', options: ['Pending', 'In Progress', 'Completed', 'Failed'], required: true },
          { name: 'rtoPaperwork', label: 'RTO Paperwork', type: 'select', options: ['Pending', 'In Progress', 'Completed'], required: true },
          { name: 'insuranceStatus', label: 'Insurance Status', type: 'select', options: ['Active', 'Pending', 'Expired', 'Not Applicable'], required: true },
          { name: 'insuranceProvider', label: 'Insurance Provider', type: 'text', required: false },
          { name: 'insurancePolicyNumber', label: 'Insurance Policy Number', type: 'text', required: false },
          { name: 'warrantyStartDate', label: 'Warranty Start Date', type: 'date', required: false },
          { name: 'warrantyEndDate', label: 'Warranty End Date', type: 'date', required: false },
          { name: 'warrantyType', label: 'Warranty Type', type: 'text', required: false, placeholder: 'e.g., 3 Years/100,000 km' },
          { name: 'serviceBooklet', label: 'Service Booklet / Manual Available', type: 'checkbox', required: false },
          { name: 'pollutionCertificate', label: 'Pollution Certificate', type: 'select', options: ['Valid', 'Expired', 'Not Applicable'], required: false }
        ]
      },
      {
        id: 'ownership',
        label: 'Ownership & Assignment',
        icon: 'people',
        fields: [
          { name: 'currentOwnerType', label: 'Current Owner Type', type: 'select', options: ['Dealership', 'Demo', 'Customer', 'Trade-In'], required: true },
          { name: 'assignedSalesperson', label: 'Assigned Salesperson', type: 'text', required: false, placeholder: 'CRM linkage' },
          { name: 'customerReservationId', label: 'Customer Reservation ID', type: 'text', required: false, placeholder: 'Sales process reference' },
          { name: 'previousOwners', label: 'Number of Previous Owners', type: 'number', required: false, placeholder: 'For used vehicles' },
          { name: 'customerName', label: 'Customer Name', type: 'text', required: false },
          { name: 'customerContact', label: 'Customer Contact', type: 'text', required: false }
        ]
      },
      {
        id: 'metadata',
        label: 'System Metadata',
        icon: 'info',
        fields: [
          { name: 'remarks', label: 'Remarks / Notes', type: 'textarea', required: false, placeholder: 'Custom remarks by staff' },
          { name: 'internalTags', label: 'Internal Tags', type: 'text', required: false, placeholder: 'Comma-separated tags for search' },
          { name: 'isActive', label: 'Active Listing', type: 'checkbox', required: false },
          { name: 'isFeatured', label: 'Featured Vehicle', type: 'checkbox', required: false },
          { name: 'listingPriority', label: 'Listing Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Urgent'], required: false }
        ]
      },
      {
        id: 'advanced',
        label: 'Advanced Features',
        icon: 'extension',
        fields: [
          { name: 'telematicsDeviceId', label: 'Telematics Device ID', type: 'text', required: false, placeholder: 'IoT Integration' },
          { name: 'simNumber', label: 'SIM Number', type: 'text', required: false },
          { name: 'gpsStatus', label: 'GPS Status', type: 'select', options: ['Active', 'Inactive', 'Not Installed'], required: false },
          { name: 'batteryHealthPercentage', label: 'Battery Health (%)', type: 'number', required: false, placeholder: 'For EVs' },
          { name: 'batteryCycleCount', label: 'Battery Cycle Count', type: 'number', required: false, placeholder: 'For EVs' },
          { name: 'photoUrls', label: 'Photo URLs', type: 'textarea', required: false, placeholder: 'Enter image URLs (one per line)' },
          { name: 'qrCode', label: 'QR Code', type: 'text', required: false, placeholder: 'Auto-generated for yard management' },
          { name: 'digitalTwinId', label: 'Digital Twin ID', type: 'text', required: false, placeholder: 'Metaverse/AR ready' }
        ]
      }
    ]
  },
  realestate: {
    fields: [
      { name: 'propertyName', label: 'Property Name/Title', type: 'text', required: true },
      { name: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial', 'Industrial', 'Land'], required: true },
      { name: 'subType', label: 'Sub Type', type: 'select', options: ['Apartment', 'Villa', 'Plot', 'Office', 'Shop', 'Warehouse'], required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'listingType', label: 'Listing Type', type: 'select', options: ['Sale', 'Rent', 'Lease'], required: true },
      { name: 'address', label: 'Address', type: 'textarea', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'area', label: 'Area (sq ft)', type: 'number', required: true },
      { name: 'bedrooms', label: 'Bedrooms', type: 'number', required: false },
      { name: 'bathrooms', label: 'Bathrooms', type: 'number', required: false },
      { name: 'parking', label: 'Parking Spaces', type: 'number', required: false },
      { name: 'amenities', label: 'Amenities', type: 'textarea', required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'isAvailable', label: 'Available', type: 'checkbox', required: false }
    ]
  },
  healthcare: {
    fields: [
      { name: 'serviceName', label: 'Service/Treatment Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Consultation', 'Diagnostic', 'Surgery', 'Therapy', 'Emergency', 'Preventive Care'], required: true },
      { name: 'department', label: 'Department', type: 'select', options: ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Gynecology', 'Neurology', 'Other'], required: true },
      { name: 'price', label: 'Price/Fee', type: 'number', required: true },
      { name: 'duration', label: 'Duration (minutes)', type: 'number', required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'prerequisites', label: 'Prerequisites', type: 'textarea', required: false },
      { name: 'insuranceCovered', label: 'Insurance Covered', type: 'checkbox', required: false },
      { name: 'isActive', label: 'Active', type: 'checkbox', required: false }
    ]
  },
  retail: {
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text', required: true },
      { name: 'subCategory', label: 'Sub-Category', type: 'text', required: false },
      { name: 'brand', label: 'Brand', type: 'text', required: false },
      { name: 'sku', label: 'SKU', type: 'text', required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'costPrice', label: 'Cost Price', type: 'number', required: false },
      { name: 'stockQuantity', label: 'Stock Quantity', type: 'number', required: true },
      { name: 'reorderLevel', label: 'Reorder Level', type: 'number', required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'specifications', label: 'Specifications', type: 'textarea', required: false },
      { name: 'warranty', label: 'Warranty Period', type: 'text', required: false },
      { name: 'isActive', label: 'Active', type: 'checkbox', required: false }
    ]
  },
  banking: {
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text', required: true },
      { name: 'productType', label: 'Product Type', type: 'select', options: ['Savings Account', 'Current Account', 'Fixed Deposit', 'Loan', 'Credit Card', 'Investment Product'], required: true },
      { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', required: false },
      { name: 'minimumBalance', label: 'Minimum Balance', type: 'number', required: false },
      { name: 'tenure', label: 'Tenure (Months)', type: 'number', required: false },
      { name: 'features', label: 'Key Features', type: 'textarea', required: false },
      { name: 'eligibility', label: 'Eligibility Criteria', type: 'textarea', required: false },
      { name: 'fees', label: 'Fees & Charges', type: 'textarea', required: false },
      { name: 'isActive', label: 'Active', type: 'checkbox', required: false }
    ]
  },
  education: {
    fields: [
      { name: 'courseName', label: 'Course/Program Name', type: 'text', required: true },
      { name: 'courseType', label: 'Course Type', type: 'select', options: ['Certificate', 'Diploma', 'Undergraduate', 'Postgraduate', 'Professional', 'Short Course'], required: true },
      { name: 'department', label: 'Department/Faculty', type: 'text', required: true },
      { name: 'duration', label: 'Duration', type: 'text', required: true },
      { name: 'fees', label: 'Total Fees', type: 'number', required: true },
      { name: 'eligibility', label: 'Eligibility', type: 'textarea', required: false },
      { name: 'description', label: 'Course Description', type: 'textarea', required: false },
      { name: 'seats', label: 'Total Seats', type: 'number', required: false },
      { name: 'isActive', label: 'Active', type: 'checkbox', required: false }
    ]
  },
  hospitality: {
    fields: [
      { name: 'itemName', label: 'Item/Service Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Room', 'Food', 'Beverage', 'Event Space', 'Service', 'Package'], required: true },
      { name: 'subCategory', label: 'Sub-Category', type: 'text', required: false },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'capacity', label: 'Capacity/Quantity', type: 'number', required: false },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'amenities', label: 'Amenities/Features', type: 'textarea', required: false },
      { name: 'availability', label: 'Availability', type: 'select', options: ['Available', 'Limited', 'On Request', 'Not Available'], required: true },
      { name: 'isActive', label: 'Active', type: 'checkbox', required: false }
    ]
  },
  other: {
    fields: [
      { name: 'productName', label: 'Product/Service Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text', required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'specifications', label: 'Specifications', type: 'textarea', required: false },
      { name: 'isActive', label: 'Active', type: 'checkbox', required: false }
    ]
  }
};

// Helper function to get subdivisions for an industry
export const getIndustrySubdivisions = (industry) => {
  return industrySubdivisions[industry] || industrySubdivisions.other;
};

// Helper function to get product structure for an industry
export const getProductStructure = (industry) => {
  return industryProductStructure[industry] || industryProductStructure.other;
};

// Helper function to check if industry uses tabbed form
export const usesTabbedForm = (industry) => {
  const structure = industryProductStructure[industry];
  return structure && structure.useTabbedForm === true;
};

// Helper function to get all fields from tabbed structure (flattened)
export const getAllFieldsFromTabs = (industry) => {
  const structure = industryProductStructure[industry];
  if (!structure || !structure.tabs) return [];

  const allFields = [];
  structure.tabs.forEach(tab => {
    allFields.push(...tab.fields);
  });
  return allFields;
};

export default industryConfig;
