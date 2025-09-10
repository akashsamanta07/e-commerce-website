const HomeSliderModel = require("../models/homeSlider");
const CategoryModel = require("../models/Category");
const BannerModel = require("../models/Banner");
const LogoModel = require("../models/Logo");
const ProductModel = require("../models/productModel");
const OrderModel = require("../models/orderModel"); // Add Order model
const fs = require("fs");
const authenticateToken = require("./authenticateToken");
const { uploadToCloudinary, deleteFromCloudinary } = require("../cloudinary");

// --- Home Slider Functions ---

// Add Home Slider (with multer)
exports.addHomeSlider = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: "Image is required" });
      }

      // Upload to Cloudinary using buffer
      const uploadResult = await uploadToCloudinary(req.file.buffer, "homeSlider");

      const newSlider = new HomeSliderModel({
        image: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
      });

      await newSlider.save();

      res.status(201).json({
        success: true,
        message: "Added",
        data: newSlider,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Add fail", error: error.message });
    }
  }
];

// Edit Home Slider (update image)
exports.editHomeSlider = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      const { id } = req.params;
      const slider = await HomeSliderModel.findById(id);
      if (!slider) {
        return res.status(404).json({ success: false, message: "Not found" });
      }

      // If new image uploaded, replace old image in Cloudinary
      if (req.file && req.file.buffer) {
        // Remove old image from Cloudinary
        if (slider.imagePublicId) {
          await deleteFromCloudinary(slider.imagePublicId);
        }
        // Upload new image to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.buffer, "homeSlider");
        slider.image = uploadResult.secure_url;
        slider.imagePublicId = uploadResult.public_id;
      }

      await slider.save();

      res.status(200).json({
        success: true,
        message: "Edited",
        data: slider,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Edit fail", error: error.message });
    }
  }
];

// Delete Home Slider
exports.deleteHomeSlider = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      const { id } = req.params;
      const slider = await HomeSliderModel.findById(id);
      if (!slider) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      // Remove image from Cloudinary
      if (slider.imagePublicId) {
        await deleteFromCloudinary(slider.imagePublicId);
      }
      await HomeSliderModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Deleted",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Delete fail", error: error.message });
    }
  }
];

// Get All Home Sliders
exports.getHomeSliders = [
  async (req, res) => {
    try {
      const sliders = await HomeSliderModel.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: sliders,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Fetch fail", error: error.message });
    }
  }
];

// --- Category Functions ---

// Add Category (with multer)
exports.addCategory = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: "Image is required" });
      }

      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, message: "Name is required" });
      }

      // Upload to Cloudinary using buffer
      const uploadResult = await uploadToCloudinary(req.file.buffer, "category");

      const newCategory = new CategoryModel({
        name,
        image: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
      });

      await newCategory.save();

      res.status(201).json({
        success: true,
        message: "Added",
        data: newCategory,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Add fail", error: error.message });
    }
  }
];

// Edit Category (update name and/or image)
exports.editCategory = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      const { id } = req.params;
      const category = await CategoryModel.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: "Not found" });
      }

      // Update name if provided
      if (req.body.name) {
        category.name = req.body.name;
      }

      // If new image uploaded, replace old image in Cloudinary
      if (req.file && req.file.buffer) {
        // Remove old image from Cloudinary
        if (category.imagePublicId) {
          await deleteFromCloudinary(category.imagePublicId);
        }
        // Upload new image to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.buffer, "category");
        category.image = uploadResult.secure_url;
        category.imagePublicId = uploadResult.public_id;
      }

      await category.save();

      res.status(200).json({
        success: true,
        message: "Edited",
        data: category,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Edit fail", error: error.message });
    }
  }
];

// Delete Category
exports.deleteCategory = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      const { id } = req.params;
      const category = await CategoryModel.findById(id);
      if (!category) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      // Remove image from Cloudinary
      if (category.imagePublicId) {
        await deleteFromCloudinary(category.imagePublicId);
      }
      await CategoryModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Deleted",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Delete fail", error: error.message });
    }
  }
];

// Get All Categories
exports.getCategories = [
  async (req, res) => {
    try {
      const categories = await CategoryModel.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Fetch fail", error: error.message });
    }
  }
];

// --- Banner Functions ---

// Add Banner (with multer)
exports.addBanner = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: "Image is required" });
      }

      // Upload to Cloudinary using buffer
      const uploadResult = await uploadToCloudinary(req.file.buffer, "banner");

      const newBanner = new BannerModel({
        image: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
      });

      await newBanner.save();

      res.status(201).json({
        success: true,
        message: "Added",
        data: newBanner,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Add fail", error: error.message });
    }
  }
];

// Edit Banner (update image)
exports.editBanner = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      const { id } = req.params;
      const banner = await BannerModel.findById(id);
      if (!banner) {
        return res.status(404).json({ success: false, message: "Not found" });
      }

      // If new image uploaded, replace old image in Cloudinary
      if (req.file && req.file.buffer) {
        // Remove old image from Cloudinary
        if (banner.imagePublicId) {
          await deleteFromCloudinary(banner.imagePublicId);
        }
        // Upload new image to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.buffer, "banner");
        banner.image = uploadResult.secure_url;
        banner.imagePublicId = uploadResult.public_id;
      }

      await banner.save();

      res.status(200).json({
        success: true,
        message: "Edited",
        data: banner,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Edit fail", error: error.message });
    }
  }
];

// Delete Banner
exports.deleteBanner = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      const { id } = req.params;
      const banner = await BannerModel.findById(id);
      if (!banner) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      // Remove image from Cloudinary
      if (banner.imagePublicId) {
        await deleteFromCloudinary(banner.imagePublicId);
      }
      await BannerModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Deleted",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Delete fail", error: error.message });
    }
  }
];

// Get All Banners
exports.getBanners = [
  async (req, res) => {
    try {
      const banners = await BannerModel.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: banners,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Fetch fail", error: error.message });
    }
  }
];

// --- Logo Functions ---

// Add Logo (with multer)
exports.addLogo = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: "Image is required" });
      }

      // Only one logo allowed, so remove existing logo document and image from Cloudinary if present
      const existingLogo = await LogoModel.findOne();
      if (existingLogo) {
        if (existingLogo.imagePublicId) {
          await deleteFromCloudinary(existingLogo.imagePublicId);
        }
        await LogoModel.deleteMany({});
      }

      // Upload to Cloudinary using buffer
      const uploadResult = await uploadToCloudinary(req.file.buffer, "logo");

      // Save new logo document
      const newLogo = new LogoModel({
        image: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
      });
      await newLogo.save();

      res.status(201).json({
        success: true,
        message: "Logo added",
        data: { image: newLogo.image },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Add logo fail", error: error.message });
    }
  }
];

// Edit Logo (replace logo image)
exports.editLogo = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: "Image is required" });
      }

      // Find existing logo document
      const existingLogo = await LogoModel.findOne();
      // Upload new image to Cloudinary using buffer
      const uploadResult = await uploadToCloudinary(req.file.buffer, "logo");

      if (existingLogo) {
        // Remove old logo image from Cloudinary
        if (existingLogo.imagePublicId) {
          await deleteFromCloudinary(existingLogo.imagePublicId);
        }
        existingLogo.image = uploadResult.secure_url;
        existingLogo.imagePublicId = uploadResult.public_id;
        await existingLogo.save();
        return res.status(200).json({
          success: true,
          message: "Logo edited",
          data: { image: existingLogo.image },
        });
      } else {
        // If no logo exists, create new
        const newLogo = new LogoModel({
          image: uploadResult.secure_url,
          imagePublicId: uploadResult.public_id,
        });
        await newLogo.save();
        return res.status(201).json({
          success: true,
          message: "Logo added",
          data: { image: newLogo.image },
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Edit logo fail", error: error.message });
    }
  }
];

// Get Logo (returns the logo file path if exists)
exports.getLogo = [
  async (req, res) => {
    try {
      const logo = await LogoModel.findOne();
      if (logo) {
        return res.status(200).json({
          success: true,
          data: logo,
        });
      }
      res.status(404).json({ success: false, message: "Logo not found" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Fetch logo fail", error: error.message });
    }
  }
];

// --- Product Functions ---

// Add Product (with multer, multiple images)
exports.addProduct = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      // Multer stores files in req.files (array)
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "At least one product image is required" });
      }

      const {
        title,
        brand,
        description,
        category,
        subcategory,
        originalPrice,
        discountPrice,
        inStock,
        rating
      } = req.body;

      if (!title || !category || !originalPrice) {
        return res.status(400).json({ success: false, message: "Title, category, and original price are required" });
      }

      // Upload all images to Cloudinary using buffer
      const images = [];
      const imagePublicIds = [];
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file.buffer, "product");
        images.push(uploadResult.secure_url);
        imagePublicIds.push(uploadResult.public_id);
      }
      let reviewlist = [];
      let sales = 0;

      const newProduct = new ProductModel({
        title,
        brand,
        description,
        category,
        subcategory,
        originalPrice,
        discountPrice,
        inStock,
        rating,
        images,
        imagePublicIds,
        sales,
        reviewlist
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        message: "Product added",
        data: newProduct
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Add product fail", error: error.message });
    }
  }
];

// Edit Product (update fields and images)
exports.editProduct = [
  authenticateToken,
  
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      // Update fields if provided
      const updatableFields = [
        "title",
        "description",
        "category",
        "subcategory",
        "originalPrice",
        "discountPrice",
        "inStock",
        "sales",
        "rating"
      ];
      updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
          product[field] = req.body[field];
        }
      });

      // If new images uploaded, replace old images in Cloudinary
      if (req.files && req.files.length > 0) {
        // Remove old images from Cloudinary
        if (product.imagePublicIds && Array.isArray(product.imagePublicIds)) {
          for (const publicId of product.imagePublicIds) {
            if (publicId) {
              await deleteFromCloudinary(publicId);
            }
          }
        }
        // Upload new images to Cloudinary using buffer
        const images = [];
        const imagePublicIds = [];
        for (const file of req.files) {
          const uploadResult = await uploadToCloudinary(file.buffer, "product");
          images.push(uploadResult.secure_url);
          imagePublicIds.push(uploadResult.public_id);
        }
        product.images = images;
        product.imagePublicIds = imagePublicIds;
      }

      await product.save();

      res.status(200).json({
        success: true,
        message: "Product edited",
        data: product
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Edit product fail", error: error.message });
    }
  }
];

// Delete Product
exports.deleteProduct = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      // Remove images from Cloudinary
      if (product.imagePublicIds && Array.isArray(product.imagePublicIds)) {
        for (const publicId of product.imagePublicIds) {
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        }
      }
      await ProductModel.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Product deleted"
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Delete product fail", error: error.message });
    }
  }
];

// Get All Products
exports.getProducts = [
  async (req, res) => {
    try {
      const products = await ProductModel.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Fetch products fail", error: err?.message || "any error" });
    }
  }
];

// --- Order Functions ---

// Get All Orders
exports.getAllOrders = [
  async (req, res) => {
    try {
      const orders = await OrderModel.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        orders: orders
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Fetch orders fail", error: error.message });
    }
  }
];

// Change Order Status
exports.changeOrderStatus = [
  authenticateToken,
  async (req, res) => {
    if (req.user && req.user.role === "USER") {
      return res.status(403).json({ success: false, message: "You are not Admin" });
    }
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required" });
      }
      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      order.status = status;
      await order.save();
      res.status(200).json({
        success: true,
        message: "Order status updated",
        order: order
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Change order status fail", error: error.message });
    }
  }
];
