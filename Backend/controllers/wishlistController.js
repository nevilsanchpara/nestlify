const Wishlist = require("../models/Wishlist");
const Property = require("../models/Property");
const User = require("../models/User");

// Add property to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);

    if (!user || !property) {
      return res.status(404).json({ message: "User or Property not found" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, properties: [propertyId] });
    } else {
      if (wishlist.properties.includes(propertyId)) {
        return res
          .status(400)
          .json({ message: "Property already in wishlist" });
      }
      wishlist.properties.push(propertyId);
    }

    await wishlist.save();
    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get wishlist for a user
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "properties"
    );
    console.log(wishlist);

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove property from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, propertyId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.properties = wishlist.properties.filter(
      (id) => id.toString() !== propertyId
    );

    await wishlist.save();
    res.status(200).json({ message: "Removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
