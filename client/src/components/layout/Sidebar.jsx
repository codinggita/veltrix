import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutThunk } from '../../store/slices/authSlice';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const Sidebar = () => {
  const location = useLocation(), navigate = useNavigate(), dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/app/dashboard' },
    { name: 'Invoices', icon: 'description', path: '/app/invoices' },
    { name: 'Clients', icon: 'group', path: '/app/clients' },
    { name: 'Payments', icon: 'payments', path: '/app/payments' },
    { name: 'Expenses', icon: 'receipt', path: '/app/expenses' },
    { name: 'Analytics', icon: 'analytics', path: '/app/analytics' },
    { name: 'Settings', icon: 'settings', path: '/app/settings' },
  ];

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />
      )}
      <div className={`w-[280px] h-[100dvh] bg-[#0F0F0F] border-r border-[#1E1E1E] flex flex-col fixed lg:sticky top-0 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => window.innerWidth < 1024 && dispatch(setSidebarOpen(false))}>
            <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:rotate-12">currency_exchange</span>
            <h1 className="text-2xl font-black text-white tracking-tighter">Veltrix</h1>
          </Link>
          <button onClick={() => dispatch(setSidebarOpen(false))} className="lg:hidden text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide py-4">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} onClick={() => window.innerWidth < 1024 && dispatch(setSidebarOpen(false))}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all group ${location.pathname === item.path ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-muted hover:text-white hover:bg-[#1A1A1A]'}`}>
              <span className={`material-symbols-outlined text-[20px] ${location.pathname === item.path ? 'text-primary' : 'text-text-muted group-hover:text-white'}`}>{item.icon}</span>
              <span className="text-sm font-bold tracking-tight">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 space-y-4 border-t border-[#1E1E1E]">
          <button onClick={() => { navigate('/app/invoices/create'); if(window.innerWidth < 1024) dispatch(setSidebarOpen(false)); }} className="w-full bg-primary text-white font-black py-3.5 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[20px]">add</span><span className="text-sm uppercase tracking-widest">Create Invoice</span>
          </button>
          <div className="flex items-center justify-between p-2 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border border-[#2A2A2A] overflow-hidden shrink-0">
                <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user?.name || 'Veltrix'}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-white leading-tight truncate">{user?.name || 'User'}</div>
                <div className="text-[10px] text-text-muted font-bold mt-0.5 truncate uppercase tracking-widest">{user?.businessName || 'Sovereign Head'}</div>
              </div>
            </div>
            <button onClick={() => { if(window.confirm('Sign out?')) { dispatch(logoutThunk()); navigate('/login'); } }} className="text-text-muted hover:text-rose-500 shrink-0"><span className="material-symbols-outlined text-[20px]">logout</span></button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
