import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon,
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">{Icon}</span>
          </div>
        )}
        
        <input
          className={`
            w-full bg-[#111111] border rounded-xl py-3.5 transition-all outline-none
            ${Icon ? 'pl-12 pr-5' : 'px-5'}
            ${error 
              ? 'border-rose-500/50 focus:border-rose-500 ring-1 ring-rose-500/20' 
              : 'border-white/[0.05] focus:border-white/20 focus:bg-[#1A1A1A] hover:border-white/10'
            }
            text-white placeholder:text-gray-600 text-sm font-medium
          `}
          {...props}
        />
      </div>

      {error && (
        <span className="text-[10px] font-bold text-rose-500 mt-1 ml-1 flex items-center gap-1 uppercase tracking-wider">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
