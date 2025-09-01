import React, { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import getImageUrl from '../getImageUrl.js';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import './style.css';

// import required modules
import { Navigation, Autoplay } from 'swiper/modules';
import API_BASE from '../../utils/API_BASE';


function Slider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch slider images from backend
    async function fetchSlides() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/admin/get-home-sliders`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setSlides(data.data);
        } else {
          setSlides([]);
        }
      } catch (err) {
        setSlides([]);
      }
      setLoading(false);
    }
    fetchSlides();
  }, []);

  return (
    <>
      <Swiper
        navigation={true}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        className="mySwiper"
      >
        {loading ? (
          // Optionally show a loading placeholder
          <SwiperSlide>
            <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Loading...
            </div>
          </SwiperSlide>
        ) : slides.length > 0 ? (
          slides.map((slide) => (
            <SwiperSlide key={slide._id}>
              <img src={getImageUrl(slide.image)} alt="" style={{ width: '100%', objectFit: 'cover' }} />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              No slides found.
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </>
  );
}

export default Slider;