const express = require("express");
const { createCity, getAllCities, getCityById, deleteCity } = require("../controllers/cityController");
const router = express.Router();

router.post("/", createCity);
router.get("/", getAllCities);
router.get("/:id", getCityById);
 

module.exports = router;
