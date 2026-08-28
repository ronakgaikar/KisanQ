import React from 'react';

const OperatorsManager = () => {
  const operators = [
    { id: 1, name: 'Ramesh Operator', mobile: '8888888881', centre: 'Pune Central APMC Procurement Centre' },
    { id: 2, name: 'Suresh Operator', mobile: '8888888882', centre: 'Nashik Grain Procurement Hub' },
    { id: 3, name: 'Mahesh Operator', mobile: '8888888883', centre: 'Nagpur Agricultural Mandi' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Procurement Operators Directory</h1>
        <p className="text-xs text-slate-500 mt-1">Manage assigned mandis and counter operator staff.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b">
            <tr>
              <th className="p-3.5">Operator Name</th>
              <th className="p-3.5">Mobile</th>
              <th className="p-3.5">Assigned Centre</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {operators.map(op => (
              <tr key={op.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900">{op.name}</td>
                <td className="p-3.5 text-slate-700">{op.mobile}</td>
                <td className="p-3.5 text-emerald-800 font-semibold">{op.centre}</td>
                <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperatorsManager;
