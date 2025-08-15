import React from 'react'
import Slider from '../components/slider/Slider.jsx';
import CategoryNavBar from '../components/menu/CategoryNavBar.jsx';
import FreeShippingBanner from '../components/default/FreeShippingBanner.jsx';
import FirstSlider from '../components/ad/FirstSlider.jsx';
import Popular_products from '../components/Popular_products.jsx';
import Latest_products from '../components/Latest_products.jsx';
import StaticAdd from '../components/ad/StaticAdd.jsx';
import DefaultProduct from '../components/DefaultProduct.jsx';

const categoryItems = [
  'Fashion',
  'Electronics',
  'Bags',
  'Footwear',
  'Groceries',
  'Beauty',
  'Wellness',
  'Jewellery',
];

function Home({product}) {

  return (
    <div className="flex flex-col min-h-screen">
      <Slider />
      <CategoryNavBar />
      <Popular_products product={product}/>
      <FirstSlider />
      <FreeShippingBanner />
      <Latest_products product={product}/>
      <StaticAdd/>
      {
        categoryItems.map((item, index) => (
          <DefaultProduct product={product} name={item} key={index} />
        ))
      }
    </div>
  )
}

export default Home;