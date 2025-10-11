// --- Mock Data ---
const mockInvoices = {
    'INV-0105': {
        id: 'INV-0105',
        status: 'Paid',
        total: 170.00,
        client: { name: 'David L.', id: 'C-004' },
        bookingRef: '2025-157',
        dueDate: '2025-09-28',
        paymentMethod: 'Visa ending in **** 4242',
        lineItems: [
            { desc: 'Standard 3-Room Cleaning Service', qty: 1, unitPrice: 150.00 },
            { desc: 'Add-on: Interior Oven Cleaning', qty: 1, unitPrice: 40.00 },
            { desc: 'Discount: First-Time Customer (-10%)', qty: 1, unitPrice: -19.00 },
        ],
        activity: [
            { date: '2025-09-28 10:30', event: 'Payment Processed successfully ($170.00).' },
            { date: '2025-09-27 15:45', event: 'Invoice issued and sent to client.' },
            { date: '2025-09-27 15:40', event: 'Invoice created based on Booking 2025-157.' },
        ]
    },
    'INV-0103': {
        id: 'INV-0103',
        status: 'Overdue',
        total: 80.00,
        client: { name: 'Mark R.', id: 'C-008' },
        bookingRef: '2025-155',
        dueDate: '2025-09-26',
        paymentMethod: 'Pending (No method on file)',
        lineItems: [
            { desc: 'Studio Apartment Deep Clean', qty: 1, unitPrice: 75.00 },
            { desc: 'Travel Fee', qty: 1, unitPrice: 10.00 },
        ],
        activity: [
            { date: '2025-09-27 09:00', event: 'Status changed to Overdue (1 day past due).' },
            { date: '2025-09-26 18:00', event: 'Payment reminder sent to client.' },
            { date: '2025-09-26 15:40', event: 'Invoice issued and sent to client.' },
        ]
    }
};

// --- Core Functions ---

/**
 * Extracts the invoice ID from the URL.
 */
function getInvoiceIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    // Use a default ID if none is provided for easy testing
    return params.get('id') || 'INV-0105'; 
}

/**
 * Renders all data sections for the given invoice.
 */
function renderInvoiceDetails(invoice) {
    if (!invoice) {
        document.getElementById('invoice-id-display').textContent = 'Invoice Not Found';
        return;
    }

    // 1. Summary Header
    document.getElementById('invoice-id-display').textContent = invoice.id;
    document.getElementById('invoice-total-amount').textContent = `$${invoice.total.toFixed(2)}`;
    
    const statusBadge = document.getElementById('invoice-status-badge');
    statusBadge.textContent = invoice.status;
    statusBadge.className = statusBadge.className.replace(/bg-custom-\w+/, ''); // Reset color
    
    // Status-based logic
    const refundButton = document.getElementById('refund-button');
    if (invoice.status === 'Paid') {
        statusBadge.classList.add('bg-custom-green');
        refundButton.style.display = 'inline-flex'; // Show refund button
        refundButton.disabled = false;
    } else if (invoice.status === 'Pending') {
        statusBadge.classList.add('bg-custom-yellow');
        refundButton.style.display = 'none'; // Hide refund button
        // Optional: Add a 'Mark Paid' button logic here
    } else if (invoice.status === 'Overdue') {
        statusBadge.classList.add('bg-custom-red');
        refundButton.style.display = 'none'; // Hide refund button
    }

    // 2. Client & Booking Context
    document.getElementById('client-name').innerHTML = `<a href="client-profile.html?id=${invoice.client.id}" class="text-custom-blue hover:underline">${invoice.client.name}</a>`;
    document.getElementById('booking-ref').innerHTML = `<a href="booking-details.html?id=${invoice.bookingRef}" class="text-custom-blue hover:underline">${invoice.bookingRef}</a>`;
    document.getElementById('due-date').textContent = invoice.dueDate;
    document.getElementById('payment-method').textContent = invoice.paymentMethod;

    // 3. Activity Log
    const activityLog = document.getElementById('activity-log');
    activityLog.innerHTML = '';
    invoice.activity.forEach(item => {
        const li = document.createElement('li');
        li.className = 'border-l-2 border-gray-200 pl-3 text-gray-700';
        li.innerHTML = `<span class="text-xs text-gray-400 block">${item.date}</span> ${item.event}`;
        activityLog.appendChild(li);
    });

    // 4. Line Items Table
    renderLineItems(invoice.lineItems);
}

/**
 * Renders the service line items and calculates totals.
 */
function renderLineItems(items) {
    const tableBody = document.getElementById('line-items-body');
    const subtotalCell = document.getElementById('subtotal');
    const taxCell = document.getElementById('tax-amount');
    const finalTotalCell = document.getElementById('final-total');
    
    tableBody.innerHTML = '';
    let calculatedSubtotal = 0;
    const taxRate = 0.075; // 7.5%

    items.forEach(item => {
        const total = item.qty * item.unitPrice;
        calculatedSubtotal += total;

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        row.innerHTML = `
            <td class="px-4 py-3 whitespace-normal text-sm font-medium text-gray-900">${item.desc}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-700">${item.qty}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">$${item.unitPrice.toFixed(2)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">$${total.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });

    const calculatedTax = calculatedSubtotal * taxRate;
    const calculatedTotal = calculatedSubtotal + calculatedTax;

    subtotalCell.textContent = `$${calculatedSubtotal.toFixed(2)}`;
    taxCell.textContent = `$${calculatedTax.toFixed(2)}`;
    finalTotalCell.textContent = `$${calculatedTotal.toFixed(2)}`;
}


/**
 * Global function to handle button actions (Print, Send, Refund, etc.)
 */
function handleAction(actionType) {
    const invoiceId = document.getElementById('invoice-id-display').textContent;
    
    if (actionType === 'print') {
        alert(`Action: Generating print view for Invoice ${invoiceId}.`);
        // window.print();
    } else if (actionType === 'send-receipt') {
        alert(`Action: Sending receipt email for Invoice ${invoiceId}.`);
    } else if (actionType === 'refund') {
        if (confirm(`Are you sure you want to process a full refund for Invoice ${invoiceId}?`)) {
            alert(`Action: Initiating refund process.`);
        }
    } else if (actionType === 'mark-paid') {
        alert(`Action: Marking Invoice ${invoiceId} as Paid.`);
    }
}

// --- Initialization ---

// Execute on page load
window.onload = function () {
    // loadNav() and setupNavInteractions() are to be in sidebar.js,
    // but we call loadNav() here to inject the sidebar.
    loadNav(); 
    
    const invoiceId = getInvoiceIdFromUrl();
    const invoiceData = mockInvoices[invoiceId];
    renderInvoiceDetails(invoiceData);
};