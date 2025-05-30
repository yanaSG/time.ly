import React from 'react';

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    open,
    title = 'Confirm Action',
    description = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    loading = false,
}) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
            aria-modal="true"
            role="dialog"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-description"
        >
            <form
                className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4"
                onClick={e => e.stopPropagation()}
                onSubmit={e => { e.preventDefault(); onConfirm(); }}
            >
                <h2 className="text-2xl font-bold mb-4" id="confirm-modal-title">{title}</h2>
                <div className="mb-4">
                    <p className="text-gray-700" id="confirm-modal-description">{description}</p>
                </div>
                <div className="flex gap-4 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition cursor-pointer disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConfirmModal;