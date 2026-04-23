import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-white/10 text-white border-white/5',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    neutral: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  };

  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-sm transition-colors';
  const styles = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <span className={styles} {...props}>
      {children}
    </span>
  );
};

export default Badge;
