import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Header1 from "./components/Header/Header1.jsx";
import Header2 from "./components/Header/Header2.jsx";
import Footer from "./components/footer/Footer.jsx";
import Login from './auth/Login.jsx';
import Home from "./Pages/Home.jsx";
import ChangeProfile from "./auth/ChangeProfile.jsx";
import ChangePassword from "./auth/ChangePassword.jsx"; // <-- Add import for ChangePassword
import { ToastContainer } from 'react-toastify';
import MyOrder from "./Pages/User/MyOrder.jsx";
import ManageLogo from "./Pages/User/ManageLogo.jsx";
import Banner from "./Pages/User/Banner.jsx";
import Category from "./Pages/User/Category.jsx";
import HomeSlider from "./Pages/HomeSlider.jsx";
import Products from "./Pages/Products.jsx";
import Dashbroad from "./Pages/Dashbroad.jsx";
import ForgetPassword from "./auth/ForgetPassword.jsx";
import PageNotFound from "./Pages/PageNotFound.jsx";
import Logout from "./auth/Logout.jsx";
import API_BASE from "./utils/API_BASE";

function ProtectedRoute({ auth, children }) {
  // auth is an object; if it has any keys, user is authenticated
  const isAuthenticated = auth && Object.keys(auth).length > 0;
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

function App() {
  const [data, setData] = useState({ logo: true,update:true });
  const [auth, setAuth] = useState({});
  const [loading,setloading] = useState(false); // Track if auth check is done

  let obj = {
    data,
    setData
  };

  // Ensure routing only happens after auth check is complete
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const result = await res.json();
        if (!res.ok || result.userData == null) {
          setAuth({});
        } else {
          setAuth(result.userData);
        }
      } catch (err) {
        setAuth({});
      } finally {
        setloading(true);
      }
    };
    checkAuth();
    // eslint-disable-next-line
  }, [data]);

  // User is authenticated if auth has any keys
  const isAuthenticated = auth && Object.keys(auth).length > 0;

  // Prevent rendering routes until auth check is complete
  if (!loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        {/* Show Header1 only if NOT logged in */}
        {!isAuthenticated && <Header1 obj={obj} />}
        {/* Show Header2 only if logged in */}
        {isAuthenticated && <Header2 auth={auth} obj={obj} />}
        <Routes>
          <Route path="/" element={<Login auth={auth} setAuth={setAuth} />} />
          <Route path="/logout" element={<Logout setAuth={setAuth} />} />
          {/* Pass auth to Login so it can access it */}
          <Route path="/admin/login" element={<Login auth={auth} setAuth={setAuth} />} />
          <Route path="/admin/forgot-password" element={<ForgetPassword />} />
          {/* Add route for change password */}
          <Route
            path="/auth/change-password"
            element={
              <ProtectedRoute auth={auth}>
                <Home><ChangePassword auth={auth} /></Home>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute auth={auth}>
                <Home><Dashbroad auth={auth}/></Home>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/slider"
            element={
              <ProtectedRoute auth={auth}>
                <Home obj={obj}><HomeSlider /></Home>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/category"
            element={
              <ProtectedRoute auth={auth}>
                <Home><Category /></Home>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute auth={auth}>
                <Home><Products /></Home>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute auth={auth}>
                <Home><MyOrder /></Home>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banner"
            element={
              <ProtectedRoute auth={auth}>
                <Home><Banner /></Home>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logo"
            element={
              <ProtectedRoute auth={auth}>
                <Home><ManageLogo obj={obj} /></Home>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute auth={auth}>
                <Home><ChangeProfile obj={obj} auth={auth}/></Home>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <div className="w-full">
          {isAuthenticated && <Footer />}
        </div>
      </Router>
    </div>
  );
}

export default App;
