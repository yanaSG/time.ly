import React, { useState } from 'react'

const Settings = () => {
//   const [profile, setProfile] = useState({
//     name: 'John Doe',
//     email: 'john.doe@email.com',
//     notifications: true,
//     darkMode: false,
//     language: 'en',
//     timezone: 'Asia/Manila',
//     autoSave: true,
//     compactMode: false,
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, type, checked, value } = e.target;
//     setProfile(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     alert('Settings saved!');
//   };

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    notifications: true,
    darkMode: false,
    language: 'en',
    timezone: 'Asia/Manila',
    autoSave: true,
    compactMode: false,
  });

  const usageStats = {
    notesCreated: 124,
    notebooks: 5,
    lastLogin: '2025-05-17 10:30 AM',
    totalTimeSpent: '18h 42m',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved!');
  };

  return (
    <div className="w-full h-screen overflow-auto bg-transparent">
      <div className="w-full min-h-full flex flex-col md:flex-row justify-center items-start py-6 px-4 md:px-8 gap-8">
        <div className="flex-1 bg-white/80 rounded-3xl shadow-xl p-6 md:p-10 flex flex-col items-center md:items-start max-w-full">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
            <h2 className="text-2xl font-bold text-cyan-700 mb-2">Settings</h2>
            
            {/* Usage Stats */}
            <div className="bg-cyan-50 rounded-xl p-4 flex flex-wrap gap-8 justify-between w-full mb-4">
              <div>
                <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Notes Created</span>
                <span className="block text-lg font-bold text-cyan-700">{usageStats.notesCreated}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Notebooks</span>
                <span className="block text-lg font-bold text-cyan-700">{usageStats.notebooks}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Time Spent</span>
                <span className="block text-lg font-bold text-cyan-700">{usageStats.totalTimeSpent}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 font-semibold uppercase mb-1">Last Login</span>
                <span className="block text-lg font-bold text-cyan-700">{usageStats.lastLogin}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                  title="Full name"
                  placeholder="Enter your name"
                />
                <span className="text-xs text-gray-400">Change your name in Profile page</span>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                  title="Email address"
                  placeholder="Enter your email"
                />
                <span className="text-xs text-gray-400">Change your email in Profile page</span>
              </div>
            </div>
            
            <div className="w-full">
              <h3 className="text-lg font-semibold text-cyan-700 mb-2">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Language</label>
                  <select
                    name="language"
                    value={profile.language}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    aria-label="Language"
                    title="Language"
                  >
                    <option value="en">English</option>
                    <option value="fil">Filipino</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Timezone</label>
                  <select
                    name="timezone"
                    value={profile.timezone}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    title="Timezone"
                  >
                    <option value="Asia/Manila">Asia/Manila</option>
                    <option value="Asia/Singapore">Asia/Singapore</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <input
                    id="autoSave"
                    type="checkbox"
                    name="autoSave"
                    checked={profile.autoSave}
                    onChange={handleChange}
                    className="w-5 h-5 accent-cyan-700"
                    title="Enable or disable auto-save"
                  />
                  <label className="text-gray-700 font-semibold" htmlFor="autoSave">Auto-save Notes</label>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <input
                    id="compactMode"
                    type="checkbox"
                    name="compactMode"
                    checked={profile.compactMode}
                    onChange={handleChange}
                    className="w-5 h-5 accent-cyan-700"
                    title="Enable or disable compact mode"
                  />
                  <label className="text-gray-700 font-semibold" htmlFor="compactMode">Compact Mode</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="flex items-center gap-2">
                <input
                  id="notifications"
                  type="checkbox"
                  name="notifications"
                  checked={profile.notifications}
                  onChange={handleChange}
                  className="w-5 h-5 accent-cyan-700"
                  title="Enable or disable email notifications"
                />
                <label className="text-gray-700 font-semibold" htmlFor="notifications">Email Notifications</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="darkMode"
                  type="checkbox"
                  name="darkMode"
                  checked={profile.darkMode}
                  onChange={handleChange}
                  className="w-5 h-5 accent-cyan-700"
                  title="Enable or disable dark mode"
                />
                <label className="text-gray-700 font-semibold" htmlFor="darkMode">Dark Mode</label>
              </div>
            </div>
            
            <div className="flex justify-end w-full">
              <button
                type="submit"
                className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-2 px-8 rounded-lg shadow transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings