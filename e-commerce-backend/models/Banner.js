const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Banner image is required"],
    },
  },
  { timestamps: true }
);

const BannerModel = mongoose.model("Banner", bannerSchema);
module.exports = BannerModel;
