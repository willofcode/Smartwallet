import React, { useState } from 'react';
import profilepic from './profilepic.png';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [closeMenu, setCloseMenu] = useState(false);

  const handleCloseMenu = () => setCloseMenu(!closeMenu);

  return (
    <div className={`${closeMenu ? 'w-40' : 'w-80'} bg-[#2C325C] h-screen flex flex-col justify-start items-start p-8 transition-all duration-500 relative`}>
      
      {/* SmartWallet Logo Section */}
      <div className="flex items-center justify-start mb-8">
        <i className="bx bxs-wallet text-4xl mr-2"></i>
        {!closeMenu && <h2 className="text-white text-2xl">SmartWallet</h2>}
      </div>

      {/* Sidebar Toggle Button */}
      <div
        className="absolute right-[-17.5px] top-36 w-[35px] h-[35px] rounded-full bg-black flex justify-center items-center cursor-pointer z-10"
        onClick={handleCloseMenu}
      >
        <div className={`relative w-5 h-[3px] bg-white`}>
          {!closeMenu ? (
            <>
              <div className="absolute w-5 h-[3px] bg-white transform rotate-0 top-[0.4rem]"></div>
              <div className="absolute w-5 h-[3px] bg-white transform -rotate-0 top-[-0.4rem]"></div>
            </>
          ) : null}
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center mb-8">
        <img src={profilepic} alt="profile" className="w-12 h-12 rounded-full object-cover" />
        {!closeMenu && (
          <div className="ml-4">
            <p className="text-gray-400 font-bold">Hello, Daniel</p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <ul className="flex flex-col space-y-4 w-full">
        <li className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition-all">
          <i className="bx bxs-dashboard text-white text-2xl"></i>
          {!closeMenu && <a href="/dashboard" className="text-white text-lg">Dashboard</a>}
        </li>
        <li className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition-all">
          <i className="bx bx-list-ul text-white text-2xl"></i>
          {!closeMenu && <a href="/transactions" className="text-white text-lg">Transactions</a>}
        </li>
        <li className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition-all">
          <i className="bx bxs-credit-card-alt text-white text-2xl"></i>
          {!closeMenu && <a href="/wallet" className="text-white text-lg">Wallet</a>}
        </li>
        <li className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition-all">
          <i className="bx bxs-face text-white text-2xl"></i>
          {!closeMenu && <a href="/AiAdvisor" className="text-white text-lg">Advisor</a>}
        </li>
        <li className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition-all">
          <i className="bx bx-money-withdraw text-white text-2xl"></i>
          {!closeMenu && <a href="/budgeting" className="text-white text-lg">Budgeting</a>}
        </li>
        <li className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition-all">
          <i className="bx bx-detail text-white text-2xl"></i>
          {!closeMenu && <a href="/bills" className="text-white text-lg">Bills</a>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
