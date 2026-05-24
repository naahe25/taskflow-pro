import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaProjectDiagram, FaTasks, FaUsers, FaChartBar, FaInfoCircle } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import useAuth from '../hooks/useAuth';
import { getDashboardStats } from '../services/statsService';
import StatCard from '../components/dashboard/StatCard';
import Skeleton from '../components/common/Skeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeProjectsCount: 0,
    tasksCount: 0,
    teamMembersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isUnlinkedMember = user && user.role === 'member' && !user.isLinked && user.email === user.workspaceAdminEmail;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="p-8"
      >
        <Navbar />

        {isUnlinkedMember && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-4"
          >
            <FaInfoCircle className="text-blue-400 text-lg mt-1 shrink-0" />
            <div>
              <p className="text-blue-300 font-semibold mb-1">Standalone Account</p>
              <p className="text-blue-200/80 text-sm">
                Your account is not linked to any admin workspace. To join a team, ask your admin to add you, or you can start your own as an admin.
              </p>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-slate-400">Here's what's happening on your projects</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {loading ? (
            <>
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </>
          ) : (
            <>
              <StatCard
                icon={FaProjectDiagram}
                label="Active Projects"
                value={stats.activeProjectsCount}
                color="cyan"
                trend={12}
              />
              <StatCard
                icon={FaTasks}
                label="Total Tasks"
                value={stats.tasksCount}
                color="blue"
                trend={8}
              />
              <StatCard
                icon={FaUsers}
                label="Team Members"
                value={stats.teamMembersCount}
                color="purple"
                trend={5}
              />
              <StatCard
                icon={FaChartBar}
                label="Completion Rate"
                value={`${Math.min(100, Math.floor((stats.tasksCount > 0 ? 65 : 0)))}%`}
                color="orange"
                trend={3}
              />
            </>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.a
              whileHover={{ y: -5 }}
              href="/projects"
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all"
            >
              <FaProjectDiagram className="text-cyan-500 text-2xl mb-3" />
              <h3 className="font-semibold text-white mb-1">View Projects</h3>
              <p className="text-sm text-slate-400">Browse all projects</p>
            </motion.a>
            <motion.a
              whileHover={{ y: -5 }}
              href="/tasks"
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all"
            >
              <FaTasks className="text-blue-500 text-2xl mb-3" />
              <h3 className="font-semibold text-white mb-1">Manage Tasks</h3>
              <p className="text-sm text-slate-400">Create and track tasks</p>
            </motion.a>
            <motion.a
              whileHover={{ y: -5 }}
              href="/team"
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all"
            >
              <FaUsers className="text-purple-500 text-2xl mb-3" />
              <h3 className="font-semibold text-white mb-1">Team Progress</h3>
              <p className="text-sm text-slate-400">See team insights</p>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;

