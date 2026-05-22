import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaTasks as FaTasksIcon, FaFilter } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import toast from 'react-hot-toast';
import { getTasks, updateTaskStatus, deleteTask } from '../services/taskService';
import TaskForm from '../components/dashboard/TaskForm';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Skeleton from '../components/common/Skeleton';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const statusColors = {
    todo: 'todo',
    inprogress: 'inprogress',
    done: 'done',
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((t) => t.status === filterStatus));
    }
  }, [tasks, filterStatus]);

  const handleStatus = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      toast.success('Task updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const taskCount = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inprogress: tasks.filter((t) => t.status === 'inprogress').length,
    done: tasks.filter((t) => t.status === 'done').length,
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
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Tasks</h1>
              <p className="text-slate-400">Create and manage your team's tasks</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowForm(!showForm)}
              className="gap-2"
            >
              <FaPlus /> New Task
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['all', 'todo', 'inprogress', 'done'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {status === 'all' && 'All'}
                {status === 'todo' && 'To Do'}
                {status === 'inprogress' && 'In Progress'}
                {status === 'done' && 'Done'}
                <span className="ml-2 text-xs bg-slate-700 px-2 py-1 rounded">
                  {taskCount[status]}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {showForm && (
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <TaskForm
              refreshTasks={() => {
                setShowForm(false);
                fetchTasks();
              }}
            />
          </motion.div>
        )}

        {loading ? (
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-56" />
            ))}
          </motion.div>
        ) : filteredTasks.length === 0 ? (
          <motion.div variants={itemVariants}>
            <EmptyState
              icon={FaTasksIcon}
              title={filterStatus === 'all' ? 'No Tasks Yet' : `No ${filterStatus} Tasks`}
              description="Create a new task to get started"
              action={
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  Create Task
                </Button>
              }
            />
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTasks.map((task) => (
              <motion.div key={task._id} variants={itemVariants}>
                <Card className="group h-full flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-lg font-bold text-white flex-1">{task.title}</h2>
                      <Badge variant={statusColors[task.status]}>
                        {task.status === 'todo' && 'To Do'}
                        {task.status === 'inprogress' && 'In Progress'}
                        {task.status === 'done' && 'Done'}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                    {task.project && (
                      <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-1">Project</p>
                        <p className="text-sm text-cyan-400 font-medium">{task.project.title}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-700 space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant={task.status === 'todo' ? 'primary' : 'secondary'}
                        onClick={() => handleStatus(task._id, 'todo')}
                      >
                        Todo
                      </Button>
                      <Button
                        size="sm"
                        variant={task.status === 'inprogress' ? 'primary' : 'secondary'}
                        onClick={() => handleStatus(task._id, 'inprogress')}
                      >
                        Progress
                      </Button>
                      <Button
                        size="sm"
                        variant={task.status === 'done' ? 'primary' : 'secondary'}
                        onClick={() => handleStatus(task._id, 'done')}
                      >
                        Done
                      </Button>
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDelete(task._id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Tasks;
