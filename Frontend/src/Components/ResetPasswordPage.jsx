import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import zxcvbn from 'zxcvbn';
import axios from 'axios';

const schema = yup.object().shape({
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

const ResetPasswordPage = () => {
  const { token } = useParams();
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post(`https://nestlify.vercel.app/api/users/reset-password`, {
        token,
        password: data.password,
      });
      alert('Password reset successfully');
      history.push('/login');
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    const strength = zxcvbn(value).score;
    setPasswordStrength(strength);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            <div className="mt-2">
              <div className={`h-2 rounded ${passwordStrength === 0 ? 'bg-red-500' : passwordStrength === 1 ? 'bg-orange-500' : passwordStrength === 2 ? 'bg-yellow-500' : passwordStrength === 3 ? 'bg-green-500' : 'bg-green-700'}`} style={{ width: `${(passwordStrength + 1) * 20}%` }}></div>
              <p className="text-sm text-gray-500">Password Strength: {["Very Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength]}</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;