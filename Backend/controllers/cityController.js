const City = require("../models/City");

// @desc    Create New City
exports.createCity = async (req, res) => {
  try {
    const { city, province, country } = req.body;

    const newCity = new City({ city, province, country });
    await newCity.save();

    res.status(201).json(newCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Cities
exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get City By ID
exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });

    res.json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete City
exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });

    await city.deleteOne();
    res.json({ message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
