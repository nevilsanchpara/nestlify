import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaHeart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const apiUrl = import.meta.env.VITE_API_URL;

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage after login

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProperty(data);

        if (userId) {
          const wishlistResponse = await fetch(`${apiUrl}/api/wishlist/${userId}`);
          const wishlistData = await wishlistResponse.json();
          setIsWishlisted(wishlistData.properties.some(p => p._id === data._id));
        }
      } catch (error) {
        console.error('Failed to fetch property:', error);
      }
    };
    fetchProperty();
  }, [id, userId]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!userId) {
      alert("You need to be logged in to add properties to your wishlist.");
      navigate('/login'); // Redirect to login page
      return;
    }

    try {
      if (isWishlisted) {
        await fetch(`${apiUrl}/api/wishlist/${userId}/${property._id}`, {
          method: 'DELETE',
        });
      } else {
        await fetch(`${apiUrl}/api/wishlist/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, propertyId: property._id }),
        });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Swiper navigation modules={[Navigation]} className="w-full h-96">
          {property.photos.map((photo, index) => (
            <SwiperSlide key={index}>
              <img src={photo} alt={`Property ${index}`} className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="p-4">
          <button
            onClick={toggleWishlist}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg z-10 hover:scale-110 transition-transform"
          >
            <FaHeart className={isWishlisted ? "text-red-600" : "text-gray-400"} size={22} />
          </button>

          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{property.title}</h2>
              <p className="text-gray-600 flex items-center mt-1">
                <FaMapMarkerAlt className="text-red-500 mr-2" /> {property.address}
              </p>
              <p className="text-lg font-semibold text-blue-600">${property.price.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Available from: {new Date(property.availableFrom).toLocaleDateString()}</p>
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
              <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                <p className="text-gray-600">Name: {property.postedBy.firstName} {property.postedBy.lastName}</p>
                <p className="text-gray-600">Phone: {property.contactPhone}</p>
                <p className="text-gray-600">Email: {property.contactEmail}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Description</h3>
            <p className="text-gray-600">{property.description}</p>
          </div>

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