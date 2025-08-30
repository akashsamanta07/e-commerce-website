const mongoose = require("mongoose");

const addBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Banner image is required"],
    },
  },
  { timestamps: true }
);

const AddBannerModel = mongoose.model("AddBanner", addBannerSchema);
module.exports = AddBannerModel;
