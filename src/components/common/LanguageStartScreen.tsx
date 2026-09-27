'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES, Language } from '../../i18n/translations';
import { Volume2, CheckCircle2, Globe, Sparkles } from 'lucide-react';

export function LanguageStartScreen() {
  const { language, selectLanguage, speakText, isSpeaking, speakingId } = useLanguage();
  const [selectedTemp, setSelectedTemp] = useState<Language>(language);

  const handlePreviewAudio = (e: React.MouseEvent, langCode: Language, textToSpeak: string) => {
    e.stopPropagation();
    speakText(textToSpeak, `lang-${langCode}`, langCode);
  };

  const handleConfirm = () => {
    selectLanguage(selectedTemp);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedTemp) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-md overflow-y-auto p-3 sm:p-6 lg:p-8 justify-center items-center font-sans">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col my-auto max-h-[92vh] sm:max-h-[88vh]">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-5 sm:p-7 text-white text-center relative overflow-hidden shrink-0">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide mb-2 sm:mb-3">
            <Globe className="w-4 h-4 text-emerald-200" />
            <span>Kabadiwala Connect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            {currentLangObj.nativeName} / Select Language
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 font-medium max-w-md mx-auto">
            {currentLangObj.subtext}
          </p>
        </div>

        {/* Language Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 overflow-y-auto bg-slate-50/50 flex-1">
          {SUPPORTED_LANGUAGES.map((langItem) => {
            const isSelected = selectedTemp === langItem.code;
            const isPlayingThis = isSpeaking && speakingId === `lang-${langItem.code}`;

            return (
              <button
                key={langItem.code}
                onClick={() => setSelectedTemp(langItem.code)}
                className={`relative flex flex-col items-start p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 text-left group ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-600/20 scale-[1.02]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                }`}
              >
                {/* Selected indicator badge */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-1.5 w-full">
                  <span className="text-2xl leading-none">{langItem.flag}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {langItem.name}
                  </span>
                </div>

                <div className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {langItem.nativeName}
                </div>

                {/* Subtext preview */}
                <div className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                  {langItem.subtext}
                </div>

                {/* Audio preview button */}
                <button
                  type="button"
                  onClick={(e) =>
                    handlePreviewAudio(
                      e,
                      langItem.code,
                      `${langItem.nativeName}. ${langItem.subtext}`
                    )
                  }
                  title="Listen language name"
                  className={`mt-3 self-end inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                    isPlayingThis
                      ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                      : isSelected
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingThis ? 'Speaking...' : 'Listen'}</span>
                </button>
              </button>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-col gap-3 shrink-0">
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-base sm:text-lg shadow-lg shadow-emerald-800/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <span>{currentLangObj.nativeName} — Continue / आगे बढ़ें</span>
          </button>
        </div>
      </div>
    </div>
  );
}
