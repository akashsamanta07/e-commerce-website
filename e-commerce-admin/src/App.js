import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Header1 from "./components/Header/Header1.jsx";
import Header2 from "./components/Header/Header2.jsx";
import Footer from "./components/footer/Footer.jsx";
import Login from './auth/Login.jsx';
import Home from "./Pages/Home.jsx";
import ChangeProfile from "./auth/ChangeProfile.jsx";
import ChangePassword from "./auth/ChangePassword.jsx";
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

// Helper to detect mobile device
function isMobileScreen() {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
  }
  return false;
}

function ProtectedRoute({ auth, children }) {
  // auth is an object; if it has any keys, user is authenticated
  const isAuthenticated = auth && Object.keys(auth).length > 0;
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

function App() {
  const [data, setData] = useState({ logo: true, update: true });
  const [auth, setAuth] = useState({});
  const [loading, setloading] = useState(false); // Track if auth check is done

  let obj = {
    data,
    setData
  };

  // Ensure routing only happens after auth check is complete
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let result;
        let res;
        // If mobile and tokens exist in localStorage, use them for refresh
        if (isMobileScreen() && localStorage.getItem("refreshToken")) {
          res = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              refreshToken: localStorage.getItem("refreshToken")
            }),
            credentials: "include"
          });
        } else {
          // Desktop: use cookies
          res = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            }
          });
        }
        result = await res.json();

        // If mobile and new tokens are returned, update localStorage
        if (isMobileScreen() && result.accessToken && result.refreshToken) {
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);
        }

        if (!res.ok || result.userData == null) {
          setAuth({});
          // If mobile, clear tokens if refresh failed
          if (isMobileScreen()) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        } else {
          setAuth(result.userData);
        }
      } catch (err) {
        setAuth({});
        // If mobile, clear tokens on error
        if (isMobileScreen()) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
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
                <Home><Dashbroad auth={auth} /></Home>
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
                <Home><ChangeProfile obj={obj} auth={auth} /></Home>
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
