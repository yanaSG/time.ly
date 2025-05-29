import React, { useEffect, useState } from "react";

interface FlashNotifProps {
    message: string;
    duration?: number // in milliseconds
    onClose?: () => void;
}

const FlashNotif: React.FC<FlashNotifProps> = ({
    message,
    duration = 3000,
    onClose,
}) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            if (onClose) onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
                show
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
            }`}
        >
            <div className="bg-[#037581] text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 animate-slide-down">
                <span>{message}</span>
                <button
                    className="ml-2 text-white hover:text-blue-200 focus:outline-none"
                    onClick={() => {
                        setShow(false);
                        if (onClose) onClose();
                    }}
                    aria-label="Close notification"
                >
                    &times;
                </button>
            </div>
            <style>
                {`
                    @keyframes slide-down {
                        0% { transform: translateY(-20px) scale(0.95); opacity: 0; }
                        100% { transform: translateY(0) scale(1); opacity: 1; }
                    }
                    .animate-slide-down {
                        animation: slide-down 0.3s cubic-bezier(0.4,0,0.2,1);
                    }
                `}
            </style>
        </div>
    );
};

export default FlashNotif;