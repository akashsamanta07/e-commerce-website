import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import ProductCard from '../components/ProductCard.jsx';
import { ArrowForward } from '@mui/icons-material';
import dumy from '../assets/dumy.jpg';
import { Link } from 'react-router-dom';

// Dummy products
const PRODUCTS = [
  {
    id: 1,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Random Product Name dsf frdys trwyr",
    rating: 4.2,
    originalPrice: 120,
    discountedPrice: 90,
  },
  {
    id: 2,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Another Product Name",
    rating: 4.5,
    originalPrice: 150,
    discountedPrice: 110,
  },
  {
    id: 3,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Third Product Example",
    rating: 3.8,
    originalPrice: 100,
    discountedPrice: 75,
  },
  {
    id: 1,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Random Product Name dsf frdys trwyr",
    rating: 4.2,
    originalPrice: 120,
    discountedPrice: 90,
  },
  {
    id: 2,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Another Product Name",
    rating: 4.5,
    originalPrice: 150,
    discountedPrice: 110,
  },
  {
    id: 3,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Third Product Example",
    rating: 3.8,
    originalPrice: 100,
    discountedPrice: 75,
  },
  {
    id: 1,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Random Product Name dsf frdys trwyr",
    rating: 4.2,
    originalPrice: 120,
    discountedPrice: 90,
  },
  {
    id: 2,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Another Product Name",
    rating: 4.5,
    originalPrice: 150,
    discountedPrice: 110,
  },
  {
    id: 3,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Third Product Example",
    rating: 3.8,
    originalPrice: 100,
    discountedPrice: 75,
  },
];

function DefaultProduct({ product, name ,category}) {
    let { wishlistcount, setwishlistcount, cartCount, setCartCount,wishlist,setWishlist,cardlist,setcardlist }= product;
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
  }, []);

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

  const handleToggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setwishlistcount(wishlistcount - 1);
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setwishlistcount(wishlistcount + 1);
      setWishlist([...wishlist, id]);
    }
  };

  const handleAddToCard = (id) => {
    if (!cardlist.includes(id)) {
      setcardlist([...cardlist, id]);
      setCartCount(cartCount + 1);
    }
  };

  return (
    <div className='bg-white'>
      <div className="Container px-3 py-2 lg:py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex flex-col gap-1 md:w-1/3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{ name }</h2>
        </div>
        {/* View All Button (shows only if scroll is needed) */}
        {showViewAll && (
          <div className="flex items-center ml-auto">
            <Link to={`/${name === "Related Products" ? category.trim().toLowerCase() : name.trim().toLowerCase()}`}>
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
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            imageUrl={product.imageUrl}
            discountPercent={product.discountPercent}
            isWishlisted={wishlist.includes(product.id)}
            brand={product.brand}
            title={product.title}
            rating={product.rating}
            originalPrice={product.originalPrice}
            discountedPrice={product.discountedPrice}
            onAddToCart={() => { handleAddToCard(product.id) }}
            onToggleWishlist={() => handleToggleWishlist(product.id)}
            cardlist={cardlist}
          />
        ))}
      </div>
    </div>
  );
}

export default DefaultProduct;