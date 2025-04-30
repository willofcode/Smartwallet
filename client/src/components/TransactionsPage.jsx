'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sideBar';

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

  // check if user is logged in
  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (!stored) return navigate('/');
    setUserId(stored);
    // immediately fetch a fresh link token…
    generateLinkToken(stored);
  }, [navigate]);

  // check if link token is ready
  const generateLinkToken = useCallback(async (uid) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/create_link_token`,
        { uid },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }                
      );
      setLinkToken(data.link_token);
      setIsLinkReady(true);
    } catch (err) {
      console.error('Failed to generate link token', err);
      setError('Unable to initialize Plaid Link.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // check if user is logged in
  const onSuccess = useCallback(async (public_token) => {
    setIsLoading(true);
    try {
      // exchange for an access token
      const accessTokenResponse = await axios.post(`${import.meta.env.VITE_API_URL}/get_access_token`,
        { public_token }
      );
      const accessToken = accessTokenResponse.data.access_token;
      sessionStorage.setItem('accessToken', accessToken);

      // fetch all transactions + accounts
      const transactionsResponse  = await axios.post(`${import.meta.env.VITE_API_URL}/get_transactions`,
        { access_token: accessToken }
      );
      
      const { transactions, accounts } = transactionsResponse.data;
      if (transactions && accounts) { 
        const sortedTransactions = transactionsResponse .data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sortedTransactions);
        setAccounts(transactionsResponse .data.accounts);
        setFiltered(sortedTransactions);
      }
    } catch {
      setError('Error fetching transactions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onError: (err) => {
      console.error('Plaid Link error:', err);
      setError('Plaid Link failed to open.');
    },
  });
  
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
    <div className="flex h-screen bg-[#1B203F] text-white">
      <Sidebar />
      <div className="flex-grow overflow-y-auto p-8">
      <div className="min-h-screen flex bg-gray-900">

      <main className="content flex-grow p-8">
        <header className="summary-header bg-[#3a3f66] text-white p-6 rounded-lg shadow-lg mb-6 flex justify-between">
          <h1 className="text-4xl font-semibold">Transactions</h1>

          {/* range filter */}
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
              className="mr-4 p-2 border bg-[#3a3f66] text-white py-2 px-4 rounded-lg hover:bg-[#555a7c]"
            >
              Filter Dates
            </button>
          </div>
        </header>

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

                      {/* transactions table */}
                      <tbody>
                        {filteredTransactions.map((transaction, index) => (
                          <tr key={index} className="border-b hover:bg-[#555a7c] text-white">
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
    </div>
    </div>
  );
};

export default TransactionsPage;
