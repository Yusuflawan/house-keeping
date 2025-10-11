// client_dashboard.js

// Placeholder for authentication and Firebase initialization variables
// These are kept outside functions for global scope access if needed by other logic
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Get the modal element once
const modal = document.getElementById('cancel-modal');


// --- Card Masking Logic ---

/**
 * Masks all but the last four digits of a credit card number.
 * @param {string} fullNumber - The full credit card number string.
 * @returns {string} The masked number with placeholders.
 */
function maskCardNumber(fullNumber) {
    if (!fullNumber || fullNumber.length < 4) return '****';
    // Mask all but the last four digits
    const lastFour = fullNumber.slice(-4);
    // Use placeholders for the masked part to match expected format
    const maskedPart = '**** **** **** ';
    return maskedPart + lastFour;
}

/**
 * Simulates fetching and loading the payment information securely.
 */
function loadPaymentInfo() {
    // NOTE: In a real application, this data must be fetched securely from a backend.
    // We are only storing a placeholder raw number here for masking demonstration.
    const rawCardNumber = '4242424242421234'; 
    const displayElement = document.getElementById('masked-card-number');
    if (displayElement) {
        displayElement.textContent = maskCardNumber(rawCardNumber);
    }
}


// --- Modal Logic ---

/**
 * Shows the custom cancellation confirmation modal.
 */
window.showCancelModal = function() {
    if (!modal) return;
    modal.classList.remove('hidden');
    // Animate in for smooth transition
    setTimeout(() => {
        modal.querySelector('div').classList.remove('scale-95');
        modal.style.opacity = '1';
    }, 10);
}

/**
 * Hides the custom cancellation confirmation modal.
 */
window.hideCancelModal = function() {
    if (!modal) return;
    // Animate out
    modal.querySelector('div').classList.add('scale-95');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

/**
 * Handles the logic for processing the job cancellation (simulated).
 */
window.processCancellation = function() {
    // IMPORTANT: This is where you would integrate your actual API call to cancel the booking.
    console.log("Booking cancellation processed (SIMULATED). Triggering API endpoint...");
    
    // Hide the modal immediately
    hideCancelModal();
    
    // In a real app, wait for the API response, then update the UI with a success or failure message.
    // Example: showSuccessBanner('Booking successfully cancelled!');
}


// --- Dashboard Initialization ---

/**
 * Initializes all client-dashboard specific functionality (payment info, event listeners).
 * This function is called by the window.onload handler in client_dashboard.html.
 */
function initDashboard() {
    loadPaymentInfo();

    // Add listener to close modal when clicking outside of it
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideCancelModal();
            }
        });
    }
}

// Export the initialization function to be called globally
window.initDashboard = initDashboard;
