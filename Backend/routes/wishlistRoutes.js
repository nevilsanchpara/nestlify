const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

router.post("/", wishlistController.addToWishlist);
router.get("/:userId", wishlistController.getWishlist);
router.delete("/:userId/:propertyId", wishlistController.removeFromWishlist);

module.exports = router;
