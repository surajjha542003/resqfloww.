'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DetailPanel } from '@/components/ui/DetailPanel';
import type { Road } from '@/types';

export default function RoadsPage() {
  const { activeRoads, currentLocation } = useSimulationStore();
  const [selectedRoad, setSelectedRoad] = useState<Road | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = activeRoads.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            {currentLocation.name} Segments
          </span>
          <div className="text-xl font-bold text-on-surface font-sans mt-1">
            {activeRoads.length} Segments
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Passable / Open
          </span>
          <div className="text-xl font-bold text-primary font-sans mt-1">
            {activeRoads.filter((r) => r.status === 'open').length} Open
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Blocked & Flooded
          </span>
          <div className="text-xl font-bold text-error font-sans mt-1">
            {activeRoads.filter((r) => r.status === 'blocked' || r.status === 'flooded').length} Cut Off
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Alternate Routes
          </span>
          <div className="text-xl font-bold text-on-surface font-sans mt-1">100% Routed</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-outline-variant rounded-lg p-3 flex items-center justify-between shadow-xs font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant font-semibold">Filter:</span>
          {['all', 'open', 'blocked', 'flooded', 'damaged'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors cursor-pointer ${
                filterStatus === s
                  ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                  : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
        <span className="text-outline">
          {filtered.length} segments in {currentLocation.name} ({currentLocation.state})
        </span>
      </div>

      {/* Roads Table */}
      <div className="bg-surface border border-outline-variant rounded-lg overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-low text-outline font-mono text-[10px] uppercase border-b border-outline-variant">
            <tr>
              <th className="p-3 font-semibold">Road Segment</th>
              <th className="p-3 font-semibold">From → To</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Distance</th>
              <th className="p-3 font-semibold">Estimated Travel</th>
              <th className="p-3 font-semibold">Alternate Route</th>
              <th className="p-3 text-right font-semibold">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 font-sans">
            {filtered.map((road) => (
              <tr
                key={road.id}
                onClick={() => setSelectedRoad(road)}
                className="hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface"
              >
                <td className="p-3">
                  <span className="font-bold text-on-surface text-[13px] block">
                    {road.name}
                  </span>
                  <span className="text-[11px] font-mono text-outline">{road.id}</span>
                </td>
                <td className="p-3 font-mono text-[11px]">
                  {road.from} → {road.to}
                </td>
                <td className="p-3">
                  <StatusBadge status={road.status} />
                </td>
                <td className="p-3 font-mono text-[11px]">{road.distanceKm} km</td>
                <td className="p-3 font-mono text-[11px]">{road.estimatedTimeMin} min</td>
                <td className="p-3 font-mono text-[11px]">
                  {road.alternateRoute ? (
                    <span className="text-primary font-semibold">{road.alternateRoute}</span>
                  ) : (
                    <span className="text-outline">Primary path</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <StatusBadge status={road.riskLevel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Road Segment Detail Drawer */}
      <DetailPanel
        isOpen={Boolean(selectedRoad)}
        onClose={() => setSelectedRoad(null)}
        title={selectedRoad?.name || 'Road Segment'}
        subtitle={`Segment ID: ${selectedRoad?.id} | Mobility Telemetry`}
        actions={
          <button
            onClick={() => setSelectedRoad(null)}
            className="px-4 py-1.5 bg-primary-container text-on-primary rounded font-mono text-xs font-bold"
          >
            Close Segment Detail
          </button>
        }
      >
        {selectedRoad && (
          <div className="space-y-4 font-sans text-xs">
            <div className="flex gap-2">
              <StatusBadge status={selectedRoad.status} size="md" />
              <StatusBadge status={selectedRoad.riskLevel} size="md" />
            </div>

            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant font-mono space-y-2">
              <div>
                <span className="text-outline text-[10px] block uppercase">Origin Node</span>
                <span className="font-semibold text-on-surface">{selectedRoad.from}</span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">Destination Node</span>
                <span className="font-semibold text-on-surface">{selectedRoad.to}</span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">Length & Transit Time</span>
                <span className="font-semibold text-on-surface">
                  {selectedRoad.distanceKm} km (~{selectedRoad.estimatedTimeMin} mins)
                </span>
              </div>
            </div>

            {selectedRoad.alternateRoute && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 font-mono">
                <span className="text-[10px] text-primary uppercase font-bold block">
                  OR-Tools Alternate Route Recommended
                </span>
                <span className="text-sm font-bold text-primary mt-1 block">
                  {selectedRoad.alternateRoute}
                </span>
              </div>
            )}
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
