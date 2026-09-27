'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Crosshair,
  CheckCircle2,
  Layers,
  Sparkles,
  Loader2,
  AlertCircle,
  Building,
  Maximize2,
  Info,
} from 'lucide-react';
import {
  LocationCoordinate,
  DEFAULT_LOCATION,
  POPULAR_LOCATIONS,
  reverseGeocode,
  searchAddressGeocode,
} from '../../services/mapService';

interface InteractiveGPSMapPickerProps {
  initialLocation?: LocationCoordinate;
  onLocationSelect: (location: LocationCoordinate) => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function InteractiveGPSMapPicker({
  initialLocation = DEFAULT_LOCATION,
  onLocationSelect,
  title = 'Pickup & Collection Location',
  subtitle = 'Enter address, search landmark or drag the marker to adjust exact pickup spot',
  compact = false,
}: InteractiveGPSMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const accuracyCircleRef = useRef<any>(null);

  const [currentLocation, setCurrentLocation] = useState<LocationCoordinate>(initialLocation);
  const [addressQuery, setAddressQuery] = useState<string>(initialLocation.address || '');
  const [landmarkInput, setLandmarkInput] = useState<string>(initialLocation.landmark || '');
  const [suggestions, setSuggestions] = useState<LocationCoordinate[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite'>('streets');
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Dynamically load Leaflet
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        center: [currentLocation.lat, currentLocation.lng],
        zoom: 16,
        zoomControl: false,
      });

      // Add zoom control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add Tile Layer
      const tileUrl =
        mapLayer === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom animated SVG pin icon
      const createCustomPinIcon = () =>
        L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: grab;">
              <div style="
                background: linear-gradient(135deg, #065f46 0%, #047857 100%);
                color: white;
                padding: 6px 10px;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 800;
                box-shadow: 0 4px 12px rgba(4, 120, 87, 0.4);
                display: flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
                border: 2px solid #ffffff;
                margin-bottom: 2px;
                animation: bounce 2s infinite;
              ">
                <span>📍 Drag to Adjust</span>
              </div>
              <div style="
                width: 36px;
                height: 36px;
                background: #059669;
                border: 3px solid #ffffff;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 4px 14px rgba(0,0,0,0.35);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  width: 14px;
                  height: 14px;
                  background: #ffffff;
                  border-radius: 50%;
                  transform: rotate(45deg);
                "></div>
              </div>
              <div style="
                width: 12px;
                height: 4px;
                background: rgba(0,0,0,0.25);
                border-radius: 50%;
                margin-top: -2px;
                filter: blur(1px);
              "></div>
            </div>
          `,
          iconSize: [36, 60],
          iconAnchor: [18, 60],
        });

      // Draggable Marker
      const marker = L.marker([currentLocation.lat, currentLocation.lng], {
        draggable: true,
        icon: createCustomPinIcon(),
      }).addTo(map);

      // Handle marker drag
      marker.on('dragend', async (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        await handleCoordinatesChange(lat, lng, false);
      });

      // Handle map click to reposition marker
      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        await handleCoordinatesChange(lat, lng, false);
      });

      // Add nearby preset landmark markers for quick reference
      POPULAR_LOCATIONS.forEach((loc) => {
        if (loc.lat !== currentLocation.lat || loc.lng !== currentLocation.lng) {
          const landmarkIcon = L.divIcon({
            className: 'custom-preset-marker',
            html: `
              <div style="
                background: #ffffff;
                color: #1e293b;
                border: 1.5px solid #cbd5e1;
                border-radius: 9999px;
                padding: 2px 6px;
                font-size: 10px;
                font-weight: 700;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 3px;
                cursor: pointer;
                white-space: nowrap;
                transform: translate(-50%, -50%);
              ">
                <span style="color: #059669;">●</span> ${loc.landmark || loc.city}
              </div>
            `,
            iconSize: [20, 20],
          });

          const pMarker = L.marker([loc.lat, loc.lng], { icon: landmarkIcon }).addTo(map);
          pMarker.on('click', () => {
            selectLocation(loc);
          });
        }
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setIsMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLayer]);

  // Handle coordinates adjustment from drag or click
  const handleCoordinatesChange = async (lat: number, lng: number, recenter = true) => {
    setIsReverseGeocoding(true);
    if (mapInstanceRef.current && recenter) {
      mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom() || 16, {
        animate: true,
      });
    }

    try {
      const geoResult = await reverseGeocode(lat, lng);
      const updated: LocationCoordinate = {
        ...geoResult,
        landmark: landmarkInput || geoResult.landmark,
      };
      setCurrentLocation(updated);
      setAddressQuery(geoResult.address);
      onLocationSelect(updated);
    } catch (err) {
      console.warn('Reverse geocode error:', err);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Select a suggestion or preset location
  const selectLocation = (loc: LocationCoordinate) => {
    setCurrentLocation(loc);
    setAddressQuery(loc.address);
    if (loc.landmark) setLandmarkInput(loc.landmark);
    setShowSuggestions(false);
    setGpsError(null);

    if (markerRef.current) {
      markerRef.current.setLatLng([loc.lat, loc.lng]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([loc.lat, loc.lng], 16, { animate: true });
    }

    onLocationSelect(loc);
  };

  // Search address handler with debounce
  const handleSearchChange = async (val: string) => {
    setAddressQuery(val);
    if (val.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    setShowSuggestions(true);
    try {
      const results = await searchAddressGeocode(val);
      setSuggestions(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Geolocation trigger
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('GPS Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGPS(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setIsLocatingGPS(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 17, { animate: true });

          // Draw / update accuracy circle
          if (accuracyCircleRef.current) {
            accuracyCircleRef.current.remove();
          }

          import('leaflet').then((LModule) => {
            const L = LModule.default;
            if (mapInstanceRef.current) {
              accuracyCircleRef.current = L.circle([latitude, longitude], {
                radius: Math.max(accuracy, 25),
                color: '#059669',
                fillColor: '#10b981',
                fillOpacity: 0.15,
                weight: 1.5,
              }).addTo(mapInstanceRef.current);
            }
          });
        }

        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        }

        await handleCoordinatesChange(latitude, longitude, false);
      },
      (err) => {
        setIsLocatingGPS(false);
        console.warn('Geolocation error:', err);
        // Fallback to MIDC Andheri East default coordinate
        setGpsError(
          err.code === 1
            ? 'GPS location permission was denied. You can still search or drag the pin on the map.'
            : 'Unable to retrieve exact GPS location. Adjusted to regional hub.'
        );
        selectLocation(DEFAULT_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Header Info */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-900/5 via-slate-50 to-emerald-900/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{title}</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>
        </div>

        {/* GPS Quick Locate Action Button */}
        <button
          onClick={handleDetectGPS}
          disabled={isLocatingGPS}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0 disabled:opacity-50"
        >
          {isLocatingGPS ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Detecting GPS...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>Use My GPS Location</span>
            </>
          )}
        </button>
      </div>

      {/* Address Search & Autocomplete Input */}
      <div className="p-4 sm:p-5 space-y-3 relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={addressQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder="Search address, building, street or pincode in India..."
            className="w-full pl-10 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all shadow-inner"
          />
          <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
            {isSearching && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin mr-2" />}
            {addressQuery && (
              <button
                onClick={() => {
                  setAddressQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-16 left-4 right-4 z-50 bg-white rounded-2xl border border-slate-200 shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => selectLocation(sug)}
                className="w-full text-left p-3.5 hover:bg-emerald-50/80 transition-colors flex items-start gap-3 group"
              >
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block truncate">
                    {sug.landmark || sug.city}
                  </span>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{sug.address}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Quick Landmark Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-bold">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Presets:
          </span>
          {POPULAR_LOCATIONS.slice(0, 5).map((pop, idx) => (
            <button
              key={idx}
              onClick={() => selectLocation(pop)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200 transition-all shrink-0"
            >
              {pop.landmark || pop.city}
            </button>
          ))}
        </div>

        {/* GPS Error Message banner if any */}
        {gpsError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}
      </div>

      {/* Interactive Map Container */}
      <div className="relative w-full h-72 sm:h-80 md:h-96 bg-slate-100 border-y border-slate-200">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Reverse Geocoding Loading Overlay */}
        {isReverseGeocoding && (
          <div className="absolute top-3 left-3 z-20 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Updating Location Address...</span>
          </div>
        )}

        {/* Top Floating Map Controls */}
        <div className="absolute top-3 right-14 z-20 flex items-center gap-1.5">
          <button
            onClick={() => setMapLayer((prev) => (prev === 'streets' ? 'satellite' : 'streets'))}
            className="p-2 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-800 shadow-md border border-slate-200 transition-all text-xs font-bold flex items-center gap-1"
            title="Toggle Map Style"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">{mapLayer === 'streets' ? 'Satellite' : 'Streets'}</span>
          </button>

          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([currentLocation.lat, currentLocation.lng], 16, {
                  animate: true,
                });
              }
            }}
            className="p-2 rounded-xl bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-800 shadow-md border border-slate-200 transition-all text-xs font-bold"
            title="Recenter Map"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        </div>

        {/* Bottom Floating Pin Adjustment Helper Tip */}
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 px-3.5 shadow-md flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-xs font-bold text-slate-800 truncate">
              Coordinates: {currentLocation.lat.toFixed(5)}°N, {currentLocation.lng.toFixed(5)}°E
            </span>
          </div>
          <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0 border border-emerald-200">
            Pinpoint Active
          </span>
        </div>
      </div>

      {/* Selected Location Details & Landmark Confirmation */}
      <div className="p-4 sm:p-5 space-y-3 bg-slate-50/70">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Confirmed Pickup Street Address
            </label>
            <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 leading-snug">
              {currentLocation.address || 'Address pinpointed on map'}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Flat / House No. / Landmark Notes (Optional)
            </label>
            <input
              type="text"
              value={landmarkInput}
              onChange={(e) => {
                setLandmarkInput(e.target.value);
                const updated = { ...currentLocation, landmark: e.target.value };
                setCurrentLocation(updated);
                onLocationSelect(updated);
              }}
              placeholder="e.g. 3rd Floor, Bldg 4, Opposite Metro Gate"
              className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-bold text-emerald-800">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> GPS verified & ready for pickup dispatch
          </span>
          <span className="text-[11px] text-slate-500 font-semibold">
            {currentLocation.city || 'Mumbai'} • {currentLocation.pincode || '400093'}
          </span>
        </div>
      </div>
    </div>
  );
}
