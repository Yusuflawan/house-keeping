async function loadClientNav() {
    const topNavPlaceholder = document.getElementById('top-nav-placeholder');
    const bottomNavPlaceholder = document.getElementById('bottom-nav-placeholder');

    if (!topNavPlaceholder || !bottomNavPlaceholder) {
        console.error('Navigation placeholders (top-nav-placeholder or bottom-nav-placeholder) not found.');
        return;
    }

    try {
        const response = await fetch('client_nav.html');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const navHtml = await response.text();

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = navHtml;

        const desktopNav = tempDiv.querySelector('#desktop-nav-content');
        const mobileNav = tempDiv.querySelector('#mobile-nav-content');
        const mobileTopBar = tempDiv.querySelector('#mobile-top-bar');

        if (desktopNav && mobileNav && mobileTopBar) {
            // Inject desktop and mobile navs
            topNavPlaceholder.innerHTML = desktopNav.outerHTML;
            bottomNavPlaceholder.innerHTML = mobileNav.outerHTML;
            document.body.appendChild(mobileTopBar);

            // Adjust content spacing
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.classList.add('pt-20', 'pb-20', 'md:pt-24', 'md:pb-8');

            highlightCurrentPage();
            setupProfileDropdowns();
        } else {
            console.error('Could not find navigation sections inside client_nav.html');
        }
    } catch (error) {
        console.error('Error loading client navigation:', error);
    }
}

function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'client_dashboard.html';
    const navLinks = [
        { path: 'client_dashboard.html', ids: ['nav-desktop-dashboard', 'nav-mobile-dashboard'] },
        { path: 'book_now.html', ids: ['nav-desktop-book_now', 'nav-mobile-book_now'] },
        { path: 'my_bookings.html', ids: ['nav-desktop-mybookings', 'nav-mobile-mybookings'] },
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
                        if (icon) icon.classList.add('text-custom-blue');
                        const text = element.querySelector('span');
                        if (text) text.classList.add('font-semibold');
                    }
                }
            });
        }
    });
}

function setupProfileDropdowns() {
    // Desktop Dropdown Toggle
    const desktopBtn = document.querySelector('#client-profile-container button');
    const desktopDropdown = document.getElementById('client-profile-dropdown');
    const mobileBtn = document.querySelector('#client-profile-container-mobile button');
    const mobileDropdown = document.getElementById('client-profile-dropdown-mobile');

    if (desktopBtn && desktopDropdown) {
        desktopBtn.addEventListener('click', () => {
            desktopDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!desktopBtn.contains(e.target) && !desktopDropdown.contains(e.target)) {
                desktopDropdown.classList.add('hidden');
            }
        });
    }

    if (mobileBtn && mobileDropdown) {
        mobileBtn.addEventListener('click', () => {
            mobileDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!mobileBtn.contains(e.target) && !mobileDropdown.contains(e.target)) {
                mobileDropdown.classList.add('hidden');
            }
        });
    }

    // Logout links
    document.querySelectorAll('#logout-link, #logout-link-mobile').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'sign_in.html';
        });
    });
}
