import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CalendarDays, Plus } from 'lucide-react';

const SlotsManager = () => {
  const [slots, setSlots] = useState([]);
  const [centres, setCentres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    centre_id: 1,
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '09:30',
    capacity: 20
  });

  useEffect(() => {
    fetchSlots();
    api.get('/centres').then(res => setCentres(res.data));
  }, []);

  const fetchSlots = () => {
    api.get('/slots').then(res => setSlots(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/slots', formData).then(() => {
      fetchSlots();
      setShowModal(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Procurement Slot Management</h1>
          <p className="text-xs text-slate-500 mt-1">Configure timed slots and max farmer capacities per centre.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Slot
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b">
            <tr>
              <th className="p-3.5">Centre ID</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Time Slot</th>
              <th className="p-3.5">Booked / Capacity</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slots.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900">Centre #{s.centre_id}</td>
                <td className="p-3.5 text-slate-800">{s.date}</td>
                <td className="p-3.5 font-semibold text-emerald-700">{s.start_time} – {s.end_time}</td>
                <td className="p-3.5 text-slate-700">{s.booked_count} / {s.capacity}</td>
                <td className="p-3.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-md w-full space-y-4">
            <h3 className="font-bold text-base text-slate-900">Create Procurement Time Slot</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Centre</label>
                <select value={formData.centre_id} onChange={e => setFormData({ ...formData, centre_id: parseInt(e.target.value) })} className="w-full p-2 bg-slate-50 border rounded-lg">
                  {centres.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full p-2 bg-slate-50 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input type="text" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} className="w-full p-2 bg-slate-50 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input type="text" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} className="w-full p-2 bg-slate-50 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Slot Capacity</label>
                <input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="w-full p-2 bg-slate-50 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">Create Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotsManager;
