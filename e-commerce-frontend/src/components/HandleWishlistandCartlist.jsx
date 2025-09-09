import notify from "./Notification/notify";
import API_BASE from "../utils/API_BASE";

// Helper: is product in wishlist
function isProductInWishlist(wishlist, productId) {
  return wishlist.some(item => item._id === productId);
}

function isProductInCart(cartlist, productId) {
  return cartlist.some(item => item._id === productId);
}

// Add to wishlist (with API, using credentials: "include")
export async function addToWishlist(wishlist, setWishlist, product, userId) {
  if (isProductInWishlist(wishlist, product._id)) {
    notify("warning", "Already in wishlist");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/user/wishlist/${userId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ productId: product._id })
    });
    const data = await res.json();
    if (data.success) {
      // Add minimal info for wishlist
      const newItem = {
        _id: product._id,
        title: product.title,
        brand: product.brand,
        images: product.images,
        discountPrice: product.discountPrice,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        rating: product.rating,
        description: product.description
      };
      setWishlist([...wishlist, newItem]);
      notify("success", "Added to wishlist");
    } else {
      notify("error", data.message || "Error");
    }
  } catch (err) {
    notify("error", "Network error");
  }
}

// Remove from wishlist (with API, using credentials: "include")
export async function removeFromWishlist(wishlist, setWishlist, productId, userId) {
  if (!isProductInWishlist(wishlist, productId)) {
    notify("warning", "Not in wishlist");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/user/wishlist/${userId}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    if (data.success) {
      setWishlist(wishlist.filter(item => item._id !== productId));
      notify("info", "Removed from wishlist");
    } else {
      notify("error", data.message || "Error");
    }
  } catch (err) {
    notify("error", "Network error");
  }
}

// Toggle wishlist (with API)
export function toggleWishlist(wishlist, setWishlist, product, userId) {
  if (isProductInWishlist(wishlist, product._id)) {
    removeFromWishlist(wishlist, setWishlist, product._id, userId);
  } else {
    addToWishlist(wishlist, setWishlist, product, userId);
  }
}

// Add to cartlist (with API): if product exists, increment quantity; else add with quantity 1
export async function addToCart(cartlist, setCartlist, product, userId, quantity = 1) {
  const existingItem = cartlist.find(item => item._id === product._id);
  if (existingItem && quantity === 1) {
    notify("warning", "Already in cart");
    return;
  } else if (existingItem && quantity > 1) {
    await setCartQuantity(cartlist, setCartlist, product._id, userId, quantity);
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/user/cart/${userId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ productId: product._id, quantity })
    });
    const data = await res.json();
    if (data.success) {
      // Only add minimal info for cartlist, with quantity
      const newItem = {
        _id: product._id,
        title: product.title,
        brand: product.brand,
        images: product.images,
        discountPrice: product.discountPrice,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        rating: product.rating,
        description: product.description,
        quantity: quantity
      };
      setCartlist([...cartlist, newItem]);
      notify("success", "Added to cart");
    } else {
      notify("error", data.message || "Error");
    }
  } catch (err) {
    notify("error", "Network error");
  }
}

// Remove from cartlist entirely (with API)
export async function removeFromCart(cartlist, setCartlist, productId, userId) {
  if (!isProductInCart(cartlist, productId)) {
    notify("warning", "Not in cart");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/user/cart/${userId}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    if (data.success) {
      setCartlist(cartlist.filter(item => item._id !== productId));
      notify("info", "Removed from cart");
    } else {
      notify("error", data.message || "Error");
    }
  } catch (err) {
    notify("error", "Network error");
  }
}

// Increment quantity for a product in cartlist by one (with API)
export async function incrementCartQuantity(cartlist, setCartlist, productId, userId) {
  if (!isProductInCart(cartlist, productId)) {
    notify("warning", "Not in cart");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/user/cart/${userId}/increment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    if (data.success) {
      const updatedCart = cartlist.map(item =>
        item._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartlist(updatedCart);
      notify("success", "Increased quantity");
    } else {
      notify("error", data.message || "Error");
    }
  } catch (err) {
    notify("error", "Network error");
  }
}

// Decrement quantity for a product in cartlist; if quantity becomes 0, remove it (with API)
export async function decrementCartQuantity(cartlist, setCartlist, productId, userId) {
  if (!isProductInCart(cartlist, productId)) {
    notify("warning", "Not in cart");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/user/cart/${userId}/decrement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    if (data.success) {
      let removed = false;
      const updatedCart = cartlist
        .map(item => {
          if (item._id === productId) {
            if (item.quantity - 1 <= 0) {
              removed = true;
              return null;
            }
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(Boolean);

      if (removed) {
        setCartlist(updatedCart);
        notify("info", "Removed from cart");
      } else {
        setCartlist(updatedCart);
        notify("success", "Decreased quantity");
      }
    } else {
      notify("error", data.message || "Error");
    }
  } catch (err) {
    notify("error", "Network error");
  }
}

// Set quantity for a product in cartlist to a specific value (with API)
export async function setCartQuantity(cartlist, setCartlist, productId, userId, quantity) {
  if (!isProductInCart(cartlist, productId)) {
    notify("warning", "Not in cart");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/user/cart/${userId}/set-quantity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ productId, quantity })
    });
    const data = await res.json();
    if (data.success) {
      const updatedCart = cartlist.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      );
      setCartlist(updatedCart);
      notify("success", "Updated quantity");
    } else {
      notify("error", data.message || "Error");
    }
  } catch (err) {
    notify("error", "Network error");
  }
}
