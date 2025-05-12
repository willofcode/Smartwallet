'use client';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const AuthPage = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [linkToken, setLinkToken] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();

  // Detect Google OAuth login
  useEffect(() => {
    const detectGoogleOAuthLogin = async () => {
      // parse the URL parameters for google_token and userId
      const params = new URLSearchParams(search);
      const googleToken = params.get('google_token');
      const googleUser = params.get('userId');
      if (!googleToken || !googleUser) return;

      setIsLogin(true);
      // Successful Google OAuth login
      localStorage.setItem('token', googleToken);
      localStorage.setItem('userId', googleUser);

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/create_link_token`,
          { uid: googleUser },
          { headers: { Authorization: `Bearer ${googleToken}` } }
        );
        // Check if the response contains a link token
        if (response.data.link_token) {
          localStorage.setItem('linkToken', response.data.link_token); 
          setLinkToken(response.data.link_token);
          navigate('/transactions');
        }
      } catch (error) {
        console.error('Error creating link token:', error);
      }
    };

    detectGoogleOAuthLogin();
  }, [search]);
  

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { 
        email: loginEmail, 
        password: loginPassword 
      });

      const data = response.data;

      if (response.status === 200) {
        setSuccessMessage(data.message);
        setLoginEmail('');
        setLoginPassword('');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);

        await createLinkToken(data.userId);

        setError('');
        navigate('/transactions');
      } else {
        setError(data.message);
      }
    } catch (err) {
      if (err.response?.status === 403) { // 403 Forbidden
        // Handle email verification required
        // Not verified yet
        setError(err.response.data.message);
        return navigate('/verify-email');
      }
      setError('Something went wrong. Please try again.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, { 
        email: signupEmail, 
        password: signupPassword, 
        firstName,
        lastName
      });

      const data = response.data;
  
      if (response.status === 200) {
        setSuccessMessage(data.message);
        setSignupEmail('');
        setSignupPassword('');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);

        await createLinkToken(data.userId);
  
        setError('');
        navigate('/verify-email'); 
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
      console.log('Token:', token);
      if (!token) {
        setError('Authentication failed. Please log in again.');
        return;
      }
  
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create_link_token`,
        { uid: userId },
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
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password:</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700">First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password:</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
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
            <button 
              onClick={() => { 
                window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`; 
              }}
              className="w-fit mt-4 flex items-center justify-center gap-2 bg-white text-[#292d52] px-6 py-2 rounded-md shadow-md hover:bg-[#555a7c] transition"
            >
              <span className="font-medium">Sign in with Google</span>
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