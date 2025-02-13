import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';
import PopularCities from './PopularCities';
import StatsCounter from './StatsCounter';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <HeroSection />
      <PopularCities />
      <StatsCounter />
    </div>
  );
}

export default Home;