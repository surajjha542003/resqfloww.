'use client';

import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSimulationStore } from '@/store/simulationStore';
import { MapLegend } from './MapLegend';
import { MapControls } from './MapControls';

// Component to handle location updates dynamically
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

// Component to automatically fit bounds and zoom smoothly when a route is focused
function RouteFocusMapController() {
  const map = useMap();
  const { activePlanItem, routeFocusTimestamp } = useSimulationStore();

  useEffect(() => {
    if (routeFocusTimestamp > 0 && activePlanItem && activePlanItem.routePath.length > 0) {
      const latLngs = activePlanItem.routePath.map((p) => [p.lat, p.lng] as [number, number]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    }
  }, [routeFocusTimestamp, activePlanItem, map]);

  return null;
}

// Custom DivIcons matching Stitch visual design with glowing pulse for critical locations
function createCustomIcon(
  iconName: string,
  bgColor: string,
  label: string,
  isCritical?: boolean
) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="flex flex-col items-center relative" style="transform: translate(-50%, -100%);">
        ${
          isCritical
            ? `<span class="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-red-500 opacity-75 animate-ping"></span>`
            : ''
        }
        <div style="background-color: ${bgColor}; width: 26px; height: 26px; border-radius: 9999px; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3); z-index: 10; position: relative;">
          <span class="material-symbols-outlined" style="font-size: 14px; color: white;">${iconName}</span>
        </div>
        <span style="background: rgba(250,248,255,0.95); padding: 1px 4px; border-radius: 3px; font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 600; border: 1px solid #c4c5d7; margin-top: 2px; white-space: nowrap; color: #1a1b23; box-shadow: 0 1px 2px rgba(0,0,0,0.1); z-index: 10;">
          ${label}
        </span>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  });
}

export default function OperationsMapInner() {
  const {
    currentLocation,
    mapLayers,
    setSelectedEntity,
    activePlanItem,
    activeWarehouses,
    activeHospitals,
    activeVehicles,
    activeRoads,
    activeIncidents,
    activeZones,
  } = useSimulationStore();

  const center: [number, number] = [currentLocation.center.lat, currentLocation.center.lng];

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg">
      <MapContainer
        center={center}
        zoom={currentLocation.zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        zoomControl={false}
      >
        <MapViewController center={center} zoom={currentLocation.zoom} />
        <RouteFocusMapController />

        {/* Clean CartoDB Positron / OSM tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* 1. Hazard / Flood Inundation Zones */}
        {mapLayers.floodZones &&
          activeZones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.polygon.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: zone.status === 'danger' ? '#ba1a1a' : '#7f2500',
                fillColor: zone.status === 'danger' ? '#ba1a1a' : '#a73400',
                fillOpacity: 0.22,
                weight: 2,
                dashArray: '4, 4',
              }}
            >
              <Popup>
                <div className="p-1 font-sans">
                  <div className="font-bold text-xs text-error">{zone.name}</div>
                  <div className="text-[11px] text-gray-600 mt-1">
                    Population: {zone.population.toLocaleString()} | Risk: {zone.floodProbability}%
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* 2. Road Network Segments */}
        {activeRoads.map((road) => {
          const isBlocked = road.status === 'blocked' || road.status === 'flooded';
          const roadColor = isBlocked ? '#ba1a1a' : '#565e74';
          return (
            <Polyline
              key={road.id}
              positions={road.path.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: roadColor,
                weight: isBlocked ? 4 : 2,
                dashArray: isBlocked ? '6, 6' : undefined,
                opacity: isBlocked ? 0.9 : 0.4,
              }}
            >
              <Popup>
                <div className="p-1 font-sans">
                  <div className="font-bold text-xs">{road.name}</div>
                  <div className="text-[11px] text-gray-600">
                    Status: <strong className={isBlocked ? 'text-error uppercase' : 'text-primary'}>{road.status}</strong>
                  </div>
                  <div className="text-[11px] text-gray-500">Distance: {road.distanceKm} km</div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* 3. Recommended Optimal Delivery Route */}
        {mapLayers.routes && activePlanItem && (
          <Polyline
            positions={activePlanItem.routePath.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: '#1d4ed8',
              weight: 6,
              opacity: 0.95,
            }}
          >
            <Popup>
              <div className="p-1 font-sans">
                <div className="font-bold text-xs text-primary">Active Delivery Corridor ({currentLocation.name})</div>
                <div className="text-[11px]">{activePlanItem.routeDescription}</div>
                <div className="text-[11px] text-gray-600 font-mono mt-1">
                  ETA: {activePlanItem.etaMinutes} mins | Vehicle: {activePlanItem.vehicleId}
                </div>
              </div>
            </Popup>
          </Polyline>
        )}

        {/* 4. Warehouses */}
        {mapLayers.warehouses &&
          activeWarehouses.map((wh) => (
            <Marker
              key={wh.id}
              position={[wh.position.lat, wh.position.lng]}
              icon={createCustomIcon('warehouse', '#0037b0', wh.id)}
              eventHandlers={{
                click: () => setSelectedEntity({ type: 'warehouse', id: wh.id, name: wh.name }),
              }}
            >
              <Popup>
                <div className="p-1 font-sans">
                  <div className="font-bold text-xs text-primary">{wh.name}</div>
                  <div className="text-[11px] text-gray-600">{wh.address}</div>
                  <div className="text-[11px] text-gray-700 font-mono mt-1">
                    Stock Capacity: <strong>{wh.currentStock}%</strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 5. Hospitals & Relief Centers (with glowing pulse for critical locations) */}
        {mapLayers.hospitals &&
          activeHospitals.map((hosp) => {
            const isCritical = hosp.status === 'critical';
            const isWarning = hosp.status === 'warning';
            const color = isCritical ? '#ba1a1a' : isWarning ? '#a73400' : '#0037b0';
            const icon = hosp.type === 'relief_center' ? 'night_shelter' : 'local_hospital';

            return (
              <Marker
                key={hosp.id}
                position={[hosp.position.lat, hosp.position.lng]}
                icon={createCustomIcon(icon, color, hosp.id, isCritical)}
                eventHandlers={{
                  click: () => setSelectedEntity({ type: 'hospital', id: hosp.id, name: hosp.name }),
                }}
              >
                <Popup>
                  <div className="p-1 font-sans">
                    <div className="font-bold text-xs" style={{ color }}>
                      {hosp.name}
                    </div>
                    <div className="text-[11px] text-gray-600">{hosp.address}</div>
                    <div className="text-[11px] text-gray-800 mt-1">
                      Medicine: <strong>{hosp.supplies.medicine}h remaining</strong>
                    </div>
                    <div className="text-[11px] text-gray-800">
                      Priority Score: <strong className="font-mono">{hosp.priorityScore}</strong>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 6. Vehicles */}
        {mapLayers.vehicles &&
          activeVehicles.slice(0, 15).map((veh) => {
            const icon =
              veh.type === 'boat'
                ? 'directions_boat'
                : veh.type === 'helicopter'
                ? 'helicopter'
                : 'local_shipping';

            return (
              <Marker
                key={veh.id}
                position={[veh.position.lat, veh.position.lng]}
                icon={createCustomIcon(icon, '#565e74', veh.id)}
                eventHandlers={{
                  click: () => setSelectedEntity({ type: 'vehicle', id: veh.id, name: veh.name }),
                }}
              >
                <Popup>
                  <div className="p-1 font-sans">
                    <div className="font-bold text-xs text-secondary">{veh.name}</div>
                    <div className="text-[11px] text-gray-600">Driver: {veh.driver}</div>
                    <div className="text-[11px] text-gray-800 font-mono mt-1">
                      Status: <strong>{veh.status}</strong> | Fuel: {veh.fuelLevel}%
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 7. Incident Points */}
        {mapLayers.incidents &&
          activeIncidents.map((inc) => (
            <Marker
              key={inc.id}
              position={[inc.position.lat, inc.position.lng]}
              icon={createCustomIcon('warning', '#ba1a1a', inc.type.toUpperCase(), true)}
            >
              <Popup>
                <div className="p-1 font-sans">
                  <div className="font-bold text-xs text-error">{inc.title}</div>
                  <div className="text-[11px] text-gray-600 mt-1">{inc.description}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">Reported: {inc.reportedAt}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        <MapControls />
        <MapLegend />
      </MapContainer>
    </div>
  );
}
