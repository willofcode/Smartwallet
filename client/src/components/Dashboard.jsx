'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from "../components/sideBar";
import axios from 'axios';
import PieChart from './PieChart';
import Chatbot from './Chatbot';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// helper to pull recurring bills
async function getRecurringTransactions() {
  const access_token = sessionStorage.getItem('accessToken');
  if (!access_token) throw new Error('No Plaid access token.');
  const authToken = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const resp = await axios.post(
    `${import.meta.env.VITE_API_URL}/get_recurring_transactions`,
    { access_token },
    { headers }
  );
  return resp.data.recurring;
}

const Dashboard = () => {
  const user = localStorage.getItem('userName') || 'User';

  // Transactions & Filters
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;
    axios.post(`${import.meta.env.VITE_API_URL}/get_transactions`, { access_token: token })
      .then(r => {
        setTransactions(r.data.transactions);
        setFilteredTransactions(r.data.transactions);
      })
      .catch(() => console.log('Failed to fetch transactions'));
  }, []);

  const handleDayFilter = days => {
    const now = new Date();
    const past = new Date(now);
    past.setDate(now.getDate() - days);
    setFilteredTransactions(
      transactions.filter(t => {
        const d = new Date(t.date);
        return d >= past && d <= now;
      })
    );
  };

  // Budgets & Habit Stats
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [budgetData, setBudgetData] = useState([]);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  useEffect(() => {
    const fetchBudgets = async () => {
      setLoadingBudgets(true);
      try {
        const apiToken = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/get_all_budgets`,
          {
            headers: { Authorization: `Bearer ${apiToken}` },
            params: { month: selectedMonth }
          }
        );
        setBudgetData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Could not fetch budgets:', err);
        setBudgetData([]);
      } finally {
        setLoadingBudgets(false);
      }
    };
    fetchBudgets();
  }, [selectedMonth]);

  const habitStats = useMemo(() => {
    return budgetData.map(b => {
      const spent = filteredTransactions
        .filter(tx => tx.personal_finance_category?.detail === b.category)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      const percent = b.budget > 0
        ? Math.min((spent / b.budget) * 100, 100).toFixed(0)
        : '0';
      return {
        name: b.name,
        detail: b.category,
        budget: b.budget,
        spent,
        percent
      };
    });
  }, [budgetData, filteredTransactions]);

  // Recurring Transactions
  const [bills, setBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [billsError, setBillsError] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const rec = await getRecurringTransactions();
        setBills(rec);
      } catch (err) {
        setBillsError(err.message || 'Failed to load recurring transactions.');
      } finally {
        setBillsError(false);
        setLoadingBills(false);
      }
    })();
  }, []);

  // Accounts (horizontal scroll)
  const [accounts, setAccounts] = useState([]);
  const [acctError, setAcctError] = useState('');
  useEffect(() => {
    const raw = sessionStorage.getItem('accounts');
    if (!raw) {
      setAcctError('No account data found. Go to Transactions and link your bank.');
      return;
    }
    try {
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) throw new Error('Invalid format');
      setAccounts(arr);
    } catch (err) {
      console.warn('Invalid accounts in sessionStorage:', err);
      sessionStorage.removeItem('accounts');
      setAcctError('Please reload Transactions to re-link accounts.');
    }
  }, []);

  return (
    <div className="flex h-screen bg-[#1B203F] text-white">
      <Sidebar />
      <div className="flex-grow overflow-y-auto p-8">

        {/* Header + Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md col-span-1 md:col-span-3 min-h-[200px]">
            <h2 className="text-3xl font-semibold mb-4">Your Financial Dashboard</h2>
            <p className="mb-4">Welcome back, {user}!</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleDayFilter(14)}
                className="p-2 bg-[#3a3f66] rounded-lg hover:bg-[#555a7c]"
              >2 Weeks</button>
              <button
                onClick={() => handleDayFilter(30)}
                className="p-2 bg-[#3a3f66] rounded-lg hover:bg-[#555a7c]"
              >1 Month</button>
              <button
                onClick={() => handleDayFilter(90)}
                className="p-2 bg-[#3a3f66] rounded-lg hover:bg-[#555a7c]"
              >3 Months</button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[20fr_16fr] gap-6 mt-6">

          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Spending Overview */}
            <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md flex-1 min-h-[240px]">
              <h3 className="text-xl font-semibold mb-4">My Spending Overview</h3>
              <PieChart transactions={filteredTransactions} />
            </div>

            {/* Improving Financial Habits */}
            <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold mb-4">Improving Financial Habits</h3>
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(Number(e.target.value))}
                  className="bg-[#3a3f66] p-2 rounded text-white"
                >
                  {MONTH_NAMES.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              {loadingBudgets ? (
                <p>Loading budgets…</p>
              ) : budgetData.length === 0 ? (
                <p>No budgets set for this month.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {habitStats.map((h, idx) => (
                    <div
                      key={idx}
                      className="bg-white text-[#1B203F] p-4 rounded-md text-center"
                    >
                      <div className="font-medium">{h.name}</div>
                      <div>{`${h.spent}/${h.budget}`}</div>
                      <div className="text-sm">{`${h.percent}% of budget`}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">

            {/* Recent Recurring Transactions */}
            <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md flex flex-col max-h-[300px]">
              <h3 className="text-xl font-semibold mb-4">Recent Bills</h3>
              {loadingBills ? (
                <p>Loading...</p>
              ) : billsError ? (
                <p className="text-red-400">{billsError}</p>
              ) : (
                <div className="overflow-y-auto divide-y divide-white/30 flex-1">
                  {bills.slice(0, 5).map((bill, i) => {
                    const d = new Date(bill.last_date);
                    return (
                      <div key={i} className="py-2 flex justify-between items-center">
                        <div>
                          <span className="font-semibold mr-4">
                            {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          {bill.merchant_name}
                        </div>
                        <div>${parseFloat(bill.amount).toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* My Accounts (scrollable) */}
            <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">My Accounts</h3>
              {acctError ? (
                <p className="text-red-400">{acctError}</p>
              ) : (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {accounts.map((acct, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-52 p-4 rounded-xl bg-gradient-to-r from-[#6C1BD8] to-[#B713E9] text-white shadow-md"
                    >
                      <div className="text-sm opacity-80 mb-1">{acct.name}</div>
                      <div className="text-3xl font-bold mb-2">
                        ${acct.balances?.current?.toLocaleString()}
                      </div>
                      <div className="text-xs flex justify-between text-white/90 tracking-wide">
                        <span>**** {acct.mask}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Spending Reduction Goals */}
            <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Spending Reduction Goals</h3>
              <div className="space-y-2">
                <p className="text-2xl"><strong>$3,000/$10,000</strong></p>
                <p>Overall spending increased by 20%.</p>
                <p>Weekly spending 2x more than last week.</p>
                <p>Decrease entertainment spending by $100/month.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className='fixed bottom-6 right-6 z-50'>
        <Chatbot />
      </div>
    </div>
  );
};

export default Dashboard;
