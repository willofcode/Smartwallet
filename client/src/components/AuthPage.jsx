'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../config';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [linkToken, setLinkToken] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.API_URL}/login`, { email, password });
      const data = response.data;

      if (response.status === 200) {
        setSuccessMessage(data.message);
        setEmail('');
        setPassword('');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);

        setError('');
        navigate('/transactions');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${config.API_URL}/signup`, { email, password, name });
      const data = response.data;
  
      if (response.status === 200) {
        setSuccessMessage(data.message);
        setEmail('');
        setPassword('');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);

        await createLinkToken(data.userId);
  
        setError('');
        navigate('/transactions'); 
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };
  
  const createLinkToken = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication failed. Please log in again.');
        return;
      }
  
      const response = await axios.post(
        `${config.API_URL}/create_link_token`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200 && response.data.link_token) {
        const linkToken = response.data.link_token;
        setLinkToken(linkToken);
        localStorage.setItem('linkToken', linkToken);
        setSuccessMessage('Link token created successfully!');
      } else {
        setError('Failed to create Plaid link token.');
      }
    } catch (err) {
      setError('Error creating Plaid link token.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#292d52]">
      <div className="relative w-[600px] h-[450px] bg-[#1b1d33] shadow-lg rounded-lg overflow-hidden flex">
        <div className="relative flex w-full h-full">
          
          {/* section 1 - login */}
          <div className="w-1/2 p-6 z-10 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Log In</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Log In
              </button>
            </form>
          </div>

          {/* section 2 - signup */}
          <div className="w-1/2 p-6 z-10 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Sign Up</h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sign Up
              </button>
            </form>
          </div>

          {/* sliding window for login and signup*/}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-gray-900 text-white flex flex-col items-center justify-center z-20 rounded-lg"
            animate={{ x: isLogin ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              {isLogin ? "Got an account?" : "New Here?"}
            </h2>
            <p className="text-sm mb-6 text-center px-4">
              {isLogin
                ?  "Log in to access your transactions and financial tools."
                : "Sign up to start managing your finances efficiently."}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="bg-white text-[#292d52] px-6 py-2 rounded-md shadow-md hover:bg-[#555a7c] transition"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;

/*
AFTER 
CLIENT --- 
--> google pfp via OAuth

SERVER --- API GOOGLE OAUth
--> another login / signup option


clerk????? (check it out)


 */