import React, { useEffect, useState } from 'react'
import NoteSideBar from '../../components/features/NoteSideBar'
import NoteAssistBar from '../../components/features/NoteAssistBar'
import PageEditor from '../../components/features/PageEditor'
import { useNotebooks } from '../../../providers/NotebookProvider'
import { useNavigate } from 'react-router-dom'
import UploadModal from '../../components/features/UploadModal'
import FlashNotif from '../../components/ui/FlashNotif'
import { useBooks } from '../../../providers/BookProvider'
import { useAuth } from '../../../hooks/useAuth'

const Note = () => {
  const navigate = useNavigate();
  const { currentNotebook } = useNotebooks();
  const { isLoading, uploadBook } = useBooks();
  const { user } = useAuth();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log('Current notebook:', currentNotebook);
    if (currentNotebook === null) {
      navigate('/notebooks');
    }
  }, [currentNotebook, navigate]);

  const onUpload = async (file: File) => {
    console.log('Uploading file:', file);
    if (currentNotebook) {
      try {
        if (user && file) {
          const formData = new FormData();
          formData.append('pdf', file);

          await uploadBook(currentNotebook.id, formData);
          console.log('File uploaded successfully:', file.name);
          setFlashMessage(`File "${file.name}" uploaded successfully!`);
          setUploadModalOpen(false);
        } else {
          setFlashMessage('You must be logged in to upload files.');
          console.error('User is not authenticated');
        }
      } catch (error) {
        setFlashMessage(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setUploadModalOpen(false);
        console.error('Error uploading file:', error);
      }
    }
  }

  return (
    <div className='w-full h-full p-5 bg-zinc-600/15'>
      {uploadModalOpen && (
        <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={onUpload} />
      )}

      {flashMessage && (
        <FlashNotif message={flashMessage} duration={3000} onClose={() => setFlashMessage(null)} />
      )}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white px-6 py-4 rounded shadow text-[#037581] font-semibold">
            Uploading and converting notes...
          </div>
        </div>
      )}

      <div className='w-full h-full flex bg-white/60 rounded-lg shadow-lg justify-between gap-5'>
        <NoteSideBar uploadModalClick={() => setUploadModalOpen(!uploadModalOpen)} noteTitle={currentNotebook!.description ?? ''} notebook={currentNotebook!.title ?? ''} createdAt={currentNotebook!.created_at} updatedAt={currentNotebook!.updated_at} />

        <div className='w-full h-full py-4'>
          <PageEditor />
        </div>

        <NoteAssistBar />
      </div>
    </div>
  )
}

export default Note