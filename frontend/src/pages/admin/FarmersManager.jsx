import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users } from 'lucide-react';

const FarmersManager = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats / farmers list
    api.get('/dashboard/admin').then(() => {
      // Seed list view demo data
      setFarmers([
        { id: 1, name: 'Rajesh Farmer', mobile: '9876543210', farmer_id: 'FARM-2026-001', village: 'Khed', district: 'Pune', state: 'Maharashtra' },
        { id: 2, name: 'Sunil Patil', mobile: '9876543211', farmer_id: 'FARM-2026-002', village: 'Baramati', district: 'Pune', state: 'Maharashtra' },
        { id: 3, name: 'Anil Deshmukh', mobile: '9876543212', farmer_id: 'FARM-2026-003', village: 'Haveli', district: 'Pune', state: 'Maharashtra' },
        { id: 4, name: 'Vikas Shinde', mobile: '9876543213', farmer_id: 'FARM-2026-004', village: 'Shirur', district: 'Pune', state: 'Maharashtra' },
        { id: 5, name: 'Sanjay Pawar', mobile: '9876543214', farmer_id: 'FARM-2026-005', village: 'Daund', district: 'Pune', state: 'Maharashtra' }
      ]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Registered Farmers Directory</h1>
        <p className="text-xs text-slate-500 mt-1">Overview of registered farmers across all districts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b">
            <tr>
              <th className="p-3.5">Farmer ID</th>
              <th className="p-3.5">Name</th>
              <th className="p-3.5">Mobile</th>
              <th className="p-3.5">Village</th>
              <th className="p-3.5">District</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {farmers.map(f => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-emerald-700">{f.farmer_id}</td>
                <td className="p-3.5 font-bold text-slate-900">{f.name}</td>
                <td className="p-3.5 text-slate-700">{f.mobile}</td>
                <td className="p-3.5 text-slate-700">{f.village}</td>
                <td className="p-3.5 text-slate-700">{f.district}, {f.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmersManager;
