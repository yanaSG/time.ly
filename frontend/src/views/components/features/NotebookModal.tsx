import React, { useState, useEffect } from 'react';
import { Notebook } from '../../../types/Notebook';

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNotebook?: (newNotebook: Omit<Notebook, "id" | "created_at" | "updated_at"> & { color: string; mastery_goal: string | null }) => Promise<void>;
  onUpdateNotebook?: (notebookId: number, updatedFields: Omit<Notebook, "id" | "created_at" | "updated_at"> & { color?: string; mastery_goal?: string | null }) => Promise<void>;
  initialNotebook?: Notebook | null;
  user: any;
}

const availableColors = [
  "#F87171",
  "#FBBF24",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
  "#FCD34D",
  "#6EE7B7",
];

const NotebookModal: React.FC<NotebookModalProps> = ({ isOpen, onClose, onAddNotebook, onUpdateNotebook, initialNotebook, user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<string>('#F87171');
  const [masteryGoal, setMasteryGoal] = useState<string>('');

  useEffect(() => {
    if (isOpen && initialNotebook) {
      setTitle(initialNotebook.title || '');
      setDescription(initialNotebook.description || '');
      setColor(initialNotebook.color || '#F87171');
      setMasteryGoal(initialNotebook.mastery_goal ? new Date(initialNotebook.mastery_goal).toISOString().split('T')[0] : '');
    } else if (isOpen) {
      setTitle('');
      setDescription('');
      setColor('#F87171');
      setMasteryGoal('');
    }
  }, [isOpen, initialNotebook]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      alert('Please enter a title');
      return;
    }

    if (user === null) {
      alert('You must be logged in.');
      return;
    }

    if (initialNotebook) {
      if (onUpdateNotebook) {
        const updatedFields: Omit<Notebook, "id" | "created_at" | "updated_at"> & { color?: string; mastery_goal?: string } = {
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          color: color,
          mastery_goal: masteryGoal,
        };
        await onUpdateNotebook(initialNotebook.id, updatedFields);
      }
    } else {
      if (onAddNotebook) {
        const newNotebookData: Omit<Notebook, "id" | "created_at" | "updated_at"> & { color: string; mastery_goal: string | null } = {
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          color: color,
          mastery_goal: masteryGoal,
        };
        await onAddNotebook(newNotebookData);
      }
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalTitle = initialNotebook ? 'Edit Notebook' : 'Add New Notebook';
  const submitButtonText = initialNotebook ? 'Update Notebook' : 'Add Notebook';

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <form
        onSubmit={handleFormSubmit}
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4" id="modal-title">{modalTitle}</h2>
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

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {availableColors.map((c) => (
              <div
                key={c}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${color === c ? 'border-gray-500' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                title={c}
              ></div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="masteryGoal" className="block text-gray-700 font-semibold mb-1">
            Mastery Goal (Date)
          </label>
          <input
            id="masteryGoal"
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={masteryGoal}
            onChange={e => setMasteryGoal(e.target.value)}
          />
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-400 text-white font-semibold rounded hover:bg-yellow-500 transition cursor-pointer"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotebookModal;
