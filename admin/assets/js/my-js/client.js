document.addEventListener("DOMContentLoaded", async () =>{
    try {
        const response = await fetch(`${baseUrl}/employees`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error("Fetching employees failed.");
        }

        const result = await response.json();

        if(result.status && result.status === "error") {
            throw new Error(result.message || "Fetching employees failed..");
        }

        const employees = result.data;

        const tbody = document.querySelector("#DataTables_Table_0 tbody");
        tbody.innerHTML = ""; // Clear previous rows
        employees.forEach(emp => {
            const tr = document.createElement("tr");
            tr.setAttribute("role", "row");
            tr.classList.add("odd");
            tr.setAttribute("data-id", emp.id); // Add employee ID
            tr.innerHTML = `
                <td tabindex="0" class="sorting_1"><p class="list-item-heading">${emp.name}</p></td>
                <td><p class="text-muted">${emp.email}</p></td>
                <td><p class="text-muted">${emp.phone}</p></td>
                <td><p class="text-muted">${emp.salary}</p></td>
                <td><p class="text-muted">${
                    emp.created_at
                        ? new Date(emp.created_at).toLocaleDateString()
                        : ""
                    }</p>
                </td>
                <td>
                    <button class="btn btn-primary btn-sm edit-employee-btn">edit</button>
                    <button class="btn btn-danger btn-sm delete-employee-btn">delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Attach event listeners for edit buttons
        document.querySelectorAll('.edit-employee-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var row = btn.closest('tr');
                var name = row.querySelector('td:nth-child(1) .list-item-heading').textContent;
                var email = row.querySelector('td:nth-child(2) p').textContent;
                var phone = row.querySelector('td:nth-child(3) p').textContent;
                var salary = row.querySelector('td:nth-child(4) p').textContent;

                document.getElementById('editEmployeeName').value = name;
                document.getElementById('editEmployeeEmail').value = email;
                document.getElementById('editEmployeePhone').value = phone;
                document.getElementById('editEmployeeSalary').value = salary;

                // Store the row or employee ID for later use
                row.setAttribute('data-editing', 'true');
                
                $('#editEmployeeModal').modal('show');
            });
        });


        document.querySelectorAll('.delete-employee-btn').forEach(function(btn) {
            btn.addEventListener('click', async function() {
                if (!confirm("Are you sure you want to delete this employee?")) return;
                var row = btn.closest('tr');
                var employeeId = row.getAttribute('data-id');
                try {
                    const response = await fetch(`${baseUrl}/employees/${employeeId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (!response.ok) throw new Error("Delete failed.");
                    row.remove(); // Remove row from table
                    const result = await response.json();
                    alert(result.message || "Employee deleted successfully.");
                } catch (error) {
                    console.error("error during employee delete", error);
                    alert("Failed to delete employee.");
                }
            });
        });


    } catch (error) {
        console.error("error during employees fetch", error)
    }
});



document.getElementById("saveEditEmployeeBtn").addEventListener("click", async () => {
    // Find the row being edited
    const row = document.querySelector('tr[data-editing="true"]');
    const employeeId = row.getAttribute('data-id');
    if (!row) return;

    const name = document.getElementById('editEmployeeName').value;
    const email = document.getElementById('editEmployeeEmail').value;
    const phone = document.getElementById('editEmployeePhone').value;
    const salary = document.getElementById('editEmployeeSalary').value;

    try {
        const response = await fetch(`${baseUrl}/employees/${employeeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                salary
            })
        });

        if (!response.ok) throw new Error("Update failed.");

        // Remove the editing marker
        row.removeAttribute('data-editing');

        const result = await response.json();
        alert(result.message || "Employee updated successfully.");

        window.location.reload();
    } catch (error) {
        console.error("error during employee update", error);
    }
});



document.getElementById("add-employee-btn").addEventListener("click", async () =>{

    const employeeName = document.getElementById("employeeName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const salary = document.getElementById("salary").value;

    try {
        const response = await fetch(`${baseUrl}/employees`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: employeeName,
                email: email,
                phone: phone,
                salary: salary,
            })
        });

        if (!response.ok) {
            throw new Error("creating employees failed.");
        }

        const result = await response.json();
        alert(result.message);
        window.location.href = "employees.html";

    } catch (error) {
        console.error("error during employees adding", error)
    }
});

