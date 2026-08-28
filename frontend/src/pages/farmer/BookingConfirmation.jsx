import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { CheckCircle2, Ticket, Calendar, Clock, Building2, Wheat, ArrowRight } from 'lucide-react';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bookings/${bookingId}`)
      .then(res => setBooking(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading booking details...</div>;
  }

  if (!booking) {
    return <div className="p-8 text-center text-slate-500">Booking details not found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-extrabold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          ✓ BOOKING CONFIRMED
        </span>

        <h1 className="text-2xl font-extrabold text-slate-900 mt-3">Procurement Token Issued</h1>
        <p className="text-xs text-slate-500 mt-1">Your slot has been registered in the smart queue system.</p>

        {/* Token Box */}
        <div className="bg-emerald-gradient text-white rounded-2xl p-6 my-6 shadow-lg relative overflow-hidden">
          <p className="text-xs text-emerald-100 uppercase font-semibold">Your Digital Queue Token</p>
          <p className="text-5xl font-black tracking-wider mt-1">{booking.token}</p>
          <p className="text-xs text-emerald-100 mt-2">Booking ID: {booking.booking_id}</p>
        </div>

        {/* Summary Details */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5 text-left">
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500 flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Centre</span>
            <span className="font-bold text-slate-900">{booking.centre_name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500 flex items-center gap-1"><Wheat className="w-3.5 h-3.5" /> Crop</span>
            <span className="font-bold text-slate-900">{booking.crop_name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date</span>
            <span className="font-bold text-slate-900">{booking.date}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Time Slot</span>
            <span className="font-bold text-emerald-700">{booking.time_slot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Expected Quantity</span>
            <span className="font-bold text-slate-900">{booking.expected_quantity} Quintal</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Link
            to="/farmer/queue"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            View Queue <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/farmer/dashboard"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
