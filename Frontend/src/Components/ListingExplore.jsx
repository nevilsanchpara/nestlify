import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const ListingExplore = () => {
  const [properties, setProperties] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://nestlify-xelq.vercel.app/api/properties');
        setProperties(response.data);
        const geocodedPositions = await Promise.all(response.data.map(geocodeAddress));
        setPositions(geocodedPositions.filter(position => position !== null));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties', error);
      }
    };

    fetchProperties();
  }, []);

  const geocodeAddress = async (property) => {
    const address = property.address;
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon), property };
      } else {
        console.error('No results found for address:', address);
      }
    } catch (error) {
      console.error('Error geocoding address', error);
    }
    return null;
  };

  const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <h1 className="text-4xl font-bold my-8">Explore Listings</h1>
      <div className="map-container w-full h-96 mb-8">
        {loading ? (
          <p>Loading map...</p>
        ) : (
          <MapContainer center={[43.65107, -79.347015]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {positions.map((position, index) => (
              <Marker key={index} position={[position.lat, position.lon]} icon={defaultIcon}>
                <Popup>
                  <div>
                    <h2>{position.property.address}</h2>
                    <p><strong>Price:</strong> ${position.property.purchasePrice}</p>
                    <p><strong>Bedrooms:</strong> {position.property.numBeds}</p>
                    <p><strong>Bathrooms:</strong> {position.property.numBaths}</p>
                    <p><strong>Type:</strong> {position.property.propertyType}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {properties.map(property => (
          <div key={property._id} className="property-card border rounded-lg shadow-lg overflow-hidden">
            {property.photos && property.photos.length > 0 && (
              <img src={property.photos[0]} alt={property.address} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">{property.address}</h2>
              <p className="text-gray-700 mb-2">{property.description}</p>
              <p className="text-gray-900 font-bold mb-2">${property.purchasePrice}</p>
              <p className="text-gray-600 mb-2"><strong>Bedrooms:</strong> {property.numBeds}</p>
              <p className="text-gray-600 mb-2"><strong>Bathrooms:</strong> {property.numBaths}</p>
              <p className="text-gray-600 mb-2"><strong>Type:</strong> {property.propertyType}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingExplore;