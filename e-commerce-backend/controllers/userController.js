
const User = require("../models/userModel");
const authenticateToken = require("./authenticateToken");

// Controller to get wishlist for a user
exports.getWishlist = [
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate("wish_list");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, wishlist: user.wish_list });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to add item to wishlist
exports.wishlistAdd = [
  authenticateToken,
  async (req, res) => {
    try {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
      }
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      if (user.wish_list.includes(productId)) {
        return res.status(400).json({ success: false, message: "Product already in wishlist" });
      }
      user.wish_list.push(productId);
      await user.save();
      res.json({ success: true, message: "Product added to wishlist", wishlist: user.wish_list });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to delete item from wishlist
exports.wishlistDelete = [
  authenticateToken,
  async (req, res) => {
    try {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
      }
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const index = user.wish_list.indexOf(productId);
      if (index === -1) {
        return res.status(400).json({ success: false, message: "Product not found in wishlist" });
      }
      user.wish_list.splice(index, 1);
      await user.save();
      res.json({ success: true, message: "Product removed from wishlist", wishlist: user.wish_list });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to get cart for a user
exports.getCart = [
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate("shopping_cart.product");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, cartlist: user.shopping_cart });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to add item to cart
exports.addToCart = [
  authenticateToken,
  async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
      }
      const qty = quantity && quantity > 0 ? quantity : 1;
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      // Check if product already in cart
      const cartItemIndex = user.shopping_cart.findIndex(
        item => item.product.toString() === productId
      );
      if (cartItemIndex !== -1) {
        // If already in cart, update quantity
        user.shopping_cart[cartItemIndex].quantity += qty;
      } else {
        // Else, add new item
        user.shopping_cart.push({ product: productId, quantity: qty });
      }
      await user.save();
      // Populate cart for response
      const populatedUser = await User.findById(req.params.userId).populate("shopping_cart.product");
      res.json({ success: true, message: "Product added to cart", cart: populatedUser.shopping_cart });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to delete item from cart
exports.cartDelete = [
  authenticateToken,
  async (req, res) => {
    try {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
      }
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const cartIndex = user.shopping_cart.findIndex(
        item => item.product.toString() === productId
      );
      if (cartIndex === -1) {
        return res.status(400).json({ success: false, message: "Product not found in cart" });
      }
      user.shopping_cart.splice(cartIndex, 1);
      await user.save();
      res.json({ success: true, message: "Product removed from cart", cart: user.shopping_cart });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];
