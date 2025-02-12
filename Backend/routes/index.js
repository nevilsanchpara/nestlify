const express = require("express");
const userRoutes = require("./userRoutes");
const propertiesRoutes = require("./propertyRoutes");

const router = express.Router();
/**
 * @swagger
 * /:
 *   get:
 *     description:  Endpoint for everything
 */

router.use("/users", userRoutes);
router.use("/properties", propertiesRoutes);

module.exports = router;
