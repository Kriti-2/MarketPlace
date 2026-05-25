import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, DollarSign, ShoppingBag, ShoppingCart, Users, Trash2, Edit3, Eye, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchProducts, deleteProduct, createProduct, resetProductStatus } from '../store/productSlice';
import { fetchAllOrders } from '../store/orderSlice';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading: productsLoading, error: productsError, success: productSuccess } = useSelector((state) => state.products);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchAllOrders());

    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    }
  }, [dispatch, userInfo, productSuccess]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await fetch('/api/auth', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load users');
      setUsersList(data);
    } catch (err) {
      setUsersError(err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleAddProduct = () => {
    const sampleProduct = {
      name: 'Sample Hardware ' + Math.floor(Math.random() * 1000),
      price: 99.99,
      brand: 'Standard Brand',
      category: 'Electronics',
      countInStock: 10,
      description: 'Provide dynamic description details here...',
      image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    };
    dispatch(createProduct(sampleProduct)).then((res) => {
      if (!res.error) {
        dispatch(resetProductStatus());
        dispatch(fetchProducts({}));
      }
    });
  };

  // Stats calculators
  const totalSalesRevenue = orders
    .filter((o) => o.isPaid)
    .reduce((acc, order) => acc + order.totalPrice, 0)
    .toFixed(2);

  const statsList = [
    { name: 'Total Revenue', value: `$${totalSalesRevenue}`, icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Sales Volume', value: orders.length, icon: ShoppingBag, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { name: 'Hardware Catalog', value: products.length, icon: ShoppingCart, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { name: 'Registered Users', value: usersList.length, icon: Users, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in flex flex-col gap-10">
      {/* Title */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400">
          <Shield className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Security Gateways</span>
          <h1 className="text-xl md:text-2xl font-black text-white">Horizon Control Center</h1>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-6 rounded-2xl glass-panel border border-white/5 flex items-center justify-between shadow-md">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 font-medium">{stat.name}</span>
                <span className="text-2xl font-black text-slate-100">{stat.value}</span>
              </div>
              <div className={`p-3.5 rounded-xl border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs selector */}
      <div className="flex border-b border-white/5 gap-4">
        {['products', 'orders', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative px-2 ${
              activeTab === tab ? 'text-brand-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-500 rounded-full animate-pulse-slow" />
            )}
          </button>
        ))}
      </div>

      {/* Content panes */}
      <div className="w-full">
        {/* Products Pane */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Manage all store inventory products</span>
              <button
                onClick={handleAddProduct}
                className="glow-button px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : productsError ? (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {productsError}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/5 glass-panel shadow-md">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-4.5 px-5">ID</th>
                      <th className="py-4.5 px-5">Name</th>
                      <th className="py-4.5 px-5">Price</th>
                      <th className="py-4.5 px-5">Category</th>
                      <th className="py-4.5 px-5">Brand</th>
                      <th className="py-4.5 px-5">Stock</th>
                      <th className="py-4.5 px-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-5 font-mono text-[10px] text-slate-500">{p._id}</td>
                        <td className="py-4 px-5 font-semibold text-slate-200">{p.name}</td>
                        <td className="py-4 px-5 font-bold text-slate-300">${p.price.toFixed(2)}</td>
                        <td className="py-4 px-5">{p.category}</td>
                        <td className="py-4 px-5">{p.brand}</td>
                        <td className="py-4 px-5">
                          {p.countInStock === 0 ? (
                            <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/15 px-2 py-0.5 rounded-full">Out</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">{p.countInStock} units</span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/product/${p._id}/edit`}
                              className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
                              title="Edit Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Pane */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            <span className="text-sm text-slate-400">Monitor all customer order fulfillment processes</span>

            {ordersLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : ordersError ? (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {ordersError}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/5 glass-panel shadow-md">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-4.5 px-5">Order ID</th>
                      <th className="py-4.5 px-5">Customer</th>
                      <th className="py-4.5 px-5">Placed Date</th>
                      <th className="py-4.5 px-5">Total Invoice</th>
                      <th className="py-4.5 px-5">Settled</th>
                      <th className="py-4.5 px-5">Logistics</th>
                      <th className="py-4.5 px-5">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-5 font-mono text-[10px] text-slate-500">{ord._id}</td>
                        <td className="py-4 px-5 font-semibold text-slate-200">
                          {ord.user ? ord.user.name : 'Unknown User'}
                        </td>
                        <td className="py-4 px-5">{new Date(ord.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-5 font-bold text-slate-200">${ord.totalPrice.toFixed(2)}</td>
                        <td className="py-4 px-5">
                          {ord.isPaid ? (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-0.5 rounded-full">Paid</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/15 px-2.5 py-0.5 rounded-full">Pending</span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          {ord.isDelivered ? (
                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-0.5 rounded-full">Shipped</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/15 px-2.5 py-0.5 rounded-full">Carrier</span>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <Link
                            to={`/order/${ord._id}`}
                            className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all inline-block"
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
        )}

        {/* Users Pane */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-4">
            <span className="text-sm text-slate-400">View customer accounts and privilege access logs</span>

            {usersLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : usersError ? (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {usersError}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/5 glass-panel shadow-md">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-4.5 px-5">User ID</th>
                      <th className="py-4.5 px-5">Full Name</th>
                      <th className="py-4.5 px-5">Email Address</th>
                      <th className="py-4.5 px-5">Security Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {usersList.map((usr) => (
                      <tr key={usr._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-5 font-mono text-[10px] text-slate-500">{usr._id}</td>
                        <td className="py-4 px-5 font-semibold text-slate-200">{usr.name}</td>
                        <td className="py-4 px-5">{usr.email}</td>
                        <td className="py-4 px-5">
                          {usr.isAdmin ? (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              Systems Admin
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-400 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full">
                              Customer Account
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
