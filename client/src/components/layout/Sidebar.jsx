import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/app/dashboard' },
    { name: 'Invoices', icon: 'description', path: '/app/invoices' },
    { name: 'Clients', icon: 'group', path: '/app/clients' },
    { name: 'Payments', icon: 'payments', path: '/app/payments' },
    { name: 'Analytics', icon: 'analytics', path: '/app/analytics' },
    { name: 'Settings', icon: 'settings', path: '/app/settings' },
  ];

  return (
    <div className="w-[280px] h-screen bg-[#0F0F0F] border-r border-[#1E1E1E] flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <span className="material-symbols-outlined text-white text-[24px]">account_balance_wallet</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">Veltrix</h1>
            <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-[0.1em]">Micro-Business OS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-text-muted hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${
                isActive ? 'text-primary' : 'text-text-muted group-hover:text-white'
              }`}>
                {item.icon}
              </span>
              <span className="text-sm font-bold tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-6 space-y-6">
        <button className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-sm uppercase tracking-widest">Create Invoice</span>
        </button>

        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border border-[#2A2A2A] overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" />
            </div>
            <div>
              <div className="text-xs font-black text-white leading-tight">Alex Sterling</div>
              <div className="text-[10px] text-text-muted font-bold mt-0.5">Founder</div>
            </div>
          </div>
          <button className="text-text-muted hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
