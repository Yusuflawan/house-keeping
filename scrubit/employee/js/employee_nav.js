/**
 * Injects the appropriate navigation (Top or Bottom) based on the screen size
 * and handles the responsive switching.
 * * Note: Since we are using a single HTML file (employee_nav.html) to hold both navs,
 * we inject the content and then hide/show the parts using Tailwind classes and media queries.
 */

async function loadEmployeeNav() {
    const topNavPlaceholder = document.getElementById('top-nav-placeholder');
    const bottomNavPlaceholder = document.getElementById('bottom-nav-placeholder');

    if (!topNavPlaceholder || !bottomNavPlaceholder) {
        console.error('Navigation placeholders (top-nav-placeholder or bottom-nav-placeholder) not found.');
        return;
    }
    
    try {
        // 1. Fetch the combined HTML snippet
        const response = await fetch('employee_nav.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const navHtml = await response.text();
        
        // 2. Create a temporary container to extract the two distinct NAV elements
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = navHtml;

        const desktopNav = tempDiv.querySelector('#desktop-nav-content');
        const mobileNav = tempDiv.querySelector('#mobile-nav-content');

        if (desktopNav && mobileNav) {
            // 3. Inject the desktop nav into its placeholder (it is visible on md screens and up)
            topNavPlaceholder.innerHTML = desktopNav.outerHTML;
            topNavPlaceholder.classList.remove('h-16'); // Remove placeholder height class

            // 4. Inject the mobile nav into its placeholder (it is visible only on mobile screens)
            bottomNavPlaceholder.innerHTML = mobileNav.outerHTML;

            // 5. Inject the shared profile icon (top right, visible on all screen sizes)
            const sharedProfile = tempDiv.querySelector('#shared-profile-icon');
            if (sharedProfile) {
                document.body.appendChild(sharedProfile); // append to body so it's global
            }


            // Optional: Highlight the current page (Dashboard in this case)
            highlightCurrentPage();

        } else {
            console.error('Could not find desktop-nav-content or mobile-nav-content inside employee_nav.html');
        }

    } catch (error) {
        console.error('Error loading employee navigation:', error);
    }
}

/**
 * Highlights the current page link in both navigation bars.
 */
function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'employee_dashboard.html'; // Default to dashboard

    // List of navigation link IDs for each page
    // NOTE: Removed 'profile.html' and 'job_details.html' from mobile nav links 
    // to reflect user's request for profile via icon and job details via Dashboard card.
    const navLinks = [
        { path: 'employee_dashboard.html', ids: ['nav-desktop-dashboard', 'nav-mobile-dashboard'] },
        { path: 'my_jobs.html', ids: ['nav-desktop-myjobs', 'nav-mobile-myjobs'] },
        { path: 'earnings.html', ids: ['nav-desktop-earnings', 'nav-mobile-earnings'] },
    ];

    navLinks.forEach(link => {
        if (link.path === currentPath) {
            link.ids.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    // Desktop styles: change text color to blue
                    element.classList.add('text-custom-blue', 'font-bold');
                    element.classList.remove('text-gray-700');

                    // Mobile styles: ensure the icon is blue and bold
                    const icon = element.querySelector('i');
                    if (icon) {
                        icon.classList.add('text-custom-blue');
                        icon.classList.remove('text-gray-500');
                    }
                    const text = element.querySelector('span');
                    if (text) {
                        text.classList.add('font-semibold');
                    }
                }
            });
        }
    });
}
