import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { fetchProductDetails, createReview, resetProductStatus } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import Rating from '../components/Rating';

export const ProductDetails = () => {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, detailLoading: loading, error, reviewLoading, reviewError, success } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductDetails(id));

    if (success) {
      setRatingInput(5);
      setCommentInput('');
      dispatch(resetProductStatus());
    }
  }, [dispatch, id, success]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim()) {
      dispatch(createReview({ id, rating: ratingInput, comment: commentInput }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm text-slate-500">Querying product data sheets...</span>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Failed to load product: {error}
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {/* Top Panel Split: Image + Purchase Options */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Image Pane */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden glass-panel border border-white/10 aspect-video shadow-2xl relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Specification & Checkout Pane */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Category & Title */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-500">
                  {product.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
                  {product.name}
                </h1>
                <Rating value={product.rating} text={`${product.numReviews} active customer reviews`} />
              </div>

              {/* Brand and Description */}
              <div className="flex flex-col gap-3 p-5 rounded-2xl glass-panel-light border border-white/5">
                <div className="text-xs text-slate-500">
                  Brand: <span className="font-semibold text-slate-200">{product.brand}</span>
                </div>
                <p className="text-sm text-slate-300 font-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Purchase Card */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-slate-400">Unit Price</span>
                  <span className="font-bold text-2xl text-white">
                    ${product.price ? product.price.toFixed(2) : '0.00'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Inventory Status</span>
                  {product.countInStock > 0 ? (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      In Stock ({product.countInStock} units)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                      Temporarily Sold Out
                    </span>
                  )}
                </div>

                {/* Quantity selector */}
                {product.countInStock > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Order Quantity</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="glass-input text-xs py-1.5 px-3 focus:bg-slate-950"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2 transition-all ${
                    product.countInStock > 0
                      ? 'glow-button text-white'
                      : 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Order Cart
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Panel Split: Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/5 pt-12">
            {/* Reviews List */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200">
                <MessageSquare className="w-5 h-5 text-brand-500" /> Customer Feedbacks
              </h2>

              {product.reviews.length === 0 ? (
                <div className="p-6 rounded-2xl glass-panel border border-white/5 text-center text-sm text-slate-500">
                  No ratings or reviews exist yet for this hardware. Be the first to write one!
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {product.reviews.map((rev) => (
                    <div key={rev._id || Math.random()} className="p-5 rounded-2xl glass-panel-light border border-white/5 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 text-sm">{rev.name}</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1.5 font-sans">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Rating value={rev.rating} />
                      <p className="text-xs text-slate-400 font-light mt-1.5 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a review form */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-200">Write an Assessment</h3>

              {reviewError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {reviewError}
                </div>
              )}

              {userInfo ? (
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 p-6 rounded-2xl glass-panel border border-white/10 shadow-lg">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-400 font-medium">Rating Score</label>
                    <select
                      value={ratingInput}
                      onChange={(e) => setRatingInput(Number(e.target.value))}
                      className="glass-input text-xs py-2 px-3 focus:bg-slate-950"
                    >
                      <option value="5">5 - Excellent (Perfect peripheral)</option>
                      <option value="4">4 - High Quality</option>
                      <option value="3">3 - Satisfactory</option>
                      <option value="2">2 - Poor Performance</option>
                      <option value="1">1 - Defective / Horrible</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-400 font-medium">Detailed Feedback</label>
                    <textarea
                      placeholder="Share your experience using this hardware..."
                      rows="4"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="glass-input text-xs leading-relaxed resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="glow-button w-full py-2.5 rounded-xl text-xs font-semibold"
                  >
                    {reviewLoading ? 'Submitting details...' : 'Publish Assessment'}
                  </button>
                </form>
              ) : (
                <div className="p-5 rounded-2xl glass-panel border border-white/5 text-center text-xs text-slate-400 leading-relaxed">
                  Please{' '}
                  <Link to="/login" className="text-brand-500 hover:underline font-semibold">
                    sign in
                  </Link>{' '}
                  to publish a product review.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
