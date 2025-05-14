import React from 'react'
import { IoAddCircleOutline } from "react-icons/io5";

const UploadButton: React.FC = () => {
    return (
        <button
            className="flex items-center gap-2 rounded-lg p-2 text-sm text-white font-semibold bg-gradient-to-br from-[#EF988F] via-[#FFD25E] via-10% to-[#037682] to-90% transition-all duration-200 hover:brightness-110 hover:scale-105 cursor-pointer"
        >
            <IoAddCircleOutline className="size-7 text-white" />
            Upload material
        </button>
    )
}

export default UploadButton