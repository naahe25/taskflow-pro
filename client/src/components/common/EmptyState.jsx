import { motion } from 'framer-motion';
import { FaFolderOpen } from 'react-icons/fa';

const EmptyState = ({ icon: Icon = FaFolderOpen, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="text-6xl text-slate-600 mb-4">
        <Icon />
      </div>
      <h3 className="text-2xl font-bold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-400 mb-6 max-w-sm">{description}</p>
      {action && action}
    </motion.div>
  );
};

export default EmptyState;
