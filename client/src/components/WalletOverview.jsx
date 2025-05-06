'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sideBar';
import { useCard } from './TempDataFiles/CardInfo';

const WalletOverview = () => {
  const { cards } = useCard();
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  /* ---------- carousel helpers ---------- */
  const handleNextSlide = () => {
    if (currentSlide + 2 < cards.length) setCurrentSlide(currentSlide + 2);
  };
  const handlePrevSlide = () => {
    if (currentSlide - 2 >= 0) setCurrentSlide(currentSlide - 2);
  };
  const visibleCards = cards.slice(currentSlide, currentSlide + 2);

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      <Sidebar />

      {/* main column */}
      <div className="flex-grow overflow-y-auto p-8 flex flex-col">
        {/* header */}
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
            disabled={currentSlide + 2 >= cards.length}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md disabled:opacity-40"
          >
            Next &gt;
          </button>
        </div>

        {/* Cards carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {visibleCards.map((card, i) => {
            const originalIndex = currentSlide + i;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedCardIndex(originalIndex)}
                className={`cursor-pointer p-8 rounded-3xl shadow-lg min-h-[300px] flex flex-col justify-between text-white transition-transform ${card.bgColor} ${
                  selectedCardIndex === originalIndex
                    ? 'outline outline-4 outline-white scale-[1.02]'
                    : ''
                }`}
              >
                <div>
                  <h2 className="text-2xl font-medium">Card Balance</h2>
                  <p className="text-5xl font-extrabold mt-4">
                    ${card.balance.toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between items-end text-lg font-semibold tracking-widest mt-6">
                  <div>
                    <p className="text-sm opacity-80">{card.type}</p>
                    <p>**** {card.last4}</p>
                  </div>
                  <p className="text-sm opacity-90">{card.validUntil}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Card information */}
        {cards[selectedCardIndex] && (
          <div className="bg-[#2C325C] p-12 rounded-3xl shadow-md flex-1 min-h-[340px]">
            <h3 className="text-4xl font-bold mb-12">Card Information</h3>
            <div className="grid grid-rows-2 grid-cols-2 h-full gap-y-16">
              {/* TL */}
              <div>
                <p className="text-gray-300 text-xl">Card Name</p>
                <p className="text-2xl font-bold">
                  {cards[selectedCardIndex].cardName}
                </p>
              </div>
              {/* TR */}
              <div className="text-right">
                <p className="text-gray-300 text-xl">Card No.</p>
                <p className="text-2xl font-bold">
                  **** {cards[selectedCardIndex].last4}
                </p>
              </div>
              {/* BL */}
              <div>
                <p className="text-gray-300 text-xl">CVV</p>
                <p className="text-2xl font-bold">***</p>
              </div>
              {/* BR */}
              <div className="text-right">
                <p className="text-gray-300 text-xl">Valid until</p>
                <p className="text-2xl font-bold">
                  {cards[selectedCardIndex].validUntil}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletOverview;
