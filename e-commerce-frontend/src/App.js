import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import { ToastContainer } from 'react-toastify';
import Header1 from './components/Header/Header1.jsx';
import Header2 from './components/Header/Header2.jsx';
import Header3 from './components/Header/Header3.jsx';
import Footer from "./components/footer/Footer.jsx";
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Description from './pages/Description.jsx';
import AllProducts from './pages/AllProducts.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState('');
  const [wishlistcount, setwishlistcount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [cardlist, setcardlist] = useState([{}]);
  const [menu, setmenu] = useState("Home");
  const [subcategory, setsubcategory] = useState('');

  const header2 = {
    cartCount,
    setCartCount,
    search,
    setSearch,
    wishlistcount,
    setwishlistcount,
    setmenu,
    setsubcategory,
    cardlist,
    setcardlist
  };
  const header3 = {
    menu,
    setmenu,
    subcategory,
    setsubcategory
  };
  const product = {
    wishlistcount,
    setwishlistcount,
    cartCount,
    setCartCount,
    wishlist,
    setWishlist,
    cardlist,
    setcardlist
  };
  const desc = {
    wishlistcount,
    setwishlistcount,
    cartCount,
    setCartCount,
    wishlist,
    setWishlist,
    cardlist,
    setcardlist
  };

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <ScrollToTop />
        <div className="hidden md:block">
          <Header1 />
        </div>
        <Header2 header2={header2} />
        <Header3 header3={header3} />
        <Routes>
          <Route path="/" element={<Home product={product} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<Description desc={desc} />} />
          <Route path="/:category" element={<AllProducts product={product} />} />
        </Routes>
        <div className="w-full">
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
