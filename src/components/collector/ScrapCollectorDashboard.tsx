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
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface PickupJob {
  id: string;
  customerName: string;
  phone: string;
  address: string;
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
  const [activeTab, setActiveTab] = useState<'pickups' | 'batching' | 'summary'>('pickups');
  const [pickups, setPickups] = useState<PickupJob[]>(INITIAL_PICKUPS);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [collectedWeight, setCollectedWeight] = useState<string>('');

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

  const handleConfirmCollection = (job: PickupJob) => {
    const finalKg = parseFloat(collectedWeight) || job.estWeightKg;
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

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
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
        <div className="grid grid-cols-3 gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('pickups')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pickups'
                ? 'bg-white text-amber-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Route</span>
          </button>

          <button
            onClick={() => setActiveTab('batching')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'batching'
                ? 'bg-white text-amber-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Batching</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'summary'
                ? 'bg-white text-amber-800 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
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
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs font-medium text-slate-700">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{job.address}</span>
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
      </main>
    </div>
  );
}
