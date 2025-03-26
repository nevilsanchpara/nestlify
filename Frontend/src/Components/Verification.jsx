import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Verification = () => {
  const { token } = useParams();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(
          `https://nestlify-xelq.vercel.app/api/users/verify/${token}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Include Authorization header if needed
              // 'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Verification failed');
        }

        const data = await response.json();
        console.log('Verification successful:', data);
      } catch (error) {
        console.error('Error verifying user:', error);
      }
    };

    verifyUser();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Verification successfully Done!!</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <a href="/login">Login</a>
        </button>
      </div>
    </div>
  );
};

export default Verification;
