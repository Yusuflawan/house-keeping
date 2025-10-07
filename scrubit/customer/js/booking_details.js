/**
 * booking_details.js
 * Logic to fetch and display client booking details for ScrubIt.
 */

// --- 1. MOCK DATA SIMULATION ---
// This object simulates the data you would receive from an API call
// after the client has booked the service.
const mockBookingData = {
    bookingId: 'SCRUB-12345',
    status: 'Confirmed', // 'Confirmed', 'Completed', 'Cancelled', 'In Progress'
    serviceType: 'Deep Clean',
    bedrooms: '3 Bedrooms',
    bathrooms: '2 Bathrooms',
    duration: 4.5, // in hours
    price: 135.00, // in GBP (£)
    address: 'Flat 4, The Mews, 17 London Road',
    city: 'London',
    state: 'Greater London',
    zip: 'SW1A 0AA',
    serviceDate: '2025-10-15',
    serviceTimeSlot: '8:00 AM - 12:00 PM',
    extras: ['Oven Cleaning', 'Interior Windows'],
    productPreference: 'ScrubIt', // 'ScrubIt' or 'Client'
    accessMethod: 'Lockbox/Code',
    accessDetails: 'Lockbox on the railing by the main entrance. Code is 4590#',
    additionalInfo: 'Please be extra careful around the vintage rug in the living room. Our cat, Mittens, will be sleeping in the study, please leave the door shut.',
    // Cleaner Data - This will be dynamic based on assignment
    cleaner: {
        assigned: true,
        name: 'Eliza P.',
        photoUrl: 'https://i.pravatar.cc/100?img=17', // Placeholder/Avatar URL
        rating: 4.9,
        bookingsCompleted: 215,
        email: 'eliza.p@scrubit.com', // Masked email for security
        phone: '07700 900XXX' // Masked phone for security
    }
};

// --- 2. HELPER FUNCTIONS ---

/**
 * Maps a booking status to the appropriate Tailwind classes for the badge.
 * @param {string} status 
 * @returns {{text: string, bg: string}}
 */
function getStatusBadgeClasses(status) {
    switch (status) {
        case 'Confirmed':
        case 'In Progress':
            return { text: 'text-custom-green', bg: 'bg-green-100' };
        case 'Completed':
            return { text: 'text-custom-blue', bg: 'bg-blue-100' };
        case 'Cancelled':
            return { text: 'text-red-700', bg: 'bg-red-100' };
        default:
            return { text: 'text-gray-700', bg: 'bg-gray-200' };
    }
}

/**
 * Formats the date string into a more readable format (e.g., Tuesday, 15 October 2025).
 * @param {string} dateString 
 * @returns {string}
 */
function formatDate(dateString) {
    if (!dateString) return 'TBC';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

// --- 3. MAIN DISPLAY LOGIC ---

/**
 * Fetches the booking data (simulated by a timeout) and populates the HTML.
 */
function displayBookingDetails(data) {
    // Hide loading overlay
    document.getElementById('loading-overlay').style.display = 'none';

    // --- Core Booking Details ---
    document.getElementById('booking-id').textContent = data.bookingId;
    
    // Status Badge
    const badge = document.getElementById('booking-status-badge');
    const badgeClasses = getStatusBadgeClasses(data.status);
    badge.textContent = data.status.toUpperCase();
    badge.classList.add(badgeClasses.text, badgeClasses.bg);

    // Date/Time Header
    const formattedDate = formatDate(data.serviceDate);
    document.getElementById('summary-datetime').innerHTML = `${data.serviceTimeSlot}<br><span class="text-sm font-medium text-gray-500">${formattedDate}</span>`;

    // Service & Location
    document.getElementById('detail-service-type').textContent = data.serviceType;
    document.getElementById('detail-property-size').textContent = `${data.bedrooms} / ${data.bathrooms}`;
    document.getElementById('detail-duration').textContent = `${data.duration.toFixed(1)} Hours`;
    document.getElementById('detail-price').textContent = `£${data.price.toFixed(2)}`;
    document.getElementById('detail-address-full').textContent = `${data.address}, ${data.city}, ${data.zip}`;

    // Logistics
    document.getElementById('detail-products').textContent = data.productPreference === 'ScrubIt' ? 'ScrubIt Provides (Eco-Friendly)' : 'Client Provides (Your Supplies)';
    
    const extrasList = data.extras.length > 0 ? data.extras.join(', ') : 'None selected.';
    document.getElementById('detail-extras').textContent = extrasList;
    
    document.getElementById('detail-access-method').textContent = data.accessMethod;
    document.getElementById('detail-access-details').textContent = data.accessDetails || 'No specific details provided.';

    document.getElementById('detail-additional-info').textContent = data.additionalInfo || 'No additional notes.';


    // --- Cleaner/Team Details ---
    const cleanerInfo = data.cleaner;
    const infoContainer = document.getElementById('cleaner-info-container');
    const unassignedContainer = document.getElementById('cleaner-unassigned-container');

    if (cleanerInfo.assigned) {
        unassignedContainer.style.display = 'none';
        infoContainer.style.display = 'flex';
        document.getElementById('cleaner-photo').src = cleanerInfo.photoUrl;
        document.getElementById('cleaner-name').textContent = cleanerInfo.name;
        document.getElementById('cleaner-rating').textContent = cleanerInfo.rating.toFixed(1);
        // Note: The total booking count is a nice-to-have but only used in the JS logic for now.
        // document.getElementById('cleaner-bookings').textContent = cleanerInfo.bookingsCompleted; 
        document.getElementById('cleaner-email').textContent = cleanerInfo.email;
        document.getElementById('cleaner-phone').textContent = cleanerInfo.phone;
    } else {
        infoContainer.style.display = 'none';
        unassignedContainer.style.display = 'block';
    }

    // --- Action Buttons Logic (Basic Placeholder) ---
    const isCompletedOrCancelled = data.status === 'Completed' || data.status === 'Cancelled';
    document.getElementById('reschedule-btn').disabled = isCompletedOrCancelled;
    document.getElementById('cancel-btn').disabled = isCompletedOrCancelled;

    // Optional: Add listeners for buttons
    document.getElementById('reschedule-btn').addEventListener('click', () => alert('Navigating to Reschedule page for ' + data.bookingId));
    document.getElementById('cancel-btn').addEventListener('click', () => alert('Confirming cancellation for ' + data.bookingId));
}


// --- 4. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // Show loading state initially
    document.getElementById('loading-overlay').style.display = 'flex';
    
    // Simulate API call delay (e.g., 1.5 seconds)
    setTimeout(() => {
        // In a real application, you would replace this with an actual fetch:
        // fetch('/api/booking/SCRUB-12345')
        //     .then(res => res.json())
        //     .then(data => displayBookingDetails(data));
        
        displayBookingDetails(mockBookingData);
    }, 1500); 
});