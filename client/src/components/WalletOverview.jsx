'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sideBar';
import Chatbot from './Chatbot';

const WalletOverview = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedCardIndex, setSelected] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
  
    const accountDetails = sessionStorage.getItem('accounts');
    if (accountDetails) {
      try {
        const parsed = JSON.parse(accountDetails);
        if (Array.isArray(parsed)) {
          setAccounts(parsed);
        } else {
          throw new Error('Not an array');
        }
      } catch (err) {
        console.warn('Clearing invalid accounts in sessionStorage:', err);
        sessionStorage.removeItem('accounts');
        setError('Please reload your transactions page to re-link accounts.');
      }
    } else {
      setError('No account data found. Go to Transactions and link your bank.');
    }
  
    setLoading(false);
  }, []);
  

  // Carousel handlers
  const handleNext = () => {
    if (currentSlide + 2 < accounts.length) {
      setCurrentSlide(currentSlide + 2);
    }
  };
  const handlePrev = () => {
    if (currentSlide - 2 >= 0) {
      setCurrentSlide(currentSlide - 2);
    }
  };

  if (loading) return <p className="p-8 text-white">Loading accounts…</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!accounts.length) {
    return <p className="p-8 text-gray-400">No accounts to show.</p>;
  }

  const visible = accounts.slice(currentSlide, currentSlide + 2);

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      <Sidebar />

      <div className="flex-grow overflow-y-auto p-8 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Wallet Overview</h1>
          <Link
            to="/wallet/manage"
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-md"
          >
            Manage Cards
          </Link>
        </div>

        {/* Carousel navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md disabled:opacity-40"
          >
            &lt; Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlide + 2 >= accounts.length}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md disabled:opacity-40"
          >
            Next &gt;
          </button>
        </div>

        {/* Account cards carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {visible.map((acct, i) => {
            const idx = currentSlide + i;
            return (
              <div
                key={acct.account_id}
                onClick={() => setSelected(idx)}
                className={`cursor-pointer p-8 rounded-3xl shadow-lg min-h-[300px] flex flex-col justify-between bg-purple-600 transition-transform ${
                  selectedCardIndex === idx
                    ? ' outline-4 outline-white scale-[1.02]'
                    : ''
                }`}
              >
                <div>
                  <h2 className="text-2xl font-medium">Available Balance</h2>
                  <p className="text-5xl font-extrabold mt-4">
                    ${acct.balances.available.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-end text-lg font-semibold tracking-widest mt-6">
                  <div>
                    <p className="text-sm opacity-80">{acct.name}</p>
                    <p>**** {acct.mask || acct.account_id.slice(-4)}</p>
                  </div>
                  <p className="text-sm opacity-90">
                    {acct.balances.iso_currency_code}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Account Info */}
        <div className="flex-1 bg-[#2C325C] rounded-3xl p-4 overflow-auto">
          <h3 className="text-3xl font-bold mb-4">Account Information</h3>
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <div>
              <p className="text-gray-300">Account Name</p>
              <p className="text-xl font-bold">
                {accounts[selectedCardIndex].official_name || 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-300">Account No.</p>
              <p className="text-xl font-bold">
                ****{' '}{accounts[selectedCardIndex].mask || accounts[selectedCardIndex].account_id.slice(-4)}
              </p>
            </div>
            <div>
                <p className="text-gray-300">Account</p>
                <p className="text-xl font-bold">
                    {accounts[selectedCardIndex].subtype}
                </p>
            </div>
            <div className="text-right">
                    <p className="text-gray-300">Account Type</p>
                    <p className="text-xl font-bold">
                        {accounts[selectedCardIndex].holder_category}
                    </p>
            </div>
            {accounts[selectedCardIndex].holder_category == 'personal' ? (""):(
            <div className="text">
                    <p className="text-gray-300">Current Balance</p>
                    <p className="text-xl font-bold">
                     ${accounts[selectedCardIndex].balances.current.toLocaleString()}
                    </p>
            </div>
            )}
            {accounts[selectedCardIndex].balances.limit != null && (
            <div className="text-right">
                <p className="text-gray-300">Spending Limit</p>
                <p className="text-xl font-bold">
                ${accounts[selectedCardIndex].balances.limit.toLocaleString()}
                </p>
            </div>
            )}
          </div>
        </div>
      </div>
        <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
        </div>
    </div>
  );
};

export default WalletOverview;