import React from 'react';

const Navbar = () => {
  return (
    <div className="h-20 border-b border-[#1E1E1E] bg-[#0F0F0F]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Search */}
      <div className="relative w-full max-w-xl">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">search</span>
        <input 
          type="text" 
          placeholder="Search payments, clients, or invoices..." 
          className="w-full bg-[#121212] border border-[#1E1E1E] rounded-full py-3.5 pl-12 pr-6 text-sm font-medium text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-text-muted/60"
        />
      </div>

      {/* Notifications & Actions */}
      <div className="flex items-center gap-6">
        <button className="relative text-text-muted hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-[#0F0F0F]" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
