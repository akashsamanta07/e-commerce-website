import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import './style.css';

// import required modules
import { Navigation, Autoplay } from 'swiper/modules';
import s0 from '../../assets/slider/s0.png';
import s1 from '../../assets/slider/s1.jpg';
import s2 from '../../assets/slider/s2.jpg';
import s3 from '../../assets/slider/s3.jpg';
import s4 from '../../assets/slider/s4.jpg';

function Slider() {
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
            <SwiperSlide><img src={s1} alt="" /></SwiperSlide>
            <SwiperSlide><img src={s2} alt="" /></SwiperSlide>
            <SwiperSlide><img src={s0} alt="" /></SwiperSlide>
            <SwiperSlide><img src={s3} alt="" /></SwiperSlide>
            <SwiperSlide><img src={s4} alt="" /></SwiperSlide>
          </Swiper>
        </>
      );
}

export default Slider;