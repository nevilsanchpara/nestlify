import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';

const counterVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const circleVariants = {
  hidden: { pathLength: 0 },
  visible: { pathLength: 1, transition: { duration: 1 } },
};

const StatsCounter = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const stats = [
    { value: 500, label: 'Listings' },
    { value: 300, label: 'Happy Clients' },
    { value: 200, label: 'Landlords' },
    { value: 150, label: 'Locations' },
  ];

  return (
    <section ref={ref} className="py-12 bg-gray-100">
      <div className="container mx-auto text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
              <motion.div
                initial="hidden"
                animate={controls}
                variants={counterVariants}
                className="relative flex items-center justify-center mb-4"
              >
                <svg className="w-24 h-24">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="5%"
                    className="text-gray-300"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="5%"
                    className="text-indigo-600"
                    fill="transparent"
                    variants={circleVariants}
                  />
                </svg>
                <motion.span className="absolute text-3xl font-bold text-indigo-600">
                  {stat.value}
                </motion.span>
              </motion.div>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;