import React,{useContext} from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FaStar, FaRegStar, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toggleWishlist } from '../../components/HandleWishlistandCartlist';
import getImageUrl from '../../components/getImageUrl';
import { GlobalContext } from "../../components/UserContext/UserContext";


// Star rating component
function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
    } else if (rating > i - 1 && rating < i) {
      stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300 inline" />);
    }
  }
  return <span className="flex items-center gap-0.5">{stars}</span>;
}

function MyList({ mylist,auth }) {
  let { wishlist, setWishlist } = mylist;
  const { setCurrent } = useContext(GlobalContext);

  // wishlist is now an array of product objects
  const wishlistedProducts = Array.isArray(wishlist) ? wishlist : [];


  const tableContainerStyle = {
    border: '1px solid #e5e7eb', // Tailwind gray-200
    backgroundColor: '#f3f4f6', // Tailwind gray-100
    ...(wishlistedProducts.length > 4
      ? { maxHeight: '50vh', overflowY: 'auto', display: 'block' }
      : {})
  };

  return (
    <div className='mx-5 my-8 #f5f0f0'>
      <div className="w-full max-w-2xl mx-auto bg-white p-3 rounded">
        <h2 className="text-2xl font-bold mb-4 text-pink-600 text-center">My Wishlist</h2>
        {wishlistedProducts.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No products in your wishlist.</div>
        ) : (
          <div className="flex flex-col gap-3" style={tableContainerStyle}>
            {wishlistedProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center bg-white rounded-lg shadow-sm px-3 py-2 gap-3 border border-gray-100 hover:shadow-md transition-all"
              >
                {/* Image */}
                <Link to={`/product/${product._id}`}>
                  <div
                    className="flex-shrink-0 rounded overflow-hidden bg-gray-100"
                    onClick={() => setCurrent(product)}
                  >
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? getImageUrl(product.images[0])
                          : 'https://via.placeholder.com/80x80?text=No+Image'
                      }
                      alt={product.title}
                      className="h-[5rem] w-full flex rounded object-cover"
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
                          onClick={() => toggleWishlist(wishlist, setWishlist, product,auth._id)}
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
                    <StarRating rating={product.rating || 0} />
                    <span className="text-xs text-gray-500 ml-1">{(product.rating || 0).toFixed(1)}</span>
                  </div>
                  {/* Prices and Discount */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-pink-600">
                      ₹{product.discountPrice}
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