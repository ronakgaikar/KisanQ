import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeClass = (st) => {
    switch (st?.toUpperCase()) {
      case 'BOOKED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ARRIVED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'WAITING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CALLED':
        return 'bg-yellow-200 text-yellow-900 border-yellow-300 animate-pulse font-bold';
      case 'PROCESSING':
      case 'IN_PROGRESS':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 font-semibold';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold';
      case 'SKIPPED':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'PENDING':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${getBadgeClass(status)}`}>
      {status || 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;
