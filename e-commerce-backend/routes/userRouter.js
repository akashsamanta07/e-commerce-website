const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");


 userRouter.get("/:userId/wishlist", userController.getWishlist);
 userRouter.post("/wishlist/:userId/add", userController.wishlistAdd);
 userRouter.post("/wishlist/:userId/delete", userController.wishlistDelete);

 userRouter.get("/:userId/cart", userController.getCart);
 userRouter.post("/cart/:userId/add", userController.addToCart);
 userRouter.post("/cart/:userId/delete", userController.cartDelete);
 userRouter.post("/cart/:userId/increment", userController.incrementCartQuantity);
 userRouter.post("/cart/:userId/decrement", userController.decrementCartQuantity);
 userRouter.post("/cart/:userId/set-quantity", userController.setCartQuantity);

userRouter.post("/review/:productId/add", userController.addReview);
userRouter.get("/reviews/:productId", userController.getReviews);

userRouter.get("/:userId/address", userController.getAddress);
userRouter.post("/:userId/address", userController.addOrUpdateAddress);

userRouter.post("/:userId/order", userController.addOrder);
userRouter.get("/:userId/orders", userController.getOrders);


module.exports = userRouter;
