'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSimulationStore } from '@/store/simulationStore';
import { LocationSelector } from '@/components/ui/LocationSelector';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Operational Overview', subtitle: 'Live Multi-Agent Command' },
  '/dashboard': { title: 'Operational Overview', subtitle: 'Live Multi-Agent Command' },
  '/incidents': { title: 'Live Incidents', subtitle: 'Real-time Hazard Tracking' },
  '/delivery-plan': { title: 'Recommended Delivery Plan', subtitle: 'OR-Tools Optimal Allocations' },
  '/warehouses': { title: 'Warehouses & Supply Depots', subtitle: 'Regional Stock Telemetry' },
  '/hospitals': { title: 'Hospitals & Relief Centers', subtitle: 'Consumption & Shortage Risk' },
  '/fleet': { title: 'Fleet & Mobility Units', subtitle: 'Vehicle Availability & Routing' },
  '/roads': { title: 'Roads & Mobility Network', subtitle: 'Segment Blockages & Alternates' },
  '/risk': { title: 'Risk & Flood Plain Assessment', subtitle: 'Vulnerability Analysis' },
  '/activity': { title: 'Multi-Agent Activity Log', subtitle: 'Deterministic Pipeline Trace' },
  '/reports': { title: 'Operational Reports & Analytics', subtitle: 'Response Metrics & Archive' },
  '/settings': { title: 'System Configuration', subtitle: 'Parameters & Integrations' },
};

export function Header({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const pathname = usePathname();
  const {
    simulationActive,
    disruptionType,
    openDisruptionModal,
    openStatesPreview,
    isSimulating,
  } = useSimulationStore();

  const currentMeta = PAGE_TITLES[pathname] || {
    title: 'ResQFlow Console',
    subtitle: 'Emergency Logistics Control',
  };

  return (
    <header className="bg-surface h-16 fixed top-0 right-0 left-0 lg:left-64 border-b border-outline-variant flex justify-between items-center px-4 lg:px-6 z-30 transition-all">
      {/* Left Area: Mobile hamburger + Page Title + Location + Status */}
      <div className="flex items-center gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            suppressHydrationWarning
            className="lg:hidden p-1.5 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
        )}

        <div>
          <h2 className="text-base font-bold text-on-surface font-sans leading-tight">
            {currentMeta.title}
          </h2>
          <p className="text-[11px] text-on-surface-variant font-mono hidden sm:block">
            {currentMeta.subtitle}
          </p>
        </div>

        <div className="h-5 w-px bg-outline-variant hidden sm:block" />

        {/* Location selector */}
        <div className="hidden sm:block">
          <LocationSelector />
        </div>

        {/* Condition state badge */}
        <span
          className={`hidden md:inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
            simulationActive
              ? 'bg-error/10 text-error border-error/20'
              : 'bg-primary/10 text-primary border-primary/20'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full inline-block ${
              simulationActive ? 'bg-error animate-ping' : 'bg-primary'
            }`}
          />
          {simulationActive
            ? `${disruptionType?.toUpperCase() || 'FLOOD'} ACTIVE`
            : 'NORMAL CONDITIONS'}
        </span>
      </div>

      {/* Right Area: All-India Preview CTA, Search, Simulate CTA, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* All-India 29 States Preview Mode Button */}
        <button
          onClick={openStatesPreview}
          suppressHydrationWarning
          className="bg-surface border border-outline-variant hover:bg-surface-container text-on-surface font-mono text-[11px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Open All-India 29 States Matrix Preview"
        >
          <span className="material-symbols-outlined text-primary text-[16px]">
            public
          </span>
          <span className="hidden xl:inline">All States (29)</span>
          <span className="xl:hidden">29 States</span>
        </button>

        {/* Quick Search */}
        <div className="relative hidden 2xl:block">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
            search
          </span>
          <input
            suppressHydrationWarning
            className="bg-surface-container-low border border-outline-variant rounded-lg pl-8 pr-3 py-1 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary w-36 transition-all focus:w-48 font-mono"
            placeholder="Search assets..."
            type="text"
          />
        </div>

        {/* Simulate Disruption Button */}
        <button
          onClick={openDisruptionModal}
          disabled={isSimulating}
          suppressHydrationWarning
          className="bg-primary-container hover:bg-primary text-on-primary font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning_amber
          </span>
          <span className="whitespace-nowrap">
            {isSimulating ? 'Simulating...' : 'Simulate Disruption'}
          </span>
        </button>

        {/* Notification Bell */}
        <button
          suppressHydrationWarning
          className="relative text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container p-1.5 rounded-full"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {simulationActive && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border border-surface" />
          )}
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[12px] font-bold border border-outline-variant font-mono">
          DR
        </div>
      </div>
    </header>
  );
}
