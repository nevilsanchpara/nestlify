import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaBath, FaBed, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

const PropertyCard = ({ property, onClick }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(savedWishlist.includes(property._id));
  }, [property._id]);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    let savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (isWishlisted) {
      savedWishlist = savedWishlist.filter((id) => id !== property._id);
    } else {
      savedWishlist.push(property._id);
    }
    localStorage.setItem("wishlist", JSON.stringify(savedWishlist));
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden relative cursor-pointer transition-transform transform hover:scale-105" onClick={onClick}>
      
      {/* Wishlist Button (Now Clearly Visible on Top Right) */}
      <button
        onClick={toggleWishlist}
        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg z-10 hover:scale-110 transition-transform"
      >
        <FaHeart className={isWishlisted ? "text-red-600" : "text-gray-400"} size={22} />
      </button>

      {/* Image Carousel */}
      <Swiper navigation modules={[Navigation]} className="w-full h-64">
        {property.photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <img src={photo} alt={`Property ${index}`} className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Property Details */}
      <div className="p-4">
        {/* Price & Status */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-blue-600">${property.price.toLocaleString()}</span>
          <span className="text-gray-500 text-sm">Available from: {new Date(property.availableFrom).toLocaleDateString()}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mt-1">{property.title}</h3>

        {/* Location */}
        <p className="text-gray-600 flex items-center mt-1">
          <FaMapMarkerAlt className="text-red-500 mr-2" /> {property.address}
        </p>

        {/* Bedrooms & Bathrooms */}
        <div className="flex items-center gap-4 mt-2 text-gray-600">
          <span className="flex items-center gap-1">
            <FaBed className="text-indigo-600" /> {property.bedrooms} Bed
          </span>
          <span className="flex items-center gap-1">
            <FaBath className="text-indigo-600" /> {property.bathrooms} Bath
          </span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/property/${property._id}`}
          className="block text-center mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
