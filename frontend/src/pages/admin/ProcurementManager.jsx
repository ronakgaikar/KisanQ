import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

const ProcurementManager = () => {
  const [procurementRecords, setProcurementRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin').then(() => {
      setProcurementRecords([
        { id: 1, booking_code: 'BK-2026-00101', farmer_name: 'Rajesh Farmer', crop_name: 'Wheat', actual_quantity: 28.0, rate: 2275.0, total_amount: 63700.0, quality_grade: 'Grade A', status: 'COMPLETED' },
        { id: 2, booking_code: 'BK-2026-00102', farmer_name: 'Sunil Patil', crop_name: 'Rice', actual_quantity: 30.5, rate: 2275.0, total_amount: 69387.5, quality_grade: 'Grade A', status: 'COMPLETED' },
        { id: 3, booking_code: 'BK-2026-00103', farmer_name: 'Anil Deshmukh', crop_name: 'Maize', actual_quantity: 33.0, rate: 2183.0, total_amount: 72039.0, quality_grade: 'Grade A', status: 'COMPLETED' },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Procurement Records Log</h1>
        <p className="text-xs text-slate-500 mt-1">Detailed log of actual crop weights, rates, total valuations, and quality grades.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading procurement logs...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3.5">Booking Code</th>
                <th className="p-3.5">Farmer Name</th>
                <th className="p-3.5">Crop</th>
                <th className="p-3.5">Actual Weight</th>
                <th className="p-3.5">Rate / Qtl</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Grade</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {procurementRecords.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{p.booking_code}</td>
                  <td className="p-3.5 font-semibold text-slate-900">{p.farmer_name}</td>
                  <td className="p-3.5 text-slate-700">{p.crop_name}</td>
                  <td className="p-3.5 font-bold text-slate-800">{p.actual_quantity} Qtl</td>
                  <td className="p-3.5 text-slate-700">₹{p.rate}</td>
                  <td className="p-3.5 font-extrabold text-emerald-800">₹{p.total_amount.toLocaleString()}</td>
                  <td className="p-3.5 text-slate-600">{p.quality_grade}</td>
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

export default ProcurementManager;
