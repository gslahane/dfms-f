import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, User2, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onSuccess: () => void;
  backgroundImage?: string; // Optional prop for background image
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, backgroundImage = "/images/bg.png" }) => {
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

    // If API returns { token, mobile, agencyCode, role, designation, fullName, districtId, districtName }
    if (res.data && res.data.token) {
      const userData = {
        token: res.data.token,
        mobile: res.data.mobile,
        agencyCode: res.data.agencyCode,
        role: res.data.role,
        designation: res.data.designation,
        fullName: res.data.fullName,
        districtId: res.data.districtId,
        districtName: res.data.districtName,
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
    <div 
      className={`min-h-screen flex items-center justify-center relative px-4 py-8 ${
        backgroundImage 
          ? 'bg-gradient-to-br from-gray-50 to-gray-100' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
      style={backgroundImage ? {
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : {}}
    >
      {/* Subtle overlay for better readability */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/10"></div>
      )}
      
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-sm mt-5 border border-gray-200 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm relative z-10 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl animate-fade-in"
        autoComplete="off"
      >
        <div className="mb-4 sm:mb-5 text-center">
          {/* Maharashtra Government Logo */}
          <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-white rounded-full shadow-md mb-2 p-1">
            <img 
              src="/logo.png" 
              alt="Maharashtra Government Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* e-SAMARTH Logo */}
          {/* <div className="mx-auto w-24 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md mb-3">
            <span className="font-bold text-white text-sm tracking-wider">e-SAMARTH</span>
          </div> */}
          
          {/* Slogan */}
          {/* <div className="mb-3">
            <p className="text-gray-600 text-xs leading-tight">
              System For Allocation Of Anudan For Representatives of The House
            </p>
          </div> */}
          
          {/* Welcome Text */}
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
              PLANNING DEPARTMENT
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Sign in to your account
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-md text-center transform transition-all duration-300 animate-shake">
            <span className="text-red-700 font-medium text-xs">{error}</span>
          </div>
        )}

        <div className="mb-3 sm:mb-4 relative group">
          <label className="block mb-1 font-medium text-gray-700 text-xs sm:text-sm">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
              <User2 className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" size={14} />
            </div>
            <input
              type="text"
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-xs sm:text-sm"
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

        <div className="mb-4 sm:mb-5 relative group">
          <label className="block mb-1 font-medium text-gray-700 text-xs sm:text-sm">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
              <Lock className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" size={14} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 text-xs sm:text-sm"
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
              className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-md font-semibold text-sm sm:text-base shadow-md transform transition-all duration-200 hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-xs sm:text-sm">Signing in...</span>
            </div>
          ) : (
            <span>Sign In</span>
          )}
        </button>

                <div className="mt-4 sm:mt-5 text-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-2 sm:mb-3"></div>
          <p className="text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} e-SAMARTH
          </p>
          <p className="text-xs sm:text-sm text-gray-400">
            Maharashtra Government
          </p>
              {/* <div className="mx-auto w-24 h-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md mb-3">
             <span className="font-bold text-white text-sm tracking-wider">e-SAMARTH</span>
           </div> */}
           
           {/* Slogan */}
           <div className="mb-3 sm:mb-4">
             <p className="text-gray-600 text-xs sm:text-sm leading-tight">
               System For Allocation Of Anudan For Representatives of The House
             </p>
           </div>
        </div>
      </form>
    </div>
  );
};


export default LoginForm;
