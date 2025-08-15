import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import './FirstSlider.css';

import { Pagination, Autoplay } from 'swiper/modules';

import s1 from '../../assets/default/sample-1.jpg';
import s2 from '../../assets/default/sample-2.jpg';
import r1 from '../../assets/default/right1.jpg';
import r2 from '../../assets/default/right2.jpg';

// Import Material UI Button
import Button from '@mui/material/Button';

function FirstSlider() {
  const slides = [
    {
      src: s1,
      alt: 'iPhone 13',
      title: 'Apple iPhone 13 128 GB, Pink',
      subtitle: 'Big saving days sale',
      price: '₹35,500.00',
    },
    {
      src: s2,
      alt: 'Women Top',
      title: 'Buy New Trend Women Black Cotton Blend Top | top for women | women top...',
      subtitle: 'Big saving days sale',
      price: '₹1,550.00',
    },
  ];

  // Data for the right column (two images, column-wise, with text)
  const rightColumn = [
    {
      src: r1,
      alt: "Men's Footwear",
      title: "Buy Men's Footwear with low price",
      price: "₹1500",
      buttonText: "SHOP NOW",
    },
    {
      src: r2,
      alt: "Apple iPhone",
      title: "Buy Apple Iphone",
      price: "₹45000",
      buttonText: "SHOP NOW",
    },
  ];

  return (
    <div className="bg-white py-2 px-2 flex flex-wrap justify-center items-start">
      <Swiper
        pagination={{ dynamicBullets: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        modules={[Pagination, Autoplay]}
        className="mySwiper1 rounded-xl overflow-hidden"
        style={{ backgroundColor: 'white' }} // Set Swiper background to white
      >
        {slides.map((slide, idx) => (
          <SwiperSlide
            key={idx}
            style={{ backgroundColor: 'white' }} // Set SwiperSlide background to white
          >
            <div className="relative w-full">
              {/* Background Image */}
              <img
                src={slide.src}
                alt={slide.alt}
                className="first-slider-img"
              />

              {/* Overlay Content */}
              <div className="first-slider-content w-[50%] flex justify-end items-center">
                <div className="first-slider-content-bg">
                  <p className="text-pink-600 font-semibold mb-1">{slide.subtitle}</p>
                  <h2 className="font-bold text-gray-900 mb-2">{slide.title}</h2>
                  <p className="text-gray-700 lg:mb-4">
                    Starting At Only <span className="text-pink-600 font-bold">{slide.price}</span>
                  </p>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      backgroundColor: '#ec4899',
                      '&:hover': { backgroundColor: 'black' },
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: 2,
                      fontSize: { xs: '0.7rem', sm: '0.95rem' },
                      textTransform: 'none',
                    }}
                  >
                    SHOP NOW
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="pt-4 lg:pt-5  flex flex-row lg:flex-col justify-between  w-[95%] lg:w-[35%] gap-2 overflow-scroll">
        {rightColumn.map((item, idx) => (
          <div
            key={idx}
            className="relative bg-white rounded-xl"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-[100vw] h-[155px] object-cover rounded-lg "
            />
            {/* Overlay text on image */}
            <div
              className={`absolute top-0 ${idx === 0 ? "right-0" : "left-0"} w-[50%] h-full flex flex-col justify-center items-center px-2`}
              style={{
                borderRadius: '0.75rem',
                pointerEvents: 'none', // so only button is clickable
              }}
            >
              <div className="text-black text-center font-bold text-[0.6rem] md:text-[1.2rem] mb-1" style={{ pointerEvents: 'auto' }}>
                {item.title}
              </div>
              <div className="text-pink-600  text-sm font-bold mb-1 text-[0.6rem] lg:text-[1rem]" style={{ pointerEvents: 'auto' }}>
                {item.price}
              </div>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: '#ec4899',
                  '&:hover': { backgroundColor: 'black' },
                  textTransform: 'none',
                  pointerEvents: 'auto',
                  fontSize: { xs: '0.4rem', sm: '0.8rem' },
                  padding: { xs: '0.2rem 0.5rem', sm: '0.45rem 1.1rem' },
                  borderRadius: '5px',
                  minWidth: 0,
                }}
              >
                {item.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FirstSlider;
