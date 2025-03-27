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
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    price: "",
    bedrooms: "",
    bathrooms: "",
  });
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
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(property.address)}&apiKey=70206657263b425b8ad95de27ea1f3da`
      );
      if (response.data?.features?.length > 0) {
        const { lat, lon } = response.data.features[0].properties;
        return { lat: parseFloat(lat), lon: parseFloat(lon), property };
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
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

  const handleSearchChange = (e) => setSearchInput(e.target.value);

  const handleFilterChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: e.target.value,
    }));
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.address.toLowerCase().includes(searchInput.toLowerCase());
    return (
      matchesSearch &&
      (!filters.price || property.price <= filters.price) &&
      (!filters.bedrooms || property.bedrooms >= filters.bedrooms) &&
      (!filters.bathrooms || property.bathrooms >= filters.bathrooms)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🔎 Modern Search & Filter Bar */}
      <div className="w-full px-6 py-4 bg-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          placeholder="🔍 Search by address"
          value={searchInput}
          onChange={handleSearchChange}
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />

        <div className="flex flex-wrap items-center gap-4">
          {[
            { label: "Max Price", name: "price", type: "number" },
            { label: "Min Bedrooms", name: "bedrooms", type: "number" },
            { label: "Min Bathrooms", name: "bathrooms", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={filters[name]}
                onChange={handleFilterChange}
                className="w-28 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 📍 Map & Listings Section (Flipped Layout) */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* 🌍 Map (Now on the left) */}
        <div className="w-full md:w-2/3 relative z-0" style={{ height: "calc(100vh - 72px)" }}>
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Loading map...</p>
          ) : (
            <MapContainer center={[43.65107, -79.347015]} zoom={12} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {positions.map((position, index) => (
                <Marker key={index} position={[position.lat, position.lon]} icon={defaultIcon} ref={(el) => (markerRefs.current[index] = el)}>
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-semibold text-gray-800">{position.property.address}</h3>
                      <p className="text-gray-600">
                        <strong>💰 Price:</strong> ${position.property.price.toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        <strong>🛏 Bedrooms:</strong> {position.property.bedrooms}
                      </p>
                      <p className="text-gray-600">
                        <strong>🛁 Bathrooms:</strong> {position.property.bathrooms}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* 🏡 Property Listings (Now on the right) */}
        <div className="w-full md:w-1/3 overflow-y-scroll p-6 space-y-4 bg-white shadow-lg" style={{ height: "calc(100vh - 72px)" }}>
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property, index) => (
              <PropertyCard key={property._id} property={property} onClick={() => handleCardClick(index)} />
            ))
          ) : (
            <p className="text-gray-500 text-center mt-10">No properties match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingExplore;
