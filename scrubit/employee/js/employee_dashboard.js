// --- Employee Dashboard Logic ---

// Mock Employee Data (simulating Firestore/Firebase for now)
const employeeData = {
    name: "Faruk",
    metrics: {
        hoursWorked: 42,
        earnings: 820.50,
        jobsCompleted: 12,
        fines: 25.00
    },
    currentJob: {
        id: "JOB-456",
        clientName: "The Tech Hub Office",
        address: "101 Innovation Drive, Cambridge, CB2 0AE",
        startTime: "2025-10-08T09:00:00",
        estimatedDuration: "4 hours",
        rate: 15.00,
        status: "Scheduled",
        clockInTime: null
    },
    upcomingJobs: [
        { id: "JOB-457", clientName: "Dr. Evans Clinic", date: "2025-10-09", time: "14:00", duration: "2.5 hrs", address: "45 Hospital Blvd, Suite 200, CA" },
        { id: "JOB-458", clientName: "Maple Street Residence", date: "2025-10-10", time: "08:00", duration: "3 hrs", address: "12 Maple St, San Jose, CA" }
    ]
};

// --- Utility Functions ---
const formatCurrency = (amount) => `£${amount.toFixed(2)}`;

// --- Global State ---
let isClockedIn = false;
let clockInTimestamp = null;
let durationTimer;

// --- Dashboard Rendering ---
const renderDashboardMetrics = () => {
    document.getElementById("employee-name-display").textContent = employeeData.name;
    document.getElementById("metric-hours-worked").textContent = employeeData.metrics.hoursWorked;
    document.getElementById("metric-earnings").textContent = formatCurrency(employeeData.metrics.earnings);
    document.getElementById("metric-jobs-completed").textContent = employeeData.metrics.jobsCompleted;
    document.getElementById("metric-fines").textContent = formatCurrency(employeeData.metrics.fines);
};

// --- Render “Caught Up” or Next Job ---
const showNextOrCaughtUp = () => {
    const container = document.getElementById("current-job-card");
    if (employeeData.upcomingJobs.length > 0) {
        const nextJob = employeeData.upcomingJobs.shift(); // remove first from queue
        const jobObj = {
            ...nextJob,
            startTime: `${nextJob.date}T${nextJob.time}:00`,
            estimatedDuration: nextJob.duration,
            rate: 15.00,
            status: "Scheduled"
        };
        employeeData.currentJob = jobObj;
        renderCurrentJob(jobObj);
    } else {
        container.innerHTML = `
            <div class="p-4 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 text-center">
                <i class="fa-solid fa-thumbs-up text-3xl text-custom-green mb-2"></i>
                <p class="font-semibold text-lg">You're All Caught Up!</p>
                <p class="text-sm text-gray-500">No more jobs scheduled for now. Great work!</p>
            </div>
        `;
    }
};

// --- Dynamic Current/Next Job Rendering ---
const renderCurrentJob = (job) => {
    const container = document.getElementById("current-job-card");
    const now = new Date();
    const start = new Date(job.startTime);
    const isActive = now > new Date(start.getTime() - 30 * 60000) && job.status !== "Complete";

    let html = "";

    if (isClockedIn) {
        // Clocked In UI
        const duration = ((now.getTime() - clockInTimestamp.getTime()) / (1000 * 60 * 60)).toFixed(2);
        html = `
            <div class="p-4 bg-custom-green text-white rounded-lg mb-3 flex justify-between items-center">
                <i class="fa-solid fa-check-circle text-2xl mr-3"></i>
                <div class="text-left flex-grow">
                    <p class="font-semibold text-lg">CLOCK IN SUCCESSFUL</p>
                    <p class="text-sm">Working on ${job.clientName}</p>
                </div>
                <div class="text-right">
                    <span class="text-2xl font-bold">${duration}</span> hrs
                </div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left mb-3">
                <p class="font-semibold text-gray-700 mb-1">${job.clientName}</p>
                <p class="text-sm text-gray-500 mb-1"><i class="fa-solid fa-location-dot mr-1"></i> ${job.address}</p>
                <p class="text-sm text-gray-500 mt-2">Rate: ${formatCurrency(job.rate)}/hr</p>
            </div>
            <button id="clock-out-btn" class="w-full py-3 rounded-xl bg-custom-red hover:bg-red-700 text-white font-bold shadow-md transition">
                <i class="fa-solid fa-clock mr-2"></i> Clock Out & Complete
            </button>
        `;
    } else if (isActive) {
        // Active Job (Clock In available)
        html = `
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left mb-3">
                <p class="text-gray-700 font-semibold text-lg mb-1">${job.clientName}</p>
                <p class="text-sm text-gray-600 mb-2">
                    <i class="fa-solid fa-location-dot mr-1"></i> ${job.address}
                </p>
                <div class="flex justify-between text-sm text-gray-500">
                    <span><i class="fa-regular fa-calendar mr-1"></i> ${new Date(job.startTime).toLocaleString()}</span>
                    <span><i class="fa-solid fa-hourglass-half mr-1"></i> ${job.estimatedDuration}</span>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
                <button id="clock-in-btn" class="flex-1 py-3 rounded-xl bg-custom-blue hover:bg-indigo-700 text-white font-bold shadow-md transition">
                    <i class="fa-solid fa-clock mr-2"></i> Clock In
                </button>
                <button id="cancel-job-btn" class="flex-1 py-3 rounded-xl bg-custom-red hover:bg-red-700 text-white font-bold shadow-md transition">
                    <i class="fa-solid fa-xmark mr-2"></i> Cancel
                </button>
            </div>
        `;
    } else {
        // Not Active / Completed
        html = `
            <div class="p-4 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 text-center">
                <i class="fa-solid fa-thumbs-up text-3xl text-custom-green mb-2"></i>
                <p class="font-semibold text-lg">You're All Caught Up!</p>
                <p class="text-sm text-gray-500">Your next job is <strong>${job.clientName}</strong> starting on 
                ${new Date(job.startTime).toLocaleDateString()}.</p>
            </div>
        `;
    }

    container.innerHTML = html;
    attachJobListeners(job);
};

// --- Event Listeners for Clocking Actions ---
const attachJobListeners = (job) => {
    const clockInBtn = document.getElementById("clock-in-btn");
    const clockOutBtn = document.getElementById("clock-out-btn");
    const cancelBtn = document.getElementById("cancel-job-btn");

    if (clockInBtn) {
        clockInBtn.addEventListener("click", () => {
            isClockedIn = true;
            clockInTimestamp = new Date();
            employeeData.currentJob.status = "ClockedIn";
            renderCurrentJob(job);
            startTimer(job);
        });
    }

    if (clockOutBtn) {
        clockOutBtn.addEventListener("click", () => {
            isClockedIn = false;
            if (durationTimer) clearInterval(durationTimer);

            const workedHours = ((new Date().getTime() - clockInTimestamp.getTime()) / (1000 * 60 * 60)).toFixed(2);
            const grossPay = workedHours * job.rate;

            const card = document.getElementById("current-job-card");
            card.innerHTML = `
                <div class="p-6 bg-custom-green text-white rounded-xl shadow-lg text-center">
                    <i class="fa-solid fa-trophy text-4xl mb-3"></i>
                    <p class="font-bold text-xl mb-1">Job Complete!</p>
                    <p class="text-sm">Worked: ${workedHours} hours</p>
                    <p class="text-sm">Pay: ${formatCurrency(grossPay)}</p>
                </div>
            `;

            // Show next job or caught-up message after 3 seconds
            setTimeout(showNextOrCaughtUp, 3000);
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to cancel this job?")) {
                const card = document.getElementById("current-job-card");
                card.innerHTML = `
                    <div class="p-6 bg-custom-red text-white rounded-xl shadow-lg text-center">
                        <i class="fa-solid fa-ban text-4xl mb-3"></i>
                        <p class="font-bold text-xl mb-1">Job Cancelled</p>
                        <p class="text-sm">You can pick up another job soon.</p>
                    </div>
                `;
                // Show next job or caught-up message after 3 seconds
                setTimeout(showNextOrCaughtUp, 3000);
            }
        });
    }
};

// --- Timer for Clock-In Updates ---
const startTimer = (job) => {
    if (durationTimer) clearInterval(durationTimer);
    durationTimer = setInterval(() => {
        if (isClockedIn) renderCurrentJob(job);
        else clearInterval(durationTimer);
    }, 60000);
};

// --- Render Upcoming Jobs List ---
const renderUpcomingJobs = () => {
    const tbody = document.getElementById("avaiable-jobs-table-body");
    tbody.innerHTML = "";

    if (employeeData.upcomingJobs.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="4" class="p-6 text-center text-gray-500">
            <i class="fa-solid fa-circle-check mr-2"></i> No upcoming jobs scheduled.</td></tr>`;
        return;
    }

    employeeData.upcomingJobs.forEach(job => {
        const row = document.createElement("tr");
        row.className = "hover:bg-gray-50 transition-colors";
        const dateStr = `${job.date} at ${job.time}`;
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${job.clientName}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${dateStr}</td>
            <td class="px-4 py-3 text-sm text-gray-600">${job.duration}</td>
            <td class="px-4 py-3 text-sm text-right text-custom-blue underline cursor-pointer">View</td>
        `;
        tbody.appendChild(row);
    });
};

// --- Main Initialization ---
window.addEventListener("DOMContentLoaded", () => {
    renderDashboardMetrics();
    renderCurrentJob(employeeData.currentJob);
    renderUpcomingJobs();
});
