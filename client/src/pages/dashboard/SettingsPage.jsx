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
    try { const res = await axiosInstance.put('/users/profile', profileData); dispatch(setUser(res.data.data)); toast.success('Saved'); }
    catch (e) { toast.error('Failed'); } finally { setIsLoading(false); }
  };

  const Section = ({ t, d, children, showSave = true }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div><h2 className="text-xl font-bold text-white">{t}</h2><p className="text-xs text-text-muted mt-1">{d}</p></div>
      {children}
      {showSave && <div className="mt-10 pt-6 border-t border-white/5"><Button onClick={handleSave} variant="brand" loading={isLoading} className="w-full md:w-auto px-10">Save Changes</Button></div>}
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'Profile') return (
      <Section t="Personal Profile" d="Identity settings." showSave={!isChangingPassword}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"><Input label="Full Name" value={profileData.name} onChange={e => update('name', e.target.value)} /><Input label="Email" value={profileData.email} readOnly helperText="Locked" /></div>
        {!isChangingPassword ? <Button variant="secondary" onClick={() => setIsChangingPassword(true)}>Change Password</Button> :
          <div className="space-y-6 max-w-md p-6 bg-white/5 rounded-2xl border border-white/5">
            <h3 className="text-sm font-bold text-white">Update Password</h3>
            {['currentPassword', 'newPassword', 'confirmPassword'].map(f => <Input key={f} label={f} type="password" value={passwordData[f]} onChange={e => setPasswordData({...passwordData, [f]: e.target.value})} />)}
            <div className="flex gap-4"><Button onClick={handleSave} variant="brand">Update</Button><Button onClick={() => setIsChangingPassword(false)}>Cancel</Button></div>
          </div>}
        <div className="pt-6 border-t border-white/5"><h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4">Danger Zone</h3><Button variant="secondary" onClick={() => { if(window.confirm('Log out?')) { dispatch(logoutThunk()); navigate('/login'); } }} className="text-rose-500 border-rose-500/20 bg-rose-500/5">Sign Out</Button></div>
      </Section>
    );
    if (activeTab === 'Business Info') return (
      <Section t="Business Details" d="Official info.">
        <Input label="Company Name" placeholder="Veltrix" value={profileData.businessName} onChange={e => update('businessName', e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Input label="CIN / Reg No" value={profileData.registrationNumber} onChange={e => update('registrationNumber', e.target.value)} /><Input label="GST / PAN" value={profileData.taxId} onChange={e => update('taxId', e.target.value)} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
          <Input label="Street" className="md:col-span-2" value={profileData.address.street} onChange={e => update('street', e.target.value, 'address')} />
          <Input label="City" value={profileData.address.city} onChange={e => update('city', e.target.value, 'address')} /><Input label="PIN" value={profileData.address.zipCode} onChange={e => update('zipCode', e.target.value, 'address')} />
        </div>
      </Section>
    );
    if (activeTab === 'Branding') return (<Section t="Branding" d="Visual identity.">
      <div className="flex flex-col sm:flex-row items-center gap-6"><div className="w-24 h-24 bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden"><img src={profileData.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.businessName}`} className="w-full h-full object-contain" /></div><Input placeholder="Logo URL" value={profileData.logoUrl} onChange={e => update('logoUrl', e.target.value)} className="flex-1" /></div>
      <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-dashed border-white/10 text-[10px] text-text-muted font-bold text-center">Custom Themes Coming Soon</div>
    </Section>);
    return (<Section t="Preferences" d="Notifications.">
      <div className="space-y-4">
        {Object.keys(profileData.notifications).map(k => (
          <div key={k} className="flex items-center justify-between p-4 bg-[#1A1A1A]/30 rounded-xl border border-white/5">
            <span className="text-sm font-bold text-white uppercase tracking-tighter">{k.replace(/([A-Z])/g, ' $1')}</span>
            <div onClick={() => update(k, !profileData.notifications[k], 'notifications')} className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${profileData.notifications[k] ? 'bg-primary' : 'bg-white/10'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${profileData.notifications[k] ? 'right-1' : 'left-1'}`} /></div>
          </div>
        ))}
      </div>
    </Section>);
  };

  return (
    <PageWrapper title="Settings">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-16 max-w-6xl pb-20 px-4 md:px-0">
        <div className="flex overflow-x-auto lg:flex-col gap-2 py-2 lg:w-48 shrink-0 scrollbar-hide border-b lg:border-none border-white/5">
          {['Profile', 'Business Info', 'Branding', 'Notifications'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`text-left px-4 py-2 md:py-3 rounded-xl text-[11px] md:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t ? 'bg-[#1A1A1A] text-white border border-white/10' : 'text-text-muted hover:text-white'}`}>{t}</button>
          ))}
        </div>
        <div className="flex-1">{renderContent()}</div>
      </div>
    </PageWrapper>
  );
};
export default SettingsPage;
