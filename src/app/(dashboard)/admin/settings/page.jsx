'use client';

import { useState, useEffect } from 'react';

const Settings = () => {
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    companyName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // লগইন করার পর যদি localStorage-এ এডমিন ডাটা সেভ করা থাকে, তা লোড করা
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setFormData({
        id: admin.id || '',
        fullName: admin.fullName || '',
        companyName: admin.companyName || '',
        email: admin.email || '',
        password: '',
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id,
          fullName: formData.fullName,
          companyName: formData.companyName,
          password: formData.password ? formData.password : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }

      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      
      // লোকাল স্টোরেজ আপডেট করা
      const existingData = JSON.parse(localStorage.getItem('admin') || '{}');
      const updatedAdmin = { 
        ...existingData, 
        fullName: formData.fullName, 
        companyName: formData.companyName 
      };
      localStorage.setItem('admin', JSON.stringify(updatedAdmin));

      // 🔴 কাস্টম ইভেন্ট ডিসপাচ করা যাতে অন্য কম্পোনেন্ট (যেমন: Header) বুঝতে পারে ডাটা চেঞ্জ হয়েছে
      window.dispatchEvent(new Event('adminUpdated'));

      // পাসওয়ার্ড ফিল্ড ফাকা করে দেওয়া
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 bg-gray-900 text-white rounded-2xl border border-gray-800 shadow-xl">
      {/* Header & Tabs */}
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-2xl font-bold text-blue-400">Admin Settings</h2>
        <p className="text-sm text-gray-400">Manage your profile details and security credentials.</p>
      </div>

      {message.text && (
        <div
          className={`p-3 rounded-lg text-sm border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500 text-green-400'
              : 'bg-red-500/10 border-red-500 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address (Read-only)</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password (Leave blank to keep current)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;