// --- Global Data (Ideally fetched from an API in a real application) ---
const employeesData = [
    { id: 'E-001', name: 'Jane Doe', jobs: 45, rating: 4.8, services: ['Deep Clean', 'Standard'], status: 'Active', statusClass: 'bg-custom-green' },
    { id: 'E-002', name: 'Mark Smith', jobs: 32, rating: 4.5, services: ['Office', 'Window'], status: 'Active', statusClass: 'bg-custom-green' },
    { id: 'E-003', name: 'Sara Petrov', jobs: 18, rating: 4.9, services: ['Deep Clean', 'Laundry'], status: 'On Leave', statusClass: 'bg-custom-yellow' },
    { id: 'E-004', name: 'Tom Hardy', jobs: 6, rating: 3.9, services: ['Standard'], status: 'Suspended', statusClass: 'bg-custom-red' },
    { id: 'E-005', name: 'Lila Chen', jobs: 70, rating: 5.0, services: ['Deep Clean', 'Office', 'Window'], status: 'Active', statusClass: 'bg-custom-green' },
];


// --- Action handler (Placeholder for viewing profile or managing status) ---
/**
 * Placeholder function for when an action button (like "View Profile") is clicked.
 * @param {string} employeeId - The ID of the employee to act on.
 * @param {string} action - The action requested (e.g., 'View Profile').
 */
window.handleEmployeeAction = function(employeeId, action) {
    // In a real app, this would be: window.location.href = `employee-profile.html?id=${employeeId}`;
    alert(`Action: ${action} for Employee ID ${employeeId}. This would typically load the employee's detailed profile page.`);
};


// --- Rendering Logic (Dynamic content insertion) ---
/**
 * Renders the employee list into the HTML table body using the global employeesData.
 */
function renderEmployeesTable() {
    const tableBody = document.getElementById('employees-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = ''; // Clear table body before rendering

    employeesData.forEach(employee => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        
        // Determine text color for the status tag (Black for yellow, White for others)
        const statusTextColor = employee.statusClass === 'bg-custom-yellow' ? 'text-gray-900' : 'text-white';
        
        // Determine rating text color based on the value
        let ratingColor;
        if (employee.rating >= 4.5) {
            ratingColor = 'text-custom-green';
        } else if (employee.rating >= 4.0) {
            ratingColor = 'text-custom-blue';
        } else {
            ratingColor = 'text-custom-red';
        }
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${employee.name} <span class="text-xs text-gray-500">(${employee.id})</span></td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${employee.jobs}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${ratingColor}">${employee.rating.toFixed(1)} <i class="fa-solid fa-star text-xs ml-1"></i></td>
            <td class="px-6 py-4 text-sm text-gray-700">${employee.services.join(', ')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusTextColor} ${employee.statusClass} shadow-md">
                    ${employee.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="handleEmployeeAction('${employee.id}', 'View Profile')"
                    class="text-sm font-medium px-3 py-1 rounded-lg text-white bg-custom-blue hover:bg-indigo-600 transition-colors shadow">
                    View Profile
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


// --- Initialization ---
/**
 * Executes the necessary functions on page load.
 */
function initializeEmployeeList() {
    // 1. Render the main employee data table
    renderEmployeesTable();
}

// Ensure loadNav (from sidebar.js) runs first, and then run page-specific logic
// This uses the shared window.onload pattern to manage execution order.
// NOTE: Since the sidebar.js file is included first in HTML, we assume 'loadNav' is available.
window.onload = function () {
    loadNav(); 
    initializeEmployeeList();
};