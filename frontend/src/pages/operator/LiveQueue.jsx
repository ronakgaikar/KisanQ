import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ProcurementEntryModal from './ProcurementEntryModal';
import { PhoneCall, UserCheck, Play, CheckCircle2, SkipForward, RefreshCw, Users } from 'lucide-react';

const LiveQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForEntry, setSelectedBookingForEntry] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Live poll queue every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = () => {
    api.get('/queue/1') // Default centre 1
      .then(res => setQueue(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCallNext = () => {
    api.post('/queue/call-next?centre_id=1')
      .then(res => {
        setActionMessage(res.data.message);
        fetchQueue();
        setTimeout(() => setActionMessage(''), 4000);
      })
      .catch(err => {
        alert(err.response?.data?.detail || 'No farmers currently waiting in queue.');
      });
  };

  const handleMarkArrived = (bookingId) => {
    api.post(`/queue/${bookingId}/arrive`).then(() => fetchQueue());
  };

  const handleStart = (bookingId) => {
    api.post(`/queue/${bookingId}/start`).then(() => fetchQueue());
  };

  const handleSkip = (bookingId) => {
    api.post(`/queue/${bookingId}/skip`).then(() => fetchQueue());
  };

  return (
    <div className="space-y-6">
      {/* Header & Prominent CALL NEXT FARMER Button */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Live Counter Queue Control</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time arrival verification, calling tokens, and starting procurement counters.</p>
        </div>

        <button
          onClick={handleCallNext}
          className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-amber-200 flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <PhoneCall className="w-5 h-5" /> CALL NEXT FARMER
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl animate-bounce">
          {actionMessage}
        </div>
      )}

      {/* Live Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" /> Active Queue Table ({queue.length} Farmers)
          </h3>
          <button
            onClick={fetchQueue}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading queue table...</div>
        ) : queue.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No farmers currently waiting in the queue.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="p-3.5">Token</th>
                  <th className="p-3.5">Farmer Name</th>
                  <th className="p-3.5">Crop</th>
                  <th className="p-3.5">Expected Qty</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Counter Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map(item => (
                  <tr key={item.id} className={`hover:bg-slate-50 ${item.status === 'CALLED' ? 'bg-amber-50/80 font-bold' : ''}`}>
                    <td className="p-3.5 font-extrabold text-slate-900 text-sm">{item.token}</td>
                    <td className="p-3.5 text-slate-800 font-semibold">{item.farmer_name}</td>
                    <td className="p-3.5 text-slate-700">{item.crop_name}</td>
                    <td className="p-3.5 text-slate-700">{item.expected_quantity} Qtl</td>
                    <td className="p-3.5"><StatusBadge status={item.status} /></td>
                    <td className="p-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        {item.status === 'WAITING' && (
                          <button
                            onClick={() => handleMarkArrived(item.booking_id)}
                            className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold px-2.5 py-1 rounded-lg border border-purple-200 text-[11px] flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" /> Mark Arrived
                          </button>
                        )}

                        {['ARRIVED', 'CALLED'].includes(item.status) && (
                          <button
                            onClick={() => handleStart(item.booking_id)}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold px-2.5 py-1 rounded-lg border border-indigo-200 text-[11px] flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" /> Start
                          </button>
                        )}

                        {['PROCESSING', 'CALLED', 'ARRIVED'].includes(item.status) && (
                          <button
                            onClick={() => setSelectedBookingForEntry({
                              booking_id_num: item.booking_id,
                              booking_id: item.booking_id,
                              token: item.token,
                              farmer_name: item.farmer_name,
                              crop_name: item.crop_name,
                              expected_quantity: item.expected_quantity
                            })}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg shadow text-[11px] flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Complete
                          </button>
                        )}

                        <button
                          onClick={() => handleSkip(item.booking_id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-2 py-1 rounded-lg text-[11px]"
                        >
                          Skip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Procurement Entry Modal */}
      {selectedBookingForEntry && (
        <ProcurementEntryModal
          booking={selectedBookingForEntry}
          onClose={() => setSelectedBookingForEntry(null)}
          onSuccess={() => {
            fetchQueue();
            setActionMessage('✓ Procurement completed & payment record generated.');
            setTimeout(() => setActionMessage(''), 4000);
          }}
        />
      )}
    </div>
  );
};

export default LiveQueue;
