import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaChevronDown, FaShieldAlt, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import Avatar from '../common/Avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isAdmin = user?.role === 'Admin';

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

      <div className="flex items-center gap-4">
        <motion.div className="relative" onMouseLeave={() => setShowMenu(false)}>
          <motion.button
            onClick={() => setShowMenu(!showMenu)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Avatar src={user?.avatar} name={user?.name} size="md" />
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <div className="flex items-center gap-1.5">
                {isAdmin ? (
                  <FaShieldAlt size={10} className="text-purple-400" />
                ) : (
                  <FaUser size={10} className="text-cyan-400" />
                )}
                <p className={`text-xs font-medium ${isAdmin ? 'text-purple-400' : 'text-cyan-400'}`}>
                  {user?.role}
                </p>
              </div>
            </div>
            <motion.div animate={{ rotate: showMenu ? 180 : 0 }} className="text-slate-400">
              <FaChevronDown size={12} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm text-slate-300 font-medium truncate">{user?.email}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block font-semibold ${isAdmin
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                    {isAdmin ? '⚡ Administrator' : '👤 Member'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-slate-700 text-red-400 flex items-center gap-2 transition-colors text-sm font-medium"
                >
                  <FaSignOutAlt /> Sign Out
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