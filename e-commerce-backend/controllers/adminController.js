const HomeSliderModel = require("../models/homeSlider");
const CategoryModel = require("../models/Category");
const BannerModel = require("../models/Banner");
const LogoModel = require("../models/Logo");
const ProductModel = require("../models/productModel");
const fs = require("fs");
const path = require("path");

// --- Home Slider Functions ---

// Add Home Slider (with multer)
exports.addHomeSlider = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imagePath = req.file.path;

    const newSlider = new HomeSliderModel({
      image: imagePath,
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
};

// Edit Home Slider (update image)
exports.editHomeSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await HomeSliderModel.findById(id);
    if (!slider) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // If new image uploaded, replace old image file
    if (req.file) {
      const oldImagePath = slider.image;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      slider.image = req.file.path;
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
};

// Delete Home Slider
exports.deleteHomeSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await HomeSliderModel.findById(id);
    if (!slider) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    // Remove image file from filesystem
    const imagePath = slider.image;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await HomeSliderModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete fail", error: error.message });
  }
};

// Get All Home Sliders
exports.getHomeSliders = async (req, res) => {
  try {
    const sliders = await HomeSliderModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch fail", error: error.message });
  }
};

// --- Category Functions ---

// Add Category (with multer)
exports.addCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imagePath = req.file.path;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const newCategory = new CategoryModel({
      name,
      image: imagePath,
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
};

// Edit Category (update name and/or image)
exports.editCategory = async (req, res) => {
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

    // If new image uploaded, replace old image file
    if (req.file) {
      const oldImagePath = category.image;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      category.image = req.file.path;
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
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    // Remove image file from filesystem
    const imagePath = category.image;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await CategoryModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete fail", error: error.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch fail", error: error.message });
  }
};

// --- Banner Functions ---

// Add Banner (with multer)
exports.addBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imagePath = req.file.path;

    const newBanner = new BannerModel({
      image: imagePath,
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
};

// Edit Banner (update image)
exports.editBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await BannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // If new image uploaded, replace old image file
    if (req.file) {
      const oldImagePath = banner.image;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      banner.image = req.file.path;
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
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await BannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    // Remove image file from filesystem
    const imagePath = banner.image;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await BannerModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete fail", error: error.message });
  }
};

// Get All Banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await BannerModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch fail", error: error.message });
  }
};

// --- Logo Functions ---

// Add Logo (with multer)
exports.addLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imagePath = req.file.path;

    // Only one logo allowed, so remove existing logo document and file if present
    const existingLogo = await LogoModel.findOne();
    if (existingLogo) {
      // Remove old logo file from filesystem
      if (fs.existsSync(existingLogo.image)) {
        fs.unlinkSync(existingLogo.image);
      }
      await LogoModel.deleteMany({});
    }

    // Save new logo document
    const newLogo = new LogoModel({
      image: imagePath,
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
};

// Edit Logo (replace logo image)
exports.editLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imagePath = req.file.path;

    // Find existing logo document
    const existingLogo = await LogoModel.findOne();
    if (existingLogo) {
      // Remove old logo file from filesystem
      if (fs.existsSync(existingLogo.image)) {
        fs.unlinkSync(existingLogo.image);
      }
      existingLogo.image = imagePath;
      await existingLogo.save();
      return res.status(200).json({
        success: true,
        message: "Logo edited",
        data: { image: existingLogo.image },
      });
    } else {
      // If no logo exists, create new
      const newLogo = new LogoModel({ image: imagePath });
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
};

// Get Logo (returns the logo file path if exists)
exports.getLogo = async (req, res) => {
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
};

// --- Product Functions ---

// Add Product (with multer, multiple images)
exports.addProduct = async (req, res) => {
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


    const images = req.files.map(file => file.path);
    let reviewlist=[];
    let sales=0;

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
};

// Edit Product (update fields and images)
exports.editProduct = async (req, res) => {
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

    // If new images uploaded, replace old images
    if (req.files && req.files.length > 0) {
      // Remove old images from filesystem
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach(imgPath => {
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        });
      }
      product.images = req.files.map(file => file.path);
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
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    // Remove images from filesystem
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(imgPath => {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }
    await ProductModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete product fail", error: error.message });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch products fail", error: err?.message || "any error" });
  }
};
