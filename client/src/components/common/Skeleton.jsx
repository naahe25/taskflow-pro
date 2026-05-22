const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg animate-pulse ${className}`}
          />
        ))}
    </>
  );
};

export default Skeleton;
