import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Keyboard, ChevronDown } from 'lucide-react';

const ShortcutsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'H', description: 'Home' },
    { key: 'M', description: 'Mempool' },
    { key: 'F', description: 'Fees' },
    { key: 'N', description: 'News' },
    { key: '/', description: 'Search' },
    { key: 'R', description: 'Refresh' },
    { key: '?', description: 'All Shortcuts' }
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 text-xs opacity-70 hover:opacity-100"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="h-3.5 w-3.5 text-purple-400" />
        <span className="text-purple-300 text-xs font-medium">Shortcuts</span>
        <ChevronDown className={`h-3 w-3 text-purple-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-xl z-50"
            >
              <div className="p-4">
                <div className="space-y-2.5">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center py-1.5 px-2 rounded-lg hover:bg-purple-500/20 transition-colors">
                      <span className="text-sm text-gray-300">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-purple-800/50 rounded-md text-purple-300 text-xs font-mono border border-purple-600/30">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-purple-500/20">
                  <p className="text-xs text-gray-500 text-center">Press <kbd className="px-1 py-0.5 bg-purple-800/30 rounded text-purple-400 font-mono">?</kbd> for all shortcuts</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

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

  // Bitcoin logo SVG component
  const BitcoinLogo = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-orange-500"
    >
      <circle cx="16" cy="16" r="16" fill="currentColor"/>
      <path
        d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.113-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.181-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313L8.556 19.83l2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.874 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
        fill="white"
      />
    </svg>
  );

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
              <BitcoinLogo />
            </motion.div>
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Neet</span>
              <span className="text-white">BTC</span>
            </h1>
          </Link>

          {/* Right-aligned navigation with shortcuts */}
          <nav className="flex items-center justify-end space-x-6">
            {/* Shortcuts dropdown - positioned before nav items */}
            <ShortcutsDropdown />
            
            {/* Navigation items */}
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  href={item.path}
                  isActive={location.pathname === item.path}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </nav>
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