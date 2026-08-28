import React from 'react';
import { Clock, Users, Ticket, CheckCircle2 } from 'lucide-react';

const QueueCard = ({ queueData }) => {
  if (!queueData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center text-slate-500">
        No active queue information available.
      </div>
    );
  }

  const { token, currently_serving_token, farmers_ahead, estimated_wait_time, status, centre_name } = queueData;

  return (
    <div className="bg-emerald-gradient rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
      {/* Decorative SVG pattern */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
        <svg width="240" height="240" viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="80" />
        </svg>
      </div>

      <div className="flex justify-between items-start border-b border-white/20 pb-4 mb-4">
        <div>
          <span className="bg-white/20 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Live Queue Tracker
          </span>
          <h2 className="text-lg font-semibold mt-1">{centre_name || 'Procurement Centre'}</h2>
        </div>
        <div className="bg-white text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Status: {status}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Token */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <p className="text-xs text-emerald-100 flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5" /> Your Token
          </p>
          <p className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-wide">{token || 'N/A'}</p>
        </div>

        {/* Currently Serving */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <p className="text-xs text-emerald-100">Currently Serving</p>
          <p className="text-2xl md:text-3xl font-extrabold text-amber-300 mt-1">{currently_serving_token || 'None'}</p>
        </div>

        {/* Farmers Ahead */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <p className="text-xs text-emerald-100 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Farmers Ahead
          </p>
          <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">{farmers_ahead}</p>
        </div>

        {/* Est. Wait Time */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <p className="text-xs text-emerald-100 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Est. Waiting Time
          </p>
          <p className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            {estimated_wait_time} <span className="text-xs font-normal text-emerald-200">mins</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QueueCard;
