import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const apiUrl = import.meta.env.VITE_API_URL;

const PropertyCard = ({ property, onClick }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const sessionToken = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        if (user?._id) {
          const wishlistResponse = await fetch(`${apiUrl}/api/wishlist/${user._id}`, {
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
            },
          });
          const wishlistData = await wishlistResponse.json();
          setIsWishlisted(wishlistData.properties.some(p => p._id === property._id));
        }
      } catch (error) {
        console.error('Failed to fetch wishlist status:', error);
      }
    };
    fetchWishlistStatus();
  }, [property._id, user?._id, sessionToken]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user?._id) {
      alert("You need to be logged in to add properties to your wishlist.");
      navigate('/login'); // Redirect to login page
      return;
    }

    try {
      if (isWishlisted) {
        await fetch(`${apiUrl}/api/wishlist/${user._id}/${property._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
          },
        });
      } else {
        await fetch(`${apiUrl}/api/wishlist/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ userId: user._id, propertyId: property._id }),
        });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden relative cursor-pointer transition-transform transform hover:scale-105" onClick={onClick}>
      <button
        onClick={toggleWishlist}
        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg z-10 hover:scale-110 transition-transform"
      >
        <FaHeart className={isWishlisted ? "text-red-600" : "text-gray-400"} size={22} />
      </button>

      <Swiper navigation modules={[Navigation]} className="w-full h-64">
        {property.photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <img src={photo} alt={`Property ${index}`} className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-blue-600">${property.price.toLocaleString()}</span>
          <span className="text-gray-500 text-sm">Available from: {new Date(property.availableFrom).toLocaleDateString()}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mt-1">{property.title}</h3>

        <p className="text-gray-600 flex items-center mt-1">
          <FaMapMarkerAlt className="text-red-500 mr-2" /> {property.address}
        </p>

        <div className="flex items-center gap-4 mt-2 text-gray-600">
          <span className="flex items-center gap-1">
            <FaBed className="text-indigo-600" /> {property.bedrooms} Bed
          </span>
          <span className="flex items-center gap-1">
            <FaBath className="text-indigo-600" /> {property.bathrooms} Bath
          </span>
        </div>

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