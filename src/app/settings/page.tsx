'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { LocationSelector } from '@/components/ui/LocationSelector';

export default function SettingsPage() {
  const { resetSimulation } = useSimulationStore();

  return (
    <div className="space-y-4 max-w-[1000px] mx-auto">
      {/* Top Banner */}
      <div className="bg-surface border border-outline-variant rounded-lg p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">
            settings
          </span>
          <h2 className="text-base font-bold text-on-surface font-sans">
            ResQFlow System Settings & Parameters
          </h2>
        </div>
        <p className="text-xs text-on-surface-variant font-mono mt-0.5">
          Disaster management thresholds, API connectors, and optimization weights
        </p>
      </div>

      {/* Settings Sections */}
      <div className="bg-surface border border-outline-variant rounded-lg p-4 space-y-6 shadow-xs">
        {/* Section 1: Response Sector */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-on-surface font-sans">
            1. Primary Response Jurisdiction
          </h3>
          <p className="text-xs text-on-surface-variant">
            Set the default center of operations for satellite feeds, hospitals, and road networks.
          </p>
          <div className="pt-1">
            <LocationSelector />
          </div>
        </div>

        <div className="border-t border-outline-variant" />

        {/* Section 2: Multi-Agent Optimization Parameters */}
        <div className="space-y-3 font-sans">
          <h3 className="text-sm font-bold text-on-surface">
            2. Google OR-Tools Solver Constraints
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold block">
                Critical Stockout Threshold
              </span>
              <span className="text-base font-bold text-error mt-1 block">&lt; 8 Hours</span>
              <span className="text-[10px] text-outline mt-0.5 block">
                Triggers Priority 01 emergency dispatch
              </span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold block">
                Re-planning Trigger Interval
              </span>
              <span className="text-base font-bold text-primary mt-1 block">12 Seconds</span>
              <span className="text-[10px] text-outline mt-0.5 block">
                Continuous background radar re-evaluation
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant" />

        {/* Section 3: Stitch Design System Connector */}
        <div className="space-y-2 font-mono text-xs">
          <h3 className="text-sm font-bold text-on-surface font-sans">
            3. Stitch UI Design System Integration
          </h3>
          <div className="p-3 bg-surface-container rounded-lg border border-outline-variant space-y-1.5">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Stitch Project ID:</span>
              <span className="font-bold text-primary">13255571167516538126</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Design System Theme:</span>
              <span className="font-bold text-on-surface">Light / FIDELITY (#0037b0)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Server API Route:</span>
              <span className="font-bold text-on-surface">/api/stitch/screens</span>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant" />

        {/* Section 4: Reset Simulation State */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-on-surface font-sans">
              Reset Simulation State
            </h3>
            <p className="text-xs text-on-surface-variant">
              Clear active incident telemetry and restore normal conditions.
            </p>
          </div>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-surface border border-error/30 text-error hover:bg-error/10 font-mono text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Reset to Normal
          </button>
        </div>
      </div>
    </div>
  );
}
