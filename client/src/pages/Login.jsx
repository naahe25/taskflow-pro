import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();

  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siSecretKey, setSiSecretKey] = useState('');
  const [siShowPwd, setSiShowPwd] = useState(false);
  const [siShowSecret, setSiShowSecret] = useState(false);

  const [rName, setRName] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [rConfirm, setRConfirm] = useState('');
  const [rAdminEmail, setRAdminEmail] = useState('');
  const [rShowPwd, setRShowPwd] = useState(false);

  const [showGoogleMemberModal, setShowGoogleMemberModal] = useState(false);
  const [googleMemberEmail, setGoogleMemberEmail] = useState('');
  const [verifyingAdmin, setVerifyingAdmin] = useState(false);

  const [showSecretKeySetup, setShowSecretKeySetup] = useState(false);
  const [setupSecretKey, setSetupSecretKey] = useState('');
  const [setupSecretKeyConfirm, setSetupSecretKeyConfirm] = useState('');
  const [setupSecretShowPwd, setSetupSecretShowPwd] = useState(false);
  const [settingSecretKey, setSettingSecretKey] = useState(false);

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
      const loginData = {
        email: siEmail,
        password: siPassword,
      };
      if (role === 'Admin') {
        loginData.secretKey = siSecretKey;
      }
      const user = await login(loginData);
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
        name: rName,
        email: rEmail,
        password: rPassword,
        role,
        adminEmail: isAdmin ? undefined : rAdminEmail,
      });

      if (isAdmin && !user.secretKeySet) {
        setShowSecretKeySetup(true);
        setSetupSecretKey('');
        setSetupSecretKeyConfirm('');
      } else {
        toast.success(`Welcome to TaskFlow Pro, ${user.name}!`);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSecretKey = async (e) => {
    e.preventDefault();
    if (setupSecretKey !== setupSecretKeyConfirm) {
      toast.error('Secret keys do not match');
      return;
    }
    if (setupSecretKey.length < 6) {
      toast.error('Secret key must be at least 6 characters');
      return;
    }

    try {
      setSettingSecretKey(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        import.meta.env.PROD ? '/api/auth/set-secret-key' : 'http://localhost:5000/api/auth/set-secret-key',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ secretKey: setupSecretKey }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || 'Failed to set secret key');
        return;
      }

      toast.success('Secret key set successfully!');
      setShowSecretKeySetup(false);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Error setting secret key');
    } finally {
      setSettingSecretKey(false);
    }
  };

  const handleGoogleAdminVerification = async () => {
    if (!googleMemberEmail) {
      toast.error('Admin email is required');
      return;
    }

    try {
      setVerifyingAdmin(true);
      const response = await fetch(
        import.meta.env.PROD ? '/api/auth/verify-admin-email' : 'http://localhost:5000/api/auth/verify-admin-email',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminEmail: googleMemberEmail }),
        }
      );

      const data = await response.json();

      if (!data.valid) {
        toast.error(data.message || 'Admin email not found');
        return;
      }

      sessionStorage.setItem('googleAdminEmail', googleMemberEmail);
      setShowGoogleMemberModal(false);
      proceedWithGoogleAuth();
    } catch (err) {
      toast.error('Error verifying admin email');
    } finally {
      setVerifyingAdmin(false);
    }
  };

  const proceedWithGoogleAuth = () => {
    window.open(
      import.meta.env.PROD ? '/api/auth/google' : 'http://localhost:5000/api/auth/google',
      '_self'
    );
  };

  const googleLogin = () => {
    setShowGoogleMemberModal(true);
  };

  const handleGoogleAsAdmin = () => {
    sessionStorage.removeItem('googleAdminEmail');
    proceedWithGoogleAuth();
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

      <AnimatePresence>
        {showSecretKeySetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f1117] border border-slate-800 rounded-2xl p-7 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-2">Set Your Secret Key</h3>
              <p className="text-sm text-slate-400 mb-6">Create a unique secret key that you'll use to log in to your admin account. Make sure it's something you'll remember!</p>

              <form onSubmit={handleSetupSecretKey} className="space-y-4">
                <div className="relative">
                  <FaKey size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type={setupSecretShowPwd ? 'text' : 'password'}
                    placeholder="Secret key (min. 6 characters)"
                    value={setupSecretKey}
                    onChange={(e) => setSetupSecretKey(e.target.value)}
                    className={`${baseInput} pl-11 pr-12 py-3`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setSetupSecretShowPwd(!setupSecretShowPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {setupSecretShowPwd ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>

                <div className="relative">
                  <FaKey size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type={setupSecretShowPwd ? 'text' : 'password'}
                    placeholder="Confirm secret key"
                    value={setupSecretKeyConfirm}
                    onChange={(e) => setSetupSecretKeyConfirm(e.target.value)}
                    className={`${baseInput} pl-11 pr-4 py-3 ${setupSecretKeyConfirm && setupSecretKey !== setupSecretKeyConfirm
                      ? '!border-red-500 focus:!border-red-500'
                      : ''
                    }`}
                    required
                  />
                  {setupSecretKeyConfirm && setupSecretKey !== setupSecretKeyConfirm && (
                    <p className="text-red-400 text-xs mt-1 pl-1">Secret keys do not match</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={settingSecretKey || (setupSecretKeyConfirm.length > 0 && setupSecretKey !== setupSecretKeyConfirm)}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all mt-4"
                >
                  {settingSecretKey
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : 'Set Secret Key'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showGoogleMemberModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowGoogleMemberModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f1117] border border-slate-800 rounded-2xl p-7 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-2">Google Sign-In</h3>
              <p className="text-sm text-slate-400 mb-6">Are you joining as a Member account?</p>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setGoogleMemberEmail('');
                    setShowGoogleMemberModal(false);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                >
                  Yes, Join as Member
                </motion.button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#0f1117] text-slate-500">or</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleAsAdmin}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                >
                  Sign In as Admin
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowGoogleMemberModal(false)}
                  className="w-full py-2.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>

              <AnimatePresence>
                {googleMemberEmail !== '' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-700 overflow-hidden"
                  >
                    <label className="text-xs font-semibold text-slate-300 block mb-2">Admin Email</label>
                    <input
                      type="email"
                      placeholder="Enter admin's email"
                      value={googleMemberEmail}
                      onChange={(e) => setGoogleMemberEmail(e.target.value)}
                      className={`${baseInput} px-4 py-2 text-sm`}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={verifyingAdmin}
                      onClick={handleGoogleAdminVerification}
                      className="w-full mt-3 py-2.5 bg-cyan-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:shadow-lg transition-all"
                    >
                      {verifyingAdmin ? 'Verifying...' : 'Continue with Google'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

                    {isAdmin && (
                      <div className="relative">
                        <FaKey size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                        <input
                          type={siShowSecret ? 'text' : 'password'}
                          placeholder="Your secret key"
                          value={siSecretKey}
                          onChange={(e) => setSiSecretKey(e.target.value)}
                          className="w-full pl-11 pr-12 py-3 bg-purple-500/10 border border-purple-500/40 rounded-xl text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-500 transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setSiShowSecret(!siShowSecret)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          {siShowSecret ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                        </button>
                      </div>
                    )}

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

                    {!isAdmin && (
                      <div className="relative">
                        <FaEnvelope size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          placeholder="Admin email (optional - leave empty for standalone)"
                          value={rAdminEmail}
                          onChange={(e) => setRAdminEmail(e.target.value)}
                          className={`${baseInput} pl-11 pr-4 py-3`}
                        />
                      </div>
                    )}

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
