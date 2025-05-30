import React, { useEffect, useState } from 'react'
import { Notebook } from '../../../types/Notebook';
import { useAuth } from '../../../hooks/useAuth';
import { useNotebooks } from '../../../providers/NotebookProvider';
import FlashNotif from '../../components/ui/FlashNotif';
import { useNavigate } from 'react-router-dom';
import { useNotebookContent } from '../../../providers/NotebookContentProvider';
import NotebookModal from '../../components/features/NotebookModal'; // Import the new modal component
import { useBooks } from '../../../providers/BookProvider';

const Notebooks: React.FC = () => {
  const navigate = useNavigate(); // Hook to navigate between routes

  // State to track created notebooks; each notebook is an object with id, name, and description
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth(); // Get the current user from authentication context
  const { notebooks, fetchNotebooks, addNotebook, getNotebookById } = useNotebooks();
  const { getNotebookContent, currentContent } = useNotebookContent();
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const { titles, getBookTitles } = useBooks();

  // Effect to handle body overflow when modal is open
  // This prevents scrolling of the background content when the modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showModal]);

  // Function to open and close the modal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Function to handle form submission from the modal
  const handleAddNotebook = async (newNotebook: Omit<Notebook, "id" | "created_at" | "updated_at"> & { color: string; mastery_goal: string | null }) => {
    try {
      await addNotebook(newNotebook);
      fetchNotebooks();
      setFlashMessage('Notebook created successfully!');
    } catch (error: any) {
      console.error('Error creating notebook:', error);
      setFlashMessage('Failed to create notebook');
    }
  };

  const handleNotebookClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
    e.preventDefault();

    try {
      const notebook = await getNotebookById(id);
      console.log('Selected notebook:', notebook);
      if (notebook) {
        await getNotebookContent(notebook.id);
        await getBookTitles(notebook.id);
        console.log('Notebooks: FETCHED TITLES: ', titles);
        console.log('Notebools: FETCHED CONTENT: ', currentContent);
        console.log('Navigating to note with notebook ID:', notebook.id);
        navigate('/note');
      } else {
        alert('Notebook not found');
      }
    } catch (error) {
      console.error('Error fetching notebook:', error);
      alert('Failed to fetch notebook');
    }
  };

  useEffect(() => {
    fetchNotebooks();
  }, []);

  return (
    <div className='fixed'>
      {flashMessage && (
        <FlashNotif
          message={flashMessage}
          onClose={() => setFlashMessage(null)}
        />
      )}
      <div className="flex flex-row ">
        <div className="flex flex-row z-0 align-center items-center gap-5 p-10 w-full">
          <div onClick={openModal}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                openModal();
              }
            }}
            className="flex bg-[#FFD25E] mr-100 p-4 w-1/4.5 align-center justify-center items-start rounded-2xl shadow-lg text-white transition-transform duration-300 hover:scale-105 cursor-pointer">
            <img
              src="/add-notebook.png"
              alt="Add Notebook"
              className="h-5 w-5 inline-block mr-2"
            />
            <p>Add New Notebook</p>
          </div>
        </div>

        <div className="p-4 w-1/2 flex justify-end items-center">
          <input
            type="text"
            placeholder="Search Notebooks..."
            className="w-100 p-3 h-1/2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD25E]"
          />
          <button className="bg-[#FFD25E] h-1/2 text-white rounded-full px-4 py-2 ml-2 hover:bg-[#E6B84F] transition-transform duration-300 hover:scale-105 cursor-pointer">
            Search
          </button>
        </div>
      </div>
      {/* notebooks */}
      <div className="h-full w-full grid grid-cols-6 gap-5 pt-5 px-10">

        {notebooks.map((notebook: Notebook) => (
          <div
            key={notebook.id}
            onClick={(event) => handleNotebookClick(event, notebook.id)}
            className="flex flex-wrap gap-5 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="pt-6">
              <img
                src="/binder.png"
                alt="Dashboard Illustration"
                className="absolute pl-2 h-42 w-auto z-0"
              />
            </div>
            {/* You might want to use notebook.color here to dynamically set the background color */}
            <div className={`pl-4 pr- 5 flex flex-col justify-center h-55 w-40 rounded-2xl z-10 shadow-lg ${notebook.color ? `bg-[${notebook.color}]` : 'bg-[#FFD25E]'}`}
                 style={{ backgroundColor: notebook.color || '#FFD25E' }}> {/* Use notebook.color if available */}
              <h3 className="text-xl font-bold text-white">{notebook.title}</h3>
              <p className="text-white text-sm">{notebook.description}</p>
              {notebook.mastery_goal && ( // Display mastery goal if it exists
                <p className="text-white text-xs mt-2">Goal: {new Date(notebook.mastery_goal).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for creating a new notebook */}
      <NotebookModal
        isOpen={showModal}
        onClose={closeModal}
        onAddNotebook={handleAddNotebook}
        user={user}
      />
    </div>
  )
}

export default Notebooks
