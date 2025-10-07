/**
 * client_bookings_table.js
 * Logic to fetch and display the client's booking history and upcoming services using a scalable table view.
 */

// --- 1. MOCK DATA SIMULATION (Same as before) ---
const mockClientBookings = [
    {
        bookingId: 'SCRUB-12349',
        status: 'Confirmed',
        serviceType: 'Standard Clean',
        dateTime: 'Friday, 18 Oct 2025 | 9:00 AM',
        address: 'Flat 4, The Mews, London',
        price: 135.00,
        cleaner: 'Eliza P.',
        isUpcoming: true
    },
    {
        bookingId: 'SCRUB-12350',
        status: 'Confirmed',
        serviceType: 'Deep Clean',
        dateTime: 'Monday, 28 Oct 2025 | 1:00 PM',
        address: 'Flat 4, The Mews, London',
        price: 210.00,
        cleaner: null, // Cleaner not yet assigned
        isUpcoming: true
    },
    {
        bookingId: 'SCRUB-12351',
        status: 'Completed',
        serviceType: 'Move-Out Clean',
        dateTime: 'Friday, 27 Sep 2025 | 9:00 AM',
        address: 'Old Address, Westminster',
        price: 350.00,
        cleaner: 'Eliza P.',
        isUpcoming: false
    },
    {
        bookingId: 'SCRUB-12352',
        status: 'Cancelled',
        serviceType: 'Deep Clean',
        dateTime: 'Sunday, 20 Oct 2025 | 10:00 AM',
        address: 'Apartment 1A, Manchester',
        price: 150.00,
        cleaner: 'Eliza P.',
        isUpcoming: false
    }
];

// --- 2. HELPER FUNCTIONS ---

/**
 * Maps a booking status to the appropriate Tailwind classes and returns action state.
 * @param {string} status 
 * @returns {{text: string, bg: string, isActionable: boolean}}
 */
function getStatusBadgeClasses(status) {
    switch (status) {
        case 'Confirmed':
            return { text: 'text-custom-green', bg: 'bg-green-100', isActionable: true };
        case 'Completed':
            return { text: 'text-custom-blue', bg: 'bg-blue-100', isActionable: false };
        case 'Cancelled':
            return { text: 'text-red-700', bg: 'bg-red-100', isActionable: false };
        case 'In Progress':
            return { text: 'text-custom-blue', bg: 'bg-blue-100', isActionable: false };
        default:
            return { text: 'text-gray-700', bg: 'bg-gray-200', isActionable: false };
    }
}

/**
 * Creates the HTML string for a single table row (tr).
 * @param {object} booking 
 * @returns {string}
 */
function createBookingRow(booking) {
    const badge = getStatusBadgeClasses(booking.status);
    const cleanerDisplay = booking.cleaner ? booking.cleaner : '<span class="text-gray-400">TBD</span>';
    
    // --- 1. Determine Action Buttons for the last column ---
    let actionButtons = `
        <a href="booking_details.html?id=${booking.bookingId}" class="text-xs text-custom-blue hover:text-custom-blue/80 font-medium whitespace-nowrap">
            View Details
        </a>
    `;

    if (badge.isActionable) {
        // Upcoming/Confirmed: Reschedule and Cancel buttons
        actionButtons = `
            <a href="#" onclick="alert('Navigating to Reschedule for ${booking.bookingId}')" class="text-xs text-gray-500 hover:text-gray-700 font-medium transition duration-150 whitespace-nowrap">
                Reschedule
            </a>
            <span class="text-gray-300 mx-1 hidden sm:inline">|</span>
            <a href="#" onclick="alert('Confirming cancellation for ${booking.bookingId}')" class="text-xs text-red-500 hover:text-red-700 font-medium transition duration-150 whitespace-nowrap">
                Cancel
            </a>
        `;
    } else if (booking.status === 'Completed') {
        // Completed: Leave a Review button
        actionButtons = `
            <button onclick="alert('Navigating to Review for ${booking.bookingId}')" class="text-xs bg-custom-green text-white py-1 px-3 rounded font-semibold hover:bg-opacity-90 transition duration-150 whitespace-nowrap">
                Review <i class="fa-solid fa-star ml-1"></i>
            </button>
        `;
    }

    // --- 2. Generate the Table Row HTML ---
    return `
        <tr class="hover:bg-gray-50 transition duration-100">
            <td class="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                ${booking.bookingId}
            </td>
            <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
                ${booking.serviceType}
            </td>
            <td class="px-3 py-3 whitespace-nowrap text-sm text-custom-blue font-medium">
                ${booking.dateTime}
            </td>
            <td class="px-3 py-3 whitespace-nowrap text-sm font-bold text-gray-800">
                £${booking.price.toFixed(2)}
            </td>
            <td class="px-3 py-3 whitespace-nowrap">
                <span class="px-2 py-0.5 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}">
                    ${booking.status.toUpperCase()}
                </span>
            </td>
            <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                ${cleanerDisplay}
            </td>
            <td class="px-3 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                ${actionButtons}
            </td>
        </tr>
    `;
}

/**
 * Renders the list of bookings based on the selected tab and updates tab counters.
 * @param {string} tabType - 'upcoming' or 'completed'
 */
function renderBookings(tabType) {
    const tableContainer = document.getElementById('table-container');
    const emptyStateContainer = document.getElementById('empty-state-container');
    const isUpcoming = tabType === 'upcoming';
    
    // 1. Filter Data
    const allUpcoming = mockClientBookings.filter(b => b.isUpcoming === true);
    const allCompleted = mockClientBookings.filter(b => b.isUpcoming === false);

    const filteredBookings = isUpcoming ? allUpcoming : allCompleted;

    // 2. Update Tab Counters
    document.getElementById('tab-upcoming').textContent = `Upcoming (${allUpcoming.length})`;
    document.getElementById('tab-completed').textContent = `History (${allCompleted.length})`;

    // 3. Generate HTML
    if (filteredBookings.length === 0) {
        // Show empty state and hide table
        tableContainer.innerHTML = '';
        emptyStateContainer.classList.remove('hidden');
        emptyStateContainer.innerHTML = `
            <div class="bg-white p-12 text-center rounded-xl shadow-inner text-gray-500">
                <i class="fa-solid fa-box-open text-4xl mb-3 text-gray-300"></i>
                <p class="text-lg font-medium">No ${isUpcoming ? 'Upcoming' : 'Past'} Bookings Found</p>
                <p class="text-sm mt-1">Ready to schedule your next clean? Click "Book New Clean" above!</p>
            </div>
        `;
    } else {
        // Hide empty state and show table
        emptyStateContainer.classList.add('hidden');
        
        // Sort: Upcoming by date ascending, History by date descending
        const sortedBookings = filteredBookings.sort((a, b) => {
            const dateA = new Date(a.dateTime.split('|')[0]);
            const dateB = new Date(b.dateTime.split('|')[0]);
            return isUpcoming ? dateA - dateB : dateB - dateA;
        });

        const tableRows = sortedBookings.map(createBookingRow).join('');

        // Inject the full table structure
        tableContainer.innerHTML = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                    <tr>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cleaner</th>
                        <th scope="col" class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${tableRows}
                </tbody>
            </table>
        `;
    }
}

/**
 * Handles tab switching (visual and data rendering).
 * @param {string} newTab - 'upcoming' or 'completed'
 */
function switchTab(newTab) {
    const tabs = document.querySelectorAll('.tab-btn');
    
    // Update visual tab state
    tabs.forEach(tab => {
        if (tab.dataset.tab === newTab) {
            tab.classList.remove('text-gray-500', 'border-transparent', 'hover:text-gray-700', 'hover:border-gray-300');
            tab.classList.add('text-custom-blue', 'border-custom-blue');
        } else {
            tab.classList.remove('text-custom-blue', 'border-custom-blue');
            tab.classList.add('text-gray-500', 'border-transparent', 'hover:text-gray-700', 'hover:border-gray-300');
        }
    });

    // Render new data
    renderBookings(newTab);
}


// --- 3. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex'; // Show loading state

    // Simulate API call delay (1 second)
    setTimeout(() => {
        loadingOverlay.style.display = 'none'; // Hide loading state
        
        // Setup tab listeners
        document.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
        });
        
        // Initial render for the default tab ('upcoming')
        switchTab('upcoming'); 
        
    }, 1000); 
});