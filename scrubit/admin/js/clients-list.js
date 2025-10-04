// Placeholder data for Clients
const clientsData = [
    { id: 'C-001', name: 'Alice Johnson', bookings: 12, clientStatus: 'Regular', accountStatus: 'Active', statusClass: 'bg-custom-green', lastBooking: '2025-10-01' },
    { id: 'C-002', name: 'Robert Lee', bookings: 5, clientStatus: 'New', accountStatus: 'Pending', statusClass: 'bg-custom-yellow', lastBooking: '2025-09-15' },
    { id: 'C-003', name: 'Maria Garcia', bookings: 25, clientStatus: 'VIP', accountStatus: 'Active', statusClass: 'bg-custom-blue', lastBooking: '2025-10-02' },
    { id: 'C-004', name: 'David Jones', bookings: 1, clientStatus: 'Dormant', accountStatus: 'Suspended', statusClass: 'bg-custom-red', lastBooking: '2024-03-20' },
];

/**
 * Action handler (Placeholder for viewing profile or managing status).
 * This function needs to be globally accessible as it's called via inline 'onclick' in the table rows.
 */
window.handleClientAction = function(clientId, action) {
    if (action === 'View Profile') {
        // In a real application, this would navigate to the profile page
        window.location.href = `client-profile.html?id=${clientId}`;
    } else {
        alert(`Action: ${action} for Client ID ${clientId}.`);
    }
};

// --- Rendering Logic (Dynamic content insertion) ---
function renderClientsTable() {
    const tableBody = document.getElementById('clients-table-body');
    if (!tableBody) return;

    // Clear table body before rendering
    tableBody.innerHTML = ''; 

    clientsData.forEach(client => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        
        // Handle yellow status text color (for Pending, Dormant etc.)
        const statusTextColor = client.statusClass === 'bg-custom-yellow' ? 'text-gray-900' : 'text-white';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${client.name} <span class="text-xs text-gray-500">(${client.id})</span></td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${client.bookings}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${client.clientStatus}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${client.lastBooking}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusTextColor} ${client.statusClass} shadow-md">
                    ${client.accountStatus}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="handleClientAction('${client.id}', 'View Profile')"
                    class="text-sm font-medium px-3 py-1 rounded-lg text-white bg-custom-blue hover:bg-indigo-600 transition-colors shadow">
                    View Profile
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// --- Execute on Page Load ---
window.onload = function () {
    renderClientsTable();
};
