import React, { useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/users/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to send password reset email');
    }
  };

return (
    <div className=" bg-[url('/src/assets/background.jpg')] min-h-screen flex items-center justify-center bg-cover bg-center px-4">
        <div className="w-full max-w-4xl bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-6 md:p-10 flex flex-col mb-4">
            <div className="justify-center mb-4">
                <div className="p-4 bg-white/30 rounded shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                    <form onSubmit={handleForgotPassword}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                            <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send Reset Link</button>
                    </form>
                    {message && <p className="text-green-500 mt-4">{message}</p>}
                </div>
            </div>
        </div>
    </div>
);
};

export default ForgotPassword;