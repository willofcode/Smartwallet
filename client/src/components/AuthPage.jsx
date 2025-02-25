'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import config from '../config';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false); // Start with signup form
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? `${config.API_URL}/login` : `${config.API_URL}/signup`; // Switch URL based on form

    try {
      const response = await axios.post(url, { email, password });
      const data = response.data;

      if (response.status === 200) {
        setSuccessMessage(data.message);
        setEmail('');
        setPassword('');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Log In' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
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
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {successMessage && (
          <p className="mt-4 text-green-600 text-center">{successMessage}</p>
        )}
        {error && (
          <p className="mt-4 text-red-600 text-center">{error}</p>
        )}

        {/* Toggle Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;