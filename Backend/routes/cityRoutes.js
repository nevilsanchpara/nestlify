const express = require("express");
const { createCity } = require("../controllers/cityController");
const router = express.Router();

router.post("/", createCity);
router.get("/", getAllCities);
router.get("/:id", getCityById);

module.exports = router;
