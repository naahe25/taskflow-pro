import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: '0 20px 25px -5 rgba(0, 0, 0, 0.3)' } : {}}
      className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
