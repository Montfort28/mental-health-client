import React from 'react';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import QuickAccessMenu from '../../components/common/QuickAccessMenu';
import BackgroundPattern from '../../components/common/BackgroundPattern';
import { motion } from 'framer-motion';
import {
  Home,
  BarChart2,
  Heart,
  Book,
  Users,
  LogOut,
  Menu,
  X,
  Gamepad
} from 'lucide-react';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/';
  type NavItemName = 'Home' | 'Dashboard' | 'Mind Garden' | 'Resources' | 'Community' | 'Games';

  const navigation = [
    { name: 'Home' as NavItemName, href: '/Home' },
    { name: 'Dashboard' as NavItemName, href: '/Dashboard', protected: true },
    { name: 'Mind Garden' as NavItemName, href: '/Mind-Garden', protected: true },
    { name: 'Games' as NavItemName, href: '/Games', protected: true },
    { name: 'Resources' as NavItemName, href: '/Resources', protected: true },
    { name: 'Community' as NavItemName, href: '/Community', protected: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Return only the content for auth pages without any layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <BackgroundPattern />
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    );
  }

  const navIcons: Record<NavItemName, React.ReactElement> = {
    'Home': <Home className="w-5 h-5" />,
    'Dashboard': <BarChart2 className="w-5 h-5" />,
    'Mind Garden': <Heart className="w-5 h-5" />,
    'Games': <Gamepad className="w-5 h-5" />,
    'Resources': <Book className="w-5 h-5" />,
    'Community': <Users className="w-5 h-5" />
  };

  // Return the full layout for non-auth pages
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <BackgroundPattern />

      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <motion.div
                className="flex-shrink-0 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition-all"
                >
                  Safe Haven
                </Link>
              </motion.div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation
                  .filter((item) => !item.protected || isAuthenticated)
                  .map((item) => (
                    <motion.div
                      key={item.name}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <Link
                        to={item.href}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                          ${location.pathname === item.href
                            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                      >
                        <span className="mr-2">{navIcons[item.name]}</span>
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </div>

            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </motion.button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="sm:hidden overflow-hidden bg-white/80 backdrop-blur-md"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation
              .filter((item) => !item.protected || isAuthenticated)
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="inline-flex items-center">
                    <span className="mr-2">{navIcons[item.name]}</span>
                    {item.name}
                  </span>
                </Link>
              ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                <span className="inline-flex items-center">
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </span>
              </button>
            )}
          </div>
        </motion.div>
      </nav>

      {/* Main content */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* QuickAccessMenu */}
      <QuickAccessMenu />
    </div>
  );
};

export default Layout;