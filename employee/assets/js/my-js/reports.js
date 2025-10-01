
let allSales = []; // Store all sales data
let allExpenses = []; // Store all expense data
const todayTotalSales = document.getElementById("sales-total");
const todayTotalExpenses = document.getElementById("expense-total");

document.addEventListener("DOMContentLoaded", async ()=> {

    fetchSales();
    fetchExpenses();

    document.querySelectorAll('.sal-dd .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const filterText = this.textContent.trim().toLowerCase();
            if (filterText === "this week") filterSales("week");
            else if (filterText === "this month") filterSales("month");
            else if (filterText === "all sales") filterSales("all");
            else filterSales("today");
            // update button text
            this.closest('.btn-group').querySelector('.dropdown-toggle').textContent = this.textContent;
        });
    });

    document.querySelectorAll('.exp-dd .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const filterText = this.textContent.trim().toLowerCase();
            if (filterText === "this week") filterExpenses("week");
            else if (filterText === "this month") filterExpenses("month");
            else if (filterText === "all expenses") filterExpenses("all");
            else filterExpenses("today");
            // update button text
            this.closest('.btn-group').querySelector('.dropdown-toggle').textContent = this.textContent;
        });
    });


});



// Fetch all sales data once
async function fetchSales() {
    try {
        const response = await fetch(`${baseUrl}/sales`);
        const result = await response.json();
        allSales = result.data || [];
        
        // calculate today's total sales
        const todaySalesSum = getTodayTotal(allSales);

        // update UI
        todayTotalSales.textContent = todaySalesSum;
        renderSalesRows(allSales); // Render all by default
    } catch (error) {
        console.error("Failed to fetch sales:", error);
    }
}

// Render sales rows to table
function renderSalesRows(sales) {
    const tbody = document.getElementById("salesTable");
    tbody.innerHTML = "";
    sales.forEach(sale => {
        const saleDate = sale.created_at ? new Date(sale.created_at) : null;
        tbody.innerHTML += `
            <tr role="row" class="even">
                <td tabindex="0" class="sorting_1"><p class="list-item-heading">${sale.product_name}</p></td>
                <td><p class="text-muted">${sale.amount}</p></td>
                <td><p class="text-muted">${sale.sold_by_name}</p></td>
                <td><p class="text-muted">${saleDate ? saleDate.toLocaleDateString() : ""}</p></td>
            </tr>
        `;
    });
}

// Filter sales by date
function filterSales(type) {
    const now = new Date();
    let filtered = [];
    if (type === "today") {
        filtered = allSales.filter(sale => {
            const saleDate = new Date(sale.created_at);
            return saleDate.toDateString() === now.toDateString();
        });
    } else if (type === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        filtered = allSales.filter(sale => {
            const saleDate = new Date(sale.created_at);
            return saleDate >= startOfWeek && saleDate <= endOfWeek;
        });
    } else if (type === "month") {
        filtered = allSales.filter(sale => {
            const saleDate = new Date(sale.created_at);
            return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
        });
    } else if (type === "all") {
        filtered = allSales;
    }
    renderSalesRows(filtered);
}




// Fetch all expenses data once
async function fetchExpenses() {
    try {
        const response = await fetch(`${baseUrl}/expenses`);
        const result = await response.json();
        allExpenses = result.data || [];
        // fetchTodayTotalExpenses(allExpenses)
                // calculate today's total expenses
        const todayExpensesSum = getTodayTotal(allExpenses);

        // update UI
        todayTotalExpenses.textContent = todayExpensesSum;
        renderExpenseRows(allExpenses); // Render all by default
    } catch (error) {
        console.error("Failed to fetch expenses:", error);
    }
}

function fetchTodayTotalExpenses(allExpenses) {
    // allExpenses
    filtered = allExpenses.filter(expense => {
            const expenseDate = new Date(expense.created_at);
            const data  = expenseDate.toDateString() === now.toDateString();

        });
    }


// Render expenses rows to table
function renderExpenseRows(expenses) {
    const tbody = document.getElementById("expensesTable");
    tbody.innerHTML = "";
    expenses.forEach(expense => {
        const expenseDate = expense.created_at ? new Date(expense.created_at) : null;
        tbody.innerHTML += `
            <tr role="row" class="even">
                <td tabindex="0" class="sorting_1"><p class="list-item-heading">${expense.category_name}</p></td>
                <td><p class="text-muted">${expense.description}</p></td>
                <td><p class="text-muted">${expense.amount}</p></td>
                <td><p class="text-muted">${expenseDate ? expenseDate.toLocaleDateString() : ""}</p></td>
            </tr>
        `;
    });
}

// Filter expenses by date
function filterExpenses(type) {
    const now = new Date();
    let filtered = [];
    if (type === "today") {
        filtered = allExpenses.filter(expense => {
            const expenseDate = new Date(expense.created_at);
            return expenseDate.toDateString() === now.toDateString();
        });
    } else if (type === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        filtered = allExpenses.filter(expense => {
            const expenseDate = new Date(expense.created_at);
            return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
        });
    } else if (type === "month") {
        filtered = allExpenses.filter(expense => {
            const expenseDate = new Date(expense.created_at);
            return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
        });
    } else if (type === "all") {
        filtered = allExpenses;
    }
    renderExpenseRows(filtered);
}



// Helper function to calculate today's total (works for sales & expenses)
function getTodayTotal(records) {
    const now = new Date();
    return records
        .filter(item => {
            const itemDate = new Date(item.created_at);
            return itemDate.toDateString() === now.toDateString();
        })
        .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
}