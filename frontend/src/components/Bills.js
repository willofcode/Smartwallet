import React from "react";
import "./Bills.css";

const Bills = () => {
  const billsData = [
    {
      month: "January",
      bills: [
        { merchant: "Electric Company", account: "987654", amount: "150.00", date: "2024-01-01" },
        { merchant: "Internet Provider", account: "123456", amount: "80.00", date: "2024-01-05" },
        { merchant: "Health Insurance", account: "334455", amount: "120.00", date: "2024-01-05" },
        { merchant: "Gym Membership", account: "789012", amount: "50.00", date: "2024-01-06" },
        { merchant: "Spotify", account: "998877", amount: "10.00", date: "2024-01-06" }
      ]
    },
    {
      month: "February",
      bills: [
        { merchant: "Electric Company", account: "987654", amount: "150.00", date: "2024-02-01" },
        { merchant: "Internet Provider", account: "123456", amount: "80.00", date: "2024-02-05" },
        { merchant: "Health Insurance", account: "334455", amount: "120.00", date: "2024-02-05" },
        { merchant: "Gym Membership", account: "789012", amount: "70.00", date: "2024-02-06" },
        { merchant: "Spotify", account: "998877", amount: "10.00", date: "2024-02-06" }
      ]
    }
  ];

  return (
    <div className="bills-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="top">
          <div className="logo">
            <span>🟣</span> {/* Placeholder for Logo */}
            <span>SmartWallet</span>
          </div>
        </div>

        <div className="user">
          <div className="user-img-placeholder">🧑</div> {/* Placeholder for Profile Picture */}
          <div>
            <p className="bold">Daniel</p>
            <p>Admin</p>
          </div>
        </div>

        <ul>
          <li><a href="#">🏠 Dashboard</a></li>
          <li><a href="#">💳 Transactions</a></li>
          <li><a href="#">👛 Wallet</a></li>
          <li><a href="#">🤖 AI Advisor</a></li>
          <li><a href="#">📊 Budgeting</a></li>
          <li className="active"><a href="#">📝 Bills</a></li>
        </ul>

        <div className="sign-out">
          <a href="#">🚪 Sign Out</a>
        </div>
      </div>

      {/* Main Content */}
      <main className="bills-content">
        <header className="bills-header">
          <h1>Monthly Bills</h1>
        </header>

        <div className="bills-list">
          <div className="bills-table-header">
            <span>Merchant ID</span>
            <span>Account ID</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Details</span>
          </div>

          {billsData.map((monthData, index) => (
            <div key={index} className="month-section">
              <h3 className="month-title">{monthData.month}</h3>
              {monthData.bills.map((bill, i) => (
                <div key={i} className="bill-row">
                  <span className="merchant">{bill.merchant}</span>
                  <span className="account">{bill.account}</span>
                  <span className="amount">${bill.amount}</span>
                  <span className="date">{bill.date}</span>
                  <span className="details">📄</span> {/* Placeholder for Details Icon */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Bills;
