'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Target } from 'lucide-react';

export function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDismissed = sessionStorage.getItem('kabadiwala_demo_banner_dismissed');
      const params = new URLSearchParams(window.location.search);
      const isDemo = params.get('demo') === 'true';

      if (isDemo && !isDismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kabadiwala_demo_banner_dismissed', 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs sm:text-sm font-bold z-50 animate-in slide-in-from-top duration-200">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base sm:text-lg shrink-0">🎯</span>
          <span className="leading-snug">
            <strong className="font-extrabold text-amber-100">Demo Mode</strong> — Open this app in two tabs: Tab 1 as Collector, Tab 2 as Recycler, to demonstrate the quote-lock flow end to end.
          </span>
        </div>

        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center shrink-0 transition-colors"
          title="Dismiss Demo Banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
