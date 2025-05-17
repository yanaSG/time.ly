import React, { useEffect, useState }from 'react'

interface Notebook{
  id: number;
  name: string;
  description: string;
}

const Notebooks: React.FC = () => {
  
  // State to track created notebooks; each notebook is an object with id, name, and description
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Effect to handle body overflow when modal is open
  // This prevents scrolling of the background content when the modal is open
  useEffect(() => {
    if(showModal){
      document.body.style.overflow='hidden';
    }else{
      document.body.style.overflow='';
    }
  }, [showModal]);

  // Function to open and close the modal
  const openModal = () => setShowModal(true);
  // Function to close the modal and reset the form fields
  const closeModal = () => {
    setTitle('');
    setDescription('');
    setShowModal(false);
  };

  // Function to handle form submission
  // It creates a new notebook object and adds it to the notebooks state
  const handleFormSubmit = (e: React.FormEvent) => {

    if(title.trim()===''){
      alert('Please enter a title');
      return;
    }

    const newNotebook: Notebook = {
      id: notebooks.length,
      name: title.trim(),
      description: description.trim(),
    };

    setNotebooks(prev => [...prev, newNotebook]);
    closeModal();

  };


  // Close modal on clicking outside form
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };


  return (
    <div>
      <div className="flex flex-row ">
        <div onClick={openModal}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              openModal();
            }
          }}
          className="flex flex-row z-0 align-center items-center gap-5 p-10 w-full"
        >
          <div className="flex bg-[#FFD25E] mr-100 p-4 w-1/4.5 items-center align-center justify-center items-start rounded-2xl shadow-lg text-white transition-transform duration-300 hover:scale-105">
            <img 
              src="../../../../../public/add-notebook.png" 
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
          <button className="bg-[#FFD25E] h-1/2 text-white rounded-full px-4 py-2 ml-2 hover:bg-[#E6B84F] transition-transform duration-300 hover:scale-105">
            Search
          </button>
        </div>
      </div>
        {/* notebooks */}
      <div className="flex flex-row gap-5 pt-10">

        {notebooks.map(notebook => (
            <div
            key={notebook.id}
            // onClick={() => window.location.href = `/note/${notebook.id}`}
            onClick={() => window.location.href = `/note`}
            className="flex flex-row gap-5 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
            <div className="pt-6">
              <img 
              src="/binder.png" 
              alt="Dashboard Illustration" 
              className="absolute pl-2 h-42 w-auto z-0"
              />
            </div>
            <div className="pl-4 pr- 5 flex flex-col justify-center bg-[#FFD25E] h-55 w-40 rounded-2xl z-10 shadow-lg pl-2">
              <h3 className="text-xl font-bold text-white">{notebook.name}</h3>
              <p className="text-white text-sm">{notebook.description}</p>
            </div>
            </div>
        ))}
      </div>

      {/* Modal for creating a new notebook */}
      {showModal && ( 
        <div
        // Overlay to close modal on click
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
          // Accessibility attributes for screen readers
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >

        <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4"
            onClick={e => e.stopPropagation()} // Prevent click propagation to overlay
          >
            <h2 className="text-2xl font-bold mb-4" id="modal-title">Add New Notebook</h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-semibold mb-1">
                Notebook Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter notebook title"
                required
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-semibold mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter notebook description"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                // Close modal on click
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-white font-semibold rounded hover:bg-yellow-500 transition"
              >
                Add Notebook
              </button>
            </div>

          </form>
        </div>
        )}
    
    </div>
  )
}

export default Notebooks