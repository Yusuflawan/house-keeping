const API_BASE_URL = 'http://api.scrubandcleanit.com/v1'; 

// --- Utility Functions (API and URL) ---

/**
 * Gets a query parameter value from the current URL.
 */
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// --- Event Handlers (Form Submission) ---

/**
 * Handles the form submission for assigning the job using PLACEHOLDER logic.
 */
async function handleAssignmentSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('assignment-form');
    const formData = new FormData(form);
    const employeeId = formData.get('employeeId');
    const jobId = getQueryParameter('jobId') || '2025-155'; // Use the real ID or a static one

    const submitBtn = document.getElementById('submit-assignment-btn');
    const messageArea = document.getElementById('message-area');

    if (!employeeId) {
        messageArea.className = 'mt-3 text-center text-sm font-semibold text-custom-red';
        messageArea.textContent = 'Please select an employee to assign the job.';
        return;
    }
    
    // 1. Handling Loading State (Roadmap Step)
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Assigning...';
    messageArea.textContent = ''; 

    // 2. Simulate API Call & Latency
    console.log(`[PLACEHOLDER] Simulating assignment of Job ${jobId} to Employee ${employeeId}`);
    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate 1.5s network delay
        
        // --- Placeholder Success ---
        messageArea.className = 'mt-3 text-center text-sm font-bold text-custom-green';
        messageArea.textContent = `✅ Job ${jobId} successfully assigned! (Placeholder Success)`;
        
        // 3. Simulate Redirect on Success
        setTimeout(() => {
             // In a real app, you would redirect to the bookings list after a short delay
             console.log("Placeholder: Redirecting to bookings-list.html...");
             // window.location.href = 'bookings-list.html';
        }, 2000);

    } catch (error) {
        // --- Placeholder Error ---
        console.error("Assignment Placeholder Error:", error);
        messageArea.className = 'mt-3 text-center text-sm font-bold text-custom-red';
        messageArea.textContent = `❌ Placeholder Assignment failed. Try again.`;
        
        // Reset button state on failure
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-upload mr-2"></i> Confirm Assignment';
    }
}

// --- Main Initialization Function ---

function initAssignJobPage() {
    // We only need to check for the ID and set up the form listener
    const jobId = getQueryParameter('jobId');
    if (!jobId) {
        // If no ID is provided, the UI will still display the static content
        console.warn("No Job ID found in URL. Displaying static placeholder job details.");
    }
    
    // Add submit listener
    const form = document.getElementById('assignment-form');
    form.addEventListener('submit', handleAssignmentSubmit);
    
    // Optional: Update the title/breadcrumb with the real job ID if present
    if (jobId) {
         document.getElementById('job-title').textContent = `Assign Job: ${jobId}`;
         document.getElementById('page-title').textContent = `Assign Job ${jobId}`;
    }
}

// Start the application logic
window.onload = initAssignJobPage;