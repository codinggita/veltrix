import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { getNotifications, markAllAsRead, markAsRead } from '../../store/slices/notificationSlice';
import { formatDate } from '../../utils/formatters';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const { notifications } = useSelector(state => state.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
    if (notification.link) {
      navigate(notification.link);
    }
    setShowNotifications(false);
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    dispatch(markAllAsRead());
  };

  return (
    <div className="h-20 border-b border-white/5 bg-[#09090B]/80 backdrop-blur-2xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden p-2 text-text-muted hover:text-white transition-colors scale-btn"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Search */}
        <div className="relative w-full max-w-xl hidden md:block">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search payments, clients, or invoices..."
            className="w-full bg-white/5 border border-white/5 rounded-full py-3.5 pl-12 pr-6 text-sm font-medium text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-muted hover:bg-white/10"
          />
        </div>
      </div>

      {/* Notifications & Actions */}
      <div className="flex items-center gap-6 relative" ref={notifRef}>
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-text-muted hover:text-white transition-colors scale-btn"
        >
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-[2px] border-[#09090B] shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute top-[120%] right-0 w-80 max-h-[400px] bg-[#121214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 animate-in slide-in-from-top-4 duration-200">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#18181B]">
              <h3 className="text-sm font-black text-white tracking-tight">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-primary hover:text-white uppercase tracking-widest transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto flex-1 scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-text-muted text-xs font-medium">
                  No notifications yet.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 cursor-pointer hover:bg-white/5 transition-colors flex gap-3 items-start ${!notif.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-transparent'}`} />
                      <div className="flex-1 space-y-1">
                        <p className={`text-xs ${!notif.isRead ? 'text-white font-bold' : 'text-text-secondary font-medium'}`}>
                          {notif.message}
                        </p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          {formatDate(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
