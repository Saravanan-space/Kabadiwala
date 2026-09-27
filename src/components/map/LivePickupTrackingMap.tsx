'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  Navigation,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Crosshair,
  Layers,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { LocationCoordinate } from '../../services/mapService';

export interface DispatchInfo {
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  driverRating?: number;
  driverPhoto?: string;
  etaMinutes: number;
  distanceKm: number;
  dispatchedAt: string;
  status: 'En Route' | 'Near Location' | 'Arrived' | 'Completed';
  pickupCode?: string;
}

interface LivePickupTrackingMapProps {
  customerLocation: LocationCoordinate;
  dispatchInfo: DispatchInfo;
  recyclerName?: string;
  lotId?: string;
  onCallDriver?: () => void;
  onMarkArrived?: () => void;
}

export function LivePickupTrackingMap({
  customerLocation,
  dispatchInfo,
  recyclerName = 'GreenCycle E-Waste Hub',
  lotId = 'LOT-EW-2026',
  onCallDriver,
  onMarkArrived,
}: LivePickupTrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);

  const [etaRemaining, setEtaRemaining] = useState<number>(dispatchInfo.etaMinutes || 15);
  const [driverProgress, setDriverProgress] = useState<number>(0.35); // 0 (recycler) to 1 (customer)
  const [isNear, setIsNear] = useState<boolean>(false);

  // Recycler Hub Origin coordinate (approx 4 km away from customer)
  const originLat = customerLocation.lat - 0.022;
  const originLng = customerLocation.lng - 0.018;

  // Initialize and update Live Tracking Map
  useEffect(() => {
    let isMounted = true;
    let animInterval: any = null;

    async function initTrackingMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Calculate center between origin and destination
      const centerLat = (originLat + customerLocation.lat) / 2;
      const centerLng = (originLng + customerLocation.lng) / 2;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // 1. Destination / Customer Pin
      const customerPin = L.divIcon({
        className: 'customer-marker',
        html: `
          <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center;">
            <div style="background: #065f46; color: white; padding: 4px 8px; border-radius: 9999px; font-size: 10px; font-weight: 800; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); white-space: nowrap;">
              🏠 Pickup Address
            </div>
            <div style="width: 28px; height: 28px; background: #059669; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); margin-top: 2px;">
              <span style="color: white; font-size: 14px;">📍</span>
            </div>
          </div>
        `,
        iconSize: [28, 50],
        iconAnchor: [14, 50],
      });
      L.marker([customerLocation.lat, customerLocation.lng], { icon: customerPin }).addTo(map);

      // 2. Origin / Recycler Pin
      const recyclerPin = L.divIcon({
        className: 'recycler-marker',
        html: `
          <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center;">
            <div style="background: #581c87; color: white; padding: 4px 8px; border-radius: 9999px; font-size: 10px; font-weight: 800; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); white-space: nowrap;">
              🏢 ${recyclerName.split(' ')[0]} Hub
            </div>
            <div style="width: 28px; height: 28px; background: #7e22ce; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); margin-top: 2px;">
              <span style="color: white; font-size: 14px;">🏭</span>
            </div>
          </div>
        `,
        iconSize: [28, 50],
        iconAnchor: [14, 50],
      });
      L.marker([originLat, originLng], { icon: recyclerPin }).addTo(map);

      // 3. Route Polyline
      const intermediateWaypoints: [number, number][] = [
        [originLat, originLng],
        [originLat + 0.007, originLng + 0.005],
        [originLat + 0.014, originLng + 0.011],
        [customerLocation.lat, customerLocation.lng],
      ];

      const route = L.polyline(intermediateWaypoints, {
        color: '#059669',
        weight: 5,
        opacity: 0.8,
        dashArray: '8, 8',
      }).addTo(map);
      routeLineRef.current = route;

      // 4. Moving Driver Vehicle Marker
      const initialDriverLat = originLat + (customerLocation.lat - originLat) * 0.35;
      const initialDriverLng = originLng + (customerLocation.lng - originLng) * 0.35;

      const driverTruckIcon = L.divIcon({
        className: 'driver-truck-marker',
        html: `
          <div style="transform: translate(-50%, -50%); position: relative;">
            <div style="position: absolute; inset: -8px; border-radius: 50%; background: #f59e0b; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #d97706 0%, #b45309 100%); border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(180, 83, 9, 0.5);">
              <span style="font-size: 20px; line-height: 1;">🚚</span>
            </div>
            <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); background: #1e293b; color: #fbbf24; font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 6px; white-space: nowrap; border: 1px solid #475569;">
              ${dispatchInfo.vehicleNumber}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const driverMarker = L.marker([initialDriverLat, initialDriverLng], {
        icon: driverTruckIcon,
        zIndexOffset: 1000,
      }).addTo(map);
      driverMarkerRef.current = driverMarker;

      // Fit bounds to show entire route
      map.fitBounds(route.getBounds(), { padding: [40, 40] });

      mapInstanceRef.current = map;

      // Simulated real-time progression
      let curr = 0.35;
      animInterval = setInterval(() => {
        if (!isMounted) return;
        curr = Math.min(curr + 0.05, 0.95);
        setDriverProgress(curr);

        const lat = originLat + (customerLocation.lat - originLat) * curr;
        const lng = originLng + (customerLocation.lng - originLng) * curr;

        if (driverMarkerRef.current) {
          driverMarkerRef.current.setLatLng([lat, lng]);
        }

        const mins = Math.max(1, Math.round((1 - curr) * dispatchInfo.etaMinutes));
        setEtaRemaining(mins);

        if (mins <= 3) {
          setIsNear(true);
        }
      }, 4000);
    }

    initTrackingMap();

    return () => {
      isMounted = false;
      if (animInterval) clearInterval(animInterval);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [customerLocation, dispatchInfo]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-0">
      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Truck className="w-6 h-6 stroke-[2.2] animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full">
                Pickup Person On The Way
              </span>
              <span className="text-xs font-semibold text-amber-200">#{lotId}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              Pickup Partner En Route to Your Address
            </h3>
          </div>
        </div>

        {/* ETA Badge */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-amber-300/30 px-4 py-2.5 rounded-2xl text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-amber-300 block">Estimated Arrival</span>
          <span className="text-2xl font-black text-white flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>{etaRemaining} mins</span>
          </span>
        </div>
      </div>

      {/* Live Map Area */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Live GPS Status Pill */}
        <div className="absolute top-3 left-3 z-20 bg-slate-900/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Live GPS Tracking Active</span>
        </div>

        {/* Recenter button */}
        <button
          onClick={() => {
            if (mapInstanceRef.current && routeLineRef.current) {
              mapInstanceRef.current.fitBounds(routeLineRef.current.getBounds(), {
                padding: [40, 40],
              });
            }
          }}
          className="absolute top-3 right-14 z-20 p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 shadow-md border border-slate-200 text-xs font-bold"
          title="Fit Route"
        >
          <Crosshair className="w-4 h-4 text-amber-700" />
        </button>
      </div>

      {/* Driver Details & Actions Card */}
      <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          {/* Driver Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center font-black text-amber-900 text-xl shrink-0 shadow-inner">
              {dispatchInfo.driverName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-black text-slate-900 leading-none">
                  {dispatchInfo.driverName}
                </h4>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                  ★ {dispatchInfo.driverRating || 4.9}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>Vehicle: <strong className="text-slate-900">{dispatchInfo.vehicleNumber}</strong></span>
              </p>
              <p className="text-[11px] text-emerald-800 font-bold mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized Recycler Pickup Partner</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${dispatchInfo.driverPhone}`}
              onClick={onCallDriver}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call Driver</span>
            </a>

            {dispatchInfo.pickupCode && (
              <div className="bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Security PIN</span>
                <span className="text-base font-black font-mono text-slate-900">{dispatchInfo.pickupCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Destination Address Info */}
        <div className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-2xl">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Destination GPS Pin</span>
            <span className="text-slate-900 font-bold block">{customerLocation.address}</span>
            {customerLocation.landmark && (
              <span className="text-slate-600 text-[11px] block mt-0.5 font-medium">
                Note: {customerLocation.landmark}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
