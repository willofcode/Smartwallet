'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from "./sideBar";

// Example data for the "Total Planned Expenses" section
const expenseData = [
  { category: "Housing", used: 750, budget: 900, dates: "15 Sep - 12 Oct" },
  { category: "Food", used: 1000, budget: 900, dates: "15 Sep - 12 Oct" },
  { category: "Transportation", used: 300, budget: 300, dates: "15 Sep - 12 Oct" },
];

const BudgetingOverview = () => {
  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      <Sidebar />

      {/* Main Content Container */}
      <div className="flex-grow overflow-y-auto p-8">
        {/* -- Card 1: Left to Spend -- */}
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
            <h2 className="text-sm md:text-base">
              Left to spend in the next 22 days
            </h2>
          </div>
          <p className="text-3xl font-bold mb-2">$3,252.33</p>
          {/* Progress bar */}
          <div className="relative w-full bg-gray-600 h-2 rounded-full">
            <div
              className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full"
              style={{ width: '80%' }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span>$0</span>
            <span>$4,000</span>
          </div>
        </div>

        {/* -- Card 2: Total Planned Expenses -- */}
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm md:text-base">Total Planned Expenses</h2>
            {/* Gear icon → links to planning page */}
            <Link to="/budgeting/planning" className="text-gray-300 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 3.01-1.756 3.436 0
                     a1.724 1.724 0 002.591.99c1.398-.92 3.066.746 2.146 2.146
                     a1.724 1.724 0 00.99 2.59c1.756.427 1.756 3.01 0 3.436
                     a1.724 1.724 0 00-.99 2.591c.92 1.398-.746 3.066-2.146 2.146
                     a1.724 1.724 0 00-2.59.99c-.427 1.756-3.011 1.756-3.438 0
                     a1.724 1.724 0 00-2.59-.99c-1.398.92-3.066-.746-2.146-2.146
                     a1.724 1.724 0 00-.99-2.59c-1.756-.427-1.756-3.011 0-3.438
                     a1.724 1.724 0 00.99-2.59c-.92-1.398.746-3.066 2.146-2.146
                     .984.647 2.312.188 2.59-.99z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
          </div>
          <p className="text-3xl font-bold mb-4">$3,634.27</p>

          {/* Render expense items */}
          {expenseData.map(({ category, used, budget, dates }, idx) => {
            const leftover = budget - used;
            const usagePercent = Math.min((used / budget) * 100, 100).toFixed(0);
            const isUnderBudget = leftover >= 0;
            return (
              <div key={idx} className="mb-4">
                <h3 className="text-sm font-semibold">{category}</h3>
                <p className="text-xs text-gray-300">{dates}</p>
                <div className="relative w-full bg-gray-600 h-2 rounded-full mt-1">
                  <div
                    className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                <p className="text-xs mt-1">
                  {leftover >= 0
                    ? `$${leftover} left of $${budget}`
                    : `Over by $${Math.abs(leftover)} of $${budget}`
                  }
                  {' — '}
                  {isUnderBudget ? (
                    <span className="text-green-400 inline-flex items-center gap-1">
                      You’re doing great!
                      <span
                        className="inline-block w-4 h-4 bg-current"
                        style={{
                          maskImage: `url(${"images/thumbsup.png"})`,
                          WebkitMaskImage: `url(${"images/thumbsup.png"})`,
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain'
                        }}
                      />
                    </span>
                  ) : (
                    <span className="text-red-400 inline-flex items-center gap-1">
                      Needs work
                      <span
                        className="inline-block w-4 h-4 bg-current"
                        style={{
                          maskImage: `url(${"images/thumbsdown.png"})`,
                          WebkitMaskImage: `url(${"images/thumbsdown.png"})`,
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain'
                        }}
                      />
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetingOverview;
