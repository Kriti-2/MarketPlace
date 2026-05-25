import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Shield, Search, Menu, X, ShoppingBag } from 'lucide-react';
import { logout } from '../store/authSlice';

export const Navbar = () => {
  const [keyword, setKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?search=${keyword}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-brand-500 group-hover:opacity-90 transition-opacity">
            HORIZON
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search products, brands, tech..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full glass-input text-sm pl-11 pr-4 py-2 bg-slate-950/40 focus:bg-slate-950/90"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <button type="submit" className="hidden">Search</button>
        </form>

        {/* Action Menu - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/cart" className="flex items-center gap-2 relative p-2.5 rounded-xl hover:bg-white/5 transition-all text-slate-300 hover:text-white group">
            <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform" />
            <span className="text-sm font-medium">Cart</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-slate-950 animate-pulse-slow">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* User Authentication Menu */}
          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => { setDropdownOpen(!dropdownOpen); setAdminDropdownOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all text-slate-300 hover:text-white"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
                  {userInfo.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{userInfo.name.split(' ')[0]}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel-light p-1.5 shadow-2xl border border-white/5 animate-slide-up">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="glow-button px-5 py-2 rounded-xl text-sm font-semibold">
              Login
            </Link>
          )}

          {/* Admin Dashboard Control */}
          {userInfo && userInfo.isAdmin && (
            <div className="relative">
              <button
                onClick={() => { setAdminDropdownOpen(!adminDropdownOpen); setDropdownOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm font-semibold">Admin</span>
              </button>

              {adminDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel-light p-1.5 shadow-2xl border border-white/5 animate-slide-up">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setAdminDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    Control Panel
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative p-2 rounded-lg text-slate-300">
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/5 flex flex-col gap-3 animate-slide-down">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center relative w-full px-2">
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full glass-input text-sm pl-11 pr-4 py-2 bg-slate-950/40"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          </form>

          {/* Mobile Links */}
          <div className="flex flex-col gap-2 px-2 pb-2">
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white text-sm"
                >
                  My Profile
                </Link>
                {userInfo.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-semibold border border-amber-500/10"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="glow-button w-full text-center py-2.5 rounded-xl text-sm font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
