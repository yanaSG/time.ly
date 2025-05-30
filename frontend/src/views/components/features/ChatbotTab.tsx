import React, { useEffect }from 'react'
import { GrSend } from "react-icons/gr";

import { useChat } from '../../../hooks/useChat';

import NootBubble from '../ui/chat-bubbles/NootBubble';

const ChatbotTab: React.FC = () => {

    const { userInput, setUserInput, sendMessage, messages, clearMessages } = useChat();
    const noot = 'noot.svg'

   useEffect(() => {
        const handleBeforeUnload = () => {
            clearMessages();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [clearMessages]);

    

    return (

        <div className='w-full h-full flex flex-col gap-2 items-start'>
            <div>hello</div>
            <img src={noot} alt="noot" className='h-7 m-1 mx-2' />
            <div className='w-full h-full flex flex-col gap-3 bg-white/70 rounded-lg shadow-black/10 shadow-[0_-1px_10px_0_rgba(0,0,0,0.2)]'>
                <div className='w-full h-full p-2 overflow-y-auto flex flex-col gap-2'>
                    {/* Show the welcome bubble only if there are no assistant messages yet */}
                    {messages.filter(msg => msg.role === "assistant").length === 0 ? (
                        <NootBubble message='Hey there! I am Noot—your pocket-sized study buddy! Ready to turn that textbook into bite-sized gems? Upload a PDF or ask me anything!' />
                    ) : null} 

                    {/* Render all messages */}
                    {messages.map((msg, idx: number) => (
                        <NootBubble key={idx} message={msg.content} role={msg.role} />
                    ))}

                </div>

                <div className='w-full h-40 p-2 flex gap-1 bg-white rounded-lg shadow-black/20 shadow-[0_-1px_10px_0_rgba(0,0,0,0.2)]'>
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className='w-full text-sm focus:outline-none resize-none'
                        placeholder='Message noot.'
                    />
                    <button onClick={sendMessage} className='max-h-max text-white bg-[#037682] rounded-full p-2 hover:bg-white hover:text-[#037682] transform transition-all duration-200 cursor-pointer'>
                        <GrSend className='size-4' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatbotTab

