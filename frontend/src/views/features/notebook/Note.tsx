import React, { useEffect } from 'react'
import NoteSideBar from '../../components/features/NoteSideBar'
import NoteAssistBar from '../../components/features/NoteAssistBar'
import PageEditor from '../../components/features/PageEditor'
import { useNotebooks } from '../../../providers/NotebookProvider'
import { useNavigate } from 'react-router-dom'

const Note = () => {
  const navigate = useNavigate();
  const { currentNotebook, getNotebookById } = useNotebooks();

  useEffect(() => {
    console.log('Current notebook:', currentNotebook);
    if (currentNotebook === null) {
      navigate('/notebooks');
    }
  }, [currentNotebook, navigate]);
  
  return (
    <div className='w-full h-full p-5 bg-zinc-600/15'>
      <div className='w-full h-full flex bg-white/60 rounded-lg shadow-lg justify-between gap-5'>
        <NoteSideBar noteTitle={currentNotebook!.description ?? ''} notebook={currentNotebook!.title ?? ''} createdAt={currentNotebook!.created_at} updatedAt={currentNotebook!.updated_at} />
        
        <div className='w-full h-full py-4'>
          <PageEditor />
        </div>

        <NoteAssistBar />
      </div>
    </div>
  )
}

export default Note