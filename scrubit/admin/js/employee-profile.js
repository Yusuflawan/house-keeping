/**
 * Toggles the visibility of employee profile tab content and updates the button's active state.
 * This function is attached to the window object (implicitly, by being outside another function) 
 * for use in employee-profile.html's inline onclick.
 * @param {string} tabName - The name of the tab to activate ('schedule', 'history', or 'payout').
 */
window.switchTab = function(tabName) {
    // 1. Deactivate all buttons and hide all content
    document.querySelectorAll('.tab-button').forEach(btn => {
        // Remove active styles
        btn.classList.remove('bg-custom-blue', 'text-white', 'shadow-md');
        // Restore inactive styles
        btn.classList.add('text-gray-600', 'bg-white');
        // Ensure hover is restored for inactive buttons
        btn.classList.remove('hover:bg-indigo-600');
        btn.classList.add('hover:bg-gray-100');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // 2. Activate the selected button and show the selected content
    const activeBtn = document.getElementById(`tab-${tabName}`);
    const activeContent = document.getElementById(`content-${tabName}`);
    
    if (activeBtn) {
        // Apply active styles
        activeBtn.classList.add('bg-custom-blue', 'text-white', 'shadow-md');
        activeBtn.classList.remove('text-gray-600', 'bg-white', 'hover:bg-gray-100');
        // Ensure hover is set for the active button
        activeBtn.classList.add('hover:bg-indigo-600'); 
    }
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
};

/**
 * Initializes page-specific elements after the main content and navigation are loaded.
 * This sets the default tab state.
 */
function initializeEmployeeProfile() {
    // Set the default active tab to 'schedule' for the employee profile on load.
    switchTab('schedule'); 
}


// --- Execute on Page Load ---
// We use window.onload to ensure both sidebar.js (which loads the nav) 
// and the main content are fully present before manipulating the tabs.
window.onload = initializeEmployeeProfile;
