// --- Page Specific Logic for Earnings ---

// Mock data representing earnings and transactions fetched from a backend service.
const mockEarningsData = {
    // Summary Data for different period selections
    summary: {
        last_30_days: {
            grossPay: 480.00,
            deductions: 20.00,
            netPay: 460.00,
            totalHours: 40.0,
            periodText: "Viewing summary for the last 30 days."
        },
        last_7_days: {
            grossPay: 120.00,
            deductions: 0.00,
            netPay: 120.00,
            totalHours: 10.0,
            periodText: "Viewing summary for the last 7 days."
        },
        // Additional period data would be added here
    },
    // Detailed transaction data (used to populate the table)
    transactions: [
        { date: '2025-09-28', client: 'Alice Johnson', hours: 3.0, gross: 36.00, deduction: 0.00, net: 36.00 },
        { date: '2025-09-25', client: 'Bob Smith', hours: 5.0, gross: 60.00, deduction: 0.00, net: 60.00 },
        { date: '2025-09-22', client: 'John Doe (Fine)', hours: 0.0, gross: 0.00, deduction: 20.00, net: -20.00, isDeduction: true },
        { date: '2025-09-20', client: 'Eve Brown', hours: 4.5, gross: 54.00, deduction: 0.00, net: 54.00 },
        { date: '2025-09-18', client: 'Alice Johnson', hours: 3.0, gross: 36.00, deduction: 0.00, net: 36.00 },
        { date: '2025-09-15', client: 'Chris Lee', hours: 7.0, gross: 84.00, deduction: 0.00, net: 84.00 },
    ]
};

/**
 * Formats a number to a currency string (£X.XX).
 * @param {number} amount - The numeric amount.
 * @returns {string} The formatted currency string.
 */
const formatCurrency = (amount) => {
    return `£${amount.toFixed(2)}`;
};

/**
 * Updates the summary cards (Gross Pay, Deductions, Net Pay, Total Hours).
 * @param {object} data - The summary object for the selected period.
 */
const renderSummary = (data) => {
    document.getElementById('metric-gross-pay').textContent = formatCurrency(data.grossPay);
    document.getElementById('metric-deductions').textContent = formatCurrency(data.deductions);
    document.getElementById('metric-net-pay').textContent = formatCurrency(data.netPay);
    document.getElementById('metric-total-hours').textContent = data.totalHours.toFixed(1);
    document.getElementById('earnings-summary-period').textContent = data.periodText;
};

/**
 * Renders the detailed transactions table.
 * @param {Array<object>} transactions - List of job transactions.
 */
const renderTransactions = (transactions) => {
    const tbody = document.getElementById('transactions-table-body');
    tbody.innerHTML = ''; // Clear existing content

    if (transactions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-gray-500">No transactions found for this period.</td></tr>`;
        return;
    }

    transactions.forEach(tx => {
        const row = document.createElement('tr');
        // Determine color based on net pay (green for positive, red for negative/fines)
        const netPayClass = tx.net >= 0 ? 'text-custom-green font-bold' : 'text-custom-red font-bold';

        row.innerHTML = `
            <td class="px-4 py-3 text-sm text-gray-500">${tx.date}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${tx.client}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${tx.hours.toFixed(1)}</td>
            <td class="px-4 py-3 text-sm text-gray-700 text-right">${formatCurrency(tx.gross)}</td>
            <td class="px-4 py-3 text-sm text-custom-red text-right">${formatCurrency(tx.deduction)}</td>
            <td class="px-4 py-3 text-sm ${netPayClass} text-right">${formatCurrency(tx.net)}</td>
        `;
        tbody.appendChild(row);
    });
};

/**
 * Main function to load and update all data based on selected period.
 * @param {string} periodKey - Key representing the data period (e.g., 'last_30_days').
 */
const loadEarningsData = (periodKey) => {
    // Show loading indicator while simulating data fetch
    const tbody = document.getElementById('transactions-table-body');
    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-gray-500" id="loading-indicator"><i class="fa-solid fa-spinner fa-spin mr-2"></i> Loading earnings data...</td></tr>`;

    setTimeout(() => {
        // Fetch summary data based on the selected period key
        const summaryData = mockEarningsData.summary[periodKey] || mockEarningsData.summary['last_30_days'];
        renderSummary(summaryData);
        
        // Render transactions, showing the newest first
        const transactionsToDisplay = mockEarningsData.transactions.slice().reverse(); 
        renderTransactions(transactionsToDisplay);

    }, 500); // Simulate API call delay
};


// --- Initialization ---

window.onload = () => {
    const periodSelector = document.getElementById('period-selector');
    
    if (periodSelector) {
        // 1. Load initial data (Default selection)
        loadEarningsData(periodSelector.value);

        // 2. Set up event listener for period changes
        periodSelector.addEventListener('change', (e) => {
            loadEarningsData(e.target.value);
        });
    }
};
