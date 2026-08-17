"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Invalid credentials");
      }

      // ব্যাকএন্ডের রেসপন্স স্ট্রাকচার অনুযায়ী data.data থেকে টোকেন এবং ইউজার নেওয়া হচ্ছে
      const result = responseData.data || responseData;
      const token = result.token;
      const user = result.user;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        const userRole = user.role; // যেমন: SUPER_ADMIN, ADMIN, MANAGER, EMPLOYEE

        // রোলের ওপর ভিত্তি করে রিডাইরেক্ট
        if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
          router.push("/admin");
        } else if (userRole === "MANAGER") {
          router.push("/manager");
        } else {
          router.push("/employee");
        }
      } else {
        throw new Error("Token or user data missing in response.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Password
              </label>
            </div>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition rounded-xl font-semibold shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an organization account?{" "}
          <Link href="/admin/signup" className="text-blue-400 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}