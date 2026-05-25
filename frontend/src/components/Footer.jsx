import React from 'react';
import { ShoppingBag } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950 py-12 px-4 md:px-8 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500 border border-brand-500/20">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-wider text-slate-200">HORIZON CART</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Customer Support</a>
        </div>

        {/* copyright */}
        <span className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Horizon. Built with React and Node.js.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
