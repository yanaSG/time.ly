import React, { useState, useEffect } from 'react'
import { FaRegUser } from "react-icons/fa6"
import { Dialog } from '@headlessui/react'
import { useAuth } from '../../../hooks/useAuth'

const Profile = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const [modal, setModal] = useState<null | 'edit' | 'email' | 'password' | 'passkey'>(null);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    school: '',
    course: '',
    likes: '',
    bio: '',
    image: null as File | null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        firstName: user.fname || '',
        lastName: user.lname || '',
        school: user.school || '',
        course: user.course || '',
        likes: user.likes || '',
        bio: user.bio || '',
        image: null,
      });
    }
  }, [user, modal]);

  const renderModalContent = () => {
    switch (modal) {
      case 'edit':
        return (
          <>
          <Dialog.Title className="text-xl font-bold mb-4">Edit Profile</Dialog.Title>

          <div
  className="bg-white rounded-4xl shadow-xl p-10 flex flex-row gap-10 items-start"
  style={{ minWidth: 900, maxWidth: 1100 }}
>
  {/* Left: Profile Image & File Input */}
  <div className="flex flex-col w-1/3 min-w-[250px] h-[500px] justify-center items-center">
    <div className="flex flex-col items-center w-full">
      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-yellow-200 mb-4 shadow">
        {user?.image ? (
          <img
            src={user.image}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <FaRegUser className="text-gray-400" size={72} />
        )}
      </div>
      <label className="flex flex-col items-center cursor-pointer w-full group">
        <span className="text-base mb-2 text-center font-semibold text-cyan-700 group-hover:underline transition">
          {profileForm.image ? profileForm.image.name : "Choose File"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e =>
            setProfileForm(prev => ({
              ...prev,
              image: e.target.files ? e.target.files[0] : null,
            }))
          }
        />
      </label>
      <span className="text-xs text-gray-400 mb-2 text-center">
        Add or change your profile photo
      </span>
    </div>
  </div>

  {/* Divider */}
  <div className="w-px bg-gray-200 self-stretch mx-2" />

  {/* Right: Edit Form */}
  <form
    className="flex flex-col gap-4 w-2/3"
    onSubmit={async (e) => {
      e.preventDefault();
      try {
        const data = new FormData();
        data.append('username', profileForm.username);
        data.append('email', profileForm.email);
        data.append('fname', profileForm.firstName);
        data.append('lname', profileForm.lastName);
        data.append('school', profileForm.school);
        data.append('course', profileForm.course);
        data.append('likes', profileForm.likes);
        data.append('bio', profileForm.bio || '');
        if (profileForm.image) data.append('image', profileForm.image);

        await updateProfile(data);
        await refreshUser();
        setModal(null);
        setError('');
      } catch (err: any) {
        //  error detaiils for debugging
        console.log(err.response?.data);
        setError('Failed to update profile.');
      }
    }}
  >
    <Dialog.Title className="text-2xl font-bold mb-6 text-cyan-700">Edit Profile</Dialog.Title>
    <div className="flex flex-col gap-3">
      {[
        { label: "Username", value: profileForm.username, key: "username" },
        { label: "First Name", value: profileForm.firstName, key: "firstName" },
        { label: "Last Name", value: profileForm.lastName, key: "lastName" },
        { label: "School", value: profileForm.school, key: "school" },
        { label: "Course", value: profileForm.course, key: "course" },
        { label: "Likes", value: profileForm.likes, key: "likes" },
        { label: "Bio", value: profileForm.bio, key: "bio" },
      ].map(({ label, value, key }) => (
        <div className="flex items-center gap-4" key={key}>
          <label className="w-32 font-semibold text-cyan-700">{label}</label>
          <input
            type="text"
            className="border border-gray-200 rounded-lg px-3 py-2 flex-1 bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition"
            value={value}
            onChange={e => setProfileForm(prev => ({ ...prev, [key]: e.target.value }))}
          />
        </div>
      ))}
    </div>
    <div className="flex gap-2 mt-8 justify-end">
      <button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2 rounded-lg font-semibold shadow transition">Save</button>
      <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold transition" onClick={() => setModal(null)}>Cancel</button>
    </div>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </form>
</div>
          
  <a
   href="#"
     className="text-cyan-700 underline mt-4 inline-block"
     onClick={e => {
      e.preventDefault();
        setModal(null);
        }}
  >
    Back to Profile
  </a>
          
</>
   )

        case 'email':
          return (
            <>
            <Dialog.Title className="text-xl font-bold mb-4">Change Email</Dialog.Title>
            <form
  className="flex flex-col gap-4"
  onSubmit={async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('username', user?.username || '');
      data.append('email', profileForm.email); 

      await updateProfile(data); 
      await refreshUser();
      setModal(null);
      setError('');
    } catch (err: any) {
      console.log(err.response?.data);
      setError('Failed to update email.');
    }
  }}
>
  <label className="font-bold mb-2">New Email</label>
  <input
    type="email"
    placeholder="New Email"
    className="border rounded px-3 py-2"
    value={profileForm.email}
    onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
    required
  />
  <div className="flex gap-2 mt-4">
    <button type="submit" className="bg-cyan-700 text-white px-4 py-2 rounded">Save</button>
    <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={() => setModal(null)}>Cancel</button>
  </div>
  {error && <p className="text-red-500 mt-2">{error}</p>}
</form>

              <a
                href="#"
                className="text-cyan-700 underline mt-4 inline-block"
                onClick={e => {
                  e.preventDefault();
                  setModal(null);
                }}
              >
                Back to Profile
              </a>
            </>
          )

           case 'password':
        return (
          <>
            <Dialog.Title className="text-xl font-bold mb-4">Add Password</Dialog.Title>

              <form className="flex flex-col gap-4">
                <input
                  type="password"
                  placeholder="New Password"
                  className="border rounded px-3 py-2"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="border rounded px-3 py-2"
                />
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-cyan-700 text-white px-4 py-2 rounded">Save</button>
                  <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={() => setModal(null)}>Cancel</button>
                </div>
              </form>
              <a
                href="#"
                className="text-cyan-700 underline mt-4 inline-block"
                onClick={e => {
                  e.preventDefault();
                  setModal(null);
                }}
              >
                Back to Profile
              </a>
          </>
        )
      case 'passkey':
        return (
          <>
            <Dialog.Title className="text-xl font-bold mb-4">Add Passkey</Dialog.Title>
            
            <a
              href="#"
              className="text-cyan-700 underline mt-4 inline-block"
              onClick={e => {
                e.preventDefault();
                setModal(null);
              }}
            >
              Back to Profile
            </a>
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
            <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-yellow-200 bg-gray-100 mb-4 md:mb-0 md:mr-6 overflow-hidden">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaRegUser className="text-gray-400" size={64} />
              )}
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-700 mb-1">
              {user?.fname || ''} {user?.lname || ''}
            </h2>
            <p className="text-gray-500 mb-2 md:mb-0">{user?.email || ''}</p>
          </div>
        </div>

        <div className="w-full bg-yellow-50 rounded-xl p-4 mb-6 text-gray-700">
          <span className="font-semibold">Bio:</span> {user?.bio || ''}
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


            <p className="text-gray-500 text-sm ml-1">{user?.email || ''}</p>
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
  <div className="relative z-10 flex items-center justify-center w-full min-h-screen">
    {modal === 'edit' && (
      <div
        className="bg-white rounded-3xl shadow-xl p-10 flex flex-row gap-10 items-start"
        style={{ minWidth: 900, maxWidth: 1100 }}
      >
        {/* Left: Profile Image & File Input */}
        <div className="flex flex-col w-1/3 min-w-[250px] h-[500px] justify-center items-center">
          <div className="flex flex-col items-center w-full">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-yellow-200 mb-4 shadow">
              <FaRegUser className="text-gray-400" size={72} />
            </div>
            <label className="flex flex-col items-center cursor-pointer w-full group">
              <span className="text-base mb-2 text-center font-semibold text-cyan-700 group-hover:underline transition">
                {profileForm.image ? profileForm.image.name : "Choose File"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e =>
                  setProfileForm(prev => ({
                    ...prev,
                    image: e.target.files ? e.target.files[0] : null,
                  }))
                }
              />
            </label>
            <span className="text-xs text-gray-400 mb-2 text-center">
              Add or change your profile photo
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 self-stretch mx-2" />

        {/* Right: Edit Form */}
        <form
          className="flex flex-col gap-4 w-2/3"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const data = new FormData();
              data.append('username', profileForm.username);
              data.append('email', profileForm.email); // <-- Add this line
              data.append('fname', profileForm.firstName);
              data.append('lname', profileForm.lastName);
              data.append('school', profileForm.school);
              data.append('course', profileForm.course);
              data.append('likes', profileForm.likes);
              data.append('bio', profileForm.bio || '');
              if (profileForm.image) data.append('image', profileForm.image);

              await updateProfile(data);
              await refreshUser();
              setModal(null);
              setError('');
            } catch (err: any) {
              // Log backend error details for debugging
              console.log(err.response?.data);
              setError('Failed to update profile.');
            }
          }}
        >
          <Dialog.Title className="text-2xl font-bold mb-6 text-cyan-700">Edit Profile</Dialog.Title>
          <div className="flex flex-col gap-3">
            {[
              { label: "Username", value: profileForm.username, key: "username" },
              { label: "First Name", value: profileForm.firstName, key: "firstName" },
              { label: "Last Name", value: profileForm.lastName, key: "lastName" },
              { label: "School", value: profileForm.school, key: "school" },
              { label: "Course", value: profileForm.course, key: "course" },
              { label: "Likes", value: profileForm.likes, key: "likes" },
              { label: "Bio", value: profileForm.bio, key: "bio" },
            ].map(({ label, value, key }) => (
              <div className="flex items-center gap-4" key={key}>
                <label className="w-32 font-semibold text-cyan-700">{label}</label>
                <input
                  type="text"
                  className="border border-gray-200 rounded-lg px-3 py-2 flex-1 bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-200 transition"
                  value={value}
                  onChange={e => setProfileForm(prev => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-8 justify-end">
            <button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2 rounded-lg font-semibold shadow transition">Save</button>
            <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold transition" onClick={() => setModal(null)}>Cancel</button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    )}
    {/* Keep other modals (email, password, passkey) as they are */}
    {modal !== 'edit' && renderModalContent()}
  </div>
</Dialog>
    </div>
  )
}


export default Profile
