import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Header1 from "./components/Header/Header1.jsx";
import Header2 from "./components/Header/Header2.jsx";
import Footer from "./components/footer/Footer.jsx";
import Login from './auth/Login.jsx';
import Home from "./Pages/Home.jsx";
import ChangeProfile from "./auth/ChangeProfile.jsx";
import { ToastContainer } from 'react-toastify';
import MyOrder from "./Pages/User/MyOrder.jsx";
import ManageLogo from "./Pages/User/ManageLogo.jsx";
import Banner from "./Pages/User/Banner.jsx";
import Category from "./Pages/User/Category.jsx";
import HomeSlider from "./Pages/HomeSlider.jsx";
import Products from "./Pages/Products.jsx";
import Dashbroad from "./Pages/Dashbroad.jsx";
import ForgetPassword from "./auth/ForgetPassword.jsx";


function NotFound() {
  // "ang error" - show error message
  return <div className="text-red-500 text-center mt-10 text-xl font-bold">Error: 404 - Page Not Found</div>;
}

function App() {
  const [data,setData]=useState({logo:true});
  let obj={
    data,
    setData
  }
  return (
    <div className="App">
      <ToastContainer/>
      <Router>
      <Header1 obj={obj}/>
      <Header2 obj={obj}/>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgetPassword/>} />
          <Route path="/admin/dashboard" element={<Home><Dashbroad/></Home>} />
          <Route path="/admin/slider" element={<Home><HomeSlider/></Home>} />
          <Route path="/admin/category" element={<Home><Category/></Home>} />
          <Route path="/admin/products" element={<Home><Products/></Home>} />
          <Route path="/admin/orders" element={<Home><MyOrder/></Home>} />
          <Route path="/admin/banner" element={<Home><Banner/></Home>} />
          <Route path="/admin/logo" element={<Home><ManageLogo obj={obj}/></Home>} />
          <Route path="/admin/profile" element={<Home><ChangeProfile/></Home>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <div className="w-full">
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
