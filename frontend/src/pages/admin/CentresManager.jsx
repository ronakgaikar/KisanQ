import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';

const CentresManager = () => {
  const [centres, setCentres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', address: '', district: '', state: '', capacity: 50, average_processing_time: 10, status: 'ACTIVE'
  });

  useEffect(() => {
    fetchCentres();
  }, []);

  const fetchCentres = () => {
    api.get('/centres').then(res => setCentres(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/centres', formData).then(() => {
      fetchCentres();
      setShowModal(false);
      setFormData({ name: '', address: '', district: '', state: '', capacity: 50, average_processing_time: 10, status: 'ACTIVE' });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Procurement Centres Management</h1>
          <p className="text-xs text-slate-500 mt-1">Configure physical mandi centres, daily capacities, and average processing times.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Centre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {centres.map(c => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-extrabold text-slate-900 text-base">{c.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {c.status}
              </span>
            </div>
            <p className="text-xs text-slate-600">{c.address}, {c.district}, {c.state}</p>
            <div className="pt-2 border-t flex justify-between text-xs text-slate-500">
              <span>Capacity: <strong>{c.capacity}/day</strong></span>
              <span>Avg Process: <strong>{c.average_processing_time} min</strong></span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-md w-full space-y-4">
            <h3 className="font-bold text-base text-slate-900">Add Procurement Centre</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Centre Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 bg-slate-50 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Address *</label>
                <input required type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-2 bg-slate-50 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District *</label>
                  <input required type="text" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} className="w-full p-2 bg-slate-50 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State *</label>
                  <input required type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full p-2 bg-slate-50 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Capacity/Day</label>
                  <input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="w-full p-2 bg-slate-50 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Avg Process Time (min)</label>
                  <input type="number" value={formData.average_processing_time} onChange={e => setFormData({ ...formData, average_processing_time: parseInt(e.target.value) })} className="w-full p-2 bg-slate-50 border rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">Save Centre</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CentresManager;
