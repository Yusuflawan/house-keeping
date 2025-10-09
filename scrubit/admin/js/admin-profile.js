// --- Mock Data ---
const mockAdminData = {
    id: 'AD-101',
    fullName: 'Jane Doe',
    email: 'jane.doe@scrubit.com'
};

// --- Status Message Utility ---
function setStatusMessage(message, type = 'info') {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `p-3 mb-4 rounded-lg font-medium`;

    if (type === 'success') {
        statusDiv.classList.add('bg-green-100', 'text-custom-green');
    } else if (type === 'error') {
        statusDiv.classList.add('bg-red-100', 'text-custom-red');
    } else if (type === 'loading') {
        statusDiv.classList.add('bg-blue-100', 'text-custom-blue');
    }
    statusDiv.classList.remove('hidden');
}

// --- Fetch Data (Simulated) ---
async function fetchAdminData() {
    setStatusMessage('Loading profile data...', 'loading');
    
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.15) {
                reject(new Error("Network connection timeout. Could not reach server."));
            } else {
                resolve(mockAdminData);
            }
        }, 800);
    });

    return mockAdminData;
}

// --- Load Admin Data ---
async function loadAdminData() {
    try {
        const data = await fetchAdminData();

        document.getElementById('profile-name-display').textContent = data.fullName;
        document.getElementById('profile-id-display').textContent = `ID: ${data.id}`;
        document.getElementById('user-id').value = data.id;
        document.getElementById('full-name').value = data.fullName;
        document.getElementById('email').value = data.email;

        document.getElementById('status-message').classList.add('hidden');
    } catch (error) {
        setStatusMessage(`Failed to load profile: ${error.message}`, 'error');
    }
}

// --- Save Profile ---
async function sendProfileUpdate(actionType, formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (actionType === 'password' && formData.oldPassword === 'wrong-password') {
                reject(new Error("Current password is incorrect. Please try again."));
            } else if (Math.random() < 0.20) {
                reject(new Error("Server error (500). Please try again later."));
            } else {
                console.log(`Successfully updated ${actionType}. Data:`, formData);
                resolve();
            }
        }, 1000);
    });
}

async function saveProfile(actionType) {
    let formData = {};
    const saveButton = actionType === 'details'
        ? document.getElementById('save-details-button')
        : document.getElementById('change-password-button');

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

    saveButton.disabled = true;

    try {
        await sendProfileUpdate(actionType, formData);
        setStatusMessage(`${actionType === 'details' ? 'Details' : 'Password'} updated successfully!`, 'success');

        if (actionType === 'password') {
            document.getElementById('old-password').value = '';
            document.getElementById('new-password').value = '';
        }

        if (actionType === 'details') {
            // Disable editing and hide save button after saving
            setReadOnlyMode(true);
        }

    } catch (error) {
        console.error('Save failed:', error.message);
        setStatusMessage(`Save failed: ${error.message}`, 'error');
    } finally {
        saveButton.disabled = false;
    }
}

// --- Toggle Edit Mode ---
function toggleEditMode() {
    const inputs = document.querySelectorAll('#profile-form input');
    const saveBtn = document.getElementById('save-details-button');
    const toggleBtn = document.getElementById('edit-toggle-btn');
    const currentlyReadOnly = document.getElementById('full-name').hasAttribute('readonly');

    if (currentlyReadOnly) {
        // Enable editing
        inputs.forEach(input => {
            if (input.id !== 'user-id') input.removeAttribute('readonly');
            input.classList.remove('bg-gray-100', 'cursor-not-allowed');
        });
        saveBtn.classList.remove('hidden');
        toggleBtn.innerHTML = `<i class="fa-solid fa-ban"></i><span>Cancel Edit</span>`;
        toggleBtn.classList.replace('bg-custom-blue', 'bg-gray-400');
    } else {
        // Cancel edit mode
        setReadOnlyMode(true);
        loadAdminData(); // revert unsaved changes
    }
}

// --- Helper: Set Read-Only Mode ---
function setReadOnlyMode(isReadOnly) {
    const inputs = document.querySelectorAll('#profile-form input');
    const saveBtn = document.getElementById('save-details-button');
    const toggleBtn = document.getElementById('edit-toggle-btn');

    if (isReadOnly) {
        // Lock inputs and reset button styles
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
            input.classList.add('bg-gray-100', 'cursor-not-allowed');
        });
        saveBtn.classList.add('hidden');
        toggleBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i><span>Edit Profile</span>`;
        toggleBtn.classList.replace('bg-gray-400', 'bg-custom-blue');
    }
}

// --- Initialization ---
window.onload = function () {
    if (typeof loadNav === 'function') loadNav();
    if (typeof loadUserMenu === 'function') loadUserMenu();
    loadAdminData();
};
