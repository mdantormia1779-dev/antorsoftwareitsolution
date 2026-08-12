'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    pin: '', // 'password'-এর পরিবর্তে 'pin' ব্যবহার করা হলো, কারণ API-তে pin চেক করা হচ্ছে
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // ✅ সফল লগইনের পর লোকাল স্টোরেজে ইউজার ডেটা সেভ করা হচ্ছে
      if (data.success && data.data) {
        localStorage.setItem('user', JSON.stringify(data.data));

        const userRole = data.data.role; // ইউজারের রোল চেক করা হচ্ছে

        // রোলের উপর ভিত্তি করে ডাইনামিক রিডায়রেক্ট
        if (userRole === 'MANAGER') {
          router.push('/manager'); // ম্যানেজার হলে এই রুটে যাবে
        } else if (userRole === 'EMPLOYEE') {
          router.push('/employee'); // এমপ্লয়ি হলে এই রুটে যাবে
        } else {
          router.push('/admin'); // ডিফল্ট বা অন্য কোনো রোল হলে (যেমন: ADMIN)
        }
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-400">Login</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="employee@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">PIN</label>
            <input
              type="password"
              name="pin" // এখানে 'password'-এর বদলে 'pin' দেওয়া হয়েছে
              required
              value={formData.pin}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link href="/admin/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}