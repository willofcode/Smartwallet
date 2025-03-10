import React, {useState} from 'react';
import './sidebar.css';
import profilepic from './profilepic.png';
import {useLocation} from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    
    const [closeMenu, setCloseMenu] = useState(false);
    
    const handleCloseMenu = () => {
        setCloseMenu(!closeMenu);
    };

  return (
    <div  className={closeMenu === false ? 'sidebar' : 'sidebar active'}>
        <div className={closeMenu=== false ? 'logoSection': 'logoSection active'}>
            <i class= 'bx bxs-wallet'></i>
            <h2 className='title'>SmartWallet</h2>
        </div>
        <div className={closeMenu === false ? 'closingSection' : 'closingSection active'}>
            <div className='closingTrigger' onClick={()=>{
                handleCloseMenu();
                }}
                ></div>
            <div className='closingMenu'></div>
        </div>
        <div className={closeMenu === false ? 'profileSection' : 'profileSection active'}>
            <img src={profilepic} alt="profile" className='profile'/>
            <div className="profileInfo">
                <p className="name">Hello, Daniel</p>  
            </div>
        </div>
        <div className={closeMenu === false ? "contentsSection" : 'contentsSection active'}>
            <ul>
                <li>
                    <i class='bx bxs-dashboard'></i>
                    <a href='/'>Dashboard</a>
                </li>
                <li>
                    <i class='bx bx-list-ul'></i>
                    <a href='/transactions'>Transactions</a>
                </li>
                <li>
                    <i class='bx bxs-credit-card-alt'></i>
                    <a href='/wallet'>Wallet</a>
                </li>
                <li>
                    <i class='bx bxs-face'></i>
                    <a href='/advisor'>Advisor</a>
                </li>
                <li>
                    <i class='bx bx-money-withdraw'></i>
                    <a href='/budgeting'>Budgeting</a>
                </li>
                <li>
                    <i class='bx bx-detail'></i>
                    <a href='/bills'>Bills</a>
                </li>
            </ul>
        </div>
       
      
    </div>
  )
}

export default Sidebar
