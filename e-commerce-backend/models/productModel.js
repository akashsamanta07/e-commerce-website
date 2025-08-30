const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    subcategory: {
      type: String,
      required: [true, "Subcategory is required"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
    },
    discountPrice: {
      type: Number,
      required: [true, "Discount price is required"],
    },
    inStock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    images: [
      {
        type: String,
      },
    ],
    sales: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviewlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviewlist",
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
