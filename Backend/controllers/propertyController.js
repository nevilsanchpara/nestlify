const Property = require("../models/Property");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Booking",
    format: async (req, file) => "jpg",
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage }).array("photos", 5); // Max 5 images

exports.createProperty = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Image upload failed" });
    }

    try {
      const {
        title,
        price,
        description,
        lat,
        long,
        address,
        availableFrom,
        bathrooms,
        bedrooms,
        city_id,
      } = req.body;

      // Handle uploaded files (Photos)
      const photos = req.files
        ? req.files.map((file) => file.path) // Cloudinary URL
        : [];

      console.log("Uploaded Files:", photos);

      const property = new Property({
        title,
        price,
        description,
        coordinates: { lat, long },
        address,
        availableFrom,
        bathrooms,
        bedrooms,
        city_id,
        photos: photos, // Array of image URLs from Cloudinary
        postedBy: req.user.id,
      });

      await property.save();
      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// @desc    Get All Properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("postedBy", "firstName lastName")
      .populate("city_id");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Property By ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("postedBy", "firstName lastName")
      .populate("city_id");
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Properties By City
exports.getPropertiesByCity = async (req, res) => {
  try {
    const properties = await Property.find({
      city_id: req.params.cityId,
    }).populate("postedBy", "firstName lastName");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Properties Posted By User
exports.getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({ postedBy: req.user.id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    if (property.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(property, req.body);
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    if (property.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await property.deleteOne();
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
