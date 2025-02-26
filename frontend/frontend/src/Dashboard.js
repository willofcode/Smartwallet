import React, { useState } from "react";
import "./Dashboard.css"; 
import "boxicons/css/boxicons.min.css";

function Dashboard() {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <div className="top">
          <div className="logo">
            <i className="bx bx-wallet"></i>
            <span>SmartWallet</span>
          </div>
          <i className="bx bx-menu toggle-btn" onClick={toggleSidebar}></i> {/* This is the button */}
        </div>

        <div className="user">
          <img src="/pfp.jpg" alt="profile" className="user-img" />
          <div>
            <p className="bold">Daniel K.</p>
            <p>Admin</p>
          </div>
        </div>

        <ul>
          <li><a href="#"><i className="bx bxs-home"></i> Dashboard</a></li>
          <li><a href="#"><i className="bx bx-list-ul"></i> Transactions</a></li>
          <li><a href="#"><i className="bx bxs-wallet"></i> Wallet</a></li>
          <li><a href="#"><i className="bx bxs-user-voice"></i> Advisor</a></li>
          <li><a href="#"><i className="bx bxs-credit-card-alt"></i> Budgeting</a></li>
          <li><a href="#"><i className="bx bxs-chart"></i> Bills</a></li>
          <li><a href="#"><i className="bx bx-log-out"></i> Logout</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${sidebarActive ? "active" : ""}`}>
        <div className="container">
          <div className="Dashboard">
            <h1>Your Financial Dashboard</h1>
            <h3>Welcome Back Daniel!</h3>
            <div className="date">
              <input type="date" />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="dashboard-grid">
            <div className="Transactions-card"><h3>Transactions</h3></div>
            <div className="Budgeting-card"><h3>Budget</h3></div>
            <div className="Bills-card"><h3>Bills</h3></div>
            <div className="Wallet-card"><h3>Wallet</h3></div>
            <div className="Advisor-card"><h3>Advisor Card</h3></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
