import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface AuthInputProps {
    type: string;
    placeholder: string;
    icon: React.ReactNode;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const AuthInput: React.FC<AuthInputProps> = ({ type, placeholder, icon, value, onChange, className }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='flex flex-col gap-2 w-full flex-grow text-sm'>
            <div className="relative flex items-center w-full flex-grow">
            <span className="absolute left-4 text-zinc-500">{icon}</span>
            <input
                type={type === 'password' && showPassword ? 'text' : type}
                placeholder={placeholder}
                className={`border-zinc-500/60 border-2 rounded-2xl p-2 pl-12 w-full text-zinc-500 focus:outline-1 focus:outline-zinc-500/60 ${className}`}
                value={value}
                onChange={onChange}
            />
            {type === 'password' && (
                <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-500 cursor-pointer">
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
            )}
            </div>
        </div>
    );
};

export default AuthInput;