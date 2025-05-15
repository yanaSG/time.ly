import React, { useState } from 'react'
import { FaRegUser } from "react-icons/fa6"
import { Dialog } from '@headlessui/react'

const Profile = () => {
  const [modal, setModal]=useState<null | 'edit' | 'email' | 'password' | 'passkey'>(null)

  const renderModalContent = () => {
    switch (modal) {
      case 'edit':
        return (
          <>
          <Dialog.Title className="text-xl font-bold mb-4">Edit Profile</Dialog.Title>
          <p className="mb-4">Profile editing form goes here.</p>
          <button className="bg-cyan-700 text-white px-4 py-2 rounded" onClick={()=> setModal(null)}>Back to Profile</button>
          
          </>
        )

        case 'email':
          return (
            <>
            <Dialog.Title className="text-xl font-bold mb-4">Change Email</Dialog.Title>
            <p className="mb-4">Change email form goes here.</p>
            <button className="bg-cyan-700 text-white px-4 py-2 rounded" onClick={() => setModal(null)}>Back to Profile</button>
            </>
          )

           case 'password':
        return (
          <>
            <Dialog.Title className="text-xl font-bold mb-4">Add Password</Dialog.Title>
            <p className="mb-4">Add password form goes here.</p>
            <button className="bg-cyan-700 text-white px-4 py-2 rounded" onClick={() => setModal(null)}>Back to Profile</button>
          </>
        )
      case 'passkey':
        return (
          <>
            <Dialog.Title className="text-xl font-bold mb-4">Add Passkey</Dialog.Title>
            <p className="mb-4">Add passkey setup goes here.</p>
            <button className="bg-cyan-700 text-white px-4 py-2 rounded" onClick={() => setModal(null)}>Back to Profile</button>
          </>
        )
      default:
        return null
    }
  }

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

    
        <div className="w-full bg-yellow-50 rounded-xl p-4 mb-6 text-gray-700">
          <span className="font-semibold">Bio:</span> Passionate learner and note-taker.
        </div>

  
        <button className="w-full md:w-auto bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow transition mb-8"
          onClick={()=> setModal('edit')}
          >           
          Edit Profile
        </button>

        <div className="w-full">
          <h3 className="text-lg font-semibold text-cyan-700 mb-4">Account Security</h3>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
              <span className="font-medium text-gray-700">Email</span>
              <button className="mt-2 md:mt-0 text-xs bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-semibold py-1 px-3 rounded transition"
              onClick={()=> setModal('email')}>
                Change email
              </button>
            </div>


            <p className="text-gray-500 text-sm ml-1">johanne@email.com</p>
          </div>
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
              <span className="font-medium text-gray-700">Password</span>
              <button className="mt-2 md:mt-0 text-xs bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-semibold py-1 px-3 rounded transition"
              onClick={()=> setModal('password')}
              >
                Add password
              </button>
            </div>
            <p className="text-gray-500 text-sm ml-1">Set a permanent password to login to your account.</p>
          </div>
          <div className="mb-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
              <span className="font-medium text-gray-700">Passkeys</span>
              <button className="mt-2 md:mt-0 text-xs bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-semibold py-1 px-3 rounded transition"
              onClick={()=> setModal('passkey')}>
                Add passkey
              </button>
            </div>
            <p className="text-gray-500 text-sm ml-1">Securely sign-in with on-device biometric authentication.</p>
          </div>
        </div>
      </div>

    <Dialog open={modal !== null} onClose={() => setModal(null)} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-auto z-10">
          {renderModalContent()}
        </div>
      </Dialog>
    </div>
  )
}


export default Profile
