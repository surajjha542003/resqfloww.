'use client';

import React from 'react';

const PAST_REPORTS = [
  {
    id: 'REP-2026-0818',
    title: 'Monsoon Flash Flood Response — Dibrugarh Sector',
    date: 'Aug 18, 2026',
    deliveriesCompleted: 48,
    patientsServed: 3200,
    suppliesDispatched: '14,200 kg',
    avgEta: '38 min',
    status: 'Completed',
  },
  {
    id: 'REP-2026-0724',
    title: 'Bogibeel Embankment Breach Emergency Operation',
    date: 'Jul 24, 2026',
    deliveriesCompleted: 82,
    patientsServed: 7800,
    suppliesDispatched: '29,400 kg',
    avgEta: '44 min',
    status: 'Completed',
  },
  {
    id: 'REP-2026-0612',
    title: 'Pre-Monsoon Pre-positioning & Stock Transfer',
    date: 'Jun 12, 2026',
    deliveriesCompleted: 34,
    patientsServed: 1900,
    suppliesDispatched: '18,500 kg',
    avgEta: '52 min',
    status: 'Archived',
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Top Banner */}
      <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              assessment
            </span>
            <h2 className="text-base font-bold text-on-surface font-sans">
              Operational Reports & Post-Incident Analytics
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            Audit-ready delivery logs, fuel metrics, and hospital shortage turnaround data
          </p>
        </div>

        <button className="px-4 py-1.5 bg-primary-container hover:bg-primary text-on-primary font-mono text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer">
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>Export Analytics (CSV)</span>
        </button>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Total Relief Missions
          </span>
          <div className="text-xl font-bold text-on-surface font-sans mt-1">164 Missions</div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Total Supplies Delivered
          </span>
          <div className="text-xl font-bold text-primary font-sans mt-1">62.1 Tons</div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Avg Route Optimization Gain
          </span>
          <div className="text-xl font-bold text-primary font-sans mt-1">+39.4% Faster</div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Stockout Prevention Rate
          </span>
          <div className="text-xl font-bold text-on-surface font-sans mt-1">98.2% Success</div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-surface border border-outline-variant rounded-lg overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-low text-outline font-mono text-[10px] uppercase border-b border-outline-variant">
            <tr>
              <th className="p-3 font-semibold">Operation ID & Title</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Deliveries</th>
              <th className="p-3 font-semibold">Supplies Dispatched</th>
              <th className="p-3 font-semibold">Patients Reached</th>
              <th className="p-3 font-semibold">Avg ETA</th>
              <th className="p-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 font-sans">
            {PAST_REPORTS.map((rep) => (
              <tr key={rep.id} className="hover:bg-surface-container-low transition-colors text-on-surface">
                <td className="p-3">
                  <span className="font-bold text-on-surface text-[13px] block">
                    {rep.title}
                  </span>
                  <span className="text-[11px] font-mono text-outline">{rep.id}</span>
                </td>
                <td className="p-3 font-mono text-[11px]">{rep.date}</td>
                <td className="p-3 font-mono font-semibold">{rep.deliveriesCompleted}</td>
                <td className="p-3 font-mono font-semibold">{rep.suppliesDispatched}</td>
                <td className="p-3 font-mono font-semibold">{rep.patientsServed.toLocaleString()}</td>
                <td className="p-3 font-mono text-primary font-bold">{rep.avgEta}</td>
                <td className="p-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {rep.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
