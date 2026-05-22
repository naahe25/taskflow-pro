const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-700 text-slate-200',
    todo: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    inprogress: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    done: 'bg-green-500/20 text-green-300 border border-green-500/30',
    active: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    completed: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
    warning: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    Admin: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 border border-pink-500/30',
    member: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  };

  return (
    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
