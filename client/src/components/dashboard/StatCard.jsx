import { motion } from 'framer-motion';
import Card from '../common/Card';

const StatCard = ({ icon: Icon, label, value, trend, color = 'cyan' }) => {
  const colorClasses = {
    cyan: 'from-cyan-500 to-blue-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-slate-700 to-transparent rounded-full opacity-50" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg text-white text-2xl`}>
            <Icon />
          </div>
          {trend && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm font-semibold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {trend > 0 ? '+' : ''}{trend}%
            </motion.span>
          )}
        </div>
        <p className="text-slate-400 text-sm mb-2">{label}</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white"
        >
          {value}
        </motion.p>
      </div>
    </Card>
  );
};

export default StatCard;
