import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import sample from '../assets/sample.mp4';

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Parallax Effect
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section ref={ref} className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={sample} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/35"></div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-white px-6"
      >
        <motion.h1 
          style={{ y: titleY }} 
          className="text-4xl md:text-5xl font-bold"
        >
          Experience the Future of Innovation
        </motion.h1>

        {/* Search Bar
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 1 }}
          className="mt-6 mx-auto w-full max-w-lg flex items-center bg-white/20 dark:bg-gray-800 backdrop-blur-lg rounded-full overflow-hidden border border-white/30 shadow-lg"
        >
          <input 
            type="text" 
            placeholder="Search for something..."
            className="flex-1 px-4 py-3 text-gray-200 bg-transparent outline-none placeholder-gray-300"
          />
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-3 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            SEARCH
          </motion.button>
        </motion.div> */}

        {/* Call to Action */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          className="mt-6 bg-white/20 dark:bg-gray-800 backdrop-blur-lg px-6 py-3 rounded-full text-white font-semibold border border-white/30 hover:bg-white/30 dark:hover:bg-gray-700 transition"
        >
          EXPLORE MORE
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;