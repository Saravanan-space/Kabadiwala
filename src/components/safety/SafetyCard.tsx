'use client';

import React, { useState } from 'react';
import { ShieldAlert, Volume2, Battery, Cpu, Tv, Zap } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export const SafetyCenter: React.FC = () => {
  const { t } = useTranslation();
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const safetyGuides = [
    {
      id: 'battery',
      title: 'Lithium Battery Safety',
      icon: Battery,
      severity: 'HIGH RISK ⚠️',
      rules: [
        '🔥 NEVER burn lithium battery packs in open fire.',
        '☠️ DO NOT puncture, crush, or break casing.',
        '🔋 Store in cool, dry shadow away from combustible materials.',
        '🧤 Wear insulating rubber gloves while handling damaged cells.',
      ],
      audioText: 'बैटरी सुरक्षा निर्देश: लिथियम बैटरी को कभी न जलाएं और न ही पंचर करें।',
    },
    {
      id: 'pcb',
      title: 'PCB & Circuit Board Safety',
      icon: Cpu,
      severity: 'CHEMICAL HAZARD ☠️',
      rules: [
        '☠️ Avoid open acid leaching or informal chemical baths.',
        '🔥 Avoid open burning of plastic solder boards.',
        '🧤 Use protective face masks to avoid toxic solder fumes.',
      ],
      audioText: 'सर्किट बोर्ड सुरक्षा: बिना सुरक्षा उपकरणों के रसायन का प्रयोग न करें।',
    },
    {
      id: 'cable',
      title: 'Copper Cable & Wire Safety',
      icon: Zap,
      severity: 'ENVIRONMENTAL CODE ⚠️',
      rules: [
        '🔥 DO NOT burn PVC cables to recover copper wiring.',
        '✂️ Use mechanical wire strippers or cable peeling machines.',
        '🌱 Burning cables emits cancer-causing dioxin fumes.',
      ],
      audioText: 'केबल सुरक्षा: तांबा निकालने के लिए केबल न जलाएं, स्ट्रिपिंग टूल का उपयोग करें।',
    },
    {
      id: 'crt',
      title: 'CRT Display Tube Safety',
      icon: Tv,
      severity: 'IMPLOSION RISK ⚠️',
      rules: [
        '📺 Handle old TV & monitor glass tubes with care.',
        '💥 Vacuum implosion risk if neck glass breaks suddenly.',
        '🧤 Always wear thick leather gloves and eye goggles.',
      ],
      audioText: 'सीआरटी ग्लास सुरक्षा: टीवी पिक्चर ट्यूब के शीशे को सावधानी से संभालें।',
    },
  ];

  const handlePlayAudio = (id: string, text: string) => {
    setPlayingAudioId(id);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAudioId(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-xl text-slate-900">E-Waste Safety Center</h2>
            <p className="text-xs text-slate-500 font-medium">Protect Yourself & The Environment</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          Follow responsible recycling guidelines to prevent toxic chemical exposure, fire hazards, and injury.
        </p>
      </div>

      {/* Safety Cards List */}
      <div className="space-y-4">
        {safetyGuides.map((guide) => {
          const Icon = guide.icon;
          const isPlaying = playingAudioId === guide.id;

          return (
            <div
              key={guide.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">{guide.title}</h3>
                </div>

                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {guide.severity}
                </span>
              </div>

              {/* Rules list */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                {guide.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-slate-800 font-semibold">
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              {/* Vernacular Audio Guidance Blue Button */}
              <button
                onClick={() => handlePlayAudio(guide.id, guide.audioText)}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                  isPlaying
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
                <span>{isPlaying ? 'Playing Regional Audio Guidance...' : '🔊 Listen (क्षेत्रीय भाषा में सुनें)'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
