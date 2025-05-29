import React, { useRef, useState } from "react";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            setError("Please select a file to upload.");
            return;
        }
        onUpload(selectedFile);
        setSelectedFile(null);
        setError(null);
        onClose();
    };

    const handleClose = () => {
        setSelectedFile(null);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in">
                <h2 className="text-xl font-semibold mb-4 text-gray-600">Upload File</h2>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#037581] file:text-white hover:file:bg-[#025e67] file:cursor-pointer mb-3"
                />
                {selectedFile && (
                    <p className="text-sm text-gray-600 mb-2">Selected file: <span className="font-medium">{selectedFile.name}</span></p>
                )}
                {error && (
                    <p className="text-sm text-red-600 mb-2">{error}</p>
                )}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handleUpload}
                        className="bg-[#037581] hover:bg-[#025e67] text-white px-4 py-2 rounded transition-colors cursor-pointer"
                    >
                        Upload
                    </button>
                    <button
                        onClick={handleClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-4 py-2 rounded transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;