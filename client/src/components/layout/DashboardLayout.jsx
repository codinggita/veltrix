import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { getMeThunk } from '../../store/slices/authSlice';

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMeThunk());
    }
  }, [dispatch, token, user]);

  return (
    <div className="flex min-h-screen bg-[#0F0F0F] font-body selection:bg-primary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
