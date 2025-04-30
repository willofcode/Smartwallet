//sandbox ---> production 
//prod --> transactions && billing 
//

'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import Sidebar from "../components/sideBar";
import Chatbot from './Chatbot';
import { billsData } from './TempDataFiles/BillsData';

const BillsPage = () => {
  // A helper to decide color for amounts (red if negative, green otherwise)
  const getAmountColor = (amount) => {
    // If your amounts are never negative, you can simply use a single color
    // For demonstration, let's treat negative amounts as "red" (though none are negative here).
    return amount.startsWith('-') ? 'text-red-500' : 'text-green-500';
  };

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-8">
        
        {/* Bills Container */}
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full">
          <h1 className="text-2xl font-bold mb-4">Monthly Bills</h1>

          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 text-sm font-bold text-left mb-4">
            <span>Merchant ID</span>
            <span>Account ID</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Details</span>
          </div>

          {/* Render Each Month's Bills */}
          {billsData.map((monthData, index) => (
            <div key={index} className="mt-6">
              {/* Month Header */}
              <h3 className="bg-[#1B203F] inline-block px-3 py-1 rounded-md font-semibold text-lg mb-4">
                {monthData.month}
              </h3>

              {/* Bills for This Month */}
              {monthData.bills.map((bill, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 gap-4 p-4 mb-4 bg-[#1B203F] rounded-lg"
                >
                  <span>{bill.merchant}</span>
                  <span>{bill.account}</span>
                  {/* Amount with conditional color */}
                  <span className={`${getAmountColor(bill.amount)}`}>
                    ${bill.amount}
                  </span>
                  <span>{bill.date}</span>
                  {/* Simple placeholder icon for "details" */}
                  <span className="text-xl cursor-pointer">📄</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className='fixed bottom-6 right-6 z-50'>
          <Chatbot/>
        </div>
      </div>
    </div>
  );
};

export default BillsPage;
