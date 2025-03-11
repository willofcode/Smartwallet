'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const Dashboard = () => {
  return (
    <div className="p-8 bg-gray-900 text-white font-poppins">
      <div className="mb-8">
        <div className="bg-indigo-900 p-6 rounded-lg shadow-lg mb-4">
          <h2 className="text-2xl mb-2">Your Financial Dashboard</h2>
          <p>Welcome back Daniel</p>
          <div className="flex gap-2 mt-4">
            <button className="bg-indigo-700 text-white py-2 px-4 rounded-md">12M</button>
            <button className="bg-white text-gray-900 py-2 px-4 rounded-md">1M</button>
            <button className="bg-indigo-700 text-white py-2 px-4 rounded-md">1W</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="col-span-2 space-y-8">
          <div className="bg-indigo-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl mb-4">My Spending on All Credit Cards for November</h3>
            <div className="flex items-center gap-8">
              {/* Placeholder for Pie Chart */}
              <div className="w-36 h-36 rounded-full bg-gradient-to-r from-purple-500 via-green-500 to-blue-500 flex items-center justify-center text-2xl bg-gray-900">
                $6,000
              </div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 mr-2"></span>Entertainment - $1,500/$2,000
                </li>
                <li className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600 mr-2"></span>Food - $1,000/$1,500
                </li>
                <li className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-2"></span>Rent - $2,500/$2,500
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl mb-4">Improving Financial Habits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white text-gray-900 p-4 rounded-md text-center">
                Food<br />$100/200<br /><small>15 days left</small>
              </div>
              <div className="bg-white text-gray-900 p-4 rounded-md text-center">
                Food<br />$100/200<br /><small>15 days left</small>
              </div>
              <div className="bg-white text-gray-900 p-4 rounded-md text-center">
                Food<br />$100/200<br /><small>15 days left</small>
              </div>
              <div className="bg-white text-gray-900 p-4 rounded-md text-center">
                Food<br />$100/200<br /><small>15 days left</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-8">
          <div className="bg-indigo-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl mb-4">Upcoming Bills</h3>
            <div className="space-y-2">
              <div>Dec 1 - Rent - $1,111.00</div>
              <div>Jan 18 - Insurance - $1,111.00</div>
              <div>Jun 1 - Water - $1,111.00</div>
            </div>
            <p className="mt-4">Total Bills Due in Next 30 Days: <strong>$1,980.55</strong></p>
          </div>

          <div className="bg-indigo-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl mb-4">My Cards</h3>
            <div className="w-full h-48 bg-gray-800 flex justify-center items-center">
              <img src="your-chart-placeholder.png" alt="Bar Chart" className="max-w-full max-h-full" />
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl mb-4">Spending Reduction Goals</h3>
            <p className="text-2xl mb-2"><strong>$3,000/$10,000</strong></p>
            <small className="text-gray-400">
              Overall spending increased by 20%.<br />
              Weekly spending 2x more than last week.<br />
              Decrease entertainment spending by $100/month.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
