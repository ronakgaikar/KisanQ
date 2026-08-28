import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import QueueCard from '../../components/QueueCard';
import StatusBadge from '../../components/StatusBadge';
import { Clock, RefreshCw, Users, ShieldCheck } from 'lucide-react';

const QueueStatus = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [centreQueue, setCentreQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // Live poll every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    api.get('/dashboard/farmer')
      .then((res) => {
        setDashboardData(res.data);
        if (res.data.next_booking?.centre_id) {
          api.get(`/queue/${res.data.next_booking.centre_id}`)
            .then(qRes => setCentreQueue(qRes.data));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const queueData = dashboardData?.live_queue;
  const userToken = queueData?.token;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Your Queue Status</h1>
          <p className="text-xs text-slate-500 mt-1">Live queue position, farmers ahead, and estimated wait minutes.</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Prominent Live Queue Card */}
      {queueData ? (
        <QueueCard queueData={queueData} />
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
          No active queue found for your account.
        </div>
      )}

      {/* Live Queue Table with Highlighted User Row */}
      {centreQueue.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" /> Centre Live Queue List
            </h3>
            <span className="text-xs text-slate-500">Total Waiting: {centreQueue.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="p-3.5">Pos</th>
                  <th className="p-3.5">Token</th>
                  <th className="p-3.5">Farmer</th>
                  <th className="p-3.5">Crop</th>
                  <th className="p-3.5">Expected Qty</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Est. Wait</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {centreQueue.map((item, idx) => {
                  const isUser = item.token === userToken;
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${isUser ? 'bg-emerald-100/70 font-bold border-l-4 border-l-emerald-600' : 'hover:bg-slate-50'}`}
                    >
                      <td className="p-3.5 text-slate-500">{idx + 1}</td>
                      <td className="p-3.5 font-extrabold text-slate-900 flex items-center gap-1.5">
                        {item.token}
                        {isUser && (
                          <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
                            YOU
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-800">{item.farmer_name}</td>
                      <td className="p-3.5 text-slate-700">{item.crop_name}</td>
                      <td className="p-3.5 text-slate-700">{item.expected_quantity} Qtl</td>
                      <td className="p-3.5"><StatusBadge status={item.status} /></td>
                      <td className="p-3.5 text-slate-600">{item.estimated_wait_time} mins</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueStatus;
