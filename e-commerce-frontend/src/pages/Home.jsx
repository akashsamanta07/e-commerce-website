import React from 'react'
import Slider from '../components/slider/Slider.jsx';
import CategoryNavBar from '../components/menu/CategoryNavBar.jsx';
import FreeShippingBanner from '../components/default/FreeShippingBanner.jsx';
import FirstSlider from '../components/ad/FirstSlider.jsx';
import Popular_products from '../components/Popular_products.jsx';
import Latest_products from '../components/Latest_products.jsx';
import StaticAdd from '../components/ad/StaticAdd.jsx';
import DefaultProduct from '../components/DefaultProduct.jsx';

function Home({ product }) {
  let { categories, selectedProduct } = product;

  return (
    <div className="flex flex-col min-h-screen">
      <Slider />
      <CategoryNavBar />
      <Popular_products product={product} />
      <FirstSlider />
      <FreeShippingBanner />
      <Latest_products product={product} />
      <StaticAdd />
      {
        categories && categories.length > 0 && categories.map((cat, idx) => {
          // cat can be string or object with .name
          const catName =  cat.name;
          // Filter selectedProduct by category
          const filteredProducts = selectedProduct.filter(
            (p) =>
              p.category &&
              (
                (p.category === catName)
              )
          );
          // Pass filtered products and category name to DefaultProduct
          return (
            <DefaultProduct
              key={catName || idx}
              product={{ ...product, filteredProducts: filteredProducts }}
              name={catName}
              category={catName}
            />
          );
        })
      }
    </div>
  )
}

export default Home;