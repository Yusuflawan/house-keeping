
// --- Global Data (Ideally fetched from an API) ---
const invoicesData = [
    { invoiceId: 'INV-0105', bookingId: '2025-157', client: 'David L.', clientId: 'C-004', amount: 170.00, status: 'Paid', date: '2025-09-28' },
    { invoiceId: 'INV-0104', bookingId: '2025-156', client: 'Sarah K.', clientId: 'C-011', amount: 245.50, status: 'Pending', date: '2025-09-27' },
    { invoiceId: 'INV-0103', bookingId: '2025-155', client: 'Mark R.', clientId: 'C-008', amount: 80.00, status: 'Overdue', date: '2025-09-26' },
    { invoiceId: 'INV-0102', bookingId: '2025-154', client: 'David L.', clientId: 'C-004', amount: 120.00, status: 'Refunded', date: '2025-09-25' },
    { invoiceId: 'INV-0101', bookingId: '2025-153', client: 'Jane Doe', clientId: 'C-001', amount: 195.00, status: 'Paid', date: '2025-09-24' },
    { invoiceId: 'INV-0100', bookingId: '2025-152', client: 'Sarah K.', clientId: 'C-011', amount: 90.00, status: 'Paid', date: '2025-09-23' },
];

const payoutsData = [
    { payoutId: 'PAY-101', employee: 'Jane D.', employeeId: 'E-001', amount: 850.50, period: 'Sep 1 - Sep 15', status: 'Paid', date: '2025-09-16' },
    { payoutId: 'PAY-100', employee: 'Mike T.', employeeId: 'E-002', amount: 620.00, period: 'Sep 1 - Sep 15', status: 'Pending', date: '2025-09-16' },
    { payoutId: 'PAY-099', employee: 'Sarah L.', employeeId: 'E-003', amount: 910.75, period: 'Aug 16 - Aug 31', status: 'Paid', date: '2025-09-01' },
    { payoutId: 'PAY-098', employee: 'Jane D.', employeeId: 'E-001', amount: 700.00, period: 'Aug 1 - Aug 15', status: 'Failed', date: '2025-08-16' },
];

// --- Utility Functions ---

/**
 * Global function to handle various button actions.
 * @param {string} actionType - The type of action (e.g., 'export-data', 'view-details').
 * @param {string} [id=null] - The ID of the record being acted upon (e.g., Invoice ID).
 */
window.handleAction = function(actionType, id = null) {
    if (actionType === 'export-data') {
        alert('Action: Initiating CSV/Excel data export...');
    } else if (actionType === 'view-details' && id) {
        window.location.href = `invoice-details.html?id=${id}`;
    } else if (actionType === 'view-payout-details' && id) {
        alert(`Action: Redirecting to Payout Details for ${id}.`);
        // window.location.href = `payout-details.html?id=${id}`;
    } else if (actionType === 'refund' && id) {
        if (confirm(`Are you sure you want to issue a refund for Invoice ID ${id}?`)) {
            alert(`Action: Initiating refund process for ${id}.`);
        }
    } else if (actionType === 'process-payout' && id) {
        alert(`Action: Initiating payment processing for Payout ID ${id}.`);
    } else if (actionType === 'retry-payout' && id) {
        alert(`Action: Retrying failed Payout ID ${id}.`);
    } else if (actionType === 'send-receipt' && id) {
        alert(`Action: Sending receipt email for ID ${id}.`);
    } else if (actionType === 'send-reminder' && id) {
        alert(`Action: Sending payment reminder for ID ${id}.`);
    } else if (actionType === 'contact-client' && id) {
        alert(`Action: Displaying contact information for client associated with ID ${id}.`);
    } else {
        alert(`Action: Initiating ${actionType.toUpperCase()} for ID ${id || 'N/A'}.`);
    }
}


/**
 * Dynamically updates the table headers and title based on the active view.
 * @param {string} view - 'invoices' or 'payouts'.
 */
function updateTableHeaders(view) {
    const tableHead = document.getElementById('table-headers');
    const titleContainer = document.querySelector('.bg-white.rounded-xl.shadow-lg.p-6 h3');
    const count = view === 'invoices' ? invoicesData.length : payoutsData.length;
    const titleText = view === 'invoices' ? 'Invoices' : 'Payouts';
    
    // Update the title and count
    titleContainer.innerHTML = `${titleText} (<span id="count-display" class="font-bold text-custom-blue">${count}</span> Total)`;

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
    } else if (view === 'payouts') {
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

/**
 * Renders the employee payouts table rows based on the data.
 * @param {Array<Object>} data - The payouts data array.
 */
function renderPayoutsTable(data) {
    const tableBody = document.getElementById('financials-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-gray-500 text-lg">No payout records found.</td></tr>`;
        return;
    }

    data.forEach(payout => {
        let statusClass, actionButton;

        if (payout.status === 'Paid') {
            statusClass = 'bg-custom-green';
            actionButton = `<button onclick="handleAction('send-receipt', '${payout.payoutId}')" class="text-gray-600 hover:text-gray-800 font-semibold">
                                <i class="fa-solid fa-envelope mr-1"></i> Receipt
                            </button>`;
        } else if (payout.status === 'Pending') {
            statusClass = 'bg-custom-yellow';
            actionButton = `<button onclick="handleAction('process-payout', '${payout.payoutId}')" class="text-custom-blue hover:text-indigo-600 font-semibold">
                                <i class="fa-solid fa-cogs mr-1"></i> Process
                            </button>`;
        } else { // Failed
            statusClass = 'bg-custom-red';
            actionButton = `<button onclick="handleAction('retry-payout', '${payout.payoutId}')" class="text-custom-red hover:text-red-700 font-semibold">
                                <i class="fa-solid fa-redo mr-1"></i> Retry
                            </button>`;
        }

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${payout.payoutId}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                <a href="employee-profile.html?id=${payout.employeeId}" class="text-gray-700 hover:text-custom-blue">${payout.employee}</a>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-bold text-custom-blue">$${payout.amount.toFixed(2)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${payout.period}</td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass} text-white">
                    ${payout.status}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${payout.date}</td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button onclick="handleAction('view-payout-details', '${payout.payoutId}')" class="text-custom-blue hover:text-indigo-600 font-semibold">
                    View Details
                </button>
                ${actionButton}
            </td>
        `;
        tableBody.appendChild(row);
    });
}


/**
 * Renders the client invoices table rows based on the data.
 * @param {Array<Object>} data - The invoices data array.
 */
function renderInvoicesTable(data) {
    const tableBody = document.getElementById('financials-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 

    data.forEach(invoice => {
        let statusClass, actionButton;
        
        if (invoice.status === 'Paid') {
            statusClass = 'bg-custom-green';
            actionButton = `<button onclick="handleAction('refund', '${invoice.invoiceId}')" class="text-custom-red hover:text-red-700 font-semibold">
                                <i class="fa-solid fa-undo mr-1"></i> Refund
                            </button>`;
        } else if (invoice.status === 'Pending') {
            statusClass = 'bg-custom-yellow';
            actionButton = `<button onclick="handleAction('send-reminder', '${invoice.invoiceId}')" class="text-gray-600 hover:text-gray-800 font-semibold">
                                <i class="fa-solid fa-bell mr-1"></i> Remind
                            </button>`;
        } else if (invoice.status === 'Overdue') {
            statusClass = 'bg-custom-red';
            actionButton = `<button onclick="handleAction('contact-client', '${invoice.invoiceId}')" class="text-gray-600 hover:text-gray-800 font-semibold">
                                <i class="fa-solid fa-headset mr-1"></i> Contact
                            </button>`;
        } else { // Refunded
            statusClass = 'bg-gray-500';
            actionButton = '';
        }

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${invoice.invoiceId}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                <a href="booking-details.html?id=${invoice.bookingId}" class="text-custom-blue hover:underline">${invoice.bookingId}</a>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                <a href="client-profile.html?id=${invoice.clientId}" class="text-gray-700 hover:text-custom-blue">${invoice.client}</a>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-bold text-custom-green">$${invoice.amount.toFixed(2)}</td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass} text-white">
                    ${invoice.status}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${invoice.date}</td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button onclick="handleAction('view-details', '${invoice.invoiceId}')" class="text-custom-blue hover:text-indigo-600 font-semibold">
                    View Details
                </button>
                ${actionButton}
            </td>
        `;
        tableBody.appendChild(row);
    });
}


/**
 * Handles the tab switching logic: updates tab styles, headers, and table content.
 * @param {string} view - 'invoices' or 'payouts'.
 */
window.switchView = function(view) {
    const invoicesTab = document.getElementById('invoices-tab');
    const payoutsTab = document.getElementById('payouts-tab');
    const statusFilter = document.getElementById('status-filter');
    
    // Reset Filters to default for the new view
    statusFilter.value = 'All Statuses'; 
    // In a real application, you'd apply a function like applyFilters() here after changing the view.

    // Update Tab Styles
    if (view === 'invoices') {
        invoicesTab.classList.add('bg-custom-yellow', 'text-white', 'shadow-md', 'hover:bg-yellow-600');
        invoicesTab.classList.remove('text-gray-700', 'hover:bg-gray-100');
        payoutsTab.classList.remove('bg-custom-yellow', 'text-white', 'shadow-md', 'hover:bg-yellow-600');
        payoutsTab.classList.add('text-gray-700', 'hover:bg-gray-100');
        
        // Render Invoices
        updateTableHeaders('invoices');
        renderInvoicesTable(invoicesData);

    } else if (view === 'payouts') {
        payoutsTab.classList.add('bg-custom-yellow', 'text-white', 'shadow-md', 'hover:bg-yellow-600');
        payoutsTab.classList.remove('text-gray-700', 'hover:bg-gray-100');
        invoicesTab.classList.remove('bg-custom-yellow', 'text-white', 'shadow-md', 'hover:bg-yellow-600');
        invoicesTab.classList.add('text-gray-700', 'hover:bg-gray-100');
        
        // Render Payouts
        updateTableHeaders('payouts');
        renderPayoutsTable(payoutsData);
    }
}


// --- Initialization ---
/**
 * Executes the necessary functions on page load.
 */
function initializeFinancialsList() {
    // Load with Invoices view active by default
    switchView('invoices'); 
}

// Execute on page load
window.onload = function () {
    loadNav(); 
    initializeFinancialsList();
};
