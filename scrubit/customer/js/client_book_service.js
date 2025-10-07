let currentStep = 1;
const totalSteps = 3;

// --- UI Helper Functions (Reused from Signup) ---

/**
 * Updates the loading overlay and status text.
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
 */
function showFormMessage(message, type = 'info') {
    const msgElement = document.getElementById('form-message');
    msgElement.textContent = message;
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


// --- Validation & Step-Specific Logic ---

/**
 * Validates all required fields in the current step container.
 * @param {number} step - The current step number.
 * @returns {boolean} - True if the step is valid, false otherwise.
 */
function validateStep(step) {
    const currentStepElement = document.getElementById(`step-${step}`);
    if (!currentStepElement) return false;

    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    // 1. Check Standard HTML5 validity for all required fields
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

    if (!isValid) {
        showFormMessage('Please fill in all required fields correctly.', 'error');
        if (firstInvalidField) {
            firstInvalidField.reportValidity();
        }
        return false;
    }

    // 2. Custom Logic Check (e.g., ensuring a choice is made if it's a radio group)
    if (step === 1) {
        // Ensure one service type is selected
        const serviceSelected = currentStepElement.querySelector('input[name="service_type"]:checked');
        if (!serviceSelected) {
            showFormMessage('Please select a Service Type.', 'error');
            isValid = false;
        }
    }

    // For Step 3, we only need to ensure the agreement checkbox is checked
    if (step === 3) {
        const agreementChecked = document.getElementById('agreement').checked;
        if (!agreementChecked) {
            showFormMessage('You must agree to the Terms of Service to confirm your booking.', 'error');
            isValid = false;
        }
    }

    if (isValid) {
        showFormMessage('', 'info'); // Clear error message on success
    } 

    return isValid;
}

/**
 * Generates a simulated price based on form data and updates the summary.
 */
function updateBookingSummary() {
    const data = collectFormData(true);
    let basePrice = 0;
    let extrasPrice = 0;

    // 1. Calculate Base Price based on Service and Size (Simulation)
    const bedrooms = parseInt(data.bedrooms) || 0;
    const bathrooms = parseInt(data.bathrooms) || 0;

    // Base pricing logic (very simple simulation)
    if (data.service_type === 'Standard') {
        basePrice = 75 + (bedrooms * 25) + (bathrooms * 35);
    } else if (data.service_type === 'Deep') {
        basePrice = 120 + (bedrooms * 40) + (bathrooms * 50);
    } else if (data.service_type === 'Move In/Out') {
        basePrice = 150 + (bedrooms * 50) + (bathrooms * 60);
    } else if (data.service_type === 'Hourly') {
        basePrice = 50 * 3; // $50/hr minimum 3 hours
    }

    // 2. Calculate Extras Price
    if (data.extras && data.extras.includes('Oven Cleaning')) extrasPrice += 45;
    if (data.extras && data.extras.includes('Interior Windows')) extrasPrice += 30;
    if (data.extras && data.extras.includes('Laundry Service')) extrasPrice += 35;
    if (data.extras && data.extras.includes('Fridge Interior')) extrasPrice += 25;

    const totalPrice = basePrice + extrasPrice;
    
    // 3. Update Summary UI
    document.getElementById('summary_service').textContent = data.service_type || 'N/A';
    document.getElementById('summary_size').textContent = `${data.bedrooms} Bed, ${data.bathrooms} Bath`;
    document.getElementById('summary_datetime').textContent = `${data.service_date} @ ${data.service_time}`;
    document.getElementById('summary_address').textContent = `${data.address}, ${data.city}, ${data.zip}`;
    document.getElementById('summary_extras').textContent = (data.extras && data.extras.length > 0) ? data.extras.join(', ') : 'None';
    document.getElementById('summary_price').textContent = `$${totalPrice.toFixed(2)}`;
}

/**
 * Collects all form data into a single object, optionally including arrays for checkboxes.
 * @param {boolean} includeArrays - If true, converts repeated names (like 'extras') to arrays.
 */
function collectFormData(includeArrays = false) {
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);
    const bookingData = {};

    if (includeArrays) {
        // Handle repeated fields (like extras) as arrays
        const extras = [];
        formData.forEach((value, key) => {
            if (key === 'extras') {
                extras.push(value);
            } else {
                bookingData[key] = value;
            }
        });
        bookingData.extras = extras;
    } else {
        // Simple object creation
        for (let [key, value] of formData.entries()) {
             bookingData[key] = value;
        }
    }
    
    // Explicitly add a timestamp for simulation
    bookingData['booking_timestamp'] = new Date().toISOString();
    return bookingData;
}


/**
 * Checks if all fields in a given step are completed to enable the Next/Submit button.
 */
function checkFormCompletion() {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');

    if (!currentStepElement) return;

    // Use querySelectorAll for all input/select/textarea elements that are not checkboxes (unless they are required)
    const fields = currentStepElement.querySelectorAll('input:not([type="checkbox"])[required], select[required], textarea[required], input[type="radio"][required]');
    
    let allCompleted = true;

    fields.forEach(field => {
        // Check if required fields have a value
        if (field.type === 'radio') {
            const radioGroup = document.getElementsByName(field.name);
            if (!Array.from(radioGroup).some(radio => radio.checked)) {
                allCompleted = false;
            }
        } else if (!field.value.trim()) {
            allCompleted = false;
        }
    });

    // Check for specific required checkboxes (like the agreement in step 3)
    if (currentStep === totalSteps) {
        const agreement = document.getElementById('agreement');
        if (agreement && !agreement.checked) {
            allCompleted = false;
        }
    }


    // Update button states
    if (currentStep < totalSteps) {
        nextButton.disabled = !allCompleted;
    } else {
        submitButton.disabled = !allCompleted;
    }
}


// --- Navigation Logic ---

/**
 * Updates the visibility of form steps, indicators, and the step title.
 */
function updateStepsUI() {
    const titles = {
        1: "Step 1: Choose Service & Size",
        2: "Step 2: When & Where",
        3: "Step 3: Add-ons & Review"
    };

    document.getElementById('step-title').textContent = titles[currentStep];

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
        indicator.classList.remove('step-active', 'step-complete', 'bg-gray-300', 'text-gray-600');
        if (index + 1 < currentStep) {
            indicator.classList.add('step-complete');
            indicator.innerHTML = '<i class="fa-solid fa-check text-white"></i>';
        } else if (index + 1 === currentStep) {
            indicator.classList.add('step-active');
            indicator.innerHTML = index + 1;
        } else {
            indicator.classList.add('bg-gray-300', 'text-gray-600');
            indicator.innerHTML = index + 1;
        }
    });

    // Calculate progress line width
    let progressWidth = 0;
    if (totalSteps > 1) {
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

    // If on the final step, update the summary before checking completion
    if (currentStep === totalSteps) {
        updateBookingSummary();
    }
    
    // Re-check completion for the newly visible step
    checkFormCompletion();
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
 * Handles the final form submission by collecting data and simulating a save.
 */
function submitBooking() {
    // Final check for validation
    if (!validateStep(totalSteps)) {
        return;
    }

    const bookingData = collectFormData(true);

    toggleLoading(true, 'Confirming your booking...');

    // Simulate an async operation 
    setTimeout(() => {
        console.log("--- New Client Booking Confirmed (SIMULATED) ---");
        // Log the collected data to the console for inspection
        console.log(JSON.stringify(bookingData, null, 2));
        console.log("------------------------------------------");

        toggleLoading(false);
        showFormMessage('✅ Booking Confirmed! We look forward to cleaning your home.', 'success');

        // Disable the form after successful submission
        document.getElementById('booking-form').querySelectorAll('input, select, button, textarea').forEach(el => el.disabled = true);
    }, 2000); // 2 second delay simulation
}

// --- Initialization ---

/**
 * Sets up the event listeners and initial UI state.
 */
function init() {
    updateStepsUI();

    const form = document.getElementById('booking-form');
    // Listen to changes across all steps to update button states dynamically
    form.addEventListener('input', checkFormCompletion);
    form.addEventListener('change', checkFormCompletion); 
    
    // Also listen for changes in the first two steps to update the summary when the user advances to step 3
    form.addEventListener('input', updateBookingSummary);

    // Initial check on load
    checkFormCompletion();
}


// Start the application setup when the window loads
window.onload = init;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitBooking = submitBooking;
