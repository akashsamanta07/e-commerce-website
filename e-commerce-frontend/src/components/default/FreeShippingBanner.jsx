import { FaTruck } from 'react-icons/fa';

const FreeShippingBanner = () => {
  return (
    <div className='bg-white px-4'>
      <div className="border border-red-400 rounded-lg px-3 py-2 sm:px-6 sm:py-3 flex flex-col sm:flex-row items-center sm:justify-between text-gray-800 bg-gradient-to-r from-pink-50 via-white to-pink-50 shadow-md max-w-5xl mx-auto my-4 gap-2 sm:gap-0
      lg:w-4/5 lg:px-10 lg:py-5">
      {/* Left section - Icon and Label */}
      <div className="flex items-center space-x-2 mb-1 sm:mb-0">
        <span className="bg-red-100 p-2 rounded-full flex items-center justify-center">
          <FaTruck className="text-xl text-red-500" />
        </span>
        <span className="font-bold text-base sm:text-lg tracking-wide text-red-600">FREE SHIPPING</span>
      </div>

      {/* Center section - Description */}
      <div className="text-xs sm:text-sm text-gray-700 text-center px-2 flex-1">
        Free Delivery Now On Your First Order and over{' '}
        <span className="text-gray-900 font-semibold">$200</span>
      </div>

      {/* Right section - Highlight */}
      <div className="font-extrabold text-base sm:text-lg text-pink-600 mt-1 sm:mt-0 whitespace-nowrap">
        - Only $200*
      </div>
    </div>
    </div>
  );
};

export default FreeShippingBanner;
