const express = require("express");
const userRoutes = require("./userRoutes");
// const wishlistRoutes = require("./wishlistRoutes");
const propertiesRoutes = require("./propertyRoutes");
// const wishlistRoutes = require("./wishlistRoutes");

const router = express.Router();
/**
 * @swagger
 * /:
 *   get:
 *     description:  Endpoint for everything
 */

router.use("/users", userRoutes);
router.use("/properties", propertiesRoutes);
// router.use("/wishlist", wishlistRoutes); // Add wishlist route

module.exports = router;
