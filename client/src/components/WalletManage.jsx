'use client';

import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sideBar';
import Chatbot from './Chatbot';

const WalletManage = () => {
  const [accounts, setAccounts] = useState([]);
  const [linkToken, setLinkToken] = useState(null);
  const [isLinkReady, setIsLinkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) throw new Error("No access token; please link first.");
  
    const { response } = await axios.get(`${import.meta.env.VITE_API_URL}/get_accounts`,
      { params: { access_token: token } }
    );
    console.log("Fetched accounts:", response.accounts);
    setAccounts(response.accounts);
  };
  

  const generateLinkToken = async () => {
    try {
      const { response } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create_link_token`,
        {} // include user_id if your backend requires it
      );
      setLinkToken(response.link_token);
      localStorage.setItem('linkToken', response.link_token);
      setIsLinkReady(true);
    } catch (e) {
      console.error('Error creating link token:', e);
      setError('Unable to initialize Plaid Link.');
    }
  };


  useEffect(() => {
    const accountdeets = sessionStorage.getItem('accounts');
    if (accountdeets) {
      try { setAccounts(JSON.parse(accountdeets)); } catch {}
    }

    fetchAccounts(); 

    const storedlinktoken = localStorage.getItem('linkToken');
    if (storedlinktoken) {
      setLinkToken(storedlinktoken);
      setIsLinkReady(true);
    } else {
      generateLinkToken();
    }
  }, []);


  const handleRemove = (accountId) => {
    setAccounts((prev) =>
      prev.filter((acct) => acct.account_id !== accountId)
    );
  };

  const onLinkSuccess = async (publicToken) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/get_access_token`,
        { public_token: publicToken }
      );

      await fetchAccounts();
    } catch (e) {
      console.error('Error on link success:', e);
      setError('Failed to link new account.');
    } finally {
      setLoading(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onLinkSuccess,
  });

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      <Sidebar />

      <div className="flex-grow overflow-y-auto p-8">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage Accounts</h1>
            <Link
              to="/wallet"
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-md"
            >
              Back
            </Link>
        </div>

        {/* account list */}
        <ul className="space-y-4 mb-8">
          {accounts.map((acct) => (
            <li
              key={acct.account_id}
              className="flex justify-between items-center bg-[#2C325C] p-4 rounded-md"
            >
              <div>
                <p className="font-semibold">{acct.name}</p>
              </div>
              <button
                onClick={() => handleRemove(acct.account_id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-md"
              >
                Remove
              </button>
            </li>
          ))}
          {!accounts.length && !loading && (
            <li className="text-gray-400">No linked accounts yet.</li>
          )}
        </ul>

        {/* Plaid Link button */}
        <button
          onClick={() => open()}
          disabled={!ready || loading}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md"
        >
          + Link New Bank Account
        </button>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>
    </div>
  );
};

export default WalletManage;
