/**
 * Handles injecting navigation for the Employee pages.
 * Adds a fixed desktop nav, fixed mobile top bar, and bottom nav.
 */
async function loadEmployeeNav() {
    const topNavPlaceholder = document.getElementById('top-nav-placeholder');
    const bottomNavPlaceholder = document.getElementById('bottom-nav-placeholder');

    if (!topNavPlaceholder || !bottomNavPlaceholder) {
        console.error('Navigation placeholders (top-nav-placeholder or bottom-nav-placeholder) not found.');
        return;
    }

    try {
        const response = await fetch('employee_nav.html');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const navHtml = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = navHtml;

        const desktopNav = tempDiv.querySelector('#desktop-nav-content');
        const mobileNav = tempDiv.querySelector('#mobile-nav-content');
        const sharedProfile = tempDiv.querySelector('#shared-profile-icon');

        if (desktopNav && mobileNav) {
            // Inject Desktop Navigation
            topNavPlaceholder.innerHTML = desktopNav.outerHTML;
            topNavPlaceholder.classList.remove('h-16');

            // Inject Mobile Bottom Navigation
            bottomNavPlaceholder.innerHTML = mobileNav.outerHTML;

            // --- Desktop Profile Icon ---
            if (sharedProfile) {
                // Make sure it’s visible only on desktop
                sharedProfile.classList.remove('hidden');
                sharedProfile.classList.add('hidden', 'md:block', 'fixed', 'top-4', 'right-6', 'z-50');
                document.body.appendChild(sharedProfile);
            }

            // --- Mobile Top Bar ---
            const mobileTopBar = document.createElement('div');
            mobileTopBar.className =
                'fixed top-0 left-0 right-0 h-14 bg-white shadow-md z-40 flex items-center justify-between px-4 md:hidden';
            mobileTopBar.innerHTML = `
                <span class="text-base font-bold text-custom-blue truncate">Scrub It & Clean It Ltd</span>
                <a href="my_profile.html" class="cursor-pointer flex items-center space-x-2">
                    <img src="https://placehold.co/36x36/3f51b5/ffffff?text=EM"
                         alt="Employee"
                         class="w-9 h-9 rounded-full object-cover border-2 border-custom-blue">
                </a>
            `;
            document.body.appendChild(mobileTopBar);

            // --- Adjust main content padding to account for fixed navs ---
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.classList.add('pt-20', 'pb-20', 'md:pt-24', 'md:pb-8');
            }

            // Highlight current page
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
    const currentPath = window.location.pathname.split('/').pop() || 'employee_dashboard.html';

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
                    if (id.includes('desktop')) {
                        element.classList.add('text-custom-blue', 'font-bold', 'border-b-2', 'border-custom-blue', 'pb-1');
                        element.classList.remove('text-gray-700');
                    }
                    if (id.includes('mobile')) {
                        const icon = element.querySelector('i');
                        if (icon) {
                            icon.classList.add('text-custom-blue');
                            icon.classList.remove('text-gray-500');
                        }
                        const text = element.querySelector('span');
                        if (text) text.classList.add('font-semibold');
                    }
                }
            });
        }
    });
}
