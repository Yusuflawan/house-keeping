// Placeholder Client Data (Simulating a data fetch)
const CLIENT_DATA = {
    id: 'C-001',
    firstName: 'Alice',
    lastName: 'Johnson',
    initials: 'AJ',
    email: 'alice.j@email.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Apartment 4B, Cityville, CA 90210',
    createdDate: '2023-01-15',
    totalSpent: 4250.00,
    vipStatus: 'Yes',
    paymentMethod: 'Visa ending in **** 4242 (Expires 12/26)',
    recentBookings: [
        { date: '2025-10-02', service: 'Deep Clean', cost: 150, status: 'Completed' },
        { date: '2025-09-15', service: 'Standard Clean', cost: 80, status: 'Completed' },
        { date: '2025-08-30', service: 'Window Clean', cost: 95, status: 'Cancelled' },
        { date: '2025-08-01', service: 'Deep Clean', cost: 160, status: 'Completed' },
        { date: '2025-07-15', service: 'Standard Clean', cost: 80, status: 'Completed' },
    ],
    // ADDED INVOICE DATA
    recentInvoices: [
        { id: 'INV-1005', date: '2025-10-02', amount: 150.00, status: 'Paid' },
        { id: 'INV-1004', date: '2025-09-15', amount: 80.00, status: 'Paid' },
        { id: 'INV-1003', date: '2025-08-30', amount: 95.00, status: 'Canceled' },
        { id: 'INV-1002', date: '2025-08-01', amount: 160.00, status: 'Paid' },
        { id: 'INV-1001', date: '2025-07-15', amount: 80.00, status: 'Overdue' },
    ]
};

/**
 * Helper function to generate status badge styles.
 * @param {string} status - The invoice status.
 * @returns {string} Tailwind classes for the badge.
 */
function getStatusBadge(status) {
    switch (status) {
        case 'Paid':
            return '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-custom-green/20 text-custom-green">Paid</span>';
        case 'Canceled':
            return '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-600">Canceled</span>';
        case 'Overdue':
            return '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-custom-red/20 text-custom-red">Overdue</span>';
        default:
            return status;
    }
}


/**
 * Populates the static elements of the client profile with data.
 * @param {object} clientData - The client object.
 */
function renderClientProfile(clientData) {
    const fullName = `${clientData.firstName} ${clientData.lastName}`;
    
    // Header Section
    document.getElementById('client-initials').textContent = clientData.initials;
    document.getElementById('client-full-name').textContent = fullName;
    document.getElementById('client-id').textContent = clientData.id;
    document.getElementById('client-vip-status').textContent = clientData.vipStatus;
    document.getElementById('profile-breadcrumb-name').textContent = `${fullName} (${clientData.id})`;
    
    // Account Details Tab
    document.getElementById('client-email').textContent = clientData.email;
    document.getElementById('client-phone').textContent = clientData.phone;
    document.getElementById('client-address').textContent = clientData.address;
    document.getElementById('client-created-date').textContent = clientData.createdDate;
    document.getElementById('client-total-spent').textContent = `$${clientData.totalSpent.toFixed(2)}`;
    
    // Payments Tab
    document.getElementById('client-payment-method').textContent = clientData.paymentMethod;
    
    // Render Invoice Table
    const invoiceTableBody = document.getElementById('invoice-history-table-body');
    if (invoiceTableBody) {
        invoiceTableBody.innerHTML = clientData.recentInvoices.map(invoice => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-custom-blue hover:text-indigo-600"><a href="#">${invoice.id}</a></td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoice.date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${invoice.amount.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${getStatusBadge(invoice.status)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-gray-500 hover:text-gray-700 mr-2"><i class="fa-solid fa-download"></i></button>
                    <button class="text-gray-500 hover:text-gray-700"><i class="fa-solid fa-eye"></i></button>
                </td>
            </tr>
        `).join('');
    }

    // Booking History Tab
    const bookingsList = document.getElementById('client-booking-history-list');
    if (bookingsList) {
        bookingsList.innerHTML = clientData.recentBookings.map(booking => 
            `<li>#${booking.date.replace(/-/g, '-')}: ${booking.service} ($${booking.cost}) - ${booking.status}</li>`
        ).join('');
    }
}


/**
 * Toggles the visibility of profile tab content and updates the button's active state.
 * @param {string} tabName - The name of the tab to activate ('account', 'bookings', or 'payments').
 */
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('bg-custom-blue', 'text-white', 'shadow-md');
        btn.classList.add('text-gray-600', 'bg-white');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    const activeBtn = document.getElementById(`tab-${tabName}`);
    const activeContent = document.getElementById(`content-${tabName}`);
    
    if (activeBtn) {
        activeBtn.classList.add('bg-custom-blue', 'text-white', 'shadow-md');
        activeBtn.classList.remove('text-gray-600', 'bg-white');
    }
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
};

/**
 * Initializes page-specific logic once the DOM is ready.
 */
function initializeClientProfile() {
    // 1. Populate the HTML elements with placeholder data
    renderClientProfile(CLIENT_DATA);
    
    // 2. Set the default active tab
    // We set 'account' as the default view.
    window.switchTab('account'); 
}


// --- Execute page-specific logic once the DOM is ready ---
document.addEventListener('DOMContentLoaded', initializeClientProfile);