import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

const Navbar = () => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center mb-10 pb-6 border-b border-slate-700"
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          TaskFlow Pro
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <motion.div
          className="relative"
          onMouseLeave={() => setShowMenu(false)}
        >
          <motion.button
            onClick={() => setShowMenu(!showMenu)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Avatar src={user?.avatar} name={user?.name} size="md" />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
            <motion.div
              animate={{ rotate: showMenu ? 180 : 0 }}
              className="text-slate-400"
            >
              <FaChevronDown size={12} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm text-slate-300">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 hover:bg-slate-700 text-red-400 flex items-center gap-2 transition-colors"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Navbar;
