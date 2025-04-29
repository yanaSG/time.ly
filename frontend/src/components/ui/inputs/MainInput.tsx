import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface MainInputProps {
    label: string;
    type: string;
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const MainInput: React.FC<MainInputProps> = ({ label, type, placeholder, value, onChange, className }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='flex flex-col gap-2'>
            <label htmlFor="" className='text-sm text-zinc-900'>{label}</label>
            <div className="relative">
                <input
                    type={type === 'password' && showPassword ? 'text' : type}
                    placeholder={placeholder}
                    className={`border-zinc-500 border-1 rounded-md p-2 text-zinc-500 ${className}`}
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

export default MainInput;