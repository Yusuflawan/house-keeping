/**
 * Toggles the visibility of profile tab content and updates the button's active state.
 * This function is attached to the window object for use in client-profile.html's inline onclick.
 * @param {string} tabName - The name of the tab to activate ('account', 'bookings', or 'payments').
 */
window.switchTab = function(tabName) {
    // 1. Deactivate all buttons and hide all content
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('bg-custom-blue', 'text-white', 'shadow-md');
        btn.classList.add('text-gray-600', 'bg-white');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // 2. Activate the selected button and show the selected content
    const activeBtn = document.getElementById(`tab-${tabName}`);
    const activeContent = document.getElementById(`content-${tabName}`);
    
    if (activeBtn) {
        activeBtn.classList.add('bg-custom-blue', 'text-white', 'shadow-md');
        activeBtn.classList.remove('text-gray-600', 'bg-white');
    }
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
};

/**
 * Initializes page-specific elements after the main content and navigation are loaded.
 * This is where we set the default tab state.
 */
function initializeClientProfile() {
    // Set the default active tab to 'bookings' for the client profile on load.
    // We call this directly as all page HTML is available in the DOM at this point.
    switchTab('bookings'); 
}


window.onload = initializeClientProfile;