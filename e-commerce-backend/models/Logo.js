const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Logo image is required"],
    },
  },
  { timestamps: true }
);

const LogoModel = mongoose.model("Logo", logoSchema);
module.exports = LogoModel;

