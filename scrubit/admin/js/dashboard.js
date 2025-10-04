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
            { id: '10256', client: 'Alice Johnson', service: 'Deep Kitchen Clean', time: "Today, 10:00 - 14:00", employee: "Liam O'Connell", amount: 125.00, status: 'Completed' },
            { id: '10257', client: 'Mark Davies', service: 'Regular House Clean (4hrs)', time: "Tomorrow, 09:00 - 13:00", employee: 'Unassigned', amount: 85.00, status: 'Pending' },
            { id: '10258', client: 'Sarah Kim', service: 'End of Tenancy (3 Bed)', time: "2025-10-15, 08:00", employee: 'Maria Rodriguez', amount: 280.00, status: 'Confirmed' },
            { id: '10259', client: 'David Chen', service: 'Carpet Cleaning (Living Room)', time: "2025-10-02, 16:00 - 18:00", employee: "Liam O'Connell", amount: 55.00, status: 'No Show' },
            { id: '10260', client: 'Jessica Lee', service: 'Office Weekly Clean', time: "Next Monday, 07:00 - 09:00", employee: 'Team Alpha', amount: 180.00, status: 'Paid' }
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
            colorClass = 'bg-custom-green text-white';
            break;
        case 'Confirmed':
            colorClass = 'bg-custom-blue text-white';
            break;
        case 'Pending':
            colorClass = 'bg-custom-yellow text-gray-900';
            break;
        case 'No Show':
            colorClass = 'bg-gray-500 text-white';
            break;
        case 'Paid':
            colorClass = 'bg-green-500/10 text-green-700';
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

/**
 * Renders the list of recent bookings in the table.
 * @param {Array<object>} bookings The array of booking objects from the API.
 */
function renderRecentBookings(bookings) {
    const tableBody = document.getElementById('recent-bookings-table-body');
    const paginationSummary = document.getElementById('pagination-summary');
    if (!tableBody) return;

    // Clear existing static content
    tableBody.innerHTML = '';
    
    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    });

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        
        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#${booking.id}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                <div class="font-semibold">${booking.client}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                <div class="font-medium">${booking.service}</div>
                <div class="text-xs text-gray-500">${booking.time}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">${booking.employee}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">${formatter.format(booking.amount)}</td>
            <td class="px-4 py-3 whitespace-nowrap">
                ${createStatusBadge(booking.status)}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <a href="booking-details.html?id=${booking.id}" class="text-custom-blue hover:text-indigo-600 mr-2" title="View Details"><i class="fa-solid fa-eye"></i></a>
                <a href="#" class="text-custom-red hover:text-red-700" onclick="handleDeleteBooking('${booking.id}')" title="Delete Booking"><i class="fa-solid fa-trash"></i></a>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update Pagination Summary (using mock data for context)
    if (paginationSummary) {
        paginationSummary.textContent = `Showing 1 to ${bookings.length} of 256 bookings`;
    }
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

    } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // You would typically show a user-friendly error message here
        // document.getElementById('app-container').innerHTML = '<div class="text-red-600">Failed to load dashboard data. Please try again.</div>';
    }
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
window.onload = initDashboard;