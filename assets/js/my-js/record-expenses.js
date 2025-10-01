
document.addEventListener("DOMContentLoaded", async () =>{

    const expenseCategoriesSelect = document.getElementById("expense-categories");
    
    try {
        const response = await fetch(`${baseUrl}/expense-categories`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error("Fetching categoriess failed.");
        }

        const result = await response.json();

        if(result.status && result.status === "error") {
            throw new Error(result.message || "Fetching categories failed..");
        }

        const categories = result.data;

        // Clear existing options
        expenseCategoriesSelect.innerHTML = '<option value="" disabled selected></option>';

        // Populate the dropdown with the fetched states
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;

            expenseCategoriesSelect.appendChild(option);
        });

    } catch (error) {
        console.error("error during categories fetch", error)
    }


    document.getElementById("record-expense-form").addEventListener("submit", async (e)=> {
        e.preventDefault();

        const payload = {
            category: expenseCategoriesSelect.value,
            amount: amount.value,
            description: document.getElementById("description").value
        }

        // console.log(payload)
        
        try {
            const response = await fetch(`${baseUrl}/expenses`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("creating expense failed.");
            }

            const result = await response.json();

            alert(result.message);
            window.location.href = "record-expenses.html";

        } catch (error) {
            console.error("error during expense recording", error)
        }


    });


});