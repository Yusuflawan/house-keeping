
const baseUrl = "http://localhost:8080/SID2/backend";

document.addEventListener("DOMContentLoaded", function() {
  const userName = localStorage.getItem("name") || "User";
  document.getElementById("user-name").textContent = userName;

});

document.getElementById("nav").innerHTML = `<nav class="navbar fixed-top">
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
            <a class="dropdown-item" href="../index.html">Logout</a>
          </div>
        </div>
      </div>
    </nav>
 
    <div class="menu">
        <div class="main-menu">
            <div class="scroll">
            <ul class="list-unstyled">
                <li class="active">
                <a href="dashboard.html"><i class="fas fa-gauge"></i> <span>Dashboards</span></a>
                </li>
                <li>
                <a href="employees.html"><i class="fas fa-users"></i> Employees</a>
                </li>
                <li>
                <a href="record-sales.html"><i class="fas fa-cash-register"></i> Record Sales</a>
                </li>
                <li>
                <a href="record-expenses.html"><i class="fas fa-cash-register"></i> Record Expenses</a>
                </li>
                <li>
                <a href="reports.html"><i class="fas fa-file-alt"></i> Reports</a>
                </li>
            </ul>
            </div>
        </div>
     
        </div>
      </div>
    </div>
`;



// logout
document.querySelector('.user .dropdown-item:last-child').addEventListener('click', function() {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});