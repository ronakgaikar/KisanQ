import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Wheat, Plus } from 'lucide-react';

const CropsManager = () => {
  const [crops, setCrops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cropName, setCropName] = useState('');
  const [unit, setUnit] = useState('Quintal');

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = () => {
    api.get('/crops').then(res => setCrops(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/crops', { name: cropName, unit }).then(() => {
      fetchCrops();
      setShowModal(false);
      setCropName('');
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Crop Types Management</h1>
          <p className="text-xs text-slate-500 mt-1">Configure supported agricultural procurement crops and measurement units.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Crop
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {crops.map(c => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
              <Wheat className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">{c.name}</h3>
            <p className="text-xs text-slate-500 mt-1">Measurement Unit: <strong>{c.unit}</strong></p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-base text-slate-900">Add New Crop</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop Name *</label>
                <input required type="text" value={cropName} onChange={e => setCropName(e.target.value)} placeholder="e.g. Mustard (Sarson)" className="w-full p-2 bg-slate-50 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit</label>
                <input type="text" value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">Add Crop</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropsManager;
