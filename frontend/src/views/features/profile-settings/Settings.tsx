import React, { useState } from 'react'

const Settings = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, checked, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved!');
  };

  return (
    <div className="w-full min-h-[calc(100vh-2rem)] flex justify-center items-start py-8 px-2 md:px-8 bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white/80 rounded-3xl shadow-xl p-8 flex flex-col gap-8"
      >
        <h2 className="text-2xl font-bold text-cyan-700 mb-2">Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        <div>
          <h3 className="text-lg font-semibold text-cyan-700 mb-2">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Language</label>
              <select
                name="language"
                value={profile.language}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
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
              >
                <option value="Asia/Manila">Asia/Manila</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <label className="text-gray-700 font-semibold">Auto-save Notes</label>
              <input
                type="checkbox"
                name="autoSave"
                checked={profile.autoSave}
                onChange={handleChange}
                className="w-5 h-5 accent-cyan-700"
                title="Enable or disable auto-save"
              />
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <label className="text-gray-700 font-semibold">Compact Mode</label>
              <input
                type="checkbox"
                name="compactMode"
                checked={profile.compactMode}
                onChange={handleChange}
                className="w-5 h-5 accent-cyan-700"
                title="Enable or disable compact mode"
              />
            </div>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-semibold">Email Notifications</label>
            <input
              type="checkbox"
              name="notifications"
              checked={profile.notifications}
              onChange={handleChange}
              className="w-5 h-5 accent-cyan-700"
              title="Enable or disable email notifications"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-semibold">Dark Mode</label>
            <input
              type="checkbox"
              name="darkMode"
              checked={profile.darkMode}
              onChange={handleChange}
              className="w-5 h-5 accent-cyan-700"
              title="Enable or disable dark mode"
            />
          </div>
        </div>
        {/* Save Button */}
        <button
          type="submit"
          className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-2 px-6 rounded-lg shadow transition self-end"
        >
          Save
        </button>
      </form>
    </div>
  )
}

export default Settings