import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = () => {
  const googleLogin = () => {
    window.open(
      import.meta.env.PROD
        ? '/api/auth/google'
        : 'http://localhost:5000/api/auth/google',
      '_self'
    );
  };

  return (
    <motion.button
      onClick={googleLogin}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <FcGoogle size={24} />
      Continue with Google
    </motion.button>
  );
};

export default GoogleLoginButton;
