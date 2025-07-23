import React, { useState } from "react";
import { Eye, EyeOff, User2, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // <-- make sure this path is correct

const DUMMY_USERS = [
  {
    username: "stateadmin",
    password: "123",
    role: "STATE_ADMIN",
    name: "State Admin ",
    department: "Planning & Finance",
    district: "",
    state_id: 1,
  },
  {
    username: "districtadmin",
    password: "123",
    role: "DISTRICT_ADMIN",
    name: "DISTRICT ADMIN",
    department: "Collector Office,Pune",
    district: "Pune",
    district_id: 10,
    state_id: 1,
  },
  {
    username: "iaadmin",
    password: "123",
    role: "IA_ADMIN",
    name: "IMPLEMENTING AGENCY",
    department: "Rural Works Division",
    district: "Pune",
    ia_id: 1001,
    district_id: 10,
    state_id: 1,
  },
    {
    username: "mla",
    password: "123",
    role: "MLA",
    name: "Shri Ajit Pawar",
    department: "MLA-Baramati Vidhansabha",
    district: "Pune",
    ia_id: 1001,
    district_id: 10,
    state_id: 1,
  },

];

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuth(); // <-- use your context here!
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = DUMMY_USERS.find(
      (u) =>
        u.username === formData.username.trim() &&
        u.password === formData.password
    );
    if (user) {
      login(user);       // <-- This updates your context
      onSuccess();
    } else {
      setError("Invalid username or password.");
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
        >
          Login
        </button>

        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} FMS. All rights reserved.
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
