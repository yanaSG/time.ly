import React from 'react'

interface AuthButtonProps {
    label: string;
    type: "button" | "submit" | "reset";
    className?: string;
    onClick?: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ label, type, className, onClick }) => {
    return (
        <button type={type}
            className={`w-50 text-sm font-semibold rounded-xl text-slate-100 p-3 px-9 cursor-pointer duration-200 ease-in bg-gradient-to-r from-[#FFD25E] to-[#037682] transition-all bg-[length:200%_200%] bg-left hover:bg-right ${className}`}
            onClick={onClick}>
            {label}
        </button>
    )
}

export default AuthButton