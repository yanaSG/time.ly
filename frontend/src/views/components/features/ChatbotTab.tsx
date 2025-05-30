

// import React from 'react'
// import { GrSend } from "react-icons/gr";
// import type { Message } from '../../../providers/ChatProvider';
// import { useChat } from '../../../hooks/useChat';
// import NootBubble from '../ui/chat-bubbles/NootBubble';


// const ChatbotTab: React.FC = () => {
//     const { userInput, setUserInput, sendMessage, messages } = useChat();
//     const noot = 'noot.svg'

//     return (
//         <div className='w-full h-full flex flex-col gap-2 items-start'>
//             <img src={noot} alt="noot" className='h-7 m-1 mx-2' />
//             <div className='w-full h-full flex flex-col gap-3 bg-white/70 rounded-lg shadow-black/10 shadow-[0_-1px_10px_0_rgba(0,0,0,0.2)]'>
//                 <div className='w-full h-full p-2'>
//                     <NootBubble message='Hey there! I am Noot—your pocket-sized study buddy! Ready to turn that textbook into bite-sized gems? Upload a PDF or ask me anything!' />
//                     {/* Chat history */}
//                     <div className="flex flex-col gap-2 mt-2 max-h-48 overflow-y-auto">
//                         {messages.map((msg: Message, idx: number) => (
//                             <div
//                                 key={idx}
//                                 className={`text-xs px-3 py-2 rounded-lg ${
//                                     msg.role === "user"
//                                         ? "bg-[#037682] text-white self-end"
//                                         : msg.role === "assistant"
//                                         ? "bg-gray-100 text-gray-800 self-start"
//                                         : "bg-yellow-100 text-yellow-800 self-center"
//                                 }`}
//                             >
//                                 {msg.content}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 <div className='w-full h-40 p-2 flex gap-1 bg-white rounded-lg shadow-black/20 shadow-[0_-1px_10px_0_rgba(0,0,0,0.2)]'>
//                     <textarea
//                         value={userInput}
//                         onChange={e => setUserInput(e.target.value)}
//                         className='w-full text-sm focus:outline-none resize-none'
//                         placeholder='Message noot.'
//                     ></textarea>
//                     <button
//                         className='max-h-max text-white bg-[#037682] rounded-full p-2 hover:bg-white hover:text-[#037682] transform transition-all duration-200 cursor-pointer'
//                         onClick={sendMessage}
//                     >
//                         <GrSend className='size-4' />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ChatbotTab







import React from 'react'
import { GrSend } from "react-icons/gr";
import type { Message } from '../../../providers/ChatProvider';
import { useChat } from '../../../hooks/useChat';

import NootBubble from '../ui/chat-bubbles/NootBubble';




const ChatbotTab: React.FC = () => {

   // const { userInput, setUserInput, sendMessage, messages } = useChat();
    const noot = 'noot.svg'

    return (
        <div className='w-full h-full flex flex-col gap-2 items-start'>
            <img src={noot} alt="noot" className='h-7 m-1 mx-2' />
            <div className='w-full h-full flex flex-col gap-3 bg-white/70 rounded-lg shadow-black/10 shadow-[0_-1px_10px_0_rgba(0,0,0,0.2)]'>
                <div className='w-full h-full p-2'>
                    <NootBubble message='Hey there! I am Noot—your pocket-sized study buddy! Ready to turn that textbook into bite-sized gems? Upload a PDF or ask me anything!' />


                    {/* <NootBubble message='Hey there! I am Noot—your pocket-sized study buddy! Ready to turn that textbook into bite-sized gems? Upload a PDF or ask me anything!' /> */}
                </div>
                <div className='w-full h-40 p-2 flex gap-1 bg-white rounded-lg shadow-black/20 shadow-[0_-1px_10px_0_rgba(0,0,0,0.2)]'>
                    <textarea
                        name=""
                        id=""
                        className='w-full text-sm focus:outline-none resize-none'
                        placeholder='Message noot.'
                    ></textarea>
                    <button className='max-h-max text-white bg-[#037682] rounded-full p-2 hover:bg-white hover:text-[#037682] transform transition-all duration-200 cursor-pointer'>
                        <GrSend className='size-4' />
                    </button>
                </div>
            </div>
        </div>
    )

}

export default ChatbotTab