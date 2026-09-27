'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  Package,
  Layers,
  BarChart3,
  Volume2,
  LogOut,
  RefreshCw,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Navigation,
  Edit3,
  Plus,
  Crosshair,
  X,
} from 'lucide-react';
import { InteractiveGPSMapPicker } from '../map/InteractiveGPSMapPicker';
import { LocationCoordinate, DEFAULT_LOCATION } from '../../services/mapService';
import { StatusConfirmationModal } from '../common/StatusConfirmationModal';

export interface PickupJob {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  lat?: number;
  lng?: number;
  landmark?: string;
  distanceKm: number;
  material: string;
  estWeightKg: number;
  estPayout: number;
  status: 'Scheduled' | 'En Route' | 'Collected' | 'Delivered';
  scheduledTime: string;
}

interface ScrapCollectorDashboardProps {
  onLogout: () => void;
}

const INITIAL_PICKUPS: PickupJob[] = [
  {
    id: 'JOB-201',
    customerName: 'Ramesh Patel',
    phone: '+91 98201 11223',
    address: 'Bldg 4, Green Acres, MIDC Andheri East, Mumbai',
    lat: 19.1136,
    lng: 72.8697,
    landmark: 'Opposite SEEPZ Gate 1',
    distanceKm: 0.8,
    material: 'Cable & Wires',
    estWeightKg: 8.5,
    estPayout: 1700,
    status: 'Scheduled',
    scheduledTime: '10:30 AM',
  },
  {
    id: 'JOB-202',
    customerName: 'Sunita Rao',
    phone: '+91 97690 44556',
    address: 'Flat 302, Sai Heights, Marol, Mumbai',
    lat: 19.1197,
    lng: 72.8864,
    landmark: 'Near Marol Metro',
    distanceKm: 1.4,
    material: 'PCB & Circuit Boards',
    estWeightKg: 12.0,
    estPayout: 4200,
    status: 'Scheduled',
    scheduledTime: '11:45 AM',
  },
  {
    id: 'JOB-200',
    customerName: 'Deepak Shah',
    phone: '+91 98199 88776',
    address: 'Shop 12, Station Road, Andheri East, Mumbai',
    lat: 19.1254,
    lng: 72.8525,
    landmark: 'Near Station Road East',
    distanceKm: 2.1,
    material: 'Lithium Battery & Motors',
    estWeightKg: 25.0,
    estPayout: 3100,
    status: 'Collected',
    scheduledTime: '09:15 AM',
  },
];

export function ScrapCollectorDashboard({ onLogout }: ScrapCollectorDashboardProps) {
  const { t, speakText, isSpeaking, speakingId } = useLanguage();
  const [activeTab, setActiveTab] = useState<'pickups' | 'map' | 'batching' | 'summary'>('pickups');
  const [pickups, setPickups] = useState<PickupJob[]>(INITIAL_PICKUPS);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [collectedWeight, setCollectedWeight] = useState<string>('');
  const [adjustingLocationJob, setAdjustingLocationJob] = useState<PickupJob | null>(null);
  const [tempAdjustedLocation, setTempAdjustedLocation] = useState<LocationCoordinate>(DEFAULT_LOCATION);
  const [isAddingNewLocation, setIsAddingNewLocation] = useState<boolean>(false);
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [newCustomerPhone, setNewCustomerPhone] = useState<string>('');
  const [newMaterial, setNewMaterial] = useState<string>('Copper & Cables');
  const [newWeight, setNewWeight] = useState<string>('5.0');

  const completedCount = pickups.filter((p) => p.status === 'Collected' || p.status === 'Delivered').length;
  const totalKgCollected = pickups
    .filter((p) => p.status === 'Collected' || p.status === 'Delivered')
    .reduce((acc, curr) => acc + curr.estWeightKg, 0);
  const totalPaidOut = pickups
    .filter((p) => p.status === 'Collected' || p.status === 'Delivered')
    .reduce((acc, curr) => acc + curr.estPayout, 0);

  const isPlayingHeader = isSpeaking && speakingId === 'collector-header-tts';

  const handleStartRoute = (jobId: string) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === jobId ? { ...p, status: 'En Route' } : p))
    );
  };

  const handleMarkCollected = (job: PickupJob) => {
    setSelectedJobId(job.id);
    setCollectedWeight(String(job.estWeightKg));
  };

  const [statusModalData, setStatusModalData] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    details?: { label: string; value: string | number }[];
    buttonText?: string;
  } | null>(null);

  const handleConfirmCollection = (job: PickupJob) => {
    const finalKg = parseFloat(collectedWeight) || job.estWeightKg;
    const finalPayout = Math.round(finalKg * 200);

    setPickups((prev) =>
      prev.map((p) =>
        p.id === job.id
          ? {
              ...p,
              status: 'Collected',
              estWeightKg: finalKg,
            }
          : p
      )
    );
    setSelectedJobId(null);
    setStatusModalData({
      isOpen: true,
      title: 'Scrap Collection Recorded',
      subtitle: 'Doorstep material collection verified and payout settled.',
      details: [
        { label: 'Customer Name', value: job.customerName },
        { label: 'Scrap Material', value: job.material },
        { label: 'Verified Scale Weight', value: `${finalKg} kg` },
        { label: 'Cash Settled', value: `₹${finalPayout.toLocaleString('en-IN')}` },
        { label: 'Status', value: 'Collected & Logged' },
      ],
      buttonText: 'OK, Next Waypoint',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Truck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                Kabadiwala Collector
              </h1>
              <p className="text-xs font-bold text-amber-800 flex items-center gap-1">
                Field Pickup Route • 4.8 ★
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Button */}
            <button
              onClick={() =>
                speakText(
                  `${t('collector_portal_title')}. Completed ${completedCount} pickups today. Total collected ${totalKgCollected} kg.`,
                  'collector-header-tts'
                )
              }
              className={`p-2.5 rounded-full border transition-all shadow-sm ${
                isPlayingHeader
                  ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title={t('read_aloud')}
            >
              <Volume2 className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Logout / Switch Role Button */}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
              title={t('logout_btn')}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('logout_btn')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Force User OK Status Popup Modal */}
        {statusModalData && (
          <StatusConfirmationModal
            isOpen={statusModalData.isOpen}
            title={statusModalData.title}
            subtitle={statusModalData.subtitle}
            details={statusModalData.details}
            buttonText={statusModalData.buttonText || 'OK, Understood'}
            type="success"
            onConfirm={() => setStatusModalData(null)}
          />
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-800 text-white rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-amber-200 font-bold block">Today's Pickups</span>
            <span className="text-2xl font-black mt-0.5 block">{completedCount} / {pickups.length}</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-slate-500 font-bold block">Scrap Collected</span>
            <span className="text-2xl font-black text-amber-800 mt-0.5 block">{totalKgCollected} kg</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl text-[11px] font-bold">
          <button
            onClick={() => setActiveTab('pickups')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'pickups'
                ? 'bg-white text-amber-900 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Route</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'map'
                ? 'bg-white text-amber-900 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>GPS Map</span>
          </button>

          <button
            onClick={() => setActiveTab('batching')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'batching'
                ? 'bg-white text-amber-900 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Batching</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'summary'
                ? 'bg-white text-amber-900 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Cashflow</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'pickups' && (
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-800">
              Neighborhood Pickup Jobs ({pickups.length})
            </h3>

            {pickups.map((job) => {
              const isCollected = job.status === 'Collected';
              const isEnRoute = job.status === 'En Route';
              const isVerifying = selectedJobId === job.id;
              const isPlayingJob = isSpeaking && speakingId === `job-${job.id}`;

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base">{job.customerName}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            isCollected
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isEnRoute
                              ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Scheduled: {job.scheduledTime} ({job.distanceKm} km away)
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        speakText(
                          `Pickup job for ${job.customerName}. Address ${job.address}. Material ${job.material} ${job.estWeightKg} kg.`,
                          `job-${job.id}`
                        )
                      }
                      className={`p-2 rounded-full border transition-all ${
                        isPlayingJob
                          ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                      title={t('read_aloud')}
                    >
                      <Volume2 className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>

                  {/* Details Card */}
                  {/* Details Card */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs font-medium text-slate-700">
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-start gap-1.5 flex-1">
                        <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-900 block">{job.address}</span>
                          {job.landmark && (
                            <span className="text-[11px] text-slate-500 block">Note: {job.landmark}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Button to adjust location on map */}
                      <button
                        onClick={() => {
                          setAdjustingLocationJob(job);
                          setTempAdjustedLocation({
                            lat: job.lat || 19.1136,
                            lng: job.lng || 72.8697,
                            address: job.address,
                            landmark: job.landmark || '',
                            city: 'Mumbai',
                          });
                        }}
                        className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-amber-600 hover:text-amber-900 text-slate-700 font-bold text-[11px] transition-all flex items-center gap-1 shrink-0 shadow-2xs"
                        title="Adjust Location on Map"
                      >
                        <Edit3 className="w-3 h-3 text-amber-700" />
                        <span>Map Pin</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-bold text-slate-900">
                      <span>{job.material} ({job.estWeightKg} kg)</span>
                      <span className="text-amber-800 font-black">₹{job.estPayout}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {isVerifying ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                      <h4 className="font-extrabold text-xs text-amber-900">
                        Confirm Collected Weight & Disburse Cash
                      </h4>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          value={collectedWeight}
                          onChange={(e) => setCollectedWeight(e.target.value)}
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 font-bold text-slate-900 text-xs focus:outline-none"
                          placeholder="Weight in kg"
                        />
                        <button
                          onClick={() => handleConfirmCollection(job)}
                          className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setSelectedJobId(null)}
                          className="px-3 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : isCollected ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex items-center justify-between text-xs font-bold text-emerald-800">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Collection Complete
                      </span>
                      <span>₹{job.estPayout} Cash Disbursed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${job.phone}`}
                        className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
                        title="Call Customer"
                      >
                        <Phone className="w-4 h-4" />
                      </a>

                      {!isEnRoute ? (
                        <button
                          onClick={() => handleStartRoute(job.id)}
                          className="flex-1 py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Start Route En-Route</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkCollected(job)}
                          className="flex-1 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Collected & Pay</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* GPS & Map Tab */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white p-4 sm:p-5 rounded-3xl shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-amber-200 text-xs font-bold">
                <Navigation className="w-4 h-4" />
                <span>Field Route Navigation & GPS Map</span>
              </div>
              <h3 className="text-xl font-black text-white">Interactive Pickup Route Map</h3>
              <p className="text-amber-100/90 text-xs font-medium">
                Enter an address or drag pins on the map to fine-tune neighborhood collection spots.
              </p>
            </div>

            {/* Interactive GPS Map */}
            <InteractiveGPSMapPicker
              initialLocation={tempAdjustedLocation}
              onLocationSelect={(loc) => setTempAdjustedLocation(loc)}
              title="Enter Address & Pinpoint on Map"
              subtitle="Search landmarks, use GPS or drag the marker to adjust exact pickup coordinates"
            />

            {/* Quick Add Pickup to Route using Pinpointed Location */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  Add New Pickup Job at Pinpoint Location
                </h4>
                <button
                  onClick={() => setIsAddingNewLocation(!isAddingNewLocation)}
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  {isAddingNewLocation ? 'Hide Form' : '+ Open Form'}
                </button>
              </div>

              {isAddingNewLocation && (
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Customer Name (e.g. Vikas Sharma)"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number (+91...)"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Material (e.g. Copper Cable)"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Estimated Weight (kg)"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold text-xs flex items-center justify-between">
                    <span>GPS Target: {tempAdjustedLocation.landmark || tempAdjustedLocation.city}</span>
                    <span className="text-[10px] text-emerald-700">{tempAdjustedLocation.lat.toFixed(4)}°N</span>
                  </div>

                  <button
                    onClick={() => {
                      if (!newCustomerName) return;
                      const newJob: PickupJob = {
                        id: `JOB-${Math.floor(200 + Math.random() * 800)}`,
                        customerName: newCustomerName,
                        phone: newCustomerPhone || '+91 98200 00000',
                        address: tempAdjustedLocation.address,
                        lat: tempAdjustedLocation.lat,
                        lng: tempAdjustedLocation.lng,
                        landmark: tempAdjustedLocation.landmark,
                        distanceKm: 1.2,
                        material: newMaterial || 'Mixed Scrap',
                        estWeightKg: parseFloat(newWeight) || 5,
                        estPayout: (parseFloat(newWeight) || 5) * 200,
                        status: 'Scheduled',
                        scheduledTime: 'Today',
                      };
                      setPickups([newJob, ...pickups]);
                      setNewCustomerName('');
                      setNewCustomerPhone('');
                      setIsAddingNewLocation(false);
                      setStatusModalData({
                        isOpen: true,
                        title: `Waypoint Added to Route`,
                        subtitle: `New scrap collection scheduled for ${newJob.customerName}.`,
                        details: [
                          { label: 'Waypoint ID', value: newJob.id },
                          { label: 'Customer', value: newJob.customerName },
                          { label: 'Scrap Type', value: newJob.material },
                          { label: 'Address', value: newJob.address },
                        ],
                        buttonText: 'OK, View Route',
                      });
                    }}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-sm transition-all"
                  >
                    Add Location to Route
                  </button>
                </div>
              )}
            </div>

            {/* List of active locations mapped */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-black text-sm text-slate-900">Current Route Waypoints ({pickups.length})</h4>
              <div className="space-y-2">
                {pickups.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{p.customerName}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[200px] block">
                          {p.address}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-amber-800">{p.distanceKm} km</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'batching' && (
          <div className="space-y-4">
            <div className="bg-amber-800 text-white rounded-3xl p-5 shadow-md space-y-2">
              <h3 className="font-black text-lg">Scrap Batching & Aggregation</h3>
              <p className="text-amber-100 text-xs font-medium">
                Combine small neighborhood collections into bulk 100+ kg lots to sell directly to Authorized Recyclers for higher profit margins.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Available Batches Ready for Recycler Dispatch
              </h4>

              <div className="space-y-2.5">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Batch #B-401 (PCB Boards)</span>
                    <span className="text-slate-500">Total: 45.5 kg • Est. Recycler Value: ₹16,150</span>
                  </div>
                  <button className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs">
                    Dispatch
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Batch #B-402 (Copper Cables)</span>
                    <span className="text-slate-500">Total: 62.0 kg • Est. Recycler Value: ₹13,020</span>
                  </div>
                  <button className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs">
                    Dispatch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white rounded-3xl p-5 shadow-xl space-y-4">
              <span className="text-xs text-amber-200 font-bold uppercase tracking-wider block">
                Daily Financial Cashflow Summary
              </span>

              <div className="grid grid-cols-2 gap-4 border-t border-amber-700/60 pt-3">
                <div>
                  <span className="text-xs text-amber-200 font-semibold block">Total Cash Paid Out</span>
                  <span className="text-2xl font-black text-amber-300">₹{totalPaidOut.toLocaleString()}</span>
                </div>

                <div>
                  <span className="text-xs text-amber-200 font-semibold block">Total Weight</span>
                  <span className="text-2xl font-black text-white">{totalKgCollected} kg</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adjust Location on Map Modal */}
        {adjustingLocationJob && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-0">
              <div className="bg-amber-900 text-white p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white">Adjust Location on Map</h3>
                    <p className="text-xs text-amber-200 font-medium">
                      Pickup for {adjustingLocationJob.customerName} ({adjustingLocationJob.id})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAdjustingLocationJob(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <InteractiveGPSMapPicker
                  initialLocation={tempAdjustedLocation}
                  onLocationSelect={(loc) => setTempAdjustedLocation(loc)}
                  title="Drag Map Pin to Adjust Spot"
                  subtitle="Search new address or reposition marker directly on the interactive map"
                />

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setAdjustingLocationJob(null)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setPickups((prev) =>
                        prev.map((p) =>
                          p.id === adjustingLocationJob.id
                            ? {
                                ...p,
                                address: tempAdjustedLocation.address,
                                lat: tempAdjustedLocation.lat,
                                lng: tempAdjustedLocation.lng,
                                landmark: tempAdjustedLocation.landmark,
                              }
                            : p
                        )
                      );
                      setAdjustingLocationJob(null);
                      setStatusModalData({
                        isOpen: true,
                        title: 'Waypoint Location Updated',
                        subtitle: `Updated GPS pin and pickup address for ${adjustingLocationJob.customerName}.`,
                        details: [
                          { label: 'Customer', value: adjustingLocationJob.customerName },
                          { label: 'New Address', value: tempAdjustedLocation.address },
                          { label: 'Coordinates', value: `${tempAdjustedLocation.lat.toFixed(4)}°N, ${tempAdjustedLocation.lng.toFixed(4)}°E` },
                        ],
                        buttonText: 'OK, Got It',
                      });
                    }}
                    className="flex-2 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Save & Update Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
