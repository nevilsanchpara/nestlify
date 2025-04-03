import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
const apiUrl = import.meta.env.VITE_API_URL;
const schema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/api/users/register`, data);
      alert('Registration successful Check Emial for verification link');
      window.location.href = '/login';
    } catch (err) {
      console.error('Failed to register', err);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white text-center mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">First Name:</label>
          <input
            {...register("firstName")}
            placeholder="First Name"
            className="w-full p-3 border rounded-lg bg-gray-700 text-white"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Last Name:</label>
          <input
            {...register("lastName")}
            placeholder="Last Name"
            className="w-full p-3 border rounded-lg bg-gray-700 text-white"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Email:</label>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg bg-gray-700 text-white"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-300">Password:</label>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg bg-gray-700 text-white pr-10"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-9 right-3 text-gray-400">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-300">Confirm Password:</label>
          <input
            {...register("confirmPassword")}
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg bg-gray-700 text-white pr-10"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-9 right-3 text-gray-400">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Register</button>
      </form>
    </div>
  );
};

export default Register;