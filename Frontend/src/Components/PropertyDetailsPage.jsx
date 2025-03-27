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
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const sessionToken = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProperty(data);

        if (user?._id) {
          const wishlistResponse = await fetch(`${apiUrl}/api/wishlist/${user._id}`, {
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
            },
          });
          const wishlistData = await wishlistResponse.json();
          setIsWishlisted(wishlistData.properties.some(p => p._id === data._id));
        }
      } catch (error) {
        console.error('Failed to fetch property:', error);
      }
    };
    fetchProperty();
  }, [id, user?._id, sessionToken]);

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

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/properties/${id}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        throw new Error('Failed to send inquiry.');
      }

      const data = await response.json();
      alert(data.message);
      setContact({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send inquiry:', error);
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {/* Image Carousel */}
      <div className="relative">
        <Swiper navigation modules={[Navigation]} className="w-full h-96 rounded-lg">
          {property.photos.map((photo, index) => (
            <SwiperSlide key={index}>
              <img src={photo} alt={`Property ${index}`} className="w-full h-full object-cover rounded-lg" />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          <FaHeart className={isWishlisted ? "text-red-500" : "text-gray-400"} size={24} />
        </button>
      </div>

      {/* Property Details */}
      <div className="p-6 space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800">{property.title}</h2>

        {/* Address & Price */}
        <div className="flex items-center gap-2 text-gray-600">
          <FaMapMarkerAlt className="text-red-500" />
          <p>{property.address}</p>
        </div>
        <p className="text-xl font-semibold text-blue-600">${property.price.toLocaleString()}</p>

        {/* Availability & Features */}
        <p className="text-gray-500 text-sm">Available from: {new Date(property.availableFrom).toLocaleDateString()}</p>
        <div className="flex items-center gap-6 text-gray-600 text-lg">
          <span className="flex items-center gap-1">
            <FaBed className="text-indigo-600" /> {property.bedrooms} Bed
          </span>
          <span className="flex items-center gap-1">
            <FaBath className="text-indigo-600" /> {property.bathrooms} Bath
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Description</h3>
          <p className="text-gray-600">{property.description}</p>
        </div>

        {/* Amenities */}
        {property.amenities && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Amenities</h3>
            <ul className="grid grid-cols-2 gap-2 text-gray-600">
              {property.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center gap-2">
                  ✅ {amenity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Form */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Contact the Owner</h3>
          <form onSubmit={handleContactSubmit} className="mt-4 space-y-3">
            <input
              type="text"
              name="name"
              value={contact.name}
              onChange={handleContactChange}
              placeholder="Your Name"
              className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
              required
            />
            <input
              type="email"
              name="email"
              value={contact.email}
              onChange={handleContactChange}
              placeholder="Your Email"
              className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
              required
            />
            <textarea
              name="message"
              value={contact.message}
              onChange={handleContactChange}
              placeholder="Message"
              rows="4"
              className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
              required
            />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;