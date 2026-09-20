'use client';

import React from 'react';
import { useTranslation, Language } from '../../i18n/useTranslation';
import { MapPin, Phone, ShieldCheck, Globe, WifiOff } from 'lucide-react';
import { calculateEarnings } from '../../services/transactionService';

interface UserProfileProps {
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ isOffline, onToggleOffline }) => {
  const { language, setLanguage, t } = useTranslation();
  const stats = calculateEarnings();

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-blue-500/20">
            R
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-xl text-slate-900">Ramesh Scrap Trader</h2>
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs sm:text-sm text-blue-700 font-bold">Verified Informal E-Waste Collector</p>
            <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium mt-1">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-blue-600" />
                Bengaluru West
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                +91 98450 12345
              </span>
            </div>
          </div>
        </div>

        {/* Lifetime Statistics */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center text-xs sm:text-sm">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase block">Total Lots</span>
            <span className="font-black text-slate-900 text-lg">{stats.totalLots}</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-bold uppercase block">Total Earned</span>
            <span className="font-black text-blue-600 text-lg">₹{stats.thisMonth.toLocaleString('en-IN')}</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-bold uppercase block">Completed</span>
            <span className="font-black text-slate-900 text-lg">{stats.completedCount}</span>
          </div>
        </div>
      </div>

      {/* Settings & Preferences */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-200 pb-3">
          App Settings & Preferences
        </h3>

        {/* Language selector */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs sm:text-sm">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-800">App Vernacular Language</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-slate-50 text-blue-700 font-extrabold text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
          </select>
        </div>

        {/* Offline Mode Toggle */}
        <div className="flex items-center justify-between py-2 text-xs sm:text-sm">
          <div className="flex items-center space-x-3">
            <WifiOff className="w-5 h-5 text-amber-600" />
            <div>
              <span className="font-bold text-slate-800 block">Offline Mode Simulation</span>
              <span className="text-xs text-slate-500">Test app features without active internet</span>
            </div>
          </div>
          <button
            onClick={onToggleOffline}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              isOffline ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            {isOffline ? 'Active' : 'Disabled'}
          </button>
        </div>

        {/* SIH Hackathon Info */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-blue-700">SIH Project: KABADIWALA</span>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Live Backend Ready
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Smart Collection. Fair Prices. Responsible Recycling. Designed specifically for informal scrap collectors in India.
          </p>
        </div>
      </div>
    </div>
  );
};
