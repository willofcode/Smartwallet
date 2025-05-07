'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sideBar';
import axios from 'axios';
import PieChart from './PieChart';
import Chatbot from './Chatbot';

const Dashboard = () => {
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgetPlan, setBudgetPlan] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [totalUpcoming, setTotalUpcoming] = useState(0);
  const [userName, setUserName] = useState('');

  const formatDateWithSuffix = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });

    const getSuffix = (n) => {
      if (n >= 11 && n <= 13) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${month} ${day}${getSuffix(day)}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${import.meta.env.VITE_API_URL}/get_all_budgets`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBudgetPlan(Array.isArray(res.data) ? res.data : []));
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('accessToken');
    if (stored) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/get_transactions`, {
          access_token: stored,
        })
        .then(({ data }) => {
          setTransactions(data.transactions);
          setFilteredTransactions(data.transactions);
        });
    }
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts`);
        const { accounts } = response.data;
        setAccounts(accounts);
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchUserName = () => {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchUpcomingBills = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/recurring`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { outflow_streams = [] } = response.data.recurring_streams || {};
        const today = new Date();
        const next30 = new Date();
        next30.setDate(today.getDate() + 30);

        const bills = outflow_streams
          .map(bill => {
            const billDate = new Date(bill.predicted_next_date);
            billDate.setDate(billDate.getDate() + 1);
            return {
              merchant: bill.merchant_name || bill.description || 'Unknown',
              amount: bill.last_amount?.amount || 0,
              date: billDate,
            };
          })
          .filter(bill => bill.date >= today && bill.date <= next30)
          .sort((a, b) => a.date - b.date)
          .slice(0, 3);

        const total = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);

        setUpcomingBills(bills);
        setTotalUpcoming(total);
      } catch (err) {
        console.error('Failed to fetch upcoming bills:', err);
      }
    };

    fetchUpcomingBills();
  }, []);

  const filterDays = (d) => {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - d);
    setFilteredTransactions(
      transactions.filter((t) => {
        const dt = new Date(t.date);
        return dt >= past && dt <= now;
      })
    );
  };

  return (
    <div className="flex bg-[#1B203F] text-white">
      <Sidebar />
      <main className="flex-grow h-screen overflow-y-auto p-8">
        <div className="grid grid-cols-12 gap-6">
          <header className="col-span-12 bg-[#2C325C] rounded-2xl p-6">
            <h2 className="text-2xl">Your Financial Dashboard</h2>
            <p className="mb-4">Welcome back {userName || 'User'}</p>
            <div className="flex gap-2">
              <button onClick={() => filterDays(14)} className="px-4 py-2 rounded-lg bg-[#3a3f66] hover:bg-[#555a7c]">2 weeks</button>
              <button onClick={() => filterDays(30)} className="px-4 py-2 rounded-lg bg-[#3a3f66] hover:bg-[#555a7c]">1 month</button>
              <button onClick={() => filterDays(90)} className="px-4 py-2 rounded-lg bg-[#3a3f66] hover:bg-[#555a7c]">3 months</button>
            </div>
          </header>

          <section className="col-span-12 lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[#2C325C] rounded-2xl p-6 min-h-[500px] flex flex-col">
              <h3 className="text-lg mb-4">My Spending Overview</h3>
              <PieChart transactions={filteredTransactions} />
            </div>

            <div className="bg-[#2C325C] rounded-2xl p-6 flex-1 flex flex-col">
              <h3 className="text-lg mb-4">Improving Financial Habits</h3>
              <div className="grid grid-cols-2 gap-4 mt-auto">
                {budgetPlan.slice(0, 4).map((plan) => {
                  const end = new Date(plan.end_date);
                  const daysLeft = Math.max(0, Math.ceil((end - new Date()) / 86400000));
                  return (
                    <div key={plan._id} className="bg-white text-[#1B203F] rounded-md p-4 text-center">
                      {plan.category}<br />${plan.used || 0}/{plan.budget}
                      <br />
                      <span className="text-sm">{daysLeft} days left</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#2C325C] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Upcoming Bills</h3>
              <p className="text-sm text-gray-300 mb-4">
                Total Bills Due in Next 30 Days:{' '}
                <span className="text-white font-bold">${totalUpcoming.toFixed(2)}</span>
              </p>
              <ul className="divide-y divide-white/20 text-sm">
                {upcomingBills.map((b, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span>
                      <strong className="mr-3">
                        {formatDateWithSuffix(b.date)}
                      </strong>
                      {b.merchant}
                    </span>
                    <span>${parseFloat(b.amount).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2C325C] rounded-2xl p-6">
              <h3 className="text-lg mb-4">My Cards</h3>
              <div className="flex flex-col gap-4">
                {accounts.map((acc) => (
                  <div key={acc.account_id} className="bg-purple-600 p-4 rounded-xl shadow-md">
                    <div className="text-sm opacity-80">{acc.name}</div>
                    <div className="text-3xl font-bold mb-1">
                      ${acc.available?.toLocaleString() || '0'}
                    </div>
                    <div className="flex justify-between text-xs tracking-wide">
                      <span>**** {acc.mask || acc.account_id.slice(-4)}</span>
                      <span>{acc.currency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#2C325C] rounded-2xl p-6 flex-1 flex flex-col">
              <h3 className="text-lg mb-4">Spending Reduction Goals</h3>
              <p className="text-2xl mb-2">
                <strong>$3,000/$10,000</strong>
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mt-auto">
                Overall spending increased by 20%.<br />
                Weekly spending 2× more than last week.<br />
                Decrease entertainment spending by $100/month.
              </p>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>
    </div>
  );
};

export default Dashboard;