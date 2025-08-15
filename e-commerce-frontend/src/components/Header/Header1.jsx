import React from 'react'

function Header1() {
  return (
   <div className='border-b border-gray-200 bg-white'>
     <div className="Container text-gray-800 text-sm py-3 flex flex-col md:flex-row items-center justify-between">
      <span className="font-semibold text-center md:text-left">
        Get up to <span className="text-pink-500">50% off</span> new season styles, limited time only
      </span>
      <div className="flex gap-4 mt-2 md:mt-0">
        <a href="#" className="hover:underline">Help Center</a>
        <a href="#" className="hover:underline">Order Tracking</a>
      </div>
    </div>
   </div>
  )
}

export default Header1;