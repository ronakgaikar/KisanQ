import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const BookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/queue/1').then(res => setBookings(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">System Wide Bookings</h1>
        <p className="text-xs text-slate-500 mt-1">Audit log of all farmer slot bookings across procurement centres.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading bookings...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3.5">Token</th>
                <th className="p-3.5">Farmer</th>
                <th className="p-3.5">Crop</th>
                <th className="p-3.5">Expected Qty</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{b.token}</td>
                  <td className="p-3.5 text-slate-800">{b.farmer_name}</td>
                  <td className="p-3.5 text-slate-700">{b.crop_name}</td>
                  <td className="p-3.5 text-slate-700">{b.expected_quantity} Qtl</td>
                  <td className="p-3.5"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingsManager;
