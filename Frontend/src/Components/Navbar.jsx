import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Moon, Sun, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    setUser(userData);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', id: '/' },
    { name: 'Explore', id: '/explore' },
    { name: 'Contact', id: '/contact' },
    { name: user ? 'Logout' : 'Login/Register', id: user ? '/logout' : '/login' },
  ];

  if (user && user.role === 'admin') {
    navLinks.push({ name: 'Admin', id: '/admin' });
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/50 dark:bg-gray-900/80 backdrop-blur-md shadow-md z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div whileHover={{ scale: 1.1 }} className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Nestlify
        </motion.div>

        <div className="hidden md:flex space-x-6">
          {navLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.id}
              whileHover={{ scale: 1.1 }}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              onClick={link.name === 'Logout' ? handleLogout : null}
            >
              {link.name}
            </motion.a>
          ))}
        </div>

        <div className="hidden md:flex space-x-4 items-center">
          <motion.button whileHover={{ scale: 1.2 }} className="text-2xl text-gray-700 dark:text-gray-300" onClick={() => setShowSearch(!showSearch)}>
            <Search />
          </motion.button>
          <motion.button whileHover={{ scale: 1.2 }} className="text-2xl text-gray-700 dark:text-gray-300" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun /> : <Moon />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.2 }} className="text-2xl text-gray-700 dark:text-gray-300">
            <ShoppingBag />
          </motion.button>
        </div>

        <button className="md:hidden text-gray-900 dark:text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md">
            {navLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.id}
                whileHover={{ scale: 1.1 }}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-lg transition-all duration-300 block px-6 py-4"
                onClick={link.name === 'Logout' ? handleLogout : null}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-lg m-4">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <input type="text" placeholder="Search..." className="w-full px-4 py-2 text-gray-900 dark:text-white bg-transparent outline-none" />
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                <Search />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;