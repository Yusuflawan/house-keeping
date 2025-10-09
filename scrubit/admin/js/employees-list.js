// --- Global Data (Ideally fetched from an API in a real application) ---
const employeesData = [
    { id: 'E-001', name: 'Jane Doe', jobs: 45, rating: 4.8, services: ['Deep Clean', 'Standard'], status: 'Active' },
    { id: 'E-002', name: 'Mark Smith', jobs: 32, rating: 4.5, services: ['Office', 'Window'], status: 'Active' },
    { id: 'E-003', name: 'Sara Petrov', jobs: 18, rating: 4.9, services: ['Deep Clean', 'Laundry'], status: 'On Leave' },
    { id: 'E-004', name: 'Tom Hardy', jobs: 6, rating: 3.9, services: ['Standard'], status: 'Suspended' },
    { id: 'E-005', name: 'Lila Chen', jobs: 70, rating: 5.0, services: ['Deep Clean', 'Office', 'Window'], status: 'Active' },
];

// --- Utility: Get color class based on status ---
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'active':
            return 'bg-custom-green';
        case 'on leave':
            return 'bg-custom-yellow';
        case 'suspended':
            return 'bg-custom-red';
        default:
            return 'bg-gray-400';
    }
}

// --- Action handler (Placeholder for viewing profile or managing status) ---
window.handleEmployeeAction = function (employeeId, action) {
    // In a real app, this would be: window.location.href = `employee-profile.html?id=${employeeId}`;
    alert(`Action: ${action} for Employee ID ${employeeId}. This would typically load the employee's detailed profile page.`);
};

// --- Rendering Logic (Dynamic content insertion) ---
function renderEmployeesTable(filteredData = employeesData) {
    const tableBody = document.getElementById('employees-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Clear before rendering

    filteredData.forEach(employee => {
        const statusClass = getStatusClass(employee.status);
        const statusTextColor = statusClass === 'bg-custom-yellow' ? 'text-gray-900' : 'text-white';

        // Rating color
        let ratingColor;
        if (employee.rating >= 4.5) ratingColor = 'text-custom-green';
        else if (employee.rating >= 4.0) ratingColor = 'text-custom-blue';
        else ratingColor = 'text-custom-red';

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${employee.name} <span class="text-xs text-gray-500">(${employee.id})</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${employee.jobs}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${ratingColor}">
                ${employee.rating.toFixed(1)} <i class="fa-solid fa-star text-xs ml-1"></i>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">${employee.services.join(', ')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusTextColor} ${statusClass} shadow-md">
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

// --- Filtering Logic ---
function setupStatusFilter() {
    const statusFilter = document.getElementById('status-filter');
    if (!statusFilter) return;

    statusFilter.addEventListener('change', () => {
        const selected = statusFilter.value.toLowerCase();
        const filtered =
            selected === 'all'
                ? employeesData
                : employeesData.filter(emp => emp.status.toLowerCase() === selected);
        renderEmployeesTable(filtered);
    });
}

// --- Initialization ---
function initializeEmployeeList() {
    renderEmployeesTable();
    setupStatusFilter();
}

// --- On Page Load ---
window.onload = function () {
    loadNav(); 
    initializeEmployeeList();
};
