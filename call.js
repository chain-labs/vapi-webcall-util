import Vapi from '@vapi-ai/web';

let vapiClient = null;
let isCallActive = false;
let callData = {};

// Get all DOM elements
const elements = {
    // Display elements
    callIdContainer: document.getElementById('callIdContainer'),
    callIdDisplay: document.getElementById('callIdDisplay'),
    nameDisplay: document.getElementById('nameDisplay'),
    phoneDisplay: document.getElementById('phoneDisplay'),
    emailDisplay: document.getElementById('emailDisplay'),
    businessTypeDisplay: document.getElementById('businessTypeDisplay'),
    countryDisplay: document.getElementById('countryDisplay'),
    websitesDisplay: document.getElementById('websitesDisplay'),

    // Display values
    displayCallId: document.getElementById('displayCallId'),
    displayName: document.getElementById('displayName'),
    displayPhone: document.getElementById('displayPhone'),
    displayEmail: document.getElementById('displayEmail'),
    displayBusinessType: document.getElementById('displayBusinessType'),
    displayCountry: document.getElementById('displayCountry'),
    displayWebsites: document.getElementById('displayWebsites'),

    // Input containers
    callIdInput: document.getElementById('callIdInput'),
    nameInput: document.getElementById('nameInput'),
    phoneInput: document.getElementById('phoneInput'),
    emailInput: document.getElementById('emailInput'),
    businessTypeInput: document.getElementById('businessTypeInput'),
    countryInput: document.getElementById('countryInput'),
    websitesInput: document.getElementById('websitesInput'),

    // Input fields
    callId: document.getElementById('callId'),
    name: document.getElementById('name'),
    phone: document.getElementById('phone'),
    email: document.getElementById('email'),
    businessType: document.getElementById('businessType'),
    country: document.getElementById('country'),
    websites: document.getElementById('websites'),

    // Buttons and status
    startCallBtn: document.getElementById('startCallBtn'),
    endCallBtn: document.getElementById('endCallBtn'),
    status: document.getElementById('status')
};

// Country list for mapping codes to names
const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'PL', name: 'Poland' },
    { code: 'BE', name: 'Belgium' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'AT', name: 'Austria' },
    { code: 'IE', name: 'Ireland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GR', name: 'Greece' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'HU', name: 'Hungary' },
    { code: 'RO', name: 'Romania' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'HR', name: 'Croatia' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LV', name: 'Latvia' },
    { code: 'EE', name: 'Estonia' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
    { code: 'KR', name: 'South Korea' },
    { code: 'SG', name: 'Singapore' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'TH', name: 'Thailand' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'PH', name: 'Philippines' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'AR', name: 'Argentina' },
    { code: 'CL', name: 'Chile' },
    { code: 'CO', name: 'Colombia' },
    { code: 'PE', name: 'Peru' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'IL', name: 'Israel' },
    { code: 'TR', name: 'Turkey' },
    { code: 'RU', name: 'Russia' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'EG', name: 'Egypt' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
    { code: 'GH', name: 'Ghana' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'TW', name: 'Taiwan' },
];

// Populate country dropdown
function populateCountries() {
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        elements.country.appendChild(option);
    });
}

// Function to get country name from code
function getCountryName(code) {
    const country = countries.find(c => c.code === code);
    return country ? country.name : code;
}

// Function to parse query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        callId: params.get('callId') || params.get('call_id'),
        name: params.get('name'),
        phone: params.get('phone'),
        email: params.get('email'),
        businessType: params.get('businessType') || params.get('business_type'),
        country: params.get('country'),
        websites: params.get('websites')
    };
}

// Function to load initial data from localStorage or query params
function loadInitialData() {
    const queryParams = getQueryParams();
    let data = {};

    // Try to get data from localStorage first
    const storedData = localStorage.getItem('vapiCallData');
    if (storedData) {
        try {
            data = JSON.parse(storedData);
        } catch (e) {
            console.error('Error parsing stored call data:', e);
        }
    }

    // Override with query params if provided
    if (queryParams.callId) data.callId = queryParams.callId;
    if (queryParams.name) data.name = queryParams.name;
    if (queryParams.phone) data.phone = queryParams.phone;
    if (queryParams.email) data.email = queryParams.email;
    if (queryParams.businessType) data.business_type = queryParams.businessType;
    if (queryParams.country) data.country = queryParams.country;
    if (queryParams.websites) data.websites = queryParams.websites;

    return data;
}

// Function to setup field (show as input or display)
function setupField(fieldName, value, isOptional = false) {
    const hasValue = value && value.trim() !== '';

    const displayContainer = elements[`${fieldName}Display`];
    const inputContainer = elements[`${fieldName}Input`];
    const displayElement = elements[`display${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`];
    const inputElement = elements[fieldName];

    if (hasValue) {
        // Show display mode
        if (displayContainer) displayContainer.classList.remove('hidden');
        if (inputContainer) inputContainer.classList.add('hidden');

        // Set display value
        if (displayElement) {
            if (fieldName === 'country') {
                displayElement.textContent = getCountryName(value);
            } else {
                displayElement.textContent = value;
            }
        }

        // Store in callData
        if (fieldName === 'businessType') {
            callData.business_type = value;
        } else {
            callData[fieldName] = value;
        }
    } else {
        // Show input mode
        if (!isOptional || fieldName === 'callId') {
            if (displayContainer) displayContainer.classList.add('hidden');
            if (inputContainer) inputContainer.classList.remove('hidden');
        } else {
            // For optional field without value, hide entire container
            if (elements[`${fieldName}Container`]) {
                elements[`${fieldName}Container`].style.display = 'none';
            }
        }

        // Set input value if any
        if (inputElement && value) {
            inputElement.value = value;
        }
    }
}

// Initialize the page
function initializePage() {
    populateCountries();

    const initialData = loadInitialData();

    // Setup each field
    setupField('callId', initialData.callId, true); // Call ID is optional
    setupField('name', initialData.name, false);
    setupField('phone', initialData.phone, false);
    setupField('email', initialData.email, false);
    setupField('businessType', initialData.business_type, false);
    setupField('country', initialData.country, false);
    setupField('websites', initialData.websites, false);

    // Set country name for display
    if (initialData.country) {
        callData.countryName = getCountryName(initialData.country);
    }

    showStatus('Ready to start call', 'info');
}

// Function to get current call data (from callData or inputs)
function getCurrentCallData() {
    const data = { ...callData };

    // Get values from inputs if they're visible
    if (!elements.callIdInput.classList.contains('hidden')) {
        data.callId = elements.callId.value.trim();
    }
    if (!elements.nameInput.classList.contains('hidden')) {
        data.name = elements.name.value.trim();
    }
    if (!elements.phoneInput.classList.contains('hidden')) {
        data.phone = elements.phone.value.trim();
    }
    if (!elements.emailInput.classList.contains('hidden')) {
        data.email = elements.email.value.trim();
    }
    if (!elements.businessTypeInput.classList.contains('hidden')) {
        data.business_type = elements.businessType.value.trim();
    }
    if (!elements.countryInput.classList.contains('hidden')) {
        data.country = elements.country.value;
        data.countryName = getCountryName(data.country);
    }
    if (!elements.websitesInput.classList.contains('hidden')) {
        data.websites = elements.websites.value.trim();
    }

    return data;
}

// Validate required fields
function validateCallData(data) {
    const errors = [];

    if (!data.name) errors.push('Name is required');
    if (!data.phone) errors.push('Phone is required');
    if (!data.email) errors.push('Email is required');
    if (!data.business_type) errors.push('Business type is required');
    if (!data.country) errors.push('Country is required');
    if (!data.websites) errors.push('Website is required');

    return errors;
}

function showStatus(message, type = 'info') {
    elements.status.textContent = message;
    elements.status.className = `status ${type}`;
}

function updateUIState(calling) {
    isCallActive = calling;
    elements.startCallBtn.disabled = calling;
    elements.endCallBtn.disabled = !calling;

    // Disable all inputs during call
    if (calling) {
        elements.callId.disabled = true;
        elements.name.disabled = true;
        elements.phone.disabled = true;
        elements.email.disabled = true;
        elements.businessType.disabled = true;
        elements.country.disabled = true;
        elements.websites.disabled = true;
    } else {
        elements.callId.disabled = false;
        elements.name.disabled = false;
        elements.phone.disabled = false;
        elements.email.disabled = false;
        elements.businessType.disabled = false;
        elements.country.disabled = false;
        elements.websites.disabled = false;
    }
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
    const data = getCurrentCallData();

    // Validate required fields
    const errors = validateCallData(data);
    if (errors.length > 0) {
        showStatus(`Please fill in: ${errors.join(', ')}`, 'error');
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
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    business_type: data.business_type,
                    country: data.country,
                    websites: data.websites
                },
                callId: data.callId || '',
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
initializePage();

console.log('VAPI Web Call page loaded');
