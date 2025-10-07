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

        if (desktopNav && mobileNav) {
            // Inject Desktop Navigation
            topNavPlaceholder.innerHTML = desktopNav.outerHTML;
            topNavPlaceholder.classList.remove('h-16');

            // Inject Mobile Bottom Navigation
            bottomNavPlaceholder.innerHTML = mobileNav.outerHTML;

            // --- Mobile Top Bar ---
            const mobileTopBar = document.createElement('div');
            mobileTopBar.className =
                'fixed top-0 left-0 right-0 h-14 bg-white shadow-md z-40 flex items-center justify-between px-4 md:hidden';
            mobileTopBar.innerHTML = `
                <span class="text-base font-bold text-custom-blue truncate">Scrub It & Clean It Ltd</span>
                <div id="mobile-profile-wrapper" class="relative">
                    <img src="https://placehold.co/36x36/3f51b5/ffffff?text=EM"
                         alt="Employee"
                         class="cursor-pointer w-9 h-9 rounded-full object-cover border-2 border-custom-blue">
                    <div id="mobile-dropdown" 
                         class="hidden absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-md z-50 transition-all duration-200 opacity-0">
                        <a href="my_profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                        <button id="mobile-logout-btn" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                </div>
            `;
            document.body.appendChild(mobileTopBar);

            // --- Add Dropdown Logic for Desktop & Mobile ---
            setupProfileDropdown();

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
 * Handles dropdown toggle for both desktop and mobile profile icons.
 */
function setupProfileDropdown() {
    // --- Desktop ---
    const desktopProfile = document.querySelector('#desktop-nav-content img');
    if (desktopProfile) {
        const dropdown = document.createElement('div');
        dropdown.id = 'desktop-dropdown';
        dropdown.className = 'hidden absolute right-8 top-16 w-40 bg-white border rounded-lg shadow-md z-50 transition-all duration-200 opacity-0';
        dropdown.innerHTML = `
            <a href="my_profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
            <button id="desktop-logout-btn" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
        `;
        document.body.appendChild(dropdown);

        desktopProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
            dropdown.classList.toggle('opacity-100');
        });

        document.addEventListener('click', () => {
            dropdown.classList.add('hidden');
            dropdown.classList.remove('opacity-100');
        });
    }

    // --- Mobile ---
    const mobileProfileWrapper = document.getElementById('mobile-profile-wrapper');
    const mobileDropdown = document.getElementById('mobile-dropdown');
    if (mobileProfileWrapper && mobileDropdown) {
        const profileImg = mobileProfileWrapper.querySelector('img');
        profileImg.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileDropdown.classList.toggle('hidden');
            mobileDropdown.classList.toggle('opacity-100');
        });

        document.addEventListener('click', () => {
            mobileDropdown.classList.add('hidden');
            mobileDropdown.classList.remove('opacity-100');
        });
    }

    // --- Logout Buttons ---
    document.addEventListener('click', (e) => {
        if (e.target.id === 'desktop-logout-btn' || e.target.id === 'mobile-logout-btn') {
            window.location.href = '../sign_in.html';
        }
    });
}

/**
 * Highlights the current page link in both navigation bars.
 */
function highlightCurrentPage() {
    // Remove the default fallback to 'employee_dashboard.html'
    const currentPath = window.location.pathname.split('/').pop();

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
                        element.classList.add(
                            'text-custom-blue',
                            'font-bold',
                            'border-b-2',
                            'border-custom-blue',
                            'pb-1'
                        );
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

