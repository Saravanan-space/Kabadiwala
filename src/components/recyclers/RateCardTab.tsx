'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Edit2,
  Check,
  Volume2,
  Save,
  RotateCcw,
} from 'lucide-react';

export interface MaterialRateItem {
  id: string;
  titleKey: string;
  fallbackTitle: string;
  pricePerKg: number;
  marketRange: string;
  trend: 'rising' | 'stable' | 'falling';
  isActive: boolean;
  image: string;
}

const DEFAULT_RATES: MaterialRateItem[] = [
  {
    id: 'pcb',
    titleKey: 'rate_pcb',
    fallbackTitle: 'PCB Circuit Board',
    pricePerKg: 355,
    marketRange: '₹340–370/kg',
    trend: 'rising',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  },
  {
    id: 'cable',
    titleKey: 'rate_cable',
    fallbackTitle: 'Copper Cable',
    pricePerKg: 210,
    marketRange: '₹180–220/kg',
    trend: 'stable',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  },
  {
    id: 'battery',
    titleKey: 'rate_battery',
    fallbackTitle: 'Lithium Battery',
    pricePerKg: 85,
    marketRange: '₹60–90/kg',
    trend: 'falling',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80',
  },
  {
    id: 'crt',
    titleKey: 'rate_crt',
    fallbackTitle: 'CRT Monitor',
    pricePerKg: 22,
    marketRange: '₹15–25/kg',
    trend: 'stable',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
  },
  {
    id: 'lcd',
    titleKey: 'rate_lcd',
    fallbackTitle: 'LCD Panel',
    pricePerKg: 65,
    marketRange: '₹45–70/kg',
    trend: 'rising',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
  },
  {
    id: 'motor',
    titleKey: 'rate_motor',
    fallbackTitle: 'Copper Motor',
    pricePerKg: 145,
    marketRange: '₹120–160/kg',
    trend: 'stable',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80',
  },
  {
    id: 'magnet',
    titleKey: 'rate_magnet',
    fallbackTitle: 'Magnet Assembly',
    pricePerKg: 225,
    marketRange: '₹200–240/kg',
    trend: 'rising',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80',
  },
];

interface RateCardTabProps {
  onRatesUpdated?: (rates: MaterialRateItem[]) => void;
}

export function RateCardTab({ onRatesUpdated }: RateCardTabProps) {
  const { t, speakText, isSpeaking, speakingId } = useLanguage();
  const [rates, setRates] = useState<MaterialRateItem[]>(DEFAULT_RATES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState<string>('');
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const getTitle = (item: MaterialRateItem) => {
    const localized = t(item.titleKey);
    return localized !== item.titleKey ? localized : item.fallbackTitle;
  };

  const handleStartEdit = (item: MaterialRateItem) => {
    setEditingId(item.id);
    setEditVal(String(item.pricePerKg));
  };

  const handleSaveRate = (id: string) => {
    const num = parseFloat(editVal);
    if (!isNaN(num) && num > 0) {
      const updated = rates.map((r) => (r.id === id ? { ...r, pricePerKg: num } : r));
      setRates(updated);
      if (onRatesUpdated) onRatesUpdated(updated);

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    }
    setEditingId(null);
  };

  const handleToggleActive = (id: string) => {
    const updated = rates.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r));
    setRates(updated);
    if (onRatesUpdated) onRatesUpdated(updated);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Top Banner Info */}
      <div className="bg-emerald-800 text-white rounded-3xl p-5 shadow-md flex items-center justify-between">
        <div>
          <h3 className="font-black text-lg tracking-tight">Material Rate Management</h3>
          <p className="text-emerald-100 text-xs mt-0.5 font-medium">
            Set your buying rates per kg. Updated rates immediately apply to incoming offers.
          </p>
        </div>
        {saveToast && (
          <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
            Rates Saved! ✨
          </div>
        )}
      </div>

      {/* Rates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rates.map((item) => {
          const itemTitle = getTitle(item);
          const isEditing = editingId === item.id;
          const isPlayingThis = isSpeaking && speakingId === `rate-${item.id}`;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                item.isActive
                  ? 'border-slate-200/90 shadow-sm hover:shadow-md'
                  : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Image & Title */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.image}
                    alt={itemTitle}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900 leading-snug">
                        {itemTitle}
                      </h4>
                      <button
                        onClick={() => handleToggleActive(item.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}
                      >
                        {item.isActive ? 'Buying ON' : 'Buying OFF'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Market Ref: <span className="text-slate-700 font-bold">{item.marketRange}</span>
                    </p>
                  </div>
                </div>

                {/* Rate Input or Display */}
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 bg-emerald-50 p-1.5 rounded-2xl border border-emerald-300">
                      <span className="text-sm font-bold text-emerald-900 pl-1">₹</span>
                      <input
                        type="number"
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        className="w-20 bg-white border border-emerald-400 rounded-xl px-2 py-1 font-extrabold text-slate-900 text-sm focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRate(item.id)}
                        className="p-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95 transition-all"
                        title="Save Rate"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-800 block leading-tight">
                        ₹{item.pricePerKg}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {t('per_kg')}
                      </span>
                    </div>
                  )}

                  {/* Edit Button */}
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
                      title={t('update_rate_btn')}
                    >
                      <Edit2 className="w-4 h-4 stroke-[2]" />
                    </button>
                  )}

                  {/* Sound icon button */}
                  <button
                    onClick={() =>
                      speakText(`${itemTitle}, rate ₹${item.pricePerKg} per kg.`, `rate-${item.id}`)
                    }
                    className={`p-2.5 rounded-full border transition-all ${
                      isPlayingThis
                        ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title={t('read_aloud')}
                  >
                    <Volume2 className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
