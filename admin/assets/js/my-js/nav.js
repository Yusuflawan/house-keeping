const baseUrl = "http://localhost:8080/SID2/backend";

// 1. Navigation HTML - Use a template literal to define the structure
const navHtml = `<nav class="navbar fixed-top">
    <div class="d-flex align-items-center navbar-left">
      <a href="#" class="menu-button d-none d-md-block"
        ><svg class="main" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 17">
          <rect x="0.48" y="0.5" width="7" height="1" />
          <rect x="0.48" y="7.5" width="7" height="1" />
          <rect x="0.48" y="15.5" width="7" height="1" />
        </svg>
        <svg class="sub" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17">
          <rect x="1.56" y="0.5" width="16" height="1" />
          <rect x="1.56" y="7.5" width="16" height="1" />
          <rect x="1.56" y="15.5" width="16" height="1" />
        </svg> </a
      ><a href="#" class="menu-button-mobile d-xs-block d-sm-block d-md-none"
        ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 17">
          <rect x="0.5" y="0.5" width="25" height="1" />
          <rect x="0.5" y="7.5" width="25" height="1" />
          <rect x="0.5" y="15.5" width="25" height="1" /></svg
      ></a>
      <div class="">
      SID
      </div>
    </div>
    <div class="navbar-right">
      
      <div class="user d-inline-block">
        <button class="btn btn-empty p-0" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="name" id="user-name"></span> <span><img alt="Profile Picture" src="assets/img/profiles/l-1.jpg" /></span>
        </button>
        <div class="dropdown-menu dropdown-menu-right mt-3">
          <a class="dropdown-item" href="#">Account</a>
          <a class="dropdown-item" id="logout-link" href="#">Logout</a>
        </div>
      </div>
    </div>
  </nav>

  <div class="menu">
    <div class="main-menu">
        <div class="scroll">
        <ul class="list-unstyled" id="main-nav-list">
            <li data-page="dashboard.html">
            <a href="dashboard.html"><i class="fas fa-chart-line"></i> <span>Dashboards</span></a>
            </li>
            <li data-page="employees.html">
            <a href="employees.html"><i class="fas fa-users"></i> Employees</a>
            </li>
            <li data-page="clients.html">
            <a href="clients.html"><i class="fas fa-address-book"></i> Clients</a>
            </li>
            <li data-page="bookings.html">
            <a href="bookings.html"><i class="fas fa-calendar-check"></i> Bookings</a>
            </li>
            <li data-page="services.html">
            <a href="services.html"><i class="fas fa-handshake"></i> Services</a>
            </li>
            <li data-page="payments.html">
            <a href="payments.html"><i class="fas fa-money-bill-transfer"></i> Payments </a>
            </li>
        </ul>
        </div>
    </div>
    
    </div>
</div>
`;

document.addEventListener("DOMContentLoaded", function() {
    // Insert the entire navigation structure
    document.getElementById("nav").innerHTML = navHtml;

    // Set User Name
    const userName = localStorage.getItem("name") || "User";
    const userNameElement = document.getElementById("user-name");
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
    
    // --- Active Link Logic ---
    
    // 1. Determine the current page file name (e.g., "dashboard.html")
    const path = window.location.pathname;
    const currentPage = path.substring(path.lastIndexOf('/') + 1);

    // 2. Find and activate the correct link
    const navList = document.getElementById('main-nav-list');
    if (navList) {
        // Remove 'active' from all links first (just in case)
        navList.querySelectorAll('li.active').forEach(li => li.classList.remove('active'));

        // Find the list item whose anchor tag href matches the current page
        const activeLink = navList.querySelector(`a[href="${currentPage}"]`);
        
        if (activeLink) {
            // Apply the active class to the parent <li> element
            activeLink.closest('li').classList.add('active');
        }
    }

    // --- Logout Logic (using the new ID) ---
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            localStorage.removeItem('name');
            localStorage.removeItem('email');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
});

// REMOVED: The old, standalone logout query selector is removed since it could run before the HTML was inserted.