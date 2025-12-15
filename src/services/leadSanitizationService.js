/**
 * Lead Sanitization Service
 * Comprehensive data cleaning, validation, and standardization for lead data
 */

// Validation Result Status
export const VALIDATION_STATUS = {
  VALID: 'valid',
  INVALID: 'invalid',
  WARNING: 'warning',
  CORRECTED: 'corrected'
};

// Lead Quality Score Levels
export const QUALITY_LEVELS = {
  EXCELLENT: 'excellent',  // 90-100
  GOOD: 'good',           // 70-89
  FAIR: 'fair',           // 50-69
  POOR: 'poor'            // 0-49
};

const leadSanitizationService = {
  /**
   * Sanitize complete lead data
   * @param {Object} leadData - Raw lead data
   * @returns {Object} Sanitized lead with validation report
   */
  sanitizeLead(leadData) {
    const sanitized = {};
    const validationReport = {
      isValid: true,
      errors: [],
      warnings: [],
      corrections: [],
      qualityScore: 0,
      qualityLevel: QUALITY_LEVELS.POOR,
      fields: {}
    };

    // Sanitize each field
    const nameResult = this.sanitizeName(leadData.firstName, leadData.lastName);
    sanitized.firstName = nameResult.firstName;
    sanitized.lastName = nameResult.lastName;
    sanitized.fullName = nameResult.fullName;
    validationReport.fields.name = nameResult.validation;

    const emailResult = this.sanitizeEmail(leadData.email);
    sanitized.email = emailResult.email;
    validationReport.fields.email = emailResult.validation;

    const phoneResult = this.sanitizePhone(leadData.phone);
    sanitized.phone = phoneResult.phone;
    validationReport.fields.phone = phoneResult.validation;

    const vehicleResult = this.sanitizeVehicleNumber(leadData.vehicleNumber);
    sanitized.vehicleNumber = vehicleResult.vehicleNumber;
    validationReport.fields.vehicleNumber = vehicleResult.validation;

    const panResult = this.sanitizePAN(leadData.pan);
    sanitized.pan = panResult.pan;
    validationReport.fields.pan = panResult.validation;

    const aadhaarResult = this.sanitizeAadhaar(leadData.aadhaar);
    sanitized.aadhaar = aadhaarResult.aadhaar;
    validationReport.fields.aadhaar = aadhaarResult.validation;

    const pincodeResult = this.sanitizePincode(leadData.pincode);
    sanitized.pincode = pincodeResult.pincode;
    validationReport.fields.pincode = pincodeResult.validation;

    const addressResult = this.sanitizeAddress(leadData.address);
    sanitized.address = addressResult.address;
    validationReport.fields.address = addressResult.validation;

    // Calculate quality score
    const qualityScore = this.calculateLeadQuality(validationReport.fields);
    validationReport.qualityScore = qualityScore.score;
    validationReport.qualityLevel = qualityScore.level;

    // Aggregate errors and warnings
    Object.values(validationReport.fields).forEach(field => {
      if (field.status === VALIDATION_STATUS.INVALID) {
        validationReport.errors.push(field.message);
        validationReport.isValid = false;
      } else if (field.status === VALIDATION_STATUS.WARNING) {
        validationReport.warnings.push(field.message);
      } else if (field.status === VALIDATION_STATUS.CORRECTED) {
        validationReport.corrections.push(field.message);
      }
    });

    return {
      sanitized,
      validationReport
    };
  },

  /**
   * Sanitize name fields
   */
  sanitizeName(firstName, lastName) {
    const cleanFirst = this.cleanText(firstName);
    const cleanLast = this.cleanText(lastName);

    // Capitalize first letter of each word
    const capitalizeFirst = cleanFirst
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const capitalizeLast = cleanLast
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const fullName = `${capitalizeFirst} ${capitalizeLast}`.trim();

    let validation = {
      status: VALIDATION_STATUS.VALID,
      message: 'Name is valid'
    };

    if (!cleanFirst || !cleanLast) {
      validation = {
        status: VALIDATION_STATUS.INVALID,
        message: 'Both first name and last name are required'
      };
    } else if (cleanFirst !== capitalizeFirst || cleanLast !== capitalizeLast) {
      validation = {
        status: VALIDATION_STATUS.CORRECTED,
        message: 'Name has been capitalized correctly'
      };
    }

    // Check for special characters or numbers
    if (/[^a-zA-Z\s]/.test(fullName)) {
      validation = {
        status: VALIDATION_STATUS.WARNING,
        message: 'Name contains special characters or numbers'
      };
    }

    return {
      firstName: capitalizeFirst,
      lastName: capitalizeLast,
      fullName,
      validation
    };
  },

  /**
   * Sanitize email address
   */
  sanitizeEmail(email) {
    if (!email) {
      return {
        email: null,
        validation: {
          status: VALIDATION_STATUS.WARNING,
          message: 'Email not provided'
        }
      };
    }

    const cleaned = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let validation = {
      status: VALIDATION_STATUS.VALID,
      message: 'Email is valid'
    };

    if (!emailRegex.test(cleaned)) {
      validation = {
        status: VALIDATION_STATUS.INVALID,
        message: 'Invalid email format'
      };
    } else if (email !== cleaned) {
      validation = {
        status: VALIDATION_STATUS.CORRECTED,
        message: 'Email has been cleaned and lowercased'
      };
    }

    // Check for disposable email domains
    const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'];
    const domain = cleaned.split('@')[1];
    if (disposableDomains.includes(domain)) {
      validation = {
        status: VALIDATION_STATUS.WARNING,
        message: 'Email appears to be from a disposable email service'
      };
    }

    return {
      email: cleaned,
      validation
    };
  },

  /**
   * Sanitize phone number (Indian)
   */
  sanitizePhone(phone) {
    if (!phone) {
      return {
        phone: null,
        validation: {
          status: VALIDATION_STATUS.INVALID,
          message: 'Phone number is required'
        }
      };
    }

    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Remove leading 0 or 91
    let normalized = cleaned;
    if (normalized.startsWith('91') && normalized.length === 12) {
      normalized = normalized.substring(2);
    } else if (normalized.startsWith('0') && normalized.length === 11) {
      normalized = normalized.substring(1);
    }

    // Format as +91-XXXXX-XXXXX
    const formatted = normalized.length === 10
      ? `+91-${normalized.substring(0, 5)}-${normalized.substring(5)}`
      : phone;

    let validation = {
      status: VALIDATION_STATUS.VALID,
      message: 'Phone number is valid'
    };

    // Validate Indian mobile number (should start with 6, 7, 8, or 9)
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(normalized)) {
      validation = {
        status: VALIDATION_STATUS.INVALID,
        message: 'Invalid Indian mobile number format'
      };
    } else if (phone !== formatted) {
      validation = {
        status: VALIDATION_STATUS.CORRECTED,
        message: 'Phone number has been formatted to +91-XXXXX-XXXXX'
      };
    }

    // Check for obviously fake numbers
    const repeatingDigits = /^(.)\1{9}$/;
    const sequential = ['0123456789', '9876543210', '1234567890'];
    if (repeatingDigits.test(normalized) || sequential.some(seq => seq.includes(normalized))) {
      validation = {
        status: VALIDATION_STATUS.WARNING,
        message: 'Phone number appears to be invalid (repeating or sequential digits)'
      };
    }

    return {
      phone: formatted,
      validation
    };
  },

  /**
   * Sanitize vehicle registration number
   */
  sanitizeVehicleNumber(vehicleNumber) {
    if (!vehicleNumber) {
      return {
        vehicleNumber: null,
        validation: {
          status: VALIDATION_STATUS.WARNING,
          message: 'Vehicle number not provided'
        }
      };
    }

    // Remove spaces and convert to uppercase
    const cleaned = vehicleNumber.replace(/\s/g, '').toUpperCase();

    // Indian vehicle number format: XX00XX0000 or XX-00-XX-0000
    const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$/;

    // Format as XX-00-XX-0000
    let formatted = cleaned;
    if (vehicleRegex.test(cleaned)) {
      // Extract parts
      const state = cleaned.substring(0, 2);
      const rto = cleaned.substring(2, 4);
      const series = cleaned.substring(4, cleaned.length - 4);
      const number = cleaned.substring(cleaned.length - 4);
      formatted = `${state}-${rto}-${series}-${number}`;
    }

    let validation = {
      status: VALIDATION_STATUS.VALID,
      message: 'Vehicle number is valid'
    };

    if (!vehicleRegex.test(cleaned)) {
      validation = {
        status: VALIDATION_STATUS.INVALID,
        message: 'Invalid vehicle registration number format'
      };
    } else if (vehicleNumber !== formatted) {
      validation = {
        status: VALIDATION_STATUS.CORRECTED,
        message: 'Vehicle number has been formatted correctly'
      };
    }

    return {
      vehicleNumber: formatted,
      validation
    };
  },

  /**
   * Sanitize PAN (Permanent Account Number)
   */
  sanitizePAN(pan) {
    if (!pan) {
      return {
        pan: null,
        validation: {
          status: VALIDATION_STATUS.WARNING,
          message: 'PAN not provided'
        }
      };
    }

    const cleaned = pan.replace(/\s/g, '').toUpperCase();

    // PAN format: AAAAA0000A (5 letters, 4 digits, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    let validation = {
      status: VALIDATION_STATUS.VALID,
      message: 'PAN is valid'
    };

    if (!panRegex.test(cleaned)) {
      validation = {
        status: VALIDATION_STATUS.INVALID,
        message: 'Invalid PAN format (should be AAAAA0000A)'
      };
    } else if (pan !== cleaned) {
      validation = {
        status: VALIDATION_STATUS.CORRECTED,
        message: 'PAN has been cleaned and uppercased'
      };
    }

    return {
      pan: cleaned,
      validation
    };
  },

  /**
   * Sanitize Aadhaar number
   */
  sanitizeAadhaar(aadhaar) {
    if (!aadhaar) {
      return {
        aadhaar: null,
        validation: {
          status: VALIDATION_STATUS.WARNING,
          message: 'Aadhaar not provided'
        }
      };
    }

    // Remove all non-numeric characters
    const cleaned = aadhaar.replace(/\D/g, '');

    // Format as XXXX-XXXX-XXXX
    const formatted = cleaned.length === 12
      ? `${cleaned.substring(0, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8)}`
      : aadhaar;

    let validation = {
      status: VALIDATION_STATUS.VALID,
      message: 'Aadhaar is valid'
    };

    if (cleaned.length !== 12) {
      validation = {
        status: VALIDATION_STATUS.INVALID,
        message: 'Aadhaar must be exactly 12 digits'
      };
    } else if (aadhaar !== formatted) {
      validation = {
        status: VALIDATION_STATUS.CORRECTED,
        message: 'Aadhaar has been formatted to XXXX-XXXX-XXXX'
      };
    }

    // Check for obviously fake numbers
    if (/^(.)\1{11}$/.test(cleaned)) {
      validation = {
        status: VALIDATION_STATUS.WARNING,
        message: 'Aadhaar appears to be invalid (all same digits)'
      };
    }

    return {
      aadhaar: formatted,
      validation
    };
  },

  /**
   * Sanitize pincode
   */
  sanitizePincode(pincode) {
    if (!pincode) {
      return {
        pincode: null,
        validation: {
          status: VALIDATION_STATUS.WARNING,
          message: 'Pincode not provided'
        }
      };
    }

    const cleaned = pincode.toString().replace(/\D/g, '');

    let validation = {
      status: VALIDATION_STATUS.VALID,
      message: 'Pincode is valid'
    };

    if (cleaned.length !== 6) {
      validation = {
        status: VALIDATION_STATUS.INVALID,
        message: 'Indian pincode must be exactly 6 digits'
      };
    } else if (pincode.toString() !== cleaned) {
      validation = {
        status: VALIDATION_STATUS.CORRECTED,
        message: 'Pincode has been cleaned'
      };
    }

    return {
      pincode: cleaned,
      validation
    };
  },

  /**
   * Sanitize address
   */
  sanitizeAddress(address) {
    if (!address) {
      return {
        address: null,
        validation: {
          status: VALIDATION_STATUS.WARNING,
          message: 'Address not provided'
        }
      };
    }

    // Clean and standardize
    let cleaned = this.cleanText(address);

    // Standardize common abbreviations
    const abbreviations = {
      'st': 'Street',
      'rd': 'Road',
      'ave': 'Avenue',
      'blvd': 'Boulevard',
      'apt': 'Apartment',
      'bldg': 'Building'
    };

    Object.entries(abbreviations).forEach(([abbr, full]) => {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      cleaned = cleaned.replace(regex, full);
    });

    let validation = {
      status: VALIDATION_STATUS.VALID,
      message: 'Address is valid'
    };

    if (cleaned.length < 10) {
      validation = {
        status: VALIDATION_STATUS.WARNING,
        message: 'Address appears to be too short or incomplete'
      };
    } else if (address !== cleaned) {
      validation = {
        status: VALIDATION_STATUS.CORRECTED,
        message: 'Address has been standardized'
      };
    }

    return {
      address: cleaned,
      validation
    };
  },

  /**
   * Clean text - remove extra spaces, trim
   */
  cleanText(text) {
    if (!text) return '';
    return text.toString().trim().replace(/\s+/g, ' ');
  },

  /**
   * Calculate lead quality score
   */
  calculateLeadQuality(fields) {
    let score = 0;
    const weights = {
      name: 15,
      email: 15,
      phone: 25,
      vehicleNumber: 15,
      pan: 10,
      aadhaar: 10,
      pincode: 5,
      address: 5
    };

    Object.entries(fields).forEach(([fieldName, field]) => {
      if (field.status === VALIDATION_STATUS.VALID || field.status === VALIDATION_STATUS.CORRECTED) {
        score += weights[fieldName] || 0;
      } else if (field.status === VALIDATION_STATUS.WARNING) {
        score += (weights[fieldName] || 0) * 0.5;
      }
    });

    let level = QUALITY_LEVELS.POOR;
    if (score >= 90) level = QUALITY_LEVELS.EXCELLENT;
    else if (score >= 70) level = QUALITY_LEVELS.GOOD;
    else if (score >= 50) level = QUALITY_LEVELS.FAIR;

    return { score, level };
  },

  /**
   * Batch sanitize multiple leads
   */
  sanitizeLeads(leads) {
    return leads.map(lead => this.sanitizeLead(lead));
  },

  /**
   * Detect and flag duplicate leads
   */
  detectDuplicates(lead, existingLeads) {
    const duplicates = {
      phone: [],
      email: [],
      vehicleNumber: [],
      pan: []
    };

    existingLeads.forEach(existing => {
      if (lead.phone && existing.phone === lead.phone) {
        duplicates.phone.push(existing.id);
      }
      if (lead.email && existing.email === lead.email) {
        duplicates.email.push(existing.id);
      }
      if (lead.vehicleNumber && existing.vehicleNumber === lead.vehicleNumber) {
        duplicates.vehicleNumber.push(existing.id);
      }
      if (lead.pan && existing.pan === lead.pan) {
        duplicates.pan.push(existing.id);
      }
    });

    const hasDuplicates = Object.values(duplicates).some(arr => arr.length > 0);

    return {
      hasDuplicates,
      duplicates,
      duplicateCount: Object.values(duplicates).reduce((sum, arr) => sum + arr.length, 0)
    };
  }
};

export default leadSanitizationService;
