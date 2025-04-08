import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
  const [closeMenu, setCloseMenu] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleCloseMenu = () => setCloseMenu(!closeMenu);

  // stores the userId in local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      fetchUserName(storedUserId);
    }
  }, []);

  // let's us find username via userid 
  const fetchUserName = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/getUser/${id}`); // <--- how we call server REST api to our webpages
      setUserName(response.data.firstName || 'User'); /// make this such that it shows first and last name
    } catch (err) {
      setUserName('User');
    }
  };

  // took this from navbar will delete Navbar.jsx soon...
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('linkToken');
    localStorage.removeItem('token')
    navigate('/');
  };

  return (
    <div className={`${closeMenu ? 'w-40' : 'w-80'} bg-[#2C325C] h-screen flex flex-col justify-start items-start p-8 transition-all duration-500 relative`}>
      
      <div className="flex items-center justify-start mb-8">
        <i className="bx bxs-wallet text-4xl mr-2"></i>
        {!closeMenu && <h2 className="text-white text-2xl">SmartWallet</h2>}
      </div>

      <div
        className="absolute right-[-17.5px] top-36 w-[35px] h-[35px] rounded-full bg-black flex justify-center items-center cursor-pointer z-10"
        onClick={handleCloseMenu}
      >
        <div className="relative w-5 h-[3px] bg-white">
          {!closeMenu && (
            <>
              <div className="absolute w-5 h-[3px] bg-white transform rotate-0 top-[0.4rem]"></div>
              <div className="absolute w-5 h-[3px] bg-white transform -rotate-0 top-[-0.4rem]"></div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center mb-8">
        <img src={"images/profilepic.png"} alt="profile" className="w-12 h-12 rounded-full object-cover" />
        {!closeMenu && (
          // when logging in should say Welcome back {userName}
          // we can pull the username via get user func

          <div className="ml-4">
            <p className="text-gray-400 font-bold">Hello, {userName}</p>
          </div>
        )}
      </div>

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
          <i className="bx bx-money-withdraw text-white text-2xl"></i>
          {!closeMenu && <a href="/budgeting" className="text-white text-lg">Budgeting</a>}
        </li>
        <li className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition-all">
          <i className="bx bx-detail text-white text-2xl"></i>
          {!closeMenu && <a href="/bills" className="text-white text-lg">Bills</a>}
        </li>
        <li className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition-all">
          <i className="bx bx-log-out text-white text-2xl"></i>
          {!closeMenu && <button onClick={handleLogout} className="transition-colors duration-300 hover:text-red-500 text-white">Logout</button>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
