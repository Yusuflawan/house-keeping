
document.addEventListener("DOMContentLoaded", async () =>{

    const employeeSelect = document.getElementById("employees");
    const productSelect = document.getElementById("products");

    const amount = document.getElementById("amount");

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

        // Clear existing options
        employeeSelect.innerHTML = '<option value="" disabled selected></option>';

        // Populate the dropdown with the fetched states
        employees.forEach((employee) => {
            const option = document.createElement("option");
            option.value = employee.id;
            option.textContent = employee.name;

            employeeSelect.appendChild(option);
        });

    } catch (error) {
        console.error("error during employees fetch", error)
    }

    
    try {
        const response = await fetch(`${baseUrl}/products`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error("Fetching products failed.");
        }

        const result = await response.json();

        if(result.status && result.status === "error") {
            throw new Error(result.message || "Fetching products failed..");
        }

        const products = result.data;

        // Clear existing options
        productSelect.innerHTML = '<option value="" disabled selected></option>';

        // Populate the dropdown with the fetched states
        products.forEach((product) => {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = product.name;

            productSelect.appendChild(option);
        });

    } catch (error) {
        console.error("error during products fetch", error)
    }


    document.getElementById("record-sale-form").addEventListener("submit", async (e)=> {
        e.preventDefault();

        const payload = {
            product: productSelect.value,
            amount: amount.value,
            sold_by: employeeSelect.value
        }

        // console.log(payload)
        
        try {
            const response = await fetch(`${baseUrl}/sales`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("creating sales failed.");
            }

            const result = await response.json();

            alert(result.message);
            window.location.href = "record-sales.html";

        } catch (error) {
            console.error("error during sales recording", error)
        }


    });

});


