'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../common/Header';
import {
  Building2,
  PlusCircle,
  UserCheck,
  Handshake,
  MessageSquare,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Truck,
  MapPin,
  Clock,
  Phone,
  Lock,
  Calculator,
  XCircle,
  AlertCircle,
  AlertTriangle,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { LivePickupTrackingMap } from '../map/LivePickupTrackingMap';
import { DEFAULT_LOCATION } from '../../services/mapService';
import { StatusConfirmationModal } from '../common/StatusConfirmationModal';

interface LotDetailsScreenProps {
  onBack: () => void;
  onVerifyHandover: () => void;
  lot?: any;
  onAcceptQuote?: (lotId: string) => void;
  onDeclineQuote?: (lotId: string) => void;
}

export function LotDetailsScreen({
  onBack,
  onVerifyHandover,
  lot = {
    id: 'KBD-1042',
    material: 'Cable',
    weight: 0.5,
    priceRange: '₹90–₹110',
    recycler: {
      name: 'GreenCycle Recycling',
      address: 'MIDC Andheri East, Mumbai',
      rate: 210,
    },
    status: 'Pickup Person On The Way',
    statusStep: 4,
  },
  onAcceptQuote,
  onDeclineQuote,
}: LotDetailsScreenProps) {
  const { t } = useLanguage();

  const isEnRoute = lot.status === 'Pickup Person On The Way';
  const isQuoteLocked = lot.status === 'Quote Locked' || lot.quoteStatus === 'locked';
  const isQuoteDeclined = lot.status === 'Quote Declined' || lot.quoteStatus === 'declined';
  const isQuoteAccepted = lot.quoteStatus === 'accepted';

  const totalQuoteVal =
    lot.quotedTotal ||
    (lot.quotedRates && lot.quotedRates.length > 0
      ? lot.quotedRates.reduce((sum: number, q: any) => sum + (q.subtotal_inr || 0), 0)
      : Math.round((lot.weight || 0.5) * (lot.recycler?.rate || lot.offerPrice || 210)));

  const dispatchInfo = lot.dispatchInfo || {
    driverName: 'Suresh Kumar',
    driverPhone: '+91 98201 44556',
    vehicleNumber: 'MH-02-AB-4581',
    driverRating: 4.9,
    etaMinutes: 15,
    distanceKm: 3.2,
    dispatchedAt: new Date().toISOString(),
    status: 'En Route',
    pickupCode: '8492',
  };

  const customerLocation = lot.gpsLocation || {
    lat: 19.1136,
    lng: 72.8697,
    address: lot.customerAddress || lot.location || 'MIDC Industrial Area, Andheri East, Mumbai',
    landmark: 'Opposite SEEPZ Gate 1',
  };

  // Reference district median rates for real-time anomaly detection (INR/kg)
  const getDistrictMedianRate = (materialName: string): number => {
    const lower = (materialName || '').toLowerCase();
    if (lower.includes('laptop')) return 520;
    if (lower.includes('smart') || lower.includes('phone') || lower.includes('mobile') || lower.includes('cellular')) return 450;
    if (lower.includes('pcb') || lower.includes('circuit')) return 355;
    if (lower.includes('camera')) return 350;
    if (lower.includes('cable') || lower.includes('wire') || lower.includes('copper')) return 210;
    if (lower.includes('calculator') || lower.includes('power bank') || lower.includes('power')) return 150;
    if (lower.includes('motor') || lower.includes('compressor')) return 140;
    if (lower.includes('keyboard')) return 115;
    if (lower.includes('mouse') || lower.includes('mice')) return 105;
    if (lower.includes('battery') || lower.includes('lithium')) return 75;
    if (lower.includes('display') || lower.includes('screen') || lower.includes('monitor') || lower.includes('panel') || lower.includes('tablet') || lower.includes('lcd')) return 80;
    if (lower.includes('media') || lower.includes('floppy') || lower.includes('vhs') || lower.includes('disk')) return 50;
    return 150;
  };

  // Fallback quote items if quotedRates is not yet populated
  const quoteBreakdown =
    lot.quotedRates && lot.quotedRates.length > 0
      ? lot.quotedRates
      : [
          {
            material_category: lot.material || 'E-Waste Scrap Item',
            weight_kg: lot.weight || 0.5,
            rate_per_kg: lot.recycler?.rate || lot.offerPrice || 210,
            subtotal_inr: totalQuoteVal,
          },
        ];

  // Real-time anomaly detection for scrap collector side
  const lowRateAnomalies = quoteBreakdown.map((item: any) => {
    const name = item.material_category || item.name || lot.material || 'E-Waste Item';
    const rate = item.rate_per_kg || item.offerPrice || lot.recycler?.rate || lot.offerPrice || 0;
    const median = getDistrictMedianRate(name);
    const diffPercent = Math.round(((rate - median) / median) * 100);
    const isTooLow = diffPercent <= -20; // 20%+ below market median
    return {
      name,
      rate,
      median,
      diffPercent,
      isTooLow,
    };
  });

  const hasLowRateAnomaly = lowRateAnomalies.some((a: any) => a.isTooLow);
  const lowRateItems = lowRateAnomalies.filter((a: any) => a.isTooLow);

  const timelineSteps = [
    { key: 'status_created', label: 'Lot Created', icon: PlusCircle, done: true, time: t('just_now') },
    {
      key: 'status_quote_locked',
      label: isQuoteDeclined
        ? 'Quote Declined — Finding New Recycler'
        : isQuoteLocked
        ? `Quote Locked · ₹${totalQuoteVal.toLocaleString('en-IN')}`
        : 'Quote Reviewed',
      icon: Lock,
      done: isQuoteLocked || isQuoteAccepted || isEnRoute || lot.status === 'Completed',
      time: isQuoteLocked ? 'Pending Your Acceptance' : t('just_now'),
      highlight: isQuoteLocked,
    },
    { key: 'status_recycler_selected', label: 'Recycler Assigned', icon: UserCheck, done: !isQuoteLocked && !isQuoteDeclined, time: t('just_now') },
    {
      key: 'status_pickup_en_route',
      label: isEnRoute ? 'Pickup Person On The Way' : 'Pickup Scheduled',
      icon: Truck,
      done: isEnRoute || lot.status === 'Completed',
      time: isEnRoute ? 'En Route • 15 min ETA' : t('pending'),
      highlight: isEnRoute,
    },
    { key: 'status_handover_pending', label: 'Digital Handover & Scale Weighing', icon: MessageSquare, done: lot.status === 'Completed', time: t('pending') },
    { key: 'status_payment_completed', label: 'Instant Payment & EPR Certificate', icon: DollarSign, done: lot.status === 'Completed', time: t('pending') },
  ];

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  const handleAccept = () => {
    setShowAcceptModal(true);
  };

  const handleDecline = () => {
    setShowDeclineModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header
        title={t('lot_details_title', { id: lot.id })}
        subtitle=""
        showBack
        onBack={onBack}
        pageAudioText={`${t('lot_details_title', { id: lot.id })}. Item: ${lot.material}, ${lot.weight} kg. Selected recycler: ${lot.recycler?.name || 'Authorized Recycler'}. ${isQuoteLocked ? 'Quote is locked at rupees ' + totalQuoteVal : 'Handover pending.'}`}
      />

      <div className="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Quote Locked Alert Banner */}
        {isQuoteLocked && (
          <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 border border-emerald-600/60 flex items-center justify-center shrink-0 text-white shadow-inner">
                <Lock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-700 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-300" /> Quote Locked · ₹{totalQuoteVal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">
                    Binding Rate Guarantee
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  Recycler offered a committed quote of ₹{totalQuoteVal.toLocaleString('en-IN')}
                </h3>
                <p className="text-xs text-emerald-100 font-medium">
                  Review the per-material breakdown below. Once accepted, rates are 100% locked and guaranteed at physical weigh-in.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-emerald-300">
                ₹{totalQuoteVal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Quote Declined Alert Banner */}
        {isQuoteDeclined && (
          <div className="bg-amber-50 text-amber-900 rounded-3xl p-5 border border-amber-300 shadow-sm flex items-center gap-3.5">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 inline-block mb-1">
                Quote Declined — Finding New Recycler
              </span>
              <p className="text-xs font-medium text-amber-800">
                You declined the previous quote. You can select another authorized recycler from the directory.
              </p>
            </div>
          </div>
        )}

        {/* Live Pickup Tracking Map if Pickup is on the way */}
        {isEnRoute && (
          <LivePickupTrackingMap
            customerLocation={customerLocation}
            dispatchInfo={dispatchInfo}
            recyclerName={lot.recycler?.name || 'GreenCycle E-Waste Hub'}
            lotId={lot.id}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Item Summary & Selected Recycler / Locked Quote Breakdown */}
          <div className="md:col-span-6 space-y-5">
            {/* Item Summary Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"
                alt={lot.material}
                className="w-18 h-18 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Lot ID: {lot.id}
                  </span>
                  {isQuoteLocked ? (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Quote Locked · ₹{totalQuoteVal.toLocaleString('en-IN')}
                    </span>
                  ) : isQuoteDeclined ? (
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-200">
                      Quote Declined — Finding New Recycler
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {lot.status}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight truncate">
                  {lot.material}
                </h3>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">
                  {lot.weight} kg Total Declared Weight
                </p>
                <p className="text-base font-extrabold text-emerald-700 mt-1">
                  Committed Payout: ₹{totalQuoteVal.toLocaleString('en-IN')}
                </p>
              </div>
            </div>


            {/* Price Anomaly Warning Banner for Scrap Collector */}
            {hasLowRateAnomaly && (
              <div className="bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-3xl p-5 shadow-md flex items-start gap-4 animate-in fade-in duration-200">
                <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <AlertTriangle className="w-6 h-6 stroke-[2.4]" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full border border-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-700" /> Price Anomaly: Value Way Too Low
                    </span>
                    <span className="text-xs font-bold text-rose-800">
                      {lowRateItems.length} item{lowRateItems.length > 1 ? 's' : ''} priced below market rate
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-rose-950 leading-snug">
                    Recycler quoted rates are significantly lower than current market median
                  </h4>
                  <p className="text-xs text-rose-900 font-medium leading-relaxed">
                    Our real-time market benchmark detected that {lowRateItems.map((i: any) => `${i.name} is quoted at ₹${i.rate}/kg (market median is ₹${i.median}/kg)`).join(', ')}. You can decline this quote to find higher-paying authorized recyclers.
                  </p>
                </div>
              </div>
            )}

            {/* Locked Quote Itemized Read-Only Table */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Locked Material Quote Breakdown
                    </h4>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Immutable rate commitment by {lot.recycler?.name || 'Recycler'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-full border border-indigo-200">
                  {quoteBreakdown.length} Items
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5">Material</th>
                      <th className="px-3 py-2.5 text-center">Weight</th>
                      <th className="px-3 py-2.5 text-right">Committed Rate</th>
                      <th className="px-3 py-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                    {quoteBreakdown.map((item: any, idx: number) => {
                      const anomaly = lowRateAnomalies[idx];
                      const rate = item.rate_per_kg || item.offerPrice || lot.recycler?.rate || lot.offerPrice || 0;
                      const subtotal = item.subtotal_inr || item.subtotal || Math.round((item.weight_kg || lot.weight) * rate);

                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            anomaly?.isTooLow
                              ? 'bg-rose-50/50 hover:bg-rose-50/80 border-l-4 border-l-rose-500'
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="px-3 py-2.5 font-bold text-slate-900">
                            <div>
                              <span>{item.material_category || item.name || lot.material}</span>
                              {anomaly?.isTooLow && (
                                <span className="block text-[10px] font-bold text-rose-700 mt-0.5">
                                  ⚠️ Market Median: ₹{anomaly.median}/kg
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center text-slate-600 font-semibold">
                            {item.weight_kg || item.weightKg || lot.weight} kg
                          </td>
                          <td className="px-3 py-2.5 text-right font-bold">
                            {anomaly?.isTooLow ? (
                              <div className="flex flex-col items-end">
                                <span className="text-rose-700 font-black text-xs sm:text-sm">
                                  ₹{rate}/kg
                                </span>
                                <span className="inline-flex items-center gap-0.5 text-[9.5px] font-black text-rose-700 bg-rose-100 border border-rose-300 px-1.5 py-0.5 rounded-full mt-0.5 whitespace-nowrap">
                                  <TrendingDown className="w-3 h-3" />
                                  Way Too Low ({anomaly.diffPercent}%)
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-end">
                                <span className="text-emerald-800 font-bold text-xs sm:text-sm">
                                  ₹{rate}/kg
                                </span>
                                <span className="text-[9.5px] text-slate-400 font-medium">
                                  Avg: ₹{anomaly.median}/kg
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-right font-black text-slate-900">
                            ₹{subtotal.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-emerald-50/70 border-t border-emerald-200 text-emerald-950 font-black">
                    <tr>
                      <td colSpan={3} className="px-3 py-2.5 uppercase text-[11px] tracking-wider">
                        Total Guaranteed Payout
                      </td>
                      <td className="px-3 py-2.5 text-right text-base text-emerald-900">
                        ₹{totalQuoteVal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                * Note: Physical weigh-in during pickup only adjusts the weight quantity — the quoted rate per kg remains immutable.
              </p>
            </div>

            {/* Selected Recycler Light Green Box */}
            <div className="bg-emerald-100/70 border border-emerald-200/80 rounded-3xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                  {t('selected_recycler')}
                </span>
                <h4 className="text-lg font-bold text-slate-900 leading-snug">
                  {lot.recycler?.name || 'GreenCycle Recycling'}
                </h4>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {lot.recycler?.address || 'MIDC Andheri East, Mumbai'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl sm:text-2xl font-black text-emerald-800">
                  ₹{lot.recycler?.rate || lot.offerPrice || 210}
                </span>
                <span className="text-xs font-semibold text-slate-500 block">
                  {t('per_kg')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Status Timeline & Action Buttons */}
          <div className="md:col-span-6 space-y-5">
            {/* Status Timeline Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                {t('status_title')}
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timelineSteps.map((stepItem, idx) => {
                  const IconComp = stepItem.icon;
                  return (
                    <div key={idx} className="relative flex items-center justify-between">
                      {/* Circle Marker */}
                      <div
                        className={`absolute -left-[1.65rem] w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                          stepItem.done
                            ? 'bg-emerald-100 border-emerald-600 text-emerald-700'
                            : 'bg-slate-100 border-slate-300 text-slate-400'
                        }`}
                      >
                        <IconComp className="w-4 h-4 stroke-[2.2]" />
                      </div>

                      {/* Step Text */}
                      <div>
                        <h5
                          className={`text-base font-bold leading-none ${
                            stepItem.done ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {stepItem.label}
                        </h5>
                        <span className="text-xs text-slate-500 mt-1 block font-medium">
                          {stepItem.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons: Accept / Decline Quote OR Verify Handover */}
            {isQuoteLocked ? (
              <div className="bg-white rounded-3xl p-5 border border-indigo-200 shadow-md space-y-3">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-700" /> Action Required on Locked Quote
                </h4>

                {hasLowRateAnomaly && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5 text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs font-semibold leading-tight">
                      <span className="font-extrabold text-rose-700 block">Low Value Detected</span>
                      {lowRateItems.length} material rate{lowRateItems.length > 1 ? 's are' : ' is'} significantly below market median. You can decline this quote to request fairer bids from other recyclers.
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-600 font-medium">
                  Please accept the committed quote of ₹{totalQuoteVal.toLocaleString('en-IN')} to schedule doorstep pickup, or decline to choose another recycler.
                </p>

                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={handleAccept}
                    className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-extrabold text-base shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Accept Quote (₹{totalQuoteVal.toLocaleString('en-IN')})</span>
                  </button>

                  <button
                    onClick={handleDecline}
                    className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-slate-200 hover:border-rose-200 active:scale-[0.99] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline and Find Another Recycler</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  onVerifyHandover();
                }}
                className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t('verify_handover_btn')}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Force User OK Status Popup Modal for Quote Acceptance */}
            <StatusConfirmationModal
              isOpen={showAcceptModal}
              title="Quote Accepted & Rates Locked"
              subtitle="You have accepted the committed rate guarantee. The recycler is preparing pickup dispatch."
              type="success"
              details={[
                { label: 'Lot Identifier', value: lot.id },
                { label: 'Selected Recycler', value: lot.recycler?.name || 'GreenCycle Recycling' },
                { label: 'Total Valuation Payout', value: `₹${totalQuoteVal.toLocaleString('en-IN')}` },
                { label: 'Rate Guarantee', value: '100% Locked at Physical Scale' },
              ]}
              buttonText="OK, Confirm & Track Pickup"
              onConfirm={() => {
                setShowAcceptModal(false);
                if (onAcceptQuote) {
                  onAcceptQuote(lot.id);
                }
              }}
            />

            {/* Force User OK Status Popup Modal for Quote Decline */}
            <StatusConfirmationModal
              isOpen={showDeclineModal}
              title="Quote Declined"
              subtitle="You have declined this quote. The lot is now reopened to find higher-paying authorized recyclers."
              type="info"
              details={[
                { label: 'Lot Identifier', value: lot.id },
                { label: 'Declined Offer', value: `₹${totalQuoteVal.toLocaleString('en-IN')}` },
                { label: 'Reason', value: hasLowRateAnomaly ? 'Price Anomaly (Rate Too Low)' : 'Collector Declined' },
                { label: 'Next Step', value: 'Select another recycler from directory' },
              ]}
              buttonText="OK, Find Other Recyclers"
              onConfirm={() => {
                setShowDeclineModal(false);
                if (onDeclineQuote) {
                  onDeclineQuote(lot.id);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

