'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function AdminSignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    password: '' // ফায়ারবেস বা নিজস্ব ব্যাকএন্ড অথেনটিকেশনের জন্য পাসওয়ার্ড রাখতে পারেন
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // ফায়ারবেস অথ (Firebase Auth) ব্যবহার করলে এখানে আগে ফায়ারবেসে ইউজার ক্রিয়েট করে 
      // প্রাপ্ত UID টি নিয়ে ব্যাকএন্ডে পাঠাতে হবে। ডেমো বা সিম্পল প্রজেক্টের জন্য 
      // আমরা স্বয়ংক্রিয়ভাবে একটি আইডি জেনারেট করে পাঠাতে পারি:
      const payload = {
        id: 'admin-' + Date.now(), // ফায়ারবেস UID থাকলে সেটি এখানে বসাবেন
        fullName: formData.fullName,
        email: formData.email,
        companyName: formData.companyName
      };

      const res = await fetchApi('/auth/admin-signup', 'POST', payload);
      
      alert(res.message);
      router.push('/admin/login'); // সফল হলে এডমিন লগইন পেজে রিডাইরেক্ট

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form onSubmit={handleAdminSignup} className="p-8 bg-white rounded-xl shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Registration</h2>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" 
            name="fullName"
            value={formData.fullName} 
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Md Antor Mia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Admin Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input 
            type="text" 
            name="companyName"
            value={formData.companyName} 
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Antor Software Ltd"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password} 
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? 'Registering...' : 'Register as Admin'}
        </button>
      </form>
    </div>
  );
}