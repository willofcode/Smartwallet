'use client';

import { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const TransactionsPage = () => {
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [linkToken, setLinkToken] = useState(null);
  const [isLinkReady, setIsLinkReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  // Fetch user ID and link token
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedLinkToken = localStorage.getItem('linkToken');

    if (storedUserId) {
      setUserId(storedUserId);
      if (storedLinkToken) {
        setLinkToken(storedLinkToken);
        setIsLinkReady(true);
      } else {
        setError('Link token not found. Please try again.');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken) => {
      try {
        setIsLoading(true);
        const accessTokenResponse = await axios.post(`${config.API_URL}/get_access_token`, {
          public_token: publicToken,
        });

        const { access_token } = accessTokenResponse.data;
        if (access_token) {
          const transactionsResponse = await axios.post(`${config.API_URL}/get_transactions`, {
            access_token,
          });

          const { transactions, accounts } = transactionsResponse.data;
          if (transactions && accounts) {
            const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(sortedTransactions);
            setAccounts(accounts);
            setFilteredTransactions(sortedTransactions); 
          } else {
            setError('Failed to fetch transactions.');
          }
        } else {
          setError('Failed to obtain access token.');
        }
      } catch (err) {
        setError('Error fetching transactions.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('linkToken');
    setUserId(null);
    navigate('/');
  };

  const getAccountDetails = (accountId) => {
    const account = accounts.find(acc => acc.account_id === accountId);
    return account ? `${account.name}` : 'Unknown Account';
  };

  const handleDateFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });

    setFilteredTransactions(filtered);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Navbar />

      {/* main content */}
      <main className="content flex-grow p-8">
        <header className="summary-header bg-indigo-600 text-white p-6 rounded-lg shadow-lg mb-6 flex justify-between">
          <h1 className="text-4xl font-semibold">Your Transactions</h1>

          {/* Date Range Filters */}
          <div className="mb-6">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mr-4 p-2 border rounded-lg"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mr-4 p-2 border rounded-lg"
            />
            <button
              onClick={handleDateFilter}
              className="mr-4 p-2 border bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              Filter Dates
            </button>
          </div>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          {userId ? (
            <>
              {error && <div className="text-red-600 mb-4">{error}</div>}
              {isLinkReady ? (
                <button
                  onClick={() => open()}
                  disabled={!ready}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 mb-6"
                >
                  Link Bank Account
                </button>
              ) : isLoading ? (
                <div className="mt-4 text-center text-gray-600">Generating Plaid Link...</div>
              ) : (
                <div className="mt-4 text-center text-red-600">Error creating link token. Please try again later.</div>
              )}

              <div className="transactions-list mt-8">
                {filteredTransactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white table-auto rounded-lg shadow-sm">
                      <thead className="bg-indigo-600 text-white">
                        <tr>
                          <th className="py-3 px-4 text-left">Merchant</th>
                          <th className="py-3 px-4 text-left">Category</th>
                          <th className="py-3 px-4 text-left">Amount</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Account</th>
                        </tr>
                      </thead>

                      {/* Transaction Data Table */}
                      <tbody>
                        {filteredTransactions.map((transaction, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{transaction.merchant_name || transaction.name || 'Unknown'}</td>
                            <td className="py-3 px-4">{transaction.category || 'Unknown'}</td>
                            <td className={`py-3 px-4 ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">{transaction.date}</td>
                            <td className="py-3 px-4">{getAccountDetails(transaction.account_id)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : isLoading ? (
                  <div className="text-center text-gray-600">Fetching transactions...</div>
                ) : (
                  <div className="text-center text-gray-600">No transactions to display.</div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600">You are not logged in. Please log in to view your transactions.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionsPage;