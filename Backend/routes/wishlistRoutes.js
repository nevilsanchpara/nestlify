const express = require("express");
const {
  addToWishlist,
  getWishlistByUser,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: API for managing user wishlist
 */

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add a property to user's wishlist
 *     tags: [Wishlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               listingId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item added to wishlist
 *       500:
 *         description: Server error
 */
router.post("/", addToWishlist);

/**
 * @swagger
 * /wishlist/user/{userId}:
 *   get:
 *     summary: Get all wishlist items for a user
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist items for the user
 *       500:
 *         description: Server error
 */
router.get("/user/:userId", getWishlistByUser);

/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     summary: Remove an item from wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from wishlist
 *       404:
 *         description: Wishlist item not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", removeFromWishlist);

module.exports = router;
