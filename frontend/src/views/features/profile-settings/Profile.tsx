import React from 'react'
import { FaRegUser } from "react-icons/fa6"

const Profile = () => {
  return (
    <div className="w-full min-h-full flex flex-col md:flex-row justify-center items-start py-6 px-4 md:px-8 gap-8">
      <div className="flex-1 bg-white/80 rounded-3xl shadow-xl p-6 md:p-10 flex flex-col items-center md:items-start max-w-full">
        <div className="flex flex-col md:flex-row md:items-center w-full mb-6">
          <div className="flex justify-center md:justify-start">
            <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-yellow-200 bg-gray-100 mb-4 md:mb-0 md:mr-6">
              <FaRegUser className="text-gray-400" size={64} />
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-700 mb-1">Johanne</h2>
            <p className="text-gray-500 mb-2 md:mb-0">johanne@email.com</p>
          </div>
        </div>

        {/* Bio */}
        <div className="w-full bg-yellow-50 rounded-xl p-4 mb-6 text-gray-700">
          <span className="font-semibold">Bio:</span> Passionate learner and note-taker.
        </div>

        {/* Edit Profile Button */}
        <button className="w-full md:w-auto bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow transition mb-8">
          Edit Profile
        </button>

        {/* Account Security Section */}
        <div className="w-full">
          <h3 className="text-lg font-semibold text-cyan-700 mb-4">Account Security</h3>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
              <span className="font-medium text-gray-700">Email</span>
              <button className="mt-2 md:mt-0 text-xs bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-semibold py-1 px-3 rounded transition">
                Change email
              </button>
            </div>
            <p className="text-gray-500 text-sm ml-1">johanne@email.com</p>
          </div>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
              <span className="font-medium text-gray-700">Password</span>
              <button className="mt-2 md:mt-0 text-xs bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-semibold py-1 px-3 rounded transition">
                Add password
              </button>
            </div>
            <p className="text-gray-500 text-sm ml-1">Set a permanent password to login to your account.</p>
          </div>
          <div className="mb-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
              <span className="font-medium text-gray-700">Passkeys</span>
              <button className="mt-2 md:mt-0 text-xs bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-semibold py-1 px-3 rounded transition">
                Add passkey
              </button>
            </div>
            <p className="text-gray-500 text-sm ml-1">Securely sign-in with on-device biometric authentication.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
