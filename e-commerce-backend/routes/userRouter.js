const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");


 userRouter.get("/:userId/wishlist", userController.getWishlist);
  userRouter.post("/wishlist/:userId/add", userController.wishlistAdd);
 userRouter.post("/wishlist/:userId/delete", userController.wishlistDelete);

 userRouter.get("/:userId/cart", userController.getCart);
 userRouter.post("/cart/:userId/add", userController.addToCart);
 userRouter.post("/cart/:userId/delete", userController.cartDelete);


module.exports = userRouter;
