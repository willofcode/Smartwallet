//sandbox ---> production 
//prod --> transactions && billing 
//

'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const BillsPage = () => {
  const billsData = [
    {
    /// it'll show upcoming bills 

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
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <main className="flex-grow p-6 overflow-y-auto"> {/* Ensure scrolling in main content */}

        <header className="bg-indigo-800 p-6 rounded-lg mb-6 text-center">
          <h1 className="text-3xl font-semibold">Monthly Bills</h1>
        </header>

        <div className="bg-indigo-900 p-6 rounded-lg">
          <div className="grid grid-cols-5 gap-4 text-sm font-bold text-left mb-4">
            <span>Merchant ID</span>
            <span>Account ID</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Details</span>
          </div>

          {/* Render Bills Data */}
          {billsData.map((monthData, index) => (
            <div key={index} className="mt-6">
              <h3 className="bg-gray-700 p-2 inline-block font-semibold text-xl rounded-md mb-4">
                {monthData.month}
              </h3>

              {/* Render Bills for Each Month */}
              {monthData.bills.map((bill, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-4 mb-4 bg-indigo-800 rounded-lg">
                  <span>{bill.merchant}</span>
                  <span>{bill.account}</span>
                  <span className={`text-${bill.amount < 0 ? 'red' : 'green'}-500`}>${bill.amount}</span>
                  <span>{bill.date}</span>
                  <span className="text-xl cursor-pointer">📄</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BillsPage;