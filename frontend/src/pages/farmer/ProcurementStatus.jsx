import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { FileCheck2, Scale, Tag, Banknote, Calendar } from 'lucide-react';

const ProcurementStatus = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/farmer')
      .then(res => setData(res.data.procurement))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Procurement Verification</h1>
        <p className="text-xs text-slate-500 mt-1">Official recording of crop weight, rate, total amount, and quality grade.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading procurement details...</div>
      ) : data ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase">Record Status</span>
              <div className="mt-1"><StatusBadge status={data.status} /></div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold uppercase">Total Procurement Amount</span>
              <p className="text-3xl font-black text-emerald-700 mt-1">{data.total_amount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 flex items-center gap-1"><Scale className="w-4 h-4 text-emerald-600" /> Expected Quantity</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{data.expected_quantity}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold"><Scale className="w-4 h-4 text-emerald-600" /> Actual Measured Qty</p>
              <p className="text-xl font-extrabold text-emerald-900 mt-1">{data.actual_quantity}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 flex items-center gap-1"><Tag className="w-4 h-4 text-emerald-600" /> Rate per Quintal</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{data.rate}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
          No completed procurement record yet.
        </div>
      )}
    </div>
  );
};

export default ProcurementStatus;
