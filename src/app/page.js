'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function LoginPage() {
  const [empCode, setEmpCode] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const res = await fetchApi('/auth/login', 'POST', { empCode, pin });
      
      // সফল হলে ইউজারের ডাটা লোকালস্টোরেজে সেভ করে ড্যাশবোর্ডে রিডাইরেক্ট করা
      localStorage.setItem('user', JSON.stringify(res.data));
      
      if (res.data.role === 'ADMIN') {
        router.push('/admin');
      } else if (res.data.role === 'MANAGER') {
        router.push('/manager');
      } else {
        router.push('/employee');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-xl shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">System Login</h2>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Employee Code</label>
          <input 
            type="text" 
            value={empCode} 
            onChange={(e) => setEmpCode(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. EMP-001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Security PIN</label>
          <input 
            type="password" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter 4-digit PIN"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}