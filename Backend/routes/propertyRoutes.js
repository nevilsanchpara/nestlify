const express = require("express");
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  getPropertiesByCity,
  getUserProperties,
  updateProperty,
  deleteProperty,
  contactPropertyOwner
} = require("../controllers/propertyController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createProperty);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.get("/city/:cityId", getPropertiesByCity);
router.get("/user/properties", protect, getUserProperties);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);
router.post("/:id/contact", contactPropertyOwner);
module.exports = router;
