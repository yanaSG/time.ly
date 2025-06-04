import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="w-16 h-16 border-8 border-t-transparent border-[#037682] rounded-full animate-spin"></div>
    </div>
  )
}

export default LoadingSpinner