import { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const TransactionsPage = () => {
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [linkToken, setLinkToken] = useState(null);
  const [isLinkReady, setIsLinkReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for transactions
  const navigate = useNavigate(); // useNavigate for routing

  // Fetch userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      createLinkToken(storedUserId);
    } else {
      navigate('/login'); // Redirect to login if no userId found
    }
  }, [navigate]);

  // Create Plaid Link Token
  const createLinkToken = async (uid) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${config.API_URL}/create_link_token`, {
        uid,
      });
      if (response.data.link_token) {
        setLinkToken(response.data.link_token);
        setIsLinkReady(true);  // Set ready state to true when the link token is created
      } else {
        setError('Failed to create Plaid link token.');
      }
    } catch (err) {
      console.error('Error creating link token:', err);
      setError('Error creating link token.');
    } finally {
      setIsLoading(false);
    }
  };

  // Plaid Link success callback
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken) => {
      try {
        setIsLoading(true);
        // Step 1: Get access token from the public token
        const accessTokenResponse = await axios.post(`${import.meta.env.VITE_API_URL}/get_access_token`, {
          public_token: publicToken,
        });

        const { access_token } = accessTokenResponse.data;
        if (access_token) {
          // Step 2: Fetch transactions using the access token
          const transactionsResponse = await axios.post(`${import.meta.env.VITE_API_URL}/get_transactions`, {
            access_token: access_token,
          });

          const { transactions } = transactionsResponse.data;
          if (transactions) {
            setTransactions(transactions); // Set transactions in state
          } else {
            setError('Failed to fetch transactions.');
          }
        } else {
          setError('Failed to obtain access token.');
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
    setUserId(null); 
    navigate('/');  // Redirect to home or login page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-6 shadow-lg">
        <h1 className="text-4xl font-semibold text-center">Your Transactions</h1>
      </header>
  
      <main className="max-w-3xl mx-auto p-8">
        {userId ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg font-medium mb-4">
              Logged In as <span className="font-semibold text-indigo-600">{userId}</span>
            </p>
            {error && <div className="text-red-600 mb-4">{error}</div>}
  
            {isLinkReady ? (
              <button 
                onClick={() => open()} 
                disabled={!ready} 
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200">
                Link Bank Account
              </button>
            ) : isLoading ? (
              <div className="mt-4 text-center text-gray-600">Generating Plaid Link...</div>
            ) : (
              <div className="mt-4 text-center text-red-600">Error creating link token. Please try again later.</div>
            )}
  
            <div className="mt-8">
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white table-auto rounded-lg shadow-sm">
                    <thead className="bg-indigo-600 text-white">
                      <tr>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Amount</th>
                        <th className="py-3 px-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{transaction.name}</td>
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

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 mt-8">
              Logout
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg text-center text-gray-600">You are not logged in. Please log in to view your transactions.</p>
          </div>
        )}
      </main>
    </div>
  );
};  

export default TransactionsPage;