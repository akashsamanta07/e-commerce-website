import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import { ToastContainer } from 'react-toastify';
import Header1 from './components/Header/Header1.jsx';
import Header2 from './components/Header/Header2.jsx';
import Header3 from './components/Header/Header3.jsx';
import Footer from "./components/footer/Footer.jsx";
import FixedBar from "./components/footer/FixedBar.jsx";
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Description from './pages/Description.jsx';
import AllProducts from './pages/AllProducts.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ForgetPassword from './auth/ForgetPassword.jsx'
import Checkout from './pages/user/Checkout.jsx';
import Account from './pages/user/Account.jsx';

import PageNotFound from './pages/PageNotFound.jsx';
import ChangeProfile from './pages/user/ChangeProfile.jsx';
import Address from './pages/user/Address.jsx';
import ChangePassword from './auth/ChangePassword.jsx';
import MyList from './pages/user/MyList.jsx';
import MyOrder from './pages/user/MyOrder.jsx';

function App() {
  // No issues found in the code.
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState('');
  const [wishlistcount, setwishlistcount] = useState(3);
  const [wishlist, setWishlist] = useState([1,2,3,4,5,6]);
  const [cardlist, setcardlist] = useState([{}]);
  const [menu, setmenu] = useState("Home");
  const [subcategory, setsubcategory] = useState('');
  const [is,setis] = useState(0);

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
    setcardlist,
    setis
  };
  const header3 = {
    menu,
    setmenu,
    subcategory,
    setsubcategory,
    search,
    setSearch,
    is
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

  const mylist={
    wishlistcount,
    setwishlistcount,
    wishlist,
    setWishlist
  }

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
          <Route path="/menu/:category" element={<AllProducts product={product} />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/my-account" element={<Account/>} />
          <Route path="/change-profile" element={<ChangeProfile/>} />
          <Route path="/address" element={<Address/>} />
          <Route path="/change-password" element={<ChangePassword/>} />
          <Route path="/my-list" element={<MyList mylist={mylist}/>} />
          <Route path="/my-order" element={<MyOrder/>} />

          <Route path="*" element={<PageNotFound/>} />
        </Routes>
        <div>
          <FixedBar setis={setis}/>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
