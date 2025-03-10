'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import "../styles.css";

// super basic boiler plate
const LandingPage = () => {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0c064d] to-[#2c1e79] text-white px-6">
            <nav className="w-full fixed top-0 left-0 bg-[#0c064d] bg-opacity-90 py-4 px-8 flex justify-between items-center shadow-lg">
                <h1 className="text-2xl font-bold text-white">
                    SmartWallet
                </h1>
                <ul className="flex space-x-6">
                    <li>
                        <a href="/authform" className="bg-white text-[#0c064d] px-4 py-2 rounded-2xl font-semibold shadow-lg opacity-100 hover:opacity-70 transition">Get started</a>
                    </li>
                    {/*<li>
                        <a href="/transactions" className="text-white opacity-100 hover:opacity-70 transition">Transactions</a>
                    </li>*/}
                    <li>
                        <a href="#" className="text-white opacity-100 hover:opacity-70 transition">Home</a>
                    </li>
                    {/*<li>
                        <a href="#" className="text-white opacity-100 hover:opacity-70 transition">Bills</a>
                    </li>*/}
                    <li>
                        <a href="#" className="text-white opacity-100 hover:opacity-70 transition">About Us</a>
                    </li>
                </ul>
            </nav>
            
            {/* I NEEED A FLEX BOX!! */}
            <div className="flex items-center justify-between min-h-screen px-10 w-full">
                {/* Left  --> welcome to smart wallet */}
                <header className="text-left max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Welcome to SmartWallet
                    </h1>

                    <p className="text-lg md:text-xl opacity-80 mb-6">
                        Better Budgeting / Smarter Saving
                    </p>

                    <button className="bg-white text-[#0c064d] px-6 py-3 rounded-2xl font-semibold shadow-lg opacity-100 hover:opacity-70 transition">
                        Get Started
                    </button>
                </header>

                <div className="w-1/2 flex justify-center relative overflow-hidden">
                    <div className="logos-carousel">
                        <div className="logos-wrapper">
                            <img src="/images/chase-logo.png" alt="Chase Logo" className="logo" />
                            <img src="/images/bofa-logo.png" alt="Bank of America Logo" className="logo" />
                            <img src="/images/wellsfargo-logo.png" alt="Wells Fargo Logo" className="logo" />
                            <img src="/images/capitalone-logo.png" alt="Capital One Logo" className="logo" />
                            <img src="/images/citibank-logo.png" alt="Citibank Logo" className="logo" />
                            <img src="/images/tdbank-logo.png" alt="TD Bank Logo" className="logo" />
                            <img src="/images/m&tbank-logo.png" alt="M&T Bank Logo" className="logo" />
                            <img src="/images/keybank-logo.png" alt="KeyBank Logo" className="logo" />
                            <img src="/images/citizens-logo.png" alt="Citizens Logo" className="logo" />
                            <img src="/images/sofi-logo.png" alt="SoFi Bank Logo" className="logo" />
                            <img src="/images/charlesschwab-logo.png" alt="Charles Schwab Logo" className="logo" />
                            <img src="/images/americanexpress-logo.png" alt="American Express Logo" className="logo" />
                            <img src="/images/discover-logo.png" alt="Discover Logo" className="logo" />
                            
                            <img src="/images/chase-logo.png" alt="Chase Logo" className="logo" />
                            <img src="/images/bofa-logo.png" alt="Bank of America Logo" className="logo" />
                            <img src="/images/wellsfargo-logo.png" alt="Wells Fargo Logo" className="logo" />
                            <img src="/images/capitalone-logo.png" alt="Capital One Logo" className="logo" />
                            <img src="/images/citibank-logo.png" alt="Citibank Logo" className="logo" />
                            <img src="/images/tdbank-logo.png" alt="TD Bank Logo" className="logo" />
                            <img src="/images/m&tbank-logo.png" alt="M&T Bank Logo" className="logo" />
                            <img src="/images/keybank-logo.png" alt="KeyBank Logo" className="logo" />
                            <img src="/images/citizens-logo.png" alt="Citizens Logo" className="logo" />
                            <img src="/images/sofi-logo.png" alt="SoFi Bank Logo" className="logo" />
                            <img src="/images/charlesschwab-logo.png" alt="Charles Schwab Logo" className="logo" />
                            <img src="/images/americanexpress-logo.png" alt="American Express Logo" className="logo" />
                            <img src="/images/discover-logo.png" alt="Discover Logo" className="logo" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
