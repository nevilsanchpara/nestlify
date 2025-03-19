import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css'; // Updated import path for swiper styles
import 'swiper/css/navigation'; // Import navigation styles
import 'swiper/css/pagination'; // Import pagination styles (if needed)

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProperty(data);
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setIsWishlisted(savedWishlist.includes(data._id));
      } catch (error) {
        console.error('Failed to fetch property:', error);
      }
    };
    fetchProperty();
  }, [id]);

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

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Carousel */}
        <Swiper navigation modules={[Navigation]} className="w-full h-96">
          {property.photos.map((photo, index) => (
            <SwiperSlide key={index}>
              <img src={photo} alt={`Property ${index}`} className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="p-4">
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg z-10 hover:scale-110 transition-transform"
          >
            <FaHeart className={isWishlisted ? "text-red-600" : "text-gray-400"} size={22} />
          </button>

          {/* Property Details */}
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800">{property.title}</h2>

              {/* Address */}
              <p className="text-gray-600 flex items-center mt-1">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> {property.address}
              </p>

              {/* Price */}
              <p className="text-lg font-semibold text-blue-600">${property.price.toLocaleString()}</p>

              {/* Available From */}
              <p className="text-gray-500 text-sm">Available from: {new Date(property.availableFrom).toLocaleDateString()}</p>

              {/* Bedrooms & Bathrooms */}
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <span className="flex items-center gap-1">
                  <FaBed className="text-indigo-600" /> {property.bedrooms} Bed
                </span>
                <span className="flex items-center gap-1">
                  <FaBath className="text-indigo-600" /> {property.bathrooms} Bath
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              {/* Contact Information */}
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                <p className="text-gray-600">Name: {property.postedBy.firstName} {property.postedBy.lastName}</p>
                <p className="text-gray-600">Phone: {property.contactPhone}</p>
                <p className="text-gray-600">Email: {property.contactEmail}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Description</h3>
            <p className="text-gray-600">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Amenities</h3>
              <ul className="list-disc list-inside text-gray-600">
                {property.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;