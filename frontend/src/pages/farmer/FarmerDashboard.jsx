import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import QueueCard from '../../components/QueueCard';
import StatusBadge from '../../components/StatusBadge';
import { CalendarPlus, Ticket, Clock, FileText, CreditCard, ChevronRight, AlertCircle, ArrowRight } from 'lucide-react';

const FarmerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Live poll queue position every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = () => {
    api.get('/dashboard/farmer')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Loading your farmer dashboard...
      </div>
    );
  }

  const { next_booking, live_queue, procurement, payment } = data || {};

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Farmer Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time status of your slot booking, queue position, procurement, and payment.</p>
        </div>
        <Link
          to="/farmer/book-slot"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-200 flex items-center gap-2 text-xs transition-colors shrink-0"
        >
          <CalendarPlus className="w-4 h-4" />
          Book New Slot
        </Link>
      </div>

      {/* Live Queue Card */}
      {live_queue ? (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Live Queue Tracker</h2>
          <QueueCard queueData={live_queue} />
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">No Active Slot Bookings</h3>
          <p className="text-xs text-slate-600 mt-1">You currently have no active procurement slot bookings.</p>
          <Link
            to="/farmer/book-slot"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl mt-4 hover:bg-emerald-700 transition-colors"
          >
            Book Procurement Slot Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 3 Main Workflow Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Booking Details */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-emerald-600" /> Next Booking
              </span>
              <StatusBadge status={next_booking?.status} />
            </div>

            {next_booking ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Token</span>
                  <span className="font-extrabold text-slate-900 text-sm">{next_booking.token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Centre</span>
                  <span className="font-semibold text-slate-800 text-right">{next_booking.centre_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Slot</span>
                  <span className="font-medium text-slate-700">{next_booking.date} ({next_booking.time_slot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Crop</span>
                  <span className="font-medium text-slate-700">{next_booking.crop_name}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No upcoming booking.</p>
            )}
          </div>

          <Link
            to="/farmer/bookings"
            className="mt-4 pt-3 border-t text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-between"
          >
            <span>View All Bookings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Procurement Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Procurement Status
              </span>
              <StatusBadge status={procurement?.status || 'PENDING'} />
            </div>

            {procurement ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Quantity</span>
                  <span className="font-semibold text-slate-800">{procurement.expected_quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Actual Quantity</span>
                  <span className="font-bold text-emerald-700">{procurement.actual_quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Rate</span>
                  <span className="font-semibold text-slate-800">{procurement.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Amount</span>
                  <span className="font-extrabold text-slate-900">{procurement.total_amount}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">Procurement entry pending counter arrival.</p>
            )}
          </div>

          <Link
            to="/farmer/procurement"
            className="mt-4 pt-3 border-t text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-between"
          >
            <span>View Procurement Record</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Payment Tracking
              </span>
              <StatusBadge status={payment?.status || 'PENDING'} />
            </div>

            {payment ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-extrabold text-slate-900 text-sm">{payment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono text-slate-700 text-[11px] truncate max-w-[150px]">{payment.transaction_id}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">Payment tracking will update after procurement.</p>
            )}
          </div>

          <Link
            to="/farmer/payments"
            className="mt-4 pt-3 border-t text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-between"
          >
            <span>View Payment Details</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
