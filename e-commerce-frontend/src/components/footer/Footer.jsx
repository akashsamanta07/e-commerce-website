// Footer.jsx
import React from 'react';
import { Checkbox, Button, TextField, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import {
  FaShippingFast,
  FaGift,
  FaHeadphones,
} from 'react-icons/fa';
import { MdOutlinePayment, MdKeyboardReturn } from 'react-icons/md';
import { FiMessageSquare } from 'react-icons/fi';
import paypal from '../../assets/footer/paypal.png';
import visa from '../../assets/footer/visa.png';
import mastercard from '../../assets/footer/mastercard.png';
import amex from '../../assets/footer/amex.png';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-100 to-gray-50 text-gray-800 text-sm">
      {/* Top Perks Section */}
      <div className="flex flex-wrap justify-center md:justify-between items-center text-center px-2 sm:px-3 md:px-6 py-4 sm:py-6 md:py-8 border-b gap-y-4 sm:gap-y-6">
        <div className="flex flex-col items-center w-1/2 sm:w-1/3 md:w-1/6 mb-0 px-1">
          <div className="bg-white shadow-md rounded-full p-2 sm:p-3 mb-1 sm:mb-2">
            <FaShippingFast className="text-xl sm:text-2xl text-pink-500" />
          </div>
          <p className="font-semibold text-xs sm:text-sm">Free Shipping</p>
          <p className="text-xs text-gray-500">For all Orders Over $100</p>
        </div>
        <div className="flex flex-col items-center w-1/2 sm:w-1/3 md:w-1/6 mb-0 px-1">
          <div className="bg-white shadow-md rounded-full p-2 sm:p-3 mb-1 sm:mb-2">
            <MdKeyboardReturn className="text-xl sm:text-2xl text-pink-500" />
          </div>
          <p className="font-semibold text-xs sm:text-sm">30 Days Returns</p>
          <p className="text-xs text-gray-500">For an Exchange Product</p>
        </div>
        <div className="flex flex-col items-center w-1/2 sm:w-1/3 md:w-1/6 mb-0 px-1">
          <div className="bg-white shadow-md rounded-full p-2 sm:p-3 mb-1 sm:mb-2">
            <MdOutlinePayment className="text-xl sm:text-2xl text-pink-500" />
          </div>
          <p className="font-semibold text-xs sm:text-sm">Secured Payment</p>
          <p className="text-xs text-gray-500">Payment Cards Accepted</p>
        </div>
        <div className="flex flex-col items-center w-1/2 sm:w-1/3 md:w-1/6 mb-0 px-1">
          <div className="bg-white shadow-md rounded-full p-2 sm:p-3 mb-1 sm:mb-2">
            <FaGift className="text-xl sm:text-2xl text-pink-500" />
          </div>
          <p className="font-semibold text-xs sm:text-sm">Special Gifts</p>
          <p className="text-xs text-gray-500">Our First Product Order</p>
        </div>
        <div className="flex flex-col items-center w-full sm:w-1/3 md:w-1/6 px-1">
          <div className="bg-white shadow-md rounded-full p-2 sm:p-3 mb-1 sm:mb-2">
            <FaHeadphones className="text-xl sm:text-2xl text-pink-500" />
          </div>
          <p className="font-semibold text-xs sm:text-sm">Support 24/7</p>
          <p className="text-xs text-gray-500">Contact us Anytime</p>
        </div>
      </div>

      {/* Middle Footer */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 sm:gap-8 px-2 sm:px-3 md:px-6 py-6 sm:py-8 md:py-10 text-sm
        text-center sm:text-left
      ">
        {/* Contact */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h4 className="font-semibold text-base mb-2 sm:mb-3 text-pink-600">Contact us</h4>
          <p className="text-xs sm:text-sm">Classyshop - Mega Super Store</p>
          <p className="text-xs sm:text-sm">507-Union Trade Centre France</p>
          <p className="my-1 sm:my-2 text-xs sm:text-sm">sales@yourcompany.com</p>
          <p className="text-red-500 font-bold text-base sm:text-lg mb-1 sm:mb-2">(+91) 9876-543-210</p>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 justify-center sm:justify-start w-full">
            <FiMessageSquare className="text-red-500 text-lg sm:text-xl" />
            <span>
              Online Chat
              <br className="hidden sm:block" />
              <span className="hidden sm:inline">Get Expert Help</span>
              <span className="sm:hidden">Get Help</span>
            </span>
          </div>
        </div>

        {/* Products */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h4 className="font-semibold text-base mb-2 sm:mb-3 text-pink-600">Products</h4>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">Prices drop</a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">New products</a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">Best sales</a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">Contact us</a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">Sitemap</a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">Stores</a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h4 className="font-semibold text-base mb-2 sm:mb-3 text-pink-600">Our company</h4>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">Delivery</a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">Legal Notice</a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">Terms and conditions of use</a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">About us</a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">Secure payment</a>
            </li>
            <li>
              <a href="#" className="hover:text-pink-500 transition text-xs sm:text-sm">Login</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h4 className="font-semibold text-base mb-2 sm:mb-3 text-pink-600">Subscribe to newsletter</h4>
          <p className="mb-2 sm:mb-4 text-gray-600 text-xs sm:text-sm">
            Subscribe to our latest newsletter to get news about special discounts.
          </p>
          <div className="w-full flex flex-col items-center sm:items-stretch">
            <TextField
              label="Your Email Address"
              variant="outlined"
              fullWidth
              size="small"
              className="!mb-3 sm:mb-3 bg-white rounded"
              InputProps={{
                style: { background: 'white', borderRadius: 6, fontSize: '0.85rem' },
              }}
            />
            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                letterSpacing: 1,
                py: 1,
                fontSize: '0.85rem',
                marginBottom: 0.5,
              }}
              className="!mb-2 sm:mb-0"
              startIcon={<FacebookIcon />} // Example: you can change to any Material icon
            >
              SUBSCRIBE
            </Button>
          </div>
          <div className="flex items-center mt-1 sm:mt-2 justify-center sm:justify-start w-full">
            <Checkbox size="small" />
            <span className="text-xs text-gray-500">
              I agree to the terms and conditions and the privacy policy
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center px-2 sm:px-3 md:px-6 py-3 sm:py-4 border-t text-xs gap-y-3 sm:gap-y-4 text-center md:text-left">
        {/* Social Icons */}
        <div className="flex space-x-2 sm:space-x-3 mb-0 justify-center md:justify-start w-full md:w-auto">
          <IconButton
            component="a"
            href="https://facebook.com/ram.samanta.54772"
            className="bg-white shadow p-1.5 sm:p-2 rounded-full hover:bg-pink-100 hover:text-pink-600 transition"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            size="large"
          >
            <FacebookIcon className="text-base sm:text-lg" />
          </IconButton>
          <IconButton
            component="a"
            href="https://www.instagram.com/akashsamanta07"
            className="bg-white shadow p-1.5 sm:p-2 rounded-full hover:bg-pink-100 hover:text-pink-600 transition"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            size="large"
          >
            <InstagramIcon className="text-base sm:text-lg" />
          </IconButton>
          <IconButton
            component="a"
            href="https://github.com/akashsamanta07"
            className="bg-white shadow p-1.5 sm:p-2 rounded-full hover:bg-pink-100 hover:text-pink-600 transition"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            size="large"
          >
            <GitHubIcon className="text-base sm:text-lg" />
          </IconButton>
          <IconButton
            component="a"
            href="https://www.linkedin.com/in/akashsamanta007/"
            className="bg-white shadow p-1.5 sm:p-2 rounded-full hover:bg-pink-100 hover:text-pink-600 transition"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            size="large"
          >
            <LinkedInIcon className="text-base sm:text-lg" />
          </IconButton>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs sm:text-sm w-full md:w-auto">
          © 2025 - Ecommerce Template
        </div>

        {/* Payment Icons */}
        <div className="flex space-x-1 sm:space-x-2 items-center justify-center md:justify-end w-full md:w-auto">
          <img src={visa} alt="Visa" className="h-5 sm:h-7 w-auto object-contain rounded shadow-sm bg-white p-0.5 sm:p-1" />
          <img src={mastercard} alt="MasterCard" className="h-5 sm:h-7 w-auto object-contain rounded shadow-sm bg-white p-0.5 sm:p-1" />
          <img src={amex} alt="Amex" className="h-5 sm:h-7 w-auto object-contain rounded shadow-sm bg-white p-0.5 sm:p-1" />
          <img src={paypal} alt="PayPal" className="h-5 sm:h-7 w-auto object-contain rounded shadow-sm bg-white p-0.5 sm:p-1" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
