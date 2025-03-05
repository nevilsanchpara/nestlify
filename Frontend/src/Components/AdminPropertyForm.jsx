import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stepper, Step, StepLabel, Button, TextField, Typography, Box } from '@mui/material';

const AdminPropertyForm = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    address: property.address || '',
    description: property.description || '',
    purchasePrice: property.purchasePrice || '',
    numBeds: property.numBeds || '',
    numBaths: property.numBaths || '',
    propertyType: property.propertyType || '',
    city: property.city || '',
    sqft: property.sqft || ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [images, setImages] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Property Details', 'Property Features', 'Upload Images'];

  useEffect(() => {
    if (formData.address.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${formData.address}&apiKey=70206657263b425b8ad95de27ea1f3da`);
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
      city: suggestion.properties.city || suggestion.properties.county || suggestion.properties.state || '' // Fill city field
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
    data.append('address', formData.address);
    data.append('description', formData.description);
    data.append('purchasePrice', formData.purchasePrice);
    data.append('numBeds', formData.numBeds);
    data.append('numBaths', formData.numBaths);
    data.append('propertyType', formData.propertyType);
    data.append('city', formData.city);
    data.append('sqft', formData.sqft);
    for (let i = 0; i < images.length; i++) {
      data.append('photos', images[i]);
    }

    const token = sessionStorage.getItem('token');

    try {
      if (property._id) {
        const response = await axios.put(
          `https://nestlify-xelq.vercel.app/api/properties/${property._id}`, 
          data, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSave(response.data);
      } else {
        const response = await axios.post(
          'https://nestlify-xelq.vercel.app/api/properties', 
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
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Purchase Price"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              label="Bedrooms"
              name="numBeds"
              value={formData.numBeds}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Bathrooms"
              name="numBaths"
              value={formData.numBaths}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Property Type"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Square Feet"
              name="sqft"
              value={formData.sqft}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
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