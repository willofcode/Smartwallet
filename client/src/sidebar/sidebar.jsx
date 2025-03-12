import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const Sidebar = () => {
    const [closeMenu, setCloseMenu] = useState(false);
    const [isActive, setIsActive] = useState('Transactions');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const handleCloseMenu = () => {
        setCloseMenu(!closeMenu);
    };
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
  
    const handleLogout = () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('linkToken');
      navigate('/');
    };

    const profilepic = "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png";

    return (
        <div className={`bg-[#2C325C] h-screen w-1/4 p-8 transition-all ease-in-out subpixel-antialiased duration-400 ${closeMenu ? 'w-20' : 'w-60'} transition-all flex flex-col items-start relative`}>
            <div className={`flex items-center logo text-2xl font-semibold hover:text-[#3a70a2] ${closeMenu ? 'opacity-0' : 'transition-opacity duration-200 delay-200 opacity-100'} ${isActive ==='/' ? 'text-white' : ''}`}>
                <i className='bx bxs-wallet text-4xl mr-2'></i>
                {!closeMenu && <h2 className={`text-white text-2xl`}>SmartWallet</h2>}
            </div>
            <div className="absolute right-[-17px] top-24 w-9 h-9 bg-black rounded-full flex items-center justify-center cursor-pointer" onClick={handleCloseMenu}>
            <div className={`relative w-5 h-0.5 bg-white transition-transform duration-200 ease-in-out ${closeMenu ? '' : 'rotate-45'} before:absolute before:w-5 before:h-0.5 before:bg-white before:top-[6px] before:transition-transform before:duration-300 before:ease-in-out ${closeMenu ? '' : 'before:rotate-90 before:top-0'} after:absolute after:w-5 after:h-0.5 after:bg-white after:top-[-6px] after:transition-transform after:duration-300 after:ease-in-out ${closeMenu ? '' : 'after:rotate-270 after:top-0'}`}></div>
            </div>
            <div className={`relative items-center mt-16 ${closeMenu ? 'opacity-0' : 'justify-center transition-opacity duration-200 delay-200 opacity-100'}`}>
                {!closeMenu && (
                    <div className="flex items-center mx-3">
                        <img src={profilepic} className='w-12 h-12 rounded-full object-cover' />
                        <p className="text-gray-400 font-bold ml-3">Hello, {userName}</p>
                    </div>
                )}
            </div>
            <div className={`mt-8 w-full ${closeMenu ? 'opacity-0' : 'transition-opacity duration-200 delay-200 opacity-100'}`}>
                {!closeMenu && (
                <ul className="space-y-3">
                    <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition">
                        <i className='bx bxs-dashboard text-2xl text-white mr-3'></i>
                        <NavLink 
                            to="/dashboard" 
                            className={`transition-colors duration-300 hover:text-[#3a70a2] ${isActive === 'HomePage' ? 'text-[#3a70a2]' : ''}`} 
                            onClick={() => setIsActive('Dashboard')}
                            > 
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition">
                        <i className='bx bx-list-ul text-2xl text-white mr-3'></i>
                        <NavLink
                            to="/transactions"
                            className={`transition-colors duration-300 hover:text-[#3a70a2] ${isActive === 'Transactions' ? 'text-[#3a70a2]' : ''}`}
                            onClick={() => setIsActive('Transactions')}
                            >
                            Transactions
                        </NavLink>
                    </li>
                    <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition">
                        <i className='bx bxs-credit-card-alt text-2xl text-white mr-3'></i>
                        <NavLink
                            to="/wallet"
                            className={`transition-colors duration-300 hover:text-[#3a70a2] ${isActive === 'Wallet' ? 'text-[#3a70a2]' : ''}`}
                            onClick={() => setIsActive('Wallet')}
                            >
                            Wallet
                        </NavLink>
                    </li>
                    <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition">
                        <i className='bx bxs-face text-2xl text-white mr-3'></i>
                        <NavLink
                            to="/advisor"
                            className={`transition-colors duration-300 hover:text-[#3a70a2] ${isActive === 'Advisor' ? 'text-[#3a70a2]' : ''}`}
                            onClick={() => setIsActive('Advisor')}
                            >
                            Advisor
                        </NavLink>
                    </li>
                    <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition">
                        <i className='bx bx-money-withdraw text-2xl text-white mr-3'></i>
                        <NavLink
                            to="/budgeting"
                            className={`transition-colors duration-300 hover:text-[#3a70a2] ${isActive === 'Budgeting' ? 'text-[#3a70a2]' : ''}`}
                            onClick={() => setIsActive('Budgeting')}
                            >
                            Budgeting
                        </NavLink>
                    </li>
                    <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-500 transition">
                        <i className='bx bx-detail text-2xl text-white mr-3'></i>
                        <NavLink
                            to="/bills"
                            className={`transition-colors duration-300 hover:text-[#3a70a2] ${isActive === 'Bills' ? 'text-[#3a70a2]' : ''}`}
                            onClick={() => setIsActive('Bills')}
                            >
                            Bills
                        </NavLink>
                    </li>
                    <li className="flex items-center p-3 ml-3 rounded-lg cursor-pointer hover:bg-gray-500 transition">
                        <button
                        onClick={handleLogout}
                        className="items-center transition-colors duration-300 hover:text-red-500 text-sm text-white"
                        >
                        Logout
                        </button>
                    </li>
                </ul>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
