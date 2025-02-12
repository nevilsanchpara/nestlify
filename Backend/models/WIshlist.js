const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
