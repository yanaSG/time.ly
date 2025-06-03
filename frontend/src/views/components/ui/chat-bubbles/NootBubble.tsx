import React from 'react'

interface NootBubbleProps {
  message: string;
   role?: 'user' | 'assistant' | 'system'; 
}

// Helper to render **bold** and *italic* text
function renderWithBoldAndItalic(text: string) {
  // First, split by **...** for bold
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return boldParts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Bold: remove **
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    } else {
      // Now, split by *...* for italic inside non-bold parts
      const italicParts = part.split(/(\*[^*]+\*)/g);
      return italicParts.map((subPart, subIdx) =>
        subPart.startsWith('*') && subPart.endsWith('*')
          ? <em key={`${idx}-${subIdx}`}>{subPart.slice(1, -1)}</em>
          : subPart
      );
    }
  });
}
const NootBubble: React.FC<NootBubbleProps> = ({ message, role }) => {

  // Different styling based on message role
  const bubbleClasses = role === 'assistant' 
    ? "bg-gradient-to-br from-[#037682] to-[#FCD05D] text-white text-start"
    : "bg-white text-gray-800 text-end border border-gray-200";

  return (
    <div className={`w-full p-2 rounded-lg ${bubbleClasses}`}>
      <p className='text-xs'>{renderWithBoldAndItalic(message)}</p>
    </div>
  )

  // return (
  //   <div className="w-full p-2 text-start bg-gradient-to-br from-[#037682] to-[#FCD05D] rounded-lg">
  //       <p className='text-white text-xs'>{message}</p>
  //   </div>
  // )
}

export default NootBubble