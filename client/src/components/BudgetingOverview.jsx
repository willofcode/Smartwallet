'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './sideBar';

const BudgetingOverview = () => {
  // fetched budgets
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(false);

  // purely local: how much has been marked "spent" (not saved server-side)
  const [usedAmounts, setUsedAmounts] = useState({});
  const [editing, setEditing] = useState(null);   // which plan is in edit mode
  const [tempSpent, setTempSpent] = useState({}); // { [planName]: string }

  // category filter
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllBudgets();
  }, []);

  // pull in your existing budgets (budgetData.budget is the monthly allocation)
  const fetchAllBudgets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/get_all_budgets`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudgetData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('could not get all budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  // when you click “Save” it only updates local state
  const handleSaveSpent = (name) => {
    const val = Number(tempSpent[name]);
    if (isNaN(val)) {
      alert('Enter a valid number');
      return;
    }
    setUsedAmounts(prev => ({ ...prev, [name]: val }));
    setEditing(null);
  };

  // filter by category dropdown
  const searchCategory = () => {
    if (!searchTerm.trim()) return budgetData;
    return budgetData.filter(b =>
      b.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // totals for top summary
  const totalPlanned = budgetData.reduce((sum, b) => sum + (b.budget || 0), 0);
  const totalUsed    = Object.values(usedAmounts).reduce((sum, u) => sum + u, 0);
  const totalLeft    = Math.max(totalPlanned - totalUsed, 0);
  const monthName    = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="flex h-screen bg-[#1B203F] text-white">
      <Sidebar />

      <main className="flex-grow overflow-y-auto p-8">
        {/* TOP SUMMARY */}
        <section className="bg-[#2C325C] p-8 rounded-2xl shadow-md mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-5 rounded-full bg-purple-500" />
            <h2 className="font-medium text-gray-200">
              Left to spend for {monthName}
            </h2>
          </div>

          <p className="text-6xl font-extrabold mb-6">
            ${totalLeft.toFixed(2)}
          </p>

          <div className="relative w-full bg-gray-500/60 h-5 rounded-full">
            <div
              className="absolute top-0 left-0 h-5 bg-purple-500 rounded-full"
              style={{
                width: totalPlanned === 0
                  ? '0%'
                  : `${(totalLeft / totalPlanned) * 100}%`
              }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-400 mt-3">
            <span>$0</span>
            <span>${totalPlanned.toFixed(0)}</span>
          </div>
        </section>

        {/* BUDGET LIST */}
        <section className="bg-[#2C325C] p-6 rounded-2xl shadow-md">
          <div className="flex justify-between mb-6">
            <h2 className="font-semibold">Total Planned Expenses</h2>
            <Link to="/budgeting/planning">
              <button className="bg-purple-600 px-4 py-2 rounded-lg">
                Settings
              </button>
            </Link>
          </div>

          <select
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mb-6 px-4 py-2 bg-[#1B203F] rounded-md border border-gray-600"
          >
            <option value="">All Categories</option>
            {Array.from(new Set(budgetData.map(b => b.category))).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <p className="text-3xl font-bold mb-8">${totalPlanned}</p>

          {loading && <p>Loading budgets…</p>}
          {!loading && searchCategory().length === 0 && <p>No budgets found.</p>}

          {searchCategory().map((bgt, idx) => {
            const used    = usedAmounts[bgt.name] || 0;
            const left    = bgt.budget - used;
            const pct     = bgt.budget ? Math.min((used / bgt.budget) * 100, 100) : 0;
            const isUnder = left >= 0;

            return (
              <div key={idx} className="mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{bgt.name}</h3>
                  <button
                    onClick={() => {
                      setEditing(bgt.name);
                      setTempSpent({ [bgt.name]: used });
                    }}
                    className="text-blue-400 text-sm"
                  >
                    Edit Spent
                  </button>
                </div>

                <p className="text-xs text-gray-400 mb-1">
                  Category: {bgt.category}
                </p>

                {editing === bgt.name && (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="number"
                      value={tempSpent[bgt.name]}
                      onChange={e =>
                        setTempSpent({ [bgt.name]: e.target.value })
                      }
                      className="w-20 px-2 py-1 rounded-md bg-[#1B203F] border border-gray-600"
                    />
                    <button
                      onClick={() => handleSaveSpent(bgt.name)}
                      className="bg-green-600 px-2 py-1 rounded-md text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-600 px-2 py-1 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <div className="relative w-full bg-gray-600 h-5 rounded-full">
                  <div
                    className={`absolute top-0 left-0 h-5 ${
                      isUnder ? 'bg-purple-500' : 'bg-red-500'
                    } rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-xs mt-1">
                  {isUnder
                    ? `$${left} left of $${bgt.budget}`
                    : `Over by $${Math.abs(left)} of $${bgt.budget}`}
                  {' — '}
                  <span className={isUnder ? 'text-green-400' : 'text-red-400'}>
                    {isUnder ? 'On track' : 'Over budget'}
                  </span>
                </p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default BudgetingOverview;
