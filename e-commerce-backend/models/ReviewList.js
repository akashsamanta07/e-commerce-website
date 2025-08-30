const mongoose = require("mongoose");

const reviewListSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Reviewer name is required"],
    },
    date: {
      type: Date,
      required: [true, "Review date is required"],
      default: Date.now,
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

const ReviewList = mongoose.model("Reviewlist", reviewListSchema);
module.exports = ReviewList;

