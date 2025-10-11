let currentStep = 1;
const totalSteps = 2; // Fixed at 2 steps for client registration

// --- UI Helper Functions ---

/**
 * Updates the loading overlay and status text.
 * @param {boolean} show - Whether to show or hide the overlay.
 * @param {string} text - The text to display in the overlay.
 */
function toggleLoading(show, text = 'Processing...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    if (show) {
        loadingText.textContent = text;
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

/**
 * Displays a message to the user on the main form.
 * @param {string} message - The message content.
 * @param {string} type - 'success', 'error', or 'info'.
 */
function showFormMessage(message, type = 'info') {
    const msgElement = document.getElementById('form-message');
    msgElement.textContent = message;
    // Ensure consistent color classes (using Tailwind text-red-600 for errors)
    msgElement.classList.remove('hidden', 'text-green-600', 'text-red-600', 'text-gray-600');

    switch (type) {
        case 'success':
            msgElement.classList.add('text-green-600');
            break;
        case 'error':
            msgElement.classList.add('text-red-600');
            break;
        case 'info':
        default:
            msgElement.classList.add('text-gray-600');
            break;
    }
    msgElement.classList.remove('hidden');
}

/**
 * Toggles the visibility of a password field and updates the eye icon.
 * @param {string} fieldId - The ID of the password input field.
 * @param {HTMLElement} button - The button element that was clicked.
 */
function togglePasswordVisibility(fieldId, button) {
    const field = document.getElementById(fieldId);
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}
window.togglePasswordVisibility = togglePasswordVisibility; // Make it globally accessible from HTML

// --- Validation Functions ---

/**
 * Checks if all required fields in the current step are valid, including confirmation checks.
 * @param {number} step - The current step number.
 * @returns {boolean} - True if the step is valid, false otherwise.
 */
function validateStep(step) {
    const currentStepElement = document.getElementById(`step-${step}`);
    if (!currentStepElement) return false;

    // Find all required fields within the current step container (div)
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    // 1. Check Standard HTML5 validity for each field in the step
    requiredFields.forEach(field => {
        field.classList.remove('border-red-500'); // Clear previous error state
        if (!field.checkValidity()) {
            field.classList.add('border-red-500');
            if (isValid) {
                firstInvalidField = field;
            }
            isValid = false;
        }
    });
    
    // If native validation failed, report the error and stop.
    if (!isValid) {
        showFormMessage('Please fill in all required fields correctly.', 'error');
        // Trigger native browser tooltip for the first invalid field for better UX
        if (firstInvalidField) {
            firstInvalidField.reportValidity();
        }
        return false;
    }

    // 2. Custom Validation for Step 1 (Email/Password Match)
    if (step === 1) {
        const email = document.getElementById('email');
        const confirmEmail = document.getElementById('confirm_email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm_password');
        let step1Valid = true;
        let customErrorMsg = '';

        // Email Match Check
        if (email.value.toLowerCase() !== confirmEmail.value.toLowerCase()) {
            customErrorMsg = 'Email addresses must match.';
            confirmEmail.classList.add('border-red-500');
            email.classList.add('border-red-500');
            step1Valid = false;
        } else {
            // Clear styles if match is successful
            confirmEmail.classList.remove('border-red-500');
            email.classList.remove('border-red-500');
        }

        // Password Match Check
        if (password.value !== confirmPassword.value) {
            if (step1Valid) { // Only set this message if no email error exists
                 customErrorMsg = 'Passwords must match.';
            }
            confirmPassword.classList.add('border-red-500');
            password.classList.add('border-red-500');
            step1Valid = false;
        } else if (password.value.length < 8) {
             if (step1Valid) { // Only set this message if no other errors exist
                 customErrorMsg = 'Password must be at least 8 characters.';
             }
             password.classList.add('border-red-500');
             step1Valid = false;
        } else {
            // Clear styles if match is successful and length is good
            confirmPassword.classList.remove('border-red-500');
            password.classList.remove('border-red-500');
        }

        isValid = step1Valid;
        if (!isValid) {
            showFormMessage(customErrorMsg, 'error');
            return false;
        }
    }

    if (isValid) {
        showFormMessage('', 'info'); // Clear error message on success
    } 

    return isValid;
}

/**
 * Checks if all fields in a given step are completed to enable the Next/Submit button.
 * @param {HTMLFormElement} form - The main form element.
 */
function checkFormCompletion(form) {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');

    if (!currentStepElement) return;

    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let allCompleted = true;

    requiredFields.forEach(field => {
        // Simple check for non-empty value
        if (!field.value.trim()) {
            allCompleted = false;
        }
    });

    // Update button states
    if (currentStep < totalSteps) {
        nextButton.disabled = !allCompleted;
    } else {
        submitButton.disabled = !allCompleted;
    }
}

// --- Navigation Logic ---

/**
 * Updates the visibility of form steps and indicators.
 */
function updateStepsUI() {
    // 1. Update Step Visibility
    document.querySelectorAll('.form-step').forEach((stepEl, index) => {
        if (index + 1 === currentStep) {
            stepEl.classList.remove('hidden');
            stepEl.style.opacity = '1';
        } else {
            stepEl.style.opacity = '0';
            stepEl.classList.add('hidden');
        }
    });

    // 2. Update Step Indicators & Progress Bar
    document.querySelectorAll('[id^="step-indicator-"]').forEach((indicator, index) => {
        // Hide indicators that exceed the total step count (i.e., hide Step 3)
        if (index >= totalSteps) {
            indicator.classList.add('hidden');
            return;
        }

        indicator.classList.remove('step-active', 'step-complete', 'bg-gray-300', 'text-gray-600');
        if (index + 1 < currentStep) {
            // Complete steps
            indicator.classList.add('step-complete');
            indicator.innerHTML = '<i class="fa-solid fa-check text-white"></i>';
        } else if (index + 1 === currentStep) {
            // Active step
            indicator.classList.add('step-active');
            indicator.innerHTML = index + 1;
        } else {
            // Future steps
            indicator.classList.add('bg-gray-300', 'text-gray-600');
            indicator.innerHTML = index + 1;
        }
    });

    // Calculate progress line width for 2 steps 
    let progressWidth = 0;
    if (totalSteps > 1) {
        // When step 1 is active, width is 0. When step 2 is active/complete, width is 100%.
        progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
    }
    document.getElementById('progress-fill').style.width = `${progressWidth}%`;


    // 3. Update Buttons
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');

    prevButton.classList.toggle('hidden', currentStep === 1);
    nextButton.classList.toggle('hidden', currentStep === totalSteps);
    submitButton.classList.toggle('hidden', currentStep !== totalSteps);

    // Re-check completion for the newly visible step
    const form = document.getElementById('signup-form');
    checkFormCompletion(form);
}

/**
 * Moves the form to the next step if the current step is valid.
 */
function nextStep() {
    if (validateStep(currentStep) && currentStep < totalSteps) {
        currentStep++;
        updateStepsUI();
    }
}

/**
 * Moves the form to the previous step.
 */
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showFormMessage('', 'info'); // Clear any validation message
        updateStepsUI();
    }
}

// --- Submission Logic ---

/**
 * Collects all form data into a single object, excluding confirmation fields.
 */
function collectFormData() {
    const form = document.getElementById('signup-form');
    const formData = new FormData(form);
    const clientData = {};
    for (let [key, value] of formData.entries()) {
        // Exclude confirmation fields from the final data object
        if (key !== 'confirm_email' && key !== 'confirm_password') {
             clientData[key] = value;
        }
    }
    // Explicitly add a timestamp for simulation
    clientData['signup_timestamp'] = new Date().toISOString();
    return clientData;
}

/**
 * Handles the final form submission by collecting data and simulating a save.
 */
function submitForm() {
    // Final check for validation
    if (!validateStep(totalSteps)) {
        return;
    }

    const clientData = collectFormData();

    toggleLoading(true, 'Creating client account...');

    // Simulate an async operation (like a network request to a hypothetical API endpoint)
    setTimeout(() => {
        console.log("--- Client Account Created (SIMULATED) ---");
        // Log the collected data to the console for inspection
        console.log(JSON.stringify(clientData, null, 2));
        console.log("------------------------------------------");

        toggleLoading(false);
        showFormMessage('🎉 Client account created successfully! Welcome to ScrubIt.', 'success');

        // Disable the form after successful submission
        document.getElementById('signup-form').querySelectorAll('input, select, button, textarea').forEach(el => el.disabled = true);
    }, 1500); // 1.5 second delay simulation
}

// --- Initialization ---

/**
 * Sets up the event listeners and initial UI state.
 */
function init() {
    updateStepsUI();

    const form = document.getElementById('signup-form');
    // Add event listeners for input changes to continuously check completion
    form.addEventListener('input', () => checkFormCompletion(form));
    form.addEventListener('change', () => checkFormCompletion(form)); // For select/checkbox changes

    // Force a check on load
    checkFormCompletion(form);
}


// Start the application setup when the window loads
window.onload = init;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitForm = submitForm;
