import React, { useState, useRef } from 'react';
import { MdLocalOffer } from 'react-icons/md';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ProductCard = ({
  id,
  imageUrl,
  discountPercent,
  isWishlisted,
  brand,
  title,
  rating,
  originalPrice,
  discountedPrice,
  onAddToCart,
  onToggleWishlist,
  cardlist
}) => {
  // Tooltip state for wishlist button
  const [showWishlistTooltip, setShowWishlistTooltip] = useState(false);
  const tooltipTimeout = useRef(null);

  const handleWishlistClick = (e) => {
    if (onToggleWishlist) onToggleWishlist(e);
    setShowWishlistTooltip(true);
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    tooltipTimeout.current = setTimeout(() => {
      setShowWishlistTooltip(false);
    }, 1000);
  };

  // Helper: check if product is already in cartlist (array of {id, quantity})
  const isInCart = cardlist.find(item => item.id === id);

  // Modified notify to show toast in the bottom corner on mobile, smaller size
  const notify = () => {
    if (!isInCart && onAddToCart) {
      onAddToCart();
    }
    const isMobile = window.innerWidth <= 640;
    const toastOptions = {
      autoClose: 1000,
      position: "top-right",
      className: isMobile ? "text-xs px-2 py-1 rounded-md" : "",
      style: isMobile
        ? { minWidth: "150px", maxWidth: "60vw", fontSize: "0.85rem", borderRadius: "10px", margin: "0.5rem" }
        : {},
    };
    if (isInCart) {
      toast.warning("Item already added", toastOptions);
    } else {
      toast.success("Item successfully added", toastOptions);
    }
  };

  return (
    <div className="product-card bg-white rounded-xl shadow-md flex flex-col w-[10.2rem] lg:w-[14rem] border-[1px] border-gray-300 shrink-0 cursor-pointer">
      {/* Image section */}
      <div className="relative w-full">
        <Link to={`/product/${id}`}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-[12rem] flex rounded-xl overflow-hidden"
          />
        </Link>
        {/* Discount badge */}
        {discountPercent && (
          <div className="absolute top-2 left-1 bg-pink-600 text-white px-2 py-1 rounded-md flex items-center font-semibold text-xs z-10 shadow min-h-[22px] gap-1">
            <MdLocalOffer className="mr-1 text-base" />
            {discountPercent}%
          </div>
        )}

        {/* Wishlist button */}
        <div className="absolute top-[0.2rem] right-2 bg-white hover:bg-pink-100 z-20 shadow rounded-full p-0 transition group">
          <div className="relative">
            <IconButton
              aria-label="wishlist"
              onClick={handleWishlistClick}
            >
              {isWishlisted ? (
                <FaHeart className="text-pink-600 text-lg" />
              ) : (
                <FaRegHeart className="text-gray-400 text-lg" />
              )}
            </IconButton>
            {/* Show tooltip on click for 1 second */}
            {showWishlistTooltip && (
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-[0.4rem] rounded bg-gray-800 text-white text-xs opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {isWishlisted ? "Add to wishlist" : "Remove from wishlist"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="px-3 py-2 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 font-semibold mb-0.5">{brand}</div>
        <div
          className="text-sm font-medium min-h-[36px] leading-tight overflow-hidden text-ellipsis whitespace-nowrap"
          title={title}
        >
          {title}
        </div>
        <div className="flex items-center mb-1">
          {Array.from({ length: 5 }).map((_, idx) =>
            idx < Math.round(rating) ? (
              <AiFillStar key={idx} className="text-yellow-400" size={15} />
            ) : (
              <AiOutlineStar key={idx} className="text-gray-300" size={15} />
            )
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-400 line-through font-normal">
            ₹{originalPrice}
          </span>
          <span className="text-pink-600 font-bold text-base">
            ₹{discountedPrice}
          </span>
        </div>
      </div>

      {/* Add to Cart button */}
      <div className="px-3 pb-3">
        <button
          onClick={notify}
          className="w-full flex items-center justify-center gap-2 border-[1px] lg:border-2 border-pink-500 text-pink-500 bg-white font-medium lg:font-bold rounded-lg py-2 text-base transition-all duration-200 shadow hover:bg-black hover:text-white hover:border-white min-h-[40px]"
        >
          <FaShoppingCart className="text-lg" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
