import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { CalendarPlus, Ticket, Building2, Calendar, Clock, XCircle } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    api.get('/bookings/my')
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      api.put(`/bookings/${id}/cancel`).then(() => {
        fetchBookings();
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Bookings</h1>
          <p className="text-xs text-slate-500 mt-1">History of all your procurement slot bookings.</p>
        </div>
        <Link
          to="/farmer/book-slot"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <CalendarPlus className="w-4 h-4" /> Book New Slot
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
          No booking records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map(b => (
            <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Booking ID</span>
                  <p className="text-sm font-extrabold text-slate-900">{b.booking_id}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Token</span>
                  <p className="text-lg font-black text-emerald-600">{b.token}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Centre:</span>
                  <span className="font-semibold text-slate-800">{b.centre_name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Crop & Qty:</span>
                  <span className="font-semibold text-slate-800">{b.crop_name} ({b.expected_quantity} Qtl)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date & Time:</span>
                  <span className="font-medium text-slate-700">{b.date} | {b.time_slot}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <StatusBadge status={b.status} />
                {['BOOKED', 'WAITING', 'ARRIVED'].includes(b.status) && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
