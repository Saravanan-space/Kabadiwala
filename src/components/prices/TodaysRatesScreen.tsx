'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../common/Header';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Volume2,
} from 'lucide-react';

interface TodaysRatesScreenProps {
  onBack: () => void;
}

const RATES_DATA = [
  {
    id: 'pcb',
    titleKey: 'rate_pcb',
    fallbackTitle: 'PCB',
    price: '₹340–370',
    unit: '/kg',
    trend: 'rising',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  },
  {
    id: 'cable',
    titleKey: 'rate_cable',
    fallbackTitle: 'Cable',
    price: '₹180–220',
    unit: '/kg',
    trend: 'stable',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  },
  {
    id: 'battery',
    titleKey: 'rate_battery',
    fallbackTitle: 'Battery',
    price: '₹60–90',
    unit: '/kg',
    trend: 'falling',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80',
  },
  {
    id: 'crt',
    titleKey: 'rate_crt',
    fallbackTitle: 'CRT Monitor',
    price: '₹15–25',
    unit: '/kg',
    trend: 'stable',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
  },
  {
    id: 'lcd',
    titleKey: 'rate_lcd',
    fallbackTitle: 'LCD Panel',
    price: '₹45–70',
    unit: '/kg',
    trend: 'rising',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
  },
  {
    id: 'motor',
    titleKey: 'rate_motor',
    fallbackTitle: 'Motor',
    price: '₹120–160',
    unit: '/kg',
    trend: 'stable',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80',
  },
  {
    id: 'magnet',
    titleKey: 'rate_magnet',
    fallbackTitle: 'Magnet Assembly',
    price: '₹200–240',
    unit: '/kg',
    trend: 'rising',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80',
  },
];

export function TodaysRatesScreen({ onBack }: TodaysRatesScreenProps) {
  const { t, speakText, isSpeaking, speakingId } = useLanguage();

  const getLocalizedTitle = (item: typeof RATES_DATA[0]) => {
    const localized = t(item.titleKey);
    return localized !== item.titleKey ? localized : item.fallbackTitle;
  };

  const overviewAudio = `${t('todays_rates_title')}. ${getLocalizedTitle(RATES_DATA[0])} ${RATES_DATA[0].price}. ${getLocalizedTitle(RATES_DATA[1])} ${RATES_DATA[1].price}. ${getLocalizedTitle(RATES_DATA[2])} ${RATES_DATA[2].price}.`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header
        title={t('todays_rates_title')}
        subtitle=""
        showBack
        onBack={onBack}
        pageAudioText={overviewAudio}
      />

      <div className="max-w-md mx-auto px-4 py-4 space-y-3">
        {RATES_DATA.map((item) => {
          const itemTitle = getLocalizedTitle(item);
          const isPlayingThisItem = isSpeaking && speakingId === `rate-${item.id}`;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
            >
              {/* Image & Title */}
              <div className="flex items-center gap-3.5">
                <img
                  src={item.image}
                  alt={itemTitle}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {itemTitle}
                  </h3>

                  {/* Trend Badge */}
                  <div className="flex items-center gap-1 mt-0.5">
                    {item.trend === 'rising' && (
                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>↑ {t('rising')}</span>
                      </span>
                    )}
                    {item.trend === 'stable' && (
                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>→ {t('stable')}</span>
                      </span>
                    )}
                    {item.trend === 'falling' && (
                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                        <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>↓ {t('falling')}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Audio Button */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-800 block leading-tight">
                    {item.price}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {t('per_kg')}
                  </span>
                </div>

                <button
                  onClick={() =>
                    speakText(`${itemTitle}, ${item.price} ${t('per_kg')}.`, `rate-${item.id}`)
                  }
                  className={`p-3 rounded-full border transition-all ${
                    isPlayingThisItem
                      ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title={t('read_aloud')}
                >
                  <Volume2 className="w-5 h-5 stroke-[2]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
