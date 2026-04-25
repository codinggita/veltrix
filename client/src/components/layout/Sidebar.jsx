import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutThunk } from '../../store/slices/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    if (window.confirm('Sign out of Veltrix terminal?')) {
      dispatch(logoutThunk());
      navigate('/login');
    }
  };

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
    <div className="w-[280px] h-[100dvh] bg-[#0F0F0F] border-r border-[#1E1E1E] flex flex-col sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="p-8 pb-4">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:rotate-12">currency_exchange</span>
          <h1 className="text-2xl font-black text-white tracking-tighter font-headline">Veltrix</h1>
        </Link>
      </div>

      {/* Navigation - Scrollable area */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide py-4">
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

      {/* Footer Actions - Fixed area */}
      <div className="p-4 space-y-4 border-t border-[#1E1E1E]">
        <button 
          onClick={() => navigate('/app/invoices/create')}
          className="w-full bg-primary text-white font-black py-3.5 rounded-xl shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-sm uppercase tracking-widest">Create Invoice</span>
        </button>

        <div className="flex items-center justify-between p-2 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
               <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user?.name || 'Veltrix'}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-white leading-tight truncate">{user?.name || 'User'}</div>
              <div className="text-[10px] text-text-muted font-bold mt-0.5 truncate uppercase tracking-widest">{user?.businessName || 'Sovereign Head'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-text-muted hover:text-rose-500 transition-colors shrink-0" title="Logout">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
