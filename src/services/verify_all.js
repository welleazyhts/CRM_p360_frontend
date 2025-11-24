const { fetchProviders } = require('./ProvidersService');
const { fetchInsurers } = require('./InsurerProductService');
const { listFeedback } = require('./feedbackserver');
const { fetchDispositions } = require('./DispositionService');
const { fetchState } = require('./CallManagementService');
const { fetchSettings } = require('./AutoQuoteService');

async function run() {
    try {
        console.log('Providers:', await fetchProviders());
        console.log('Insurers:', await fetchInsurers());
        console.log('Feedback:', await listFeedback());
        console.log('Dispositions:', await fetchDispositions());
        console.log('Call State:', await fetchState());
        console.log('AutoQuote Settings:', await fetchSettings());
    } catch (e) {
        console.error('Verification error:', e);
    }
}

run();
