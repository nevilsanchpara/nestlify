import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://nestlify-xelq.vercel.app/api/users/login', { email, password });
      const { token, user } = response.data;
      // Store token and user information in session storage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      // Redirect to home page
      alert('Login successful');
      window.location.href = '/';
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="p-6 bg-gray-800 backdrop-blur-md rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-100 text-center mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email:</label>
          <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password:</label>
          <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
      </form>
      <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-600">Forgot Password?</Link>
    </div>
  );
};

export default Login;