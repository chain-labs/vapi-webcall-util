import Vapi from '@vapi-ai/web';

let vapiClient = null;
let isCallActive = false;
let callData = null;

const elements = {
    userInfo: document.getElementById('userInfo'),
    displayCallId: document.getElementById('displayCallId'),
    displayName: document.getElementById('displayName'),
    displayEmail: document.getElementById('displayEmail'),
    displayBusinessType: document.getElementById('displayBusinessType'),
    displayCountry: document.getElementById('displayCountry'),
    displayWebsites: document.getElementById('displayWebsites'),
    startCallBtn: document.getElementById('startCallBtn'),
    endCallBtn: document.getElementById('endCallBtn'),
    status: document.getElementById('status')
};

// Country list for mapping codes to names
const countryMap = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'IN': 'India',
    'DE': 'Germany',
    'FR': 'France',
    'IT': 'Italy',
    'ES': 'Spain',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'PL': 'Poland',
    'BE': 'Belgium',
    'CH': 'Switzerland',
    'AT': 'Austria',
    'IE': 'Ireland',
    'PT': 'Portugal',
    'GR': 'Greece',
    'CZ': 'Czech Republic',
    'HU': 'Hungary',
    'RO': 'Romania',
    'BG': 'Bulgaria',
    'HR': 'Croatia',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'LT': 'Lithuania',
    'LV': 'Latvia',
    'EE': 'Estonia',
    'JP': 'Japan',
    'CN': 'China',
    'KR': 'South Korea',
    'SG': 'Singapore',
    'MY': 'Malaysia',
    'TH': 'Thailand',
    'VN': 'Vietnam',
    'PH': 'Philippines',
    'ID': 'Indonesia',
    'NZ': 'New Zealand',
    'ZA': 'South Africa',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'AR': 'Argentina',
    'CL': 'Chile',
    'CO': 'Colombia',
    'PE': 'Peru',
    'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
    'IL': 'Israel',
    'TR': 'Turkey',
    'RU': 'Russia',
    'UA': 'Ukraine',
    'EG': 'Egypt',
    'NG': 'Nigeria',
    'KE': 'Kenya',
    'GH': 'Ghana',
    'PK': 'Pakistan',
    'BD': 'Bangladesh',
    'LK': 'Sri Lanka',
    'HK': 'Hong Kong',
    'TW': 'Taiwan',
};

// Function to get country name from code
function getCountryName(code) {
    return countryMap[code] || code;
}

// Function to parse query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        callId: params.get('callId') || params.get('call_id'),
        name: params.get('name'),
        email: params.get('email'),
        businessType: params.get('businessType') || params.get('business_type'),
        country: params.get('country'),
        websites: params.get('websites')
    };
}

// Function to load call data from localStorage or query params
function loadCallData() {
    // First, try to get data from localStorage (form submission)
    const storedData = localStorage.getItem('vapiCallData');
    if (storedData) {
        try {
            callData = JSON.parse(storedData);
            return callData;
        } catch (e) {
            console.error('Error parsing stored call data:', e);
        }
    }

    // If no localStorage data, try query params
    const queryParams = getQueryParams();
    if (queryParams.callId || queryParams.name || queryParams.email) {
        callData = {
            callId: queryParams.callId || '',
            name: queryParams.name || '',
            email: queryParams.email || '',
            business_type: queryParams.businessType || '',
            country: queryParams.country || '',
            countryName: getCountryName(queryParams.country),
            websites: queryParams.websites || ''
        };
        return callData;
    }

    return null;
}

// Function to display user information
function displayUserInfo() {
    const data = loadCallData();

    if (!data) {
        showStatus('No call data found. Please fill out the form first.', 'error');
        elements.startCallBtn.disabled = true;
        return false;
    }

    // Display the information
    elements.displayCallId.textContent = data.callId || '-';
    elements.displayName.textContent = data.name || '-';
    elements.displayEmail.textContent = data.email || '-';
    elements.displayBusinessType.textContent = data.business_type || '-';
    elements.displayCountry.textContent = data.countryName || data.country || '-';
    elements.displayWebsites.textContent = data.websites || '-';

    // Show the user info section
    elements.userInfo.classList.remove('hidden');

    return true;
}

function showStatus(message, type = 'info') {
    elements.status.textContent = message;
    elements.status.className = `status ${type}`;
}

function updateUIState(calling) {
    isCallActive = calling;
    elements.startCallBtn.disabled = calling;
    elements.endCallBtn.disabled = !calling;
}

function initializeVapiClient(apiKey) {
    if (!vapiClient) {
        vapiClient = new Vapi(apiKey);

        vapiClient.on('call-start', () => {
            console.log('Call started');
            showStatus('Call connected! You can now speak.', 'active');
            updateUIState(true);
        });

        vapiClient.on('call-end', () => {
            console.log('Call ended');
            showStatus('Call ended successfully', 'success');
            updateUIState(false);
        });

        vapiClient.on('speech-start', () => {
            console.log('Assistant is speaking');
        });

        vapiClient.on('speech-end', () => {
            console.log('Assistant finished speaking');
        });

        vapiClient.on('volume-level', (volume) => {
            console.log('Volume level:', volume);
        });

        vapiClient.on('message', (message) => {
            console.log('Message from VAPI:', message);
        });

        vapiClient.on('error', (error) => {
            console.error('VAPI Error:', error);
            showStatus(`Error: ${error.message || 'An error occurred'}`, 'error');
            updateUIState(false);
        });
    }
}

async function startCall() {
    if (!callData) {
        showStatus('No call data available. Please fill out the form.', 'error');
        return;
    }

    // Get API key and assistant ID from environment variables
    const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

    if (!apiKey) {
        showStatus('VAPI API key not found. Please set VITE_VAPI_PUBLIC_KEY environment variable.', 'error');
        return;
    }

    if (!assistantId) {
        showStatus('Assistant ID not found. Please set VITE_VAPI_ASSISTANT_ID environment variable.', 'error');
        return;
    }

    try {
        showStatus('Initializing call...', 'info');

        initializeVapiClient(apiKey);

        const assistantOverrides = {
            variableValues: {
                customer: {
                    name: callData.name,
                    email: callData.email,
                    business_type: callData.business_type,
                    country: callData.country,
                    websites: callData.websites
                },
                callId: callData.callId,
                currentTime: new Date().toISOString()
            }
        };

        console.log('Starting call with assistantId:', assistantId);
        console.log('Assistant overrides:', assistantOverrides);

        await vapiClient.start(assistantId, assistantOverrides);

    } catch (error) {
        console.error('Error starting call:', error);
        showStatus(`Failed to start call: ${error.message}`, 'error');
        updateUIState(false);
    }
}

function endCall() {
    if (vapiClient && isCallActive) {
        try {
            vapiClient.stop();
            showStatus('Ending call...', 'info');
        } catch (error) {
            console.error('Error ending call:', error);
            showStatus(`Error ending call: ${error.message}`, 'error');
        }
    }
}

// Event listeners
elements.startCallBtn.addEventListener('click', startCall);
elements.endCallBtn.addEventListener('click', endCall);

// Initialize on page load
if (displayUserInfo()) {
    showStatus('Ready to start call', 'info');
}

console.log('VAPI Web Call page loaded');
