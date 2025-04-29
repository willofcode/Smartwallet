'use client';

import React, { useState } from 'react';
import Sidebar from '../components/sideBar';

const WalletPage = () => {
  // All card data (initially 4 cards)
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'Visa',
      balance: 3690.0,
      last4: '1890',
      validUntil: '5/26',
      cardName: 'Bank of America',
      cvv: '***',
      bgColor: 'bg-purple-600',
    },
    {
      id: 2,
      type: 'Visa',
      balance: 2000.0,
      last4: '3287',
      validUntil: '6/27',
      cardName: 'Chase Bank',
      cvv: '***',
      bgColor: 'bg-green-600',
    },
    {
      id: 3,
      type: 'MasterCard',
      balance: 4500.0,
      last4: '1122',
      validUntil: '7/28',
      cardName: 'TD Bank',
      cvv: '***',
      bgColor: 'bg-blue-600',
    },
    {
      id: 4,
      type: 'MasterCard',
      balance: 3200.0,
      last4: '3344',
      validUntil: '8/29',
      cardName: 'M&T Bank',
      cvv: '***',
      bgColor: 'bg-red-600',
    },
  ]);

  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [isManaging, setIsManaging] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  // New-card form state
  const [newCardName, setNewCardName] = useState('');
  const [newCardType, setNewCardType] = useState('');
  const [newCardBalance, setNewCardBalance] = useState('');
  const [newCardLast4, setNewCardLast4] = useState('');
  const [newCardCVV, setNewCardCVV] = useState('');
  const [newCardValidUntil, setNewCardValidUntil] = useState('');
  const [newCardBgColor, setNewCardBgColor] = useState('bg-yellow-600');

  /* ---------- carousel helpers ---------- */
  const handleNextSlide = () => {
    if (currentSlide + 2 < cards.length) setCurrentSlide(currentSlide + 2);
  };
  const handlePrevSlide = () => {
    if (currentSlide - 2 >= 0) setCurrentSlide(currentSlide - 2);
  };
  const visibleCards = cards.slice(currentSlide, currentSlide + 2);

  /* ---------- manage helpers ---------- */
  const handleRemoveCard = (id) => {
    const updated = cards.filter((c) => c.id !== id);
    setCards(updated);
    if (selectedCardIndex >= updated.length) setSelectedCardIndex(0);
  };
  const handleSubmitNewCard = (e) => {
    e.preventDefault();
    const newCard = {
      id: Date.now(),
      type: newCardType || 'Visa',
      balance: parseFloat(newCardBalance) || 0,
      last4: newCardLast4 || '0000',
      validUntil: newCardValidUntil || '12/30',
      cardName: newCardName || 'New Card',
      cvv: newCardCVV || '***',
      bgColor: newCardBgColor,
    };
    setCards([...cards, newCard]);
    setIsAddingCard(false);
    setNewCardName('');
    setNewCardType('');
    setNewCardBalance('');
    setNewCardLast4('');
    setNewCardCVV('');
    setNewCardValidUntil('');
    setNewCardBgColor('bg-yellow-600');
  };

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      <Sidebar />

      {/* main column */}
      <div className="flex-grow overflow-y-auto p-8 flex flex-col">
        {/* header row */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Cards</h1>
          {!isManaging ? (
            <button
              onClick={() => setIsManaging(true)}
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-md"
            >
              Manage Cards
            </button>
          ) : (
            <button
              onClick={() => {
                setIsManaging(false);
                setIsAddingCard(false);
              }}
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-md"
            >
              Back
            </button>
          )}
        </div>

        {/* ---------- NORMAL (CAROUSEL) MODE ---------- */}
        {!isManaging && (
          <>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {visibleCards.map((card, i) => {
                const originalIndex = currentSlide + i;
                return (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCardIndex(originalIndex)}
                    className={`cursor-pointer p-8 rounded-3xl shadow-lg text-white transition-transform min-h-[300px] flex flex-col justify-between ${card.bgColor} ${
                      originalIndex === selectedCardIndex
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

            {/* ---------- CARD INFORMATION (fills remaining) ---------- */}
            {cards[selectedCardIndex] && (
              <div className="bg-[#2C325C] p-12 rounded-3xl shadow-md flex-1 min-h-[340px]">
                <h3 className="text-4xl font-bold mb-12">Card Information</h3>

                {/* 2 × 2 grid pinned to corners */}
                <div className="grid grid-rows-2 grid-cols-2 h-full gap-y-16">
                  {/* top-left */}
                  <div className="flex flex-col">
                    <p className="text-gray-300 text-xl">Card Name</p>
                    <p className="text-2xl font-bold">
                      {cards[selectedCardIndex].cardName}
                    </p>
                  </div>

                  {/* top-right */}
                  <div className="flex flex-col items-end text-right">
                    <p className="text-gray-300 text-xl">Card No.</p>
                    <p className="text-2xl font-bold">
                      **** {cards[selectedCardIndex].last4}
                    </p>
                  </div>

                  {/* bottom-left */}
                  <div className="flex flex-col">
                    <p className="text-gray-300 text-xl">CVV</p>
                    <p className="text-2xl font-bold">***</p>
                  </div>

                  {/* bottom-right */}
                  <div className="flex flex-col items-end text-right">
                    <p className="text-gray-300 text-xl">Valid until</p>
                    <p className="text-2xl font-bold">
                      {cards[selectedCardIndex].validUntil}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ---------- MANAGE MODE ---------- */}
        {isManaging && (
          <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6">Manage Cards</h3>
            <ul className="space-y-4">
              {cards.map((card) => (
                <li
                  key={card.id}
                  className="flex justify-between items-center bg-[#1B203F] px-6 py-4 rounded-md"
                >
                  <span>{card.cardName}</span>
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {isAddingCard ? (
              <div className="bg-[#1B203F] p-6 rounded-md mt-8">
                <h4 className="text-xl font-semibold mb-4">Add New Card</h4>
                <form onSubmit={handleSubmitNewCard} className="grid sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Card Name"
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    className="px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                  />
                  <input
                    placeholder="Card Type"
                    value={newCardType}
                    onChange={(e) => setNewCardType(e.target.value)}
                    className="px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                  />
                  <input
                    type="number"
                    placeholder="Balance"
                    value={newCardBalance}
                    onChange={(e) => setNewCardBalance(e.target.value)}
                    className="px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                  />
                  <input
                    placeholder="Last 4 Digits"
                    value={newCardLast4}
                    onChange={(e) => setNewCardLast4(e.target.value)}
                    className="px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                  />
                  <input
                    placeholder="CVV"
                    value={newCardCVV}
                    onChange={(e) => setNewCardCVV(e.target.value)}
                    className="px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                  />
                  <input
                    placeholder="Valid Until"
                    value={newCardValidUntil}
                    onChange={(e) => setNewCardValidUntil(e.target.value)}
                    className="px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                  />

                  <div className="sm:col-span-2 flex gap-4 mt-4">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCard(false)}
                      className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCard(true)}
                className="mt-8 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md"
              >
                Add Card
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
