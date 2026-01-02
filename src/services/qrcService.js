import api from './api';

const BASE_PATH = '/qrc_management';

// Helper to convert camelCase to snake_case for API payload
const toApiPayload = (data) => {
  const payload = {};
  const map = {
    communicationMode: 'communication_mode',
    caller: 'caller_type', // frontend 'caller' maps to backend 'caller_type'
    callType: 'call_type',
    resolution: 'resolution_status',
    callReason: 'call_reason',
    callDateTime: 'call_date_time',
    callerName: 'name_of_caller',
    taCode: 'ta_case_code',
    csrName: 'csr_name',
    icName: 'ic_name',
    callerEmail: 'caller_email',
    state: 'state',
    city: 'city',
    contactNumber: 'contact_number',
    remarks: 'remarks',
    isSuspiciousCase: 'suspicious_case',
    callId: 'call_id' // if needed, though usually ID is separate
  };

  Object.keys(data).forEach(key => {
    const apiKey = map[key] || key;
    let value = data[key];

    // Handle Date conversion
    if (key === 'callDateTime' && value) {
      try {
        const d = new Date(value);
        if (!Number.isNaN(d.getTime())) {
          value = d.toISOString();
        }
      } catch (e) {
        // keep original if conversion fails
      }
    }

    // Lowercase Enums
    if (['communication_mode', 'caller_type', 'call_type', 'resolution_status', 'state'].includes(apiKey) && typeof value === 'string') {
      value = value.toLowerCase();
    }

    // Slugify fields like ic_name (e.g. "Pnb Metlife IC" -> "pnb_metlife_ic")
    else if ((apiKey === 'ic_name' || apiKey === 'call_reason') && typeof value === 'string') {
      value = value.toLowerCase().replace(/ /g, '_');
    }

    payload[apiKey] = value;
  });

  return payload;
};

// Helper to convert snake_case to camelCase for frontend consumption
const fromApiResponse = (item) => {
  if (!item) return item;

  // Mapping reverse of toApiPayload
  const map = {
    communication_mode: 'communicationMode',
    caller_type: 'caller',
    call_type: 'callType',
    resolution_status: 'resolution',
    call_reason: 'callReason',
    call_date_time: 'callDateTime',
    name_of_caller: 'callerName',
    ta_case_code: 'taCode',
    csr_name: 'csrName',
    ic_name: 'icName',
    caller_email: 'callerEmail',
    state: 'state',
    city: 'city',
    contact_number: 'contactNumber',
    remarks: 'remarks',
    suspicious_case: 'isSuspiciousCase',
    id: 'id',
    call_id: 'callId' // Sometimes backend might send separate call_id
  };

  const newData = {};
  Object.keys(item).forEach(key => {
    const newKey = map[key] || key;
    newData[newKey] = item[key];
  });

  // Ensure ID is present if it's 'pk' or '_id'
  if (!newData.id && (item.pk || item._id)) {
    newData.id = item.pk || item._id;
  }

  // If no separate callId, maybe use id? Or leave blank.
  if (!newData.callId && newData.id) {
    // optional: newData.callId = newData.id;
  }

  return newData;
};

const qrcService = {
  /**
   * List all QRC entries
   * GET /api/qrc_management/list/
   */
  list: async (params = {}) => {
    try {
      const response = await api.get(`${BASE_PATH}/list/`, { params });
      const data = response.data;

      // Handle pagination results { results: [...] } or direct array [...]
      if (Array.isArray(data)) {
        return data.map(fromApiResponse);
      } else if (data && Array.isArray(data.results)) {
        return {
          ...data,
          results: data.results.map(fromApiResponse)
        };
      }
      return [];
    } catch (error) {
      console.error('Error fetching QRC list:', error);
      throw error;
    }
  },

  /**
   * Retrieve a single QRC entry
   * GET /api/qrc_management/list/{id}/
   */
  retrieve: async (id) => {
    try {
      const response = await api.get(`${BASE_PATH}/list/${id}/`);
      return fromApiResponse(response.data);
    } catch (error) {
      console.error(`Error retrieving QRC entry ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new QRC entry
   * POST /api/qrc_management/create/
   */
  create: async (data) => {
    try {
      const payload = toApiPayload(data);
      const response = await api.post(`${BASE_PATH}/create/`, payload);
      return fromApiResponse(response.data);
    } catch (error) {
      console.error('Error creating QRC entry:', error);
      throw error;
    }
  },

  /**
   * Update an existing QRC entry
   * PUT /api/qrc_management/update/{id}/
   */
  update: async (id, data) => {
    try {
      const payload = toApiPayload(data);
      const response = await api.put(`${BASE_PATH}/update/${id}/`, payload);
      return fromApiResponse(response.data);
    } catch (error) {
      console.error(`Error updating QRC entry ${id}:`, error);
      throw error;
    }
  },

  /**
   * Partially update (PATCH)
   * PUT /api/qrc_management/update/{id}/ (Collection says partial_update uses same endpoint)
   * But usually PATCH method. We'll support both via helper, defaulting to PUT as per collection structure if needed,
   * but usually 'partial_update' implies PATCH. API.js supports patch.
   */
  partialUpdate: async (id, data) => {
    try {
      const payload = toApiPayload(data);
      // Using patch method, assuming backend supports standard Django DRF PATCH
      const response = await api.patch(`${BASE_PATH}/update/${id}/`, payload);
      return fromApiResponse(response.data);
    } catch (error) {
      console.error(`Error partially updating QRC entry ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a QRC entry
   * DELETE /api/qrc_management/delete/{id}/
   */
  destroy: async (id) => {
    try {
      const response = await api.delete(`${BASE_PATH}/delete/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting QRC entry ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search QRC entries
   * GET /api/qrc_management/search/
   */
  search: async (params = {}) => {
    try {
      const response = await api.get(`${BASE_PATH}/search/`, { params });
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(fromApiResponse);
      } else if (data && Array.isArray(data.results)) {
        return {
          ...data,
          results: data.results.map(fromApiResponse)
        };
      }
      return [];
    } catch (error) {
      console.error('Error searching QRC entries:', error);
      throw error;
    }
  },

  /**
   * Get Dashboard Stats
   * GET /api/qrc_management/dashboard-stats/
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get(`${BASE_PATH}/dashboard-stats/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching QRC dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Filter entries
   * GET /api/qrc_management/filter/
   */
  filter: async (params = {}) => {
    try {
      const response = await api.get(`${BASE_PATH}/filter/`, { params });
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map(fromApiResponse);
      } else if (data && Array.isArray(data.results)) {
        return {
          ...data,
          results: data.results.map(fromApiResponse)
        };
      }
      return [];
    } catch (error) {
      console.error('Error filtering QRC entries:', error);
      throw error;
    }
  }
};

export default qrcService;
