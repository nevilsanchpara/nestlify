import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Linkedin , Phone , Mail ,MapPin } from 'lucide-react';
import Lottie from 'lottie-react';
import footerGif from '../assets/footer-gif.json';
const Footer = () => {
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
          <p className="text-gray-400 mt-2">Lorem Ipsum has been the industry's standard.</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
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

        {/* Middle Section */}
        <div className="grid grid-cols-2 gap-4">
          {["Home", "About", "Explore", "Contact"].map((link, index) => (
            <Link
              key={index}
              to={`/${link.toLowerCase()}`}
              className="text-gray-400 hover:text-white transition-all duration-300"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div>
          <h4 className="font-bold">Reach Us</h4>
          <p className="text-gray-400 mt-2"><Phone />+1012 3456 789</p>
          <p className="text-gray-400 mt-1"><Mail /> demo@gmail.com</p>
          <p className="text-gray-400 mt-1"><MapPin /> 132 King Street, Ontario, Canada</p>

          {/* Image Placeholder */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mt-4 w-64 h-40 border border-gray-600 rounded-lg flex items-center justify-center bg-gray-800"
          > 
            <div className="w-48 h-48">
              <Lottie animationData={footerGif} loop={true} />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;