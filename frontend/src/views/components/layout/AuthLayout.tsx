import React, { ReactNode } from 'react'
import { Outlet } from 'react-router-dom';

type AuthLayoutProps = {
  children?: ReactNode;
};

const AuthLayout: React.FC = ({ children }: AuthLayoutProps) => {
  const logoPath = '/logo-1.png';
  const doodle1Path = '/doodle-1.png';
  const doodle2Path = '/doodle-2.png';

  return (
    <div className='h-screen w-screen grid items-center justify-center p-3 bg-white grid-cols-1 md:grid-cols-2 bg-radial-[at_0%_100%] from-[#FFDD86] from-5% via-white via-25% to-[#FFFFFF] to-74%'>
      <div className='rounded-md w-full h-full flex flex-col justify-between md:items-start items-center order-2 md:order-1'>
        <div className='sm:p-4 p-2'>
          <img src={logoPath} alt="Time.ly Logo" className='sm:h-15 h-12' />
        </div>

        {children || <Outlet />}

        <div className='w-[95%] flex gap-3 justify-between m-4 text-sm'>
          <h5 className='text-zinc-600 font-medium'>&copy; 2025 KuanMoCode</h5>
          <div className='flex gap-3 justify-between items-center'>
            <ul className='flex gap-3'>
              <li className='text-zinc-600 font-medium hover:underline cursor-pointer'>Privacy Policy</li>
              <li className='text-zinc-600 font-medium hover:underline cursor-pointer'>Support</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-start rounded-2xl lg:me-2 lg:pt-20 lg:ps-10 p-5 w-full h-full bg-cover bg-center relative bg-[url('/bg-1.png')] order-1 md:order-2">
        <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#EF988F]/60 from-5% via-[#FFD25E]/60 via-30% to-[#037682]/60"></div>
        <div className="relative z-10">
          <img src={doodle1Path} alt="Doodle 1" className='sm:h-45 md:flex h-auto hidden' />
          {window.location.pathname === '/login' ?
            <div>
              <h2 className="hidden md:block text-6xl font-extrabold mb-3 text-slate-100 drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)]">Turn Pages into</h2>
              <h2 className="hidden md:block text-6xl font-extrabold mb-3 text-slate-100 drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)]">Progress.</h2>
              <h2 className="md:hidden text-3xl font-extrabold mb-3 text-slate-100 drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)]">Turn Pages into Progress.</h2>
              <h2 className="md:text-3xl text-lg font-medium text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                Your AI Study Partner is Here!
              </h2>
            </div> :
            <div>
              <h2 className="hidden md:block text-6xl font-extrabold mb-3 text-slate-100 drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)]">Unlock Smarter</h2>
              <h2 className="hidden md:block text-6xl font-extrabold mb-3 text-slate-100 drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)]">Study Sessions.</h2>
              <h2 className="md:hidden text-2xl font-extrabold mb-3 text-slate-100 drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)]">Unlock Smarter Study Sessions.</h2>
              <h2 className="md:text-3xl text-lg font-medium text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                Let AI Do the Heavy Lifting!
              </h2>
            </div>
          }
          <img src={doodle2Path} alt="Doodle 2" className='sm:h-7 h-4 lg:ms-5 flex-grow' />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout;