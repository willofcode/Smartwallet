// src/components/BudgetingOverview.jsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { Link } from 'react-router-dom';
import Sidebar from './sideBar';
import categoryCsv from './TempDataFiles/taxonomycategory.csv?raw';

const BudgetingOverview = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [primaryToDetailed, setPrimaryToDetailed] = useState({});
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [loadingtransaction, setLoadingtransaction] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);
  const [usedOverrides, setUsedOverrides] = useState({});
  const [editing, setEditing] = useState(null);
  const [tempSpent, setTempSpent] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllBudgets = async () => {
      setLoadingBudgets(true);
      try {
        const apiToken = localStorage.getItem('token');
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/get_all_budgets`,
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        setBudgetData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Could not fetch budgets:', err);
      } finally {
        setLoadingBudgets(false);
      }
    };
    fetchAllBudgets();
  }, []);

  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    const apiToken = localStorage.getItem('token');
    if (!storedAccessToken) return;

    setLoadingtransaction(true);
    axios.post(`${import.meta.env.VITE_API_URL}/get_transactions`,
      { access_token: storedAccessToken },
      { headers: { Authorization: `Bearer ${apiToken}` } }
    )
    .then(resp => {
      const { transactions } = resp.data;
      const now = new Date();
      const filtered = transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth()    === now.getMonth()
        );
      });
      setTransactions(filtered);
      setFilteredTransactions(filtered);
    })
    .catch(err => console.error('Error fetching transactions:', err))
    .finally(() => setLoadingtransaction(false));
  }, []);

 // parse taxonomy CSV

  useEffect(() => {
    setLoadingCats(true);
    Papa.parse(categoryCsv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: h => h.trim(),
      complete: ({ data }) => {
        // unique detailed list
        const details = data
          .map(row => row.DETAILED?.trim())
          .filter(Boolean)
          // 
          .filter((v,i,a) => a.indexOf(v) === i);
        setAllCategories(details);

        // map primary → [ detailed… ]
        const primary2detail = data.reduce((acc, row) => {
          const primary = row.PRIMARY?.trim();
          const detail = row.DETAILED?.trim();
          if (primary && detail) {
            if (!acc[primary]) acc[primary] = [];
            if (!acc[primary].includes(detail)) acc[primary].push(detail);
          }
          return acc;
        }, {});
        setPrimaryToDetailed(primary2detail);
      },
      error: err => {
        console.error('CSV parse error:', err);
        setLoadingCats(false);
      }
    });
  }, []);


  const usedAmounts = useMemo(() => {

    const auto = budgetData.reduce((acc, budget) => {
      acc[budget.name] = 0;
      return acc;
    }, {});
    
    transactions.forEach(transaction => {

      const primary = Array.isArray(transaction.personal_finance_category.primary)
        ? transaction.personal_finance_category.primary[0]
        : transaction.personal_finance_category.primary;

      const ds = primaryToDetailed[primary] || [];

      ds.forEach(detailedCat => {
        budgetData.forEach(budget => {
          if (budget.category === detailedCat) {
            auto[budget.name] += Math.abs(transaction.amount);
          }
        });
      });
    });

    return Object.keys(auto).reduce((acc, name) => {
      acc[name] = usedOverrides[name] ?? auto[name];
      return acc;
    }, {});
  }, [budgetData, transactions, usedOverrides, primaryToDetailed]);

  // manual “Edit Spent”
  const handleSaveSpent = name => {
    const val = Number(tempSpent[name]);
    if (isNaN(val)) {
      alert('Enter a valid number');
      return;
    }
    setUsedOverrides(prev => ({ ...prev, [name]: val }));
    setEditing(null);
  };

  // filter budgets by dropdown search
  const filteredBudgets = useMemo(() => {
    if (!searchTerm) return budgetData;
    return budgetData.filter(budget =>
      budget.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [budgetData, searchTerm]);


  const totalPlanned = budgetData.reduce((sum, budget) => sum + (budget.budget||0), 0);
  const totalUsed = Object.values(usedAmounts).reduce((sum, value) => sum + value, 0);
  const totalLeft = Math.max(totalPlanned - totalUsed, 0);
  const monthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="flex h-screen bg-[#1B203F] text-white">
      <Sidebar />

      <main className="flex-grow overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Budgeting Overview</h1>
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
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <p className="text-3xl font-bold mb-8">
            ${totalPlanned}
          </p>

          {loadingBudgets && <p>Loading budgets…</p>}
          {!loadingBudgets && filteredBudgets.length === 0 && <p>No budgets found.</p>}

          {filteredBudgets.map((bgt, idx) => {
            const used = usedAmounts[bgt.name] || 0;
            const left = bgt.budget - used;
            const percentage = bgt.budget ? Math.min((used / bgt.budget) * 100, 100) : 0;
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
                      value={tempSpent[bgt.name] || ''}
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
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="text-xs mt-1">
                  {isUnder
                    ? `$${left.toFixed(2)} left of $${bgt.budget.toFixed(2)}`
                    : `Over by $${Math.abs(left).toFixed(2)} of $${bgt.budget.toFixed(2)}`}
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
