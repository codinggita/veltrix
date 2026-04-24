import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageWrapper from '../../components/layout/PageWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axiosInstance from '../../services/axiosInstance';
import { logoutThunk, setUser } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Business Info');
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    businessName: user?.businessName || '',
    registrationNumber: user?.registrationNumber || '',
    taxId: user?.taxId || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'United Kingdom',
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = ['Profile', 'Business Info', 'Branding', 'Notifications'];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.put('/users/profile', profileData);
      dispatch(setUser(res.data.data));
      toast.success('Settings updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setIsLoading(true);
    try {
      await axiosInstance.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await dispatch(logoutThunk());
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Personal Profile</h2>
              <p className="text-sm text-text-muted font-medium mt-1">Manage your personal identification and contact preferences.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
              <Input
                label="Email Address"
                value={profileData.email}
                readOnly
                helperText="Email cannot be changed"
              />
            </div>

            <div className="pt-8 border-t border-white/5">
              <h3 className="text-sm font-bold text-white mb-6">Security</h3>
              
              {!isChangingPassword ? (
                <Button 
                  variant="secondary" 
                  onClick={() => setIsChangingPassword(true)}
                  className="px-6 border-white/5 bg-[#1A1A1A] text-white hover:bg-white/5"
                >
                  Change Password
                </Button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                  <div className="flex gap-4 pt-2">
                    <Button type="submit" variant="brand" loading={isLoading}>
                      Update Password
                    </Button>
                    <Button variant="ghost" onClick={() => setIsChangingPassword(false)} disabled={isLoading} className="text-text-muted hover:text-white uppercase tracking-widest text-[11px] font-bold">
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>

            <div className="pt-8 border-t border-white/5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-rose-500">Danger Zone</h3>
                <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-widest leading-relaxed">
                  Terminate your current session and exit the terminal.
                </p>
              </div>
              <Button 
                variant="secondary" 
                onClick={handleLogout}
                className="px-6 border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border shadow-sm"
              >
                Sign Out from Veltrix
              </Button>
            </div>
          </div>
        );
      case 'Business Info':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Business Details</h2>
              <p className="text-sm text-text-muted font-medium mt-1">Manage your company's official information for invoicing and legal compliance.</p>
            </div>

            {/* Logo Section */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-[#1A1A1A] rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                <img src={user?.logoUrl || "https://api.dicebear.com/7.x/identicon/svg?seed=Veltrix"} alt="Logo" className="w-12 h-12 opacity-50" />
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Company Logo</h4>
                  <p className="text-[10px] text-text-muted font-bold mt-1 leading-relaxed">
                    Recommended size: 512×512px. PNG or SVG with transparent background preferred.
                  </p>
                </div>
                <button className="bg-[#1A1A1A] text-white text-[11px] font-black px-5 py-2.5 rounded-lg border border-white/5 hover:bg-white/10 transition-all uppercase tracking-widest">
                  Upload new image
                </button>
              </div>
            </div>

            {/* General Info */}
            <div className="space-y-6">
              <Input
                label="Legal Company Name"
                value={profileData.businessName}
                onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Registration Number"
                  placeholder="CRN-8924719"
                  value={profileData.registrationNumber}
                  onChange={(e) => setProfileData({ ...profileData, registrationNumber: e.target.value })}
                />
                <Input
                  label="Tax ID / GST Number"
                  placeholder="US - 99 - 8877665"
                  value={profileData.taxId}
                  onChange={(e) => setProfileData({ ...profileData, taxId: e.target.value })}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-6">
              <div className="pt-2">
                <h3 className="text-sm font-bold text-white mb-1">Registered Address</h3>
                <div className="h-px bg-white/5 w-full mt-4" />
              </div>
              
              <Input
                label="Street Address"
                placeholder="Level 42, The Shard, 32 London Bridge St"
                value={profileData.address.street}
                onChange={(e) => setProfileData({ 
                  ...profileData, 
                  address: { ...profileData.address, street: e.target.value } 
                })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="City"
                  placeholder="London"
                  value={profileData.address.city}
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    address: { ...profileData.address, city: e.target.value } 
                  })}
                />
                <Input
                  label="Postal / Zip Code"
                  placeholder="SE1 9SG"
                  value={profileData.address.zipCode}
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    address: { ...profileData.address, zipCode: e.target.value } 
                  })}
                />
              </div>
            </div>
          </div>
        );
      case 'Branding':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">System Branding</h2>
              <p className="text-sm text-text-muted font-medium mt-1">Customize the visual identity of your Veltrix experience.</p>
            </div>
            <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-white/5 border-dashed flex flex-col items-center justify-center gap-4 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-700">palette</span>
              <div>
                <h4 className="text-sm font-bold text-white">Advanced Branding Coming Soon</h4>
                <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-widest leading-relaxed">
                  Custom themes, secondary logos, and brand voice settings.
                </p>
              </div>
            </div>
          </div>
        );
      case 'Notifications':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Preferences</h2>
              <p className="text-sm text-text-muted font-medium mt-1">Control how and when you receive system updates and alerts.</p>
            </div>
            <div className="space-y-4">
              {[
                { id: 'payment', label: 'Payment Receipts', desc: 'Notify when an invoice is fully paid' },
                { id: 'client', label: 'Client Activity', desc: 'Notify when a client views an invoice' },
                { id: 'system', label: 'System Updates', desc: 'Critical security and feature updates' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-[#1A1A1A]/30 rounded-xl border border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.label}</h4>
                    <p className="text-[10px] text-text-muted font-bold mt-0.5 uppercase tracking-widest">{item.desc}</p>
                  </div>
                  <div className="w-10 h-5 bg-primary/20 border border-primary/30 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PageWrapper title="Settings">
      <div className="flex gap-16 max-w-6xl pb-20">
        {/* Vertical Tabs */}
        <div className="w-48 flex flex-col gap-1 mt-12 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-[#1A1A1A] text-white border border-white/5 shadow-sm' 
                  : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {renderContent()}

          {!isChangingPassword && (
            <>
              <div className="h-px bg-white/5 w-full my-12" />
              
              {/* Footer Actions */}
              <div className="flex justify-end items-center gap-8">
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[11px] font-bold text-text-muted hover:text-white transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <Button onClick={handleSave} variant="brand" loading={isLoading} className="px-12 min-w-[180px]">
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;
