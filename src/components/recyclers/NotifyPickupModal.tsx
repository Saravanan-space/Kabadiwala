'use client';

import React, { useState } from 'react';
import {
  Truck,
  X,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  Send,
  User,
  ShieldCheck,
  Sparkles,
  MessageSquare,
} from 'lucide-react';import { IncomingLot } from './IncomingLotsTab';
import { DispatchInfo } from '../map/LivePickupTrackingMap';

interface NotifyPickupModalProps {
  lot: IncomingLot;
  onClose: () => void;
  onConfirmDispatch: (lotId: string, dispatchInfo: DispatchInfo) => void;
}

const PRESET_DRIVERS = [
  {
    name: 'Suresh Kumar',
    phone: '+91 98201 44556',
    vehicle: 'Tata Ace (MH-02-AB-4581)',
    rating: 4.9,
  },
  {
    name: 'Vikram Singh',
    phone: '+91 97690 11223',
    vehicle: 'Mahindra Bolero Maxx (MH-03-CD-8821)',
    rating: 4.8,
  },
  {
    name: 'Ramesh Gaikwad',
    phone: '+91 98199 77889',
    vehicle: 'Electric E-Loader (MH-04-EF-9920)',
    rating: 4.9,
  },
];

export function NotifyPickupModal({ lot, onClose, onConfirmDispatch }: NotifyPickupModalProps) {
  const [selectedDriverIndex, setSelectedDriverIndex] = useState<number>(0);
  const [customDriverName, setCustomDriverName] = useState<string>('');
  const [customDriverPhone, setCustomDriverPhone] = useState<string>('');
  const [customVehicle, setCustomVehicle] = useState<string>('');
  const [etaMinutes, setEtaMinutes] = useState<number>(15);
  const [notifyViaSMS, setNotifyViaSMS] = useState<boolean>(true);
  const [notifyViaWhatsApp, setNotifyViaWhatsApp] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedDriver = PRESET_DRIVERS[selectedDriverIndex];

  const handleDispatch = () => {
    setIsSubmitting(true);

    const driverName = customDriverName.trim() || selectedDriver.name;
    const driverPhone = customDriverPhone.trim() || selectedDriver.phone;
    const vehicleNumber = customVehicle.trim() || selectedDriver.vehicle;
    const pickupSecurityPin = Math.floor(1000 + Math.random() * 9000).toString();

    const dispatchData: DispatchInfo = {
      driverName,
      driverPhone,
      vehicleNumber,
      driverRating: 4.9,
      etaMinutes,
      distanceKm: 3.8,
      dispatchedAt: new Date().toISOString(),
      status: 'En Route',
      pickupCode: pickupSecurityPin,
    };

    setTimeout(() => {
      onConfirmDispatch(lot.id, dispatchData);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <Truck className="w-6 h-6 stroke-[2.2] text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pickup Logistics Dispatch</span>
              </div>
              <h3 className="text-xl font-black text-white">Notify Pickup Person On The Way</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Target Lot Details Summary */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Lot ID: {lot.id}</span>
              <span className="text-emerald-800 font-extrabold">{lot.material} ({lot.weight} kg)</span>
            </div>
            <div className="flex items-start gap-1.5 text-slate-600 font-medium">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{lot.customerAddress || 'MIDC Industrial Area, Andheri East, Mumbai'}</span>
            </div>
          </div>

          {/* 1. Select Assigned Pickup Driver */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              1. Select Assigned Pickup Driver & Vehicle
            </label>
            <div className="space-y-2">
              {PRESET_DRIVERS.map((driver, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedDriverIndex(idx)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedDriverIndex === idx
                      ? 'border-emerald-700 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-700/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        selectedDriverIndex === idx
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{driver.name}</span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                          ★ {driver.rating}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium block">
                        {driver.vehicle} • {driver.phone}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedDriverIndex === idx
                        ? 'border-emerald-700 bg-emerald-700 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {selectedDriverIndex === idx && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Select Estimated Arrival Time (ETA) */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              2. Estimated Arrival Time (ETA)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 25, 40].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setEtaMinutes(mins)}
                  className={`py-3 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 ${
                    etaMinutes === mins
                      ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-800/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mins} Mins</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Notification Channels */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              3. Customer Live Notification Alerts
            </label>
            <div className="space-y-2 text-xs font-semibold text-slate-800">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyViaWhatsApp}
                  onChange={(e) => setNotifyViaWhatsApp(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Send WhatsApp tracking link with live map & driver contact
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyViaSMS}
                  onChange={(e) => setNotifyViaSMS(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <span>Send SMS alert & Security Pickup PIN</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleDispatch}
            disabled={isSubmitting}
            className="flex-2 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-800/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Dispatching...' : 'Dispatch & Send En-Route Alert'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
