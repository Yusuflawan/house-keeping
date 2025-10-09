// --- Page Specific Logic for My Jobs ---

// Mock Database State (in a real app, this would be retrieved from Firestore)
const mockJobData = {
    // The current job is the one the employee is either on now, or scheduled to start next.
    currentJob: {
        id: 'JOB-456',
        clientName: 'The Tech Hub Office',
        address: '101 Innovation Drive, Cambridge, CB2 0AE', // Full address for map link
        startTime: '2025-10-07T09:00:00', // Today at 9:00 AM (Ensure this time is slightly in the past or future to make it active/next)
        estimatedDuration: '4 hours',
        rate: 15.00,
        status: 'Scheduled', // Could be 'ClockedIn', 'Scheduled', 'Complete'
        clockInTime: null,
        notes: "Remember to use the specialized anti-static spray on the server racks."
    },
    upcomingJobs: [
        { id: 'JOB-457', clientName: 'Dr. Evans Clinic', serviceType: 'Medical Cleaning', date: '2025-10-07', time: '14:00', duration: '2.5 hrs', address: '45 Hospital Blvd, Suite 200, CA' },
        { id: 'JOB-458', clientName: 'Maple Street Residence', serviceType: 'Residential Cleaning', date: '2025-10-08', time: '08:00', duration: '3 hrs', address: '12 Maple St, San Jose, CA' },
        { id: 'JOB-459', clientName: 'The Old Theatre', serviceType: 'Deep Cleaning', date: '2025-10-09', time: '18:00', duration: '5 hrs', address: '99 Grand Ave, Oakland, CA' },
    ],
    completedJobs: [
        { id: 'JOB-454', clientName: 'Central Bank Branch', serviceType: 'Commercial Cleaning', date: '2025-10-04', duration: '6.0 hrs', grossPay: 85.00 },
        { id: 'JOB-455', clientName: 'Greenwood School', serviceType: 'School Cleaning', date: '2025-10-03', duration: '5.2 hrs', grossPay: 70.00 },
        { id: 'JOB-453', clientName: 'Highland Park Lofts', serviceType: 'Apartment Cleaning', date: '2025-10-02', duration: '3.5 hrs', grossPay: 52.50 },
    ]
};

// State variables for clocking functionality
let isClockedIn = false;
let clockInTimestamp = null;
let durationTimer;

/**
 * Formats number to currency string (£X.XX).
 * @param {number} amount - The numeric amount.
 * @returns {string} The formatted currency string.
 */
const formatCurrency = (amount) => {
    return `£${amount.toFixed(2)}`;
};

/**
 * Creates a Google Maps link for directions based on the job address.
 * @param {string} address - The destination address.
 * @returns {string} The Google Maps URL.
 */
const createDirectionsLink = (address) => {
    // Note: 'dir/?api=1&destination=' is the modern, cross-platform way to request directions
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
};

/**
 * Renders the current job card with Clock In/Out controls and Directions link.
 * @param {object} job - The current job data.
 */
const renderCurrentJob = (job) => {
    const container = document.getElementById('job-status-container');
    const now = new Date();
    const jobStartTime = new Date(job.startTime);
    
    // Check if the job is available to start (e.g., within 30 mins before/after scheduled time)
    const isJobActive = now > new Date(jobStartTime.getTime() - 30 * 60000) && job.status !== 'Complete';

    let contentHTML = '';

    if (isClockedIn) {
        // --- Clocked In State ---
        // Calculate elapsed time in hours since clock in
        const duration = ((now.getTime() - clockInTimestamp.getTime()) / (1000 * 60 * 60)).toFixed(2);
        
        contentHTML = `
            <div class="p-4 bg-custom-green text-white rounded-lg mb-4 flex justify-between items-center">
                <i class="fa-solid fa-check-circle text-2xl mr-3"></i>
                <div class="text-left flex-grow">
                    <p class="font-semibold text-lg">CLOCK IN SUCCESSFUL</p>
                    <p class="text-sm">Working on ${job.clientName}</p>
                </div>
                <div class="text-right">
                    <span class="text-2xl font-bold">${duration}</span> hrs
                </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left mb-4">
                <p class="text-gray-700 font-semibold mb-2">${job.clientName} at ${job.address}</p>
                <p class="text-sm text-gray-500">Clocked in at: ${clockInTimestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                <p class="text-sm text-gray-500">Rate: ${formatCurrency(job.rate)}/hr</p>
            </div>
            <button id="clock-out-btn" class="w-full py-3 px-4 rounded-xl bg-custom-red hover:bg-red-700 text-white font-bold transition-colors shadow-md">
                <i class="fa-solid fa-clock-o mr-2"></i> Clock Out & Complete
            </button>
        `;
    } else if (isJobActive) {
        // --- Active Job State ---
        contentHTML = `
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left mb-4">
                <p class="text-gray-700 font-semibold text-lg mb-1">${job.clientName}</p>
                <p class="text-sm text-gray-600 mb-2">
                    <i class="fa-solid fa-location-dot mr-1"></i> ${job.address}
                </p>
                <div class="flex justify-between text-sm text-gray-500">
                    <span><i class="fa-regular fa-calendar mr-1"></i> Start: ${new Date(job.startTime).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    <span><i class="fa-solid fa-hourglass-half mr-1"></i> Est: ${job.estimatedDuration}</span>
                </div>
            </div>
    
            <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <!-- Clock In Button -->
                <button id="clock-in-btn" class="flex-1 py-3 px-4 rounded-xl bg-custom-blue hover:bg-indigo-700 text-white font-bold transition-colors shadow-md">
                    <i class="fa-solid fa-clock mr-2"></i> Clock In
                </button>

                <!-- Cancel Button -->
                <button id="cancel-job-btn" class="flex-1 py-3 px-4 rounded-xl bg-custom-red hover:bg-red-700 text-white font-bold transition-colors shadow-md">
                    <i class="fa-solid fa-xmark mr-2"></i> Cancel
                </button>
            </div>
        `;
    } else {
        // --- Not Active/Completed State ---
        contentHTML = `
            <div class="p-4 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 text-center">
                <i class="fa-solid fa-thumbs-up text-3xl text-custom-green mb-2"></i>
                <p class="font-semibold text-lg">You're All Caught Up!</p>
                <p class="text-sm text-gray-500">Your next job is **${job.clientName}** starting on ${new Date(job.startTime).toLocaleDateString('en-GB')}.</p>
            </div>
        `;
    }

    container.innerHTML = contentHTML;
    attachClockingListeners(job);
};

/**
 * Attaches event listeners for Clock In/Out/Cancel buttons.
 * @param {object} job - The current job data.
 */
const attachClockingListeners = (job) => {
    const clockInBtn = document.getElementById('clock-in-btn');
    const clockOutBtn = document.getElementById('clock-out-btn');
    const cancelBtn = document.getElementById('cancel-job-btn');

    // --- Clock In ---
    if (clockInBtn) {
        clockInBtn.addEventListener('click', () => {
            isClockedIn = true;
            clockInTimestamp = new Date();
            console.log(`Clocked in for job ${job.id} at ${clockInTimestamp.toISOString()}`);
            renderCurrentJob(job);
            startDurationTimer(job);
        });
    }

    // --- Clock Out ---
    if (clockOutBtn) {
        clockOutBtn.addEventListener('click', () => {
            isClockedIn = false;
            if (durationTimer) clearInterval(durationTimer);

            const finalDurationHours = ((new Date().getTime() - clockInTimestamp.getTime()) / (1000 * 60 * 60));
            const finalGrossPay = finalDurationHours * job.rate;

            mockJobData.currentJob.status = 'Complete';

            // Green Summary Display
            const container = document.getElementById('job-status-container');
            container.innerHTML = `
                <div class="p-6 bg-custom-green text-white rounded-xl shadow-lg text-center opacity-100 transition-opacity duration-700" id="job-summary-card">
                    <i class="fa-solid fa-trophy text-4xl mb-3"></i>
                    <p class="font-bold text-xl mb-1">Job Complete!</p>
                    <p class="text-sm">Worked for: ${finalDurationHours.toFixed(2)} hours</p>
                    <p class="text-sm">Gross Pay: ${formatCurrency(finalGrossPay)}</p>
                </div>
            `;

            // Fade out and show next job or caught up message
            setTimeout(() => {
                const card = document.getElementById('job-summary-card');
                if (card) card.classList.add('opacity-0');
            }, 3000);

            setTimeout(() => {
                if (mockJobData.upcomingJobs.length > 0) {
                    mockJobData.currentJob = mockJobData.upcomingJobs.shift();
                }
                loadJobData();
            }, 4000);
        });
    }

    // --- Cancel Job ---
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to cancel this job?")) {
                mockJobData.currentJob.status = 'Cancelled';
                const container = document.getElementById('job-status-container');

                // Red Summary Display
                container.innerHTML = `
                    <div class="p-6 bg-custom-red text-white rounded-xl shadow-lg text-center opacity-100 transition-opacity duration-700" id="job-summary-card">
                        <i class="fa-solid fa-ban text-4xl mb-3"></i>
                        <p class="font-bold text-xl mb-1">Job Cancelled</p>
                        <p class="text-sm">We'll notify you when another job is available.</p>
                    </div>
                `;

                // Fade out and show next job or caught up message
                setTimeout(() => {
                    const card = document.getElementById('job-summary-card');
                    if (card) card.classList.add('opacity-0');
                }, 3000);

                setTimeout(() => {
                    if (mockJobData.upcomingJobs.length > 0) {
                        mockJobData.currentJob = mockJobData.upcomingJobs.shift();
                    }
                    loadJobData();
                }, 4000);
            }
        });
    }
};


/**
 * Updates the clocked-in duration display every minute.
 * @param {object} job - The current job data.
 */
const startDurationTimer = (job) => {
    if (durationTimer) clearInterval(durationTimer);

    // This interval updates the UI to reflect the passage of time
    durationTimer = setInterval(() => {
        if (isClockedIn) {
            renderCurrentJob(job);
        } else {
            clearInterval(durationTimer);
        }
    }, 60000); // Update every minute
}

/** Renders the list of upcoming jobs with service type & action */
const renderUpcomingJobs = (upcomingJobs) => {
    const tbody = document.getElementById('upcoming-jobs-table-body');
    tbody.innerHTML = '';

    if (upcomingJobs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-gray-500"><i class="fa-solid fa-circle-check mr-2"></i> No upcoming jobs scheduled.</td></tr>`;
        return;
    }

    upcomingJobs.forEach(job => {
        const jobDate = new Date(job.date + 'T' + job.time);
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors cursor-pointer';

        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${job.clientName}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${job.serviceType}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${jobDate.toLocaleDateString('en-GB')} at ${job.time}</td>
            <td class="px-4 py-3 text-sm text-gray-700 text-right">${job.duration}</td>
            <td class="px-4 py-3 text-center">
                <button class="text-custom-blue hover:underline font-semibold" onclick="viewJobDetails('${job.id}')">
                    <i class="fa-solid fa-eye mr-1"></i> View Details
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
};

/** Renders completed jobs with service type & action */
const renderCompletedJobs = (completedJobs) => {
    const tbody = document.getElementById('completed-jobs-table-body');
    tbody.innerHTML = '';

    if (completedJobs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-gray-500"><i class="fa-solid fa-list-check mr-2"></i> No completed jobs found.</td></tr>`;
        return;
    }

    completedJobs.forEach(job => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${job.clientName}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${job.serviceType}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${job.date}</td>
            <td class="px-4 py-3 text-lg font-bold text-custom-green text-right">${formatCurrency(job.grossPay)}</td>
            <td class="px-4 py-3 text-center">
                <button class="text-custom-blue hover:underline font-semibold" onclick="viewJobDetails('${job.id}')">
                    <i class="fa-solid fa-eye mr-1"></i> View Details
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
};

/** Action handler for viewing job details */
function viewJobDetails(jobId) {
    // Determine if the job is in upcoming or completed list
    const isUpcoming = mockJobData.upcomingJobs.some(job => job.id === jobId);
    const isCompleted = mockJobData.completedJobs.some(job => job.id === jobId);

    let status = 'unknown';
    if (isUpcoming) status = 'Upcoming';
    else if (isCompleted) status = 'Completed';

    // Redirect to the job details page with both ID and status
    window.location.href = `employee_booking_details.html?jobId=${jobId}&status=${status}`;
}


/**
 * Handles the tab switching logic.
 * @param {string} activeTab - 'upcoming' or 'completed'.
 */
const setActiveTab = (activeTab) => {
    const tabs = ['upcoming', 'completed'];

    tabs.forEach(tab => {
        const tabBtn = document.getElementById(`tab-${tab}`);
        const tabContent = document.getElementById(`tab-content-${tab}`);

        if (tab === activeTab) {
            // Activate tab button and show content
            tabBtn.classList.remove('text-gray-500', 'border-transparent');
            tabBtn.classList.add('text-custom-blue', 'border-custom-blue');
            tabContent.classList.remove('hidden');
        } else {
            // Deactivate tab button and hide content
            tabBtn.classList.remove('text-custom-blue', 'border-custom-blue');
            tabBtn.classList.add('text-gray-500', 'border-transparent');
            tabContent.classList.add('hidden');
        }
    });
};


/**
 * Main function to load all job data and render all sections.
 */
const loadJobData = () => {
    // 1. Render Current/Next Job section
    renderCurrentJob(mockJobData.currentJob);

    // 2. Render Upcoming Jobs (in the table)
    renderUpcomingJobs(mockJobData.upcomingJobs);

    // 3. Render Completed Jobs (in the table)
    renderCompletedJobs(mockJobData.completedJobs);
};

// --- Initialization ---

window.onload = () => {
    // 1. Load and render all job data sections
    loadJobData();

    // 2. Set up event listeners for tab switching
    document.getElementById('tab-upcoming').addEventListener('click', () => setActiveTab('upcoming'));
    document.getElementById('tab-completed').addEventListener('click', () => setActiveTab('completed'));

    // Set initial active tab (default to Upcoming)
    setActiveTab('upcoming');
};
