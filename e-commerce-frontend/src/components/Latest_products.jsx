import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import ProductCard from '../components/ProductCard.jsx';
import { ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Latest_products rewritten to match AllProducts format
function Latest_products({ product }) {
  let {
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
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth + 2
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
      const walk = (x - startX) * 1.2;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', mouseDownHandler);
    el.addEventListener('mouseleave', mouseLeaveHandler);
    el.addEventListener('mouseup', mouseUpHandler);
    el.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      el.removeEventListener('mousedown', mouseDownHandler);
      el.removeEventListener('mouseleave', mouseLeaveHandler);
      el.removeEventListener('mouseup', mouseUpHandler);
      el.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, []);


  if (!Array.isArray(selectedProduct) || selectedProduct.length === 0) return null;

  return (
    <div className='bg-white'>
      <div className="Container px-3 py-2 lg:py-3 flex items-center justify-between bg-gray-200 rounded">
        <div className="flex flex-col gap-1 md:w-1/3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Latest Products</h2>
        </div>
        {showViewAll && (
          <div className="flex items-center ml-auto">
            <Link to="/menu/latest">
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
        {selectedProduct.map((prod) => (
            <ProductCard
            key={prod._id}
            product={prod}
            cartlist={cartlist}
            setCartlist={setCartlist}
            wishlist={wishlist}
            setWishlist={setWishlist}
          />
        ))}
      </div>
    </div>
  );
}

export default Latest_products;