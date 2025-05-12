'use client';

import React from 'react';
import '../styles.css';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-[#1B203F] to-[#2C325C] text-white px-6">
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 bg-[#1B203F] bg-opacity-90 py-4 px-8 flex justify-between items-center shadow-lg z-10">
        <h1 className="text-2xl font-bold">SmartWallet</h1>
        <ul className="flex space-x-6">
          <li>
            <a href="/authform" className="bg-white text-[#0c064d] px-4 py-2 rounded-2xl font-semibold shadow hover:opacity-80 transition">Get started</a>
          </li>
          <li>
            <a href="#" className="text-white hover:opacity-80 transition">About Us</a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mt-55 mb-24 px-4 space-y-6">
      <h1 className="text-8xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-[#8ca0ff] to-[#cdd3f5] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(140,160,255,0.4)] mb-10">
            Welcome to SmartWallet
      </h1>

      <p className="text-lg md:text-xl text-gray-100 max-w-2xl mb-10">
        Your all-in-one hub to manage credit cards, track spending, and hit your savings goals.
     </p>

     </div>

      {/* Carousel Section */}
      <div className="w-full overflow-hidden -mt-10">
      <div className="logos-carousel">
        <div className="logos-wrapper">
            {Array(2).fill([
            "chase", "bofa", "wellsfargo", "capitalone", "citibank",
            "tdbank", "m_tbank", "keybank", "citizens", "sofi",
            "charlesschwab", "americanexpress", "discover"
            ]).flat().map((logo, index) => (
            <img
                key={index}
                src={`/images/${logo}-logo-removebg-preview.png`}
                alt={`${logo} logo`}
                className="logo"
            />
            ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
