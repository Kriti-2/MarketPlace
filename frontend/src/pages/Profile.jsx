import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, KeyRound, Mail, AlertCircle, ShoppingBag, Eye, Calendar, Clock, CheckCircle } from 'lucide-react';
import { updateProfile, clearAuthError } from '../store/authSlice';
import { fetchMyOrders } from '../store/orderSlice';

export const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const dispatch = useDispatch();

  const { userInfo, loading, error } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.orders);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
    dispatch(fetchMyOrders());

    return () => {
      dispatch(clearAuthError());
    };
  }, [userInfo, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');

    if (password && password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    dispatch(
      updateProfile({
        name,
        email,
        password: password || undefined,
      })
    ).then((res) => {
      if (!res.error) {
        setSuccessMsg('Profile credentials updated successfully!');
        setPassword('');
        setConfirmPassword('');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Update Profile */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200">
            <User className="w-5 h-5 text-brand-500" /> Account Settings
          </h2>

          {/* Messages */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> <span>{error}</span>
            </div>
          )}
          {validationError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> <span>{validationError}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" /> <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl glass-panel border border-white/10 flex flex-col gap-4 shadow-xl">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Full Name</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input text-xs pl-10 py-2.5"
                  required
                />
                <User className="absolute left-3.5 text-slate-500 w-4 h-4" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input text-xs pl-10 py-2.5"
                  required
                />
                <Mail className="absolute left-3.5 text-slate-500 w-4 h-4" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-2 border-t border-white/5 pt-4">
              <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Change Password (Optional)</label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input text-xs pl-10 py-2.5"
                />
                <KeyRound className="absolute left-3.5 text-slate-500 w-4 h-4" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="relative flex items-center">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full glass-input text-xs pl-10 py-2.5"
                />
                <KeyRound className="absolute left-3.5 text-slate-500 w-4 h-4" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glow-button w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider mt-2"
            >
              {loading ? 'Processing changes...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200">
            <ShoppingBag className="w-5 h-5 text-brand-500" /> Historical Order Ledger
          </h2>

          {ordersLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-xs text-slate-500">Querying your packages...</span>
            </div>
          ) : ordersError ? (
            <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              Failed to load order history: {ordersError}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 rounded-2xl glass-panel border border-white/5 text-center text-xs text-slate-500 leading-relaxed">
              No purchase orders are cataloged under your account. Visit the{' '}
              <Link to="/" className="text-brand-500 hover:underline font-semibold">
                Store Catalog
              </Link>{' '}
              to place an order.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/5 glass-panel shadow-md">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4.5 px-5">Order ID</th>
                    <th className="py-4.5 px-5">Placed Date</th>
                    <th className="py-4.5 px-5">Total Invoice</th>
                    <th className="py-4.5 px-5">Settlement Status</th>
                    <th className="py-4.5 px-5">Logistics Status</th>
                    <th className="py-4.5 px-5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-5 font-mono text-[10px] text-slate-400 select-all">{ord._id}</td>
                      <td className="py-4 px-5 font-sans">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-5 font-bold text-slate-200">${ord.totalPrice.toFixed(2)}</td>
                      <td className="py-4 px-5">
                        {ord.isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/15 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        {ord.isDelivered ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">
                            Shipped
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/15 px-2 py-0.5 rounded-full">
                            In Carrier
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <Link
                          to={`/order/${ord._id}`}
                          className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-brand-500 hover:bg-brand-500 transition-all inline-block"
                          title="View Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
