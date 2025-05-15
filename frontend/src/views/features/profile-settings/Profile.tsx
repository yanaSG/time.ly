import React from 'react'
import { FaRegUser } from "react-icons/fa6"

const Profile = () => {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white/80 rounded-3xl shadow-xl p-8 flex flex-col items-center">
      <div className="w-20 h-20 flex items-center justify-center rounded-full border-4 border-yellow-200 bg-gray-100 mb-4">
        <FaRegUser className="text-gray-400" size={56} />
      </div>
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