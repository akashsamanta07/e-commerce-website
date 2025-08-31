const express = require("express");
const adminRouter = express.Router();

const adminController = require("../controllers/adminController");

// Home Slider routes
adminRouter.post("/add-home-slider", adminController.addHomeSlider);
adminRouter.put("/edit-home-slider/:id", adminController.editHomeSlider);
adminRouter.delete("/delete-home-slider/:id", adminController.deleteHomeSlider);
adminRouter.get("/get-home-sliders", adminController.getHomeSliders);

// Category routes
adminRouter.post("/add-category", adminController.addCategory);
adminRouter.put("/edit-category/:id", adminController.editCategory);
adminRouter.delete("/delete-category/:id", adminController.deleteCategory);
adminRouter.get("/get-categories", adminController.getCategories);

// Banner routes
adminRouter.post("/add-banner", adminController.addBanner);
adminRouter.put("/edit-banner/:id", adminController.editBanner);
adminRouter.delete("/delete-banner/:id", adminController.deleteBanner);
adminRouter.get("/get-banners", adminController.getBanners);

// Logo routes
adminRouter.post("/add-logo", adminController.addLogo);
adminRouter.put("/edit-logo/:id", adminController.editLogo);
adminRouter.get("/get-logo", adminController.getLogo);

// Product routes
adminRouter.post("/add-product", adminController.addProduct);
adminRouter.put("/edit-product/:id", adminController.editProduct);
adminRouter.delete("/delete-product/:id", adminController.deleteProduct);
adminRouter.get("/get-products", adminController.getProducts);

module.exports = adminRouter;