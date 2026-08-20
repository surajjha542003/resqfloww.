'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DisruptionModal } from '@/components/dashboard/DisruptionModal';
import { MonitoringBanner } from '@/components/dashboard/MonitoringBanner';
import { AllStatesPreviewModal } from '@/components/dashboard/AllStatesPreviewModal';
import { RouteCorridorModal } from '@/components/dashboard/RouteCorridorModal';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans antialiased">
      {/* Left Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Top Header */}
      <Header onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      {/* Main Content Area */}
      <main className="lg:ml-64 pt-16 flex-1 flex flex-col min-h-[calc(100vh-4rem)] bg-surface-container-lowest">
        {/* Continuous Monitoring alert notification */}
        <MonitoringBanner />

        {/* Page Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-5">{children}</div>
      </main>

      {/* Global Simulate Disruption Modal */}
      <DisruptionModal />

      {/* National All-India 29 States Command Matrix Preview Modal */}
      <AllStatesPreviewModal />

      {/* Route Corridor Inspector Modal */}
      <RouteCorridorModal />
    </div>
  );
}
