// --- Mock Database of Applicants ---
const mockApplicants = {
    "A1001": {
      fullName: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+44 7912 345678",
      postcode: "SW1A 1AA",
      gender: "Female",
      years: "3 years",
      cleaningTypes: "Domestic, Office, Deep Cleaning",
      description: "Hard-working and reliable cleaner with over three years of experience.",
      hours: "30 hours/week",
      days: "Monday - Friday",
      duration: "Long-term",
      eligibility: ["Right to Work Check", "Background Check", "Reference Check"]
    },
    "A1002": {
      fullName: "James Carter",
      email: "james.carter@example.com",
      phone: "+44 7700 900234",
      postcode: "E1 6AN",
      gender: "Male",
      years: "5 years",
      cleaningTypes: "Commercial, Carpet, Window Cleaning",
      description: "Experienced cleaner specializing in commercial properties.",
      hours: "Full-time",
      days: "Weekdays and Saturdays",
      duration: "Flexible",
      eligibility: ["Right to Work Check", "Driving License"]
    }
  };
  
  // --- DOM Ready ---
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("loading-overlay");
    overlay.style.display = "flex";
  
    // Get applicant ID from query string
    const params = new URLSearchParams(window.location.search);
    const applicantId = params.get("id");
  
    if (!applicantId || !mockApplicants[applicantId]) {
      alert("Applicant not found.");
      overlay.style.display = "none";
      return;
    }
  
    const data = mockApplicants[applicantId];
  
    // Populate fields
    document.getElementById("applicant-name").textContent = data.fullName;
    document.getElementById("detail-fullname").textContent = data.fullName;
    document.getElementById("detail-email").textContent = data.email;
    document.getElementById("detail-phone").textContent = data.phone;
    document.getElementById("detail-postcode").textContent = data.postcode;
    document.getElementById("detail-gender").textContent = data.gender;
    document.getElementById("detail-years").textContent = data.years;
    document.getElementById("detail-cleaning-types").textContent = data.cleaningTypes;
    document.getElementById("detail-description").textContent = data.description;
    document.getElementById("detail-hours").textContent = data.hours;
    document.getElementById("detail-days").textContent = data.days;
    document.getElementById("detail-duration").textContent = data.duration;
  
    const eligibilityList = document.getElementById("detail-eligibility");
    eligibilityList.innerHTML = "";
    data.eligibility.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      eligibilityList.appendChild(li);
    });
  
    // Hide loading overlay after delay
    setTimeout(() => overlay.style.display = "none", 800);
  });
  
  // --- Modal Logic ---
  let currentAction = null;
  
  function openModal(action) {
    currentAction = action;
    const modal = document.getElementById("confirmation-modal");
    document.getElementById("modal-message").textContent =
      action === "accept"
        ? "Are you sure you want to ACCEPT this applicant?"
        : "Are you sure you want to REJECT this applicant?";
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
  
  function closeModal() {
    const modal = document.getElementById("confirmation-modal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
  
  document.getElementById("modal-confirm-btn").addEventListener("click", () => {
    closeModal();
    showToast(
      currentAction === "accept"
        ? "Applicant accepted successfully."
        : "Applicant rejected successfully."
    );
  });
  
  function showToast(message) {
    const toast = document.getElementById("success-toast");
    toast.textContent = message;
    toast.classList.remove("hidden", "opacity-0");
    toast.classList.add("opacity-100");
    setTimeout(() => {
      toast.classList.add("opacity-0");
      setTimeout(() => toast.classList.add("hidden"), 500);
    }, 2500);
  }
  