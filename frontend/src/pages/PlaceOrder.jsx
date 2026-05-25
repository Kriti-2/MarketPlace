import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShoppingCart, AlertCircle, ArrowRight } from 'lucide-react';
import { createOrder, resetOrderStatus } from '../store/orderSlice';
import { clearCartItems } from '../store/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

export const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  const { orderDetails, success, error, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  useEffect(() => {
    if (success && orderDetails) {
      dispatch(clearCartItems());
      navigate(`/order/${orderDetails._id}`);
      dispatch(resetOrderStatus());
    }
  }, [success, orderDetails, navigate, dispatch]);

  const handlePlaceOrder = () => {
    dispatch(
      createOrder({
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: Number(itemsPrice),
        shippingPrice: Number(shippingPrice),
        taxPrice: Number(taxPrice),
        totalPrice: Number(totalPrice),
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {/* Steps Tracker */}
      <CheckoutSteps step1 step2 step3 step4 />

      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-8 text-slate-100 flex items-center gap-3">
        Review & Confirm Order
      </h1>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Specification details */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Shipping Address Panel */}
          <div className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col gap-3 shadow-md">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" /> Delivery Address
            </h2>
            <div className="text-xs text-slate-300 leading-relaxed font-light">
              <span className="font-semibold text-white block mb-1">
                {shippingAddress.address}
              </span>
              {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </div>
          </div>

          {/* Payment Gateway Panel */}
          <div className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col gap-3 shadow-md">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-500" /> Payment Gateway Channel
            </h2>
            <div className="text-xs text-slate-300 font-semibold text-white">
              {paymentMethod} Checkout
            </div>
          </div>

          {/* Cart Items List Panel */}
          <div className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col gap-4 shadow-md">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-brand-500" /> Ordered Hardware Items
            </h2>

            <div className="flex flex-col gap-3.5">
              {cartItems.map((item, idx) => (
                <div key={item._id} className="flex items-center justify-between gap-4 py-2.5 border-b border-white/5 last:border-b-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.name} className="w-12 aspect-video rounded object-cover border border-white/5 shrink-0" />
                    <Link to={`/product/${item._id}`} className="text-xs font-semibold text-slate-200 hover:text-brand-500 transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-xs font-bold text-slate-300 shrink-0">
                    {item.qty} x ${item.price.toFixed(2)} = <span className="text-white">${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary Billing Panel */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-5 shadow-2xl">
            <h2 className="font-extrabold text-base border-b border-white/5 pb-3 tracking-wide text-slate-200">
              Billing Ledger
            </h2>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Items Cost</span>
                <span className="font-semibold text-slate-200">${itemsPrice}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Logistic Delivery</span>
                {Number(shippingPrice) === 0 ? (
                  <span className="text-emerald-400 font-semibold uppercase text-[10px] tracking-wide">Free</span>
                ) : (
                  <span className="font-semibold text-slate-200">${shippingPrice}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>Taxes & Levies</span>
                <span className="font-semibold text-slate-200">${taxPrice}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 text-sm">
              <span className="font-bold text-slate-200">Total Invoice</span>
              <span className="font-black text-xl text-white">${totalPrice}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
              className="glow-button w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Transmitting order logs...' : 'Complete Payment Authorization'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
