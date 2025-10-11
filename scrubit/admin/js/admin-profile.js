// --- Mock Data ---
const mockAdminData = {
    id: 'AD-101',
    fullName: 'Jane Doe',
    email: 'jane.doe@scrubit.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734b5a2?q=80&w=200&h=200&fit=crop&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fGVtcGxveWVlfGVufDB8fHx8fA%3D%3D',
};

// --- Error/Status Message Utility ---

function setStatusMessage(message, type = 'info') {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `p-3 mb-4 rounded-lg font-medium`; // Reset classes
    
    // Set classes based on type
    if (type === 'success') {
        statusDiv.classList.add('bg-green-100', 'text-custom-green');
    } else if (type === 'error') {
        statusDiv.classList.add('bg-red-100', 'text-custom-red');
    } else if (type === 'loading') {
        statusDiv.classList.add('bg-blue-100', 'text-custom-blue');
    }
    statusDiv.classList.remove('hidden');
}


// --- Data Fetching (Error Handling on Load) ---

async function fetchAdminData() {
    setStatusMessage('Loading profile data...', 'loading');
    
    // Simulating a Promise-based API call with a 15% chance of network error
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.15) {
                reject(new Error("Network connection timeout. Could not reach server."));
            } else {
                resolve(mockAdminData);
            }
        }, 800);
    });
    
    return mockAdminData; // Return data if resolved
}

async function loadAdminData() {
    try {
        const data = await fetchAdminData();

        // Populate header
        document.getElementById('profile-name-display').textContent = data.fullName;
        document.getElementById('profile-id-display').textContent = `ID: ${data.id}`;
        document.getElementById('profile-image').src = data.avatarUrl;

        // Populate form fields
        document.getElementById('user-id').value = data.id;
        document.getElementById('full-name').value = data.fullName;
        document.getElementById('email').value = data.email;
        
        // Hide status message after successful load
        document.getElementById('status-message').classList.add('hidden');

    } catch (error) {
        // Handle loading error
        setStatusMessage(`Failed to load profile: ${error.message}`, 'error');
    }
}


// --- Data Saving (Error Handling on Submit) ---

/**
 * Simulates saving the profile details or password to an API.
 * @param {string} actionType - 'details' or 'password'
 * @param {Object} formData - The data to send.
 * @returns {Promise<void>}
 */
async function sendProfileUpdate(actionType, formData) {
    // Simulate a Promise-based API call with a 20% chance of server-side validation error
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Server-side validation check (e.g., if the old password is wrong)
            if (actionType === 'password' && formData.oldPassword === 'wrong-password') {
                 // Simulate a 401 Unauthorized or 400 Bad Request error
                reject(new Error("Current password is incorrect. Please try again."));
            } else if (Math.random() < 0.20) {
                // General server error
                reject(new Error("Server error (500). Please try again later."));
            } else {
                // Success
                console.log(`Successfully updated ${actionType}. Data:`, formData);
                resolve();
            }
        }, 1000);
    });
}

/**
 * Main function to handle form submission (details or password).
 * Implements the try...catch for saving data.
 */
async function saveProfile(actionType) {
    let formData = {};
    const saveButton = actionType === 'details' ? 
        document.getElementById('save-details-button') : 
        document.getElementById('change-password-button');
    
    // 1. Gather Data and Validation
    if (actionType === 'details') {
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        if (!fullName || !email) {
            setStatusMessage('Please fill in all required fields.', 'error');
            return;
        }
        formData = { fullName, email };
        setStatusMessage('Saving details...', 'loading');
    } else if (actionType === 'password') {
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        if (newPassword.length < 8) {
             setStatusMessage('New password must be at least 8 characters long.', 'error');
            return;
        }
        formData = { oldPassword, newPassword };
        setStatusMessage('Changing password...', 'loading');
    }
    
    // Disable button to prevent double-submission
    saveButton.disabled = true;

    try {
        // 2. AWAIT API call
        await sendProfileUpdate(actionType, formData);
        
        // 3. Handle Success
        setStatusMessage(`${actionType === 'details' ? 'Details' : 'Password'} updated successfully!`, 'success');
        
        // If password changed, clear the fields
        if (actionType === 'password') {
            document.getElementById('old-password').value = '';
            document.getElementById('new-password').value = '';
        }
        
    } catch (error) {
        // 4. Handle Error
        console.error('Save failed:', error.message);
        setStatusMessage(`Save failed: ${error.message}`, 'error');
        
    } finally {
        // 5. Always re-enable the button
        saveButton.disabled = false;
    }
}

// --- Other Actions ---

/**
 * Simulates uploading a new profile picture.
 */
function uploadProfilePicture(event) {
    const file = event.target.files[0];
    if (file) {
        setStatusMessage(`Uploading image: ${file.name}...`, 'loading');
        // In a real app, you would upload this file via a multi-part form API request.
        
        // Simulate immediate preview
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-image').src = e.target.result;
            setStatusMessage('Picture updated successfully! (Simulated)', 'success');
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Handles the Logout action.
 */
function logoutAdmin() {
    if (confirm('Are you sure you want to log out of the system?')) {
        alert('Action: Logging out. Redirecting to login page.');
        // window.location.href = 'login.html';
    }
}

// --- Initialization ---
window.onload = function () {
    if (typeof loadNav === 'function') {
        loadNav(); 
    } else {
        console.warn('loadNav() function not found. Sidebar will not load.');
    }

    if (typeof loadUserMenu === 'function') {
        loadUserMenu(); 
    }
    
    loadAdminData();
};