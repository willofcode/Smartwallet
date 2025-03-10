import { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const TransactionsPage = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [transactions, setTransactions] = useState([]);
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
      fetchUserName(storedUserId);
      if (storedLinkToken) {
        setLinkToken(storedLinkToken);
        setIsLinkReady(true);
      } else {
        setError('Link token not found. Please try again.');
        console.error('Link token not found in local storage');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchUserName = async (id) => {
    console.log("Fetching user name for ID:", id);
    try {
      const response = await axios.get(`${config.API_URL}/getUser/${id}`);
      console.log("User API Response:", response.data);
      if (response.data.name) {
        setUserName(response.data.name);
      } else {
        setUserName('User');
      }
    } catch (err) {
      console.error('Error fetching user name:', err);
      setUserName('User');
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

        const { access_token } = accessTokenResponse.data;
        if (access_token) {
          const transactionsResponse = await axios.post(`${config.API_URL}/get_transactions`, {
            access_token: access_token,
          });

          const { transactions } = transactionsResponse.data;
          if (transactions) {
            setTransactions(transactions);
          } else {
            setError('Failed to fetch transactions.');
            console.error('No transactions data returned.');
          }
        } else {
          setError('Failed to obtain access token.');
          console.error('Access token was not obtained.');
        }
      } catch (err) {
        console.error('Error exchanging public token or fetching transactions:', err);
        setError('Error exchanging public token or fetching transactions.');
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="sidebar w-60 bg-indigo-800 text-white p-6">
        <div className="top mb-8">
          <div className="logo text-2xl font-semibold">SmartWallet</div>
        </div>

        <div className="user flex items-center mb-8">
          <img src="pfp.jpg" alt="profile picture" className="user-img w-12 h-12 rounded-full mr-4" />
          <div>
            <p className="font-semibold">{userName}</p>
            <p className="text-sm">User</p>
          </div>
        </div>

        <ul className="space-y-4">
          <li><a href="#" className="hover:text-indigo-400">Dashboard</a></li>
          <li className="active"><a href="#" className="text-indigo-400">Transactions</a></li>
          <li><a href="#" className="hover:text-indigo-400">Wallet</a></li>
          <li><a href="#" className="hover:text-indigo-400">Advisor</a></li>
          <li><a href="#" className="hover:text-indigo-400">Budgeting</a></li>
          <li><a href="#" className="hover:text-indigo-400">Bills</a></li>
          <li><a href="#" className="text-red-500" onClick={handleLogout}>Logout</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <main className="content flex-grow p-8">
        <header className="summary-header bg-indigo-600 text-white p-6 rounded-lg shadow-lg mb-6 flex justify-between">
          <h1 className="text-4xl font-semibold">Your Transactions</h1>
          <span className="date-range bg-indigo-700 p-2 rounded-lg">DATE: 01/19/23 - 11/25/2024</span>
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
                {transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white table-auto rounded-lg shadow-sm">
                      <thead className="bg-indigo-600 text-white">
                        <tr>
                          <th className="py-3 px-4 text-left">Merchant</th>
                          <th className="py-3 px-4 text-left">Account</th>
                          <th className="py-3 px-4 text-left">Amount</th>
                          <th className="py-3 px-4 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{transaction.merchant}</td>
                            <td className="py-3 px-4">{transaction.account}</td>
                            <td className={`py-3 px-4 ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">{transaction.date}</td>
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