'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sideBar';

const WalletOverview = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts`);
      setAccounts(response.data.accounts);
    } catch (err) {
      console.error('Error fetching account data:', err);
      setError('Failed to fetch account data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleNextSlide = () => {
    if (currentSlide + 2 < accounts.length) setCurrentSlide(currentSlide + 2);
  };

  const handlePrevSlide = () => {
    if (currentSlide - 2 >= 0) setCurrentSlide(currentSlide - 2);
  };

  const visibleAccounts = accounts.slice(currentSlide, currentSlide + 2);

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      <Sidebar />

      <div className="flex-grow overflow-y-auto p-8 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Cards</h1>
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
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md disabled:opacity-40"
          >
            &lt; Prev
          </button>
          <button
            onClick={handleNextSlide}
            disabled={currentSlide + 2 >= accounts.length}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md disabled:opacity-40"
          >
            Next &gt;
          </button>
        </div>

        {/* Account cards carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {visibleAccounts.map((account, i) => {
            const originalIndex = currentSlide + i;
            return (
              <div
                key={account.account_id}
                onClick={() => setSelectedCardIndex(originalIndex)}
                className={`cursor-pointer p-8 rounded-3xl shadow-lg min-h-[300px] flex flex-col justify-between text-white transition-transform bg-purple-600 ${
                  selectedCardIndex === originalIndex
                    ? 'outline outline-4 outline-white scale-[1.02]'
                    : ''
                }`}
              >
                <div>
                  <h2 className="text-2xl font-medium">Available Balance</h2>
                  <p className="text-5xl font-extrabold mt-4">
                    ${account.available.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-end text-lg font-semibold tracking-widest mt-6">
                  <div>
                    <p className="text-sm opacity-80">{account.name}</p>
                    <p>**** {account.mask || account.account_id.slice(-4)}</p>
                  </div>
                  <p className="text-sm opacity-90">{account.currency}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Account Info */}
        {accounts.length > 0 && !loading && (
          <div className="bg-[#2C325C] p-12 rounded-3xl shadow-md flex-1 min-h-[340px]">
            <h3 className="text-4xl font-bold mb-12">Account Information</h3>
            <div className="grid grid-rows-2 grid-cols-2 h-full gap-y-16">
              <div>
                <p className="text-gray-300 text-xl">Account Name</p>
                <p className="text-2xl font-bold">
                  {accounts[selectedCardIndex]?.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-xl">Account No.</p>
                <p className="text-2xl font-bold">
                  **** {accounts[selectedCardIndex]?.mask || accounts[selectedCardIndex]?.account_id.slice(-4)}
                </p>
              </div>
              <div>
                <p className="text-gray-300 text-xl">Available Balance</p>
                <p className="text-2xl font-bold">
                  ${accounts[selectedCardIndex]?.available.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-xl">Currency</p>
                <p className="text-2xl font-bold">
                  {accounts[selectedCardIndex]?.currency}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className="text-white">Loading account data...</p>}
      </div>
    </div>
  );
};

export default WalletOverview;