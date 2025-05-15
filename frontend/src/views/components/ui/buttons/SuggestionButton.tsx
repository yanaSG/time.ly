import React from 'react'

interface SuggestionButtonProps {
    message: string;
}

const SuggestionButton: React.FC<SuggestionButtonProps> = ({ message }) => {
    return (
        <div className="w-full p-2 text-start bg-gradient-to-br from-[#037682] to-[#FCD05D] rounded-lg">
            <p className='text-white text-xs'>{message}</p>
        </div>
    )
}

export default SuggestionButton