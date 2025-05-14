import { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sideBar';
import Chatbot from './Chatbot';
import TransactionsTable from './TransactionsTable';

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

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedAccessToken = sessionStorage.getItem('accessToken');
    const storedLinkToken = localStorage.getItem('linkToken');

    if (!storedUserId) {
      navigate('/');
      return;
    }

    setUserId(storedUserId);

    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (storedAccessToken) {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/get_transactions`, {
            access_token: storedAccessToken,
          });

          const { transactions, accounts } = response.data;
          if (transactions && accounts) {
            sessionStorage.setItem('accounts', JSON.stringify(accounts));
            const sorted = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(sorted);
            setFilteredTransactions(sorted);
            setAccounts(accounts);
          }
        }

        if (storedLinkToken) {
          setLinkToken(storedLinkToken);
          setIsLinkReady(true);
        } else {
          await generateLinkToken();
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch transactions.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const generateLinkToken = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create_link_token`, {
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
        const accessTokenResponse = await axios.post(`${import.meta.env.VITE_API_URL}/get_access_token`, {
          public_token: publicToken,
        });

        const { access_token } = accessTokenResponse.data;
        if (access_token) {
          sessionStorage.setItem('accessToken', access_token);

          const transactionsResponse = await axios.post(`${import.meta.env.VITE_API_URL}/get_transactions`, {
            access_token,
          });

          const { transactions, accounts } = transactionsResponse.data;
          if (transactions && accounts) {
            sessionStorage.setItem('accounts', JSON.stringify(accounts));
            const sorted = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(sorted);
            setFilteredTransactions(sorted);
            setAccounts(accounts);
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
  
                  {isLinkReady && (
                    <button
                      onClick={() => open()}
                      disabled={!ready}
                      className="w-full bg-[#3a3f66] text-white py-3 px-4 rounded-lg hover:bg-[#555a7c] transition duration-200 mb-6"
                    >
                      Link Bank Account
                    </button>
                  )}
  
                  {filteredTransactions.length > 0 ? (
                    <TransactionsTable
                      transactions={filteredTransactions}
                      getAccountDetails={getAccountDetails}
                    />
                  ) : isLoading ? (
                    <div className="text-center text-gray-400">Fetching transactions...</div>
                  ) : (
                    <div className="text-center text-gray-400">No transactions to display.</div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-600">
                  You are not logged in. Please log in to view your transactions.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>
    </div>
  );  
};

export default TransactionsPage;