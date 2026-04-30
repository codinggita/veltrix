import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, reset } from '../../store/slices/authSlice';
import SEO from '../../components/ui/SEO';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/app/dashboard');
    return () => { dispatch(reset()); };
  }, [user, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }));
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col md:flex-row font-body text-white selection:bg-primary-container">
      <SEO title="Login" description="Access your Veltrix financial dashboard to manage invoices and track payments." />
      {/* Left Visual Identity */}
      <div className="hidden md:flex flex-col flex-1 relative overflow-hidden bg-surface-container-lowest border-r border-outline-variant/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-transparent pointer-events-none"></div>
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
          <div>
            <Link to="/" className="text-3xl font-black tracking-tighter font-headline flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-primary text-4xl">currency_exchange</span>
              Veltrix
            </Link>
          </div>
          <div className="max-w-md">
            <h2 className="font-headline font-extrabold text-5xl tracking-tight mb-6 leading-tight">Master your financial sovereign state.</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">Enter your terminal to architect, manage, and deploy resources with absolute precision.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-1 bg-primary rounded-full"></div>
            <div className="w-12 h-1 bg-surface-variant rounded-full"></div>
            <div className="w-12 h-1 bg-surface-variant rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] z-0 pointer-events-none"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-headline font-bold text-3xl mb-3 text-glow">Welcome System</h1>
            <p className="text-on-surface-variant">Authenticate to access your ledger.</p>
          </div>

          {isError && <div className="mb-8 p-4 bg-error-container/10 border border-error/20 rounded-xl text-error text-sm font-medium flex items-center gap-3"><span className="material-symbols-outlined">error</span> {message}</div>}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-widest">Email Address</label>
              <input type="email" name="email" value={email} onChange={onChange} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] px-5 py-4 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[#202020] transition-all hover:border-[#3A3A3A]" placeholder="nexus@veltrix.co" autoComplete="email" required />
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Master Password</label>
                <a href="#" className="text-xs text-primary font-medium hover:text-white transition-colors">Recover Access</a>
              </div>
              <input type="password" name="password" value={password} onChange={onChange} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] px-5 py-4 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[#202020] transition-all hover:border-[#3A3A3A]" placeholder="••••••••" autoComplete="current-password" required />
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 transform active:scale-[0.98] mt-8 disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? 'Authenticating...' : <>Initialize Session <span className="material-symbols-outlined text-sm">arrow_forward</span></>}
            </button>
          </form>

          <p className="mt-10 text-center md:text-left text-sm text-on-surface-variant">
            Unregistered entity? <Link to="/signup" className="text-white hover:text-primary font-semibold transition-colors">Request allocation</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
