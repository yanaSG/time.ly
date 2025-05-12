import React, { useState } from 'react'
import MainInput from '../../components/ui/inputs/MainInput'
import MainButton from '../../components/ui/buttons/MainButton'
import { useAuth } from '../../../hooks/useAuth';

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({ username: '', password: '' });
  const [error, setError] = useState<string>('');

  // const validateEmail = (email: string) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    // if (!validateEmail(formData.email)) {
    //   setError('Please enter a valid email address.');
    //   return;
    // }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.username.length < 6) {
      setError('Username must be at least 6 characters long.');
      return;
    }

    try {
      console.log('Sent login data:', formData);
      await login(formData);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className='flex flex-col gap-3 justify-center items-center'>
      <h3 className='text-xl text-zinc-900 font-bold'>Welcome back!</h3>
      <p className='text-gray-600 text-sm mb-2'>Please enter your details to sign in your account</p>
      {error && <p className='text-red-500 text-sm font-medium'>{error}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <MainInput 
          label='Username' 
          type='text' 
          placeholder='Enter your username' 
          className='w-sm' 
          value={formData.username} 
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <MainInput 
          label='Password' 
          type='password' 
          placeholder='Enter your Password' 
          className='w-sm' 
          value={formData.password} 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <MainButton label='Sign In' type='submit' className='w-xs' />
      </form>
      <p className='text-zinc-500 text-sm'>Don't have an account? <a href="/register"className='text-zinc-800 font-medium hover:underline'>Sign up here</a></p>
      <a href="#" className='font-medium text-sm hover:underline hover:text-zinc-800'>Forgot your Password?</a>
    </div>
  )
}

export default Login;