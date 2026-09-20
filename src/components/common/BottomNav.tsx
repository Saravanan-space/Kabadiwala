'use client';

import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { Home, Camera, Tag, Building2, User } from 'lucide-react';

export type NavTab = 'home' | 'scan' | 'lots' | 'prices' | 'recyclers' | 'earnings' | 'transactions' | 'safety' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'home' as NavTab, label: t('navHome'), icon: Home },
    { id: 'scan' as NavTab, label: t('navScan'), icon: Camera, isPrimary: true },
    { id: 'prices' as NavTab, label: t('navPrices'), icon: Tag },
    { id: 'recyclers' as NavTab, label: t('navRecyclers'), icon: Building2 },
    { id: 'profile' as NavTab, label: t('navProfile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 border-t border-slate-200 shadow-xl backdrop-blur-lg">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="relative -top-5 flex flex-col items-center justify-center focus:outline-none group"
              >
                <div className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border-4 border-white transform active:scale-95 transition-transform">
                  <Camera className="w-7 h-7 text-white stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-bold text-blue-600 mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 py-1 flex flex-col items-center justify-center transition-colors rounded-xl ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-1 font-semibold tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
