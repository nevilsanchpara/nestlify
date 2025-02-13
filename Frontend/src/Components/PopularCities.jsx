import React from 'react';

const PopularCities = () => {
  const cities = [
    { name: 'Toronto', image: 'toronto.jpg' },
    { name: 'Vancouver', image: 'vancouver.jpg' },
    { name: 'Montreal', image: 'montreal.jpg' },
    { name: 'Calgary', image: 'calgary.jpg' },
    // Add more cities as needed
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Popular Cities to Rent</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cities.map((city, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={city.image} alt={city.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold">{city.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;