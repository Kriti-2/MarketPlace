import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { addToCart, removeFromCart } from '../store/cartSlice';

export const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );

  const { userInfo } = useSelector((state) => state.auth);

  const handleQtyChange = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=shipping');
    }
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-8 text-slate-100 flex items-center gap-3">
        <ShoppingCart className="w-6 h-6 text-brand-500" /> Shopping Order Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 glass-panel rounded-3xl border border-white/5 gap-6">
          <div className="p-4 rounded-full bg-slate-900 border border-white/5 text-slate-500">
            <ShoppingCart className="w-12 h-12" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-slate-200 font-bold text-lg">Your cart is currently empty</span>
            <span className="text-slate-500 text-xs max-w-sm">
              Add premium mechanical peripherals, workstation displays, and acoustic headsets to get started.
            </span>
          </div>
          <Link
            to="/"
            className="glow-button px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl glass-panel border border-white/5 shadow-md justify-between"
              >
                {/* Thumbnail Image */}
                <div className="w-20 aspect-video rounded-lg overflow-hidden border border-white/5 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <Link
                    to={`/product/${item._id}`}
                    className="font-semibold text-sm text-slate-100 hover:text-brand-500 transition-colors line-clamp-1 block"
                  >
                    {item.name}
                  </Link>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 block">
                    {item.brand}
                  </span>
                </div>

                {/* Price */}
                <span className="font-bold text-sm text-slate-200">${item.price.toFixed(2)}</span>

                {/* Controls (Qty dropdown + Delete icon) */}
                <div className="flex items-center gap-3">
                  <select
                    value={item.qty}
                    onChange={(e) => handleQtyChange(item, Number(e.target.value))}
                    className="glass-input text-xs py-1 px-2 focus:bg-slate-950"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 hover:scale-105 transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors self-start mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>

          {/* Right Summary Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-5 shadow-2xl">
              <h2 className="font-extrabold text-base border-b border-white/5 pb-3 tracking-wide text-slate-200">
                Order Summary ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
              </h2>

              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200">${itemsPrice}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Estimated Shipping</span>
                  {Number(shippingPrice) === 0 ? (
                    <span className="text-emerald-400 font-semibold uppercase text-[10px] tracking-wide">Free</span>
                  ) : (
                    <span className="font-semibold text-slate-200">${shippingPrice}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Estimated Taxes (15%)</span>
                  <span className="font-semibold text-slate-200">${taxPrice}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 text-sm">
                <span className="font-bold text-slate-200">Order Total</span>
                <span className="font-black text-xl text-white">${totalPrice}</span>
              </div>

              {/* Free shipping milestone reminder */}
              {Number(shippingPrice) > 0 && (
                <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] flex items-center gap-2 font-medium">
                  <Truck className="w-3.5 h-3.5" />
                  Add ${(100 - Number(itemsPrice)).toFixed(2)} more to qualify for Free Shipping!
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="glow-button w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wide mt-2"
              >
                Proceed to Checkout
              </button>
            </div>

            {/* Premium Trust badge */}
            <div className="flex items-center gap-3 p-4 rounded-xl glass-panel-light border border-white/5 justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Secure SSL checkouts. Satisfactions guaranteed.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
