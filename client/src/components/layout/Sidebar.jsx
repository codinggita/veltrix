import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutThunk } from '../../store/slices/authSlice';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const Sidebar = () => {
  const location = useLocation(), navigate = useNavigate(), dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  const menuItems = [
    { name: 'Dashboard', icon: 'space_dashboard', path: '/app/dashboard' },
    { name: 'Invoices', icon: 'receipt_long', path: '/app/invoices' },
    { name: 'Clients', icon: 'group', path: '/app/clients' },
    { name: 'Payments', icon: 'account_balance_wallet', path: '/app/payments' },
    { name: 'Expenses', icon: 'payments', path: '/app/expenses' },
    { name: 'Analytics', icon: 'monitoring', path: '/app/analytics' },
    { name: 'Settings', icon: 'settings', path: '/app/settings' },
  ];

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" onClick={() => dispatch(setSidebarOpen(false))} />
      )}
      <div className={`w-[280px] h-[100dvh] bg-[#09090B]/95 backdrop-blur-xl border-r border-white/5 flex flex-col fixed lg:sticky top-0 z-50 transition-transform duration-500 cubic-bezier(0.2, 0, 0, 1) ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Branding */}
        <div className="p-8 pb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => window.innerWidth < 1024 && dispatch(setSidebarOpen(false))}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-white text-xl">currency_exchange</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">Veltrix<span className="text-primary">.</span></h1>
          </Link>
          <button onClick={() => dispatch(setSidebarOpen(false))} className="lg:hidden text-text-muted hover:text-white transition-colors scale-btn">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide py-4">
          <div className="px-4 mb-3 text-[10px] font-black text-text-muted tracking-[0.2em] uppercase">Main Menu</div>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link key={item.name} to={item.path} onClick={() => window.innerWidth < 1024 && dispatch(setSidebarOpen(false))}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-white/5 text-white shadow-sm ring-1 ring-white/10' : 'text-text-muted hover:text-white hover:bg-white/[0.02]'}`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
                <span className={`material-symbols-outlined text-[22px] transition-transform duration-300 ${isActive ? 'text-primary scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                <span className="text-sm font-bold tracking-tight">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions & Profile */}
        <div className="p-5 space-y-5 border-t border-white/5 bg-gradient-to-b from-transparent to-black/20">
          <button onClick={() => { navigate('/app/invoices/create'); if(window.innerWidth < 1024) dispatch(setSidebarOpen(false)); }} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] scale-btn flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span className="text-sm tracking-wide">New Invoice</span>
          </button>
          
          <div className="flex items-center justify-between p-3 bg-[#18181B] rounded-2xl ring-1 ring-white/5 shadow-inner">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border border-white/10 overflow-hidden shrink-0 relative">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Veltrix'}&backgroundColor=transparent`} alt="Avatar" className="w-full h-full object-cover p-1" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-[#18181B]"></div>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white leading-tight truncate">{user?.name || 'User'}</div>
                <div className="text-[10px] text-text-muted font-bold mt-0.5 truncate tracking-wide">{user?.businessName || 'Business Account'}</div>
              </div>
            </div>
            <button onClick={() => { if(window.confirm('Sign out of Veltrix?')) { dispatch(logoutThunk()); navigate('/login'); } }} className="text-text-muted hover:text-danger shrink-0 p-2 rounded-lg hover:bg-danger/10 transition-colors scale-btn">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
