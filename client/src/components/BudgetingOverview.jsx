'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './sideBar';

const BudgetingOverview = () => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchAllBudgets();
  }, []);

  const fetchAllBudgets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get_all_budgets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBudgetData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("could not get all budgets: ", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserBudget = async () => {
    try {
      setLoading(true);
      setUpdateMessage('');

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setUpdateMessage('Missing token or user ID.');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/update_budget`, {
        params: {
          accessToken: token,
          userId: userId,
        },
      });

      setUpdateMessage(response.data.message || 'Budget updated successfully!');
      fetchAllBudgets();
    } catch (error) {
      setUpdateMessage('Failed to update budget.');
      console.error("Error updating budget:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchCategory = () => {
    if (!Array.isArray(budgetData)) {
      return [];
    }
    if (!searchTerm.trim()) {
      return budgetData;
    } else {
      return budgetData.filter((bgt) =>
        bgt.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  const totalPlanned = Array.isArray(budgetData)
    ? budgetData.reduce((acc, b) => (b && b.budget ? acc + b.budget : acc), 0)
    : 0;

  const monthlyBudget = totalPlanned;
  const leftToSpend = monthlyBudget;

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="flex h-screen bg-[#1B203F] text-white">
      <Sidebar />

      <div className="flex-grow overflow-y-auto p-8">
        <div className="bg-[#2C325C] p-8 rounded-2xl shadow-md w-full mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block w-3 h-5 rounded-full bg-purple-500" />
            <h2 className="text-base md:text-lg font-medium text-gray-200">
              Left to spend for {currentMonthName}
            </h2>
          </div>

          <div className="pl-6">
            <p className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              ${leftToSpend.toFixed(2)}
            </p>
          </div>

          <div>
            <div className="relative w-full bg-gray-500/60 h-5 rounded-full">
              <div
                className="absolute top-0 left-0 h-5 bg-purple-500 rounded-full"
                style={{ width: `${monthlyBudget === 0 ? 0 : 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-3">
              <span>$0</span>
              <span>${monthlyBudget.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm md:text-base text-gray-100 font-semibold">
              Total Planned Expenses
            </h2>
            <Link to="/budgeting/planning">
              <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition">
                Settings
              </button>
            </Link>
          </div>

          <div className="mb-6">
            <select
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 rounded-md bg-[#1B203F] border border-gray-600 w-full sm:w-60"
            >
              <option value="">All Categories</option>
              {Array.from(new Set(budgetData.map(bgt => bgt.category))).map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <p className="text-3xl font-bold text-white mb-8">
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
                <div key={budgetObj._id || idx} className="mb-8">
                  <h3 className="text-sm font-semibold text-white">{budgetObj.name}</h3>
                  <p className="text-xs text-gray-400">Category: {budgetObj.category}</p>
                  <div className="relative w-full bg-gray-600 h-5 rounded-full mt-2">
                    <div
                      className={`absolute top-0 left-0 h-5 ${isUnderBudget ? "bg-purple-500" : "bg-red-500"} rounded-full`}
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

          <button
            onClick={updateUserBudget}
            className="mt-8 w-full py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            Update Budget with Plaid Expenses
          </button>
          {updateMessage && (
            <p className="mt-4 text-center text-white">{updateMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetingOverview;