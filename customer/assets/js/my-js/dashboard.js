
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(`${baseUrl}/today-petrol-sales`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        document.getElementById("total-petrol-sale").textContent = result.data.total_amount;

    } catch (error) {
        console.error("Error fetching data:", error);
    }

        
    try {
        const response = await fetch(`${baseUrl}/today-diesel-sales`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        document.getElementById("total-diesel-sale").textContent = result.data.total_amount;

    } catch (error) {
        console.error("Error fetching data:", error);
    }


    try {
        const response = await fetch(`${baseUrl}/today-total-expenses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        document.getElementById("total-expense").textContent = result.data.total_amount;

    } catch (error) {
        console.error("Error fetching data:", error);
    }


    try {
        const response = await fetch(`${baseUrl}/weekly-petrol-sales`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();

        // Define all week days in order
        const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        // Convert result into a lookup { dayName: total_amount }
        const salesMap = {};
        result.forEach(item => {
            const date = new Date(item.sale_date);
            const day = date.toLocaleDateString("en-US", { weekday: "short" });
            salesMap[day] = item.total_amount;
        });

        // Ensure all days exist, fill missing with 0
        const labels = weekDays;
        const values = weekDays.map(day => salesMap[day] || 0);

        if (document.getElementById("petrolSalesChart")) {
            var ctx = document.getElementById("petrolSalesChart").getContext("2d");
            new Chart(ctx, {
                type: "LineWithShadow",  // match template
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Petrol Sales",
                        data: values,
                        borderColor: "#00365a",
                        pointBackgroundColor: "#ffffff",
                        pointBorderColor: "#00365a",
                        pointHoverBackgroundColor: "#00365a",
                        pointHoverBorderColor: "#ffffff",
                        pointRadius: 4,
                        pointBorderWidth: 2,
                        pointHoverRadius: 5,
                        fill: true,
                        borderWidth: 2,
                        backgroundColor: "rgba(0, 54, 90, 0.1)" // faint fill under line
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { display: false },
                    tooltips: { enabled: true },
                    scales: {
                        xAxes: [{
                            gridLines: { display: false } // remove vertical grid lines
                        }],
                        yAxes: [{
                            gridLines: {
                                display: true,
                                lineWidth: 1,
                                color: "rgba(0,0,0,0.1)",
                                drawBorder: false
                            },
                            ticks: {
                                beginAtZero: true,
                                ticks: {
                                display: false   // Hides the price labels on Y-axis
                        },
                            }
                        }]
                    }
                }
            });
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }








    try {
        const response = await fetch(`${baseUrl}/weekly-diesel-sales`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();

        // Define all week days in order
        const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        // Convert result into a lookup { dayName: total_amount }
        const salesMap = {};
        result.forEach(item => {
            const date = new Date(item.sale_date);
            const day = date.toLocaleDateString("en-US", { weekday: "short" });
            salesMap[day] = item.total_amount;
        });

        // Ensure all days exist, fill missing with 0
        const labels = weekDays;
        const values = weekDays.map(day => salesMap[day] || 0);

        if (document.getElementById("dieselSalesChart")) {
            var ctx = document.getElementById("dieselSalesChart").getContext("2d");
            new Chart(ctx, {
                type: "LineWithShadow",  // match template
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Petrol Sales",
                        data: values,
                        borderColor: "#00365a",
                        pointBackgroundColor: "#ffffff",
                        pointBorderColor: "#00365a",
                        pointHoverBackgroundColor: "#00365a",
                        pointHoverBorderColor: "#ffffff",
                        pointRadius: 4,
                        pointBorderWidth: 2,
                        pointHoverRadius: 5,
                        fill: true,
                        borderWidth: 2,
                        backgroundColor: "rgba(0, 54, 90, 0.1)" // faint fill under line
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { display: false },
                    tooltips: { enabled: true },
                    scales: {
                        xAxes: [{
                            gridLines: { display: false } // remove vertical grid lines
                        }],
                        yAxes: [{
                            gridLines: {
                                display: true,
                                lineWidth: 1,
                                color: "rgba(0,0,0,0.1)",
                                drawBorder: false
                            },
                            ticks: {
                                beginAtZero: true,
                                ticks: {
                                display: false   // Hides the price labels on Y-axis
                        },
                            }
                        }]
                    }
                }
            });
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }




});





