import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaTasks, FaProjectDiagram, FaUsers, FaUserShield } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/projects', icon: FaProjectDiagram, label: 'Projects' },
    { path: '/tasks', icon: FaTasks, label: 'Tasks' },
    { path: '/team', icon: FaUsers, label: 'Team' },
    { path: '/Admin', icon: FaUserShield, label: 'Admin' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-[260px] min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-6 border-r border-slate-800 sticky top-0"
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-10"
      >
        TaskFlow Pro
      </motion.h1>

      <motion.div
        className="flex flex-col gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;

          return (
            <motion.div key={link.path} variants={itemVariants}>
              <Link
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group ${isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                {/* Active Indicator Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Hover Background */}
                <div className="absolute inset-0 bg-slate-800/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Content */}
                <div className="relative z-10">
                  <Icon size={20} />
                </div>
                <span className="relative z-10 font-medium">{link.label}</span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute right-3 w-2 h-2 bg-cyan-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-6 right-6"
      >
        <div className="text-xs text-slate-500 text-center">
          <p className="mb-2">TaskFlow Pro</p>
          <p>v1.0.0</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
