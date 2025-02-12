const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("City", CitySchema);
