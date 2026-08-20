'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DetailPanel } from '@/components/ui/DetailPanel';
import type { Vehicle } from '@/types';

export default function FleetPage() {
  const { activeVehicles, currentLocation } = useSimulationStore();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = activeVehicles.filter((veh) => {
    if (filterType !== 'all' && veh.type !== filterType) return false;
    if (filterStatus !== 'all' && veh.status !== filterStatus) return false;
    return true;
  });

  const availableCount = activeVehicles.filter((v) => v.status === 'available').length;
  const enRouteCount = activeVehicles.filter((v) => v.status === 'en_route').length;
  const maintCount = activeVehicles.filter((v) => v.status === 'maintenance').length;

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            {currentLocation.name} Fleet Size
          </span>
          <div className="text-xl font-bold text-on-surface font-sans mt-1">
            {activeVehicles.length} Units
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Ready / Available
          </span>
          <div className="text-xl font-bold text-primary font-sans mt-1">
            {availableCount} Ready
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Active Deliveries
          </span>
          <div className="text-xl font-bold text-tertiary font-sans mt-1">
            {enRouteCount} Dispatched
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            In Maintenance
          </span>
          <div className="text-xl font-bold text-outline font-sans mt-1">
            {maintCount} Units
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-outline-variant rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-on-surface-variant font-semibold">Type:</span>
          {['all', 'van', 'truck', 'ambulance', 'boat', 'helicopter'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                  : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}

          <div className="h-4 w-px bg-outline-variant mx-1 hidden sm:block" />

          <span className="text-on-surface-variant font-semibold">Status:</span>
          {['all', 'available', 'en_route', 'maintenance'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors cursor-pointer ${
                filterStatus === s
                  ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                  : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'
              }`}
            >
              {s.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-outline">
          {filtered.length} vehicles matching in {currentLocation.name}
        </span>
      </div>

      {/* Fleet Table */}
      <div className="bg-surface border border-outline-variant rounded-lg overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-low text-outline font-mono text-[10px] uppercase border-b border-outline-variant">
            <tr>
              <th className="p-3 font-semibold">Vehicle Unit</th>
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Payload Capacity</th>
              <th className="p-3 font-semibold">Driver / Pilot</th>
              <th className="p-3 font-semibold">Home Depot</th>
              <th className="p-3 text-right font-semibold">Fuel Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {filtered.map((veh) => {
              const icon =
                veh.type === 'boat'
                  ? 'directions_boat'
                  : veh.type === 'helicopter'
                  ? 'helicopter'
                  : veh.type === 'ambulance'
                  ? 'emergency'
                  : 'local_shipping';

              return (
                <tr
                  key={veh.id}
                  onClick={() => setSelectedVehicle(veh)}
                  className="hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface font-sans"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        {icon}
                      </span>
                      <div>
                        <span className="font-bold text-on-surface text-[13px] block">
                          {veh.name}
                        </span>
                        <span className="text-[11px] font-mono text-outline">
                          Telemetry: {veh.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-[11px] uppercase">{veh.type}</td>
                  <td className="p-3">
                    <StatusBadge status={veh.status} />
                  </td>
                  <td className="p-3 font-mono text-[11px]">
                    {veh.currentLoad > 0 ? `${veh.currentLoad} / ` : ''}
                    {veh.capacity} kg
                  </td>
                  <td className="p-3 text-[12px]">{veh.driver}</td>
                  <td className="p-3 font-mono font-semibold text-primary">{veh.nearestWarehouse}</td>
                  <td className="p-3 text-right font-mono font-bold text-[12px]">
                    <span
                      className={
                        veh.fuelLevel < 50
                          ? 'text-error'
                          : veh.fuelLevel < 75
                          ? 'text-tertiary'
                          : 'text-primary'
                      }
                    >
                      {veh.fuelLevel}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vehicle Detail Drawer */}
      <DetailPanel
        isOpen={Boolean(selectedVehicle)}
        onClose={() => setSelectedVehicle(null)}
        title={selectedVehicle?.name || 'Vehicle Telemetry'}
        subtitle={`Vehicle ID: ${selectedVehicle?.id} | Telemetry Live`}
        actions={
          <button
            onClick={() => setSelectedVehicle(null)}
            className="px-4 py-1.5 bg-primary-container text-on-primary rounded font-mono text-xs font-bold"
          >
            Close Telemetry
          </button>
        }
      >
        {selectedVehicle && (
          <div className="space-y-4 font-sans text-xs">
            <div className="flex gap-2">
              <StatusBadge status={selectedVehicle.status} size="md" />
              <span className="font-mono text-xs text-outline my-auto">
                Type: {selectedVehicle.type.toUpperCase()}
              </span>
            </div>

            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant font-mono space-y-2">
              <div>
                <span className="text-outline text-[10px] block uppercase">Designated Driver</span>
                <span className="font-semibold text-on-surface">{selectedVehicle.driver}</span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">Current Location</span>
                <span className="text-on-surface">
                  {selectedVehicle.position.lat.toFixed(4)}°N, {selectedVehicle.position.lng.toFixed(4)}°E
                </span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">Assigned Warehouse</span>
                <span className="font-semibold text-primary">{selectedVehicle.nearestWarehouse}</span>
              </div>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between p-2 bg-surface-container-low rounded border border-outline-variant">
                <span>Payload Capacity</span>
                <span className="font-bold">{selectedVehicle.capacity} kg</span>
              </div>
              <div className="flex justify-between p-2 bg-surface-container-low rounded border border-outline-variant">
                <span>Current Fuel Tank</span>
                <span className="font-bold text-primary">{selectedVehicle.fuelLevel}%</span>
              </div>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
