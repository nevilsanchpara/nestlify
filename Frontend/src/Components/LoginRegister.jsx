import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './animations.css'; // Import the custom CSS for animations

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isBlurred, setIsBlurred] = useState(false);

  const handleToggle = (isLogin) => {
    setIsBlurred(true);
    setTimeout(() => {
      setIsLogin(isLogin);
      setIsBlurred(false);
    }, 500);
  };

  return (
    <div className="min-h-dvh flex pt-[100px] justify-center bg-[url('/src/assets/bg2.jpg')] bg-cover bg-center">
      <div className={`w-full max-w-4xl bg-black/30 backdrop-blur-md shadow-lg rounded-lg p-6 md:p-10 flex flex-col transition-all duration-500 ease-in-out ${isLogin ? 'h-[450px]' : 'h-[650px]'}`}>
        <div className="flex justify-center mb-4">
          <button
            onClick={() => handleToggle(true)}
            className={`px-4 py-2 font-medium ${isLogin ? 'text-violet-200 border-b-2 border-white' : 'text-gray-300'}`}
          >
            Login
          </button>
          <button
            onClick={() => handleToggle(false)}
            className={`px-4 py-2 font-medium ${!isLogin ? 'text-violet-200 border-b-2 border-white' : 'text-gray-300'}`}
          >
            Register
          </button>
        </div>
        <div className="relative">
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