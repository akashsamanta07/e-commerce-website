const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    imagePublicId: {
      type: String,
      required: [true, "Category image public id is required"],
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
