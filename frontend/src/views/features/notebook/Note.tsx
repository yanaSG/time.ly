import React, { useEffect, useState, useCallback } from 'react';
import NoteSideBar from '../../components/features/NoteSideBar';
import NoteAssistBar from '../../components/features/NoteAssistBar';
import PageEditor from '../../components/features/PageEditor';
import { useNotebooks } from '../../../providers/NotebookProvider';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../../components/features/UploadModal';
import FlashNotif from '../../components/ui/FlashNotif';
import { useBooks } from '../../../providers/BookProvider';
import { useAuth } from '../../../hooks/useAuth';
import { useNotebookContent } from '../../../providers/NotebookContentProvider';
import NotebookModal from '../../components/features/NotebookModal';
import { Notebook } from '../../../types/Notebook';


const Note = () => {
  const navigate = useNavigate();
  const { currentNotebook, updateNotebook, fetchNotebooks } = useNotebooks();
  const { isLoading: isBookLoading, uploadBook } = useBooks();
  const { user } = useAuth();
  const { currentContent, isLoading: isContentLoading, updateNotebookContent } = useNotebookContent();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [markdownToAppend, setMarkdownToAppend] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    console.log('Note: Current notebook (on mount/change):', currentNotebook);
    if (currentNotebook === null) {
      navigate('/notebooks');
    }
  }, [currentNotebook, navigate]);

  const onUpload = async (file: File) => {
    console.log('Note: Uploading file:', file);
    if (currentNotebook) {
      try {
        if (user && file) {
          const formData = new FormData();
          formData.append('pdf', file);

          const generatedMarkdown = await uploadBook(currentNotebook.id, formData);
          console.log('Note: File uploaded successfully:', file.name);
          setFlashMessage(`File "${file.name}" uploaded successfully!`);
          setUploadModalOpen(false);

          if (generatedMarkdown) {
            setMarkdownToAppend(generatedMarkdown);
          }
        } else {
          setFlashMessage('You must be logged in to upload files.');
          console.error('Note: User is not authenticated');
        }
      } catch (error) {
        setFlashMessage(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setUploadModalOpen(false);
        console.error('Note: Error uploading file:', error);
      }
    }
  };

  const handleEditorContentChange = useCallback(async (content: string | null) => {
    console.log('Note: handleEditorContentChange received content:', content);
    console.log('Note: currentNotebook BEFORE update attempt:', currentNotebook);
    if (currentNotebook && content) {
      try {
        await updateNotebookContent(currentNotebook.id, content);
        console.log('Note: Notebook content saved successfully.');
      } catch (error) {
        console.error('Note: Error saving notebook content:', error);
      }
    } else {
      console.warn('Note: currentNotebook is null or undefined, skipping content save.');
    }
  }, [currentNotebook, updateNotebookContent]);

  const handleAppendDone = useCallback(() => {
    setMarkdownToAppend(null);
  }, []);

  const handleUpdateNotebook = useCallback(async (notebookId: number, updatedFields: Partial<Notebook> & { color?: string; mastery_goal?: string | null }) => {
    try {
      await updateNotebook(notebookId, updatedFields);
      await fetchNotebooks(); // Re-fetch notebooks to update the list and currentNotebook in context
      setFlashMessage('Notebook updated successfully!');
      setEditModalOpen(false); // Close the modal on success
    } catch (error) {
      console.error('Note: Error updating notebook:', error);
      setFlashMessage(`Error updating notebook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [updateNotebook, fetchNotebooks]);

  const overallLoading = isBookLoading || isContentLoading;

  // Debugging: Log currentContent just before rendering PageEditor
  console.log('Note: currentContent being passed to PageEditor:', currentContent);

  return (
    <div className='w-full h-full p-5 bg-zinc-600/15'>
      {/* Upload Modal */}
      {uploadModalOpen && (
        <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={onUpload} />
      )}

      {/* Edit Notebook Modal */}
      {editModalOpen && currentNotebook && (
        <NotebookModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdateNotebook={handleUpdateNotebook}
          initialNotebook={currentNotebook} // Pass the current notebook for editing
          user={user}
        />
      )}

      {/* Flash Notification */}
      {flashMessage && (
        <FlashNotif message={flashMessage} duration={3000} onClose={() => setFlashMessage(null)} />
      )}

      {/* Overall Loading Indicator */}
      {overallLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white px-6 py-4 rounded shadow text-[#037581] font-semibold">
            {isBookLoading ? 'Uploading and converting notes...' : 'Loading notebook content...'}
          </div>
        </div>
      )}

      {/* Conditionally render the main content once loading is complete */}
      {/* Ensure currentNotebook is available before rendering PageEditor with its key */}
      {!overallLoading && currentNotebook ? (
        <div className='w-full h-full flex bg-white/60 rounded-lg shadow-lg justify-between gap-5'>
          {/* Note Sidebar */}
          <NoteSideBar
            uploadModalClick={() => setUploadModalOpen(!uploadModalOpen)}
            saveButtonClick={() => handleEditorContentChange(currentContent)}
            editModalClick={() => setEditModalOpen(!editModalOpen)}
            noteTitle={currentNotebook?.description ?? ''}
            notebook={currentNotebook?.title ?? ''}
            createdAt={currentNotebook?.created_at ?? ''}
            updatedAt={currentNotebook?.updated_at ?? ''}
          />

          {/* Page Editor */}
          <div className='w-full h-full py-4'>
            <PageEditor
              notebook={currentNotebook.id}
              initialContent={currentContent}
              appendMarkdown={markdownToAppend}
              onContentChange={handleEditorContentChange}
              onAppendDone={handleAppendDone}
            />
          </div>

          {/* Note Assist Bar */}
          <NoteAssistBar />
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default Note;
