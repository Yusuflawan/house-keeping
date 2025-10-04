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

// --- Chart Rendering Logic ---
window.onload = function () {
    // 1. Set the Date (loadNav is now handled by sidebar.js's DOMContentLoaded event)
    const todayDateElement = document.getElementById("today-date");
    if (todayDateElement) {
        todayDateElement.textContent = formatToday();
    }

    // Check if the chart canvases exist
    const bookingStatusCtx = document.getElementById('bookingStatusChart');
    const revenueTrendCtx = document.getElementById('revenueTrendChart');

    if (!bookingStatusCtx || !revenueTrendCtx) {
        // If canvases aren't found, stop here
        return; 
    }

    // --- CHART 1: Booking Status Doughnut Chart ---
    const statusCtx = bookingStatusCtx.getContext('2d');
    const statusLabels = ['Completed', 'Confirmed', 'Pending Assignment', 'Cancelled'];
    const statusData = [650, 180, 80, 50]; 
    const statusColors = [
        '#00897b', // Green (bg-custom-green)
        '#3f51b5', // Blue (bg-custom-blue)
        '#ffb300', // Yellow (bg-custom-yellow)
        '#e53935'  // Red (bg-custom-red)
    ];

    new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: statusLabels,
            datasets: [{
                label: 'Booking Status',
                data: statusData, 
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

    // --- CHART 2: Revenue Trend Line Chart ---
    const trendCtx = revenueTrendCtx.getContext('2d');
    
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Commission Revenue (£)',
                data: [2500, 3100, 4200, 6020], 
                borderColor: '#3f51b5', // Custom Blue
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
};