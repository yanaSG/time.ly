import React, { useState } from 'react'
import AuthInput from '../../components/ui/inputs/AuthInput'
import AuthButton from '../../components/ui/buttons/AuthButton'
import { useAuth } from '../../../hooks/useAuth';
import { FaRegUser } from "react-icons/fa6";
import { CgPassword } from "react-icons/cg";

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
    <div className='max-h-max max-w-max flex flex-col gap-3 md:m-20 justify-center md:items-start items-center text-[#5A5A5A]'>
      <h3 className='text-3xl font-extrabold'>Log In Your Account</h3>
      <p className='text-sm font-medium mb-2'>Upload. Generate. Conquer.</p>
      {error && <p className='text-red-500 text-sm font-medium'>{error}</p>}
      <form onSubmit={handleSubmit} className='w-full flex flex-col gap-3 my-4 md:items-start items-center'>
        <AuthInput 
          type='text' 
          placeholder='Username' 
          icon={<FaRegUser className='size-5 opacity-50' />}
          className='lg:w-sm' 
          value={formData.username} 
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <AuthInput 
          type='password' 
          placeholder='Password' 
          icon={<CgPassword className='size-5 opacity-50' />}
          className='lg:w-sm' 
          value={formData.password} 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <AuthButton label='LOG IN' type='submit' className='mt-5' />
      </form>
      <p className='text-sm'>Don't have an account? <a href="/register"className='text-[#D05C28] font-semibold hover:underline'>Sign up here</a></p>
      <a href="#" className='font-medium text-sm hover:underline hover:text-[#D05C28]'>Forgot your Password?</a>
    </div>
  )
}

export default Login;