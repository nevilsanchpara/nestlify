const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
    },
    address: { type: String, required: true },
    availableFrom: { type: Date, required: true },
    photos: [{ type: String }],
    amenities: {
      wifi: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      pool: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      furnished: { type: Boolean, default: false },
    },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    city_id: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
