import React from 'react';
import { motion } from 'framer-motion';
import { Link ,useNavigate } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import Lottie from 'lottie-react';
import footerGif from '../assets/footer-gif.json';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-gray-900 text-white px-8 py-12"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div>
          <h3 className="text-lg font-bold">Stay Connected</h3>
          <p className="text-gray-400 mt-2">We make it easy to find affordable homes that fit your needs. Stay updated with the latest listings and housing insights.</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate("/about")}
            className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-full shadow-md hover:bg-gray-200"
          >
            Learn More →
          </motion.button>
          <div className="flex space-x-4 mt-4 text-lg">
            <motion.a whileHover={{ scale: 1.2 }} href="#"><Twitter /></motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#"><Instagram /></motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#"><Facebook /></motion.a>
            <motion.a whileHover={{ scale: 1.2 }} href="#"><Linkedin /></motion.a>
          </div>
        </div>

        {/* Middle Section - Improved Layout */}
        <div className="flex flex-col space-y-2 text-gray-400">
          <h4 className="font-bold text-white">Quick Links</h4>
          {["Home", "About", "Explore", "Contact"].map((link, index) => (
            <Link
              key={index}
              to={`/${link.toLowerCase()}`}
              className="hover:text-white transition-all duration-300"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Right Section - Reach Us & Lottie Animation Side by Side */}
<div className="flex justify-between space-x-6">
  {/* Contact Details */}
  <div className="flex flex-col space-y-3">
    <h4 className="font-bold text-white">Reach Us</h4>
    <div className="flex items-center space-x-2 text-gray-400">
      <Phone className="w-5 h-5 text-white" />
      <span>+1012 3456 789</span>
    </div>
    <div className="flex items-center space-x-2 text-gray-400">
      <Mail className="w-5 h-5 text-white" />
      <span>demo@gmail.com</span>
    </div>
    <div className="flex items-center space-x-2 text-gray-400">
      <MapPin className="w-5 h-5 text-white" />
      <span>132 King Street, Ontario, Canada</span>
    </div>
  </div>

  {/* Lottie Animation */}
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="w-40 h-40"
  >
    <Lottie animationData={footerGif} loop={true} />
  </motion.div>
</div>

      </div>
    </motion.footer>
  );
};

export default Footer;
