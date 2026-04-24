import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.05)] font-bold',
    secondary: 'bg-[#1A1A1A] text-white border border-white/10 hover:bg-[#252525] hover:border-white/20 font-semibold',
    outline: 'bg-transparent border border-white/20 text-white hover:border-white/40 hover:bg-white/5 font-medium',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 font-medium',
    danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 font-bold',
    brand: 'bg-primary text-white hover:opacity-90 shadow-[0_0_20px_rgba(79,70,229,0.3)] font-bold uppercase tracking-widest'
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs rounded-lg',
    md: 'px-6 py-2.5 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-2xl'
  };

  const baseStyles = 'flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none';
  const styles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={styles}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing
        </div>
      ) : (
        <>
          {Icon && <span className="material-symbols-outlined text-[18px]">{Icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
