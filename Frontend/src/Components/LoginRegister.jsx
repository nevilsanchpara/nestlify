import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './animations.css'; // Import the custom CSS for animations

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-dvh flex pt-[100px] justify-center bg-gray-100">
      <div className="w-full max-w-md relative">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 font-medium ${isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 font-medium ${!isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          >
            Register
          </button>
        </div>
        <div className="relative h-64 ">
          <div className={`absolute inset-0 transition-all mb-5 duration-500 ease-in-out ${isLogin ? 'slide-in-reverse' : 'slide-out-reverse'}`}>
            {isLogin && <Login />}
          </div>
          <div className={`absolute inset-0 transition-all mb-5 duration-500 ease-in-out ${!isLogin ? 'slide-in' : 'slide-out'}`}>
            {!isLogin && <Register />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;