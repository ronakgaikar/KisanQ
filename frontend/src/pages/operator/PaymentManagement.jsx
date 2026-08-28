import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { CreditCard, CheckCircle2, RefreshCw } from 'lucide-react';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = () => {
    // Fetch all bookings with procurement and payment
    api.get('/dashboard/admin').then(() => {
      // In operator mode, fetch procurement list
      api.get('/dashboard/operator?centre_id=1').then(() => {
        // Fetch payment records
        api.get('/payments/my').then(res => setPayments(res.data)).catch(() => {});
      });
    }).finally(() => setLoading(false));
  };

  const handleUpdateStatus = (id, newStatus) => {
    api.put(`/payments/${id}/status`, { status: newStatus }).then(() => {
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Payment Status Management</h1>
          <p className="text-xs text-slate-500 mt-1">Update direct payment statuses for completed procurement records.</p>
        </div>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No payment records found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3.5">Ref ID</th>
                <th className="p-3.5">Farmer Name</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Update Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-slate-800">{p.transaction_id || `PAY-${p.id}`}</td>
                  <td className="p-3.5 text-slate-900 font-semibold">{p.farmer_name}</td>
                  <td className="p-3.5 font-extrabold text-emerald-800">₹{p.amount.toLocaleString()}</td>
                  <td className="p-3.5"><StatusBadge status={p.status} /></td>
                  <td className="p-3.5 text-right">
                    <select
                      value={p.status}
                      onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                      className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
