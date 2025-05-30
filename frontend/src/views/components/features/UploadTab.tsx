import React from 'react'

interface UploadTabProps {
    books: { id: number; title: string; }[];
}

const UploadTab: React.FC<UploadTabProps> = ({ books }) => {
  return (
    <div className='w-full h-full p-3 flex flex-col justify-start gap-2 text-center'>
        <h5 className='text-sm text-[#6D7879] font-semibold'>Uploaded files</h5>
        <div className='w-full h-max text-xs text-[#6D7879] flex flex-col gap-2'>
            {books.map((book) => (
              <div key={book.id}>{book.title}</div>
            ))}
        </div>
    </div>
  )
}

export default UploadTab