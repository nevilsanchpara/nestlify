import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PropertyCard from "./PropertyCard";

const apiUrl = import.meta.env.VITE_API_URL;
const ListingExplore = () => {
  const [properties, setProperties] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const markerRefs = useRef([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/properties`);
        setProperties(response.data);
        const geocodedPositions = await Promise.all(response.data.map(geocodeAddress));
        const validPositions = geocodedPositions.filter((position) => position !== null);
        setPositions(validPositions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties", error);
      }
    };

    fetchProperties();
  }, []);

  const geocodeAddress = async (property) => {
    const address = property.address;
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=70206657263b425b8ad95de27ea1f3da`
      );
      if (response.data && response.data.features && response.data.features.length > 0) {
        const { lat, lon } = response.data.features[0].properties;
        return { lat: parseFloat(lat), lon: parseFloat(lon), property };
      } else {
        console.error("No results found for address:", address);
      }
    } catch (error) {
      console.error("Error geocoding address:", address, error);
    }
    return null;
  };

  const defaultIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const handleCardClick = (index) => {
    markerRefs.current[index].openPopup();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1">
        <div className="w-2/3 z-0" style={{ position: "relative", height: "calc(100vh - 64px)" }}>
          {loading ? (
            <p>Loading map...</p>
          ) : (
            <MapContainer center={[43.65107, -79.347015]} zoom={12} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {positions.map((position, index) => (
                <Marker key={index} position={[position.lat, position.lon]} icon={defaultIcon} ref={(el) => (markerRefs.current[index] = el)}>
                  <Popup>
                    <div>
                      <h2>{position.property.address}</h2>
                      <p>
                        <strong>Price:</strong> ${position.property.price}
                      </p>
                      <p>
                        <strong>Bedrooms:</strong> {position.property.bedrooms}
                      </p>
                      <p>
                        <strong>Bathrooms:</strong> {position.property.bathrooms}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Property Cards (List) */}
        <div className="w-1/3 overflow-y-scroll p-6 my-5" style={{ height: "calc(100vh - 64px)" }}>
  {properties.map((property, index) => (
    <PropertyCard key={property._id} property={property} onClick={() => handleCardClick(index)} />
  ))}
</div>

      </div>
    </div>
  );
};

export default ListingExplore;
