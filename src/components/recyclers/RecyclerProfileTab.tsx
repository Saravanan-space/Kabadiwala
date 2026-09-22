'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Building2,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Save,
  Volume2,
} from 'lucide-react';

export interface RecyclerProfileData {
  businessName: string;
  ownerName: string;
  gstNumber: string;
  phone: string;
  address: string;
  serviceRadiusKm: number;
  pickupAvailable: boolean;
  acceptedMaterials: string[];
}

interface RecyclerProfileTabProps {
  profile?: RecyclerProfileData;
  onSaveProfile?: (updatedProfile: RecyclerProfileData) => void;
}

const DEFAULT_PROFILE: RecyclerProfileData = {
  businessName: 'GreenCycle Recycling Center',
  ownerName: 'Vikram Sharma',
  gstNumber: '27AAAAA0000A1Z5',
  phone: '+91 98765 43210',
  address: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai - 400093',
  serviceRadiusKm: 12,
  pickupAvailable: true,
  acceptedMaterials: ['PCB', 'Cable', 'Battery', 'CRT Monitor', 'LCD Panel', 'Motor', 'Magnet'],
};

const ALL_MATERIAL_OPTIONS = [
  'PCB',
  'Cable',
  'Battery',
  'CRT Monitor',
  'LCD Panel',
  'Motor',
  'Magnet',
  'Smartphone',
  'Laptop',
];

export function RecyclerProfileTab({ profile = DEFAULT_PROFILE, onSaveProfile }: RecyclerProfileTabProps) {
  const { t, speakText, isSpeaking, speakingId } = useLanguage();
  const [formData, setFormData] = useState<RecyclerProfileData>(profile);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleToggleMaterial = (mat: string) => {
    setFormData((prev) => {
      const exists = prev.acceptedMaterials.includes(mat);
      const updated = exists
        ? prev.acceptedMaterials.filter((m) => m !== mat)
        : [...prev.acceptedMaterials, mat];
      return { ...prev, acceptedMaterials: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveProfile) onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const isPlayingHeader = isSpeaking && speakingId === 'profile-tts';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900 leading-tight">Recycler Business Profile</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Authorized Partner Details & Operating Radius
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            speakText(
              `${formData.businessName}. Owner ${formData.ownerName}. Address ${formData.address}. Service radius ${formData.serviceRadiusKm} km.`,
              'profile-tts'
            )
          }
          className={`p-2.5 rounded-full border transition-all ${
            isPlayingHeader
              ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
          title={t('read_aloud')}
        >
          <Volume2 className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl font-bold text-xs shadow-md flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>Profile & service parameters updated successfully!</span>
        </div>
      )}

      {/* Basic Info Fields */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
          Business Credentials
        </h4>

        <div className="grid grid-cols-1 gap-3 text-xs font-semibold">
          <div>
            <label className="text-slate-500 block mb-1 font-bold">Business Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 block mb-1 font-bold">Owner / Contact Person</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1 font-bold">GST / Auth Reg No.</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-500 block mb-1 font-bold">Phone Hotline</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-slate-500 block mb-1 font-bold">Facility Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Service Capability & Radius */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
          Service Capabilities & Radius
        </h4>

        {/* Pickup Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-emerald-700" />
            <div>
              <span className="text-sm font-bold text-slate-900 block leading-tight">
                {t('home_pickup_toggle')}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Offer doorstep e-waste pickup to customers
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, pickupAvailable: !formData.pickupAvailable })}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
              formData.pickupAvailable ? 'bg-emerald-700' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                formData.pickupAvailable ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Radius Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-600">{t('service_radius')}</span>
            <span className="text-emerald-800 font-extrabold text-sm">{formData.serviceRadiusKm} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={formData.serviceRadiusKm}
            onChange={(e) => setFormData({ ...formData, serviceRadiusKm: parseInt(e.target.value) || 1 })}
            className="w-full accent-emerald-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Accepted Materials Multi-Select */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
          {t('accepted_materials')}
        </h4>

        <div className="flex flex-wrap gap-2">
          {ALL_MATERIAL_OPTIONS.map((mat) => {
            const isSel = formData.acceptedMaterials.includes(mat);
            return (
              <button
                type="button"
                key={mat}
                onClick={() => handleToggleMaterial(mat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSel && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{mat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-emerald-800/20 flex items-center justify-center gap-2 transition-all"
      >
        <Save className="w-5 h-5" />
        <span>{t('save_profile_btn')}</span>
      </button>
    </form>
  );
}
