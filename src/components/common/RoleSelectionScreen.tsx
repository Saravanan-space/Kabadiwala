'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Truck,
  Building2,
  Volume2,
  ChevronRight,
  Globe,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export type UserRole = 'user' | 'recycler';

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelectionScreen({ onSelectRole }: RoleSelectionScreenProps) {
  const { t, speakText, isSpeaking, speakingId, openLanguageSelector } = useLanguage();

  const isPlayingHeader = isSpeaking && speakingId === 'role-header-tts';

  const roles = [
    {
      id: 'user' as UserRole,
      title: t('role_user_title'),
      desc: t('role_user_desc'),
      icon: Truck,
      badge: 'Collector & Aggregator Portal',
      cardBg: 'bg-white border-slate-200/90 hover:border-emerald-500/50 shadow-sm hover:shadow-md',
      iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'recycler' as UserRole,
      title: t('role_recycler_title'),
      desc: t('role_recycler_desc'),
      icon: Building2,
      badge: 'Authorized Recycler Partner',
      cardBg: 'bg-white border-slate-200/90 hover:border-purple-500/50 shadow-sm hover:shadow-md',
      iconBg: 'bg-purple-100 text-purple-800 border-purple-200',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-50 font-sans text-slate-900 p-4 sm:p-6 lg:p-8 flex flex-col justify-between max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto relative overflow-hidden">
      {/* Top Bar matching Household Seller Header */}
      <div className="flex items-center justify-between z-10 pt-2 pb-4 border-b border-slate-200/80 w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-800 flex items-center justify-center text-white shadow-md font-black text-xl">
            K
          </div>
          <div>
            <h1 className="font-black text-xl sm:text-2xl text-emerald-900 tracking-tight leading-tight">
              Kabadiwala Connect
            </h1>
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 tracking-wide uppercase block">
              Scrap & E-Waste Network
            </span>
          </div>
        </div>

        <button
          onClick={openLanguageSelector}
          className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 text-slate-700 shadow-xs"
        >
          <Globe className="w-4 h-4 text-emerald-700" />
          <span>{t('language')}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="my-auto py-8 sm:py-12 space-y-8 z-10 w-full">
        {/* Title & Sound Read Aloud Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('select_role_title')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Select Your Interface
            </h2>
            <p className="text-xs sm:text-base text-slate-600 font-semibold">
              {t('select_role_sub')}
            </p>
          </div>

          <button
            onClick={() =>
              speakText(
                `${t('select_role_title')}. ${t('select_role_sub')}. ${t('role_user_title')}. ${t('role_recycler_title')}.`,
                'role-header-tts'
              )
            }
            className={`p-3.5 rounded-full border transition-all shrink-0 ${
              isPlayingHeader
                ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse scale-105'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title={t('read_aloud')}
          >
            <Volume2 className="w-6 h-6 stroke-[2]" />
          </button>
        </div>

        {/* 2 Primary Role Selection Cards (Responsive: 1 col on mobile, 2 cols on tablet & desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isPlayingRole = isSpeaking && speakingId === `role-${role.id}`;

            return (
              <div
                key={role.id}
                className={`relative ${role.cardBg} rounded-3xl p-6 border shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer flex flex-col justify-between`}
                onClick={() => onSelectRole(role.id)}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${role.iconBg} flex items-center justify-center shrink-0 border`}>
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                      </div>

                      <div className="space-y-1">
                        <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border ${role.badgeBg} uppercase tracking-wider inline-block`}>
                          {role.badge}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                          {role.title}
                        </h3>
                      </div>
                    </div>

                    {/* Audio button for individual role */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(`${role.title}. ${role.desc}`, `role-${role.id}`);
                      }}
                      className={`p-2.5 rounded-full border transition-all shrink-0 ${
                        isPlayingRole
                          ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title={t('read_aloud')}
                    >
                      <Volume2 className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-3">
                    {role.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-800 group-hover:text-emerald-950 transition-colors">
                  <span>Continue as {role.title}</span>
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="z-10 text-center text-slate-500 text-xs sm:text-sm font-bold py-3 border-t border-slate-200/60 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>MPCB Authorized E-Waste Network • Safe & Verified</span>
      </div>
    </div>
  );
}
