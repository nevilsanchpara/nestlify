const Wishlist = require("../models/Wishlist");

// @desc    Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    const wishlistItem = new Wishlist({ userId, listingId });
    await wishlistItem.save();

    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Wishlist by User ID
exports.getWishlistByUser = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.params.userId })
      .populate("listingId", "title price description") // Populate property data
      .populate("userId", "name email"); // Populate user data
    res.json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findById(req.params.id);
    if (!wishlistItem) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    await wishlistItem.deleteOne();
    res.json({ message: "Item removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
