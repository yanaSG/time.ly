import React, { ReactNode } from 'react'
import { Outlet } from 'react-router-dom';

type AuthLayoutProps = {
  children?: ReactNode;
};

const AuthLayout: React.FC = ({ children }: AuthLayoutProps) => {
  return (
    <div className='flex items-center justify-center h-screen w-screen p-3 bg-zinc-950 md:grid-cols-2'>
      <div className='flex flex-col gap-3 justify-center items-center bg-amber-50 rounded-md me-2 w-full h-full bg-linear-to-bl from-gray-800 to-zinc-950'>
        <h2 className='text-6xl font-bold underline mb-3 text-slate-100'>Logo</h2>
        <h2 className='text-3xl font-bold bg-linear-to-r from-white to-zinc-600 text-transparent bg-clip-text'>
          One Platform to Streamline</h2>
        <h2 className='text-3xl font-bold bg-linear-to-r from-white to-zinc-600 text-transparent bg-clip-text'>
          For Your Work</h2>
      </div>

      <div className='bg-slate-50 rounded-md w-full h-full flex flex-col justify-between'>
        <div>
          <h3 className='text-xl text-zinc-900 font-bold underline m-3'>Logo</h3>
        </div>

        {children || <Outlet />}

        <div className='flex gap-3 justify-between m-4 text-sm'>
          <h5 className='text-zinc-600 font-medium'>&copy; 2025 Company Name</h5>
          <div className='flex gap-3 justify-between items-center'>
            <ul className='flex gap-3'>
              <li className='text-zinc-600 font-medium hover:underline cursor-pointer'>Privacy Policy</li>
              <li className='text-zinc-600 font-medium hover:underline cursor-pointer'>Support</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AuthLayout;