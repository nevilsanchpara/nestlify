import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import gif from '../assets/verified.gif';
const VerifyAccount = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/verify/${token}`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Verification failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyAccount();
  }, [apiUrl, token]);

  return (
    <div className="verify-account-container bg-[url('/src/assets/background.jpg')] min-h-screen flex items-center justify-center bg-cover bg-center px-4">
      <div className="w-full max-w-4xl bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-6 md:p-10 flex flex-col items-center mb-4">
        <h2 className="text-4xl font-bold mb-4 text-center text-indigo-700">Verify Your Account</h2>
        {loading ? (
          <p className="text-2xl text-gray-700">Loading...</p>
        ) : (
          <>
            <p className={`${message.includes('failed') ? 'text-red-500' : 'text-green-500'} mt-4 text-center text-2xl`}>{message}</p>
            {!message.includes('failed') && (
              <>
                <img src={gif} alt="Verified" className="mt-6 w-1/2 h-auto" />
                <Link to="/login" className="mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Go to Login
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyAccount;