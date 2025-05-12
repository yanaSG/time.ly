import React, { useState } from 'react'
import AuthInput from '../../components/ui/inputs/AuthInput'
import AuthButton from '../../components/ui/buttons/AuthButton'
import { useAuth } from '../../../hooks/useAuth';
import { FaRegUser } from "react-icons/fa6";
import { CgPassword, CgRename } from "react-icons/cg";
import { MdOutlineMailOutline } from "react-icons/md";

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
    <div className='max-h-max max-w-max flex flex-col sm:gap-3 gap-1 lg:ms-20 mx-10 justify-center md:items-start items-center text-[#5A5A5A]'>
      <h3 className='text-3xl font-extrabold'>Create Your Account</h3>
      <p className='text-sm font-medium mb-2'>Study Faster, Learn Smarter.</p>
      {error && <p className='text-red-500 text-sm font-medium'>{error}</p>}
      <form onSubmit={handleSubmit} className='w-full flex flex-col gap-3 my-4 md:items-start items-center'>
        <div className='flex gap-1 justify-between lg:w-sm'>
          <AuthInput
            type='text'
            placeholder='First Name'
            icon={<CgRename className='size-5 opacity-50' />}
            className=''
            value={formData.fname}
            onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
          />
          <AuthInput
            type='text'
            placeholder='Last Name'
            icon={<CgRename className='size-5 opacity-50' />}
            className=''
            value={formData.lname}
            onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
          />
        </div>
        <AuthInput
          type='text'
          placeholder='Username'
          icon={<FaRegUser className='size-5 opacity-50' />}
          className='lg:w-sm'
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <AuthInput
          type='email'
          placeholder='Email'
          icon={<MdOutlineMailOutline className='size-5 opacity-50' />}
          className='lg:w-sm'
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <AuthInput
          type='password'
          placeholder='Password'
          icon={<CgPassword className='size-5 opacity-50' />}
          className='lg:w-sm'
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <AuthInput
          type='password'
          placeholder='Confirm Password'
          icon={<CgPassword className='size-5 opacity-50' />}
          className='lg:w-sm'
          value={formData.password2}
          onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
        />
        <AuthButton label='SIGN UP' type='submit' className='mt-5' />
      </form>
      <p className='text-zinc-500 text-sm'>Already have an account? <a href="/login" className='text-[#D05C28] font-semibold hover:underline'>Sign in here</a></p>
    </div>
  )
}

export default Register