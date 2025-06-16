import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bitcoin, Search } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Check if it looks like a transaction ID (64 hex characters)
      if (/^[a-fA-F0-9]{64}$/.test(searchQuery.trim())) {
        // Open mempool.space transaction page
        window.open(`https://mempool.space/tx/${searchQuery.trim()}`, '_blank');
      } else if (/^[13bc1][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(searchQuery.trim())) {
        // Bitcoin address format - open address page
        window.open(`https://mempool.space/address/${searchQuery.trim()}`, '_blank');
      } else if (/^[0-9]{1,7}$/.test(searchQuery.trim())) {
        // Block height - open block page
        window.open(`https://mempool.space/block-height/${searchQuery.trim()}`, '_blank');
      } else {
        // Generic search - try as transaction first
        window.open(`https://mempool.space/tx/${searchQuery.trim()}`, '_blank');
      }
      setSearchQuery('');
    }
  };

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
            {/* Transaction Search */}
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transaction, address, or block..."
                  className="w-64 px-4 py-2 pl-10 text-sm bg-purple-900/20 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-purple-900/30 transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>

            {/* Mobile search button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const query = prompt('Enter transaction ID, address, or block height:');
                if (query) {
                  setSearchQuery(query);
                  // Trigger search logic
                  if (/^[a-fA-F0-9]{64}$/.test(query.trim())) {
                    window.open(`https://mempool.space/tx/${query.trim()}`, '_blank');
                  } else if (/^[13bc1][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(query.trim())) {
                    window.open(`https://mempool.space/address/${query.trim()}`, '_blank');
                  } else if (/^[0-9]{1,7}$/.test(query.trim())) {
                    window.open(`https://mempool.space/block-height/${query.trim()}`, '_blank');
                  } else {
                    window.open(`https://mempool.space/tx/${query.trim()}`, '_blank');
                  }
                }
              }}
              className="md:hidden flex items-center justify-center w-10 h-10 text-purple-300 bg-purple-900/20 rounded-lg hover:bg-purple-900/40 transition-colors"
            >
              <Search className="h-4 w-4" />
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