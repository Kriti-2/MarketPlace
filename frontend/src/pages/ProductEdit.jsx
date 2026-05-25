import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchProductDetails, updateProduct, resetProductStatus } from '../store/productSlice';

export const ProductEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, detailLoading: loading, error, success } = useSelector((state) => state.products);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (success) {
      dispatch(resetProductStatus());
      navigate('/admin/dashboard');
    } else {
      if (!product || product._id !== id) {
        dispatch(fetchProductDetails(id));
      } else {
        setName(product.name || '');
        setPrice(product.price || 0);
        setImage(product.image || '');
        setBrand(product.brand || '');
        setCategory(product.category || '');
        setCountInStock(product.countInStock || 0);
        setDescription(product.description || '');
      }
    }
  }, [dispatch, id, product, success, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        id,
        name,
        price: Number(price),
        image,
        brand,
        category,
        countInStock: Number(countInStock),
        description,
      })
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in flex flex-col gap-6">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors self-start">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <h1 className="text-xl font-extrabold text-white tracking-tight">Edit Product Catalog</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-panel border border-white/10 flex flex-col gap-5 shadow-2xl">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input text-xs"
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="glass-input text-xs animate-none"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Count in Stock</label>
              <input
                type="number"
                placeholder="0"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="glass-input text-xs"
                required
              />
            </div>
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Brand</label>
              <input
                type="text"
                placeholder="Product Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="glass-input text-xs"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Category</label>
              <input
                type="text"
                placeholder="Electronics, Audio, etc."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input text-xs"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Image Address URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="glass-input text-xs"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Detailed Description</label>
            <textarea
              placeholder="Describe the peripheral hardware specs and key visual highlights..."
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-input text-xs leading-relaxed resize-none"
              required
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="glow-button w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
          >
            <Save className="w-4 h-4" /> Save catalog alterations
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductEdit;
