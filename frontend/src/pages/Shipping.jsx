import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapPin, Globe, Landmark, Navigation, ArrowRight } from 'lucide-react';
import { saveShippingAddress } from '../store/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

export const Shipping = () => {
  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address && city && postalCode && country) {
      dispatch(saveShippingAddress({ address, city, postalCode, country }));
      navigate('/payment');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in flex flex-col gap-6">
      {/* Step Tracker */}
      <CheckoutSteps step1 step2 />

      <h1 className="text-xl font-extrabold text-white text-center tracking-tight">Delivery Address</h1>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-panel border border-white/10 flex flex-col gap-5 shadow-2xl">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Street Address</label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g. 123 Sci-Fi Drive"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full glass-input text-xs pl-11 py-3"
              required
            />
            <MapPin className="absolute left-4 text-slate-500 w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">City</label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g. Neo Tokyo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full glass-input text-xs pl-11 py-3"
              required
            />
            <Navigation className="absolute left-4 text-slate-500 w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Postal Code</label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g. 100-0004"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full glass-input text-xs pl-11 py-3"
              required
            />
            <Landmark className="absolute left-4 text-slate-500 w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Country</label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g. Japan"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full glass-input text-xs pl-11 py-3"
              required
            />
            <Globe className="absolute left-4 text-slate-500 w-4 h-4" />
          </div>
        </div>

        <button
          type="submit"
          className="glow-button w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider mt-2 flex items-center justify-center gap-2"
        >
          Proceed to Payment <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default Shipping;
