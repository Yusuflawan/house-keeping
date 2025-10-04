// --- Placeholder Service Data (Simulates API response) ---
const servicesData = [
    { id: 'S-001', name: 'Standard Clean', price: 80.00, duration: '2 hours', isActive: true, description: 'Basic cleaning for maintenance.' },
    { id: 'S-002', name: 'Deep Clean', price: 150.00, duration: '4-6 hours', isActive: true, description: 'Intensive top-to-bottom clean.' },
    { id: 'S-003', name: 'Window Wash', price: 65.00, duration: '1-2 hours', isActive: true, description: 'Interior and exterior window cleaning.' },
    { id: 'S-004', name: 'Office Cleaning', price: 250.00, duration: 'Custom', isActive: true, description: 'Commercial cleaning contract.' },
    { id: 'S-005', name: 'Carpet Shampoo', price: 90.00, duration: '3 hours', isActive: false, description: 'Specialized carpet cleaning.' },
];

// --- Action Handlers ---

/**
 * Handles navigation for adding/editing and toggling status.
 * @param {string} actionType - 'add-service', 'edit', or 'toggle'
 * @param {string} [serviceId] - The ID of the service to act upon.
 */
function handleAction(actionType, serviceId = null) {
    if (actionType === 'add-service') {
        // NAVIGATES TO THE CREATE SERVICE PAGE (service-details-edit.html from previous example)
        window.location.href = 'service-edit.html'; 
    } else if (actionType === 'edit' && serviceId) {
        // Navigates to the EDIT SERVICE PAGE with the specific ID
        window.location.href = `service-edit.html?id=${serviceId}`;
    } else if (actionType === 'toggle' && serviceId) {
        // In a real app, this would make an API call (PUT/PATCH)
        alert(`Action: Toggling activation status for Service ID ${serviceId}.`);
        
        // --- Mock Data Update (for immediate UI feedback) ---
        const service = servicesData.find(s => s.id === serviceId);
        if (service) {
            service.isActive = !service.isActive;
            renderServicesTable(); // Re-render the table
        }
    }
}

// --- Table Rendering and Filtering ---

/**
 * Renders the services table rows based on the provided data array.
 * @param {Array<Object>} data - The filtered array of service objects to render.
 */
function renderServicesTable(data = servicesData) {
    const tableBody = document.getElementById('services-table-body');
    const activeCountElement = document.getElementById('active-count');
    if (!tableBody || !activeCountElement) return;

    tableBody.innerHTML = ''; // Clear existing rows
    let activeCount = 0;

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">No services found matching your criteria.</td></tr>';
    }

    data.forEach(service => {
        if (service.isActive) {
            activeCount++;
        }
        
        const statusClass = service.isActive ? 'bg-custom-green' : 'bg-custom-red';
        const statusText = service.isActive ? 'Active' : 'Inactive';
        const toggleText = service.isActive ? 'Deactivate' : 'Activate';
        const toggleIcon = service.isActive ? 'fa-solid fa-power-off' : 'fa-solid fa-check';

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';

        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${service.id}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                <a href="service-details-edit.html?id=${service.id}" class="text-custom-blue hover:underline">${service.name}</a>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">$${service.price.toFixed(2)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${service.duration}</td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass} text-white">
                    ${statusText}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button onclick="handleAction('edit', '${service.id}')" class="text-custom-blue hover:text-indigo-600 font-semibold">
                    Edit Details
                </button>
                <button onclick="handleAction('toggle', '${service.id}')" class="text-gray-600 hover:text-gray-800 font-semibold">
                    <i class="${toggleIcon} mr-1"></i> ${toggleText}
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Update the active service count display
    activeCountElement.textContent = activeCount;
}

/**
 * Filters the service data based on the text in the search input and re-renders the table.
 */
function filterServices() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    const filteredData = servicesData.filter(service => 
        service.name.toLowerCase().includes(searchTerm) || 
        service.id.toLowerCase().includes(searchTerm)
    );

    renderServicesTable(filteredData);
}

// --- Initialization ---

// Execute on page load
window.onload = function () {
    if (typeof loadNav === 'function') {
        loadNav(); 
    } else {
        console.warn('loadNav() function not found. Sidebar will not load.');
    }
    
    // Initial render of the table
    renderServicesTable();
};