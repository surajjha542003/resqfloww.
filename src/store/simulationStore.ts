import { create } from 'zustand';
import type {
  Location,
  DisruptionType,
  AgentState,
  DeliveryPlan,
  DeliveryPlanItem,
  ImpactMetrics,
  DashboardMetrics,
  Warehouse,
  Hospital,
  Vehicle,
  Road,
  Incident,
  Zone,
} from '@/types';
import {
  DEFAULT_LOCATION,
  generateStateData,
} from '@/data/mock';

interface MapLayers {
  warehouses: boolean;
  hospitals: boolean;
  vehicles: boolean;
  routes: boolean;
  floodZones: boolean;
  incidents: boolean;
}

interface SimulationStore {
  // Location & All-States Preview
  currentLocation: Location;
  setLocation: (loc: Location) => void;
  isStatesPreviewOpen: boolean;
  openStatesPreview: () => void;
  closeStatesPreview: () => void;

  // Active State's Local Data (Hospitals, Warehouses, Roads, etc.)
  activeWarehouses: Warehouse[];
  activeHospitals: Hospital[];
  activeVehicles: Vehicle[];
  activeRoads: Road[];
  activeIncidents: Incident[];
  activeZones: Zone[];
  lastIncidentSync: Date;
  refreshIncidents: () => Promise<void>;
  isRefreshingIncidents: boolean;

  // Simulation State
  isDisruptionModalOpen: boolean;
  openDisruptionModal: () => void;
  closeDisruptionModal: () => void;

  // Route Inspector Modal & Map Focus
  isRouteModalOpen: boolean;
  openRouteModal: () => void;
  closeRouteModal: () => void;
  routeFocusTimestamp: number;
  triggerRouteFocus: () => void;

  isSimulating: boolean;
  simulationActive: boolean;
  disruptionType: DisruptionType | null;
  disruptionSeverity: 'high' | 'medium' | 'low';
  affectedRoadsCount: number;
  affectedZonesCount: number;

  // Continuous monitoring notification
  monitoringAlert: string | null;
  dismissMonitoringAlert: () => void;

  // Agents
  agentStates: AgentState[];

  // Delivery Plan
  deliveryPlan: DeliveryPlan;
  activePlanItem: DeliveryPlanItem | null;
  setActivePlanItem: (item: DeliveryPlanItem | null) => void;
  isPlanApproved: boolean;
  approvePlan: () => void;
  recalculatePlan: () => void;

  // Metrics
  metrics: DashboardMetrics;
  impactMetrics: ImpactMetrics;

  // Map state
  selectedEntity: { type: string; id: string; name: string } | null;
  setSelectedEntity: (entity: { type: string; id: string; name: string } | null) => void;
  mapLayers: MapLayers;
  toggleMapLayer: (layer: keyof MapLayers) => void;
  highlightedRouteId: string | null;
  setHighlightedRouteId: (id: string | null) => void;

  // Actions
  triggerSimulation: (type: DisruptionType, severity: 'high' | 'medium' | 'low') => Promise<void>;
  resetSimulation: () => void;
}

const initialDataset = generateStateData(DEFAULT_LOCATION);

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  currentLocation: DEFAULT_LOCATION,
  isStatesPreviewOpen: false,
  openStatesPreview: () => set({ isStatesPreviewOpen: true }),
  closeStatesPreview: () => set({ isStatesPreviewOpen: false }),

  // Dynamic active dataset
  activeWarehouses: initialDataset.warehouses,
  activeHospitals: initialDataset.hospitals,
  activeVehicles: initialDataset.vehicles,
  activeRoads: initialDataset.roads,
  activeIncidents: initialDataset.incidents,
  activeZones: initialDataset.zones,
  lastIncidentSync: new Date(),
  isRefreshingIncidents: false,

  refreshIncidents: async () => {
    set({ isRefreshingIncidents: true });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const loc = get().currentLocation;
    const data = generateStateData(loc);
    
    // Update reported timestamps to simulated real-time
    const updatedIncidents = data.incidents.map((inc, i) => ({
      ...inc,
      reportedAt: i === 0 ? 'Just now (Radar Sync)' : `${(i + 1) * 3} min ago`,
    }));

    set({
      activeIncidents: updatedIncidents,
      lastIncidentSync: new Date(),
      isRefreshingIncidents: false,
    });
  },

  // Route Inspector Modal & Map Focus
  isRouteModalOpen: false,
  openRouteModal: () => set({ isRouteModalOpen: true }),
  closeRouteModal: () => set({ isRouteModalOpen: false }),
  routeFocusTimestamp: 0,
  triggerRouteFocus: () => {
    set({ routeFocusTimestamp: Date.now(), isRouteModalOpen: true });
  },

  setLocation: (loc: Location) => {
    const data = generateStateData(loc);
    set({
      currentLocation: loc,
      activeWarehouses: data.warehouses,
      activeHospitals: data.hospitals,
      activeVehicles: data.vehicles,
      activeRoads: data.roads,
      activeIncidents: data.incidents,
      activeZones: data.zones,
      deliveryPlan: data.deliveryPlan,
      activePlanItem: data.deliveryPlan.items[0],
      agentStates: data.agentStates,
      metrics: data.metrics,
      impactMetrics: data.impactMetrics,
      isPlanApproved: false,
      monitoringAlert: null,
      highlightedRouteId: 'H-07',
      lastIncidentSync: new Date(),
      routeFocusTimestamp: Date.now(),
    });
  },

  isDisruptionModalOpen: false,
  openDisruptionModal: () => set({ isDisruptionModalOpen: true }),
  closeDisruptionModal: () => set({ isDisruptionModalOpen: false }),

  isSimulating: false,
  simulationActive: true,
  disruptionType: 'flood',
  disruptionSeverity: 'high',
  affectedRoadsCount: 4,
  affectedZonesCount: 2,

  monitoringAlert: null,
  dismissMonitoringAlert: () => set({ monitoringAlert: null }),

  agentStates: initialDataset.agentStates,
  deliveryPlan: initialDataset.deliveryPlan,
  activePlanItem: initialDataset.deliveryPlan.items[0],
  setActivePlanItem: (item) => set({ activePlanItem: item, routeFocusTimestamp: Date.now() }),
  isPlanApproved: false,

  approvePlan: () => {
    set((state) => ({
      isPlanApproved: true,
      deliveryPlan: { ...state.deliveryPlan, status: 'approved' },
      metrics: {
        ...state.metrics,
        activeDeliveries: state.metrics.activeDeliveries + 1,
        availableVehicles: Math.max(0, state.metrics.availableVehicles - 1),
      },
    }));

    setTimeout(() => {
      set({
        monitoringAlert:
          'Continuous Monitoring Active: Sensor telemetry synchronised with national disaster grid.',
      });
    }, 4000);
  },

  recalculatePlan: () => {
    const loc = get().currentLocation;
    const data = generateStateData(loc);

    set({
      agentStates: [
        { name: 'Demand Agent', status: 'running', message: `Re-evaluating ${loc.name} hospital consumption rates...`, icon: '…' },
        { name: 'Risk Agent', status: 'running', message: `Checking ${loc.state} radar and hydro gauge feeds...`, icon: '…' },
        { name: 'Mobility Agent', status: 'running', message: 'Scanning alternate road corridors...', icon: '…' },
        { name: 'Inventory Agent', status: 'running', message: 'Verifying depot allocations...', icon: '…' },
        { name: 'Fleet Agent', status: 'running', message: 'Recalculating vehicle turnaround times...', icon: '…' },
        { name: 'Orchestrator', status: 'running', message: 'Solving linear optimization model...', icon: '⚡' },
      ],
    });

    setTimeout(() => {
      set({
        agentStates: data.agentStates,
        isPlanApproved: false,
        deliveryPlan: {
          ...data.deliveryPlan,
          generatedAt: `Recalculated just now for ${loc.name}, ${loc.state} via Google OR-Tools`,
        },
      });
    }, 1200);
  },

  metrics: initialDataset.metrics,
  impactMetrics: initialDataset.impactMetrics,

  selectedEntity: null,
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),

  mapLayers: {
    warehouses: true,
    hospitals: true,
    vehicles: true,
    routes: true,
    floodZones: true,
    incidents: true,
  },
  toggleMapLayer: (layer) =>
    set((state) => ({
      mapLayers: { ...state.mapLayers, [layer]: !state.mapLayers[layer] },
    })),

  highlightedRouteId: 'H-07',
  setHighlightedRouteId: (id) => set({ highlightedRouteId: id, routeFocusTimestamp: Date.now() }),

  triggerSimulation: async (type: DisruptionType, severity: 'high' | 'medium' | 'low') => {
    const loc = get().currentLocation;

    set({
      isSimulating: true,
      isDisruptionModalOpen: false,
      isPlanApproved: false,
      monitoringAlert: null,
      disruptionType: type,
      disruptionSeverity: severity,
    });

    const steps: { name: AgentState['name']; msg: string; icon: AgentState['icon'] }[] = [
      {
        name: 'Demand Agent',
        msg: `${type.toUpperCase()} in ${loc.name}: Critical shortfall projected across ${severity === 'high' ? '4' : '2'} facilities.`,
        icon: '!',
      },
      {
        name: 'Risk Agent',
        msg: `${loc.state} Hazard Zones classified: 3 active inundation sectors.`,
        icon: '⚠',
      },
      {
        name: 'Mobility Agent',
        msg: `Direct ${loc.name} arterial road blocked. Route B verified for heavy freight.`,
        icon: '⚠',
      },
      {
        name: 'Inventory Agent',
        msg: `${loc.state} Regional Depot (W-02) designated with required stock.`,
        icon: '✓',
      },
      {
        name: 'Fleet Agent',
        msg: `Rapid response vehicle V-14 designated with cold-chain priority.`,
        icon: '✓',
      },
      {
        name: 'Orchestrator',
        msg: `OR-Tools synthesized updated deterministic route for ${loc.name}.`,
        icon: '⚡',
      },
    ];

    set({
      agentStates: steps.map((s) => ({
        name: s.name,
        status: 'running',
        message: 'Processing incident telemetry...',
        icon: '…',
      })),
    });

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const currentStep = steps[i];
      set((state) => {
        const nextStates = [...state.agentStates];
        nextStates[i] = {
          name: currentStep.name,
          status: 'completed',
          message: currentStep.msg,
          icon: currentStep.icon,
        };
        return { agentStates: nextStates };
      });
    }

    set({
      isSimulating: false,
      simulationActive: true,
      affectedRoadsCount: severity === 'high' ? 6 : 3,
      affectedZonesCount: severity === 'high' ? 3 : 1,
      metrics: {
        criticalLocations: loc.criticalFacilities,
        urgentLocations: severity === 'high' ? 4 : 2,
        shortageRisk: severity === 'high' ? Math.min(98, loc.riskIndex + 10) : loc.riskIndex,
        shortageRiskDelta: 12,
        availableVehicles: 30,
        totalVehicles: 45,
        activeDeliveries: 16,
        blockedRoads: severity === 'high' ? 6 : 3,
        warehouses: loc.warehousesCount,
      },
      impactMetrics: {
        before: {
          criticalServed: `${Math.round(loc.criticalFacilities * 0.4)}/${loc.criticalFacilities}`,
          shortageRisk: loc.riskIndex,
          avgDeliveryMin: 78,
        },
        after: {
          criticalServed: `${Math.round(loc.criticalFacilities * 0.9)}/${loc.criticalFacilities}`,
          shortageRisk: 12,
          avgDeliveryMin: 43,
        },
        confidence: 94,
      },
      highlightedRouteId: 'H-07',
      routeFocusTimestamp: Date.now(),
    });
  },

  resetSimulation: () => {
    const loc = get().currentLocation;
    const data = generateStateData(loc);
    set({
      simulationActive: false,
      disruptionType: null,
      isPlanApproved: false,
      monitoringAlert: null,
      agentStates: data.agentStates,
      metrics: data.metrics,
      impactMetrics: data.impactMetrics,
      routeFocusTimestamp: Date.now(),
    });
  },
}));
