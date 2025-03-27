import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stepper, Step, StepLabel, Button, TextField, Typography, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
const apiUrl = import.meta.env.VITE_API_URL;
const geoapifyApiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
const AdminPropertyForm = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: property.title || '',
    price: property.price || '',
    description: property.description || '',
    lat: property.coordinates ? property.coordinates.lat : '',
    long: property.coordinates ? property.coordinates.long : '',
    address: property.address || '',
    availableFrom: property.availableFrom || '',
    bathrooms: property.bathrooms || '',
    bedrooms: property.bedrooms || '',
    city_id: property.city_id || '',
    photos: property.photos || [],
  });

  const [cities, setCities] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [images, setImages] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Property Details', 'Property Features', 'Upload Images'];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/city`);
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities', error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (formData.address.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${formData.address}&apiKey=${geoapifyApiKey}`);
          setSuggestions(response.data.features);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions', error);
        }
      };
      fetchSuggestions();
    } else {
      setShowSuggestions(false);
    }
  }, [formData.address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({
      ...formData,
      address: suggestion.properties.formatted,
      lat: suggestion.properties.lat,
      long: suggestion.properties.lon,
    });
    setShowSuggestions(false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('lat', formData.lat);
    data.append('long', formData.long);
    data.append('address', formData.address);
    data.append('availableFrom', formData.availableFrom);
    data.append('bathrooms', formData.bathrooms);
    data.append('bedrooms', formData.bedrooms);
    data.append('city_id', formData.city_id);
    for (let i = 0; i < images.length; i++) {
      data.append('photos', images[i]);
    }

    const token = sessionStorage.getItem('token');

    try {
      if (property._id) {
        const response = await axios.put(
          `${apiUrl}/api/properties/${property._id}`, 
          data, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSave(response.data);
      } else {
        const response = await axios.post(
          `${apiUrl}/api/properties`, 
          data, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSave(response.data);
      }
    } catch (error) {
      console.error('Error saving property', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            {showSuggestions && (
              <ul className="absolute bg-white border mt-1 w-full z-10">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion.properties.formatted}
                  </li>
                ))}
              </ul>
            )}
            <TextField
              label="Latitude"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Longitude"
              name="long"
              value={formData.long}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Available From"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleChange}
              type="date"
              fullWidth
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              label="Bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                label="City"
              >
                {cities.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.city}, {city.province}, {city.country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography>Upload Images</Typography>
            <input
              type="file"
              name="photos"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded"
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">{property._id ? 'Edit Property' : 'Add Property'}</h2>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
          <Button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminPropertyForm;