import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { ListOrdered, UserCheck, Clock, PlayCircle, CheckCircle2, PhoneCall, ArrowRight } from 'lucide-react';

const OperatorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = () => {
    api.get('/dashboard/operator?centre_id=1')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Operator Dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            Operator Console
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.centre_name || 'Procurement Centre'}</h1>
        </div>
        <Link
          to="/operator/queue"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-emerald-200 flex items-center gap-2 text-xs transition-colors"
        >
          <PhoneCall className="w-4 h-4" /> Open Live Queue Counter
        </Link>
      </div>

      {/* Overview Stat Cards (Section 18) */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Overview Counters</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total Bookings" value={stats?.total_bookings || 0} icon={ListOrdered} color="blue" />
        <StatCard title="Arrived" value={stats?.arrived || 0} icon={UserCheck} color="purple" />
        <StatCard title="Waiting" value={stats?.waiting || 0} icon={Clock} color="amber" />
        <StatCard title="Processing" value={stats?.processing || 0} icon={PlayCircle} color="indigo" />
        <StatCard title="Completed" value={stats?.completed || 0} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Quick Action Navigation Card */}
      <div className="bg-emerald-gradient text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h3 className="text-xl font-extrabold">Live Operational Queue</h3>
          <p className="text-xs text-emerald-100 mt-1">Manage arrival verification, call next farmer, and record procurement metrics.</p>
        </div>
        <Link
          to="/operator/queue"
          className="bg-white text-emerald-900 font-bold px-4 py-2.5 rounded-xl shadow text-xs hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
        >
          Go to Live Queue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OperatorDashboard;
