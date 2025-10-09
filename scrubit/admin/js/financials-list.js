// --- Global Data (Ideally fetched from an API) ---
const invoicesData = [
    { invoiceId: 'INV-0105', bookingId: '2025-157', client: 'David L.', clientId: 'C-004', amount: 170.00, status: 'Paid', date: '2025-09-28' },
    { invoiceId: 'INV-0104', bookingId: '2025-156', client: 'Sarah K.', clientId: 'C-011', amount: 245.50, status: 'Pending', date: '2025-09-27' },
    { invoiceId: 'INV-0102', bookingId: '2025-154', client: 'David L.', clientId: 'C-004', amount: 120.00, status: 'Refunded', date: '2025-09-25' },
    { invoiceId: 'INV-0101', bookingId: '2025-153', client: 'Jane Doe', clientId: 'C-001', amount: 195.00, status: 'Paid', date: '2025-09-24' },
    { invoiceId: 'INV-0100', bookingId: '2025-152', client: 'Sarah K.', clientId: 'C-011', amount: 90.00, status: 'Paid', date: '2025-09-23' },
];

const payoutsData = [
    { payoutId: 'PAY-101', employee: 'Jane D.', employeeId: 'E-001', amount: 850.50, period: 'Sep 1 - Sep 15', status: 'Paid', date: '2025-09-16' },
    { payoutId: 'PAY-100', employee: 'Mike T.', employeeId: 'E-002', amount: 620.00, period: 'Sep 1 - Sep 15', status: 'Pending', date: '2025-09-16' },
    { payoutId: 'PAY-099', employee: 'Sarah L.', employeeId: 'E-003', amount: 910.75, period: 'Aug 16 - Aug 31', status: 'Paid', date: '2025-09-01' },
];

let currentView = 'invoices'; // Track active view


// --- Action handler ---
window.handleAction = function(actionType, id = null, status = null) {
    if (actionType === 'view-invoice-details' && id && status) {
        window.location.href = `invoice-details.html?id=${id}&status=${status}`;
    } else if (actionType === 'view-payout-details' && id && status) {
        window.location.href = `payout-details.html?id=${id}&status=${status}`;
    }
};


// --- Table header updater ---
function updateTableHeaders(view) {
    const tableHead = document.getElementById('table-headers');
    const countDisplay = document.getElementById('count-display');
    const count = view === 'invoices' ? invoicesData.length : payoutsData.length;
    countDisplay.textContent = count;

    if (view === 'invoices') {
        tableHead.innerHTML = `
            <th class="px-4 py-3">Invoice ID</th>
            <th class="px-4 py-3">Booking Ref</th>
            <th class="px-4 py-3">Client</th>
            <th class="px-4 py-3">Amount</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Payment Date</th>
            <th class="px-4 py-3 text-right">Actions</th>
        `;
    } else {
        tableHead.innerHTML = `
            <th class="px-4 py-3">Payout ID</th>
            <th class="px-4 py-3">Employee</th>
            <th class="px-4 py-3">Amount</th>
            <th class="px-4 py-3">Pay Period</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Date Processed</th>
            <th class="px-4 py-3 text-right">Actions</th>
        `;
    }
}


// --- Render Invoices Table ---
function renderInvoicesTable(data) {
    const tableBody = document.getElementById('financials-table-body');
    tableBody.innerHTML = '';

    data.forEach(invoice => {
        let statusClass;
        if (invoice.status === 'Paid') statusClass = 'bg-custom-green';
        else if (invoice.status === 'Pending') statusClass = 'bg-custom-yellow';
        else statusClass = 'bg-gray-500'; // Refunded

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${invoice.invoiceId}</td>
            <td class="px-4 py-3 text-sm text-custom-blue">
                <a href="booking-details.html?id=${invoice.bookingId}" class="hover:underline">${invoice.bookingId}</a>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
                <a href="client-profile.html?id=${invoice.clientId}" class="hover:text-custom-blue">${invoice.client}</a>
            </td>
            <td class="px-4 py-3 text-sm font-bold text-custom-green">$${invoice.amount.toFixed(2)}</td>
            <td class="px-4 py-3">
                <span class="px-3 py-1 text-xs font-semibold rounded-full text-white ${statusClass}">
                    ${invoice.status}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">${invoice.date}</td>
            <td class="px-4 py-3 text-right">
                <button onclick="handleAction('view-invoice-details', '${invoice.invoiceId}', '${invoice.status}')"
                    class="text-custom-blue hover:text-indigo-600 font-semibold">
                    View Details
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('count-display').textContent = data.length;
}


// --- Render Payouts Table ---
function renderPayoutsTable(data) {
    const tableBody = document.getElementById('financials-table-body');
    tableBody.innerHTML = '';

    data.forEach(payout => {
        let statusClass;
        if (payout.status === 'Paid') statusClass = 'bg-custom-green';
        else statusClass = 'bg-custom-yellow'; // Pending

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${payout.payoutId}</td>
            <td class="px-4 py-3 text-sm text-gray-700">
                <a href="employee-profile.html?id=${payout.employeeId}" class="hover:text-custom-blue">${payout.employee}</a>
            </td>
            <td class="px-4 py-3 text-sm font-bold text-custom-blue">$${payout.amount.toFixed(2)}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${payout.period}</td>
            <td class="px-4 py-3">
                <span class="px-3 py-1 text-xs font-semibold rounded-full text-white ${statusClass}">
                    ${payout.status}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">${payout.date}</td>
            <td class="px-4 py-3 text-right">
                <button onclick="handleAction('view-payout-details', '${payout.payoutId}', '${payout.status}')"
                    class="text-custom-blue hover:text-indigo-600 font-semibold">
                    View Details
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('count-display').textContent = data.length;
}


// --- Filtering Logic ---
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const monthFilter = document.getElementById('month-filter').value;

    let filteredData = currentView === 'invoices' ? invoicesData.slice() : payoutsData.slice();

    filteredData = filteredData.filter(item => {
        const nameField = currentView === 'invoices' ? item.client.toLowerCase() : item.employee.toLowerCase();
        const idField = currentView === 'invoices' ? item.invoiceId.toLowerCase() : item.payoutId.toLowerCase();

        const matchesSearch = nameField.includes(searchTerm) || idField.includes(searchTerm);
        const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
        const matchesMonth = !monthFilter || item.date.startsWith(monthFilter);

        return matchesSearch && matchesStatus && matchesMonth;
    });

    if (currentView === 'invoices') renderInvoicesTable(filteredData);
    else renderPayoutsTable(filteredData);
}


// --- Tab Switching Logic ---
window.switchView = function(view) {
    const invoicesTab = document.getElementById('invoices-tab');
    const payoutsTab = document.getElementById('payouts-tab');

    currentView = view;

    // Tab visuals
    if (view === 'invoices') {
        invoicesTab.classList.add('bg-custom-yellow', 'text-white', 'shadow-md');
        payoutsTab.classList.remove('bg-custom-yellow', 'text-white', 'shadow-md');
        updateTableHeaders('invoices');
        renderInvoicesTable(invoicesData);
    } else {
        payoutsTab.classList.add('bg-custom-yellow', 'text-white', 'shadow-md');
        invoicesTab.classList.remove('bg-custom-yellow', 'text-white', 'shadow-md');
        updateTableHeaders('payouts');
        renderPayoutsTable(payoutsData);
    }

    // Reapply filters after switching
    applyFilters();
};


// --- Initialization ---
function initializeFinancialsList() {
    switchView('invoices'); // Default view

    // Attach filter events
    document.getElementById('search-input').addEventListener('input', applyFilters);
    document.getElementById('status-filter').addEventListener('change', applyFilters);
    document.getElementById('month-filter').addEventListener('change', applyFilters);
}

window.onload = function() {
    loadNav();
    initializeFinancialsList();
};
