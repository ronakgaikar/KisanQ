import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Bell, LogOut, User as UserIcon, Menu, X, Sprout, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === 'FARMER') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = () => {
    api.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(() => {});
  };

  const markAsRead = (id) => {
    api.put(`/notifications/${id}/read`).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'FARMER') return '/farmer/dashboard';
    if (user.role === 'OPERATOR') return '/operator/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top Govt Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium text-emerald-400">Department of Consumer Affairs (DoCA)</span>
          <span className="hidden sm:inline">| Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>
        <div className="text-slate-400">SIH Problem ID: 26032</div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <RouterLink to={getDashboardPath()} className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Kisan<span className="text-emerald-600">Q</span></span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Smart Procurement</span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block">Book. Track. Procure. Without the Wait.</p>
          </div>
        </RouterLink>

        {/* Right Action Icons & Role */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* Role Badge */}
            <span className="hidden md:inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {user.role}
            </span>

            {/* Notification Bell for Farmers */}
            {user.role === 'FARMER' && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifPopover(!showNotifPopover)}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popover */}
                {showNotifPopover && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Notifications</h4>
                      <RouterLink
                        to="/farmer/notifications"
                        onClick={() => setShowNotifPopover(false)}
                        className="text-xs text-emerald-600 font-semibold hover:underline"
                      >
                        View All
                      </RouterLink>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-slate-500 text-center">No notifications yet.</p>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-3 text-xs cursor-pointer transition-colors ${n.is_read ? 'bg-white text-slate-600' : 'bg-emerald-50/60 font-semibold text-slate-900'}`}
                          >
                            <p>{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <span className="text-sm font-semibold text-slate-800 hidden lg:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <RouterLink
              to="/login"
              className="text-xs font-semibold text-slate-700 hover:text-emerald-600 px-3 py-2"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-sm shadow-emerald-200 transition-colors"
            >
              Farmer Registration
            </RouterLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
