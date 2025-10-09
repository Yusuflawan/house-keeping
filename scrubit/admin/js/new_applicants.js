// --- Mock Applicant Data ---
const mockApplicants = [
    {
      id: "EMP-2025-014",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "07010020030",
      postcode: "NG1 2AB",
      area: "Nottingham Central",
      availability: "Mon - Fri",
    },
    {
      id: "EMP-2025-015",
      name: "Michael Green",
      email: "michael.green@example.com",
      phone: "07050090010",
      postcode: "NG3 4RT",
      area: "Nottingham East",
      availability: "Weekends",
    },
    {
      id: "EMP-2025-016",
      name: "Lisa Turner",
      email: "lisa.turner@example.com",
      phone: "07080012040",
      postcode: "NG5 6AF",
      area: "Nottingham North",
      availability: "Mon - Thu",
    },
    {
      id: "EMP-2025-017",
      name: "David Chen",
      email: "david.chen@example.com",
      phone: "07090044010",
      postcode: "SW1A 0AA",
      area: "London",
      availability: "Flexible",
    },
  ];
  
  // --- Load Applicants ---
  function loadApplicants(postcodeFilter = "all") {
    const tableBody = document.getElementById("applicants-table-body");
    tableBody.innerHTML = "";
  
    const filtered =
      postcodeFilter === "all"
        ? mockApplicants
        : mockApplicants.filter((a) =>
            a.postcode.toUpperCase().startsWith(postcodeFilter.toUpperCase())
          );
  
    filtered.forEach((a) => {
      const row = document.createElement("tr");
      row.classList.add("hover:bg-gray-50");
  
      row.innerHTML = `
        <td class="px-6 py-3 font-medium text-gray-900">${a.id}</td>
        <td class="px-6 py-3">${a.name}</td>
        <td class="px-6 py-3">${a.email}</td>
        <td class="px-6 py-3">${a.phone}</td>
        <td class="px-6 py-3">${a.postcode}</td>
        <td class="px-6 py-3">${a.availability}</td>
        <td class="px-6 py-3 text-center">
          <a href="applicant_details.html?id=${a.id}"
             class="text-custom-blue hover:underline font-medium">
            <i class="fa-solid fa-eye"></i> View Details
          </a>
        </td>
      `;
      tableBody.appendChild(row);
    });
  
    // Update header/footer counts
    document.getElementById("applicant-count-header").textContent = filtered.length;
    document.getElementById("applicant-total-count-footer").textContent = mockApplicants.length;
    document.getElementById("pagination-end-index").textContent = filtered.length;
  }
  
  // --- Event Listeners ---
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadNav === "function") loadNav();
    loadApplicants();
  
    const areaFilter = document.getElementById("area-filter");
    areaFilter.addEventListener("change", (e) => {
      loadApplicants(e.target.value);
    });
  });
  