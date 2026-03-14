import React, { useState, useRef, useEffect } from 'react';
import CompanySidebar from './CompanySidebar';
import ProfileCompletionPopup from './ProfileCompletionPopup';
import { Search, Bell, Settings, LogOut, User, Menu, X, Check, Clock as ClockIcon, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { getCompanyProfile } from '../../redux/slices/companySlice';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { showToast } from '../Job-portal/services/toast';
import { notificationAPI } from '../Job-portal/services/api';

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
      const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000', {
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white font-sans">
      <CompanySidebar />

      <main className={`p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Top Header Row: Search & Profile */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex w-full items-center justify-between md:hidden pb-4 border-b border-gray-200 dark:border-gray-800 mb-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">EMT Jobs</h1>
            <button
              onClick={() => dispatch({ type: 'ui/toggleSidebar' })}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Search Bar - Optional, maybe search within company context */}
          <div className="relative w-full md:max-w-xl hidden md:block opacity-0 pointer-events-none">
            {/* Hidden placeholder to keep alignment matching Student Dashboard */}
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-800 rounded-xl"
            />
          </div>

          {/* Right Side: Notification & Profile */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-end ml-auto">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#0a0a0f]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 bg-white dark:bg-[#1a1c23] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[380px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center">
                        <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group relative ${!notification.isRead ? 'bg-teal-50/10 dark:bg-teal-500/5' : ''}`}
                          >
                            <div className="flex gap-4">
                              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${notification.type === 'NEW_APPLICATION' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                }`}>
                                {notification.type === 'NEW_APPLICATION' ? <Users size={20} /> : <Bell size={20} />}
                              </div>
                              <div className="flex-1 min-w-0 pr-6">
                                <p className={`text-sm font-bold text-gray-900 dark:text-white mb-0.5 truncate ${!notification.isRead ? '' : 'opacity-70'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                  <ClockIcon size={12} />
                                  <span>{new Date(notification.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                              {!notification.isRead && (
                                <button
                                  onClick={() => markAsRead(notification._id)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-teal-100 dark:border-teal-900/30 bg-white dark:bg-gray-800"
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

                  <div className="p-3 border-t border-gray-100 dark:border-gray-800 text-center bg-gray-50/30 dark:bg-gray-800/10">
                    <button className="text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-teal-500 transition-colors uppercase tracking-widest">
                      View all activities
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800 focus:outline-none"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="text-right hidden sm:block">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    {profile?.companyName || user?.name || 'Company User'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || 'Employer'}
                  </p>
                </div>
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt="Profile"
                    className={`w-10 h-10 rounded-full object-cover border-2 shadow-sm transition-colors ${isProfileOpen ? 'border-teal-500' : 'border-white dark:border-gray-800'
                      }`}
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 shadow-sm transition-colors ${isProfileOpen ? 'border-teal-500 text-teal-600' : 'border-white dark:border-gray-800 text-gray-400'}`}>
                    <User size={20} />
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1a1c23] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-2">
                    <Link to="/company/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                      <Settings size={18} />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-left"
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
