import api from './api';

const CASE_LOGS_BASE_PATH = '/case-logs';

const caseLogService = {
    /**
     * Get case logs by case number
     * GET /api/case-logs/search/case-number/?case_number={caseNumber}
     */
    getLogsByCaseNumber: async (caseNumber) => {
        try {
            const response = await api.get(`${CASE_LOGS_BASE_PATH}/search/case-number/`, {
                params: { case_number: caseNumber }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching logs for case number ${caseNumber}:`, error);
            throw error;
        }
    },

    /**
     * Get case logs by policy number
     * GET /api/case-logs/search/policy-number/?policy_number={policyNumber}
     */
    getLogsByPolicyNumber: async (policyNumber) => {
        try {
            const response = await api.get(`${CASE_LOGS_BASE_PATH}/search/policy-number/`, {
                params: { policy_number: policyNumber }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching logs for policy number ${policyNumber}:`, error);
            throw error;
        }
    }
};

export default caseLogService;
