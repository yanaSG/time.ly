import React from 'react'
import { IoArrowUndoOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import UploadButton from '../../components/ui/buttons/UploadButton'

interface NoteSideBarProps {
    notebook: string;
    noteTitle: string;
}

const NoteSideBar: React.FC<NoteSideBarProps> = ({ notebook, noteTitle }) => {
    return (
        <div className='w-65 h-full p-3 flex flex-col justify-between bg-white/90 rounded-xl shadow-lg'>
            <div className='flex justify-between items-center'>
                <IoArrowUndoOutline className='text-[#414A4B] size-8 cursor-pointer' />
                <FaRegEdit className='text-[#414A4B] size-5 cursor-pointer' />
            </div>

            <div className='flex flex-col gap-3'>
                <div className='flex flex-col'>
                    <h6 className='text-[#262F30] text-sm font-semibold'>{notebook}</h6>
                    <h4 className='text-[#262F30] text-md font-bold'>{noteTitle}</h4>
                </div>

                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-2'>
                        <h6 className='text-[#6C7778] text-xs font-bold'>Mastery Goal</h6>
                        <p className='text-[#6C7778] text-xs'>May 24, 2025 - 5 days left</p>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <div>
                            <p className='text-[#6C7778] text-xs'>Notes reviewed:</p>
                            <div className="w-full bg-[#8BCBC0] rounded-full h-2.5">
                                <div className="w-[60%] bg-[#5FA4A5] h-2.5 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <p className='text-[#6C7778] text-xs'>Completed sessions:</p>
                            <div className="w-full bg-[#F2C2BD] rounded-full h-2.5">
                                <div className="w-[30%] bg-[#EF988F] h-2.5 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-2'>
                        <h6 className='text-[#414A4B]/40 text-xs font-semibold'>Created on</h6>
                        <p className='text-[#414A4B]/40 text-xs'>2023-10-01</p>
                    </div>
                </div>

                <div className='h-70 flex flex-col gap-2 border-t-2 border-zinc-300 pt-2 overflow-y-auto'>
                    <h5 className='text-sm text-[#6C7778]'>Outline</h5>
                    <div className='hover:bg-[#F2F2F2] rounded-lg p-2 cursor-pointer'>
                        <h3 className='text-md text-[#6C7778] font-semibold'>Chapter 1: Intro</h3>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                <UploadButton />
                
                <div className='text-sm text-[#6C7778]'>
                    Page 1 of 1
                </div>
            </div>
        </div>
    )
}

export default NoteSideBar