import React from 'react';
import dumy from '../../assets/dumy.jpg';
import { IconButton, Tooltip } from '@mui/material';
import { FaStar, FaRegStar, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import notify from '../../components/Notification/notify';

// Dummy product data for demonstration (in real app, fetch from backend)
const allProducts = [
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
    title: "Another Productggggggggggggggggggggggggggggggggggggggh Name",
    rating: 4.5,
    originalPrice: 150,
    discountedPrice: 110,
  },
  {
    id: 3,
    imageUrl: dumy,
    discountPercent: 10,
    brand: "DemoBrand",
    title: "Third Product Example",
    rating: 3.8,
    originalPrice: 100,
    discountedPrice: 75,
  },
  {
    id: 4,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Random Product Name dsf frdys trwyr",
    rating: 4.2,
    originalPrice: 120,
    discountedPrice: 90,
  },
  {
    id: 5,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Another Productggggggggggggggggggggggggggggggggggggggh Name",
    rating: 4.5,
    originalPrice: 150,
    discountedPrice: 110,
  },
  {
    id: 6,
    imageUrl: dumy,
    discountPercent: 10,
    brand: "DemoBrand",
    title: "Third Product Example",
    rating: 3.8,
    originalPrice: 100,
    discountedPrice: 75,
  },
];

function getProductById(id) {
  return allProducts.find((p) => p.id === id);
}

function StarRating({ rating }) {
  // Show 5 stars, filled or empty
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
    } else if (rating > i - 1 && rating < i) {
      // half star logic (optional, here just show full or empty)
      stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300 inline" />);
    }
  }
  return <span className="flex items-center gap-0.5">{stars}</span>;
}

function MyList({ mylist }) {
  let { wishlistcount, setwishlistcount, wishlist, setWishlist } = mylist;

  // Get product details for wishlisted ids
  const wishlistedProducts = wishlist
    .map((id) => getProductById(id))
    .filter(Boolean);

  const handleRemove = (id) => {
    setWishlist(wishlist.filter((item) => item !== id));
    setwishlistcount(wishlistcount > 0 ? wishlistcount - 1 : 0);
    notify("warning","Item Removed from Wishlist")
  };
  const tableContainerStyle = {
    border: '1px solid #e5e7eb', // Tailwind gray-200
    backgroundColor: '#f3f4f6', // Tailwind gray-100
    ...(allProducts.length > 4
      ? { maxHeight: '50vh', overflowY: 'auto', display: 'block' }
      : {})
  };

  return (
    <div className='mx-5 my-8 #f5f0f0'>
        <div className="w-full max-w-2xl mx-auto bg-white p-3 rounded">
        <h2 className="text-2xl font-bold mb-4 text-pink-600 text-center">My Wishlist ({wishlistcount})</h2>
        {wishlistedProducts.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No products in your wishlist.</div>
        ) : (
          <div className="flex flex-col gap-3" style={tableContainerStyle}>
            {wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center bg-white rounded-lg shadow-sm px-3 py-2 gap-3 border border-gray-100 hover:shadow-md transition-all"
              >
                {/* Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-[5rem] w-full flex rounded"
                    />
                  </div>
                </Link>
                {/* Middle: Title, Rating, Price, Remove from wishlist */}
                <div className="flex-1 flex flex-col min-w-0 relative">
                  {/* Remove from wishlist - Heart icon in the middle, top right */}
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gray-200 rounded-full p-1 mt-2 mr-2 shadow-sm flex items-center justify-center">
                      <Tooltip title="Remove from wishlist" arrow>
                        <IconButton
                          onClick={() => handleRemove(product.id)}
                          color="error"
                          size="small"
                          className="!p-1"
                          style={{ background: 'transparent' }}
                        >
                          <FaHeart className="text-pink-500" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                  {/* Title */}
                  <div className="font-semibold text-gray-900 text-base truncate pr-[4rem]" title={product.title}>
                    {product.title}
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-gray-500 ml-1">{product.rating.toFixed(1)}</span>
                  </div>
                  {/* Prices and Discount */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-pink-600">
                      ₹{product.discountedPrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    {product.discountPercent > 0 && (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyList;