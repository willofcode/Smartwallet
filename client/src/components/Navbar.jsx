import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const Navbar = ({ handleLogout }) => {
  const [isActive, setIsActive] = useState('Transactions');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get the user ID from localStorage
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserId) {
      fetchUserName(storedUserId);
    }
  }, []);

  const fetchUserName = async (id) => {
    try {
      const response = await axios.get(`${config.API_URL}/getUser/${id}`);
      setUserName(response.data.name || 'User');
    } catch (err) {
      setUserName('User');
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('transactions')) setIsActive('Transactions');
    if (path.includes('dashboard')) setIsActive('Dashboard');
    if (path.includes('wallet')) setIsActive('Wallet');
  }, [window.location.pathname]);

  return (
    <div className="sidebar w-60 bg-indigo-800 text-white p-6">
      <div className="top mb-8">
        <div className="logo text-2xl font-semibold">SmartWallet</div>
      </div>

      <div className="user flex items-center mb-8">
        <img src="pfp.jpg" alt="profile picture" className="user-img w-12 h-12 rounded-full mr-4" />
        <div>
          <p className="font-semibold">{userName}</p>
          <p className="text-sm">User</p>
        </div>
      </div>

      <ul className="space-y-4">
        <li>
          <NavLink
            to="/dashboard"
            className={`hover:text-indigo-400 ${isActive === 'Dashboard' ? 'text-indigo-400' : ''}`}
            onClick={() => setIsActive('Dashboard')}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/transactions"
            className={`hover:text-indigo-400 ${isActive === 'Transactions' ? 'text-indigo-400' : ''}`}
            onClick={() => setIsActive('Transactions')}
          >
            Transactions
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/wallet"
            className={`hover:text-indigo-400 ${isActive === 'Wallet' ? 'text-indigo-400' : ''}`}
            onClick={() => setIsActive('Wallet')}
          >
            Wallet
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/advisor"
            className={`hover:text-indigo-400 ${isActive === 'Advisor' ? 'text-indigo-400' : ''}`}
            onClick={() => setIsActive('Advisor')}
          >
            Advisor
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/budgeting"
            className={`hover:text-indigo-400 ${isActive === 'Budgeting' ? 'text-indigo-400' : ''}`}
            onClick={() => setIsActive('Budgeting')}
          >
            Budgeting
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/bills"
            className={`hover:text-indigo-400 ${isActive === 'Bills' ? 'text-indigo-400' : ''}`}
            onClick={() => setIsActive('Bills')}
          >
            Bills
          </NavLink>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="mr-4 pr-2 border px-4 rounded-xl text-red-500"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;