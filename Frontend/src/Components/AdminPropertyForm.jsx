import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  const handleSuggestionClick = (suggestion) => {
    setFormData({ 
      ...formData, 
      address: suggestion.properties.formatted,
      city: suggestion.properties.city || suggestion.properties.county || suggestion.properties.state || '' // Fill city field
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (property._id) {
        const response = await axios.put(`https://nestlify-xelq.vercel.app/api/properties/${property._id}`, formData);
        onSave(response.data);
      } else {
        const response = await axios.post('https://nestlify-xelq.vercel.app/api/properties', formData);
        onSave(response.data);
      }
    } catch (error) {
      console.error('Error saving property', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">{property._id ? 'Edit Property' : 'Add Property'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
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
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Purchase Price</label>
            <input
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Bedrooms</label>
            <input
              type="number"
              name="numBeds"
              value={formData.numBeds}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Bathrooms</label>
            <input
              type="number"
              name="numBaths"
              value={formData.numBaths}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Property Type</label>
            <input
              type="text"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Square Feet</label>
            <input
              type="number"
              name="sqft"
              value={formData.sqft}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPropertyForm;