/**
 * Deduplication Service
 * Handles duplicate detection across multiple data sources
 */

class DedupeService {
  constructor() {
    // Load dedupe configuration from localStorage
    this.loadConfig();
  }

  /**
   * Load dedupe configuration from localStorage
   */
  loadConfig() {
    const savedConfig = localStorage.getItem('dedupe_config');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    } else {
      // Default configuration
      this.config = {
        enabledFields: {
          phone: true,
          email: true,
          address: false,
          panNumber: true,
          vehicleNumber: true,
          aadhaar: false,
          passport: false,
          drivingLicense: false,
          fleetCompany: true
        },
        customFields: [],
        strictMode: false // If true, reject on duplicate; if false, warn only
      };
      this.saveConfig();
    }
  }

  /**
   * Save dedupe configuration to localStorage
   */
  saveConfig() {
    localStorage.setItem('dedupe_config', JSON.stringify(this.config));
  }

  /**
   * Update dedupe configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  /**
   * Get current dedupe configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Normalize phone number for comparison
   */
  normalizePhone(phone) {
    if (!phone) return null;
    // Remove all non-numeric characters
    return phone.toString().replace(/\D/g, '');
  }

  /**
   * Normalize email for comparison
   */
  normalizeEmail(email) {
    if (!email) return null;
    return email.toLowerCase().trim();
  }

  /**
   * Normalize address for comparison
   */
  normalizeAddress(address) {
    if (!address) return null;
    // Remove extra spaces, convert to lowercase
    return address.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  /**
   * Normalize PAN number for comparison
   */
  normalizePAN(pan) {
    if (!pan) return null;
    return pan.toUpperCase().trim();
  }

  /**
   * Normalize vehicle number for comparison
   */
  normalizeVehicleNumber(vehicleNumber) {
    if (!vehicleNumber) return null;
    return vehicleNumber.toUpperCase().replace(/\s+/g, '').trim();
  }

  /**
   * Normalize generic field for comparison
   */
  normalizeGeneric(value) {
    if (!value) return null;
    return value.toString().toLowerCase().trim();
  }

  /**
   * Check for fleet duplicates specifically
   * @param {Object} record - The record to check
   * @param {Array} existingData - Existing records to check against
   * @returns {Object} - Fleet duplicate check result
   */
  checkFleetDuplicate(record, existingData) {
    const fleetDuplicates = [];
    
    // Check for company + vehicle combination
    if (record.company && record.vehicleRegistrationNumber) {
      const normalizedCompany = this.normalizeGeneric(record.company);
      const normalizedVehicle = this.normalizeVehicleNumber(record.vehicleRegistrationNumber);
      
      const fleetMatches = existingData.filter(existing => {
        const existingCompany = this.normalizeGeneric(existing.company);
        const existingVehicle = this.normalizeVehicleNumber(existing.vehicleRegistrationNumber);
        
        return existingCompany === normalizedCompany && existingVehicle === normalizedVehicle;
      });
      
      if (fleetMatches.length > 0) {
        fleetDuplicates.push({
          type: 'fleet',
          company: record.company,
          vehicleNumber: record.vehicleRegistrationNumber,
          matches: fleetMatches.map(m => ({
            id: m.id,
            name: m.firstName + ' ' + m.lastName,
            company: m.company,
            vehicleNumber: m.vehicleRegistrationNumber,
            createdAt: m.createdAt,
            assignedTo: m.assignedTo
          })),
          severity: 'critical'
        });
      }
    }
    
    return {
      isFleetDuplicate: fleetDuplicates.length > 0,
      fleetDuplicates,
      message: fleetDuplicates.length > 0 
        ? `Fleet duplicate detected: ${record.company} already has ${record.vehicleRegistrationNumber} in the system`
        : null
    };
  }

  /**
   * Check for duplicates in a dataset
   * @param {Object} record - The record to check
   * @param {Array} existingData - Existing records to check against
   * @param {String} source - Source identifier (e.g., 'leads', 'contacts', 'customers')
   * @returns {Object} - Duplicate check result
   */
  checkDuplicate(record, existingData, source = 'unknown') {
    const duplicates = [];
    const warnings = [];

    // Check each enabled field
    for (const [field, enabled] of Object.entries(this.config.enabledFields)) {
      if (!enabled) continue;

      const recordValue = this.getNormalizedValue(record, field);
      if (!recordValue) continue;

      // Find duplicates in existing data
      const matches = existingData.filter(existing => {
        const existingValue = this.getNormalizedValue(existing, field);
        return existingValue && existingValue === recordValue;
      });

      if (matches.length > 0) {
        duplicates.push({
          field,
          value: record[this.getFieldMapping(field)],
          matches: matches.map(m => ({
            id: m.id,
            name: m.name || m.firstName + ' ' + m.lastName || 'Unknown',
            source
          })),
          severity: this.getFieldSeverity(field)
        });
      }
    }

    // Check custom fields
    for (const customField of this.config.customFields) {
      if (!customField.enabled) continue;

      const recordValue = this.normalizeGeneric(record[customField.fieldName]);
      if (!recordValue) continue;

      const matches = existingData.filter(existing => {
        const existingValue = this.normalizeGeneric(existing[customField.fieldName]);
        return existingValue && existingValue === recordValue;
      });

      if (matches.length > 0) {
        duplicates.push({
          field: customField.fieldName,
          value: record[customField.fieldName],
          matches: matches.map(m => ({
            id: m.id,
            name: m.name || m.firstName + ' ' + m.lastName || 'Unknown',
            source
          })),
          severity: customField.severity || 'medium'
        });
      }
    }

    // Check for fleet duplicates
    const fleetCheck = this.checkFleetDuplicate(record, existingData);
    if (fleetCheck.isFleetDuplicate) {
      duplicates.push(...fleetCheck.fleetDuplicates);
    }

    return {
      isDuplicate: duplicates.length > 0,
      duplicates,
      warnings,
      canProceed: !this.config.strictMode || duplicates.length === 0,
      fleetDuplicate: fleetCheck.isFleetDuplicate ? fleetCheck : null
    };
  }

  /**
   * Get normalized value for a field
   */
  getNormalizedValue(record, field) {
    const value = record[this.getFieldMapping(field)];

    switch (field) {
      case 'phone':
        return this.normalizePhone(value);
      case 'email':
        return this.normalizeEmail(value);
      case 'address':
        return this.normalizeAddress(value);
      case 'panNumber':
        return this.normalizePAN(value);
      case 'vehicleNumber':
        return this.normalizeVehicleNumber(value);
      default:
        return this.normalizeGeneric(value);
    }
  }

  /**
   * Map dedupe field names to actual record field names
   */
  getFieldMapping(field) {
    const mapping = {
      phone: 'phone',
      email: 'email',
      address: 'address',
      panNumber: 'panNumber',
      vehicleNumber: 'vehicleRegistrationNumber',
      aadhaar: 'aadhaarNumber',
      passport: 'passportNumber',
      drivingLicense: 'drivingLicense',
      fleetCompany: 'company'
    };
    return mapping[field] || field;
  }

  /**
   * Get severity level for a field
   */
  getFieldSeverity(field) {
    const severityMap = {
      phone: 'high',
      email: 'high',
      panNumber: 'critical',
      vehicleNumber: 'high',
      aadhaar: 'critical',
      passport: 'critical',
      address: 'medium',
      drivingLicense: 'medium',
      fleetCompany: 'critical'
    };
    return severityMap[field] || 'medium';
  }

  /**
   * Batch check multiple records for duplicates
   * @param {Array} records - Records to check
   * @param {Array} existingData - Existing records to check against
   * @param {String} source - Source identifier
   * @returns {Object} - Batch check results
   */
  batchCheckDuplicates(records, existingData, source = 'unknown') {
    const results = {
      valid: [],
      duplicates: [],
      totalRecords: records.length,
      validCount: 0,
      duplicateCount: 0
    };

    // Combine existing data with already processed records to catch intra-batch duplicates
    const combinedData = [...existingData];

    records.forEach((record, index) => {
      const checkResult = this.checkDuplicate(record, combinedData, source);

      if (checkResult.isDuplicate) {
        results.duplicates.push({
          rowNumber: index + 1,
          record,
          duplicateInfo: checkResult.duplicates,
          reason: this.formatDuplicateReason(checkResult.duplicates)
        });
        results.duplicateCount++;
      } else {
        results.valid.push({
          rowNumber: index + 1,
          record
        });
        results.validCount++;
        // Add to combined data to catch future intra-batch duplicates
        combinedData.push(record);
      }
    });

    return results;
  }

  /**
   * Format duplicate reason for display
   */
  formatDuplicateReason(duplicates) {
    if (duplicates.length === 0) return '';

    const reasons = duplicates.map(dup => {
      const fieldLabel = this.getFieldLabel(dup.field);
      return `${fieldLabel}: ${dup.value} (Found in ${dup.matches.length} existing record${dup.matches.length > 1 ? 's' : ''})`;
    });

    return reasons.join('; ');
  }

  /**
   * Get human-readable label for field
   */
  getFieldLabel(field) {
    const labels = {
      phone: 'Phone Number',
      email: 'Email Address',
      address: 'Address',
      panNumber: 'PAN Number',
      vehicleNumber: 'Vehicle Number',
      aadhaar: 'Aadhaar Number',
      passport: 'Passport Number',
      drivingLicense: 'Driving License',
      fleetCompany: 'Fleet Company'
    };
    return labels[field] || field;
  }

  /**
   * Add custom dedupe field
   */
  addCustomField(fieldConfig) {
    if (!this.config.customFields) {
      this.config.customFields = [];
    }
    this.config.customFields.push({
      id: Date.now(),
      ...fieldConfig,
      enabled: true
    });
    this.saveConfig();
  }

  /**
   * Remove custom dedupe field
   */
  removeCustomField(fieldId) {
    if (this.config.customFields) {
      this.config.customFields = this.config.customFields.filter(f => f.id !== fieldId);
      this.saveConfig();
    }
  }

  /**
   * Update custom field
   */
  updateCustomField(fieldId, updates) {
    if (this.config.customFields) {
      const index = this.config.customFields.findIndex(f => f.id === fieldId);
      if (index !== -1) {
        this.config.customFields[index] = {
          ...this.config.customFields[index],
          ...updates
        };
        this.saveConfig();
      }
    }
  }
}

// Create singleton instance
const dedupeService = new DedupeService();

export default dedupeService;
