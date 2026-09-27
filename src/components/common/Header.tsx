'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, ArrowLeft, LogOut } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  pageAudioText?: string;
  onSwitchRecyclerMode?: () => void;
  onLogout?: () => void;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  pageAudioText,
  onSwitchRecyclerMode,
  onLogout,
}: HeaderProps) {
  const { t, speakText, isSpeaking, speakingId } = useLanguage();

  const currentTitle = title || t('app_title');
  const currentSubtitle = subtitle !== undefined ? subtitle : t('greeting');
  const textToRead = pageAudioText || `${currentTitle}. ${currentSubtitle}`;
  const isPlayingHeader = isSpeaking && speakingId === 'header-tts';

  const handleSpeechClick = () => {
    speakText(textToRead, 'header-tts');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/80 px-4 py-3 sm:px-6 lg:px-8 transition-all">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        {/* Left Section: Back button or Logo greeting */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight leading-tight">
              {currentTitle}
            </h1>
            {currentSubtitle && (
              <p className="text-sm font-semibold text-slate-600 flex items-center gap-1">
                {currentSubtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchRecyclerMode && (
            <button
              onClick={onSwitchRecyclerMode}
              className="px-3 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1"
            >
              <span>{t('switch_to_recycler')}</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
              title={t('logout_btn')}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('logout_btn')}</span>
            </button>
          )}

          {/* Right Section: Speaker Audio Read Aloud button */}
          <button
            onClick={handleSpeechClick}
            className={`p-3 rounded-full border transition-all shadow-sm flex items-center justify-center ${
              isPlayingHeader
                ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse scale-105 shadow-emerald-600/30'
                : 'bg-emerald-100/80 text-emerald-800 border-emerald-200/80 hover:bg-emerald-200 active:scale-95'
            }`}
            title={t('read_aloud')}
            aria-label={t('read_aloud')}
          >
            <Volume2 className={`w-6 h-6 stroke-[2.2] ${isPlayingHeader ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
