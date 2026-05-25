import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, BadgePercent, ArrowRight } from 'lucide-react';
import { savePaymentMethod } from '../store/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

export const Payment = () => {
  const { shippingAddress } = useSelector((state) => state.cart);

  // If no shipping address exists, redirect back to shipping
  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in flex flex-col gap-6">
      {/* Steps Tracker */}
      <CheckoutSteps step1 step2 step3 />

      <h1 className="text-xl font-extrabold text-white text-center tracking-tight">Payment Channel</h1>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-panel border border-white/10 flex flex-col gap-5 shadow-2xl">
        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">
          Select Gateway Method
        </label>

        <div className="flex flex-col gap-3">
          {/* Stripe Option */}
          <label
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
              paymentMethod === 'Stripe'
                ? 'bg-brand-500/10 border-brand-500/40 text-white'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Stripe Checkout</span>
                <span className="text-[9px] text-slate-500">Credit, Debit, or Apple Pay</span>
              </div>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              value="Stripe"
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-brand-500"
            />
          </label>

          {/* PayPal Option */}
          <label
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
              paymentMethod === 'PayPal'
                ? 'bg-brand-500/10 border-brand-500/40 text-white'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">PayPal Standard</span>
                <span className="text-[9px] text-slate-500">Instant PayPal balance or Bank transfer</span>
              </div>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-brand-500"
            />
          </label>

          {/* Razorpay Option */}
          <label
            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
              paymentMethod === 'Razorpay'
                ? 'bg-brand-500/10 border-brand-500/40 text-white'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <BadgePercent className="w-5 h-5 text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Razorpay / UPI</span>
                <span className="text-[9px] text-slate-500">Instant Indian NetBanking, Cards, or UPI QR</span>
              </div>
            </div>
            <input
              type="radio"
              name="paymentMethod"
              value="Razorpay"
              checked={paymentMethod === 'Razorpay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="accent-brand-500"
            />
          </label>
        </div>

        <button
          type="submit"
          className="glow-button w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider mt-2 flex items-center justify-center gap-2"
        >
          Confirm Payment Method <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default Payment;
