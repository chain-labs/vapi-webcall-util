import Vapi from '@vapi-ai/web';

let vapiClient = null;
let isCallActive = false;

const elements = {
    callId: document.getElementById('callId'),
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    businessType: document.getElementById('businessType'),
    country: document.getElementById('country'),
    websites: document.getElementById('websites'),
    apiKey: document.getElementById('apiKey'),
    assistantId: document.getElementById('assistantId'),
    startCallBtn: document.getElementById('startCallBtn'),
    endCallBtn: document.getElementById('endCallBtn'),
    status: document.getElementById('status')
};

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

// Function to auto-fill form from query parameters and environment variables
function autoFillForm() {
    const queryParams = getQueryParams();

    // Auto-fill from query parameters
    if (queryParams.callId) elements.callId.value = queryParams.callId;
    if (queryParams.name) elements.name.value = queryParams.name;
    if (queryParams.email) elements.email.value = queryParams.email;
    if (queryParams.businessType) elements.businessType.value = queryParams.businessType;
    if (queryParams.country) elements.country.value = queryParams.country;
    if (queryParams.websites) elements.websites.value = queryParams.websites;

    // Auto-fill from environment variables
    if (import.meta.env.VITE_VAPI_PUBLIC_KEY) {
        elements.apiKey.value = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    }
    if (import.meta.env.VITE_VAPI_ASSISTANT_ID) {
        elements.assistantId.value = import.meta.env.VITE_VAPI_ASSISTANT_ID;
    }
}

// Initialize form on page load
autoFillForm();

function showStatus(message, type = 'info') {
    elements.status.textContent = message;
    elements.status.className = `status ${type}`;
}

function validateInputs() {
    const callId = elements.callId.value.trim();
    const name = elements.name.value.trim();
    const email = elements.email.value.trim();
    const businessType = elements.businessType.value.trim();
    const country = elements.country.value.trim();
    const websites = elements.websites.value.trim();
    const apiKey = elements.apiKey.value.trim();
    const assistantId = elements.assistantId.value.trim();

    if (!callId || !name || !email || !businessType || !country || !websites || !apiKey || !assistantId) {
        showStatus('Please fill in all required fields', 'error');
        return false;
    }

    return { callId, name, email, businessType, country, websites, apiKey, assistantId };
}

function updateUIState(calling) {
    isCallActive = calling;
    elements.startCallBtn.disabled = calling;
    elements.endCallBtn.disabled = !calling;
    elements.callId.disabled = calling;
    elements.name.disabled = calling;
    elements.email.disabled = calling;
    elements.businessType.disabled = calling;
    elements.country.disabled = calling;
    elements.websites.disabled = calling;
    elements.apiKey.disabled = calling;
    elements.assistantId.disabled = calling;
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
    const inputs = validateInputs();
    if (!inputs) return;

    const { callId, name, email, businessType, country, websites, apiKey, assistantId } = inputs;

    try {
        showStatus('Initializing call...', 'info');

        initializeVapiClient(apiKey);

        const assistantOverrides = {
            variableValues: {
                customer: {
                    name: name,
                    email: email,
                    business_type: businessType,
                    country: country,
                    websites: websites
                },
                callId: callId,
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

elements.startCallBtn.addEventListener('click', startCall);
elements.endCallBtn.addEventListener('click', endCall);

elements.callId.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isCallActive) startCall();
});

elements.name.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isCallActive) startCall();
});

elements.email.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isCallActive) startCall();
});

elements.businessType.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isCallActive) startCall();
});

elements.country.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isCallActive) startCall();
});

elements.websites.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isCallActive) startCall();
});

elements.apiKey.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isCallActive) startCall();
});

elements.assistantId.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isCallActive) startCall();
});

console.log('VAPI Web Call Utility loaded');
