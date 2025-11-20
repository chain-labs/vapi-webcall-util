// Country list with ISO 3166-1 alpha-2 codes
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

// DOM elements
const form = document.getElementById('contactForm');
const statusDiv = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');

// Input elements
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const countrySelect = document.getElementById('country');
const businessTypeInput = document.getElementById('business_type');
const websitesInput = document.getElementById('websites');

// Error message elements
const nameError = document.getElementById('nameError');
const phoneError = document.getElementById('phoneError');
const emailError = document.getElementById('emailError');
const countryError = document.getElementById('countryError');
const businessTypeError = document.getElementById('businessTypeError');
const websitesError = document.getElementById('websitesError');

// Function to get country name from code
function getCountryName(code) {
    const country = countries.find(c => c.code === code);
    return country ? country.name : code;
}

// Populate country dropdown
function populateCountries() {
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });
}

// Function to parse query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name'),
        phone: params.get('phone'),
        email: params.get('email'),
        businessType: params.get('businessType') || params.get('business_type'),
        country: params.get('country'),
        websites: params.get('websites')
    };
}

// Function to auto-fill form from query parameters
function autoFillForm() {
    const queryParams = getQueryParams();

    if (queryParams.name) nameInput.value = queryParams.name;
    if (queryParams.phone) phoneInput.value = queryParams.phone;
    if (queryParams.email) emailInput.value = queryParams.email;
    if (queryParams.businessType) businessTypeInput.value = queryParams.businessType;
    if (queryParams.country) countrySelect.value = queryParams.country;
    if (queryParams.websites) websitesInput.value = queryParams.websites;
}

// Validation functions
function validateName(name) {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: 'Name is required' };
    }
    if (name.trim().length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters' };
    }
    return { valid: true, message: '' };
}

function validatePhone(phone) {
    if (!phone || phone.trim().length === 0) {
        return { valid: false, message: 'Phone number is required' };
    }

    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');

    // Check if it has at least 10 digits (international format may vary)
    if (digitsOnly.length < 10) {
        return { valid: false, message: 'Phone number must be at least 10 digits' };
    }

    if (digitsOnly.length > 15) {
        return { valid: false, message: 'Phone number is too long' };
    }

    return { valid: true, message: '' };
}

function validateEmail(email) {
    if (!email || email.trim().length === 0) {
        return { valid: false, message: 'Email is required' };
    }

    // RFC 5322 compliant email regex (simplified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }

    return { valid: true, message: '' };
}

function validateCountry(country) {
    if (!country || country === '') {
        return { valid: false, message: 'Please select a country' };
    }
    return { valid: true, message: '' };
}

function validateBusinessType(businessType) {
    if (!businessType || businessType.trim().length === 0) {
        return { valid: false, message: 'Business type is required' };
    }
    if (businessType.trim().length < 2) {
        return { valid: false, message: 'Business type must be at least 2 characters' };
    }
    return { valid: true, message: '' };
}

function validateWebsite(website) {
    if (!website || website.trim().length === 0) {
        return { valid: false, message: 'Website URL is required' };
    }

    // URL validation regex
    const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

    if (!urlRegex.test(website)) {
        return { valid: false, message: 'Please enter a valid URL' };
    }

    return { valid: true, message: '' };
}

// Show error for a field
function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Clear error for a field
function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

// Show status message
function showStatus(message, type) {
    statusDiv.className = `status show ${type}`;

    if (type === 'loading') {
        statusDiv.innerHTML = `<span class="spinner"></span>${message}`;
    } else {
        statusDiv.textContent = message;
    }

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 5000);
    }
}

// Hide status message
function hideStatus() {
    statusDiv.classList.remove('show');
}

// Validate all fields
function validateForm() {
    let isValid = true;

    // Validate name
    const nameValidation = validateName(nameInput.value);
    if (!nameValidation.valid) {
        showError(nameInput, nameError, nameValidation.message);
        isValid = false;
    } else {
        clearError(nameInput, nameError);
    }

    // Validate phone
    const phoneValidation = validatePhone(phoneInput.value);
    if (!phoneValidation.valid) {
        showError(phoneInput, phoneError, phoneValidation.message);
        isValid = false;
    } else {
        clearError(phoneInput, phoneError);
    }

    // Validate email
    const emailValidation = validateEmail(emailInput.value);
    if (!emailValidation.valid) {
        showError(emailInput, emailError, emailValidation.message);
        isValid = false;
    } else {
        clearError(emailInput, emailError);
    }

    // Validate country
    const countryValidation = validateCountry(countrySelect.value);
    if (!countryValidation.valid) {
        showError(countrySelect, countryError, countryValidation.message);
        isValid = false;
    } else {
        clearError(countrySelect, countryError);
    }

    // Validate business type
    const businessTypeValidation = validateBusinessType(businessTypeInput.value);
    if (!businessTypeValidation.valid) {
        showError(businessTypeInput, businessTypeError, businessTypeValidation.message);
        isValid = false;
    } else {
        clearError(businessTypeInput, businessTypeError);
    }

    // Validate website
    const websiteValidation = validateWebsite(websitesInput.value);
    if (!websiteValidation.valid) {
        showError(websitesInput, websitesError, websiteValidation.message);
        isValid = false;
    } else {
        clearError(websitesInput, websitesError);
    }

    return isValid;
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    hideStatus();

    // Validate form
    if (!validateForm()) {
        showStatus('Please fix the errors above', 'error');
        return;
    }

    // Prepare form data
    const formData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        country: countrySelect.value,
        countryName: getCountryName(countrySelect.value),
        business_type: businessTypeInput.value.trim(),
        websites: websitesInput.value.trim(),
    };

    // Store data in localStorage for the call page
    localStorage.setItem('vapiCallData', JSON.stringify(formData));

    // Show success message
    showStatus('Redirecting to call page...', 'success');

    // Redirect to call page after a short delay
    setTimeout(() => {
        window.location.href = 'call.html';
    }, 500);
}

// Add real-time validation on blur
nameInput.addEventListener('blur', () => {
    const validation = validateName(nameInput.value);
    if (!validation.valid) {
        showError(nameInput, nameError, validation.message);
    } else {
        clearError(nameInput, nameError);
    }
});

phoneInput.addEventListener('blur', () => {
    const validation = validatePhone(phoneInput.value);
    if (!validation.valid) {
        showError(phoneInput, phoneError, validation.message);
    } else {
        clearError(phoneInput, phoneError);
    }
});

emailInput.addEventListener('blur', () => {
    const validation = validateEmail(emailInput.value);
    if (!validation.valid) {
        showError(emailInput, emailError, validation.message);
    } else {
        clearError(emailInput, emailError);
    }
});

countrySelect.addEventListener('change', () => {
    const validation = validateCountry(countrySelect.value);
    if (!validation.valid) {
        showError(countrySelect, countryError, validation.message);
    } else {
        clearError(countrySelect, countryError);
    }
});

businessTypeInput.addEventListener('blur', () => {
    const validation = validateBusinessType(businessTypeInput.value);
    if (!validation.valid) {
        showError(businessTypeInput, businessTypeError, validation.message);
    } else {
        clearError(businessTypeInput, businessTypeError);
    }
});

websitesInput.addEventListener('blur', () => {
    const validation = validateWebsite(websitesInput.value);
    if (!validation.valid) {
        showError(websitesInput, websitesError, validation.message);
    } else {
        clearError(websitesInput, websitesError);
    }
});

// Initialize
populateCountries();
autoFillForm();
form.addEventListener('submit', handleSubmit);
