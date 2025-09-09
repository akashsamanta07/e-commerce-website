import React, { useContext } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaShoppingCart } from 'react-icons/fa';
import { GlobalContext } from '../UserContext/UserContext.jsx'
import { Link } from 'react-router-dom';
import getImageUrl from '../getImageUrl.js';
import {
  removeFromCart,
  incrementCartQuantity,
  decrementCartQuantity
 
} from '../HandleWishlistandCartlist.jsx';

// Use product schema keys: title, brand, description, category, subcategory, originalPrice, discountPrice, inStock, rating, images, sales, reviewlist, _id
function Card({ header2, onClose,auth }) {
  const { cartlist, setCartlist } = header2;
  const { total, setTotal,setCurrent } = useContext(GlobalContext);

  // cartlist is the array of cart items, each with keys: _id, title, brand, images, discountPrice, quantity, etc.
  const cartItems = cartlist || [];

  // Calculate subtotal, delivery fee, taxes, and set total
  const subtotal = cartItems.reduce(
    (sum, item) => sum + ((item.discountPrice || 0) * (item.quantity || 1)),
    0
  );
  const deliveryFee = cartItems.length > 0 && subtotal <= 1000 && subtotal > 0 ? 80 : 0;
  const taxes = cartItems.length > 0 ? 11.49 : 0;

  React.useEffect(() => {
    setTotal(cartItems.length > 0 ? Math.round(subtotal + deliveryFee + taxes) : 0);
    // eslint-disable-next-line
  }, [subtotal, deliveryFee, taxes, cartItems.length]);

  // Handlers
  const handleRemoveOne = (prodId) => {
    decrementCartQuantity(cartlist,setCartlist,prodId,auth._id);
  };

  const handleAddOne = (prodId) => {
    incrementCartQuantity(cartlist,setCartlist,prodId,auth._id);
  };

  const handleDeleteAll = (prodId) => {
    removeFromCart(cartlist,setCartlist,prodId,auth._id);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow px-4 pb-4">
      <div>
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60">
            <FaShoppingCart className="text-gray-300" style={{ fontSize: '72px' }} />
            <p className="text-gray-700 mt-4 mb-4 text-lg font-semibold">Your cart is empty.</p>
            <button
              onClick={onClose}
              className="bg-pink-600 hover:bg-black text-white font-bold py-2 px-6 rounded transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className={`w-full ${cartItems.length > 3 ? "h-[50vh]" : ""} flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden`}>
            {cartItems.map((item) => (
              <div key={item._id} className="w-full flex flex-row items-center justify-center border-b py-3 gap-3 lg:gap-4">
                <Link to={`/product/${item._id}`}>
                  <div className="h-[5rem]  lg:h-[6rem] flex-shrink-0 flex items-center justify-center overflow-hidden rounded"
                  onClick={() => {setCurrent(item);onClose();}}
                  >
                    <img
                      src={item.images && item.images.length > 0 ? getImageUrl(item.images[0]) : ""}
                      alt={item.title}
                      className="h-[5rem] lg:h-[6rem] w-full flex rounded-lg"
                    />
                  </div>
                </Link>
                <div className="w-[7rem] lg:w-[8rem] flex flex-col items-center justify-center">
                  <div
                    className="w-[7rem] lg:w-[8rem] font-semibold leading-tight overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-500">{item.brand}</div>
                  <div className="mt-[3px] w-[6rem] lg:w-[7rem] flex justify-center items-center border-[3px] border-pink-600 rounded-xl font-semibold text-pink-600 overflow-hidden">
                    <button
                      type="button"
                      className=" w-[33%] py-1 text-center  bg-pink-100  transition"
                      onClick={() => handleRemoveOne(item._id)}
                      aria-label="Decrease quantity"
                    >-</button>
                    <span className="w-[33%] text-center rounded">{item.quantity}</span>
                    <button
                      type="button"
                      className="w-[33%] py-1 text-center bg-pink-100  transition"
                      onClick={() => handleAddOne(item._id)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <span className="text-pink-600 font-bold">₹{item.discountPrice}/-</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteAll(item._id)}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {cartItems.length > 0 && (
        <>
          <div className="my-4 border-t" />
          <div className="space-y-2 mb-4">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span className="text-pink-600">₹{subtotal}/-</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Delivery Fee</span>
              <span className="text-pink-600">₹{deliveryFee}/-</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Taxes</span>
              <span className="text-pink-600">₹{taxes}/-</span>
            </div>
          </div>
          <div className="border-t mb-4" />
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Totals</span>
            <span className="text-pink-700">₹{total}/-</span>
          </div>
          <Link to='/checkout'>
            <button
              className={`w-full py-3 rounded-lg font-bold text-white transition ${
                cartItems.length > 0
                  ? "bg-pink-600 hover:bg-black"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={onClose}
              disabled={cartItems.length === 0}
            >
              Checkout
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Card;