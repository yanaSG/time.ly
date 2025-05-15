import React from 'react'

const Profile = () => {
  return (
    <div className='max-w-md mx-auto mt-10 bg-white/80 rounded-3xl shadow-xl p-8 flex flex-col items-center'>
      <img
        src='avater-placeholder.png'
        alt="User Avatar"
        className='w-20 h-20 rounded-full border-4 border-yellow-200 mb-4'
        />

         <h2 className="text-2xl font-bold text-cyan-700 mb-1">Johanne</h2>
      <p className="text-gray-500 mb-4">johanne@email.com</p>
      <div className="w-full bg-yellow-50 rounded-xl p-4 mb-6 text-gray-700">
        <span className="font-semibold">Bio:</span> Passionate learner and note-taker.
      </div>
      <button className="bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow transition">
        Edit Profile
      </button>
    </div>
  )
}

export default Profile