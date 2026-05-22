import { useState } from 'react';

const Input = ({
  label,
  error,
  placeholder,
  type = 'text',
  className = '',
  onChange,
  value,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 bg-slate-800 border-2 rounded-lg text-white placeholder-slate-500 transition-all duration-200 focus:outline-none ${
          error
            ? 'border-red-500 focus:border-red-500'
            : focused
              ? 'border-cyan-500 focus:border-cyan-500'
              : 'border-slate-700 hover:border-slate-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
