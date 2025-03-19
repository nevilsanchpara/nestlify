import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminPropertyForm from './AdminPropertyForm';

const AdminPortal = () => {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/properties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties', error);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProperties(properties.filter(property => property._id !== propertyId));
    } catch (error) {
      console.error('Error deleting property', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold my-8">Admin Portal</h1>
      <button
        onClick={() => setEditingProperty({})}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add New Property
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map(property => (
          <div key={property._id} className="property-card border rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">{property.address}</h2>
              <p className="text-gray-700 mb-2">{property.description}</p>
              <p className="text-gray-900 font-bold mb-2">${property.purchasePrice}</p>
              <p className="text-gray-600 mb-2"><strong>Bedrooms:</strong> {property.numBeds}</p>
              <p className="text-gray-600 mb-2"><strong>Bathrooms:</strong> {property.numBaths}</p>
              <p className="text-gray-600 mb-2"><strong>Type:</strong> {property.propertyType}</p>
              <button
                onClick={() => setEditingProperty(property)}
                className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(property._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editingProperty && (
        <AdminPropertyForm
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onSave={(updatedProperty) => {
            if (editingProperty._id) {
              setProperties(properties.map(prop => prop._id === updatedProperty._id ? updatedProperty : prop));
            } else {
              setProperties([...properties, updatedProperty]);
            }
            setEditingProperty(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPortal;