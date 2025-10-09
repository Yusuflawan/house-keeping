// Function to format the date for the breadcrumb
function formatToday() {
    const today = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayName = days[today.getDay()];
    const date = today.getDate();
    const monthName = months[today.getMonth()];

    // Helper function for ordinal suffixes
    function ordinal(n) {
        if (n > 3 && n < 21) return n + "th";
        switch (n % 10) {
            case 1: return n + "st";
            case 2: return n + "nd";
            case 3: return n + "rd";
            default: return n + "th";
        }
    }

    return `${dayName}, ${ordinal(date)} ${monthName}`;
}

// --- API and Rendering Logic (Core API Roadmap Step) ---

// 1. Placeholder for the API Base URL (Crucial for organization!)
// In a real application, this would point to your backend server endpoint.
const API_BASE_URL = 'http://api.scrubandcleanit.com/v1'; 

/**
 * Utility function to simulate fetching data from an API endpoint.
 * We use a fake delay to mimic network latency.
 * @param {string} endpoint The resource endpoint (e.g., 'metrics').
 * @returns {Promise<object>} The data object.
 */
async function fetchData(endpoint) {
    // This is a placeholder for real API calls!
    console.log(`Simulating API call to: ${API_BASE_URL}/${endpoint}`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate 300ms network delay

    // Fake data response based on the endpoint requested
    if (endpoint === 'metrics') {
        return {
            totalRevenue: 15820.50,
            allTimeRevenue: 125100.75,
            activeBookings: 148,
            completedBookings: 852,
            activeEmployees: 45,
            totalClients: 987,
            payoutBalance: 3150.00,
            commissionHeld: 950.00,
            cancellationFinesTotal: 450.00, // New Metric
            lateCancelsCount: 9 // New Metric
        };
    }

    if (endpoint === 'charts') {
        return {
            statusLabels: ['Completed', 'Confirmed', 'Pending Assignment', 'Cancelled'],
            statusData: [650, 180, 80, 50],
            revenueLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            revenueData: [2500, 3100, 4200, 6020]
        };
    }

    if (endpoint === 'bookings?limit=4') {
        return [
            // Completed
            { id: '10001', client: { name: 'Alice Johnson', id: 'C001' }, service: 'Deep Kitchen Clean', time: "Today, 10:00 - 14:00", employee: { name: "Liam O'Connell", id: 'E010' }, amount: 125.00, status: 'Completed' },
    
            // Pending (Awaiting Assignment)
            { id: '10002', client: { name: 'Mark Davies', id: 'C002' }, service: 'Regular House Clean (4hrs)', time: "Tomorrow, 09:00 - 13:00", employee: null, amount: 85.00, status: 'Pending' },
    
            // Assigned (Paid but not yet done)
            { id: '10003', client: { name: 'Sarah Kim', id: 'C003' }, service: 'End of Tenancy (3 Bed)', time: "2025-10-15, 08:00", employee: { name: 'Maria Rodriguez', id: 'E008' }, amount: 280.00, status: 'Assigned' },
    
            
            // Cancelled by client
            { id: '10004', client: { name: 'David Chen', id: 'C004' }, service: 'Carpet Cleaning', time: "2025-10-02, 16:00 - 18:00", employee: { name: "Liam O'Connell", id: 'E010' }, amount: 55.00, status: 'Cancelled (Client)' },
    
            // Cancelled by employee
            { id: '10005', client: { name: 'Jessica Lee', id: 'C005' }, service: 'Office Weekly Clean', time: "Next Monday, 07:00 - 09:00", employee: { name: 'Team Alpha', id: 'E009' }, amount: 180.00, status: 'Cancelled (Employee)' },
    
            // Requests (awaiting admin approval)
            { id: '10006', client: { name: 'Tom Harris', id: 'C006' }, service: 'Emergency Deep Clean', time: "Today, 15:00 - 18:00", employee: null, amount: 90.00, status: 'Request' },
    
            // Awaiting Payment Confirmation
            { id: '10007', client: { name: 'Amelia Brown', id: 'C007' }, service: 'After-party Clean', time: "Tomorrow, 10:00 - 12:00", employee: { name: 'Ethan Clark', id: 'E011' }, amount: 120.00, status: 'Awaiting Payment Confirmation' },
            
            // In Progress (currently being cleaned)
            { id: '10008', client: { name: 'Emma Thompson', id: 'C008' }, service: 'Move-out Cleaning', time: "Today, 12:00 - 16:00", employee: { name: 'John Doe', id: 'E012' }, amount: 150.00, status: 'In Progress' }
        ];
    }
    
    
    return {};
}

/**
 * Renders the data into the five dashboard metric cards.
 * @param {object} metrics The data object from the API.
 */
function renderMetrics(metrics) {
    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    });

    document.getElementById('total-revenue').textContent = formatter.format(metrics.totalRevenue);
    document.getElementById('all-time-revenue').textContent = formatter.format(metrics.allTimeRevenue);
    document.getElementById('active-bookings-count').textContent = metrics.activeBookings.toString();
    document.getElementById('completed-bookings-count').textContent = metrics.completedBookings.toString();
    document.getElementById('active-employees-count').textContent = metrics.activeEmployees.toString();
    document.getElementById('total-clients-count').textContent = metrics.totalClients.toString();
    document.getElementById('payout-balance').textContent = formatter.format(metrics.payoutBalance);
    document.getElementById('commission-held').textContent = formatter.format(metrics.commissionHeld);
    
    // New Card Population
    document.getElementById('cancellation-fines-total').textContent = formatter.format(metrics.cancellationFinesTotal);
    document.getElementById('late-cancels-count').textContent = metrics.lateCancelsCount.toString();
}

/**
 * Creates the HTML markup for a booking status badge.
 * @param {string} status The booking status (e.g., 'Completed', 'Pending').
 * @returns {string} The HTML string for the badge.
 */
function createStatusBadge(status) {
    let colorClass;

    switch (status) {
        case 'Completed':
            colorClass = 'bg-green-500/10 text-green-700 border border-green-300';
            break;
        case 'In Progress':
            colorClass = 'bg-indigo-500/10 text-indigo-700 border border-indigo-300';
            break;
        case 'Assigned':
            colorClass = 'bg-blue-500/10 text-blue-700 border border-blue-300';
            break;
        case 'Pending':
        case 'Pending Assignment':
            colorClass = 'bg-yellow-500/10 text-yellow-700 border border-yellow-300';
            break;
        case 'Awaiting Payment Confirmation':
            colorClass = 'bg-amber-500/10 text-amber-700 border border-amber-300';
            break;
        case 'Request':
            colorClass = 'bg-gray-500/10 text-gray-700 border border-gray-300';
            break;
        case 'Cancelled (Client)':
        case 'Cancelled (Employee)':
        case 'Cancelled':
            colorClass = 'bg-red-500/10 text-red-700 border border-red-300';
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-800';
    }

    return `
        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}">
            ${status}
        </span>
    `;
}


function renderRecentBookings(bookings) {
    const tableBody = document.getElementById('recent-bookings-table-body');
    const paginationSummary = document.getElementById('pagination-summary');
    if (!tableBody) return;

    // Handle Filter Dropdown (new)
    const filterSelect = document.getElementById('booking-filter');
    let filteredBookings = bookings;

    if (filterSelect && filterSelect.value !== 'all') {
        filteredBookings = bookings.filter(b => b.status.toLowerCase().includes(filterSelect.value.toLowerCase()));
    }

    tableBody.innerHTML = '';
    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    });

    filteredBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        // Determine if payment confirmation is needed
        const showConfirmButton = booking.status === 'Awaiting Payment Confirmation';

        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#${booking.id}</td>

            <!-- Client Name Clickable -->
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                <a href="client-profile.html?id=${booking.client.id}" 
                   class="text-custom-blue hover:underline font-semibold">
                    ${booking.client.name}
                </a>
            </td>

            <!-- Service Info -->
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                <div class="font-medium">${booking.service}</div>
                <div class="text-xs text-gray-500">${booking.time}</div>
            </td>

            <!-- Employee Name Clickable or Unassigned -->
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                ${booking.employee 
                    ? `<a href="employee-profile.html?id=${booking.employee.id}" class="text-gray-800 hover:text-custom-blue">${booking.employee.name}</a>`
                    : '<span class="text-gray-400 italic">Unassigned</span>'}
            </td>

            <!-- Amount -->
            <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">${formatter.format(booking.amount)}</td>

            <!-- Status -->
            <td class="px-4 py-3 whitespace-nowrap">
                ${createStatusBadge(booking.status)}
            </td>

            <!-- Actions -->
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" 
                   onclick="openBookingDetails('${booking.id}', '${booking.status}')" 
                   class="text-custom-blue hover:text-indigo-600 mr-2" 
                   title="View Details">
                   <i class="fa-solid fa-eye"></i>
                </a>
                ${showConfirmButton ? `
                    <button onclick="confirmPayment('${booking.id}')"
                        class="text-green-600 hover:text-green-800 font-semibold">
                        Confirm Payment
                    </button>` 
                : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });

    if (paginationSummary) {
        paginationSummary.textContent = `Showing 1 to ${filteredBookings.length} of ${bookings.length} bookings`;
    }
}

// --- Real-Time Filter Logic (Simplified: Status Only) ---
function setupBookingFilter(bookingsData) {
    const filterSelect = document.getElementById('booking-filter');
    if (!filterSelect) return;

    function applyFilter() {
        const filterValue = filterSelect.value.trim().toLowerCase();

        let filtered = bookingsData;
        if (filterValue) {
            filtered = bookingsData.filter(b => b.status.toLowerCase().includes(filterValue));
        }

        renderRecentBookings(filtered);
    }

    filterSelect.addEventListener('change', applyFilter);
}



// Function to handle a booking deletion (placeholder for API call)
function handleDeleteBooking(bookingId) {
    if (confirm(`Are you sure you want to delete booking #${bookingId}?`)) {
        // In a real app, this would be: 
        // fetch(`${API_BASE_URL}/bookings/${bookingId}`, { method: 'DELETE' }).then(...)
        console.log(`[DELETE] Booking ID: ${bookingId} sent to API.`);
        // Reload the dashboard data after successful deletion
        // initDashboard(); 
    }
}

function openBookingDetails(bookingId, status) {
    const encodedStatus = encodeURIComponent(status);
    window.location.href = `admin_booking_details.html?id=${bookingId}&status=${encodedStatus}`;
}

function confirmPayment(bookingId) {
    const confirmed = confirm(`Confirm payment has been received for booking #${bookingId}?`);
    if (confirmed) {
        alert(`✅ Payment for booking #${bookingId} confirmed.`);
        // In a real app: PATCH request to API here
    }
}


/**
 * Initializes and fetches all dashboard data asynchronously.
 */
async function initDashboard() {
    // 1. Set the Date
    const todayDateElement = document.getElementById("today-date");
    if (todayDateElement) {
        todayDateElement.textContent = formatToday();
    }
    
    // 2. Fetch all required data concurrently (A performance best practice!)
    try {
        const [metrics, charts, bookings] = await Promise.all([
            fetchData('metrics'),
            fetchData('charts'),
            fetchData('bookings?limit=4') 
        ]);

        // 3. Render Metrics
        renderMetrics(metrics);
        
        // 4. Render Charts (Using fetched data)
        renderCharts(charts);

        // 5. Render Recent Bookings Table
        renderRecentBookings(bookings);

        setupBookingFilter(bookings);

    } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // You would typically show a user-friendly error message here
        // document.getElementById('app-container').innerHTML = '<div class="text-red-600">Failed to load dashboard data. Please try again.</div>';
    }
}

// Enable real-time filtering
const filterSelect = document.getElementById('booking-filter');
if (filterSelect) {
    filterSelect.addEventListener('change', () => {
        renderRecentBookings(bookings);
    });
}


/**
 * Renders the Chart.js visualizations.
 * @param {object} charts The chart data object from the API.
 */
function renderCharts(charts) {
    const bookingStatusCtx = document.getElementById('bookingStatusChart');
    const revenueTrendCtx = document.getElementById('revenueTrendChart');

    if (!bookingStatusCtx || !revenueTrendCtx) return; 

    // --- CHART 1: Booking Status Doughnut Chart (Uses data from API) ---
    const statusCtx = bookingStatusCtx.getContext('2d');
    const statusColors = [
        '#00897b', // Green (Completed)
        '#3f51b5', // Blue (Confirmed)
        '#ffb300', // Yellow (Pending)
        '#e53935'  // Red (Cancelled)
    ];

    new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: charts.statusLabels,
            datasets: [{
                label: 'Booking Status',
                data: charts.statusData, 
                backgroundColor: statusColors,
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        usePointStyle: true,
                        padding: 15
                    }
                }
            }
        }
    });

    // --- CHART 2: Revenue Trend Line Chart (Uses data from API) ---
    const trendCtx = revenueTrendCtx.getContext('2d');
    
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: charts.revenueLabels,
            datasets: [{
                label: 'Commission Revenue (£)',
                data: charts.revenueData, 
                borderColor: '#3f51b5', 
                backgroundColor: 'rgba(63, 81, 181, 0.15)',
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue (£)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}


// Start the dashboard logic when the page is fully loaded
// ... (All existing functions like renderCharts, initDashboard, etc. remain above) ...

// Start the dashboard logic and the shared components when the page is fully loaded
window.onload = function () {
    
    // 1. Load the shared Sidebar/Nav component 
    if (typeof loadNav === 'function') {
        loadNav(); 
    } else {
        console.warn('loadNav() function not found. Sidebar will not load.');
    }
    
    
    // 3. Initialize the core page logic
    initDashboard();
};