'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import Sidebar from "../components/sideBar";
import Chatbot from './Chatbot';

const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});

  const getAmountColor = (amount) => {
    return parseFloat(amount) < 0 ? 'text-red-500' : 'text-green-500';
  };

  const toggleDetails = (monthIndex, billIndex) => {
    const key = `${monthIndex}-${billIndex}`;
    setExpandedDetails(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    const fetchBillsData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/recurring`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { inflow_streams = [], outflow_streams = [] } = response.data.recurring_streams || {};
        const allStreams = [...inflow_streams, ...outflow_streams];

        const groupedByMonth = {};

        allStreams.forEach(stream => {
          const date = stream.last_date || stream.predicted_next_date;
          const monthLabel = new Date(date).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          });

          if (!groupedByMonth[monthLabel]) {
            groupedByMonth[monthLabel] = [];
          }

          groupedByMonth[monthLabel].push(stream);
        });

        const formatted = Object.entries(groupedByMonth).map(([month, bills]) => ({
          month,
          bills,
        }));

        setBills(formatted);
      } catch (error) {
        setError("Failed to load bills.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillsData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      <Sidebar />
      <div className="flex-grow overflow-y-auto p-8">
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full">
          <h1 className="text-2xl font-bold mb-4">Monthly Bills</h1>

          <div className="grid grid-cols-5 gap-4 text-sm font-bold text-left mb-4">
            <span>Merchant ID</span>
            <span>Account ID</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Details</span>
          </div>

          {bills.map((monthData, monthIndex) => (
            <div key={monthIndex} className="mt-6">
              <h3 className="bg-[#1B203F] inline-block px-3 py-1 rounded-md font-semibold text-lg mb-4">
                {monthData.month}
              </h3>

              {monthData.bills.map((bill, billIndex) => {
                const key = `${monthIndex}-${billIndex}`;
                const isExpanded = expandedDetails[key];

                return (
                  <div key={billIndex} className="mb-4">
                    <div className="grid grid-cols-5 gap-4 p-4 bg-[#1B203F] rounded-lg">
                      <span>{bill.merchant_name || bill.description || 'Unknown'}</span>
                      <span title={bill.account_id}>
                        {bill.account_id?.slice(0, 8)}...{bill.account_id?.slice(-4)}
                      </span>
                      <span className={`${getAmountColor(bill.last_amount?.amount)}`}>
                        ${Math.abs(bill.last_amount?.amount || 0).toFixed(2)}
                      </span>
                      <span>{bill.last_date || 'N/A'}</span>
                      <span
                        className="text-xl cursor-pointer"
                        onClick={() => toggleDetails(monthIndex, billIndex)}
                      >
                        📄
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="ml-4 mt-2 p-3 bg-[#2C325C] rounded-lg text-sm space-y-1">
                        <div><strong>Description:</strong> {bill.description}</div>
                        <div><strong>Category:</strong> {bill.category?.join(' > ')}</div>
                        <div><strong>Category ID:</strong> {bill.category_id}</div>
                        <div><strong>Frequency:</strong> {bill.frequency}</div>
                        <div><strong>Stream ID:</strong> {bill.stream_id}</div>
                        <div><strong>Status:</strong> {bill.status}</div>
                        <div><strong>Prediction:</strong> {bill.predicted_next_date}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className='fixed bottom-6 right-6 z-50'>
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default BillsPage;