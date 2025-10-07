// =========================================================
// BOOKING APPLICATION LOGIC (Merged)
// This file handles all data, calculation, validation, UI updates, and navigation control.
// =========================================================

// --- Data Definitions for Pricing & Duration ---
const SERVICE_DATA = {
    "Standard": { rate: 20.00, baseHours: 3.0, extraDurationFactor: 0.25 },
    "Deep": { rate: 25.00, baseHours: 4.5, extraDurationFactor: 0.5 },
    "Move In/Out": { rate: 30.00, baseHours: 6.0, extraDurationFactor: 0.75 },
    "Office": { rate: 22.00, baseHours: 3.5, extraDurationFactor: 0.3 }
};

const SIZE_ADJUSTMENTS = {
    "0/0": -1.0,
    "1/1": -0.5,
    "2/1": 0.0,
    "2/2": 0.5,
    "3/2": 1.0,
    "3/3": 1.5,
    "4+/4+": 2.0
};

const EXTRA_DURATION_FOR_ADDON = 0.5; // Half an hour extra for each selected add-on
const PRODUCTS_FEE = 6.00;
const TOTAL_STEPS = 3; 

// --- DOM Element References ---
const ELEMENTS = {
    form: document.getElementById('booking-form'),
    steps: [document.getElementById('step-1'), document.getElementById('step-2'), document.getElementById('step-3')],
    title: document.getElementById('step-title'),
    progress: document.getElementById('progress-fill'),
    prevBtn: document.getElementById('prev-button'),
    nextBtn: document.getElementById('next-button'),
    submitBtn: document.getElementById('submit-button'),
    message: document.getElementById('form-message'),
    // Step 1 specific inputs
    serviceRadios: document.querySelectorAll('input[name="service_type"]'),
    bedrooms: document.getElementById('bedrooms'),
    bathrooms: document.getElementById('bathrooms'),
    customHours: document.getElementById('custom_hours'),
    recommendedDisplay: document.getElementById('recommended-hours-display'),
    recommendedBtn: document.getElementById('use-recommended-btn'),
    durationFeedback: document.getElementById('duration-feedback'),
    // Step 3 specific inputs
    extrasCheckboxes: document.querySelectorAll('input[name="extras"]'),
    productRadios: document.querySelectorAll('input[name="product_preference"]'),
    // Summary elements
    summaryDuration: document.getElementById('summary_duration'),
    summaryPrice: document.getElementById('summary_price'),
    summaryNoteContainer: document.getElementById('summary_note_container'),
    summaryNote: document.getElementById('summary_note')
};

// --- Navigation State and Titles ---
let currentStep = 1;
const STEP_TITLES = {
    1: "Step 1: Choose Service & Size",
    2: "Step 2: Date and Location",
    3: "Step 3: Logistics, Summary, and Confirmation"
};

// =========================================================
// --- Utility & Calculation Functions ---
// =========================================================

/**
 * Shows a temporary message in the feedback area.
 * @param {string} text The message to display.
 * @param {string} type 'success' or 'error'.
 */
function showMessage(text, type) {
    ELEMENTS.message.textContent = text;
    ELEMENTS.message.classList.remove('hidden', 'text-green-600', 'text-red-600');
    ELEMENTS.message.classList.add(type === 'success' ? 'text-green-600' : 'text-red-600');
    setTimeout(() => {
        ELEMENTS.message.classList.add('hidden');
    }, 5000);
}

/**
 * Calculates the recommended duration in hours based on service type, size, and extras.
 * @returns {number} The calculated duration in hours (rounded to 1 decimal place).
 */
function calculateRecommendedDuration() {
    const serviceType = document.querySelector('input[name="service_type"]:checked')?.value;
    const bedrooms = ELEMENTS.bedrooms.value;
    const bathrooms = ELEMENTS.bathrooms.value;
    
    if (!serviceType || !bedrooms || !bathrooms) {
        return 0.0;
    }

    const sizeKey = `${bedrooms}/${bathrooms}`;
    let baseHours = SERVICE_DATA[serviceType]?.baseHours || 0;
    let sizeAdjustment = SIZE_ADJUSTMENTS[sizeKey] || 0;
    
    // Handle 4+ cases simply
    if (bedrooms === '4+' || bathrooms === '4+') {
        sizeAdjustment = SIZE_ADJUSTMENTS["4+/4+"];
    }

    let calculatedDuration = baseHours + sizeAdjustment;
    
    // Add extra half hour for EACH selected add-on
    const selectedExtrasCount = document.querySelectorAll('input[name="extras"]:checked').length;
    calculatedDuration += selectedExtrasCount * EXTRA_DURATION_FOR_ADDON;
    
    // Ensure a minimum duration
    calculatedDuration = Math.max(1.0, calculatedDuration); 

    // Round to the nearest half-hour
    return Math.round(calculatedDuration * 2) / 2;
}

/**
 * Calculates the total price based on duration, rate, and products.
 * @param {number} duration The final chosen duration in hours.
 * @returns {number} The total price in GBP (£).
 */
function calculateTotalPrice(duration) {
    const serviceType = document.querySelector('input[name="service_type"]:checked')?.value;
    const productPreference = document.querySelector('input[name="product_preference"]:checked')?.value;

    const hourlyRate = SERVICE_DATA[serviceType]?.rate || 0;
    let subtotal = duration * hourlyRate;
    let totalFee = subtotal;

    // Add supplies fee if ScrubIt provides products
    if (productPreference === 'ScrubIt') {
        totalFee += PRODUCTS_FEE;
    }
    
    return totalFee;
}

// =========================================================
// --- Logic Handlers & UI Updates (Booking Logic) ---
// =========================================================

/**
 * Handler for Service, Size, and Extras changes to update duration feedback.
 */
function handleInputChanges() {
    const recommendedDuration = calculateRecommendedDuration();
    
    // Update recommended hours display
    ELEMENTS.recommendedDisplay.textContent = recommendedDuration.toFixed(1);

    if (recommendedDuration > 0) {
        ELEMENTS.recommendedBtn.disabled = false;
        ELEMENTS.durationFeedback.innerHTML = `Based on your selection, we recommend <span class="font-bold text-custom-green">${recommendedDuration.toFixed(1)} hours</span>. You can use this or enter a custom duration.`;
        
        // If the input is empty or 0, auto-fill it with recommended
        if (!ELEMENTS.customHours.value || parseFloat(ELEMENTS.customHours.value) < 1) {
            ELEMENTS.customHours.value = recommendedDuration.toFixed(1);
        }
    } else {
        ELEMENTS.recommendedBtn.disabled = true;
        ELEMENTS.durationFeedback.textContent = "Select a service and size to see our recommended duration.";
        ELEMENTS.customHours.value = ''; // Clear custom hours if no valid config
    }
    
    // Recalculate summary price immediately after any related change
    updateSummary();
}

/**
 * Handler for Custom Hours input.
 */
function handleHourSelection() {
    const hours = parseFloat(ELEMENTS.customHours.value);
    const recommended = parseFloat(ELEMENTS.recommendedDisplay.textContent);
    
    if (hours < 1.0) {
        ELEMENTS.customHours.value = 1.0;
        showMessage("Minimum service duration is 1 hour.", 'error');
    } else if (hours % 0.5 !== 0) {
        // Ensure hours are in half-hour increments
        ELEMENTS.customHours.value = (Math.round(hours * 2) / 2).toFixed(1);
    }
    
    // Update button styling based on deviation from recommended
    if (hours > 0 && Math.abs(hours - recommended) > 0.1) {
        ELEMENTS.recommendedBtn.classList.remove('bg-custom-green', 'hover:bg-custom-green');
        ELEMENTS.recommendedBtn.classList.add('bg-custom-blue', 'hover:bg-custom-blue');
    } else {
        ELEMENTS.recommendedBtn.classList.remove('bg-custom-blue', 'hover:bg-custom-blue');
        ELEMENTS.recommendedBtn.classList.add('bg-custom-green', 'hover:bg-custom-green');
    }

    updateSummary();
}

/**
 * Sets the custom hours input to the recommended hours.
 */
function useRecommendedHours() {
    const recommendedDuration = parseFloat(ELEMENTS.recommendedDisplay.textContent);
    if (recommendedDuration > 0) {
        ELEMENTS.customHours.value = recommendedDuration.toFixed(1);
        handleHourSelection(); // Call to trigger summary and styling update
    }
}

/**
 * Toggles the access details textarea based on the access method selected.
 */
function handleAccessMethodChange() {
    const accessMethod = document.getElementById('access_method').value;
    const detailsArea = document.getElementById('access_details');
    if (accessMethod === 'Lockbox/Code' || accessMethod === 'Other' || accessMethod === 'Concierge/Front Desk') {
        detailsArea.style.display = 'block';
        detailsArea.required = true;
    } else {
        detailsArea.style.display = 'none';
        detailsArea.required = false;
    }
    updateSummary(); // Update summary to reflect access details changes
}

/**
 * Populates the final summary section with all selected form data.
 */
function updateSummary() {
    // --- Collect Data ---
    const serviceType = document.querySelector('input[name="service_type"]:checked')?.value || 'N/A';
    const bedrooms = ELEMENTS.bedrooms.value || '?';
    const bathrooms = ELEMENTS.bathrooms.value || '?';
    const duration = parseFloat(ELEMENTS.customHours.value) || 0;
    const date = document.getElementById('service_date').value || 'N/A';
    const time = document.getElementById('service_time').value || 'N/A';
    const address = document.getElementById('address').value || '';
    const city = document.getElementById('city').value || '';
    const state = document.getElementById('state').value || '';
    const zip = document.getElementById('zip').value || '';
    const fullAddress = address ? `${address}, ${city}, ${state} ${zip}` : 'N/A';
    const productPreference = document.querySelector('input[name="product_preference"]:checked')?.value || 'N/A';
    const accessMethod = document.getElementById('access_method').value || 'N/A';
    const accessDetails = document.getElementById('access_details').value.trim() || 'None provided';
    const additionalInfo = document.getElementById('additional_info').value.trim();

    const selectedExtras = Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(cb => cb.value);
    const extrasText = selectedExtras.length > 0 ? selectedExtras.join(', ') : 'None';
    
    // --- Calculation ---
    const totalPrice = calculateTotalPrice(duration);

    // --- Populate Summary UI ---
    document.getElementById('summary_service').textContent = serviceType;
    document.getElementById('summary_size').textContent = `${bedrooms} Bed, ${bathrooms} Bath`;
    ELEMENTS.summaryDuration.textContent = duration > 0 ? `${duration.toFixed(1)} hours` : 'N/A';
    document.getElementById('summary_datetime').textContent = date && time ? `${date} @ ${time}` : 'N/A';
    document.getElementById('summary_address').textContent = fullAddress;
    document.getElementById('summary_extras').textContent = extrasText;
    document.getElementById('summary_products').textContent = productPreference === 'ScrubIt' ? `ScrubIt provides (+£${PRODUCTS_FEE.toFixed(2)})` : `${productPreference} provides`;
    document.getElementById('summary_access').textContent = `${accessMethod} (${accessDetails.length > 5 ? 'Details provided' : 'No details'})`;
    ELEMENTS.summaryPrice.textContent = `£${totalPrice.toFixed(2)}`;

    // Optional note display (for additional info)
    if (additionalInfo) {
        ELEMENTS.summaryNote.textContent = additionalInfo;
        ELEMENTS.summaryNoteContainer.classList.remove('hidden');
    } else {
        ELEMENTS.summaryNoteContainer.classList.add('hidden');
    }
    
    // Toggle submit button based on agreement check
    const isAgreementChecked = document.getElementById('agreement').checked;
    // Note: Use ELEMENTS.submitBtn here as it's defined in the ELEMENTS object
    ELEMENTS.submitBtn.disabled = !isAgreementChecked || totalPrice === 0;
}

function toggleUseSavedAddress() {
    // Placeholder function for using a saved address (requires Firebase/DB integration)
    const isChecked = document.getElementById('use-saved-address').checked;
    const inputs = ['address', 'city', 'state', 'zip'];
    
    if (isChecked) {
        // Simulate loading saved address
        document.getElementById('address').value = '123 My Example Street';
        document.getElementById('city').value = 'London';
        document.getElementById('state').value = 'ENG';
        document.getElementById('zip').value = 'SW1A 0AA';
        inputs.forEach(id => document.getElementById(id).disabled = true);
    } else {
        inputs.forEach(id => document.getElementById(id).disabled = false);
        inputs.forEach(id => document.getElementById(id).value = '');
    }
    updateSummary();
}


// =========================================================
// --- Validation & Submission ---
// =========================================================

/**
 * Validates all required inputs for Step 1.
 * @returns {boolean} True if validation passes, false otherwise.
 */
function validateStep1() {
    const serviceSelected = document.querySelector('input[name="service_type"]:checked') !== null;
    const bedroomsSelected = ELEMENTS.bedrooms.value !== '';
    const bathroomsSelected = ELEMENTS.bathrooms.value !== '';
    const hoursValid = parseFloat(ELEMENTS.customHours.value) >= 1.0;

    if (!serviceSelected || !bedroomsSelected || !bathroomsSelected || !hoursValid) {
        showMessage("Please select a service type, size, and valid duration (min 1 hour) before proceeding.", 'error');
        return false;
    }
    return true;
}

/**
 * Validates all required inputs for Step 2.
 * @returns {boolean} True if validation passes, false otherwise.
 */
function validateStep2() {
    const requiredInputs = ['address', 'city', 'state', 'zip', 'service_date', 'service_time'];
    for (const id of requiredInputs) {
        if (document.getElementById(id).value.trim() === '') {
            showMessage("Please fill in all required address and scheduling fields.", 'error');
            return false;
        }
    }
    return true;
}

/**
 * Validates all required inputs for Step 3.
 * @returns {boolean} True if validation passes, false otherwise.
 */
function validateStep3() {
    const productSelected = document.querySelector('input[name="product_preference"]:checked') !== null;
    const accessSelected = document.getElementById('access_method').value !== '';
    const agreementChecked = document.getElementById('agreement').checked;

    if (!productSelected || !accessSelected) {
        showMessage("Please confirm your cleaning product and access preferences.", 'error');
        return false;
    }

    // Check access details if required
    const accessDetails = document.getElementById('access_details');
    if (accessDetails.required && accessDetails.value.trim() === '') {
        showMessage("Please provide detailed instructions for property access.", 'error');
        return false;
    }

    if (!agreementChecked) {
        showMessage("You must agree to the Terms of Service to confirm your booking.", 'error');
        return false;
    }
    
    return true;
}

/**
 * Handles the final form submission logic.
 */
function submitBooking() {
    if (validateStep3()) {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.remove('hidden');

        // Gather all final data for submission (simulated payload)
        const formData = {
            service: document.querySelector('input[name="service_type"]:checked').value,
            size: {
                bedrooms: ELEMENTS.bedrooms.value,
                bathrooms: ELEMENTS.bathrooms.value
            },
            duration: parseFloat(ELEMENTS.customHours.value),
            date: document.getElementById('service_date').value,
            timeSlot: document.getElementById('service_time').value,
            address: {
                street: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value
            },
            extras: Array.from(document.querySelectorAll("input[name='extras']:checked")).map(cb => cb.value),
            products: document.querySelector("input[name='product_preference']:checked").value,
            access: document.getElementById("access_method").value,
            accessDetails: document.getElementById("access_details").value.trim(),
            additionalInfo: document.getElementById("additional_info").value.trim(),
            totalPrice: calculateTotalPrice(parseFloat(ELEMENTS.customHours.value)).toFixed(2)
        };
        
        console.log("Booking Payload:", formData);

        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            
            ELEMENTS.form.reset();
            // Reset step to 1 after successful submission
            currentStep = 1;
            updateStepUI(); 
            
            showMessage(`Booking confirmed! A cleaner will arrive on ${formData.date} during the ${formData.timeSlot}. Total cost: £${formData.totalPrice}.`, 'success');
        }, 3000);
    }
}

// =========================================================
// --- Navigation Functions (Client Nav Logic) ---
// =========================================================

/**
 * Updates the visual state of the form (steps, indicators, buttons) based on the currentStep.
 */
function updateStepUI() {
    // 1. Update Step Content Visibility & Title
    ELEMENTS.steps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.remove('hidden');
        } else {
            step.classList.add('hidden');
        }
    });
    ELEMENTS.title.textContent = STEP_TITLES[currentStep];

    // 2. Update Progress Bar and Indicators
    const progressPercentage = (currentStep - 1) / (TOTAL_STEPS - 1) * 100;
    ELEMENTS.progress.style.width = `${progressPercentage}%`;

    for (let i = 1; i <= TOTAL_STEPS; i++) {
        const indicator = document.getElementById(`step-indicator-${i}`);
        if (!indicator) continue;

        indicator.classList.remove('step-active', 'step-complete', 'bg-gray-300', 'text-gray-600');

        if (i === currentStep) {
            indicator.classList.add('step-active');
        } else if (i < currentStep) {
            indicator.classList.add('step-complete');
        } else {
            indicator.classList.add('bg-gray-300', 'text-gray-600');
        }
    }

    // 3. Update Button Visibility
    if (currentStep === 1) {
        ELEMENTS.prevBtn.classList.add('hidden');
    } else {
        ELEMENTS.prevBtn.classList.remove('hidden');
    }

    if (currentStep < TOTAL_STEPS) {
        ELEMENTS.nextBtn.classList.remove('hidden');
        ELEMENTS.submitBtn.classList.add('hidden');
    } else {
        // Last step (Step 3)
        ELEMENTS.nextBtn.classList.add('hidden');
        ELEMENTS.submitBtn.classList.remove('hidden');
        updateSummary(); // Recalculate and update summary on the final step
    }
}

/**
 * Handles moving to the next step, including validation.
 */
function nextStep() {
    let validationPassed = false;
    
    switch (currentStep) {
        case 1:
            validationPassed = validateStep1();
            break;
        case 2:
            // Ensure summary fields are populated before validation
            updateSummary(); 
            validationPassed = validateStep2();
            break;
        case 3:
            // The submit button handles validation for step 3.
            validationPassed = false; 
            break;
    }

    if (validationPassed && currentStep < TOTAL_STEPS) {
        currentStep++;
        updateStepUI();
    }
}

/**
 * Handles moving to the previous step.
 */
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepUI();
    }
}

// =========================================================
// --- Initialization ---
// =========================================================

/**
 * Initializes listeners for all booking logic inputs (non-navigation).
 */
function initLogicListeners() {
    // Setup listener for agreement checkbox
    document.getElementById('agreement').addEventListener('change', updateSummary);
    
    // Setup listener for size and service changes (Step 1 - triggers duration calc)
    [...ELEMENTS.serviceRadios, ELEMENTS.bedrooms, ELEMENTS.bathrooms].forEach(el => {
        el.addEventListener('change', handleInputChanges);
    });

    // Setup listener for extras (Step 1 - triggers duration calc)
    ELEMENTS.extrasCheckboxes.forEach(el => {
        el.addEventListener('change', handleInputChanges);
    });

    // Setup listener for manual hours input
    ELEMENTS.customHours.addEventListener('input', handleHourSelection);
    
    // Setup listener for recommended button click
    ELEMENTS.recommendedBtn.addEventListener('click', useRecommendedHours);
    
    // Setup listeners for other inputs that impact summary/price (Step 3)
    ELEMENTS.productRadios.forEach(el => {
        el.addEventListener('change', updateSummary);
    });

    // Setup listeners for access details and optional info
    document.getElementById('access_method').addEventListener('change', handleAccessMethodChange);
    document.getElementById('additional_info').addEventListener('input', updateSummary);
    
    // Setup listener for saved address checkbox
    document.getElementById('use-saved-address').addEventListener('change', toggleUseSavedAddress);
    
    // Set today's date as min date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('service_date').min = today;
}

/**
 * Initializes the navigation button click listeners.
 */
function initNavListeners() {
    ELEMENTS.prevBtn.addEventListener('click', prevStep);
    ELEMENTS.nextBtn.addEventListener('click', nextStep);
    
    // Wire up the submit button to the logic file's submission function
    ELEMENTS.submitBtn.addEventListener('click', submitBooking);
}

/**
 * The main application initialization function.
 */
function initApp() {
    initLogicListeners();
    initNavListeners();

    // Initialize UI state
    updateStepUI();
    handleAccessMethodChange(); // Initialize access details state
    handleInputChanges(); // Initialize recommended hours and custom hours default
}

// Attach the main setup function to the window load event
window.addEventListener('load', initApp);