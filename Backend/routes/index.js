const express = require("express");
const userRoutes = require("./userRoutes");
const propertiesRoutes = require("./propertyRoutes");
const cityRoutes = require("./cityRoutes");

const router = express.Router();
/**
 * @swagger
 * /:
 *   get:
 *     description:  Endpoint for everything
 */

router.use("/users", userRoutes);
router.use("/properties", propertiesRoutes);
router.use("/city", cityRoutes);

module.exports = router;
