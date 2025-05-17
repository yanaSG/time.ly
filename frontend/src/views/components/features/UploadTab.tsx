import React from 'react'

const UploadTab: React.FC = () => {
  return (
    <div className='w-full h-full p-3 flex flex-col justify-start gap-2 text-center'>
        <h5 className='text-sm text-[#6D7879] font-semibold'>Uploaded files</h5>
        <div className='w-full h-max text-xs text-[#6D7879] flex flex-col gap-2'>
            <p>Chapter-1-Calculus-1.pdf</p>
            <p>Chapter-1-Calculus-1.pdf</p>
            <p>Chapter-1-Calculus-1.pdf</p>
            <p>Chapter-1-Calculus-1.pdf</p>
        </div>
    </div>
  )
}

export default UploadTab