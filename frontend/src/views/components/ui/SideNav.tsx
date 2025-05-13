import React, { useState } from 'react'
import { NAV_ROUTES } from '../../../routes/routes';
import SideNavLink from './SideNavLink'
import { FaArrowRightToBracket, FaArrowRightFromBracket } from "react-icons/fa6";

const SideNav: React.FC = () => {
  const logoShortPath = '/logo-short-1.png';
  const logoPath = '/logo-1.png';

  const [openNav, setOpenNav] = useState(true);

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  return (
    <div className={`h-screen flex flex-col justify-between items-center bg-[#EDEDED] transform transition-all duration-300
      ${openNav ? 'sm:w-50 sm:items-end w-17' : 'w-17'}`}>
      <div className='w-full flex flex-col gap-10 items-center'>
        <div className='w-full flex flex-grow justify-center'>
          {
            !openNav ?
              <img src={logoShortPath} alt="Time.ly Logo" className='w-16 p-1 mt-3' /> :
              <img src={logoPath} alt="Time.ly Logo" className='w-35 p-3 sm:block hidden' />
          }
          {openNav ? <img src={logoShortPath} alt="Time.ly Logo" className='w-16 p-1 mt-3 sm:hidden' /> : null}
        </div>
        <div className={`w-full flex flex-col gap-5 items-center pe-1
          ${openNav ? 'sm:pe-3' : ''}`}>
          {
            NAV_ROUTES.map((route) => (
              <SideNavLink key={route.path} nav={openNav} path={route.path || ''} label={route.meta?.title ?? 'Unknown'} />
            ))
          }
        </div>
      </div>
      <div onClick={toggleNav}
        className={`w-[80%] text-[#037581] p-2 mb-5 flex items-center justify-center gap-2 rounded-full cursor-pointer hover:text-white hover:bg-[#037581] transform transition-all duration-200
          ${openNav ? 'sm:w-[25%] sm:me-5' : ''}`}>
        {
          openNav ?
            <FaArrowRightFromBracket className='size-7 rotate-y-180 sm:block hidden' /> :
            <FaArrowRightToBracket className='size-7' />
        }
      </div>
    </div>
  )
}

export default SideNav