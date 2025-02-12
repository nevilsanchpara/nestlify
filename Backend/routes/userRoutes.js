const express = require("express");
const { registerUser, verifyEmail, forgotPassword, resetPassword, uploadProfileImage } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Routes

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: API for managing cities
 */
router.post("/register", registerUser);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/upload", protect, upload.single("image"), uploadProfileImage);

module.exports = router;
