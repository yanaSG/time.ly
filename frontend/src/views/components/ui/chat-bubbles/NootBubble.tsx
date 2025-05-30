import React from 'react'

interface NootBubbleProps {
  message: string;
   role?: 'user' | 'assistant' | 'system'; 
}

const NootBubble: React.FC<NootBubbleProps> = ({ message, role }) => {

  // Different styling based on message role
  const bubbleClasses = role === 'assistant' 
    ? "bg-gradient-to-br from-[#037682] to-[#FCD05D] text-white text-start"
    : "bg-white text-gray-800 text-end border border-gray-200";

  return (
    <div className={`w-full p-2 rounded-lg ${bubbleClasses}`}>
      <p className='text-xs'>{message}</p>
    </div>
  )

  // return (
  //   <div className="w-full p-2 text-start bg-gradient-to-br from-[#037682] to-[#FCD05D] rounded-lg">
  //       <p className='text-white text-xs'>{message}</p>
  //   </div>
  // )
}

export default NootBubble