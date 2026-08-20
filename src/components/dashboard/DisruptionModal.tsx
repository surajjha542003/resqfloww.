'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import type { DisruptionType } from '@/types';

export function DisruptionModal() {
  const {
    isDisruptionModalOpen,
    closeDisruptionModal,
    triggerSimulation,
    isSimulating,
    currentLocation,
  } = useSimulationStore();

  const [type, setType] = useState<DisruptionType>('flood');
  const [severity, setSeverity] = useState<'high' | 'medium' | 'low'>('high');

  if (!isDisruptionModalOpen) return null;

  const affectedRoadsEstimate = severity === 'high' ? 6 : severity === 'medium' ? 3 : 1;
  const affectedZonesEstimate = severity === 'high' ? 3 : severity === 'medium' ? 2 : 1;

  const handleSimulate = async () => {
    await triggerSimulation(type, severity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-surface border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                warning_amber
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface font-sans">
                Simulate Disruption Event
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">
                Inject real-time hazard into multi-agent pipeline
              </p>
            </div>
          </div>
          <button
            onClick={closeDisruptionModal}
            className="p-1 rounded hover:bg-surface-container text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 font-sans text-xs">
          {/* Field 1: Disruption Type */}
          <div>
            <label className="block font-mono uppercase font-bold text-[11px] text-on-surface mb-1.5">
              Disruption Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'flood', label: 'Flood Overflow', icon: 'water' },
                { id: 'road_closure', label: 'Road Closure', icon: 'block' },
                { id: 'accident', label: 'Accident Gridlock', icon: 'car_crash' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id as DisruptionType)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    type === item.id
                      ? 'bg-primary-container text-on-primary border-primary font-bold shadow-xs'
                      : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] mb-1">
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-mono leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Field 2: Location Sector */}
          <div>
            <label className="block font-mono uppercase font-bold text-[11px] text-on-surface mb-1">
              Location Sector
            </label>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant font-mono text-xs flex items-center justify-between text-on-surface">
              <span>
                {currentLocation.name}, {currentLocation.state} (India)
              </span>
              <span className="text-[10px] text-outline">Active Jurisdiction</span>
            </div>
          </div>

          {/* Field 3: Severity */}
          <div>
            <label className="block font-mono uppercase font-bold text-[11px] text-on-surface mb-1.5">
              Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono">
              {[
                { id: 'high', label: 'High (Critical)', color: 'text-error' },
                { id: 'medium', label: 'Moderate', color: 'text-tertiary' },
                { id: 'low', label: 'Low Advisory', color: 'text-primary' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSeverity(lvl.id as 'high' | 'medium' | 'low')}
                  className={`py-2 px-1 rounded-lg border text-center text-[11px] font-semibold transition-colors cursor-pointer ${
                    severity === lvl.id
                      ? 'bg-surface-container-high border-primary text-on-surface ring-1 ring-primary'
                      : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Impact preview summary */}
          <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/60 grid grid-cols-2 gap-2 text-center font-mono">
            <div>
              <span className="text-[10px] text-outline uppercase block">Estimated Blocked Roads</span>
              <span className="text-sm font-bold text-error">~{affectedRoadsEstimate} segments</span>
            </div>
            <div>
              <span className="text-[10px] text-outline uppercase block">Affected Risk Zones</span>
              <span className="text-sm font-bold text-tertiary">~{affectedZonesEstimate} sectors</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-low flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={closeDisruptionModal}
            disabled={isSimulating}
            className="px-4 py-2 bg-surface border border-outline-variant rounded-lg text-xs font-mono font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary rounded-lg text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
                <span>Optimizing Delivery Flow...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">
                  play_arrow
                </span>
                <span>Simulate Event</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
