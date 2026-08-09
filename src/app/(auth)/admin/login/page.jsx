'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const res = await fetchApi('/auth/admin-login', 'POST', { email });
      
      // লোকাল স্টোরেজে এডমিন ডাটা সেভ করা
      localStorage.setItem('admin', JSON.stringify(res.data));
      router.push('/admin');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form onSubmit={handleAdminLogin} className="p-8 bg-white rounded-xl shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Portal</h2>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Admin Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="admin@example.com"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
    </div>
  );
}