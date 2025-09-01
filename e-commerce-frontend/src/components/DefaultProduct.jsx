import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import ProductCard from '../components/ProductCard.jsx';
import { ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import getImageUrl from './getImageUrl.js';

// This component expects product objects that match the backend product schema:
// {
//   _id: String,
//   title: String,
//   brand: String,
//   description: String,
//   category: String,
//   subcategory: String,
//   originalPrice: Number,
//   discountPrice: Number,
//   inStock: Number,
//   rating: Number,
//   images: [String],
//   sales: Number,
//   reviewlist: [ObjectId],
//   ... (see backend for full details)
// }

function DefaultProduct({ product, name, category }) {
  // product: { wishlistcount, setwishlistcount, cartCount, setCartCount, wishlist, setWishlist, cartlist, setCartlist, selectedProduct }
  let {
    wishlistcount = 0,
    setwishlistcount = () => {},
    cartCount = 0,
    setCartCount = () => {},
    wishlist = [],
    setWishlist = () => {},
    cartlist = [],
    setCartlist = () => {},
    selectedProduct = [],
  } = product || {};

  const scrollRef = useRef(null);
  const [showViewAll, setShowViewAll] = useState(false);

  // Check if scroll is needed
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        setShowViewAll(
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth + 2 // +2 for rounding
        );
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [selectedProduct]);

  // --- Drag-to-scroll logic for mouse users ---
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDownHandler = (e) => {
      // Only left mouse button
      if (e.button !== 0) return;
      isDown = true;
      el.classList.add('cursor-grabbing');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
      el.classList.remove('cursor-grabbing');
    };

    const mouseUpHandler = () => {
      isDown = false;
      el.classList.remove('cursor-grabbing');
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.2; // scroll-fast
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', mouseDownHandler);
    el.addEventListener('mouseleave', mouseLeaveHandler);
    el.addEventListener('mouseup', mouseUpHandler);
    el.addEventListener('mousemove', mouseMoveHandler);

    // Clean up
    return () => {
      el.removeEventListener('mousedown', mouseDownHandler);
      el.removeEventListener('mouseleave', mouseLeaveHandler);
      el.removeEventListener('mouseup', mouseUpHandler);
      el.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);

  // For backend products, use _id as id
  const getProductId = (p) => p._id || p.id;

  const handleToggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setwishlistcount(wishlistcount - 1);
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setwishlistcount(wishlistcount + 1);
      setWishlist([...wishlist, id]);
    }
  };

  // cartlist is an array of objects: [{product, quantity}]
  const handleAddToCart = (id) => {
    const existing = cartlist.find(item => (item.product || item.id) === id);
    if (existing) {
      // Already in cart, do nothing (or you could increase quantity if desired)
      return;
    } else {
      // Add new item with quantity 1
      setCartlist([...cartlist, { product: id, quantity: 1 }]);
      setCartCount(cartCount + 1);
    }
  };

  // If no selectedProduct, don't render section
  if (!Array.isArray(selectedProduct) || selectedProduct.length === 0) return null;

  return (
    <div className='bg-white'>
      <div className="Container px-3 py-2 lg:py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex flex-col gap-1 md:w-1/3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{name}</h2>
        </div>
        {/* View All Button (shows only if scroll is needed) */}
        {showViewAll && (
          <div className="flex items-center ml-auto">
            <Link to={`/menu/${name === "Related Products" ? (category || '').trim().toLowerCase() : (name || '').trim().toLowerCase()}`}>
              <Button
                variant="text"
                className="!capitalize !font-bold !text-pink-600 flex items-center gap-1 !bg-gray-100"
                endIcon={<ArrowForward />}
              >
                View All
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div
        className="Container bg-white flex justify-start gap-[6px] lg:gap-[1rem] py-[1rem] flex-nowrap overflow-x-auto cursor-grab select-none scrollbar-none"
        ref={scrollRef}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {selectedProduct.map((prod) => {
          // Use backend schema fields
          const id = prod._id;
          let imageUrl = prod.imageUrl;
          if (!imageUrl && Array.isArray(prod.images) && prod.images.length > 0) {
            imageUrl = getImageUrl(prod.images[0]);
          }
          return (
            <ProductCard
              key={id}
              id={id}
              imageUrl={imageUrl}
              // Calculate discount percent from originalPrice and discountPrice if not present
              discountPercent={
                typeof prod.discountPercent === 'number'
                  ? prod.discountPercent
                  : (typeof prod.originalPrice === 'number' && typeof prod.discountPrice === 'number' && prod.originalPrice > 0)
                    ? Math.round(100 * (prod.originalPrice - prod.discountPrice) / prod.originalPrice)
                    : 0
              }
              isWishlisted={wishlist.includes(id)}
              brand={prod.brand}
              title={prod.title}
              rating={typeof prod.rating === 'number' ? prod.rating : 0}
              originalPrice={prod.originalPrice}
              discountedPrice={prod.discountPrice}
              onAddToCart={() => { handleAddToCart(id) }}
              onToggleWishlist={() => handleToggleWishlist(id)}
              cartlist={cartlist}
              inStock={typeof prod.inStock === 'number' ? prod.inStock : 0}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DefaultProduct;