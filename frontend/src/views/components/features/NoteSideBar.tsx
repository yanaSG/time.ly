import React from 'react'
import { IoArrowUndoOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import UploadButton from '../../components/ui/buttons/UploadButton'
import { useNavigate } from 'react-router-dom';
import SaveButton from '../ui/buttons/SaveButton';

interface NoteSideBarProps {
    notebook: string;
    noteTitle: string;
    createdAt: string;
    updatedAt: Date | string;
    masteryGoal: string;
    uploadModalClick: () => void;
    saveButtonClick?: () => void;
    editModalClick?: () => void;
    deleteModalClick?: () => void;
}

const NoteSideBar: React.FC<NoteSideBarProps> = ({ notebook, noteTitle, masteryGoal, createdAt, updatedAt, uploadModalClick, saveButtonClick, editModalClick, deleteModalClick }) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/notebooks');
    };

    return (
        <div className='w-65 h-full p-3 flex flex-col justify-between bg-white/90 rounded-xl shadow-lg'>
            <div className='flex justify-between items-center'>
                <IoArrowUndoOutline className='text-[#414A4B] size-8 cursor-pointer' onClick={handleBackClick} />
                <div className='flex gap-2 items-center'>
                    <FaRegEdit className='text-[#414A4B] size-5 cursor-pointer' onClick={editModalClick} />
                    <MdDeleteOutline className='text-red-700 size-6 cursor-pointer' onClick={deleteModalClick} />
                </div>
            </div>

            <div className='flex flex-col gap-3 h-full mt-7'>
                <div className='flex flex-col'>
                    <h4 className='text-[#262F30] text-md font-bold'>{notebook}</h4>
                    <h6 className='text-[#262F30] text-sm font-semibold'>{noteTitle}</h6>
                </div>

                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-2'>
                        <h6 className='text-[#6C7778] text-xs font-bold'>Mastery Goal</h6>
                        <p className='text-[#6C7778] text-xs'>
                            {(() => {
                                if (!masteryGoal) return '';
                                const goalDate = new Date(masteryGoal);
                                const now = new Date();
                                const diffTime = goalDate.getTime() - now.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                const formattedDate = goalDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                                if (diffDays > 0) {
                                    return `${formattedDate} - ${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
                                } else if (diffDays === 0) {
                                    return `${formattedDate} - today`;
                                } else {
                                    return `${formattedDate} - ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
                                }
                            })()}
                        </p>
                    </div>

                    <div>
                        <div className='flex gap-2'>
                            <h6 className='text-[#414A4B]/40 text-xs font-semibold'>Created at</h6>
                            <p className='text-[#414A4B]/40 text-xs'>{createdAt ? new Date(createdAt).toISOString().slice(0, 10) : ''}</p>
                        </div>
                        <div className='flex gap-2'>
                            <h6 className='text-[#414A4B]/40 text-xs font-semibold'>Updated at</h6>
                            <p className='text-[#414A4B]/40 text-xs'>{updatedAt ? new Date(updatedAt).toISOString().slice(0, 10) : ''}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-4'>
                <SaveButton onClick={saveButtonClick} />
                <UploadButton onClick={uploadModalClick} />

                {/* <div className='text-sm text-[#6C7778]'>
                    Page 1 of 1
                </div> */}
            </div>
        </div>
    )
}

export default NoteSideBar