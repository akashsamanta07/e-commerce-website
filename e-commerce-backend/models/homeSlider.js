const mongoose = require("mongoose");

const homeSliderSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Image is required"],
    },
  },
  { timestamps: true }
);

const HomeSliderModel = mongoose.model("HomeSlider", homeSliderSchema);
module.exports = HomeSliderModel;
