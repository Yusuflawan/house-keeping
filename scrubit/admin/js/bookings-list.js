// --- Mock Booking Data ---
const bookingsData = [
    { id: '2025-154', client: 'Alice M.', clientId: 'C-001', service: 'Deep Clean (4hr)', date: '2025-10-05', time: '10:00', employee: 'Jane D.', employeeId: 'E-001', status: 'Completed' },
    { id: '2025-155', client: 'Ben K.', clientId: 'C-002', service: 'Laundry Service', date: '2025-10-06', time: '14:00', employee: 'Unassigned', employeeId: null, status: 'Pending Assignment' },
    { id: '2025-156', client: 'Ciara P.', clientId: 'C-003', service: 'Office Cleaning', date: '2025-10-07', time: '09:00', employee: 'Mark S.', employeeId: 'E-002', status: 'Confirmed' },
    { id: '2025-157', client: 'David L.', clientId: 'C-004', service: 'Deep Clean (6hr)', date: '2025-10-08', time: '11:30', employee: 'Jane D.', employeeId: 'E-001', status: 'In Progress' },
    { id: '2025-158', client: 'Emily R.', clientId: 'C-005', service: 'Standard Clean (2hr)', date: '2025-10-09', time: '16:00', employee: 'Sara P.', employeeId: 'E-003', status: 'Awaiting Payment Confirmation' },
    { id: '2025-159', client: 'Frank G.', clientId: 'C-006', service: 'Window Cleaning', date: '2025-10-10', time: '13:00', employee: 'Mark S.', employeeId: 'E-002', status: 'Cancelled' },
];

// --- Total Bookings Count (mock placeholder) ---
const TOTAL_ACTIVE_BOOKINGS = 148;

// --- Status Badge Color Generator (matches the new unified system) ---
function createStatusBadge(status) {
    let colorClass;
    switch (status) {
        case 'Completed':
            colorClass = 'bg-green-500/10 text-green-700 border border-green-300';
            break;
        case 'In Progress':
            colorClass = 'bg-indigo-500/10 text-indigo-700 border border-indigo-300';
            break;
        case 'Confirmed':
            colorClass = 'bg-blue-500/10 text-blue-700 border border-blue-300';
            break;
        case 'Pending Assignment':
            colorClass = 'bg-yellow-500/10 text-yellow-700 border border-yellow-300';
            break;
        case 'Awaiting Payment Confirmation':
            colorClass = 'bg-amber-500/10 text-amber-700 border border-amber-300';
            break;
        case 'Cancelled':
            colorClass = 'bg-red-500/10 text-red-700 border border-red-300';
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-700 border border-gray-300';
    }
    return `<span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}">${status}</span>`;
}

// --- Action Handler ---
window.handleBookingAction = function (bookingId, status, action) {
    if (action === 'View Details') {
        window.location.href = `booking-details.html?id=${bookingId}&status=${encodeURIComponent(status)}`;
    } else if (action === 'Confirm Payment') {
        alert(`Payment for booking ${bookingId} has been confirmed.`);
    }
};

// --- Export Handler ---
window.handleExport = function () {
    alert("Exporting current booking list (filtered results would be exported in a real app).");
};

// --- Rendering Function ---
function renderBookingsTable(filteredData = bookingsData) {
    const tableBody = document.getElementById('bookings-table-body');
    const totalCountSpan = document.getElementById('total-bookings-count');
    const paginationSummary = document.getElementById('pagination-summary');

    tableBody.innerHTML = '';

    filteredData.forEach(booking => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors cursor-pointer';
        row.onclick = () => window.location.href = `booking-details.html?id=${booking.id}&status=${encodeURIComponent(booking.status)}`;

        const clientHTML = `<a href="client-profile.html?id=${booking.clientId}" class="text-custom-blue hover:underline" onclick="event.stopPropagation()">${booking.client}</a>`;
        const employeeHTML = booking.employee === 'Unassigned'
            ? `<span class="text-gray-500">Unassigned</span>`
            : `<a href="employee-profile.html?id=${booking.employeeId}" class="text-custom-blue hover:underline" onclick="event.stopPropagation()">${booking.employee}</a>`;

        // Determine available actions
        let actionsHTML = `
            <button onclick="event.stopPropagation(); handleBookingAction('${booking.id}', '${booking.status}', 'View Details')" class="text-custom-blue hover:text-indigo-600 font-semibold">View Details</button>
        `;

        if (booking.status === 'Awaiting Payment Confirmation') {
            actionsHTML += `
                <button onclick="event.stopPropagation(); handleBookingAction('${booking.id}', '${booking.status}', 'Confirm Payment')" class="ml-3 bg-custom-green text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors font-semibold">Confirm Payment</button>
            `;
        }

        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${booking.id}</td>
            <td class="px-4 py-3 text-sm text-gray-700 font-semibold">${clientHTML}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${booking.service}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${booking.date}<div class="text-xs text-gray-500">${booking.time}</div></td>
            <td class="px-4 py-3 text-sm text-gray-700 font-medium">${employeeHTML}</td>
            <td class="px-4 py-3">${createStatusBadge(booking.status)}</td>
            <td class="px-4 py-3 text-right text-sm font-medium">${actionsHTML}</td>
        `;

        tableBody.appendChild(row);
    });

    totalCountSpan.textContent = TOTAL_ACTIVE_BOOKINGS;
    paginationSummary.textContent = `Showing 1 to ${filteredData.length} of ${TOTAL_ACTIVE_BOOKINGS} active results`;
}

// --- Real-Time Filter Logic ---
function setupFilters() {
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');

    function applyFilters() {
        const statusValue = statusFilter.value.trim();
        const dateValue = dateFilter.value;

        let filtered = bookingsData;

        if (statusValue) {
            filtered = filtered.filter(b => b.status.toLowerCase() === statusValue.toLowerCase());
        }

        if (dateValue) {
            filtered = filtered.filter(b => b.date === dateValue);
        }

        renderBookingsTable(filtered);
    }

    statusFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);
}

// --- Highlight Sidebar Item ---
function highlightBookingsList() {
    if (typeof highlightActiveNav === 'function') highlightActiveNav('bookings-list.html');

    const parentButton = document.getElementById('bookings-parent-nav');
    const parentMenu = document.getElementById('bookings-menu');
    const bookingsListLink = document.querySelector('a[href="bookings-list.html"]');

    if (parentButton && parentMenu) {
        parentButton.classList.add('text-white', 'bg-custom-blue', 'shadow-md', 'font-bold');
        parentMenu.classList.remove('hidden');
    }

    if (bookingsListLink) {
        bookingsListLink.classList.add('text-custom-blue', 'font-bold', 'bg-indigo-50');
    }
}

// --- Initialize on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    renderBookingsTable();
    setupFilters();
    highlightBookingsList();
});

document.getElementById('reset-filters').addEventListener('click', () => {
    const statusSelect = document.getElementById('status-filter');
    const dateInput = document.getElementById('date-filter');

    // Reset both filters
    statusSelect.value = '';
    dateInput.value = '';

    // Re-render all bookings
    renderBookingsTable(bookingsData);
});

