// --- Placeholder Service Data (Simulates lookup by ID) ---
const servicesDB = [
    { id: 'S-001', name: 'Standard Clean', price: 80.00, duration: '2 hours', description: 'Basic cleaning for maintenance.', isActive: true },
    { id: 'S-002', name: 'Deep Clean', price: 150.00, duration: '4-6 hours', description: 'Intensive top-to-bottom clean of the entire home, including inside windows and deep kitchen sanitization.', isActive: true },
    // ... others
];

// --- Action Handlers ---

/**
 * Handles the Delete Service button action.
 */
function handleAction(actionType) {
    if (actionType === 'delete') {
        const serviceId = document.getElementById('service-id').value;
        if (confirm(`Are you sure you want to permanently DELETE Service ID ${serviceId}? This action cannot be undone.`)) {
            alert(`Action: Deleting service ${serviceId}. This would typically call a DELETE API endpoint and redirect to services-list.html.`);
            // Simulate real application real application:
            // fetch(`/api/services/${serviceId}`, { method: 'DELETE' }).then(() => {
            //     window.location.href = 'services-list.html';
            // });
        }
    }
}

/**
 * Gathers form data, validates, and simulates saving/updating the service.
 */
function saveService() {
    const serviceId = document.getElementById('service-id').value;
    const isEditing = serviceId !== 'Will be generated upon save';
    const serviceName = document.getElementById('service-name').value;
    
    // 1. Gather form data
    const formData = {
        id: isEditing ? serviceId : null,
        name: serviceName,
        price: parseFloat(document.getElementById('base-price').value),
        duration: document.getElementById('estimated-duration').value,
        description: document.getElementById('service-description').value,
        isActive: document.getElementById('active-status').checked,
    };
    
    // 2. Perform validation (simple check)
    if (!serviceName || isNaN(formData.price) || formData.price <= 0) {
        alert('Please ensure Service Name and Base Price are filled out correctly.');
        return;
    }
    
    const actionType = isEditing ? 'UPDATE (PUT/PATCH)' : 'CREATE (POST)';
    const saveText = isEditing ? `Saving changes to "${serviceName}"...` : `Creating new service: "${serviceName}"...`;
    
    // 3. Simulate API call
    alert(`${saveText}\nAction: ${actionType}\nData submitted: ${JSON.stringify(formData, null, 2)}`);

    // 4. Redirect on success (to be uncommented when going live)
    // window.location.href = 'services-list.html';
}


// --- Dynamic Data Loading ---
/**
 * Checks the URL for a service ID and loads the corresponding data for Edit mode, 
 * or prepares the form for Create mode.
 */
function loadServiceData() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    
    const mainHeader = document.getElementById('main-header');
    const breadcrumbName = document.getElementById('breadcrumb-service-name');
    const saveButton = document.getElementById('save-button');
    const deleteButton = document.getElementById('delete-button');
    const pageTitle = document.getElementById('page-title');
    
    if (serviceId) {
        // --- EDIT MODE ---
        const service = servicesDB.find(s => s.id === serviceId);

        if (!service) {
            mainHeader.textContent = 'Service Not Found';
            breadcrumbName.textContent = 'Error';
            pageTitle.textContent = 'Error - ScrubIt Admin';
            return; 
        }

        // Update UI titles
        pageTitle.textContent = `Edit Service ${service.id} - ScrubIt Admin`;
        mainHeader.textContent = `Edit Service: ${service.name}`;
        breadcrumbName.textContent = service.name;
        deleteButton.classList.remove('hidden'); // Show delete button

        // Populate Form Fields
        document.getElementById('service-id').value = service.id;
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-description').value = service.description;
        document.getElementById('base-price').value = service.price.toFixed(2);
        document.getElementById('estimated-duration').value = service.duration;
        document.getElementById('active-status').checked = service.isActive;
        
        saveButton.innerHTML = '<i class="fa-solid fa-save mr-2"></i> Update Service';

    } else {
        // --- CREATE MODE ---
        pageTitle.textContent = 'Create New Service - ScrubIt Admin';
        mainHeader.textContent = 'Create New Service';
        breadcrumbName.textContent = 'New';
        // Set Service ID placeholder for creation mode
        document.getElementById('service-id').value = 'Will be generated upon save'; 
        deleteButton.classList.add('hidden'); // Hide delete button in create mode
        saveButton.innerHTML = '<i class="fa-solid fa-plus-circle mr-2"></i> Create Service';
        
        // Default to Active for new services
        document.getElementById('active-status').checked = true;
    }
}


// --- Initialization ---

// Execute on page load
window.onload = function () {
    
    if (typeof loadNav === 'function') {
        loadNav(); 
    } else {
        console.warn('loadNav() function not found. Sidebar will not load.');
    }
    
    loadServiceData(); // Load data or prepare for new service
};