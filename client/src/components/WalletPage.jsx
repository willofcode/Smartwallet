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

  // State for the selected card (index in the full array)
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  // State for carousel: the index of the first card in the visible slide (2 at a time)
  const [currentSlide, setCurrentSlide] = useState(0);
  // Whether we are in manage mode (list view) or normal (carousel) mode
  const [isManaging, setIsManaging] = useState(false);
  // Whether we are adding a new card in manage mode
  const [isAddingCard, setIsAddingCard] = useState(false);

  // New card details state
  const [newCardName, setNewCardName] = useState('');
  const [newCardType, setNewCardType] = useState('');
  const [newCardBalance, setNewCardBalance] = useState('');
  const [newCardLast4, setNewCardLast4] = useState('');
  const [newCardCVV, setNewCardCVV] = useState('');
  const [newCardValidUntil, setNewCardValidUntil] = useState('');
  const [newCardBgColor, setNewCardBgColor] = useState('bg-yellow-600');

  // Handle card selection in normal (carousel) mode
  const handleSelectCard = (index) => {
    setSelectedCardIndex(index);
  };

  // Carousel navigation
  const handleNextSlide = () => {
    if (currentSlide + 2 < cards.length) {
      setCurrentSlide(currentSlide + 2);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide - 2 >= 0) {
      setCurrentSlide(currentSlide - 2);
    }
  };

  // Get the 2 cards that should be visible in the carousel
  const visibleCards = cards.slice(currentSlide, currentSlide + 2);

  // Manage Mode: Remove a card
  const handleRemoveCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
    // Adjust selected card if needed
    if (selectedCardIndex >= cards.length - 1) {
      setSelectedCardIndex(0);
    }
  };

  // Manage Mode: Submit new card form
  const handleSubmitNewCard = (e) => {
    e.preventDefault();
    const newId = Date.now(); // using timestamp as unique ID
    const newCard = {
      id: newId,
      type: newCardType || 'Visa',
      balance: parseFloat(newCardBalance) || 0,
      last4: newCardLast4 || '0000',
      validUntil: newCardValidUntil || '12/30',
      cardName: newCardName || 'New Card',
      // Always store the CVV as entered, but display as "***"
      cvv: newCardCVV || '***',
      bgColor: newCardBgColor,
    };
    setCards([...cards, newCard]);
    // Clear the form fields and exit add card mode
    setNewCardName('');
    setNewCardType('');
    setNewCardBalance('');
    setNewCardLast4('');
    setNewCardCVV('');
    setNewCardValidUntil('');
    setNewCardBgColor('bg-yellow-600');
    setIsAddingCard(false);
  };

  return (
    <div className="flex h-screen bg-[#1B203F] text-white font-[Poppins]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-8">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Cards</h1>
          {!isManaging ? (
            <button
              onClick={() => setIsManaging(true)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
            >
              Manage Cards
            </button>
          ) : (
            <button
              onClick={() => {
                setIsManaging(false);
                setIsAddingCard(false);
              }}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
            >
              Back
            </button>
          )}
        </div>

        {/* NORMAL (CAROUSEL) MODE */}
        {!isManaging && (
          <>
            {/* Carousel Navigation */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlide === 0}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md disabled:opacity-50"
              >
                &lt; Prev
              </button>
              <button
                onClick={handleNextSlide}
                disabled={currentSlide + 2 >= cards.length}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md disabled:opacity-50"
              >
                Next &gt;
              </button>
            </div>

            {/* Cards Carousel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {visibleCards.map((card, idx) => {
                const originalIndex = currentSlide + idx;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectCard(originalIndex)}
                    className={`cursor-pointer p-6 rounded-2xl shadow-md relative text-white ${card.bgColor} ${
                      originalIndex === selectedCardIndex
                        ? 'border-4 border-white'
                        : ''
                    }`}
                  >
                    <h2 className="text-lg font-semibold">Card Balance</h2>
                    <p className="text-3xl font-bold mt-2">
                      ${card.balance.toLocaleString()}
                    </p>
                    <p className="mt-4 text-sm">{card.type}</p>
                    <p className="text-sm">**** {card.last4}</p>
                    <p className="text-sm mt-2">Valid until {card.validUntil}</p>
                  </div>
                );
              })}
            </div>

            {/* Card Information Section */}
            {cards[selectedCardIndex] && (
              <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">Card Information</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-300 text-sm">Card Name</p>
                    <p className="text-xl font-semibold">
                      {cards[selectedCardIndex].cardName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Card No</p>
                    <p className="text-xl font-semibold">
                      **** {cards[selectedCardIndex].last4}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">CVV</p>
                    <p className="text-xl font-semibold">***</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Valid until</p>
                    <p className="text-xl font-semibold">
                      {cards[selectedCardIndex].validUntil}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* MANAGE MODE */}
        {isManaging && (
          <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Manage Cards</h3>
            <ul className="space-y-3">
              {cards.map((card) => (
                <li
                  key={card.id}
                  className="flex justify-between items-center bg-[#1B203F] px-4 py-3 rounded-md"
                >
                  <span>{card.cardName}</span>
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {/* New Card Form */}
            {isAddingCard ? (
              <div className="bg-[#1B203F] p-4 rounded-md mt-6">
                <h4 className="text-lg font-semibold mb-2">Add New Card</h4>
                <form onSubmit={handleSubmitNewCard} className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Card Name</label>
                    <input
                      type="text"
                      value={newCardName}
                      onChange={(e) => setNewCardName(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Card Type</label>
                    <input
                      type="text"
                      value={newCardType}
                      onChange={(e) => setNewCardType(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Balance</label>
                    <input
                      type="number"
                      value={newCardBalance}
                      onChange={(e) => setNewCardBalance(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Last 4 Digits</label>
                    <input
                      type="text"
                      value={newCardLast4}
                      onChange={(e) => setNewCardLast4(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">CVV</label>
                    <input
                      type="text"
                      value={newCardCVV}
                      onChange={(e) => setNewCardCVV(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Valid Until</label>
                    <input
                      type="text"
                      value={newCardValidUntil}
                      onChange={(e) => setNewCardValidUntil(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-[#2C325C] border border-gray-600"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
                    >
                      Save Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCard(false)}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCard(true)}
                className="mt-6 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
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
