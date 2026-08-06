import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import useAuth from '../hooks/useAuth';

export const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(fullName, email, password, confirmPassword);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Signup failed:', err);
      let message = 'Failed to create account. Please try again.';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          message = err.response.data.detail.map(d => d.msg).join(', ');
        } else {
          message = err.response.data.detail;
        }
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the next-generation enterprise RAG platform"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        
        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Full Name Field */}
        <div>
          <label className="block text-[10px] font-bold text-gray-300 mb-1 uppercase tracking-wider">
            FULL NAME
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 outline-none ${
                fullName
                  ? 'bg-[#eef2fb] text-black border-transparent'
                  : 'bg-[#0a090e] border border-white/10 text-white placeholder:text-gray-500 focus:bg-[#eef2fb] focus:text-black focus:placeholder:text-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-[10px] font-bold text-gray-300 mb-1 uppercase tracking-wider">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abhi@gmail.com"
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 outline-none ${
                email
                  ? 'bg-[#eef2fb] text-black border-transparent'
                  : 'bg-[#0a090e] border border-white/10 text-white placeholder:text-gray-500 focus:bg-[#eef2fb] focus:text-black focus:placeholder:text-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[10px] font-bold text-gray-300 mb-1 uppercase tracking-wider">
            PASSWORD
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-3 pr-9 py-2 rounded-xl text-xs font-medium transition-all duration-200 outline-none ${
                password
                  ? 'bg-[#eef2fb] text-black border-transparent'
                  : 'bg-[#0a090e] border border-white/10 text-white placeholder:text-gray-500 focus:bg-[#eef2fb] focus:text-black focus:placeholder:text-gray-400'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors cursor-pointer ${
                password ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-[10px] font-bold text-gray-300 mb-1 uppercase tracking-wider">
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className={`w-full pl-9 pr-9 py-2 rounded-xl text-xs font-medium transition-all duration-200 outline-none ${
                confirmPassword
                  ? 'bg-[#eef2fb] text-black border-transparent'
                  : 'bg-[#0a090e] border border-white/10 text-white placeholder:text-gray-500 focus:bg-[#eef2fb] focus:text-black focus:placeholder:text-gray-400'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors cursor-pointer ${
                confirmPassword ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#3b82f6] hover:opacity-95 shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all duration-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <UserPlus className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex py-1.5 items-center my-0.5">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest">OR</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Login Link */}
        <div className="text-center text-[11px] text-gray-400">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-bold text-[#a855f7] hover:text-[#ec4899] transition-colors"
          >
            Sign In
          </Link>
        </div>

      </form>
    </AuthLayout>
  );
};

export default Signup;
