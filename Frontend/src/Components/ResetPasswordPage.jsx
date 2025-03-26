import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired token.');
    }
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/users/reset-password`, { token, password });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000); // Redirect after success
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/src/assets/background.jpg')] px-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleResetPassword} className="mt-4">
          <label className="block text-sm font-medium text-gray-700">New Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-3">Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button type="submit" className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
