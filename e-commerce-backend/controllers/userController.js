
const User = require("../models/userModel");
const authenticateToken = require("./authenticateToken");
const ReviewList = require("../models/ReviewList");
const Product = require("../models/productModel");
const AddressModel = require("../models/addressModel");
const OrderModel = require("../models/orderModel");

// Controller to get wishlist for a user
exports.getWishlist = [
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
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
      const user = await User.findById(req.params.userId);
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

// Controller to increment quantity of a cart item
exports.incrementCartQuantity = [
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
      const cartItem = user.shopping_cart.find(
        item => item.product.toString() === productId
      );
      if (!cartItem) {
        return res.status(400).json({ success: false, message: "Product not found in cart" });
      }
      cartItem.quantity += 1;
      await user.save();
      res.json({ success: true, message: "Cart item quantity incremented", cart: user.shopping_cart });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to decrement quantity of a cart item
exports.decrementCartQuantity = [
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
      const cartItem = user.shopping_cart.find(
        item => item.product.toString() === productId
      );
      if (!cartItem) {
        return res.status(400).json({ success: false, message: "Product not found in cart" });
      }
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await user.save();
        res.json({ success: true, message: "Cart item quantity decremented", cart: user.shopping_cart });
      } else {
        // Optionally, remove item if quantity would go below 1
        user.shopping_cart = user.shopping_cart.filter(
          item => item.product.toString() !== productId
        );
        await user.save();
        res.json({ success: true, message: "Product removed from cart", cart: user.shopping_cart });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to set quantity of a cart item
exports.setCartQuantity = [
  authenticateToken,
  async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      if (!productId || typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ success: false, message: "Valid productId and quantity (>=1) are required" });
      }
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const cartItem = user.shopping_cart.find(
        item => item.product.toString() === productId
      );
      if (!cartItem) {
        return res.status(400).json({ success: false, message: "Product not found in cart" });
      }
      cartItem.quantity = quantity;
      await user.save();
      res.json({ success: true, message: "Cart item quantity set", cart: user.shopping_cart });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to add a review to a product
exports.addReview = [
  authenticateToken,
  async (req, res) => {
    try {
      const { userId, name, comment, rating } = req.body;
      const { productId } = req.params;

      if (!name || !comment || typeof rating === "undefined") {
        return res.status(400).json({ success: false, message: "Name, comment, and rating are required" });
      }

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }

      // Find orders for this user that include this product
      const hasOrdered = await OrderModel.exists({
        userId: userId,
        "items.productId": productId
      });

      if (!hasOrdered) {
        return res.status(403).json({ success: false, message: "You have not ordered this product" });
      }

      // Create review
      const review = new ReviewList({
        productId,
        name,
        comment,
        rating,
        date: new Date()
      });
      await review.save();

      // Add review to product's reviewlist
      product.reviewlist.push(review._id);
      await product.save();

      res.json({ success: true, message: "Review added successfully", review });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to get all reviews for a product
exports.getReviews = [
  async (req, res) => {
    try {
      const { productId } = req.params;

      // Check if product exists
      const product = await Product.findById(productId).populate({
        path: "reviewlist",
        model: "Reviewlist"
      });
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      res.json({ success: true, reviews: product.reviewlist });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to get address for a user
exports.getAddress = [
  authenticateToken,
  async (req, res) => {
    try {
      const address = await AddressModel.findOne({ userId: req.params.userId });
      if (!address) {
        return res.status(404).json({ success: false, message: "Address not found" });
      }
      res.json({ success: true, address });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to add or update address for a user
exports.addOrUpdateAddress = [
  authenticateToken,
  async (req, res) => {
    try {
      const { address, city, state, zip } = req.body;
      if (!address || !city || !state || !zip) {
        return res.status(400).json({ success: false, message: "All address fields are required" });
      }

      let userAddress = await AddressModel.findOne({ userId: req.params.userId });
      let user = await User.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (userAddress) {
        // Update existing address
        userAddress.address = address;
        userAddress.city = city;
        userAddress.state = state;
        userAddress.zip = zip;
        await userAddress.save();

        // Ensure user's address_details is set
        if (!user.address_details || user.address_details.toString() !== userAddress._id.toString()) {
          user.address_details = userAddress._id;
          await user.save();
        }

        res.json({ success: true, message: "Address updated successfully", address: userAddress });
      } else {
        // Add new address
        const newAddress = new AddressModel({
          userId: req.params.userId,
          address,
          city,
          state,
          zip
        });
        await newAddress.save();

        // Set user's address_details to new address id
        user.address_details = newAddress._id;
        await user.save();

        res.json({ success: true, message: "Address added successfully", address: newAddress });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to add an order for a user
exports.addOrder = [
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate("shopping_cart.product");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      if (!user.shopping_cart || user.shopping_cart.length === 0) {
        return res.status(400).json({ success: false, message: "Shopping cart is empty" });
      }
      const items = user.shopping_cart.map(item => ({
        productId: item.product._id,
        title: item.product.title,
        qty: item.quantity,
        price: item.product.discountPrice
      }));
      // Calculate total
      const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
      // Create order
      const order = new OrderModel({
        userId: userId,
        items,
        total
      });
      await order.save();

      // Add order to user's orderHistory
      user.orderHistory.push(order._id);

      // Clear shopping cart
      user.shopping_cart = [];
      await user.save();

      res.json({ success: true, message: "Order placed successfully", order });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];

// Controller to get all orders for a user
exports.getOrders = [
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
      res.json({ success: true, orders });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
];
