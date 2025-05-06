'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sideBar';
import { useCard } from './TempDataFiles/CardInfo';

const WalletManage = () => {
  const { cards, setCards } = useCard();
  const [isAddingCard, setIsAddingCard] = useState(false);

  /* new-card form state */
  const [newCardName, setNewCardName] = useState('');
  const [newCardType, setNewCardType] = useState('');
  const [newCardBalance, setNewCardBalance] = useState('');
  const [newCardLast4, setNewCardLast4] = useState('');
  const [newCardCVV, setNewCardCVV] = useState('');
  const [newCardValidUntil, setNewCardValidUntil] = useState('');
  const [newCardBgColor, setNewCardBgColor] = useState('bg-yellow-600');

  /* helpers */
  const handleRemoveCard = (id) => {
    setCards(cards.filter((c) => c.id !== id));
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

      <div className="flex-grow overflow-y-auto p-8">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage Cards</h1>
          <Link
            to="/wallet"
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-md"
          >
            Back
          </Link>
        </div>

        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md">
          <ul className="space-y-4 mb-8">
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

          {/* add-card panel */}
          {isAddingCard ? (
            <div className="bg-[#1B203F] p-6 rounded-md">
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
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md"
            >
              Add Card
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletManage;
