'use client';

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

interface OfflineBannerProps {
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline, onToggleOffline }) => {
  const { t } = useTranslation();

  if (!isOffline) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs font-semibold">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4 text-amber-200 animate-bounce" />
        <div>
          <span className="font-bold">{t('offlineMode')}: </span>
          <span>Viewing cached market rates & lots. AI Scanner requires connectivity.</span>
        </div>
      </div>
      <button
        onClick={onToggleOffline}
        className="bg-amber-900/50 hover:bg-amber-900 text-amber-100 px-2.5 py-1 rounded-md border border-amber-400/30 flex items-center space-x-1"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Reconnect</span>
      </button>
    </div>
  );
};
