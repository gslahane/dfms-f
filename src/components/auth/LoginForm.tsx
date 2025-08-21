import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, User2, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const res = await axios.post(`${baseURL}/api/auth/login`, {
      username: formData.username.trim(),
      password: formData.password,
    });

    // If API returns { token, mobile, agencyCode, role, designation }
    if (res.data && res.data.token) {
      const userData = {
        token: res.data.token,
        mobile: res.data.mobile,
        agencyCode: res.data.agencyCode,
        role: res.data.role,
        designation: res.data.designation,
        username: formData.username.trim(),
      };
      // Save token and user info using your AuthContext
      login(userData);
      onSuccess();
    } else {
      setError("Invalid response from server.");
    }
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
      "Invalid username or password. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in"
        autoComplete="off"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto w-14 h-14 flex items-center justify-center bg-primary rounded-full shadow">
            <span className="font-bold text-2xl text-white">FMS</span>
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Please sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="mb-5 relative">
          <label className="block mb-1 font-semibold text-gray-700">
            Username
          </label>
          <div className="flex items-center bg-gray-50 rounded px-3 border focus-within:ring-2 focus-within:ring-primary">
            <User2 className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              className="bg-transparent flex-1 py-2 outline-none"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              autoFocus
              required
            />
          </div>
        </div>

        <div className="mb-7 relative">
          <label className="block mb-1 font-semibold text-gray-700">
            Password
          </label>
          <div className="flex items-center bg-gray-50 rounded px-3 border focus-within:ring-2 focus-within:ring-primary">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              className="bg-transparent flex-1 py-2 outline-none"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="text-gray-400 hover:text-primary transition ml-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-lg shadow-md transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} FMS. All rights reserved.
        </div>
      </form>
    </div>
  );
};


export default LoginForm;
