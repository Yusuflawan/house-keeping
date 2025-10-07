/**
 * Injects the appropriate navigation (Top or Bottom) based on the screen size
 * and handles the responsive switching.
 * * Note: Since we are using a single HTML file (employee_nav.html) to hold both navs,
 * we inject the content and then hide/show the parts using Tailwind classes and media queries.
 */

async function loadClientNav() {
    const topNavPlaceholder = document.getElementById('top-nav-placeholder');
    const bottomNavPlaceholder = document.getElementById('bottom-nav-placeholder');

    if (!topNavPlaceholder || !bottomNavPlaceholder) {
        console.error('Navigation placeholders (top-nav-placeholder or bottom-nav-placeholder) not found.');
        return;
    }
    
    try {
        // 1. Fetch the combined HTML snippet
        const response = await fetch('client_nav.html');
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
            console.error('Could not find desktop-nav-content or mobile-nav-content inside client_nav.html');
        }

    } catch (error) {
        console.error('Error loading client navigation:', error);
    }
}

/**
 * Highlights the current page link in both navigation bars.
 */
function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'client_dashboard.html';

    const navLinks = [
        { path: 'client_dashboard.html', ids: ['nav-desktop-dashboard', 'nav-mobile-dashboard'] },
        { path: 'my_bookings.html', ids: ['nav-desktop-mybookings', 'nav-mobile-mybookings'] },
        { path: 'book_now.html', ids: ['nav-desktop-book_now', 'nav-mobile-book_now'] },
    ];

    navLinks.forEach(link => {
        if (link.path === currentPath) {
            link.ids.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    // Desktop styling
                    if (id.startsWith('nav-desktop')) {
                        element.classList.add(
                            'text-custom-blue',
                            'font-bold',
                            'border-b-2',
                            'border-custom-blue',
                            'pb-1'
                        );
                        element.classList.remove('text-gray-700');
                    }

                    // Mobile styling
                    if (id.startsWith('nav-mobile')) {
                        const icon = element.querySelector('i');
                        const text = element.querySelector('span');
                        if (icon) {
                            icon.classList.add('text-custom-blue');
                            icon.classList.remove('text-gray-500');
                        }
                        if (text) {
                            text.classList.add('font-semibold', 'text-custom-blue');
                        }

                        // Add a subtle top border to indicate active nav on mobile
                        element.classList.add('border-t-2', 'border-custom-blue', 'pt-1');
                    }
                }
            });
        }
    });
}

