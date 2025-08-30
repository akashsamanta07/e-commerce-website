const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    zip: {
      type: String,
      required: [true, "Zip code is required"],
    },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("Address", addressSchema);
module.exports = AddressModel;
