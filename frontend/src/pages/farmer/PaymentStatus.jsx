import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { CreditCard, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

const PaymentStatus = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/my')
      .then(res => setPayments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Payment Tracking</h1>
        <p className="text-xs text-slate-500 mt-1">Direct payment status, transaction reference IDs, and settlement dates.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading payment records...</div>
      ) : payments.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
          No payment records found. Payments will generate automatically upon procurement completion.
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Transaction Ref</span>
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{p.transaction_id || 'Generating...'}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1">₹{p.amount.toLocaleString()}</h3>
                <p className="text-xs text-slate-500">
                  Date: {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'Processing'}
                </p>
              </div>

              <div>
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
