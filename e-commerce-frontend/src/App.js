import React, { useState, useEffect, useContext } from 'react';
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
import { GlobalContext } from './components/UserContext/UserContext.jsx';

function ProtectedRoute({ auth, children }) {
  const isAuthenticated = auth && Object.keys(auth).length > 0;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  // State for UI

  const { catname } = useContext(GlobalContext);
  const [relate, setrelated] = useState([]);

  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [cartlist, setCartlist] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [menu, setmenu] = useState("Home");
  const [subcategory, setsubcategory] = useState('');
  const [is, setis] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [data,setData]=useState(false);
  let obj = {
    data,
    setData
  };

  // State for authentication
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(false);


 useEffect(() => {
  if (Array.isArray(products) && catname) {
    const relatedProducts = products.filter(prod => prod.category === catname);
    setrelated(relatedProducts);
  } else {
    setrelated([]);
  }
}, [products, catname]);

  // Compose props for headers and pages
  const header2 = {
    cartlist,
    setCartlist,
    search,
    setSearch,
    wishlistcount: wishlist.length,
    setmenu,
    setsubcategory,
    setis,
    categories,
    auth
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
    cartCount,
    setCartCount,
    wishlist,
    setWishlist,
    cartlist,
    setCartlist,
    categories,
    selectedProduct,
  };
  const desc = {
    cartCount,
    setCartCount,
    wishlist,
    setWishlist,
    cartlist,
    setCartlist,
    filteredProducts: relate
  };
  const mylist = {
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
  }, [data]);

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


   // Fetch wishlist (array of product IDs), then populate wishlist with minimal product info
   useEffect(() => {
    const fetchWishlist = async () => {
      if (auth && auth._id) {
        try {
          const res = await fetch(`${API_BASE}/user/${auth._id}/wishlist`, {
            credentials: 'include',
          });
          const data = await res.json();
          // data.wishlist should be array of product IDs
          if (data.success && Array.isArray(data.wishlist)) {
            if (Array.isArray(products)) {
              // Sort data.wishlist (array of IDs) by product updatedAt ascending (oldest first)
              const sortedWishlistIds = [...data.wishlist].sort((idA, idB) => {
                const prodA = products.find(prod => prod._id === idA);
                const prodB = products.find(prod => prod._id === idB);
                const dateA = prodA ? new Date(prodA.updatedAt) : 0;
                const dateB = prodB ? new Date(prodB.updatedAt) : 0;
                return dateA - dateB;
              });
              const matchedProducts = sortedWishlistIds
                .map(id => {
                  const prod = products.find(prod => prod._id === id);
                  if (prod) {
                    // Only return minimal info for wishlist
                    return {
                      _id: prod._id,
                      title: prod.title,
                      brand: prod.brand,
                      images: prod.images,
                      discountPrice: prod.discountPrice,
                      originalPrice: prod.originalPrice,
                      discountPercent: prod.discountPercent,
                      rating: prod.rating,
                      description: prod.description,
                    };
                  }
                  return null;
                })
                .filter(Boolean);
              setWishlist(matchedProducts);
            } else {
              setWishlist([]);
            }
          } else {
            setWishlist([]);
          }
        } catch (err) {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
    // Only run when auth._id or products changes
  }, [(auth && auth._id), products]);


  // Fetch cartlist when auth._id changes (same as wishlist)
  useEffect(() => {
    const fetchCartlistAndProducts = async () => {
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
            setCartCount(sortedCartlist.length);
            // Now update cartlistProduct here, using products from state
            if (Array.isArray(products)) {
              const merged = sortedCartlist
                .map(item => {
                  const prod = products.find(p => p._id === (item.product));
                  if (prod) {
                    return {
                      _id: prod._id,
                      title: prod.title,
                      brand: prod.brand,
                      images: prod.images,
                      discountPrice: prod.discountPrice,
                      originalPrice: prod.originalPrice,
                      discountPercent: prod.discountPercent,
                      rating: prod.rating,
                      description: prod.description,
                      quantity: item.quantity
                    };
                  }
                  return null;
                })
                .filter(Boolean);
                setCartlist(merged);
            } else {
              setCartlist([])
            }
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
    fetchCartlistAndProducts();
    // Only run when auth._id or products changes
  }, [(auth && auth._id), products]);

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
          <Route path="/" element={<Home product={product} auth={auth}/>} />
          <Route path="/login" element={<Login auth={auth} setAuth={setAuth} />} />
          <Route path="/logout" element={<Logout setAuth={setAuth} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<Description desc={desc} auth={auth} />} />
          <Route path="/menu/:category" element={<AllProducts product={product} auth={auth} />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute auth={auth}>
                <Checkout auth={auth} setCartlist={setCartlist} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-account"
            element={
              <ProtectedRoute auth={auth}>
                <Account auth={auth} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-profile"
            element={
              <ProtectedRoute auth={auth}>
                <ChangeProfile auth={auth} obj={obj}/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/address"
            element={
              <ProtectedRoute auth={auth}>
                <Address auth={auth} />
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
                <MyList mylist={mylist} auth={auth} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-order"
            element={
              <ProtectedRoute auth={auth}>
                <MyOrder auth={auth}  />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <div>
          <FixedBar setis={setis} auth={auth}/>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
