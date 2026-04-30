import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageWrapper from '../../components/layout/PageWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axiosInstance from '../../services/axiosInstance';
import { logoutThunk, setUser } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch(), navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', businessName: '', registrationNumber: '', taxId: '', logoUrl: '', address: { street: '', city: '', zipCode: '', country: 'India' }, notifications: { paymentReceipts: true, clientActivity: true, systemUpdates: true } });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (user) setProfileData({ ...user, address: { street: user.address?.street || '', city: user.address?.city || '', zipCode: user.address?.zipCode || '', country: user.address?.country || 'India' }, notifications: { paymentReceipts: user.notifications?.paymentReceipts ?? true, clientActivity: user.notifications?.clientActivity ?? true, systemUpdates: user.notifications?.systemUpdates ?? true } });
  }, [user]);

  const update = (k, v, n = null) => n ? setProfileData(p => ({ ...p, [n]: { ...p[n], [k]: v } })) : setProfileData(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setIsLoading(true);
    try { const res = await axiosInstance.put('/users/profile', profileData); dispatch(setUser(res.data.data)); toast.success('Preferences synchronized successfully'); }
    catch (e) { toast.error('Synchronization failed'); } finally { setIsLoading(false); }
  };

  const Section = ({ t, d, children, showSave = true }) => (
    <div className="space-y-6 animate-in fade-in duration-500 premium-card rounded-3xl p-6 md:p-10 mb-8">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">{t}</h2>
        <p className="text-sm font-medium text-text-muted mt-1">{d}</p>
      </div>
      <div className="space-y-6">
        {children}
      </div>
      {showSave && (
        <div className="mt-10 pt-8 border-t border-white/5 flex justify-end">
          <Button onClick={handleSave} variant="brand" loading={isLoading} className="w-full md:w-auto px-10 shadow-[0_0_20px_rgba(99,102,241,0.3)]">Save Configuration</Button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'Profile') return (
      <Section t="Personal Profile" d="Manage your executive identity and credentials." showSave={!isChangingPassword}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Input label="Full Name" value={profileData.name} onChange={e => update('name', e.target.value)} />
          <Input label="Email Address" value={profileData.email} readOnly helperText="Locked to organizational SSO" />
        </div>
        
        {!isChangingPassword ? (
          <div className="pt-4">
             <Button variant="secondary" onClick={() => setIsChangingPassword(true)} className="border-white/10 hover:border-white/20">Change Password</Button>
          </div>
        ) : (
          <div className="space-y-6 max-w-md p-8 glass-panel rounded-2xl border border-white/5 mt-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-hover"></div>
            <h3 className="text-base font-black text-white tracking-tight mb-2">Update Credentials</h3>
            {['currentPassword', 'newPassword', 'confirmPassword'].map(f => (
              <Input key={f} label={f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} type="password" value={passwordData[f]} onChange={e => setPasswordData({...passwordData, [f]: e.target.value})} />
            ))}
            <div className="flex gap-4 pt-4">
              <Button onClick={handlePasswordChange} variant="brand" loading={isLoading}>Update Credentials</Button>
              <Button variant="secondary" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
            </div>
          </div>
        )}
        
        <div className="mt-12 pt-8 border-t border-white/5">
          <h3 className="text-[10px] font-black text-danger uppercase tracking-[0.2em] mb-4">Danger Zone</h3>
          <Button variant="secondary" onClick={() => { if(window.confirm('Terminate session?')) { dispatch(logoutThunk()); navigate('/login'); } }} className="text-danger border-danger/20 bg-danger/5 hover:bg-danger/10 hover:border-danger/30">Sign Out Everywhere</Button>
        </div>
      </Section>
    );
    if (activeTab === 'Business Info') return (
      <Section t="Business Entity" d="Official organizational registry details.">
        <Input label="Registered Company Name" placeholder="Veltrix Corp." value={profileData.businessName} onChange={e => update('businessName', e.target.value)} className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
          <Input label="CIN / Registration No." value={profileData.registrationNumber} onChange={e => update('registrationNumber', e.target.value)} />
          <Input label="GST / Tax ID" value={profileData.taxId} onChange={e => update('taxId', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-8 border-t border-white/5">
          <Input label="Street Address" className="md:col-span-2" value={profileData.address.street} onChange={e => update('street', e.target.value, 'address')} />
          <Input label="City / Region" value={profileData.address.city} onChange={e => update('city', e.target.value, 'address')} />
          <Input label="Postal / ZIP Code" value={profileData.address.zipCode} onChange={e => update('zipCode', e.target.value, 'address')} />
        </div>
      </Section>
    );
    if (activeTab === 'Branding') return (<Section t="Brand Identity" d="Visual assets for client-facing documents.">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="w-32 h-32 bg-[#121214] rounded-2xl border border-white/10 overflow-hidden shadow-inner flex shrink-0 p-2 relative group">
          <img src={profileData.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.businessName}`} className="w-full h-full object-contain rounded-xl" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer">
            <span className="material-symbols-outlined text-white">upload</span>
          </div>
        </div>
        <Input label="Logo Asset URL" placeholder="https://..." value={profileData.logoUrl} onChange={e => update('logoUrl', e.target.value)} className="flex-1 w-full" />
      </div>
      <div className="mt-8 bg-[#121214] p-8 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-primary text-3xl mb-3">palette</span>
        <h4 className="text-sm font-bold text-white mb-1">Custom Themes Engine</h4>
        <p className="text-xs text-text-muted">Dynamic invoice templating is currently in beta.</p>
      </div>
    </Section>);
    return (<Section t="System Preferences" d="Configure automated alerts and reporting.">
      <div className="space-y-4">
        {Object.keys(profileData.notifications).map(k => (
          <div key={k} className="flex items-center justify-between p-5 bg-[#121214] rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
            <div>
              <span className="text-sm font-bold text-white tracking-tight block mb-0.5">{k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              <span className="text-[10px] text-text-muted font-medium">Receive updates for {k.toLowerCase().replace(/([A-Z])/g, ' $1')}</span>
            </div>
            <div 
              onClick={() => update(k, !profileData.notifications[k], 'notifications')} 
              className={`w-14 h-7 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ring-1 ring-inset ${profileData.notifications[k] ? 'bg-primary ring-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-[#18181B] ring-white/10'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-out shadow-sm ${profileData.notifications[k] ? 'translate-x-8' : 'translate-x-1'}`} />
            </div>
          </div>
        ))}
      </div>
    </Section>);
  };

  return (
    <PageWrapper title="">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-[1200px] mx-auto pb-20 px-4 md:px-0">
        
        {/* Sidebar Navigation */}
        <div className="flex overflow-x-auto lg:flex-col gap-2 py-2 lg:py-0 lg:w-56 shrink-0 scrollbar-hide border-b lg:border-none border-white/5">
          <div className="hidden lg:block px-4 mb-4">
            <h2 className="text-3xl font-black text-white tracking-tight">Settings</h2>
          </div>
          {['Profile', 'Business Info', 'Branding', 'Notifications'].map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)} 
              className={`text-left px-5 py-3 md:py-4 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap scale-btn relative overflow-hidden group ${
                activeTab === t 
                  ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' 
                  : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {activeTab === t && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#6366f1]" />}
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[18px] ${activeTab === t ? 'text-primary' : 'group-hover:text-white'}`}>
                  {t === 'Profile' ? 'person' : t === 'Business Info' ? 'domain' : t === 'Branding' ? 'palette' : 'notifications'}
                </span>
                {t}
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;
