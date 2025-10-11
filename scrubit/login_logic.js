// --- Core UI Helpers ---

/**
 * Updates the loading state of the button.
 * @param {boolean} isLoading - Whether to show the loading state.
 */
function toggleLoading(isLoading) {
    const button = document.getElementById('login-button');
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Signing In...';
        showFormMessage('', 'info'); // Clear previous messages
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fa-solid fa-right-to-bracket mr-2"></i> Sign In';
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
    
    // Reset classes
    msgElement.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700', 'bg-gray-100', 'text-gray-700');
    
    if (!message) {
        msgElement.classList.add('hidden');
        return;
    }
    
    msgElement.classList.remove('hidden');

    switch (type) {
        case 'success':
            msgElement.classList.add('bg-green-100', 'text-green-700');
            break;
        case 'error':
            msgElement.classList.add('bg-red-100', 'text-red-700');
            break;
        case 'info':
        default:
            msgElement.classList.add('bg-gray-100', 'text-gray-700');
            break;
    }
}

/**
 * Toggles the visibility of the password input field between 'password' and 'text' types.
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash'); // Change to closed eye icon
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye'); // Change back to open eye icon
    }
}

// --- Login Logic ---

/**
 * Handles the form submission and simulates the login process.
 * @param {Event} event - The form submission event.
 */
function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Basic client-side validation
    if (!emailInput.value.trim() || !passwordInput.value.trim()) {
        showFormMessage('Please enter both email and password.', 'error');
        return;
    }

    // Prepare data (for simulation/future API call)
    const loginData = {
        email: emailInput.value.trim(),
        password: passwordInput.value
    };

    // Start loading state
    toggleLoading(true);

    // --- Placeholder for API/Backend Call (Simulated) ---
    console.log("Attempting to log in with data:", loginData);

    // Simulate an asynchronous API call duration
    setTimeout(() => {
        // Assume successful login for all inputs in this simulation
        const success = true; 

        toggleLoading(false); // Stop loading

        if (success) {
            // Log success and display message
            console.log("Login successful! Redirecting...");
            showFormMessage('Login successful! Welcome aboard.', 'success');
            
            // In a real app, you would redirect the user here based on their role:
            // window.location.href = '/dashboard.html';
        } else {
            // Simulated error case
            console.error("Login failed: Invalid credentials.");
            showFormMessage('Login failed. Please check your credentials.', 'error');
        }

    }, 1500); // Simulate network latency of 1.5 seconds
}

// Attach the login function to the window object so it can be called from HTML
window.handleLogin = handleLogin;

// Initial setup to ensure buttons are correctly displayed on load
document.addEventListener('DOMContentLoaded', () => {
    toggleLoading(false); // Ensure the button is not disabled on page load
    showFormMessage('', 'info'); // Ensure message box is hidden
});
