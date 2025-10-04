// --- Placeholder Booking Data (Simulates API/DB Fetch) ---
const bookingData = {
    id: '2025-157',
    client: 'David L.',
    clientId: 'C-004',
    employee: 'Jane D.',
    employeeId: 'E-001',
    status: 'In Progress',
    // Must match one of the .bg-custom-* classes in the HTML <style> block
    statusClass: 'bg-custom-purple', 
    service: 'Deep Clean (6hr)',
    date: '2025-10-08',
    time: '11:30',
    address: '456 Oak Avenue, Unit 3A, Cityville, CA 90210',
    clientEmail: 'david.l@email.com',
    clientPhone: '(555) 987-6543',
    clientNotes: 'Please ensure extra attention is paid to the kitchen oven. Keys are under the doormat.',
    fee: 180.00,
    discount: 10.00,
    total: 170.00,
    paymentStatus: 'Paid (Card **** 4242)'
};

// --- Action Handler (Handles button clicks like Reschedule/Cancel) ---
function handleAction(actionType) {
    alert(`Booking ID ${bookingData.id}: Initiating action: ${actionType.toUpperCase()}. This would open a modal for confirmation or a new form.`);
}

// --- Dynamic Rendering of Booking Data ---
function renderBookingData() {
    document.getElementById('booking-id-breadcrumb').textContent = bookingData.id;
    document.getElementById('booking-id-header').textContent = bookingData.id;
    
    // Status Badge
    const statusBadge = document.getElementById('status-badge');
    statusBadge.textContent = bookingData.status;
    // Remove all custom color classes to apply the correct one
    statusBadge.classList.forEach(className => {
        if (className.startsWith('bg-custom-')) {
            statusBadge.classList.remove(className);
        }
    });
    statusBadge.classList.add(bookingData.statusClass);

    // Service Details
    document.getElementById('service-type').textContent = bookingData.service;
    document.getElementById('scheduled-datetime').textContent = `${bookingData.date} at ${bookingData.time}`;
    document.getElementById('service-address').textContent = bookingData.address;
    document.getElementById('client-notes').textContent = bookingData.clientNotes;
    
    // Client/Employee Info
    document.getElementById('client-name').textContent = `${bookingData.client} (${bookingData.clientId})`;
    document.getElementById('employee-name').textContent = `${bookingData.employee} (${bookingData.employeeId})`;

    // Financials
    document.getElementById('service-fee').textContent = `$${bookingData.fee.toFixed(2)}`;
    document.getElementById('discount').textContent = `-$${bookingData.discount.toFixed(2)}`;
    document.getElementById('total-charge').textContent = `$${bookingData.total.toFixed(2)}`;
    document.getElementById('payment-status').textContent = bookingData.paymentStatus;
}

// --- Custom Navigation Highlight Logic for Detail Pages ---
function highlightBookingsParent() {
    const viewAllLink = document.querySelector('a[href="bookings-list.html"]');
    const parentButton = document.getElementById('bookings-parent-nav');
    const parentArrow = document.getElementById('bookings-arrow');
    const parentMenu = document.getElementById('bookings-menu');

    // Active classes for the main parent button
    const activeClasses = ['text-white', 'bg-custom-blue', 'shadow-md', 'font-bold', 'hover:!bg-custom-blue', 'hover:!text-white', 'hover:!shadow-md'];
    // Active classes for the submenu link
    const submenuActiveClasses = ['text-custom-blue', 'font-bold', 'bg-indigo-50', 'hover:bg-indigo-100'];

    // 1. Highlight the 'View All' link 
    if (viewAllLink) {
        viewAllLink.classList.remove('text-gray-600', 'hover:bg-gray-50'); 
        viewAllLink.classList.add(...submenuActiveClasses);
    }
    
    // 2. Highlight the 'Bookings' parent button and ensure menu is open
    if (parentButton && parentArrow && parentMenu) {
        parentButton.classList.remove('text-gray-700', 'hover:bg-gray-100'); 
        parentButton.classList.add(...activeClasses);
        
        parentMenu.classList.remove('hidden');
        parentArrow.classList.add('rotate-180');
        parentArrow.classList.remove('rotate-0');
    }
}


// Execute page-specific logic once the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // 1. Render all booking data into the HTML elements
    renderBookingData();
    
    highlightBookingsParent(); 
});