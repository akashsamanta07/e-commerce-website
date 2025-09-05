import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import API_BASE from "./utils/API_BASE";
import Logout from './auth/Logout.jsx';

function ProtectedRoute({ auth, children }) {
  const isAuthenticated = auth && Object.keys(auth).length > 0;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  // State for UI
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState('');
  const [wishlistcount, setwishlistcount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  // cartlist: [{ product: ObjectId, quantity: Number }]
  const [cartlist, setCartlist] = useState([]);
  const [cartlistproduct, setCartlistproduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [menu, setmenu] = useState("Home");
  const [subcategory, setsubcategory] = useState('');
  const [is, setis] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState([]);

  // State for authentication
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(false);

  // Calculate cartlistproduct from products and cartlist
  useEffect(() => {
    if (!Array.isArray(products) || !Array.isArray(cartlist)) {
      setCartlistproduct([]);
      return;
    }
    const merged = cartlist
      .map(item => {
        const prod = products.find(p => p._id === (item.product));
        if (prod) {
          return { ...prod, quantity: item.quantity };
        }
        return null;
      })
      .filter(Boolean);
    setCartlistproduct(merged);
  }, [products,cartCount]);

  // Compose props for headers and pages
  const header2 = {
    cartCount,
    setCartCount,
    search,
    setSearch,
    wishlistcount,
    setwishlistcount,
    setmenu,
    setsubcategory,
    cartlist,
    setCartlist,
    setis,
    categories,
    auth,
    products,
    cartlistproduct
  };
  const header3 = {
    menu,
    setmenu,
    subcategory,
    setsubcategory,
    search,
    setSearch,
    is,
    categories
  };
  const product = {
    wishlistcount,
    setwishlistcount,
    cartCount,
    setCartCount,
    wishlist,
    setWishlist,
    cartlist,
    setCartlist,
    cartlistproduct,
    setCartlistproduct,
    categories,
    selectedProduct,
  };
  const desc = {
    wishlistcount,
    setwishlistcount,
    cartCount,
    setCartCount,
    wishlist,
    setWishlist,
    cartlist,
    setCartlist,
    cartlistproduct,
    setCartlistproduct,
  };
  const mylist = {
    wishlistcount,
    setwishlistcount,
    wishlist,
    setWishlist
  };

  // Check authentication on mount and when needed
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
        setLoading(true);
      }
    };
    checkAuth();
    // eslint-disable-next-line
  }, []);

  // Fetch categories and store in setCategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/get-categories`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          // Sort categories by updatedAt descending (most recently updated first)
          const sortedCategories = [...data.data].sort((a, b) => {
            const dateA = new Date(a.updatedAt);
            const dateB = new Date(b.updatedAt);
            return dateA - dateB;
          });
          setCategories(sortedCategories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products and store in setProducts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/get-products`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          // Sort products by updatedAt descending (most recently updated first)
          const sortedProducts = [...data.data].sort((a, b) => {
            const dateA = new Date(a.updatedAt);
            const dateB = new Date(b.updatedAt);
            return dateB - dateA;
          });
          setProducts(sortedProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Fetch wishlist when auth._id changes (only one auth id)
  useEffect(() => {
    const fetchWishlist = async () => {
      if (auth && auth._id) {
        try {
          const res = await fetch(`${API_BASE}/user/${auth._id}/wishlist`, {
            credentials: 'include',
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.wishlist)) {
            // Sort wishlist by updatedAt ascending (oldest first)
            const sortedWishlist = [...data.wishlist].sort((a, b) => {
              const dateA = new Date(a.updatedAt);
              const dateB = new Date(b.updatedAt);
              return dateA - dateB;
            });
            setWishlist(sortedWishlist);
            setwishlistcount(sortedWishlist.length);
          } else {
            setWishlist([]);
            setwishlistcount(0);
          }
        } catch (err) {
          setWishlist([]);
          setwishlistcount(0);
        }
      } else {
        setWishlist([]);
        setwishlistcount(0);
      }
    };
    fetchWishlist();
    // Only run when auth._id changes
  }, [auth && auth._id || wishlist.length]);

  // Fetch cartlist when auth._id changes (same as wishlist)
  useEffect(() => {
    const fetchCartlist = async () => {
      if (auth && auth._id) {
        try {
          const res = await fetch(`${API_BASE}/user/${auth._id}/cart`, {
            credentials: 'include',
          });
          const data = await res.json();
          // data.cartlist should be array of { product: ObjectId, quantity: Number }
          if (data.success && Array.isArray(data.cartlist)) {
            // Sort cartlist by updatedAt ascending (oldest first)
            const sortedCartlist = [...data.cartlist].sort((a, b) => {
              const dateA = new Date(a.updatedAt);
              const dateB = new Date(b.updatedAt);
              return dateA - dateB;
            });
            setCartlist(sortedCartlist);
            setCartCount(sortedCartlist.reduce((sum, item) => sum + (item.quantity || 0), 0));
          } else {
            setCartlist([]);
            setCartCount(0);
          }
        } catch (err) {
          setCartlist([]);
          setCartCount(0);
        }
      } else {
        setCartlist([]);
        setCartCount(0);
      }
    };
    fetchCartlist();
    // Only run when auth._id changes
  }, [auth && auth._id || cartlist.length]);

  // selectedProduct: filter from products by menu, subcategory, search
  useEffect(() => {
    if (!Array.isArray(products)) {
      setSelectedProduct([]);
      return;
    }

    let filtered = products;

    // If menu is not "Home", filter by category
    if (menu && menu !== "Home") {
      filtered = filtered.filter(
        (p) =>
          (p.category && (typeof p.category === "string"
            ? p.category === menu
            : p.category.name === menu))
      );
    }

    // If subcategory is not empty, filter by subcategory
    if (subcategory && subcategory !== "") {
      filtered = filtered.filter(
        (p) =>
          (p.subcategory && (typeof p.subcategory === "string"
            ? p.subcategory === subcategory
            : p.subcategory.name === subcategory))
      );
    }

    // If search is not empty, filter by title (case-insensitive)
    if (search && search.trim() !== "") {
      const searchLower = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title &&
          p.title.toLowerCase().includes(searchLower)
      );
    }

    setSelectedProduct(filtered);
  }, [products, menu, subcategory, search]);

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
        <ScrollToTop />
        <div className="hidden md:block">
          <Header1 />
        </div>
        <Header2 header2={header2} auth={auth} />
        <Header3 header3={header3} />
        <Routes>
          <Route path="/" element={<Home product={product} />} />
          <Route path="/login" element={<Login auth={auth} setAuth={setAuth} />} />
          <Route path="/logout" element={<Logout setAuth={setAuth} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<Description desc={desc} />} />
          <Route path="/menu/:category" element={<AllProducts product={product} />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute auth={auth}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-account"
            element={
              <ProtectedRoute auth={auth}>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-profile"
            element={
              <ProtectedRoute auth={auth}>
                <ChangeProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/address"
            element={
              <ProtectedRoute auth={auth}>
                <Address />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute auth={auth}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-list"
            element={
              <ProtectedRoute auth={auth}>
                <MyList mylist={mylist} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-order"
            element={
              <ProtectedRoute auth={auth}>
                <MyOrder />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
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
