'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    organizationId: '',
    branchId: '',
    empCode: '',
    fullName: '',
    email: '',
    phone: '',
    pin: '',
    department: 'Engineering',
    designation: 'Frontend Developer'
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const res = await fetchApi('/auth/signup', 'POST', formData);
      
      alert(res.message);
      router.push('/login'); // সফল হলে লগইন পেজে রিডাইরেক্ট

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
      <form onSubmit={handleSignup} className="p-8 bg-white rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">Employee Registration</h2>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Organization ID</label>
          <input 
            type="text" 
            name="organizationId" 
            value={formData.organizationId} 
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Organization UUID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Branch ID (Optional)</label>
          <input 
            type="text" 
            name="branchId" 
            value={formData.branchId} 
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Branch ID"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee Code</label>
            <input 
              type="text" 
              name="empCode" 
              value={formData.empCode} 
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. EMP-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Security PIN</label>
            <input 
              type="password" 
              name="pin" 
              value={formData.pin} 
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="4-digit PIN"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Md Antor Mia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="antor@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input 
            type="text" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+8801..."
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}