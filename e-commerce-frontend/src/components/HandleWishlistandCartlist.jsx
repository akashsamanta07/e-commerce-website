import notify from "./Notification/notify";

function isProductInWishlist(wishlist, productId) {
  return wishlist.some(item => item._id === productId);
}

function isProductInCart(cartlist, productId) {
  return cartlist.some(item => item._id === productId);
}

// Add to wishlist (no quantity for wishlist)
export function addToWishlist(wishlist, setWishlist, product) {
  if (isProductInWishlist(wishlist, product._id)) {
    notify("warning", "Item already in wishlist");
    return;
  }
  // Only add minimal info for wishlist
  const newItem = {
    _id: product._id,
    title: product.title,
    brand: product.brand,
    images: product.images,
    discountPrice: product.discountPrice,
    originalPrice: product.originalPrice,
    discountPercent: product.discountPercent,
    rating: product.rating,
    description:product.description
  };
  setWishlist([...wishlist, newItem]);
  notify("success", "Added to wishlist");
}

export function removeFromWishlist(wishlist, setWishlist, productId) {
  if (!isProductInWishlist(wishlist, productId)) {
    notify("warning", "Item not found in wishlist");
    return;
  }
  setWishlist(wishlist.filter(item => item._id !== productId));
  notify("info", "Removed from wishlist");
}

export function toggleWishlist(wishlist, setWishlist, product) {
  if (isProductInWishlist(wishlist, product._id)) {
    removeFromWishlist(wishlist, setWishlist, product._id);
  } else {
    addToWishlist(wishlist, setWishlist, product);
  }
}

// Add to cartlist: if product exists, increment quantity; else add with quantity 1
export function addToCart(cartlist, setCartlist, product, quantity = 1) {
  const existingItem = cartlist.find(item => item._id === product._id);
  if (existingItem && quantity===1) {
    notify("warning", "Item already in cart");
    return;
  }else if(existingItem && quantity > 1){
    setCartQuantity(cartlist, setCartlist, product._id, quantity);
    return;
  }
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
    description:product.description,
    quantity: quantity
  };
  setCartlist([...cartlist, newItem]);
  notify("success", "Added to cart");
}

// Remove from cartlist entirely
export function removeFromCart(cartlist, setCartlist, productId) {
  if (!isProductInCart(cartlist, productId)) {
    notify("warning", "Item not found in cart");
    return;
  }
  setCartlist(cartlist.filter(item => item._id !== productId));
  notify("info", "Removed from cart");
}

// Increment quantity for a product in cartlist by one
export function incrementCartQuantity(cartlist, setCartlist, productId) {
  let found = false;
  const updatedCart = cartlist.map(item =>
    item._id === productId
      ? (found = true, { ...item, quantity: item.quantity + 1 })
      : item
  );
  if (found) {
    setCartlist(updatedCart);
    notify("success", "Increased quantity in cart");
  } else {
    notify("warning", "Item not found in cart");
  }
}

// Decrement quantity for a product in cartlist; if quantity becomes 0, remove it
export function decrementCartQuantity(cartlist, setCartlist, productId) {
  let found = false;
  let removed = false;
  const updatedCart = cartlist
    .map(item => {
      if (item._id === productId) {
        found = true;
        if (item.quantity - 1 <= 0) {
          removed = true;
          return null;
        }
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    })
    .filter(Boolean);

  if (!found) {
    notify("warning", "Item not found in cart");
  } else if (removed) {
    setCartlist(updatedCart);
    notify("info", "Removed from cart");
  } else {
    setCartlist(updatedCart);
    notify("success", "Decreased quantity in cart");
  }
}
// Set quantity for a product in cartlist to a specific value
export function setCartQuantity(cartlist, setCartlist, productId, quantity) {
  let found = false;
  const updatedCart = cartlist.map(item =>
    item._id === productId
      ? (found = true, { ...item, quantity })
      : item
  );
  if (found) {
    setCartlist(updatedCart);
    notify("success", "Updated quantity");
  } else {
    notify("warning", "Item not found in cart");
  }
}

