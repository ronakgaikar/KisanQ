import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { Users, Building2, CalendarDays, CheckCircle2, Clock, Scale, Banknote, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading System Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
            Department Admin Console
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">System Overview & Analytics</h1>
        </div>
        <Link
          to="/admin/analytics"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs transition-colors flex items-center gap-1.5"
        >
          <BarChart3 className="w-4 h-4" /> View Visual Charts
        </Link>
      </div>

      {/* Aggregate Statistics Cards (Section 24) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Farmers" value={stats?.total_farmers || 0} icon={Users} color="emerald" />
        <StatCard title="Procurement Centres" value={stats?.total_centres || 0} icon={Building2} color="purple" />
        <StatCard title="Total Bookings" value={stats?.total_bookings || 0} icon={CalendarDays} color="blue" />
        <StatCard title="Completed Procurement" value={stats?.completed_procurement || 0} icon={CheckCircle2} color="emerald" />
        <StatCard title="Pending Procurement" value={stats?.pending_procurement || 0} icon={Clock} color="amber" />
        <StatCard title="Total Quantity Procured" value={`${stats?.total_quantity_procured || 0} Qtl`} icon={Scale} color="indigo" />
        <StatCard title="Total Procurement Value" value={`₹${(stats?.total_procurement_value || 0).toLocaleString()}`} icon={Banknote} color="emerald" />
      </div>
    </div>
  );
};

export default AdminDashboard;
