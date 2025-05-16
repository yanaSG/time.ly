import React, { useState } from 'react'
import { FaArrowRightFromBracket, FaArrowRightToBracket } from 'react-icons/fa6';
import { MdUpload } from "react-icons/md";
import { SiChatbot } from "react-icons/si";
import { TbPlayCardStar } from "react-icons/tb";
import UploadTab from './UploadTab';
import ChatbotTab from './ChatbotTab';
import SuggestionTab from './SuggestionTab';

const NoteAssistBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadTab, setUploadTab] = useState(false);
  const [chatTab, setChatTab] = useState(false);
  const [suggestionTab, setSuggestionTab] = useState(false);

  const openAssistBar = (tab: string | null) => {
    if (tab === 'upload') {
      setIsOpen(true);
      setUploadTab(true);
      setChatTab(false);
      setSuggestionTab(false);
    } else if (tab === 'chat') {
      setIsOpen(true);
      setChatTab(true);
      setUploadTab(false);
      setSuggestionTab(false);
    } else if (tab === 'suggestion') {
      setIsOpen(true);
      setSuggestionTab(true);
      setUploadTab(false);
      setChatTab(false);
    } else {
      setIsOpen(!isOpen);
      setUploadTab(false);
      setChatTab(false);
      setSuggestionTab(false);
    }
  }

  const openUploadTab = () => {
    setUploadTab(true);
    setChatTab(false);
    setSuggestionTab(false);
  }

  const openChatTab = () => {
    setChatTab(true);
    setUploadTab(false);
    setSuggestionTab(false);
  }

  const openSuggestionTab = () => {
    setSuggestionTab(true);
    setUploadTab(false);
    setChatTab(false);
  }

  return (
    <div className={`w-15 h-full flex flex-col justify-start gap-1 bg-white/40 rounded-xl shadow-lg ${isOpen ? 'w-75' : ''} transform transition-all duration-200`}>
      {
        isOpen && (
          <div onClick={() => openAssistBar(null)}
            className={`w-11 text-[#037581] p-2 m-1 flex items-center justify-center gap-2 rounded-full cursor-pointer hover:text-white hover:bg-[#037581] transform transition-all duration-200`}>
            <FaArrowRightFromBracket className='size-5 sm:block hidden' />
          </div>
        )
      }
      <div className={`flex p-2 gap-2 ${isOpen ? '' : 'flex-col'} transform transition-all duration-200`}>
        <div
          className={`w-full p-2 rounded-lg flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#037682] hover:text-white transform transition-all duration-200
            ${uploadTab ? 'bg-[#037682] text-white' : 'bg-white text-[#037682]'}`}
          onClick={() => openAssistBar('upload')}>
          <MdUpload className='size-7' />
        </div>
        <div
          className={`w-full p-2 rounded-lg flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#FFD25E] hover:text-white transform transition-all duration-200
            ${chatTab ? 'bg-[#FFD25E] text-white' : 'bg-white text-[#FFD25E]'}`}
          onClick={() => openAssistBar('chat')}>
          <SiChatbot className='size-7' />
        </div>
        <div
          className={`w-full p-2 rounded-lg flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#D05C28] hover:text-white transform transition-all duration-200
            ${suggestionTab ? 'bg-[#D05C28] text-white' : 'bg-white text-[#D05C28]'}`}
          onClick={() => openAssistBar('suggestion')}>
          <TbPlayCardStar className='size-7' />
        </div>
      </div>
      <div className='h-full'>
        {uploadTab && <UploadTab />}
        {chatTab && <ChatbotTab />}
        {suggestionTab && <SuggestionTab />}
      </div>
    </div>
  )
}

export default NoteAssistBar