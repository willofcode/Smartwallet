import React from "react";
import "./Transactions.css";

const Transactions = () => {
  const transactions = [
    {
      category: "Shopping",
      items: [
        { merchant: "Amazon", account: "123456", amount: "200.00", date: "2024-12-01" },
        { merchant: "Walmart", account: "789012", amount: "50.00", date: "2024-12-02" },
        { merchant: "Best Buy", account: "567123", amount: "320.75", date: "2024-11-15" },
        { merchant: "Target", account: "983211", amount: "75.49", date: "2024-11-20" },
      ],
    },
    {
      category: "Entertainment",
      items: [
        { merchant: "Netflix", account: "901234", amount: "19.99", date: "2024-12-03" },
        { merchant: "Spotify", account: "234567", amount: "9.99", date: "2024-11-25" },
        { merchant: "Hulu", account: "876543", amount: "12.99", date: "2024-11-10" },
        { merchant: "Disney+", account: "345678", amount: "7.99", date: "2024-10-30" },
      ],
    },
    {
      category: "Groceries/Food",
      items: [
        { merchant: "Whole Foods", account: "345678", amount: "120.50", date: "2024-12-01" },
        { merchant: "Trader Joe’s", account: "567845", amount: "75.30", date: "2024-12-02" },
        { merchant: "Kroger", account: "654321", amount: "89.40", date: "2024-11-28" },
        { merchant: "Safeway", account: "987654", amount: "45.20", date: "2024-11-18" },
      ],
    },
    {
      category: "Utilities",
      items: [
        { merchant: "Electric Company", account: "112233", amount: "150.00", date: "2024-12-05" },
        { merchant: "Water Utility", account: "445566", amount: "60.00", date: "2024-11-27" },
        { merchant: "Gas Company", account: "778899", amount: "80.75", date: "2024-11-15" },
        { merchant: "Internet Provider", account: "998877", amount: "55.99", date: "2024-11-05" },
      ],
    },
    {
      category: "Travel",
      items: [
        { merchant: "Delta Airlines", account: "667788", amount: "320.00", date: "2024-12-10" },
        { merchant: "Uber", account: "554433", amount: "45.60", date: "2024-11-30" },
        { merchant: "Airbnb", account: "223344", amount: "290.99", date: "2024-11-20" },
        { merchant: "Hertz", account: "998822", amount: "75.25", date: "2024-11-10" },
      ],
    },
  ];

  return (
    <div className="transactions-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="top">
          <div className="logo">
            <span>SmartWallet</span>
          </div>
        </div>

        <div className="user">
          <img src="pfp.jpg" alt="profile picture" className="user-img" />
          <div>
            <p className="bold">Daniel K.</p>
            <p>Admin</p>
          </div>
        </div>

        <ul>
          <li><a href="#">Dashboard</a></li>
          <li className="active"><a href="#">Transactions</a></li>
          <li><a href="#">Wallet</a></li>
          <li><a href="#">Advisor</a></li>
          <li><a href="#">Budgeting</a></li>
          <li><a href="#">Bills</a></li>
          <li><a href="#">Logout</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <main className="content">
        <header className="summary-header">
          <h1>Total Summary</h1>
          <span className="date-range">DATE: 01/19/23 - 11/25/2024</span>
        </header>

        <div className="transactions-list">
          <div className="filters">
            <select><option>Merchant ID</option></select>
            <select><option>Account ID</option></select>
            <select><option>Expense Category</option></select>
            <select><option>Date</option></select>
            <button className="search-button">Search</button>
          </div>

          {transactions.map((group, index) => (
            <div key={index} className="transaction-group">
              <h3>{group.category}</h3>
              {group.items.map((item, i) => (
                <div key={i} className="transaction-item">
                  <span className="merchant">{item.merchant}</span>
                  <span className="account">{item.account}</span>
                  <span className="amount">${item.amount}</span>
                  <span className="date">{item.date}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
