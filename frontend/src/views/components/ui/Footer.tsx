import React from 'react'

type FooterProps = {
    className?: string;
};

const Footer: React.FC<FooterProps> = ({ className }) => {
    return (
        <footer className={`bg-gray-800 text-white p-4 ${className}`}>
            <div>Footer Content</div>
        </footer>
    )
}

export default Footer