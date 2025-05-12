import React, { useState } from 'react'
import MainInput from '../../components/ui/inputs/MainInput'
import MainButton from '../../components/ui/buttons/MainButton'
import { useAuth } from '../../../hooks/useAuth';

interface RegisterForm {
  username: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  password2: string;
}

const Register: React.FC = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterForm>({ username: '', fname: '', lname: '', email: '', password: '', password2: '' });
  const [error, setError] = useState<string>('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.email || !formData.password || !formData.fname || !formData.lname || !formData.username) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.fname.length < 2 || formData.lname.length < 2) {
      setError('First and last names must be at least 2 characters long.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.password2) {
      setError('Passwords must match.');
      return;
    }

    if (formData.username.length < 6) {
      setError('Username must be at least 6 characters long.');
      return;
    }

    try {
      console.log('Sent register data:', formData);
      await register(formData);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className='flex flex-col gap-3 justify-center items-center'>
      <h3 className='text-xl text-zinc-900 font-bold'>Create your Account</h3>
      <p className='text-gray-600 text-sm mb-2'>Please enter your details to create your account</p>
      {error && <p className='text-red-500 text-sm font-medium'>{error}</p>}
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <div className='flex gap-1 justify-between w-sm'>
          <MainInput
            label='First Name'
            type='text'
            placeholder='First Name'
            className='w-full'
            value={formData.fname}
            onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
          />
          <MainInput
            label='Last Name'
            type='text'
            placeholder='Last Name'
            className='w-full'
            value={formData.lname}
            onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
          />
        </div>
        <MainInput 
          label='Username' 
          type='text' 
          placeholder='Enter your username' 
          className='w-sm' 
          value={formData.username} 
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <MainInput 
          label='Email' 
          type='email' 
          placeholder='Enter your email' 
          className='w-sm' 
          value={formData.email} 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <MainInput 
          label='Password' 
          type='password' 
          placeholder='Enter your Password' 
          className='w-sm' 
          value={formData.password} 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <MainInput 
          label='Confirm Password' 
          type='password' 
          placeholder='Re-type your Password' 
          className='w-sm' 
          value={formData.password2} 
          onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
        />
        <MainButton label='Sign In' type='submit' className='w-xs' />
      </form>
      <p className='text-zinc-500 text-sm'>Already have an account? <a href="/login" className='text-zinc-800 font-medium hover:underline'>Sign in here</a></p>
    </div>
  )
}

export default Register