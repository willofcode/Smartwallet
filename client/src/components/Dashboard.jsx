'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import LineChart from './LineChart';
import PieChart from './PieChart';
import Navbar from './Navbar';
import Sidebar from '../sidebar/sidebar';

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [linkToken, setLinkToken] = useState(null);
  const [isLinkReady, setIsLinkReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedLinkToken = localStorage.getItem('linkToken');

    if (storedUserId) {
      setUserId(storedUserId);
      if (storedLinkToken) {
        setLinkToken(storedLinkToken);
        setIsLinkReady(true);
      } else {
        generateLinkToken();
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const generateLinkToken = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${config.API_URL}/create_link_token`, {
        user_id: userId,
      });
      const { link_token } = response.data;
      if (link_token) {
        setLinkToken(link_token);
        localStorage.setItem('linkToken', link_token);
        setIsLinkReady(true);
      } else {
        setError('Failed to generate link token.');
      }
    } catch (err) {
      setError('Error generating link token.');
    } finally {
      setIsLoading(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken) => {
      try {
        setIsLoading(true);
        const accessTokenResponse = await axios.post(`${config.API_URL}/get_access_token`, {
          public_token: publicToken,
        });
        localStorage.setItem('publicToken', publicToken);

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

  const getAccountDetails = (accountId) => {
    const account = accounts.find(acc => acc.account_id === accountId);
    return account ? `${account.name}` : 'Unknown Account';
  };

// filter by days/weeks/months utilize days for accurate and easy logic 

  const handleDayFilter = (days) => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days); // subtract days from current date

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= pastDate && transactionDate <= now;
    });

    console.log(`Filtered for last ${days} days:`, filtered);
    setFilteredTransactions(filtered);
  };

  // group by category logic for transactions

  const grouped = useMemo(() => { // cache and update result transactions
    const groupedData = {};
    filteredTransactions.forEach((transaction) => {
      const category = Array.isArray(transaction.category) ? transaction.category[0] : transaction.category || 'Uncategorized'; // get first category
      if (!groupedData[category]) { // if category doesn't exists, create new array
        groupedData[category] = [];
      }
      groupedData[category].push(transaction);
    });
    return Object.entries(groupedData);
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen flex bg-gray-900">
      <Sidebar />
      <main className="content flex-grow p-8">
        <header className="summary-header bg-[#3a3f66] text-white p-6 rounded-lg shadow-lg mb-6 flex justify-between">
          <h1 className="text-4xl font-semibold">Dashboard</h1>
          <div className="mb-6 flex items-center space-x-4">
            <button
              onClick={() => handleDayFilter(14)}
              className="p-2 bg-[#3a3f66] text-white rounded-lg hover:bg-[#555a7c]"
            >
              Last 2 week
            </button>
            <button
              onClick={() => handleDayFilter(30)}
              className="p-2 bg-[#3a3f66] text-white rounded-lg hover:bg-[#555a7c]"
            >
              Last Month
            </button>
            <button
              onClick={() => handleDayFilter(90)}
              className="p-2 bg-[#3a3f66] text-white rounded-lg hover:bg-[#555a7c]"
            >
              Last 3 Months
            </button>
          </div>
        </header>
        <PieChart transactions={filteredTransactions} /> 
        <div className="bg-[#292d52] p-6 rounded-lg shadow-lg">
          {userId ? (
            <>
              {error && <div className="text-red-600 mb-4">{error}</div>}
              {isLinkReady ? (
                <button
                  onClick={() => open()}
                  disabled={!ready}
                  className="w-full bg-[#3a3f66] text-white py-3 px-4 rounded-lg hover:bg-[#555a7c] transition duration-200 mb-6"
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
                    <table className="min-w-full bg-[#1b1d33] table-auto rounded-lg shadow-sm">
                      <thead className="bg-[#3a3f66] text-white">
                        <tr>
                          <th className="py-3 px-4 text-left">Merchant</th>
                          <th className="py-3 px-4 text-left">Category</th>
                          <th className="py-3 px-4 text-left">Amount</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Account</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grouped.map(([category, trans]) => (
                          <React.Fragment key={category}>
                            <tr className="bg-[#444a78] text-white">
                              <td colSpan={5} className="py-2 px-4 font-semibold">
                                {category}
                              </td>
                            </tr>
                            {trans.map((transaction, index) => (
                              <tr key={`${category}-${index}`} className="border-b hover:bg-[#555a7c] text-white">
                                <td className="py-3 px-4">{transaction.merchant_name || transaction.name || 'Unknown'}</td>
                                <td className="py-3 px-4">{Array.isArray(transaction.category) ? transaction.category.join(', ') : transaction.category || 'Unknown'}</td>
                                <td className={`py-3 px-4 ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>${transaction.amount.toFixed(2)}</td>
                                <td className="py-3 px-4">{transaction.date}</td>
                                <td className="py-3 px-4">{getAccountDetails(transaction.account_id)}</td>
                              </tr>
                            ))}
                          </React.Fragment>
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

export default Dashboard;
