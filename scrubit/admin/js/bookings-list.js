// Placeholder data for Bookings
const bookingsData = [
    { id: '2025-154', client: 'Alice M.', clientId: 'C-001', service: 'Deep Clean (4hr)', date: '2025-10-05', time: '10:00', employee: 'Jane D.', employeeId: 'E-001', status: 'Completed', statusClass: 'bg-custom-green', action: 'View Payout' },
    { id: '2025-155', client: 'Ben K.', clientId: 'C-002', service: 'Laundry Service', date: '2025-10-06', time: '14:00', employee: 'Unassigned', employeeId: null, status: 'Pending Assignment', statusClass: 'bg-custom-yellow', action: 'Assign Job' },
    { id: '2025-156', client: 'Ciara P.', clientId: 'C-003', service: 'Office Cleaning', date: '2025-10-07', time: '09:00', employee: 'Mark S.', employeeId: 'E-002', status: 'Confirmed', statusClass: 'bg-custom-blue', action: 'Reassign Job' },
    { id: '2025-157', client: 'David L.', clientId: 'C-004', service: 'Deep Clean (6hr)', date: '2025-10-08', time: '11:30', employee: 'Jane D.', employeeId: 'E-001', status: 'In Progress', statusClass: 'bg-custom-purple', action: 'View Details' },
    { id: '2025-158', client: 'Emily R.', clientId: 'C-005', service: 'Standard Clean (2hr)', date: '2025-10-09', time: '16:00', employee: 'Sara P.', employeeId: 'E-003', status: 'Confirmed', statusClass: 'bg-custom-blue', action: 'Reassign Job' },
    { id: '2025-159', client: 'Frank G.', clientId: 'C-006', service: 'Window Cleaning', date: '2025-10-10', time: '13:00', employee: 'Unassigned', employeeId: null, status: 'Pending Assignment', statusClass: 'bg-custom-yellow', action: 'Assign Job' },
];

// Action handler (Placeholder for assigning, reassigning, or viewing details)
// Attached to window to be accessible from inline HTML onclick attributes
window.handleBookingAction = function(bookingId, action) {
    alert(`Action: ${action} for Booking ID ${bookingId}. This would typically open a modal or a dedicated booking detail page.`);
}

/**
 * Renders the booking table rows based on the data.
 */
function renderBookingsTable(data = bookingsData) {
    const tableBody = document.getElementById('bookings-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach(booking => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        // Check for yellow status to adjust text color for better visibility on yellow background
        const statusTextColor = booking.statusClass === 'bg-custom-yellow' ? 'text-gray-900' : 'text-white';
        
        // Determine action button styling
        let actionButtonClass = 'text-custom-blue hover:text-indigo-600 font-semibold';
        if (booking.action.includes('Assign') || booking.action.includes('Reassign')) {
            actionButtonClass = 'bg-custom-red text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors font-semibold';
        }

        // Employee link logic
        const employeeCell = booking.employee.includes('Unassigned') 
            ? booking.employee
            : `<a href="employee-profile.html?id=${booking.employeeId}" class="text-custom-blue hover:underline">${booking.employee}</a>`;

        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${booking.id}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                <a href="client-profile.html?id=${booking.clientId}" class="text-custom-blue hover:underline">${booking.client}</a>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${booking.service}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${booking.date}<div class="text-xs text-gray-500">${booking.time}</div></td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                ${employeeCell}
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.statusClass} ${statusTextColor}">
                    ${booking.status}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="handleBookingAction('${booking.id}', '${booking.action}')" class="${actionButtonClass}">
                    ${booking.action}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

window.onload = function () {
    renderBookingsTable();
};