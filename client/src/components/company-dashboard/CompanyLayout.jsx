import React, { useState, useRef, useEffect } from 'react';
import CompanySidebar from './CompanySidebar';
import ProfileCompletionPopup from './ProfileCompletionPopup';
import { Search, Bell, Settings, LogOut, User, Menu, X, Check, Clock as ClockIcon, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { getCompanyProfile } from '../../redux/slices/companySlice';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { showToast } from '../Job-portal/services/toast';
import { notificationAPI } from '../Job-portal/services/api';

const SERIF = "'Cormorant Garamond', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const CompanyLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isFetchingProfile } = useSelector((state) => state.company);
  const { isSidebarCollapsed } = useSelector((state) => state.ui);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const displayImage = profile?.logo?.url || profile?.logoPreview || user?.profile?.avatar || user?.avatar;

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user?._id]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.notifications?.filter(n => !n.isRead).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  useEffect(() => {
    if (!profile && !isFetchingProfile) {
      dispatch(getCompanyProfile());
    }
  }, [dispatch, profile, isFetchingProfile]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  // SOCKET.IO REAL-TIME NOTIFICATIONS
  useEffect(() => {
    if (user?._id) {
      const backendUrl = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || '').replace(/\/api$/, '') || window.location.origin;
      const socket = io(backendUrl, {
        withCredentials: true
      });

      socket.emit('join', user._id);

      socket.on('notification', (payload) => {
        console.log('📬 Live Notification:', payload);

        // Add to list and update count
        const newNotif = {
          _id: `temp-${Date.now()}`, // Temporary ID
          title: payload.data.title,
          message: payload.data.message,
          type: payload.type,
          isRead: false,
          createdAt: new Date().toISOString()
        };

        setNotifications(prev => [newNotif, ...prev].slice(0, 20));
        setUnreadCount(prev => prev + 1);

        if (payload.type === 'NEW_APPLICATION') {
          showToast.success(`New Application: ${payload.data.title}`);
        }
      });

      return () => socket.disconnect();
    }
  }, [user?._id]);

  return (
    <div className="min-h-screen bg-[#F7F8FF] dark:bg-[#1A1D2E] text-[#1A1D2E] dark:text-[#E8EAF2] font-sans selection:bg-[#3B4FD8]/20 dark:selection:bg-[#6C7EF5]/20">
      <CompanySidebar />

      <main className={`p-4 md:p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Top Header Row: Search & Profile */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex w-full items-center justify-between md:hidden pb-4 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 mb-2">
            <h1 className="text-xl font-bold text-[#1A1D2E] dark:text-[#E8EAF2] leading-tight" style={{ fontFamily: SERIF }}>EMT Jobs</h1>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#3B4FD8]/5 dark:hover:bg-[#6C7EF5]/5 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="hidden md:block">
            {/* Empty block to keep alignment consistent */}
          </div>

          {/* Right Side: Notification & Profile */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-end ml-auto">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors rounded-none outline-none focus:outline-none"
                aria-label="Notifications"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#E25C5C] text-white text-[9px] font-bold flex items-center justify-center border border-white dark:border-[#1A1D2E] font-mono leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 bg-white dark:bg-[#252A41] rounded-none shadow-sm border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 z-[60]">
                  <div className="p-4 border-b border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-between bg-[#F7F8FF] dark:bg-[#1A1D2E]">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#1A1D2E] dark:text-[#E8EAF2]" style={{ fontFamily: MONO }}>Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-[#3B4FD8] dark:text-[#6C7EF5] hover:underline uppercase tracking-wider"
                        style={{ fontFamily: MONO }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[380px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center">
                        <Bell className="w-10 h-10 text-[#6B7194]/30 dark:text-[#8B90B8]/30 mx-auto mb-3" />
                        <p className="text-[10px] text-[#6B7194] dark:text-[#8B90B8] uppercase tracking-widest font-bold" style={{ fontFamily: MONO }}>No notifications yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#3B4FD8]/10 dark:divide-[#6C7EF5]/10">
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-4 hover:bg-[#F7F8FF] dark:hover:bg-[#1A1D2E] transition-colors group relative ${!notification.isRead ? 'bg-[#3B4FD8]/5 dark:bg-[#6C7EF5]/5' : ''}`}
                          >
                            <div className="flex gap-4">
                              <div className="flex-shrink-0 w-10 h-10 border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 flex items-center justify-center bg-white dark:bg-[#252A41] text-[#3B4FD8] dark:text-[#6C7EF5] rounded-none">
                                {notification.type === 'NEW_APPLICATION' ? <Users size={18} /> : <Bell size={18} />}
                              </div>
                              <div className="flex-1 min-w-0 pr-6">
                                <p className={`text-sm font-bold text-[#1A1D2E] dark:text-[#E8EAF2] mb-0.5 truncate ${!notification.isRead ? '' : 'opacity-70'}`} style={{ fontFamily: SERIF }}>
                                  {notification.title}
                                </p>
                                <p className="text-[11px] leading-relaxed text-[#6B7194] dark:text-[#8B90B8] line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-1.5 mt-2 text-[9px] text-[#6B7194] dark:text-[#8B90B8] font-bold uppercase tracking-widest" style={{ fontFamily: MONO }}>
                                  <ClockIcon size={10} />
                                  <span>{new Date(notification.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification._id)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-none text-[#3B4FD8] dark:text-[#6C7EF5] hover:bg-[#3B4FD8]/10 dark:hover:bg-[#6C7EF5]/10 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 bg-white dark:bg-[#252A41]"
                                  title="Mark as read"
                                >
                                  <Check size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 text-center bg-[#F7F8FF] dark:bg-[#1A1D2E]">
                    <button className="text-[9px] font-bold text-[#6B7194] dark:text-[#8B90B8] hover:text-[#3B4FD8] dark:hover:text-[#6C7EF5] transition-colors uppercase tracking-[0.2em]" style={{ fontFamily: MONO }}>
                      View all activities
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-4 pl-6 border-l border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 focus:outline-none"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="text-right hidden sm:block">
                  <h4 className="text-[13px] font-bold text-[#1A1D2E] dark:text-[#E8EAF2] leading-none mb-1">
                    {profile?.companyName || user?.name || 'Company User'}
                  </h4>
                  <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#6B7194] dark:text-[#8B90B8]" style={{ fontFamily: MONO }}>
                    {user?.role || 'Employer'}
                  </p>
                </div>
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Profile"
                    className="w-10 h-10 object-cover rounded-none border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-[#F7F8FF] dark:bg-[#1A1D2E] border border-[#3B4FD8]/20 dark:border-[#6C7EF5]/20 text-[#3B4FD8] dark:text-[#6C7EF5] rounded-none shadow-sm">
                    <User size={18} />
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-[#252A41] rounded-none shadow-sm border border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 overflow-hidden z-50">
                  <div className="p-2 space-y-1 relative">
                    {/* The Triangle Pointer */}
                    <div className="absolute -top-[5px] right-[20px] w-2 h-2 bg-white dark:bg-[#252A41] border-l border-t border-[#3B4FD8]/10 dark:border-[#6C7EF5]/10 rotate-45"></div>
                    
                    <Link to="/company/settings" className="flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-[#6B7194] dark:text-[#8B90B8] hover:bg-[#F7F8FF] dark:hover:bg-[#1A1D2E] hover:text-[#1A1D2E] dark:hover:text-[#E8EAF2] rounded-none transition-colors" style={{ fontFamily: MONO }}>
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-[#E25C5C] hover:bg-[#E25C5C]/10 rounded-none transition-colors text-left"
                        style={{ fontFamily: MONO }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
        <ProfileCompletionPopup />
      </main>
    </div>
  );
};

export default CompanyLayout;
