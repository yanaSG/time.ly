import React, { useState } from 'react'


import MainButton from '../../components/ui/buttons/MainButton'
import { useAuth } from '../../../hooks/useAuth';

interface SetupForm {
  image: File | null;
  school: string;
  course: string;
  likes: BigInt;
}



const Setup: React.FC = () => {

  const { updateProfile } = useAuth();
  const [ formData, setFormData] = useState<SetupForm>({
    image: null,
    school: '',
    course: '',
    likes: BigInt(0),
  });

  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else if (name === 'likes') {
      setFormData(prev => ({ ...prev, likes: BigInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
  
     
  
      try {
        console.log('Sent update data:', FormData);

        const data = new FormData();
          if (formData.image) data.append('image', formData.image);
          data.append('school', formData.school);
          data.append('course', formData.course);
          data.append('likes', formData.likes.toString());
          await updateProfile(data);
        await updateProfile(data);
        console.log('Profile updated successfully');
      } catch (error: any) {
        setError(error.message);
        console.error('Error updating profile:', error);
      }
    };


  return (
    <div className="max-w-md mx-auto p-6 m-20">
      <h2 className="text-2xl font-semibold mb-6">Profile Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label htmlFor="school" className="block mb-1 font-medium">School:</label>
        <input
        type="text"
        id="school"
        name="school"
         value={formData.school}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="course" className="block mb-1 font-medium">Course:</label>
        <input
        type="text"
        id="course"
        name="course"
        value={formData.course}
         onChange={handleChange}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="likes" className="block mb-1 font-medium">Likes:</label>
        <input
        type="text"
        id="likes"
        name="likes"
        value={formData.likes.toString()}
        onChange={handleChange}
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
        onChange={handleChange}
        className="w-full"
        />
      </div>
        <MainButton
            label="Submit"
            type="submit"
            className="w-48"
        />       
         {error && <p className="text-red-500 mt-2">{error}</p>} 
      </form>
    </div>
  )
}

export default Setup