'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sideBar';
import Chatbot from './Chatbot';

async function getRecurringTransactions() {
  const access_token = sessionStorage.getItem('accessToken');
  if (!access_token) {
    throw new Error('No Plaid access token found. Please link your bank account.');
  }

  const authToken = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const resp = await axios.post(
    `${import.meta.env.VITE_API_URL}/get_recurring_transactions`,
    { access_token },
    { headers }
  );
  return resp.data.recurring;
}

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [accounts, setAccounts] = useState([]);    
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const acc = sessionStorage.getItem('accounts');
    if (acc) {
      try {
        setAccounts(JSON.parse(acc));
      } catch {
        console.warn('Failed to parse sessionStorage.accounts');
      }
    }

    // 2) fetch bills
    (async () => {
      try {
        const recurring = await getRecurringTransactions();
        setBills(recurring);
      } catch (err) {
        setError(err.message || 'Failed to load bills.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getAmountColor = (amt) => (amt < 0 ? 'text-red-500' : 'text-green-500');

  const findAccountName = (id) => {
    if (!id || !accounts.length) return '—';
    let acct = accounts.find(a => a.account_id === id)
            || accounts.find(a => a.persistent_account_id === id);
    return acct?.name || acct?.official_name || 'Unknown account';
  };

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      <Sidebar />

      <div className="flex-grow overflow-y-auto p-8">
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full">
          <h1 className="text-2xl font-bold mb-4">Recurring Bills</h1>

          {isLoading && <p>Loading your bills…</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!isLoading && !error && (
            <>

              <div className="grid grid-cols-5 gap-4 text-sm font-bold mb-2">
                <span>Merchant</span>
                <span>Account ID</span>
                <span>Amount</span>
                <span>Account Name</span>
                <span>Last Date</span>
              </div>

              {bills.map((b, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 gap-4 p-4 mb-2 bg-[#1B203F] rounded-lg"
                >
                  <span>{b.merchant_name}</span>
                  <span className="max-w-[160px] truncate">
                    {b.account_id ?? '—'}
                  </span>
                  <span className={getAmountColor(b.amount)}>
                    ${b.amount.toFixed(2)}
                  </span>
                  <span className="truncate">
                    {findAccountName(b.account_id)}
                  </span>
                  <span>{b.last_date}</span>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="fixed bottom-6 right-6 z-50">
          <Chatbot />
        </div>
      </div>
    </div>
  );
}
