import React from 'react'

interface SaveButtonProps {
    onClick?: () => void;
};

const SaveButton: React.FC<SaveButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex justify-center items-center gap-2 rounded-lg p-2 text-sm text-white font-semibold bg-gradient-to-br from-[#EF988F] to-[#FFD25E] transition-all duration-200 hover:brightness-110 hover:scale-105 cursor-pointer"
        >
            Save Notebook
        </button>
    )
}

export default SaveButton