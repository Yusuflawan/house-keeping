document.addEventListener('DOMContentLoaded', () => {
    // --- Global State Variables ---
    let currentStep = 1;
    const totalSteps = 3;

    // --- DOM Element References ---
    const form = document.getElementById('signup-form');
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];
    const stepIndicators = [
        document.getElementById('step-1-indicator'),
        document.getElementById('step-2-indicator'),
        document.getElementById('step-3-indicator')
    ];
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');
    const loadingOverlay = document.getElementById('loading-overlay');
    const formMessage = document.getElementById('form-message');

    // --- Input Validation Elements ---
    const emailInput = document.getElementById('email');
    const confirmEmailInput = document.getElementById('confirm-email');
    const emailError = document.getElementById('email-error');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordError = document.getElementById('password-error');
    const cleaningTypeCheckboxes = form.querySelectorAll('input[name="cleaning-types"]');
    const cleaningTypeError = document.getElementById('cleaning-type-error');
    const availableDaysCheckboxes = form.querySelectorAll('input[name="available-days"]');
    const daysError = document.getElementById('days-error');
    const eligibilityCheckboxes = form.querySelectorAll('input[name="eligibility"]');
    const eligibilityError = document.getElementById('eligibility-error');

    /**
     * Toggles the visibility of a password input field by changing its type 
     * and updating the eye icon. This function is called directly from the HTML's onclick attribute.
     * * @param {string} inputId - The ID of the password input field ('password' or 'confirm-password').
     * @param {string} iconId - The ID of the Font Awesome icon element ('toggle-password-icon' or 'toggle-confirm-password-icon').
     */
    window.togglePasswordVisibility = function(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);

        if (input && icon) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';

            // Toggle the Font Awesome icon class: fa-eye is used when the input is type='password' (hidden) 
            // and the user can 'see' it, fa-eye-slash is used when the input is type='text' (visible) 
            // and the user can 'hide' it.
            icon.classList.toggle('fa-eye', isPassword);
            icon.classList.toggle('fa-eye-slash', !isPassword);
            
            icon.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        }
    };

    // --- Core Functions ---

    function updateUI() {
        // 1. Show/Hide Form Steps
        steps.forEach((step, index) => {
            const isCurrent = index + 1 === currentStep;
            step.classList.toggle('hidden', !isCurrent);

            // 🔑 Enable `required` only on visible step fields
            step.querySelectorAll('[required]').forEach(field => {
                field.disabled = !isCurrent;
            });
        });

        // 2. Update Step Indicators
        stepIndicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('step-active', 'step-inactive', 'step-complete');

            if (stepNum < currentStep) {
                indicator.classList.add('step-complete');
                indicator.innerHTML = '<i class="fa-solid fa-check"></i>';
            } else if (stepNum === currentStep) {
                indicator.classList.add('step-active');
                indicator.innerHTML = stepNum;
            } else {
                indicator.classList.add('step-inactive');
                indicator.innerHTML = stepNum;
            }
        });

        // 3. Show/Hide Navigation Buttons
        prevButton.classList.toggle('hidden', currentStep === 1);
        nextButton.classList.toggle('hidden', currentStep === totalSteps);
        submitButton.classList.toggle('hidden', currentStep !== totalSteps);

        // 4. Validate current step immediately
        validateCurrentStep();
    }

    function validateCurrentStep() {
        let isValid = true;

        if (currentStep === 1) {
            const requiredInputs = steps[0].querySelectorAll('[required]');
            requiredInputs.forEach(input => {
                if (!input.value) isValid = false;
            });

            const emailMatch = emailInput.value === confirmEmailInput.value;
            emailError.classList.toggle('hidden', emailMatch || !confirmEmailInput.value);
            if (!emailMatch) isValid = false;

            const passwordMatch = passwordInput.value === confirmPasswordInput.value;
            passwordError.classList.toggle('hidden', passwordMatch || !confirmPasswordInput.value);
            if (!passwordMatch || passwordInput.value.length < 8) isValid = false;

        } else if (currentStep === 2) {
            const requiredFields = steps[1].querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value) isValid = false;
            });

            const typeSelected = Array.from(cleaningTypeCheckboxes).some(cb => cb.checked);
            cleaningTypeError.classList.toggle('hidden', typeSelected);
            if (!typeSelected) isValid = false;

        } else if (currentStep === 3) {
            const requiredSelect = document.getElementById('desired-hours');
            if (!requiredSelect.value) isValid = false;

            const daySelected = Array.from(availableDaysCheckboxes).some(cb => cb.checked);
            daysError.classList.toggle('hidden', daySelected);
            if (!daySelected) isValid = false;

            const allEligibleChecked = Array.from(eligibilityCheckboxes).every(cb => cb.checked);
            eligibilityError.classList.toggle('hidden', allEligibleChecked);
            if (!allEligibleChecked) isValid = false;
        }

        // Enable/disable correct button
        if (currentStep < totalSteps) {
            nextButton.disabled = !isValid;
        } else {
            submitButton.disabled = !isValid;
        }

        return isValid;
    }

    // --- Navigation Functions ---
    window.nextStep = function () {
        let stepValid = validateCurrentStep();
        if (stepValid && currentStep < totalSteps) {
            currentStep++;
            updateUI();
            formMessage.classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.prevStep = function () {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
            formMessage.classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.submitForm = function () {
        if (currentStep === totalSteps) {
            let lastStepValid = validateCurrentStep();
            if (!lastStepValid) return;

            // Show loading overlay
            loadingOverlay.classList.remove('hidden');
            document.getElementById('loading-text').textContent = 'Submitting application...';

            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                const isSuccess = Math.random() > 0.1;

                if (isSuccess) {
                    formMessage.textContent = '✅ Application Submitted Successfully! We will review your details and be in touch shortly.';
                    formMessage.className = 'text-center text-sm mt-4 text-custom-green font-bold bg-green-50 p-3 rounded-lg';
                    form.reset();
                    currentStep = 1;
                    updateUI();
                } else {
                    formMessage.textContent = '❌ Submission Failed: A server error occurred. Please try again or contact support.';
                    formMessage.className = 'text-center text-sm mt-4 text-red-600 font-bold bg-red-50 p-3 rounded-lg';
                }

                formMessage.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 2000);
        }
    };

    // --- Event Listeners ---
    form.addEventListener('input', validateCurrentStep);
    form.addEventListener('change', validateCurrentStep);

    // Init
    updateUI();
});
