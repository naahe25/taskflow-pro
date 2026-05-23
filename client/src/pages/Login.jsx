import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaEye, FaEyeSlash, FaShieldAlt, FaUser,
  FaEnvelope, FaLock, FaIdCard, FaKey,
  FaTasks, FaUsers, FaChartLine, FaCheckCircle,
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [tab, setTab] = useState('signin');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);

  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siShowPwd, setSiShowPwd] = useState(false);

  const [rName, setRName] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [rConfirm, setRConfirm] = useState('');
  const [rAdminKey, setRAdminKey] = useState('');
  const [rShowPwd, setRShowPwd] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const isAdmin = role === 'Admin';
  const gradient = isAdmin ? 'from-purple-500 to-pink-500' : 'from-cyan-500 to-blue-500';
  const inputFocus = isAdmin ? 'focus:border-purple-500' : 'focus:border-cyan-500';
  const baseInput = `w-full bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-colors ${inputFocus}`;

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(siEmail, siPassword);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (rPassword !== rConfirm) { toast.error('Passwords do not match'); return; }
    if (rPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      setLoading(true);
      const user = await register({
        name: rName, email: rEmail, password: rPassword,
        role, adminKey: isAdmin ? rAdminKey : undefined,
      });
      toast.success(`Welcome to TaskFlow Pro, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    window.open(
      import.meta.env.PROD ? '/api/auth/google' : 'http://localhost:5000/api/auth/google',
      '_self'
    );
  };

  const features = [
    { icon: FaTasks, title: 'Task Management', desc: 'Create, assign and track tasks across all projects' },
    { icon: FaUsers, title: 'Team Collaboration', desc: 'Invite members and work together in real time' },
    { icon: FaChartLine, title: 'Progress Tracking', desc: 'Visual dashboards to monitor team performance' },
    { icon: FaCheckCircle, title: 'Full Project Control', desc: 'End-to-end oversight from creation to delivery' },
  ];

  const Divider = () => (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-slate-700" />
      <span className="text-xs text-slate-500 font-medium">or</span>
      <div className="flex-1 h-px bg-slate-700" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className={`absolute -top-48 -right-48 w-[500px] h-[500px] bg-gradient-to-br ${gradient} opacity-[0.04] rounded-full blur-3xl pointer-events-none`} />
      <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-gradient-to-br from-blue-600 to-purple-600 opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Left — Branding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
              <FaTasks className="text-white" size={22} />
            </div>
            <h1 className={`text-3xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent tracking-tight`}>
              TaskFlow Pro
            </h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <p className="text-2xl font-bold text-white mb-2">
                {isAdmin ? 'Administrator Portal' : 'Team Collaboration Hub'}
              </p>
              <p className="text-slate-400 mb-10 leading-relaxed text-sm">
                {isAdmin
                  ? 'Manage your entire organization. Control user access, oversee every project, and drive results from a single command center.'
                  : 'Join your team, track every task, collaborate on projects, and deliver exceptional results faster than ever before.'}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="space-y-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.2 }}
                className="flex items-start gap-4"
              >
                <div className={`p-2.5 bg-gradient-to-br ${gradient} rounded-xl shrink-0 shadow-lg opacity-90`}>
                  <f.icon className="text-white" size={16} />
                </div>
                <div>
                  <p className="font-semibold text-slate-200 text-sm">{f.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { value: 'member', label: 'Member', icon: FaUser, g: 'from-cyan-500 to-blue-500', shadow: 'shadow-cyan-500/20' },
              { value: 'Admin', label: 'Admin', icon: FaShieldAlt, g: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20' },
            ].map(({ value, label, icon: Icon, g, shadow }) => (
              <motion.button
                key={value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRole(value)}
                className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border text-sm ${role === value
                    ? `bg-gradient-to-r ${g} text-white border-transparent shadow-lg ${shadow}`
                    : 'bg-slate-900 text-slate-400 border-slate-700/60 hover:border-slate-500 hover:text-slate-200'
                  }`}
              >
                <Icon size={13} /> {label}
              </motion.button>
            ))}
          </div>

          {/* Card */}
          <div className="relative group">
            <div className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-2xl blur opacity-[0.18] group-hover:opacity-[0.30] transition duration-500`} />
            <div className="relative bg-[#0f1117] p-7 rounded-2xl border border-slate-800">

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {tab === 'signin' ? 'Sign in' : 'Create account'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {tab === 'signin'
                      ? 'Enter your credentials to continue'
                      : 'Fill in your details to get started'}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${gradient} text-white shrink-0 ml-2`}>
                  {isAdmin ? '⚡ Admin' : '👤 Member'}
                </span>
              </div>

              {/* Tab switcher */}
              <div className="flex bg-slate-800/80 rounded-xl p-1 mb-6">
                {[['signin', 'Sign In'], ['register', 'Create Account']].map(([t, label]) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tab === t
                        ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                        : 'text-slate-500 hover:text-slate-300'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">

                {/* SIGN IN FORM */}
                {tab === 'signin' && (
                  <motion.form
                    key="signin"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSignIn}
                    className="space-y-3"
                  >
                    <div className="relative">
                      <FaEnvelope size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={siEmail}
                        onChange={(e) => setSiEmail(e.target.value)}
                        className={`${baseInput} pl-11 pr-4 py-3`}
                        required
                      />
                    </div>

                    <div className="relative">
                      <FaLock size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={siShowPwd ? 'text' : 'password'}
                        placeholder="Password"
                        value={siPassword}
                        onChange={(e) => setSiPassword(e.target.value)}
                        className={`${baseInput} pl-11 pr-12 py-3`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setSiShowPwd(!siShowPwd)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {siShowPwd ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 bg-gradient-to-r ${gradient} text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg mt-1`}
                    >
                      {loading
                        ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : `Sign In as ${isAdmin ? 'Admin' : 'Member'}`}
                    </motion.button>

                    <Divider />

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={googleLogin}
                      className="w-full py-3 bg-white text-slate-900 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 hover:bg-slate-100 transition-colors shadow-lg"
                    >
                      <FcGoogle size={18} /> Continue with Google
                    </motion.button>
                  </motion.form>
                )}

                {/* REGISTER FORM */}
                {tab === 'register' && (
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleRegister}
                    className="space-y-3"
                  >
                    <div className="relative">
                      <FaIdCard size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Full name"
                        value={rName}
                        onChange={(e) => setRName(e.target.value)}
                        className={`${baseInput} pl-11 pr-4 py-3`}
                        required
                      />
                    </div>

                    <div className="relative">
                      <FaEnvelope size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={rEmail}
                        onChange={(e) => setREmail(e.target.value)}
                        className={`${baseInput} pl-11 pr-4 py-3`}
                        required
                      />
                    </div>

                    <div className="relative">
                      <FaLock size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={rShowPwd ? 'text' : 'password'}
                        placeholder="Password (min. 6 characters)"
                        value={rPassword}
                        onChange={(e) => setRPassword(e.target.value)}
                        className={`${baseInput} pl-11 pr-12 py-3`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setRShowPwd(!rShowPwd)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {rShowPwd ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                      </button>
                    </div>

                    <div className="relative">
                      <FaLock size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={rConfirm}
                        onChange={(e) => setRConfirm(e.target.value)}
                        className={`${baseInput} pl-11 pr-4 py-3 ${rConfirm && rPassword !== rConfirm
                            ? '!border-red-500 focus:!border-red-500'
                            : ''
                          }`}
                        required
                      />
                      {rConfirm && rPassword !== rConfirm && (
                        <p className="text-red-400 text-xs mt-1 pl-1">Passwords do not match</p>
                      )}
                    </div>

                    {/* Admin Key — animated reveal */}
                    <AnimatePresence>
                      {isAdmin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="relative pt-1">
                            <FaKey size={13} className="absolute left-4 top-1/2 mt-0.5 -translate-y-1/2 text-purple-400" />
                            <input
                              type="password"
                              placeholder="Admin registration key"
                              value={rAdminKey}
                              onChange={(e) => setRAdminKey(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-purple-500/10 border border-purple-500/40 rounded-xl text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-500 transition-colors"
                              required
                            />
                          </div>
                          <p className="text-xs text-purple-400/60 mt-1.5 pl-1">
                            A secret key is required to create administrator accounts.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading || (rConfirm.length > 0 && rPassword !== rConfirm)}
                      className={`w-full py-3 bg-gradient-to-r ${gradient} text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg mt-1`}
                    >
                      {loading
                        ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : `Create ${isAdmin ? 'Admin' : 'Member'} Account`}
                    </motion.button>

                    <Divider />

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={googleLogin}
                      className="w-full py-3 bg-white text-slate-900 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 hover:bg-slate-100 transition-colors shadow-lg"
                    >
                      <FcGoogle size={18} /> Continue with Google
                    </motion.button>
                  </motion.form>
                )}

              </AnimatePresence>

              <p className="text-[11px] text-slate-600 text-center mt-5">
                By continuing you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;