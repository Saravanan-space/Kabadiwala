'use client';

import React from 'react';
import { Camera, PlusCircle, Tag, Building2, Wallet, ChevronRight, ShieldAlert, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { NavTab } from '../common/BottomNav';
import { WasteLot } from '../../types/lot';
import { Recycler } from '../../types/recycler';
import { calculateEarnings } from '../../services/transactionService';

interface HomeDashboardProps {
  onNavigate: (tab: NavTab) => void;
  recentLots: WasteLot[];
  nearbyRecycler: Recycler;
  onSelectLot: (lot: WasteLot) => void;
  onSelectRecycler: (recycler: Recycler) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  recentLots,
  nearbyRecycler,
  onSelectLot,
  onSelectRecycler,
}) => {
  const { t } = useTranslation();
  const stats = calculateEarnings();

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Greeting Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>{t('goodMorning')}</span>
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-1">{t('readyToSell')}</p>
        </div>
        <div className="hidden sm:block text-right">
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
            Collector Dashboard
          </span>
        </div>
      </div>

      {/* Primary Hero Action Card: SCAN E-WASTE */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-6 sm:p-8 shadow-xl text-white space-y-6 border border-blue-500 relative overflow-hidden group">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
              ⚡ AI Waste Identification
            </span>
            <h3 className="text-3xl font-black tracking-tight text-white mt-3">Add E-Waste</h3>
            <p className="text-sm text-blue-100 font-medium mt-1 max-w-md">
              Take a photo and get an instant material detection & fair price valuation!
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center shadow-inner shrink-0 hidden sm:flex">
            <Sparkles className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        {/* Huge Primary Camera Button with Vibrant Blue Accent */}
        <button
          onClick={() => onNavigate('scan')}
          className="w-full bg-white hover:bg-slate-50 text-blue-700 font-black py-4.5 px-6 rounded-2xl text-lg uppercase tracking-wide flex items-center justify-center space-x-3 shadow-lg transform active:scale-98 transition-all border border-blue-100 relative z-10"
        >
          <Camera className="w-7 h-7 text-blue-600 stroke-[2.5]" />
          <span>📷 {t('scanEwaste')}</span>
          <ArrowRight className="w-6 h-6 text-blue-600" />
        </button>
      </div>

      {/* Secondary Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <button
          onClick={() => onNavigate('scan')}
          className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-sm transition-all active:scale-95 group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm">Add Lot</span>
        </button>

        <button
          onClick={() => onNavigate('prices')}
          className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-sm transition-all active:scale-95 group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm">View Prices</span>
        </button>

        <button
          onClick={() => onNavigate('recyclers')}
          className="bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-sm transition-all active:scale-95 group"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm">Find Recycler</span>
        </button>
      </div>

      {/* Today's Revenue Summary Card */}
      <div
        onClick={() => onNavigate('earnings')}
        className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 shadow-sm space-y-4 cursor-pointer transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Today's Revenue Summary</h3>
              <p className="text-xs text-slate-500">Live Scrapped Value Ledger</p>
            </div>
          </div>
          <span className="text-xs text-blue-600 font-bold flex items-center hover:underline">
            <span>View Ledger</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">{t('todaysEarnings')}</span>
            <span className="text-xl font-black text-blue-600">₹{stats.today.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">{t('thisMonth')}</span>
            <span className="text-base font-extrabold text-slate-800">₹{stats.thisMonth.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase block">{t('pending')}</span>
            <span className="text-base font-extrabold text-amber-600">₹{stats.pending.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Recent Waste Lots Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">{t('recentLots')}</h3>
          <button
            onClick={() => onNavigate('lots')}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            See All Lots
          </button>
        </div>

        <div className="space-y-3">
          {recentLots.slice(0, 2).map((lot) => {
            const firstItem = lot.items[0] || { material: 'PCB', weightKg: 2.5 };
            return (
              <div
                key={lot.id}
                onClick={() => onSelectLot(lot)}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-300 flex items-center justify-between text-xs sm:text-sm cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900">{lot.id}</span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {firstItem.material}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    {lot.totalWeightKg} kg • <span className="font-bold text-slate-900">₹{lot.totalEstimatedValue.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    lot.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {lot.status === 'Completed' ? 'Sold' : lot.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nearby Authorized Recycler Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">{t('nearbyRecycler')}</h3>
          <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {nearbyRecycler.distanceKm} km away
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">{nearbyRecycler.name}</h4>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ Authorized
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Accepts: <span className="text-slate-900 font-bold">{nearbyRecycler.acceptedMaterials.join(', ')}</span>
          </p>

          <div className="flex items-center text-xs text-blue-700 font-bold pt-1">
            <Truck className="w-4 h-4 mr-1.5 text-blue-600" />
            <span>Pickup Available Today</span>
          </div>
        </div>

        <button
          onClick={() => onSelectRecycler(nearbyRecycler)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1 shadow-sm transition-all"
        >
          <span>View Recycler Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Reminder Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>{t('batterySafetyAlert')}</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-800">{t('batterySafetyText')}</p>
        <button
          onClick={() => onNavigate('safety')}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1 shadow-xs"
        >
          <span>{t('viewSafetyGuide')}</span>
        </button>
      </div>
    </div>
  );
};
