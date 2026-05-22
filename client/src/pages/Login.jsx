import { motion } from 'framer-motion';
import { FaCheckCircle, FaUsers, FaTasks, FaChartLine } from 'react-icons/fa';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

const Login = () => {
  const features = [
    { icon: FaTasks, title: 'Task Management', desc: 'Organize and track work efficiently' },
    { icon: FaUsers, title: 'Team Collaboration', desc: 'Work together seamlessly' },
    { icon: FaChartLine, title: 'Progress Tracking', desc: 'Monitor team performance' },
    { icon: FaCheckCircle, title: 'Project Control', desc: 'Full project oversight' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <motion.div variants={itemVariants} className="hidden md:block">
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
            >
              TaskFlow Pro
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-400 mb-12"
            >
              Manage projects and tasks with exceptional efficiency
            </motion.p>

            <div className="space-y-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-4"
                >
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-lg text-white flex-shrink-0">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Login Card */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="w-full max-w-sm mx-auto"
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Glowing Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />

              <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-8 rounded-2xl border border-slate-700/50">
                <motion.h2
                  variants={itemVariants}
                  className="text-3xl font-bold text-white mb-2"
                >
                  Welcome Back
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="text-slate-400 mb-8"
                >
                  Sign in with Google to get started
                </motion.p>

                <motion.div variants={itemVariants}>
                  <GoogleLoginButton />
                </motion.div>

                <motion.p
                  variants={itemVariants}
                  className="text-xs text-slate-500 text-center mt-6"
                >
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;