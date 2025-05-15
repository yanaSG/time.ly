import React from 'react'
import NoteSideBar from '../../components/features/NoteSideBar'
import NoteAssistBar from '../../components/features/NoteAssistBar'
import PageEditor from '../../components/features/PageEditor'

const Note = () => {
  return (
    <div className='w-full h-full p-5 bg-zinc-600/15'>
      <div className='w-full h-full flex bg-white/60 rounded-lg shadow-lg justify-between gap-5'>
        <NoteSideBar noteTitle='Lesson 1: Derivatives' notebook='Calculus 1' />
        
        <div className='w-full h-full py-4'>
          <PageEditor />
        </div>

        <NoteAssistBar />
      </div>
    </div>
  )
}

export default Note