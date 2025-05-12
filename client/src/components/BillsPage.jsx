'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sideBar';
import Chatbot from './Chatbot';
import dayjs from 'dayjs';
import { billsData } from './TempDataFiles/BillsData';

const BillsPage = () => {
  const [billsByMonth, setBillsByMonth] = useState([]);
  const [expanded, setExpanded] = useState({});

  const getAmountColor = (amt) =>
    parseFloat(amt) < 0 ? 'text-red-500' : 'text-green-500';

  const toggleDetails = (mIdx, bIdx) => {
    const key = `${mIdx}-${bIdx}`;
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    // pull in your mock streams
    const { inflow_streams = [], outflow_streams = [] } = billsData;
    const allStreams = [...inflow_streams, ...outflow_streams];

    // group by "MMMM YYYY"
    const grouped = allStreams.reduce((acc, stream) => {
      const date = stream.last_date || stream.predicted_next_date;
      const monthLabel = dayjs(date).format('MMMM YYYY');
      if (!acc[monthLabel]) acc[monthLabel] = [];
      acc[monthLabel].push(stream);
      return acc;
    }, {});

    // convert to array
    const formatted = Object.entries(grouped).map(([month, bills]) => ({
      month,
      bills,
    }));

    // (optional) sort newest first
    formatted.sort(
      (a, b) =>
        dayjs(b.month, 'MMMM YYYY').unix() -
        dayjs(a.month, 'MMMM YYYY').unix()
    );

    setBillsByMonth(formatted);
  }, []);

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      <Sidebar />

      <div className="flex-grow overflow-y-auto p-8">
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full">
          <h1 className="text-2xl font-bold mb-4">Monthly Bills</h1>

          <div className="grid grid-cols-4 gap-4 text-sm font-bold mb-4">
            <span>Merchant</span>
            <span>Account</span>
            <span>Amount</span>
            <span>Date</span>
            {/*<span>Details</span>*/}
          </div>

          {billsByMonth.map((blk, mIdx) => (
            <div key={mIdx} className="mt-6">
              <h3 className="bg-[#1B203F] inline-block px-3 py-1 rounded-md font-semibold text-lg mb-4">
                {blk.month}
              </h3>

              {blk.bills.map((bill, bIdx) => {
                const key = `${mIdx}-${bIdx}`;
                const isOpen = !!expanded[key];
                const amt = bill.last_amount?.amount ?? 0;
                const date = bill.last_date || bill.predicted_next_date || '';

                return (
                  <div key={bIdx} className="mb-4">
                    <div className="grid grid-cols-4 gap-4 p-4 bg-[#1B203F] rounded-lg">
                      <span>{bill.merchant_name}</span>
                      <span className="text-xs text-gray-300 truncate">
                          {bill.account_id}
                      </span>

                      <span className={getAmountColor(amt)}>
                        ${Math.abs(amt).toFixed(2)}
                      </span>
                      <span>{dayjs(date).format('YYYY-MM-DD')}</span>
                      {/*<span
                        className="text-xl cursor-pointer"
                        onClick={() => toggleDetails(mIdx, bIdx)}
                      >
                        📄
                      </span>*/}
                    </div>

                    {/*{isOpen && (
                      <div className="ml-4 mt-2 p-3 bg-[#2C325C] rounded-lg text-sm space-y-1">
                        <div><strong>Description:</strong> {bill.description}</div>
                        <div><strong>Category:</strong> {bill.category?.join(' > ')}</div>
                        <div><strong>Category ID:</strong> {bill.category_id}</div>
                        <div><strong>Frequency:</strong> {bill.frequency}</div>
                        <div><strong>Stream ID:</strong> {bill.stream_id}</div>
                        <div><strong>Status:</strong> {bill.status}</div>
                        <div><strong>Next:</strong> {bill.predicted_next_date}</div>
                      </div>
                    )}*/}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="fixed bottom-6 right-6 z-50">
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default BillsPage;
