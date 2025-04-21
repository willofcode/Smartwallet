
'use client';
/*
  the main idea here: WHAT SHOULD OVERVIEW DO?

  GET our budgets by name (basically filter by budget name to view a specific budget) <-- medium
  GET our budgets by category in a group (filter by budget category) <-- hardest cuz it's client side
  GET all budgets <--- easiest

*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './sideBar';

const BudgetingOverview = () => {
  /// I'm thinking we can have categories here for later so that we're properly grouping by our
  /// category on the overview.
  const categories = [
    "Housing",
    "Food",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Personal Care",
    "Education",
    "Misc",
  ];
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usedAmounts, setUsedAmounts] = useState({});

  /// so he's fetching budgets here
  useEffect(() => {
    fetchBudgets();
  }, []);

  /// This might need to be redone since we don't want to get by category here since... that
  /// endpoint doesn't exist...

  /// GET all budgets <--- easiest
  /// the goal here should be that we're getting budget plans specific to that user 
  const fetchAllBudgets = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token'); // so here we need their token
      
      // then I can grab all their budgetplans
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get_all_budgets`, { 
        headers: {
          Authorization: `Bearer ${token}`, // here I'm checking to see the user's JWT token.
        }
      });

      setBudgetData(response.data)// then send the budgetplan data to our user
    }
    /// from here it's just error hadnling 
    catch(error){
      console.error("could not get all budgets: ", error);
    }
    /// then we can cut the loading 
    finally{
      setLoading(false);
    }

  };

  // I'll ad the JWT here too since what for they know the name of another budget plan a
  // user should not be able to see the budget plan of another user.
  const fetchBudgetFromName = async (name) => {
    try {
      setLoading(true);// we have to actually load in our budgets

      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get_budget/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // I'll add a log if I'm not able to seethe data properly.
      setBudgetData(response.data);

      }
    // if anything goes wrong we'll throw an error
    catch(error){
      console.error("could not fetch by name: ", error);
    }
    // then we can cut the loading 
    finally {
      setLoading(false);
    }

  };

  // Sum up all planned budgets that were successfully fetched
  const totalPlanned = budgetData.reduce((acc, b) => {
    return b && b.budget ? acc + b.budget : acc;
  }, 0);

  // Example: If your “monthly budget” is $4,000 total, then “left to spend”:
  const leftToSpend = Math.max(4000 - totalPlanned, 0);

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      <Sidebar />

      {/* Main Content Container */}
      <div className="flex-grow overflow-y-auto p-8">
        {/* Card 1: Left to Spend */}
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
            <h2 className="text-sm md:text-base">
              Left to spend in the next 22 days
            </h2>
          </div>
          <p className="text-3xl font-bold mb-2">
            ${leftToSpend.toFixed(2)}
          </p>
          {/* Progress bar (relative to 4000) */}
          <div className="relative w-full bg-gray-600 h-2 rounded-full">
            <div
              className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full"
              style={{ width: `${(leftToSpend / 4000) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span>$0</span>
            <span>$4,000</span>
          </div>
        </div>

        {/* Card 2: Total Planned Expenses */}
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
          <p className="text-3xl font-bold mb-4">
            ${totalPlanned.toFixed(2)}
          </p>

          {loading && <p className="text-gray-300">Loading budgets...</p>}

          {/* Render the budgets we fetched (one for each known category) */}
          {budgetData.map((budgetObj, idx) => {
            if (!budgetObj) {
              return (
                <div key={idx} className="mb-4 text-red-400">
                  No budget found for "{categories[idx]}".
                </div>
              );
            }

            const used = usedAmounts[budgetObj.name] || 0; // Example usage
            const leftover = budgetObj.budget - used;
            const usagePercent = Math.min((used / budgetObj.budget) * 100, 100);
            const isUnderBudget = leftover >= 0;

            return (
              <div key={budgetObj._id || idx} className="mb-4">
                <h3 className="text-sm font-semibold">{budgetObj.name}</h3>
                <p className="text-xs text-gray-300">
                  Category: {budgetObj.category}
                </p>
                <div className="relative w-full bg-gray-600 h-2 rounded-full mt-1">
                  <div
                    className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                <p className="text-xs mt-1">
                  {leftover >= 0
                    ? `$${leftover} left of $${budgetObj.budget}`
                    : `Over by $${Math.abs(leftover)} of $${budgetObj.budget}`
                  }
                  {' — '}
                  {isUnderBudget ? (
                    <span className="text-green-400 inline-flex items-center gap-1">
                      You’re doing great!
                    </span>
                  ) : (
                    <span className="text-red-400 inline-flex items-center gap-1">
                      Needs work
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
