import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import Rating from './Rating';

export const ProductCard = ({ product }) => {
  return (
    <div className="group relative flex flex-col rounded-2xl glass-card overflow-hidden">
      {/* Product Image Panel */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-white/5">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out"
        />
        {/* Hover overlay quick buttons */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product._id}`}
            className="p-3 rounded-xl bg-slate-900/80 text-white hover:bg-brand-500 border border-white/10 hover:border-brand-500 hover:scale-110 transition-all shadow-xl"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Stock Badge */}
        {product.countInStock === 0 ? (
          <span className="absolute top-3 right-3 bg-red-500/25 border border-red-500/35 text-red-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md">
            Out of Stock
          </span>
        ) : product.countInStock <= 5 ? (
          <span className="absolute top-3 right-3 bg-amber-500/25 border border-amber-500/35 text-amber-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md">
            Only {product.countInStock} Left
          </span>
        ) : null}
      </div>

      {/* Product Details Panel */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          {/* Category */}
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500">
            {product.category}
          </span>
          {/* Title */}
          <Link to={`/product/${product._id}`} className="block">
            <h3 className="font-semibold text-slate-100 group-hover:text-brand-500 transition-colors line-clamp-1 text-base">
              {product.name}
            </h3>
          </Link>
          {/* Rating */}
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light mt-1">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Price</span>
            <span className="font-bold text-lg text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <Link
            to={`/product/${product._id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all"
          >
            <span>Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
