'use client';

import React from 'react';
import { useTranslation, Language } from '../../i18n/useTranslation';
import { MapPin, Globe, WifiOff } from 'lucide-react';

interface TopBarProps {
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ isOffline, onToggleOffline }) => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Location */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
            K
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">{t('appName')}</span>
              <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                PRO
              </span>
            </div>
            <div className="flex items-center text-slate-500 text-xs font-semibold space-x-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>📍 {t('location')}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Language & Offline Mode Toggle */}
        <div className="flex items-center space-x-2.5">
          {/* Offline Mode Toggle Button */}
          <button
            onClick={onToggleOffline}
            title={isOffline ? 'Offline Mode Active' : 'Online Mode'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <WifiOff className={`w-3.5 h-3.5 ${isOffline ? 'text-amber-600 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">{isOffline ? 'Offline' : 'Online'}</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-slate-100 text-slate-800 text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none pr-7"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
            <Globe className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
};
