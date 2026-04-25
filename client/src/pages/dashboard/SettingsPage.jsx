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
  const [profileData, setProfileData] = useState({
    name: '', email: '', businessName: '', registrationNumber: '', taxId: '', logoUrl: '',
    address: { street: '', city: '', zipCode: '', country: 'India' },
    notifications: { paymentReceipts: true, clientActivity: true, systemUpdates: true }
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (user) setProfileData({
      ...user, 
      address: { 
        street: user.address?.street || '', city: user.address?.city || '', 
        zipCode: user.address?.zipCode || '', country: user.address?.country || 'India' 
      },
      notifications: {
        paymentReceipts: user.notifications?.paymentReceipts ?? true,
        clientActivity: user.notifications?.clientActivity ?? true,
        systemUpdates: user.notifications?.systemUpdates ?? true
      }
    });
  }, [user]);

  const update = (key, val, nest = null) => {
    if (nest) setProfileData(p => ({ ...p, [nest]: { ...p[nest], [key]: val } }));
    else setProfileData(p => ({ ...p, [key]: val }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.put('/users/profile', profileData);
      dispatch(setUser(res.data.data));
      toast.success('Settings updated');
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
    finally { setIsLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) return toast.error('Passwords mismatch');
    setIsLoading(true);
    try {
      await axiosInstance.put('/users/change-password', passwordData);
      toast.success('Password updated');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
    finally { setIsLoading(false); }
  };

  const Section = ({ t, d, children }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div><h2 className="text-2xl font-bold text-white tracking-tight">{t}</h2><p className="text-sm text-text-muted mt-1">{d}</p></div>
      {children}
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'Profile') return (
      <Section t="Personal Profile" d="Manage identification and contact preferences.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" value={profileData.name} onChange={e => update('name', e.target.value)} />
          <Input label="Email Address" value={profileData.email} readOnly helperText="Email cannot be changed" />
        </div>
        <div className="pt-8 border-t border-white/5">
          <h3 className="text-sm font-bold text-white mb-6">Security</h3>
          {!isChangingPassword ? <Button variant="secondary" onClick={() => setIsChangingPassword(true)}>Change Password</Button> :
            <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
              {['currentPassword', 'newPassword', 'confirmPassword'].map(f => (
                <Input key={f} label={f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} type="password" value={passwordData[f]} onChange={e => setPasswordData({ ...passwordData, [f]: e.target.value })} required />
              ))}
              <div className="flex gap-4 pt-2"><Button type="submit" variant="brand" loading={isLoading}>Update</Button><Button variant="ghost" onClick={() => setIsChangingPassword(false)}>Cancel</Button></div>
            </form>}
        </div>
        <div className="pt-8 border-t border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-rose-500">Danger Zone</h3>
          <Button variant="secondary" onClick={() => { if(window.confirm('Log out?')) { dispatch(logoutThunk()); navigate('/login'); } }} className="border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">Sign Out</Button>
        </div>
      </Section>
    );
    if (activeTab === 'Business Info') return (
      <Section t="Business Details" d="Official info for invoicing and compliance.">
        <Input label="Legal Company Name" placeholder="Veltrix Solutions Pvt Ltd" value={profileData.businessName} onChange={e => update('businessName', e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Registration Number / CIN" placeholder="U74140DL2023PTC123456" value={profileData.registrationNumber} onChange={e => update('registrationNumber', e.target.value)} />
          <Input label="GST Number / PAN" placeholder="27AAAAA0000A1Z5" value={profileData.taxId} onChange={e => update('taxId', e.target.value)} />
        </div>
        <div className="space-y-6 pt-4 border-t border-white/5">
          <h3 className="text-sm font-bold text-white">Office Address</h3>
          <Input label="Street Address" placeholder="Cyber Hub, DLF Phase 3" value={profileData.address.street} onChange={e => update('street', e.target.value, 'address')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="City / State" placeholder="Gurugram, Haryana" value={profileData.address.city} onChange={e => update('city', e.target.value, 'address')} />
            <Input label="PIN Code" placeholder="122002" value={profileData.address.zipCode} onChange={e => update('zipCode', e.target.value, 'address')} />
          </div>
        </div>
      </Section>
    );
    if (activeTab === 'Branding') return (<Section t="System Branding" d="Visual identity settings.">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-[#1A1A1A] rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
          <img src={profileData.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.businessName}`} alt="Logo" className="w-16 h-12 object-contain" />
        </div>
        <div className="space-y-3 flex-1">
          <h4 className="text-sm font-bold text-white">Company Logo</h4>
          <Input placeholder="Logo URL" value={profileData.logoUrl} onChange={e => update('logoUrl', e.target.value)} className="max-w-md" />
        </div>
      </div>
      <div className="flex items-center gap-4 pt-6"><div className="w-12 h-12 rounded-xl bg-primary border border-white/10 shadow-lg shadow-primary/20" /><div><div className="text-xs font-black text-white">Indigo Sovereign</div><div className="text-[10px] text-text-muted">#4F46E5 (Default)</div></div></div>
      <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 border-dashed text-center text-text-muted uppercase text-[10px] tracking-widest font-bold">Custom Themes Coming Soon</div>
    </Section>);
    
    const noteItems = [
      { k: 'paymentReceipts', l: 'Payment Receipts', d: 'Notify when an invoice is fully paid' },
      { k: 'clientActivity', l: 'Client Activity', d: 'Notify when a client views an invoice' },
      { k: 'systemUpdates', l: 'System Updates', d: 'Critical security and feature updates' }
    ];
    return (<Section t="Preferences" d="System updates and alerts.">
      <div className="space-y-4">
        {noteItems.map(i => (
          <div key={i.k} className="flex items-center justify-between p-4 bg-[#1A1A1A]/30 rounded-xl border border-white/5">
            <div><h4 className="text-sm font-bold text-white">{i.l}</h4><p className="text-[10px] text-text-muted mt-0.5 uppercase tracking-widest">{i.d}</p></div>
            <div onClick={() => update(i.k, !profileData.notifications[i.k], 'notifications')} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${profileData.notifications[i.k] ? 'bg-primary' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${profileData.notifications[i.k] ? 'right-1' : 'left-1'}`} />
            </div>
          </div>
        ))}
      </div>
    </Section>);
  };

  return (
    <PageWrapper title="Settings"><div className="flex gap-16 max-w-6xl pb-20">
      <div className="w-48 flex flex-col gap-1 mt-12 shrink-0">
        {['Profile', 'Business Info', 'Branding', 'Notifications'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === t ? 'bg-[#1A1A1A] text-white border border-white/5 shadow-sm' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>{t}</button>
        ))}
      </div>
      <div className="flex-1">{renderContent()}{!isChangingPassword && <>
        <div className="h-px bg-white/5 w-full my-12" />
        <div className="flex justify-end items-center gap-8">
          <button onClick={() => window.location.reload()} className="text-[11px] font-bold text-text-muted hover:text-white uppercase tracking-widest">Cancel</button>
          <Button onClick={handleSave} variant="brand" loading={isLoading} className="px-12 min-w-[180px]">Save Changes</Button>
        </div></>}
      </div>
    </div></PageWrapper>
  );
};
export default SettingsPage;
