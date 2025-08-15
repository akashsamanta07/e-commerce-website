import React, { useMemo } from 'react';
import dumy from '../../assets/dumy.jpg';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaShoppingCart } from 'react-icons/fa';

const products = [
  {
    id: 1,
    imageUrl: dumy,
    discountPercent: 25,
    brand: "DemoBrand",
    title: "Rand oiuui uil ug uttuyut ty6yr ytri",
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
    title: "Another Product Name",
    rating: 4.5,
    originalPrice: 150,
    discountedPrice: 110,
  }
];

function Card({ header2, onClose }) {
  const { cartCount, setCartCount, cardlist, setcardlist } = header2;

  // Get cart items with product details
  const cartItems = useMemo(() => {
    return cardlist
      .map(({ id, quantity }) => {
        const prod = products.find(p => p.id === Number(id));
        return prod ? { ...prod, quantity } : null;
      })
      .filter(Boolean);
  }, [cardlist]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 && subtotal <= 1000 && subtotal > 0 ? 80 : 0;
  const taxes = cartItems.length > 0 ? 11.49 : 0;
  const total = cartItems.length > 0 ? Math.round(subtotal + deliveryFee + taxes) : 0;

  // Handlers
  const handleRemoveOne = (id) => {
    const newList = cardlist
      .map(item => {
        if (item.id === id) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          // If quantity is 1, remove the item
          return null;
        }
        return item;
      })
      .filter(Boolean);
    setcardlist(newList);
    // Update cart count
    const removedItem = cardlist.find(item => item.id === id);
    if (removedItem && removedItem.quantity === 1) {
      setCartCount(cartCount > 0 ? cartCount - 1 : 0);
    }
  };

  const handleAddOne = (id) => {
    const newList = cardlist.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setcardlist(newList);
  };

  const handleDeleteAll = (id) => {
    setcardlist(cardlist.filter(item => item.id !== id));
    setCartCount(cartCount > 0 ? cartCount - 1 : 0);
  };

  const handlePlaceOrder = () => {
    if (cartItems.length > 0) {
      setcardlist([]);
      setCartCount(0);
    }
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
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="w-full h-[30vh] flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden">
            {cartItems.map((item) => (
              <div key={item.id} className="w-full flex flex-row items-center justify-center border-b py-3 gap-3 lg:gap-4">
                <div className="w-[5rem] h-[5rem] lg:w-[6rem] lg:h-[6rem] flex-shrink-0 flex items-center justify-center overflow-hidden rounded">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-[5rem] w-full flex rounded-lg"
                  />
                </div>
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
                      onClick={() => handleRemoveOne(item.id)}
                      aria-label="Decrease quantity"
                    >-</button>
                    <span className="w-[33%] text-center rounded">{item.quantity}</span>
                    <button
                      type="button"
                      className="w-[33%] py-1 text-center bg-pink-100  transition"
                      onClick={() => handleAddOne(item.id)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <span className="text-pink-600 font-bold">₹{item.discountedPrice}/-</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteAll(item.id)}
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
          <button
            className={`w-full py-3 rounded-lg font-bold text-white transition ${
              cartItems.length > 0
                ? "bg-pink-600 hover:bg-pink-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Card;