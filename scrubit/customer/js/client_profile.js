/**
 * client_profile.js
 * Contains all the client-side logic for the Client Profile page,
 * including data loading, tab switching, form saving mocks, and the
 * read-only/edit mode toggling feature.
 */

// --- Global State Mocks ---
const mockProfileData = {
    // Client specific IDs and fields
    'client-id': 'C-901234', 
    'full-name': 'Amelia Clark',
    'email': 'amelia.clark@example.com',
    'phone': '(555) 987-6543',
    'address': '789 Central Ave, Apt 12B',
    'postal-code': '90210',
    'town': 'Beverly Hills',
    // Client Payment Info (simplified mock to show saved card)
    'card-type': 'Visa',
    'last-four': '**** 1234',
    'card-name': 'AMELIA CLARK'
};

// Store the original values after loading to enable 'Cancel' functionality
let originalDataSnapshot = {};


// --- Utility Functions (Adapted from employee script) ---

/**
 * Toggles the read-only/editable state for inputs in a given section (details).
 * The payment section is handled separately as it requires redirection for security.
 * @param {string} section - 'details'.
 * @param {boolean} enableEdit - true to enable editing, false to set read-only.
 */
function toggleEditMode(section, enableEdit) {
    // Payment tab does not use this logic; it uses a direct button alert/redirection.
    if (section !== 'details') return;

    const form = document.getElementById(`${section}-form`);
    if (!form) return;

    // Get all profile inputs (excluding the permanently read-only client-id)
    const inputs = form.querySelectorAll('.profile-input');
    
    // Toggle read-only state
    inputs.forEach(input => {
        input.readOnly = !enableEdit;

        // Toggle styling classes
        if (enableEdit) {
            input.classList.add('input-focus');
            input.classList.remove('bg-gray-50');
        } else {
            input.classList.remove('input-focus');
        }
    });

    // Handle button visibility and picture upload button
    const editButton = document.getElementById(`edit-${section}-button`);
    const cancelButton = document.getElementById(`cancel-${section}-button`);
    const saveButton = document.getElementById(`save-${section}-button`);
    const uploadButton = document.getElementById('upload-button');

    if (enableEdit) {
        // Switch to Save/Cancel mode
        editButton.classList.add('hidden');
        cancelButton.classList.remove('hidden');
        saveButton.classList.remove('hidden');
        uploadButton.classList.remove('hidden'); // Show picture upload button
        
        // Take a snapshot of current values for cancellation purposes
        originalDataSnapshot[section] = {};
        inputs.forEach(input => {
            originalDataSnapshot[section][input.id] = input.value;
        });

    } else {
        // Switch back to Edit mode
        editButton.classList.remove('hidden');
        cancelButton.classList.add('hidden');
        saveButton.classList.add('hidden');
        uploadButton.classList.add('hidden'); // Hide picture upload button

        // If canceling, revert the input values
        if (originalDataSnapshot[section]) {
            inputs.forEach(input => {
                if (originalDataSnapshot[section][input.id] !== undefined) {
                    input.value = originalDataSnapshot[section][input.id];
                }
            });
            showStatusMessage('Edit cancelled. Data reverted.', 'info');
        }
    }
}

/**
 * Mocks data loading for the Client profile and initializes read-only state.
 */
function loadProfileData() {
    document.getElementById('loading-spinner').style.display = 'flex'; // Use flex to center spinner

    // Mock API delay for data fetch
    setTimeout(() => {
        document.getElementById('loading-spinner').style.display = 'none';
        
        // Populate all input fields using mock data
        Object.keys(mockProfileData).forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = mockProfileData[id];
            }
        });
        
        // Display Header info
        document.getElementById('profile-name-display').textContent = mockProfileData['full-name'];
        document.getElementById('profile-id-display').textContent = `Client ID: ${mockProfileData['client-id']}`;
        
        // Initialize the details tab to the default read-only state
        toggleEditMode('details', false);

        showStatusMessage('Profile data loaded successfully and is currently read-only.', 'success');
    }, 1000);
}

/**
 * Handles tab switching logic.
 * @param {string} tabName - The name of the tab to switch to ('details', 'payment', or 'security').
 */
function changeTab(tabName) {
    // Hide all content and reset all buttons
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-button').forEach(el => {
        el.classList.remove('bg-custom-blue', 'text-white');
        el.classList.add('text-gray-500', 'hover:text-custom-blue');
    });

    // Show target content and activate target button
    const targetContent = document.getElementById(`tab-content-${tabName}`);
    const activeButton = document.getElementById(`tab-${tabName}`);
    
    if (targetContent && activeButton) {
        targetContent.classList.remove('hidden');
        activeButton.classList.remove('text-gray-500', 'hover:text-custom-blue');
        activeButton.classList.add('bg-custom-blue', 'text-white');
    }
}

/**
 * Mocks the profile picture upload and update.
 * @param {Event} event - The change event from the file input.
 */
function uploadProfilePicture(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        document.getElementById('profile-image').src = e.target.result;
        showStatusMessage("Image selected! (In a real app, this image is uploaded now)", 'info');
    };
    reader.readAsDataURL(file);
}

/**
 * Mocks saving profile data to the backend.
 * @param {string} section - The section being saved ('details' or 'password'). Payment is a redirection.
 */
function saveProfile(section) {
    const buttonId = section === 'password' ? `change-password-button` : `save-${section}-button`;
    const button = document.getElementById(buttonId);
    
    // Only 'details' requires toggling back to read-only
    const isToggleSection = section === 'details';

    // Store original button content for reset
    const originalButtonText = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Saving...';

    // Mock API delay
    setTimeout(() => {
        // In a real application, you would send the form data to the server here.
        
        showStatusMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} data saved successfully!`, 'success');
        
        button.innerHTML = originalButtonText;
        button.disabled = false;
        
        // If details, revert to read-only mode after saving
        if (isToggleSection) {
            // Update the mock data storage with new values for display header
            const newName = document.getElementById('full-name').value;
            document.getElementById('profile-name-display').textContent = newName;
            mockProfileData['full-name'] = newName;
            
            // Go back to read-only mode
            toggleEditMode(section, false);
        }
        
    }, 1500);
}

/**
 * Mocks logging the client out.
 */
function logoutClient() {
    // In a real application, this would call Auth sign out and redirect.
    showStatusMessage("Successfully logged out. (Redirecting to login page...) ", 'info');
}

/**
 * Displays a status message to the user.
 * @param {string} message - The message to display.
 * @param {('success'|'error'|'info')} type - The type of message for styling.
 */
function showStatusMessage(message, type) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
    statusMessage.className = `p-3 mb-4 rounded-lg font-medium text-center transition-opacity duration-300`;
    statusMessage.style.display = 'block';
    
    if (type === 'success') {
        statusMessage.classList.add('bg-green-100', 'text-custom-green');
    } else if (type === 'error') {
        statusMessage.classList.add('bg-red-100', 'text-custom-red');
    } else {
        statusMessage.classList.add('bg-blue-100', 'text-custom-blue');
    }

    // Hide after 5 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}


// --- Initialize Application ---

// Bind the global functions to the window object so they can be called from HTML.
window.toggleEditMode = toggleEditMode;
window.changeTab = changeTab;
window.uploadProfilePicture = uploadProfilePicture;
window.saveProfile = saveProfile;
window.logoutClient = logoutClient;
window.showStatusMessage = showStatusMessage;

document.addEventListener('DOMContentLoaded', () => {
    // Ensure the details tab is active on load
    window.changeTab('details'); 
    // Call the mock data loader
    loadProfileData();
});