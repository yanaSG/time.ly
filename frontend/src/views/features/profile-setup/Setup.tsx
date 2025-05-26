import React, { useState } from 'react'
import AuthInput from '../../components/ui/inputs/AuthInput'
import AuthButton from '../../components/ui/buttons/AuthButton'

const Setup = () => {
  return (
    <div className="max-w-md mx-auto p-6 m-20">
      <h2 className="text-2xl font-semibold mb-6">Profile Setup</h2>
      <form>
      <div className="mb-4">
        <label htmlFor="school" className="block mb-1 font-medium">School:</label>
        <input
        type="text"
        id="school"
        name="school"
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="course" className="block mb-1 font-medium">Course:</label>
        <input
        type="text"
        id="course"
        name="course"
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="likes" className="block mb-1 font-medium">Likes:</label>
        <input
        type="text"
        id="likes"
        name="likes"
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        placeholder="e.g. coding, music"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block mb-1 font-medium">Upload Image:</label>
        <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        className="w-full"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Save
      </button>
      </form>
    </div>
  )
}

export default Setup