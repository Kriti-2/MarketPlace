import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, Mail, User, AlertCircle, ShoppingBag } from 'lucide-react';
import { register, clearAuthError } from '../store/authSlice';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }

    return () => {
      dispatch(clearAuthError());
    };
  }, [userInfo, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (name && email && password) {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade-in flex flex-col gap-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-500 shadow-xl shadow-brand-500/5">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Create an Account</h1>
        <p className="text-xs text-slate-500 font-light max-w-xs">
          Sign up to explore next-generation hardware and workspace peripherals.
        </p>
      </div>

      {/* Error Message */}
      {(error || validationError) && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error || validationError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-panel border border-white/10 flex flex-col gap-5 shadow-2xl">
        <div className="flex flex-col gap-2 relative">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass-input text-xs pl-11 py-3"
              required
            />
            <User className="absolute left-4 text-slate-500 w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
          <div className="relative flex items-center">
            <input
              type="email"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input text-xs pl-11 py-3"
              required
            />
            <Mail className="absolute left-4 text-slate-500 w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Password</label>
          <div className="relative flex items-center">
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input text-xs pl-11 py-3"
              required
            />
            <KeyRound className="absolute left-4 text-slate-500 w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Confirm Password</label>
          <div className="relative flex items-center">
            <input
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full glass-input text-xs pl-11 py-3"
              required
            />
            <KeyRound className="absolute left-4 text-slate-500 w-4 h-4" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="glow-button w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider mt-2"
        >
          {loading ? 'Registering credentials...' : 'Register Account'}
        </button>
      </form>

      {/* Bottom text */}
      <div className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link
          to={redirect ? `/login?redirect=${redirect}` : '/login'}
          className="text-brand-500 hover:underline font-semibold"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
