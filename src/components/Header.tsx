import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bitcoin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ['rgba(17, 24, 39, 0)', 'rgba(17, 24, 39, 0.8)']
  );

  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ['rgba(107, 33, 168, 0)', 'rgba(107, 33, 168, 0.2)']
  );

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  const navItems = [
    { name: 'Mempool', path: '/mempool' },
    { name: 'Fees', path: '/fees' },
    { name: 'News', path: '/news' }
  ];

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        borderBottom: `1px solid`,
        borderColor: headerBorder,
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Bitcoin className="h-8 w-8 text-orange-500" />
            </motion.div>
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Neet</span>
              <span className="text-white">BTC</span>
            </h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                href={item.path}
                isActive={location.pathname === item.path}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex px-4 py-2 text-sm font-medium text-purple-300 bg-purple-900/20 rounded-lg hover:bg-purple-900/40 transition-colors"
            >
              Connect Wallet
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}

const NavLink = ({ href, children, isActive }: NavLinkProps) => {
  return (
    <Link
      to={href}
      className="relative group"
    >
      <motion.span
        className={`text-sm font-medium transition-colors ${
          isActive ? 'text-purple-400' : 'text-gray-300 hover:text-purple-300'
        }`}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-500"
          initial={false}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
};