'use client';

import React, { useState } from 'react';
import { INITIAL_PRICES } from '../../services/priceService';
import { Search, TrendingUp, TrendingDown, Minus, Clock, Tag, Info } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export const PriceBoard: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Electronics', 'Metals', 'Batteries', 'Display', 'Motors'];

  const filteredPrices = INITIAL_PRICES.filter((item) => {
    const matchesSearch = item.material.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-xl text-slate-900">E-Waste Price Board</h2>
              <p className="text-xs text-slate-500 font-medium">Fair Market Rates & Transparency</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Last Updated</span>
            <span className="text-xs font-extrabold text-blue-600 flex items-center justify-end">
              <Clock className="w-3.5 h-3.5 mr-1" />
              Today, 6:00 PM
            </span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search material (PCB, Copper, Battery)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm rounded-xl py-3 pl-10 pr-4 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price Cards List */}
      <div className="space-y-4">
        {filteredPrices.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 shadow-sm space-y-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{item.material}</h3>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {item.category}
                  </span>
                </div>

                {/* Trend Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center space-x-1 border ${
                    item.trend === 'up'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.trend === 'down'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.trend === 'up' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>↑ High Demand</span>
                    </>
                  ) : item.trend === 'down' ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span>↓ Soft Market</span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4 text-slate-500" />
                      <span>→ Stable</span>
                    </>
                  )}
                </div>
              </div>

              {/* Price Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">Your Best Rate</span>
                  <span className="text-2xl font-black text-blue-600">
                    ₹{item.price_per_kg} <span className="text-xs font-normal text-slate-500">/kg</span>
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block">Market Range</span>
                  <span className="text-base font-extrabold text-slate-900">
                    ₹{item.market_min} – ₹{item.market_max} /kg
                  </span>
                </div>
              </div>

              {/* Description & Safety Note */}
              <p className="text-xs sm:text-sm text-slate-600 font-medium">{item.description}</p>
              {item.safetyNote && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center space-x-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{item.safetyNote}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
