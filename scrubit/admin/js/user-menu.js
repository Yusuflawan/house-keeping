// --- Function to Inject the User Menu ---

/**
 * Fetches the user-menu.html content and injects it into the main content wrapper.
 */
async function loadUserMenu() {
    const mainContentWrapper = document.querySelector('.flex-grow.p-4.md\\:p-8.overflow-y-auto');

    if (!mainContentWrapper) {
        console.error('Could not find the main content wrapper for user menu injection.');
        return;
    }
    
    try {
        // 1. Fetch the HTML snippet
        const response = await fetch('user-menu.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userMenuHtml = await response.text();
        
        // 2. Insert the HTML snippet at the beginning of the main content area
        mainContentWrapper.insertAdjacentHTML('afterbegin', userMenuHtml);
        
        // 3. Attach event listener for the toggle (after the HTML is in the DOM)
        const toggle = document.getElementById('user-menu-toggle');
        const dropdown = document.getElementById('user-menu-dropdown');
        
        if (toggle && dropdown) {
            toggle.addEventListener('click', () => {
                // Toggle the 'hidden' class to show/hide the menu
                dropdown.classList.toggle('hidden');
            });

            // Close dropdown if user clicks outside of it
            document.addEventListener('click', (event) => {
                if (!mainContentWrapper.contains(event.target)) {
                    dropdown.classList.add('hidden');
                }
            });
        }

    } catch (error) {
        console.error('Error loading user menu:', error);
    }
}