// Placeholder data for Bookings
const bookingsData = [
    { id: '2025-154', client: 'Alice M.', clientId: 'C-001', service: 'Deep Clean (4hr)', date: '2025-10-05', time: '10:00', employee: 'Jane D.', employeeId: 'E-001', status: 'Completed', statusClass: 'bg-custom-green', action: 'View Payout' },
    { id: '2025-155', client: 'Ben K.', clientId: 'C-002', service: 'Laundry Service', date: '2025-10-06', time: '14:00', employee: 'Unassigned', employeeId: null, status: 'Pending Assignment', statusClass: 'bg-custom-yellow', action: 'Assign Job' },
    { id: '2025-156', client: 'Ciara P.', clientId: 'C-003', service: 'Office Cleaning', date: '2025-10-07', time: '09:00', employee: 'Mark S.', employeeId: 'E-002', status: 'Confirmed', statusClass: 'bg-custom-blue', action: 'Reassign Job' },
    { id: '2025-157', client: 'David L.', clientId: 'C-004', service: 'Deep Clean (6hr)', date: '2025-10-08', time: '11:30', employee: 'Jane D.', employeeId: 'E-001', status: 'In Progress', statusClass: 'bg-custom-purple', action: 'View Details' },
    { id: '2025-158', client: 'Emily R.', clientId: 'C-005', service: 'Standard Clean (2hr)', date: '2025-10-09', time: '16:00', employee: 'Sara P.', employeeId: 'E-003', status: 'Confirmed', statusClass: 'bg-custom-blue', action: 'Reassign Job' },
    { id: '2025-159', client: 'Frank G.', clientId: 'C-006', service: 'Window Cleaning', date: '2025-10-10', time: '13:00', employee: 'Unassigned', employeeId: null, status: 'Pending Assignment', statusClass: 'bg-custom-yellow', action: 'Assign Job' },
    { id: '2025-160', client: 'Grace H.', clientId: 'C-007', service: 'Move-out Clean', date: '2025-10-11', time: '08:00', employee: 'Mark S.', employeeId: 'E-002', status: 'Confirmed', statusClass: 'bg-custom-blue', action: 'Reassign Job' },
];

const TOTAL_ACTIVE_BOOKINGS = 148; // Static placeholder for the overall count

// --- Action Handlers ---

// Action handler (Placeholder for assigning, reassigning, or viewing details)
window.handleBookingAction = function(bookingId, action) {
    // If the action is "View Details" or "View Payout", we simulate navigation
    if (action.includes('View')) {
        window.location.href = `booking-details.html?id=${bookingId}`;
    } else {
        alert(`Action: ${action} for Booking ID ${bookingId}. This would typically open a modal for confirmation or assignment.`);
    }
}

// Handler for the Export Button
window.handleExport = function() {
    alert("Exporting current booking list (Filtered results would be exported in a real application).");
}


// --- Dynamic Rendering ---

/**
 * Renders the booking table rows based on the data.
 */
function renderBookingsTable(data = bookingsData) {
    const tableBody = document.getElementById('bookings-table-body');
    const totalCountSpan = document.getElementById('total-bookings-count');
    const paginationSummary = document.getElementById('pagination-summary');

    if (!tableBody || !totalCountSpan || !paginationSummary) return;
    
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach(booking => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors cursor-pointer'; 
        // Add direct navigation to details page for the whole row (optional improvement)
        row.onclick = () => window.location.href = `booking-details.html?id=${booking.id}`;

        // Check for yellow status to adjust text color for better visibility on yellow background
        const statusTextColor = booking.statusClass === 'bg-custom-yellow' ? 'text-gray-900' : 'text-white';
        
        // Determine action button styling
        let actionButtonClass = 'text-custom-blue hover:text-indigo-600 font-semibold';
        if (booking.action.includes('Assign') || booking.action.includes('Reassign')) {
            actionButtonClass = 'bg-custom-red text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors font-semibold';
        }

        // Employee link logic
        const employeeCellContent = booking.employee.includes('Unassigned') 
            ? `<span class="text-gray-500">${booking.employee}</span>`
            : `<a href="employee-profile.html?id=${booking.employeeId}" class="text-custom-blue hover:underline" onclick="event.stopPropagation()">${booking.employee}</a>`; // stopPropagation prevents row click

        // Client link logic
        const clientCellContent = `<a href="client-profile.html?id=${booking.clientId}" class="text-custom-blue hover:underline" onclick="event.stopPropagation()">${booking.client}</a>`;

        // The innerHTML for the row
        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${booking.id}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                ${clientCellContent}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${booking.service}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${booking.date}<div class="text-xs text-gray-500">${booking.time}</div></td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                ${employeeCellContent}
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.statusClass} ${statusTextColor}">
                    ${booking.status}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="event.stopPropagation(); handleBookingAction('${booking.id}', '${booking.action}')" class="${actionButtonClass}">
                    ${booking.action}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update summary counts (using static placeholder and dynamic count for display)
    totalCountSpan.textContent = TOTAL_ACTIVE_BOOKINGS;
    paginationSummary.textContent = `Showing 1 to ${data.length} of ${TOTAL_ACTIVE_BOOKINGS} active results`;
}

// --- Navigation Highlight ---

function highlightBookingsList() {
    // This assumes your sidebar.js has a function to handle highlights
    if (typeof highlightActiveNav === 'function') {
        highlightActiveNav('bookings-list.html');
    }

    const parentButton = document.getElementById('bookings-parent-nav');
    const parentMenu = document.getElementById('bookings-menu');
    const bookingsListLink = document.querySelector('a[href="bookings-list.html"]');

    const activeClasses = ['text-white', 'bg-custom-blue', 'shadow-md', 'font-bold', 'hover:!bg-custom-blue', 'hover:!text-white', 'hover:!shadow-md'];
    const submenuActiveClasses = ['text-custom-blue', 'font-bold', 'bg-indigo-50', 'hover:bg-indigo-100'];

    if (parentButton && parentMenu) {
        parentButton.classList.remove('text-gray-700', 'hover:bg-gray-100'); 
        parentButton.classList.add(...activeClasses);
        parentMenu.classList.remove('hidden');
    }

    if (bookingsListLink) {
        bookingsListLink.classList.remove('text-gray-600', 'hover:bg-gray-50'); 
        bookingsListLink.classList.add(...submenuActiveClasses);
    }
}


// --- Execute page-specific logic once the DOM is ready ---
document.addEventListener('DOMContentLoaded', function() {
    // 1. Render all booking data into the HTML elements
    renderBookingsTable();
    
    // 2. Highlight the correct menu item (assuming the highlight function is loaded with sidebar.js)
    highlightBookingsList(); 
});