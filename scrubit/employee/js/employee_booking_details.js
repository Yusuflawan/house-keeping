/**
 * employee_booking_details.js
 * Logic to fetch and display booking details for the assigned employee.
 */

// --- 1. MOCK DATA SIMULATION ---
const mockEmployeeBookingData = {
    bookingId: 'SCRUB-12345',
    status: 'Upcoming', // Default value
    serviceType: 'Deep Clean',
    bedrooms: '3 Bedrooms',
    bathrooms: '2 Bathrooms',
    duration: 4.5,
    price: 135.0,
    address: 'Flat 4, The Mews, 17 London Road',
    city: 'London',
    zip: 'SW1A 0AA',
    serviceDate: '2025-10-15',
    serviceTimeSlot: '8:00 AM - 12:00 PM',
    extras: ['Oven Cleaning', 'Interior Windows'],
    productPreference: 'ScrubIt',
    accessMethod: 'Lockbox/Code',
    accessDetails: 'Lockbox on the railing by the main entrance. Code is 4590#',
    additionalInfo:
      'Be careful around the vintage rug. The cat will be sleeping in the study, please keep the door shut.',
    client: {
      name: 'Mia Thompson',
      photoUrl: 'https://i.pravatar.cc/100?img=14',
      email: 'mia.t@example.com',
      phone: '07700 912XXX'
    },
    // ADDED: Mock Review Data to support 'Completed' state
    clientReview: {
        rating: 4.0,
        text: "Great job! The house was spotless and the team was very professional."
    }
  };
  
// --- 2. HELPER FUNCTIONS ---

// Extracts query parameters from URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      id: params.get('id') || mockEmployeeBookingData.bookingId,
      status: params.get('status') || mockEmployeeBookingData.status
    };
}

function getStatusBadgeClasses(status) {
    switch (status) {
      case 'Available':
        return { text: 'text-blue-700', bg: 'bg-blue-100' };
      case 'Upcoming':
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

function formatDate(dateString) {
    if (!dateString) return 'TBC';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

// --- 3. MODAL + TOAST LOGIC ---

function showModal(action, confirmCallback) {
    const modal = document.getElementById('confirmation-modal');
    const messageEl = document.getElementById('modal-message');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    messageEl.textContent = `Are you sure you want to ${action.toLowerCase()} this job?`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    confirmBtn.onclick = () => {
      confirmCallback();
      closeModal();
      showToast(`Job ${action.toLowerCase()}ed successfully.`);
    };
}

function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function showToast(message) {
    const toast = document.getElementById('success-toast');
    toast.textContent = message;
    toast.classList.remove('hidden', 'opacity-0');
    toast.classList.add('opacity-100');

    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.classList.add('hidden'), 500);
    }, 2000);
}

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<i class="fa-solid fa-star ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}"></i>`;
    }
    return stars;
}


// --- 4. MAIN DISPLAY LOGIC ---

function displayEmployeeBookingDetails(data) {
    document.getElementById('loading-overlay').style.display = 'none';

    // Updated IDs to match employee_booking_details.html
    document.getElementById('job-id').textContent = data.bookingId;
    const badge = document.getElementById('job-status-badge');
    const badgeClasses = getStatusBadgeClasses(data.status);
    badge.textContent = data.status.toUpperCase();
    badge.classList.add(badgeClasses.text, badgeClasses.bg);

    const formattedDate = formatDate(data.serviceDate);
    document.getElementById('summary-datetime').innerHTML = `
      ${data.serviceTimeSlot}<br>
      <span class="text-sm font-medium text-gray-500">${formattedDate}</span>
    `;

    // Job Details
    document.getElementById('detail-service-type').textContent = data.serviceType;
    document.getElementById('detail-property-size').textContent = `${data.bedrooms} / ${data.bathrooms}`;
    document.getElementById('detail-duration').textContent = `${data.duration.toFixed(1)} Hours`;
    document.getElementById('detail-earnings').textContent = `£${data.price.toFixed(2)}`;
    document.getElementById('detail-address-full').textContent = `${data.address}, ${data.city}, ${data.zip}`;
    document.getElementById('detail-products').textContent =
      data.productPreference === 'ScrubIt'
        ? 'ScrubIt Provides (Eco-Friendly)'
        : 'Client Provides (Own Supplies)';
    document.getElementById('detail-extras').textContent = data.extras.join(', ') || 'None selected.';
    document.getElementById('detail-access-method').textContent = data.accessMethod;
    document.getElementById('detail-access-details').textContent = data.accessDetails || 'No details provided.';
    document.getElementById('detail-additional-info').textContent = data.additionalInfo || 'None';

    // Client Info (commented since employee version hides this)
    // const client = data.client;
    // document.getElementById('client-photo').src = client.photoUrl;
    // document.getElementById('client-name').textContent = client.name;
    // document.getElementById('client-email').textContent = client.email;
    // document.getElementById('client-phone').textContent = client.phone;

    // --- Action Buttons ---
    const actionsContainer = document.getElementById('action-buttons');
    const ratingContainer = document.getElementById('rating-container'); // NEW: Get reference to static rating card
    
    // NEW: Reset/Hide the rating container initially (it's inside the card)
    if (ratingContainer) {
        ratingContainer.classList.add('hidden');
    }
    
    actionsContainer.innerHTML = '';

    if (data.status === 'Available') {
      actionsContainer.innerHTML = `
        <button id="accept-btn" class="px-4 py-2 bg-green-600 text-white rounded-lg">Accept Job</button>
        <button id="decline-btn" class="px-4 py-2 bg-red-600 text-white rounded-lg">Decline</button>`;
    } else if (data.status === 'Upcoming') {
      actionsContainer.innerHTML = `
        <button id="start-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Start Job</button>
        <button id="cancel-btn" class="px-4 py-2 bg-red-600 text-white rounded-lg">Cancel</button>`;
    } else if (data.status === 'In Progress') {
      actionsContainer.innerHTML = `
        <button id="complete-btn" class="px-4 py-2 bg-green-600 text-white rounded-lg">Mark as Completed</button>`;
    } else if (data.status === 'Completed') {
        const review = data.clientReview || { rating: 4.0, text: "No review provided yet." };
        
        // 1. Unhide and populate the static rating container (INSIDE the card)
        if (ratingContainer) {
            ratingContainer.classList.remove('hidden');
            
            // Populate the stars and the rating text in the correct location
            const starDisplayEl = ratingContainer.querySelector('.flex.items-center.space-x-2.mb-2');
            if (starDisplayEl) {
                starDisplayEl.innerHTML = `
                    ${generateStarRating(review.rating)}
                    <span id="client-rating" class="text-lg font-semibold text-gray-800">${review.rating.toFixed(1)}</span>
                    <span class="text-sm text-gray-500">/5</span>
                `;
            }
            document.getElementById('client-review').textContent = `"${review.text}"`;
        }
        
        // 2. Set the content of the actionsContainer (OUTSIDE the card) to the completion message only
        actionsContainer.innerHTML = `
          <div class="text-green-700 font-semibold text-lg py-2">Job Completed successfully ✅</div>
        `;
    }
      

    // --- Button Event Listeners ---
    document.getElementById('accept-btn')?.addEventListener('click', () =>
      showModal('Accept', () => console.log('Accepted job'))
    );
    document.getElementById('decline-btn')?.addEventListener('click', () =>
      showModal('Decline', () => console.log('Declined job'))
    );
    document.getElementById('start-btn')?.addEventListener('click', () =>
      showModal('Start', () => console.log('Started job'))
    );
    document.getElementById('cancel-btn')?.addEventListener('click', () =>
      showModal('Cancel', () => console.log('Cancelled job'))
    );
    document.getElementById('complete-btn')?.addEventListener('click', () =>
      showModal('Complete', () => console.log('Completed job'))
    );
}

// --- 5. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const params = getQueryParams();
    document.getElementById('loading-overlay').style.display = 'flex';

    // Merge mock data with query params
    const dataToDisplay = {
      ...mockEmployeeBookingData,
      bookingId: params.id,
      status: params.status
    };

    // Simulate loading delay
    setTimeout(() => displayEmployeeBookingDetails(dataToDisplay), 1200);
});