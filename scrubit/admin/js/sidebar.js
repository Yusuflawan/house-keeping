/**
 * Toggles the visibility of a submenu and rotates its arrow icon.
 * This function is attached to the window object for use in sidebar.html's inline onclick.
 */
window.toggleMenu = function(menuId) {
    const menu = document.getElementById(menuId);
    const arrowId = menuId.replace('-menu', '-arrow');
    const arrow = document.getElementById(arrowId);
    
    if (menu && arrow) {
        menu.classList.toggle('hidden');
        arrow.classList.toggle('rotate-180');
    }
}

/**
 * Sets up the mobile sidebar toggle button listener.
 */
function setupNavInteractions() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar'); 
    // Assuming you add an element like <div id="sidebar-backdrop"></div> 
    const backdrop = document.getElementById('sidebar-backdrop');
    
    if (menuToggle && sidebar && backdrop) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('-translate-x-full');
            // FIX/IMPROVEMENT: Also toggle a 'hidden' or 'opacity-0' class on the backdrop
            backdrop.classList.toggle('hidden'); 
        });
    }
}

/**
 * Determines the current page and highlights the corresponding links
 * in the sidebar, opening its parent menu if necessary.
 */
function setActiveNav() {
    // Get the current page's filename, defaulting to empty string if root (needs improvement for robustness)
    const currentPage = window.location.pathname.split('/').pop();

    // 1. Clear active styles from all links and buttons first
    document.querySelectorAll('#sidebar a, #sidebar button').forEach(el => {
        // Remove active styles
        el.classList.remove('text-white', 'bg-custom-blue', 'shadow-md', 'font-bold');
        // Restore default/inactive styles
        el.classList.add('text-gray-700', 'hover:bg-gray-100');
        
        // **IMPORTANT FIX**: Remove forced hover styles to clean up previous state
        el.classList.remove('hover:!bg-custom-blue', 'hover:!text-white', 'hover:!shadow-md'); 

        // Specific fix for sub-menu links that should look different when inactive
        if (el.tagName === 'A' && el.closest('ul[id$="-menu"]')) {
             el.classList.remove('text-gray-700', 'hover:bg-gray-100'); // Clean up button styles
             el.classList.add('text-gray-600', 'hover:bg-gray-50'); // Apply sub-link styles
        }
    });

    // 2. Find the link corresponding to the current page and highlight it
    const activeLink = document.querySelector(`a[href="${currentPage}"]`);
    
    if (activeLink) {
        
        // Highlight the current link (This applies to both top-level and sub-level active links)
        activeLink.classList.add('text-white', 'bg-custom-blue', 'shadow-md', 'font-bold');
        activeLink.classList.remove('text-gray-600', 'hover:bg-gray-50', 'text-gray-700', 'hover:bg-gray-100');

        // *** THE FIX ***: Force the active style to persist on hover
        activeLink.classList.add('hover:!bg-custom-blue', 'hover:!text-white', 'hover:!shadow-md'); 

        // 3. Walk up the DOM to find the parent submenu and open it
        let parentMenu = activeLink.closest('ul[id$="-menu"]'); 

        if (parentMenu) {
            // Ensure the menu is visible
            parentMenu.classList.remove('hidden');

            // 4. Highlight the parent button (e.g., 'Bookings')
            let parentButtonId = parentMenu.id.replace('-menu', '-parent-nav');
            const parentButton = document.getElementById(parentButtonId);
            const parentArrow = document.getElementById(parentMenu.id.replace('-menu', '-arrow'));

            if (parentButton) {
                parentButton.classList.add('text-white', 'bg-custom-blue', 'shadow-md', 'font-bold');
                parentButton.classList.remove('text-gray-700', 'hover:bg-gray-100');
                
                // *** THE FIX ***: Force the active style to persist on hover for the parent button too
                parentButton.classList.add('hover:!bg-custom-blue', 'hover:!text-white', 'hover:!shadow-md');
            }
            // Ensure the arrow is rotated to reflect the open state
            if (parentArrow) {
                parentArrow.classList.add('rotate-180');
                parentArrow.classList.remove('rotate-0');
            }
        }
    }
}

/**
 * Fetches and injects the sidebar HTML into the page.
 */
async function loadNav() {
    try {
        const response = await fetch('sidebar.html'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const navHtml = await response.text();
        document.getElementById('nav-placeholder').innerHTML = navHtml;
        
        setupNavInteractions();
        setActiveNav(); 
        
    } catch (error) {
        console.error('Could not load navigation. Ensure sidebar.html exists.', error);
    }
}

// Execute the navigation loader when the initial document is fully loaded
document.addEventListener('DOMContentLoaded', loadNav);