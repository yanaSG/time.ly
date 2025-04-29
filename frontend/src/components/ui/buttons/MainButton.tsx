import React from 'react'

interface MainButtonProps {
    label: string;
    type: "button" | "submit" | "reset";
    className?: string;
    onClick?: () => void;
}

const MainButton: React.FC<MainButtonProps> = ({ label, type, className, onClick }) => {
    return (
        <button type={type}
            className={`bg-gray-700 rounded-xl text-slate-100 p-3 px-9 m-3 hover:bg-gray-800 cursor-pointer duration-200 ease-in ${className}`}
            onClick={onClick}>
            {label}
        </button>
    )
}

export default MainButton