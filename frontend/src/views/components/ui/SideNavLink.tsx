import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaBookBookmark } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";

interface SideNavLinkProps {
    nav: boolean;
    path: string;
    label: string;
}

const SideNavLink: React.FC<SideNavLinkProps> = ({ nav, path, label }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = location.pathname.includes(path);

    const handleClick = () => {
        navigate(path);
    };

    return (
        <div
            onClick={handleClick}
            className={`w-full flex items-center justify-start gap-2 p-2 rounded-tr-2xl rounded-br-2xl cursor-pointer text-[#037581] transform transition-all duration-200
                ${isActive ? 'bg-[#037581] text-white' : 'hover:bg-white'} `}
        >
            <div className='w-8 h-8 items-center justify-center flex ms-3'>
                {label === 'Dashboard' ? (
                    <RiDashboardHorizontalFill size={25} />
                ) : label === 'Notebooks' ? (
                    <FaBookBookmark size={23} />
                ) : label === 'Profile' ? (
                    <FaUser size={23} />
                ) : (
                    <IoSettingsSharp size={25} />
                )}
            </div>
            <span
                className={`text-md font-semibold sm:block overflow-hidden transition-all duration-300 ${
                    nav ? 'max-w-xs sm:opacity-100 opacity-0' : 'max-w-0 opacity-0'
                }`}
            >
                {label}
            </span>
        </div>
    );
};

export default SideNavLink;