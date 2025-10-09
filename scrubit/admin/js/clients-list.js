// --- Placeholder data for Clients ---
const clientsData = [
    { id: 'C-001', name: 'Alice Johnson', bookings: 12, accountStatus: 'Active', lastBooking: '2025-10-01' },
    { id: 'C-002', name: 'Robert Lee', bookings: 5, accountStatus: 'Active', lastBooking: '2025-09-15' },
    { id: 'C-003', name: 'Maria Garcia', bookings: 25, accountStatus: 'Active', lastBooking: '2025-10-02' },
    { id: 'C-004', name: 'David Jones', bookings: 1, accountStatus: 'Suspended', lastBooking: '2024-03-20' },
];

// --- Action handler (View Profile etc.) ---
window.handleClientAction = function (clientId, action) {
    if (action === 'View Profile') {
        window.location.href = `client-profile.html?id=${clientId}`;
    } else {
        alert(`Action: ${action} for Client ID ${clientId}.`);
    }
};

// --- Rendering Logic ---
function renderClientsTable(data = clientsData) {
    const tableBody = document.getElementById('clients-table-body');
    const totalCountHeader = document.getElementById('client-count-header');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    data.forEach(client => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        // Determine badge color dynamically based on accountStatus
        let statusClass = '';
        if (client.accountStatus.toLowerCase() === 'active') {
            statusClass = 'bg-custom-green text-white';
        } else if (client.accountStatus.toLowerCase() === 'suspended') {
            statusClass = 'bg-custom-red text-white';
        } else {
            statusClass = 'bg-gray-400 text-white';
        }

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${client.name} <span class="text-xs text-gray-500">(${client.id})</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${client.bookings}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${client.lastBooking}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass} shadow-md">
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

    if (totalCountHeader) totalCountHeader.textContent = data.length;
}

// --- Filtering Logic ---
function setupClientFilter() {
    const filter = document.getElementById('status-filter');
    if (!filter) return;

    filter.addEventListener('change', () => {
        const value = filter.value.trim().toLowerCase();
        let filtered = clientsData;

        if (value && value !== 'all') {
            filtered = clientsData.filter(client =>
                client.accountStatus.toLowerCase() === value
            );
        }

        renderClientsTable(filtered);
    });
}

// --- Execute on Page Load ---
window.onload = function () {
    renderClientsTable();
    setupClientFilter();
};
