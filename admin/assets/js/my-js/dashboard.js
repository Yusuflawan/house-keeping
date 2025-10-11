const baseUrl = "http://localhost:8080/SID2/backend";

// --- MOCK DATA for Fallback ---
const MOCK_DASHBOARD_DATA = {
    // Card Data (Top Row)
    total_revenue_month: "15,820", // Use string to keep formatting simple
    total_bookings_active: 148,
    active_employees: 45,
    employees_payouts_balance: "3,150.0", // Use string to keep formatting simple
    
    // Data for the Booking Status Donut Chart (e.g., counts or percentages)
    booking_status_data: {
        labels: ["Completed", "Pending", "Canceled", "In Progress"],
        data: [60, 25, 10, 5] 
    },

    // Data for the Weekly Revenue Trend Line Chart
    // This format mimics what your line chart needs (e.g., total earnings per day)
    weekly_revenue_trend: {
        // Week days are Mon (0), Tue (1), Wed (2), Thu (3), Fri (4), Sat (5), Sun (6)
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [55, 62, 59, 65, 60, 68, 61] // Example earnings data
    }
};


// --- Function to Update the Top Cards ---
function updateDashboardCards(data) {
    // 1. Total Revenue (Month)
    document.getElementById("total-petrol-sale").textContent = `£${data.total_revenue_month}`;

    // 2. Total Bookings (Active)
    document.getElementById("total-diesel-sale").textContent = data.total_bookings_active;
    
    // 3. Active Employees 
    // NOTE: In your HTML, both Active Employees and Payouts Balance use the same ID 'total-expense'.
    // We will target the first one, but it is highly recommended you change the HTML for Active Employees to 'active-employees'.
    const activeEmployeesElement = document.querySelectorAll('.col-lg-4 .card-body > div[style="font-weight: bold;"]')[2];
    if (activeEmployeesElement) {
        activeEmployeesElement.textContent = data.active_employees;
    }

    // 4. Employees Payouts Balance (Assuming this is the last card)
    const payoutsBalanceElement = document.querySelectorAll('.col-lg-4 .card-body > div[style="font-weight: bold;"]')[3];
    if (payoutsBalanceElement) {
        payoutsBalanceElement.textContent = `£${data.employees_payouts_balance}`;
    }
}


// --- Function to Render the Booking Status Donut Chart ---
function renderBookingStatusChart(chartData) {
    const ctx = document.getElementById("categoryChart");

    if (!ctx || typeof Chart === 'undefined') {
        console.warn("Chart canvas with ID 'categoryChart' not found or Chart.js is not loaded.");
        return;
    }

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.labels, 
            datasets: [{
                data: chartData.data, 
                backgroundColor: [
                    '#81A43F', // Completed (Green)
                    '#FF9C00', // Pending (Orange)
                    '#D93025', // Canceled (Red)
                    '#4285F4'  // In Progress (Blue)
                ],
                borderWidth: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            cutoutPercentage: 70, 
            legend: {
                display: true,
                position: 'bottom'
            },
            tooltips: { enabled: true },
            plugins: {
                // Configures the data labels plugin (assuming it's loaded)
                datalabels: {
                    formatter: (value, context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1) + "%";
                        // Show the percentage in the center text area if it's the largest slice
                        if (value === Math.max(...context.dataset.data)) {
                            return percentage;
                        }
                        return '';
                    },
                    align: 'center',
                    color: '#666',
                    font: { size: 24, weight: 'bold' },
                    textAlign: 'center'
                }
            }
        }
    });
}

// --- Function to Render the Weekly Revenue Line Chart ---
function renderWeeklyRevenueChart(chartData) {
    const ctx = document.getElementById("visitChart");

    if (!ctx || typeof Chart === 'undefined') {
        console.warn("Chart canvas with ID 'visitChart' not found or Chart.js is not loaded.");
        return;
    }

    new Chart(ctx, {
        type: "LineWithShadow", // This matches your template's custom type
        data: {
            labels: chartData.labels,
            datasets: [{
                label: "Platform Earnings",
                data: chartData.data,
                borderColor: "#81A43F", // Changed to a system-relevant color (Green)
                pointBackgroundColor: "#ffffff",
                pointBorderColor: "#81A43F",
                pointHoverBackgroundColor: "#81A43F",
                pointHoverBorderColor: "#ffffff",
                pointRadius: 4,
                pointBorderWidth: 2,
                pointHoverRadius: 5,
                fill: true,
                borderWidth: 2,
                backgroundColor: "rgba(129, 164, 63, 0.1)" // faint fill under line
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: { display: false },
            tooltips: { enabled: true },
            scales: {
                xAxes: [{ gridLines: { display: false } }],
                yAxes: [{
                    gridLines: {
                        display: true,
                        lineWidth: 1,
                        color: "rgba(0,0,0,0.1)",
                        drawBorder: false
                    },
                    ticks: { beginAtZero: true, display: true }
                }]
            }
        }
    });
}


// --- Main Data Fetching and Rendering ---
document.addEventListener("DOMContentLoaded", async () => {
    let dashboardData = MOCK_DASHBOARD_DATA;

    // --- API Fetch Placeholder ---
    // You can replace this section with a single API endpoint that returns all data 
    // for better performance, e.g., `${baseUrl}/dashboard-data`

    // For now, let's keep it simple and just use the mock data since your API endpoints
    // are for Petrol/Diesel, not your cleaning service data.
    
    // Once your new API endpoint is ready, you'd replace the MOCK_DASHBOARD_DATA 
    // assignment with the fetched data, like this:
    /*
    try {
        const response = await fetch(`${baseUrl}/dashboard-data`, { method: "GET" });
        if (response.ok) {
            const result = await response.json();
            dashboardData.total_revenue_month = result.data.monthly_revenue;
            // ... and so on for all fields and charts
        } else {
            console.warn("API fetch failed, using mock data.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    */
    
    // --- Render all elements using the (mock) data ---
    updateDashboardCards(dashboardData);
    renderBookingStatusChart(dashboardData.booking_status_data);
    
    // NOTE: We are now replacing the default chart logic for the line chart as well
    // It's mapped to the 'visitChart' ID in your HTML.
    renderWeeklyRevenueChart(dashboardData.weekly_revenue_trend);
});