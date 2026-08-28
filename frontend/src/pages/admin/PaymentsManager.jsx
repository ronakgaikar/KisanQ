import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const PaymentsManager = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/my').then(res => setPayments(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">System Wide Payment Tracking</h1>
        <p className="text-xs text-slate-500 mt-1">Audit log of direct farmer payment disbursements.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading payments...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3.5">Transaction Ref</th>
                <th className="p-3.5">Farmer Name</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-slate-800">{p.transaction_id || `PAY-${p.id}`}</td>
                  <td className="p-3.5 text-slate-900 font-semibold">{p.farmer_name}</td>
                  <td className="p-3.5 font-extrabold text-emerald-800">₹{p.amount.toLocaleString()}</td>
                  <td className="p-3.5"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentsManager;
