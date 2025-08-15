import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import ProductCard from '../components/ProductCard.jsx';
import dumy from '../assets/dumy.jpg';

const MENU_ITEMS = [
  'Fashion',
  'Electronics',
  'Bags',
  'Footwear',
  'Groceries',
  'Beauty',
  'Wellness',
  'Jewellery',
];

// Dummy product data for demonstration
const products = [
  {
    id: 1,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Random ysw rdyrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
    rating: 4.2,
    originalPrice: 120,
    discountedPrice: 90,
  },
  {
    id: 2,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Another",
    rating: 4.5,
    originalPrice: 150,
    discountedPrice: 110,
  },
  {
    id: 3,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Third" ,
    rating: 3.8,
    originalPrice: 100,
    discountedPrice: 75,
  },
  {
    id: 4,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Fourth",
    rating: 4.0,
    originalPrice: 100,
    discountedPrice: 75,
  },
  {
    id: 1,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Random",
    rating: 4.2,
    originalPrice: 120,
    discountedPrice: 90,
  },
  {
    id: 2,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Another",
    rating: 4.5,
    originalPrice: 150,
    discountedPrice: 110,
  },
  {
    id: 3,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Third" ,
    rating: 3.8,
    originalPrice: 100,
    discountedPrice: 75,
  },
  {
    id: 4,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Fourth",
    rating: 4.0,
    originalPrice: 100,
    discountedPrice: 75,
  },
  {
    id: 1,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Random",
    rating: 4.2,
    originalPrice: 120,
    discountedPrice: 90,
  },
  {
    id: 2,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Another",
    rating: 4.5,
    originalPrice: 150,
    discountedPrice: 110,
  },
  {
    id: 3,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Third" ,
    rating: 3.8,
    originalPrice: 100,
    discountedPrice: 75,
  },
  {
    id: 4,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Fourth",
    rating: 4.0,
    originalPrice: 100,
    discountedPrice: 75,
  }
];

function Popular_products({ product }) {
  let { wishlistcount, setwishlistcount, cartCount, setCartCount, wishlist, setWishlist, cardlist, setcardlist } = product;
  const [activeMenu, setActiveMenu] = useState(MENU_ITEMS[0]);
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

  // --- Drag-to-scroll logic for mouse users (copied from Latest_products) ---
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
    const existing = cardlist.find(item => item.id === id);
    if (existing) {
      return;
    } else {
      // If not in cart, add with quantity 1
      setcardlist([...cardlist, { id, quantity: 1 }]);
      setCartCount(cartCount + 1);
    }
  };

  return (
    <div className='bg-white'>
      <div className="Container p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex flex-col gap-1 md:w-1/3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Popular Products</h2>
          <p className="text-sm text-gray-600">
            Do not miss the current offers until the end of March.
          </p>
        </div>
        {/* Right Section: Menu */}
        <div className="w-full md:w-2/3">
          <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-2">
            {/* Menu List */}
            <ul
              className="
                flex
                flex-nowrap
                overflow-x-auto
                scrollbar-none
                border-0
                shadow-none
                w-full
                justify-start
                md:justify-center
                no-underline
                px-1
                items-center
                whitespace-nowrap
                cursor-grab
                select-none
              "
              style={{
                gap: typeof window !== "undefined" && window.innerWidth < 640 ? '0' : '0.75rem',
              }}
            >
              {MENU_ITEMS.map((item) => (
                <li
                  key={item}
                  className={`w-full md:w-auto  ${
                    activeMenu === item
                      ? "border-b-2 lg:border-b-[3px] border-pink-600"
                      : "!text-gray-700 hover:!text-pink-600"
                  }`}
                >
                  <Button
                    onClick={() => setActiveMenu(item)}
                    variant="text"
                    className={`!capitalize !font-bold !text-sm md:!text-base
                      ${activeMenu === item
                        ? "!text-pink-600"
                        : "!text-gray-700 hover:!text-pink-600"
                      }`}
                    size="medium"
                    style={{
                      whiteSpace: 'nowrap',
                      fontSize: '0.98rem',
                      flex: '0 0 auto',
                    }}
                  >
                    {item}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        className="Container bg-white flex justify-start gap-[6px] lg:gap-[1rem] py-[1rem] flex-nowrap overflow-x-auto cursor-grab select-none scrollbar-none"
        ref={scrollRef}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((prod) => {
          // Find quantity in cartlist for this product (if any)
          const cartItem = cardlist.find(item => item.id === prod.id);
          return (
            <ProductCard
              key={prod.id}
              id={prod.id}
              imageUrl={prod.imageUrl}
              discountPercent={prod.discountPercent}
              isWishlisted={wishlist.includes(prod.id)}
              brand={prod.brand}
              title={prod.title}
              rating={prod.rating}
              originalPrice={prod.originalPrice}
              discountedPrice={prod.discountedPrice}
              onAddToCart={() => handleAddToCard(prod.id)}
              onToggleWishlist={() => handleToggleWishlist(prod.id)}
              cardlist={cardlist}
              quantity={cartItem ? cartItem.quantity : 0}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Popular_products;