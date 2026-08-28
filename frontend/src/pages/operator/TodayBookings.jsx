import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { ListOrdered } from 'lucide-react';

const TodayBookings = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/queue/1')
      .then(res => setQueue(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Today's Bookings</h1>
        <p className="text-xs text-slate-500 mt-1">List of all scheduled farmer procurement bookings for today.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading bookings...</div>
        ) : queue.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No bookings scheduled for today.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3.5">Token</th>
                <th className="p-3.5">Farmer Name</th>
                <th className="p-3.5">Crop</th>
                <th className="p-3.5">Expected Qty</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{item.token}</td>
                  <td className="p-3.5 text-slate-800">{item.farmer_name}</td>
                  <td className="p-3.5 text-slate-700">{item.crop_name}</td>
                  <td className="p-3.5 text-slate-700">{item.expected_quantity} Qtl</td>
                  <td className="p-3.5"><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TodayBookings;
