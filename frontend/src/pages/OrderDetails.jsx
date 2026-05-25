import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CreditCard, ShoppingCart, Calendar, CheckCircle2, XCircle, Clock, Truck, ShieldCheck, DollarSign } from 'lucide-react';
import { fetchOrderDetails, payOrder, deliverOrder, resetOrderStatus } from '../store/orderSlice';

export const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { orderDetails: order, detailLoading: loading, error, success, payLoading } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));

    if (success) {
      dispatch(resetOrderStatus());
    }
  }, [dispatch, id, success]);

  const handlePayOrder = () => {
    const mockPaymentResult = {
      id: 'PAY_MOCK_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'succeeded',
      update_time: new Date().toISOString(),
      email_address: userInfo.email,
    };
    dispatch(payOrder({ id, paymentResult: mockPaymentResult }));
  };

  const handleDeliverOrder = () => {
    dispatch(deliverOrder(id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-500">Querying logistic database for order logs...</span>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Failed to load order: {error}
        </div>
      ) : !order ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 text-slate-400 text-sm">
          Order records could not be resolved.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500">Order Dashboard</span>
              <h1 className="text-xl md:text-2xl font-black text-white truncate">
                Invoice ID: <span className="text-slate-400 font-mono text-sm md:text-base">{order._id}</span>
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
              <Calendar className="w-4 h-4" /> Placed on {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Main Grid: Logistics info + Side checkout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Milestones */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Delivery Status Card */}
              <div className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col gap-4 shadow-md">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-400" /> Logistics Shipping Address
                </h2>
                <div className="text-xs text-slate-300 font-light leading-relaxed">
                  <span className="font-semibold text-slate-200 block mb-1">
                    {order.user ? order.user.name : 'Customer'} ({order.user ? order.user.email : 'No email'})
                  </span>
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </div>

                {order.isDelivered ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Delivered on {new Date(order.deliveredAt).toLocaleString()}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2.5 font-medium">
                    <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                    Awaiting Carrier pickup (Pending Dispatch)
                  </div>
                )}
              </div>

              {/* Payment Status Card */}
              <div className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col gap-4 shadow-md">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-400" /> Gateway Settlement Details
                </h2>
                <div className="text-xs text-slate-300 font-semibold text-slate-200">
                  Method: {order.paymentMethod} checkout
                </div>

                {order.isPaid ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Settled successfully on {new Date(order.paidAt).toLocaleString()}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5 font-medium">
                    <XCircle className="w-4 h-4 shrink-0" />
                    Awaiting Payment Authorization
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col gap-4 shadow-md">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-indigo-400" /> Package Consists of
                </h2>

                <div className="flex flex-col gap-3.5">
                  {order.orderItems.map((item, idx) => (
                    <div key={item._id || idx} className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-b-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={item.image} alt={item.name} className="w-12 aspect-video rounded object-cover border border-white/5 shrink-0" />
                        <Link to={`/product/${item.product}`} className="text-xs font-semibold text-slate-200 hover:text-brand-500 transition-colors line-clamp-1">
                          {item.name}
                        </Link>
                      </div>
                      <div className="text-xs text-slate-300 shrink-0 font-bold">
                        {item.qty} x ${item.price.toFixed(2)} = <span className="text-white">${(item.qty * item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Billing & Actions */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-5 shadow-2xl">
                <h2 className="font-extrabold text-base border-b border-white/5 pb-3 tracking-wide text-slate-200">
                  Billing Ledger
                </h2>

                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-200">${order.itemsPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Logistic Shipping</span>
                    {order.shippingPrice === 0 ? (
                      <span className="text-emerald-400 font-semibold uppercase text-[10px] tracking-wide">Free</span>
                    ) : (
                      <span className="font-semibold text-slate-200">${order.shippingPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Taxes & Duties</span>
                    <span className="font-semibold text-slate-200">${order.taxPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 text-sm">
                  <span className="font-bold text-slate-200">Total Invoiced</span>
                  <span className="font-black text-xl text-white">${order.totalPrice.toFixed(2)}</span>
                </div>

                {/* Simulated Payment Integration Button */}
                {!order.isPaid && (
                  <button
                    onClick={handlePayOrder}
                    disabled={payLoading}
                    className="glow-button w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    {payLoading ? 'Authorizing transaction...' : `Pay Invoice (${order.paymentMethod})`}
                  </button>
                )}

                {/* Mark as Delivered Button - Admin only */}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <button
                    onClick={handleDeliverOrder}
                    className="w-full py-3.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 uppercase tracking-wider flex items-center justify-center gap-2 mt-2 transition-colors"
                  >
                    <Truck className="w-4 h-4 animate-bounce" />
                    Ship & Deliver Package
                  </button>
                )}
              </div>

              {/* Secure Trust badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl glass-panel-light border border-white/5 justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Order status monitored dynamically by carrier lines.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
