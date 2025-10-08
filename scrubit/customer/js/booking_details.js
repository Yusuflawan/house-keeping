/**
 * booking_details.js
 * Enhanced logic for displaying client booking details with dynamic states + review modal + URL-driven testing.
 */

// --- 0. URL PARAM HELPER ---
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// --- 1. MOCK DATA SIMULATION ---
const mockBookingData = {
    bookingId: "SCRUB-12345",
    // We'll add mock review data here to test the display logic on page load
    status: getQueryParam("state") || "Completed", // dynamic from URL ?state=Completed
    hasReview: getQueryParam("review") === "true", // dynamic from URL ?review=true
    hasPaid: getQueryParam("paid") !== "false", // dynamic from URL ?paid=false
    reviewRating: 4.5, // Mock initial review data
    reviewText: "Amazing experience, will book again!", // Mock initial review data
    serviceType: "Deep Clean",
    bedrooms: "3 Bedrooms",
    bathrooms: "2 Bathrooms",
    duration: 4.5,
    price: 135.0,
    address: "Flat 4, The Mews, 17 London Road",
    city: "London",
    zip: "SW1A 0AA",
    serviceDate: "2025-10-15",
    serviceTimeSlot: "8:00 AM - 12:00 PM",
    extras: ["Oven Cleaning", "Interior Windows"],
    productPreference: "ScrubIt",
    accessMethod: "Lockbox/Code",
    accessDetails: "Lockbox on the railing by the main entrance. Code is 4590#",
    additionalInfo:
        "Be careful around the vintage rug. The cat will be sleeping in the study — please keep the door shut.",
    cleaner: {
        assigned: true,
        name: "Eliza P.",
        photoUrl: "https://i.pravatar.cc/100?img=17",
        rating: 4.9,
        bookingsCompleted: 215,
        email: "eliza.p@scrubit.com",
        phone: "07700 900XXX",
    },
};

// --- 2. HELPERS ---
function getStatusBadgeClasses(status) {
    switch (status) {
        case "Awaiting Payment": return { text: "text-yellow-700", bg: "bg-yellow-100" };
        case "Pending Confirmation": return { text: "text-gray-700", bg: "bg-gray-200" };
        case "Confirmed": return { text: "text-green-700", bg: "bg-green-100" };
        case "In Progress": return { text: "text-blue-700", bg: "bg-blue-100" };
        case "Completed": return { text: "text-custom-blue", bg: "bg-blue-100" };
        case "Cancelled": return { text: "text-red-700", bg: "bg-red-100" };
        case "Refunded": return { text: "text-teal-700", bg: "bg-teal-100" };
        default: return { text: "text-gray-700", bg: "bg-gray-200" };
    }
}

function formatDate(dateString) {
    if (!dateString) return "TBC";
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
}

function showModal(message, confirmCallback) {
    const modal = document.getElementById("confirmation-modal");
    const msg = document.getElementById("modal-message");
    const confirmBtn = document.getElementById("modal-confirm-btn");
    msg.textContent = message;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    confirmBtn.onclick = () => {
        confirmCallback();
        closeModal();
        showToast("Action completed successfully.");
    };
}

function closeModal() {
    const modal = document.getElementById("confirmation-modal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

function showToast(message) {
    const toast = document.getElementById("success-toast");
    toast.textContent = message;
    toast.classList.remove("hidden", "opacity-0");
    toast.classList.add("opacity-100");

    setTimeout(() => {
        toast.classList.add("opacity-0");
        setTimeout(() => toast.classList.add("hidden"), 500);
    }, 2000);
}

// --- NEW HELPER: DISPLAY REVIEW IN CARD ---
function displayReviewInCard(data) {
    const reviewContainer = document.getElementById("rating-container");
    const ratingEl = document.getElementById("client-rating");
    const reviewEl = document.getElementById("client-review");
    
    // Check if the booking is completed AND has a review
    if (data.status === "Completed" && data.hasReview) {
        // Assume data.reviewRating and data.reviewText hold the review details
        const rating = data.reviewRating || 5; // Use default if missing
        const review = data.reviewText || "No review text provided.";

        // Round rating to one decimal place for display
        ratingEl.textContent = rating.toFixed(1);
        reviewEl.textContent = `"${review}"`;
        reviewContainer.classList.remove("hidden");
    } else {
        reviewContainer.classList.add("hidden");
    }
}

// --- 3. REVIEW MODAL ---
function openReviewModal(bookingData) {
    const existing = document.getElementById("review-modal");
    if (existing) existing.remove();

    const modalHTML = `
      <div id="review-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-xl shadow-2xl w-11/12 max-w-md">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Leave a Review</h3>
          <div id="star-container" class="flex justify-center mb-4 space-x-1">
            ${[1, 2, 3, 4, 5].map(i => `<i class="fa-star fa-regular text-2xl text-gray-400 cursor-pointer" data-star="${i}"></i>`).join("")}
          </div>
          <textarea id="review-text" rows="4" class="w-full p-2 border rounded-lg text-sm mb-4" placeholder="Write your feedback..."></textarea>
          <div class="flex justify-end space-x-3">
            <button id="cancel-review" class="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
            <button id="submit-review" class="px-4 py-2 bg-green-600 text-white rounded-lg">Submit</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    let selectedRating = 0;
    const stars = document.querySelectorAll("#star-container i");
    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.getAttribute("data-star"));
            stars.forEach(s => s.classList.remove("fa-solid", "text-yellow-400"));
            stars.forEach(s => s.classList.add("fa-regular", "text-gray-400"));
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.remove("fa-regular", "text-gray-400");
                stars[i].classList.add("fa-solid", "text-yellow-400");
            }
        });
    });

    document.getElementById("cancel-review").onclick = () => {
        document.getElementById("review-modal").remove();
    };

    document.getElementById("submit-review").onclick = () => {
        const reviewText = document.getElementById("review-text").value.trim();
        if (selectedRating === 0 || reviewText === "") {
            showToast("Please provide both rating and feedback.");
            return;
        }

        // 1. Update the booking data object with the new review
        bookingData.hasReview = true;
        bookingData.reviewRating = selectedRating; // Save the rating
        bookingData.reviewText = reviewText; // Save the text

        // 2. Close modal and show toast
        document.getElementById("review-modal").remove();
        showToast("Review submitted successfully!");

        // 3. Immediately update the display (This is the new part!)
        displayReviewInCard(bookingData); 
        
        // 4. Also call displayBookingDetails to refresh the action buttons (remove the 'Leave a Review' button)
        displayBookingDetails(bookingData);
    };
}

// --- 4. DISPLAY LOGIC ---
function displayBookingDetails(data) {
    document.getElementById("loading-overlay").style.display = "none";

    document.getElementById("booking-id").textContent = data.bookingId;
    const badge = document.getElementById("booking-status-badge");
    // Clear previous classes to prevent bleed-through
    badge.className = "px-4 py-1 text-sm font-semibold rounded-full mb-3 md:mb-0"; 
    const badgeClasses = getStatusBadgeClasses(data.status);
    badge.textContent = data.status.toUpperCase();
    badge.classList.add(badgeClasses.text, badgeClasses.bg);

    const formattedDate = formatDate(data.serviceDate);
    document.getElementById("summary-datetime").innerHTML = `${data.serviceTimeSlot}<br><span class="text-sm font-medium text-gray-500">${formattedDate}</span>`;
    document.getElementById("detail-service-type").textContent = data.serviceType;
    document.getElementById("detail-property-size").textContent = `${data.bedrooms} / ${data.bathrooms}`;
    document.getElementById("detail-duration").textContent = `${data.duration.toFixed(1)} Hours`;
    document.getElementById("detail-price").textContent = `£${data.price.toFixed(2)}`;
    document.getElementById("detail-address-full").textContent = `${data.address}, ${data.city}, ${data.zip}`;
    document.getElementById("detail-products").textContent =
        data.productPreference === "ScrubIt" ? "ScrubIt Provides (Eco-Friendly)" : "Client Provides (Own Supplies)";
    document.getElementById("detail-extras").textContent = data.extras.length > 0 ? data.extras.join(", ") : "None selected.";
    document.getElementById("detail-access-method").textContent = data.accessMethod;
    document.getElementById("detail-access-details").textContent = data.accessDetails || "No details provided.";
    document.getElementById("detail-additional-info").textContent = data.additionalInfo || "None.";

    const infoContainer = document.getElementById("cleaner-info-container");
    const unassigned = document.getElementById("cleaner-unassigned-container");
    if (data.cleaner.assigned) {
        unassigned.style.display = "none";
        infoContainer.style.display = "flex";
        document.getElementById("cleaner-photo").src = data.cleaner.photoUrl;
        document.getElementById("cleaner-name").textContent = data.cleaner.name;
        // Also update the hidden cleaner-bookings element which was in the HTML
        document.getElementById("cleaner-bookings").textContent = data.cleaner.bookingsCompleted; 
        document.getElementById("cleaner-rating").textContent = data.cleaner.rating.toFixed(1);
        document.getElementById("cleaner-email").textContent = data.cleaner.email;
        document.getElementById("cleaner-phone").textContent = data.cleaner.phone;
    } else {
        infoContainer.style.display = "none";
        unassigned.style.display = "block";
    }

    // NEW: Call the dedicated review display function
    displayReviewInCard(data);

    // Actions (No longer needs to display the review here, only the button)
    let actions = document.getElementById("action-buttons");
    if (!actions) {
        actions = document.createElement("div");
        actions.id = "action-buttons";
        actions.className = "mt-8";
        // Append action-buttons right after the main card
        document.querySelector(".max-w-5xl").appendChild(actions); 
    }
    actions.innerHTML = "";

    switch (data.status) {
        case "Awaiting Payment":
            actions.innerHTML = `<button class="px-4 py-2 bg-yellow-500 text-white rounded-lg w-full">Pay Now</button>`;
            break;
        case "Pending Confirmation":
            actions.innerHTML = `<p class="text-gray-600 text-sm">Awaiting cleaner confirmation...</p>`;
            break;
        case "Confirmed":
            actions.innerHTML = `
              <button class="px-4 py-2 bg-blue-600 text-white rounded-lg w-full mb-2">Reschedule</button>
              <button class="px-4 py-2 bg-red-600 text-white rounded-lg w-full">Cancel Booking</button>`;
            break;
        case "In Progress":
            actions.innerHTML = `<p class="text-blue-600 font-semibold">Job in progress...</p>`;
            break;
        case "Completed":
            if (!data.hasReview) { // Only show button if review hasn't been submitted
                actions.innerHTML = `<button id="leave-review-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg w-full">Leave a Review</button>`;
            } else {
                actions.innerHTML = `<p class="text-gray-600 text-sm font-medium">Thank you for your feedback!</p>`;
            }
            break;
        case "Cancelled":
            if (data.hasPaid) {
                actions.innerHTML = `<button class="px-4 py-2 bg-red-600 text-white rounded-lg w-full">Request Refund</button>`;
            } else {
                actions.innerHTML = `<p class="text-red-600 text-sm">This booking was cancelled before payment.</p>`;
            }
            break;
        case "Refunded":
            actions.innerHTML = `<p class="text-teal-700 font-semibold">Refund Completed ✅</p>`;
            break;
        default:
            actions.innerHTML = `<p class="text-gray-600 text-sm">No actions available.</p>`;
    }

    if (document.getElementById("leave-review-btn")) {
        document.getElementById("leave-review-btn").addEventListener("click", () => openReviewModal(data));
    }

    actions.querySelectorAll("button:not(#leave-review-btn)").forEach((btn) => {
        btn.addEventListener("click", () => {
            showModal(`Are you sure you want to "${btn.textContent}"?`, () => console.log(`${btn.textContent} confirmed.`));
        });
    });
}

// --- 5. INIT ---
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loading-overlay").style.display = "flex";
    setTimeout(() => displayBookingDetails(mockBookingData), 1200);
});