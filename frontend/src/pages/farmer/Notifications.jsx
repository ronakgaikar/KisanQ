import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    api.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const markAsRead = (id) => {
    api.put(`/notifications/${id}/read`).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">In-App Notifications</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time alerts for booking confirmation, queue turns, procurement & payment.</p>
        </div>
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
          <Bell className="w-5 h-5" />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                n.is_read ? 'bg-white border-slate-200 text-slate-700' : 'bg-emerald-50/70 border-emerald-300 font-semibold text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <p className="text-xs leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
