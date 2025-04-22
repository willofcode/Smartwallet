
'use client';

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
  const [searchTerm, setSearchTerm] = useState('')

  /// so he's fetching budgets here
  useEffect(() => {
    fetchAllBudgets();
  }, []);
  
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

      console.log("Fetched: ", response.data);
      //setBudgetData(response.data)// then send the budgetplan data to our user
      setBudgetData(Array.isArray(response.data) ? response.data : []); // we need to send an empty array otherwise null error
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

  /// Then I need to search by category 
  const searchCategory = () => {
    // idk how i want this to look beyond the base case...
    if (!Array.isArray(budgetData)){
      return [];
    }
    if (!searchTerm.trim()){
      return budgetData;
    }

    else{
      return budgetData.filter((bgt) =>
        bgt.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

  }

  // Sum up all planned budgets that were successfully fetched
  const totalPlanned = Array.isArray(budgetData)
  ? budgetData.reduce((acc, b) => {
      return b && b.budget ? acc + b.budget : acc;
    }, 0)
  : 0;

  // Example: If your “monthly budget” is $4,000 total, then “left to spend”:
  const leftToSpend = Math.max(4000 - totalPlanned, 0);

  return (
    <div className="flex h-screen bg-[#1B203F] text-white">
      <Sidebar />
  
      <div className="flex-grow overflow-y-auto p-8">

        {/* our summary for the budget */}
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
            <h2 className="text-sm md:text-base text-gray-200">
              Left to spend in the next 22 days
            </h2>
          </div>
          <p className="text-3xl font-bold text-white">
            ${leftToSpend.toFixed(2)}
          </p>
          <div className="relative w-full bg-gray-600 h-2 rounded-full mt-3">
            <div
              className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full"
              style={{ width: `${(leftToSpend / 4000) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>$0</span>
            <span>$4,000</span>
          </div>
        </div>
  
        {/* all budget plans  */}
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base text-gray-100 font-semibold">
              Total Planned Expenses
            </h2>
            <Link to="/budgeting/planning">
              <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition">
                Settings
              </button>
            </Link>
        </div>

          {/* category drop down */}
          <div className="mb-4">
            <select
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded-md bg-[#1B203F] border border-gray-600 w-full sm:w-60"
            >
              <option value="">All Categories</option>
              {Array.from(new Set(budgetData.map(bgt => bgt.category))).map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <p className="text-3xl font-bold text-white mb-6">
            ${totalPlanned.toFixed(2)}
          </p>
  
          {loading && <p className="text-gray-300">Loading budgets...</p>}
  
          {!loading && searchCategory().length === 0 && (
            <p className="text-gray-400">No matching categories found.</p>
          )}
  
          {!loading &&
            searchCategory().map((budgetObj, idx) => {
              if (!budgetObj) return null;
  
              const used = usedAmounts[budgetObj.name] || 0;
              const leftover = budgetObj.budget - used;
              const usagePercent = Math.min((used / budgetObj.budget) * 100, 100);
              const isUnderBudget = leftover >= 0;
  
              return (
                <div key={budgetObj._id || idx} className="mb-6">
                  <h3 className="text-sm font-semibold text-white">{budgetObj.name}</h3>
                  <p className="text-xs text-gray-400">Category: {budgetObj.category}</p>
                  <div className="relative w-full bg-gray-600 h-2 rounded-full mt-2">
                    <div
                      className={`absolute top-0 left-0 h-2 ${
                        isUnderBudget ? "bg-purple-500" : "bg-red-500"
                      } rounded-full`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1 text-gray-300">
                    {leftover >= 0
                      ? `$${leftover} left of $${budgetObj.budget}`
                      : `Over by $${Math.abs(leftover)} of $${budgetObj.budget}`}
                    {' — '}
                    {isUnderBudget ? (
                      <span className="text-green-400">You’re doing great!</span>
                    ) : (
                      <span className="text-red-400">Needs attention</span>
                    )}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}  

export default BudgetingOverview;

  /// I should be able to search for a budget by name
  // I'll ad the JWT here too since what for they know the name of another budget plan a
  // user should not be able to see the budget plan of another user.
  /*
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
  */