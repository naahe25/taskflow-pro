import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createProject } from '../../services/projectService';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const ProjectForm = ({ refreshProjects }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Project title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await createProject({ title, description });
      toast.success('Project created successfully!');
      setTitle('');
      setDescription('');
      setErrors({});
      refreshProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project Title"
            placeholder="Enter project name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your project"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-4 py-2.5 bg-slate-800 border-2 rounded-lg text-white placeholder-slate-500 transition-all focus:outline-none ${
                errors.description
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-700 focus:border-cyan-500'
              }`}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Create Project
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default ProjectForm;
