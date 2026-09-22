'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  DollarSign,
  Package,
  Search,
  Volume2,
  TrendingUp,
  Leaf,
  Trees,
} from 'lucide-react';

export interface HistoryRecord {
  id: string;
  lotId: string;
  material: string;
  weightKg: number;
  ratePerKg: number;
  totalPaid: number;
  paymentMethod: string;
  customerName: string;
  date: string;
  status: 'Completed';
}

const MOCK_HISTORY: HistoryRecord[] = [
  {
    id: 'tx-101',
    lotId: 'KBD-1042',
    material: 'Cable',
    weightKg: 7.8,
    ratePerKg: 210,
    totalPaid: 1638,
    paymentMethod: 'UPI',
    customerName: 'Raju Sharma',
    date: 'Today, 04:30 PM',
    status: 'Completed',
  },
  {
    id: 'tx-100',
    lotId: 'KBD-0988',
    material: 'PCB (Circuit Board)',
    weightKg: 12.0,
    ratePerKg: 355,
    totalPaid: 4260,
    paymentMethod: 'Cash',
    customerName: 'Anil Kumar',
    date: 'Yesterday, 11:15 AM',
    status: 'Completed',
  },
  {
    id: 'tx-099',
    lotId: 'KBD-0945',
    material: 'Lithium Battery',
    weightKg: 15.5,
    ratePerKg: 85,
    totalPaid: 1317,
    paymentMethod: 'UPI',
    customerName: 'Sanjay Gupta',
    date: '20 Sep 2026',
    status: 'Completed',
  },
  {
    id: 'tx-098',
    lotId: 'KBD-0912',
    material: 'CRT Monitor',
    weightKg: 45.0,
    ratePerKg: 22,
    totalPaid: 990,
    paymentMethod: 'UPI',
    customerName: 'Pooja Verma',
    date: '18 Sep 2026',
    status: 'Completed',
  },
];

export function HistoryTrackingTab() {
  const { t, speakText, isSpeaking, speakingId } = useLanguage();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const totalVolumeKg = MOCK_HISTORY.reduce((acc, curr) => acc + curr.weightKg, 0);
  const totalAmountPaid = MOCK_HISTORY.reduce((acc, curr) => acc + curr.totalPaid, 0);

  const filteredHistory = MOCK_HISTORY.filter(
    (item) =>
      item.lotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isPlayingSummary = isSpeaking && speakingId === 'history-summary-tts';

  return (
    <div className="space-y-4 font-sans">
      {/* Hero Summary Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-5 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" /> Recycler Performance & Tracking
          </span>

          <button
            onClick={() =>
              speakText(
                `Total purchased ${totalVolumeKg} kg. Total payout rupees ${totalAmountPaid}. Completed ${MOCK_HISTORY.length} lots.`,
                'history-summary-tts'
              )
            }
            className={`p-2 rounded-full border transition-all ${
              isPlayingSummary
                ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
            title={t('read_aloud')}
          >
            <Volume2 className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-emerald-700/50 pt-3">
          <div>
            <span className="text-xs text-emerald-200 font-semibold block">{t('total_purchased')}</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{totalVolumeKg} kg</span>
          </div>

          <div>
            <span className="text-xs text-emerald-200 font-semibold block">{t('total_spent')}</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-300">₹{totalAmountPaid.toLocaleString()}</span>
          </div>
        </div>

        {/* Environmental Impact metrics */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-white/10 rounded-2xl p-2.5 flex items-center gap-2 text-xs font-semibold">
            <Trees className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>52 Trees Saved</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2.5 flex items-center gap-2 text-xs font-semibold">
            <Leaf className="w-4 h-4 text-teal-300 shrink-0" />
            <span>128 kg CO2 Saved</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search history by Lot ID, material, or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* History Log List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
          Transaction Audit Log ({filteredHistory.length})
        </h3>

        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isPlayingItem = isSpeaking && speakingId === `hist-${item.id}`;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-base">{item.lotId}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  </div>

                  <span className="text-base font-black text-emerald-800">
                    ₹{item.totalPaid}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-xs font-semibold text-slate-600">
                  <div>
                    <span>Material: </span>
                    <span className="text-slate-900 font-bold">{item.material}</span>
                  </div>

                  <div>
                    <span>Weight: </span>
                    <span className="text-slate-900 font-bold">{item.weightKg} kg</span>
                  </div>

                  <div>
                    <span>Customer: </span>
                    <span className="text-slate-900 font-bold">{item.customerName}</span>
                  </div>

                  <div>
                    <span>Payment: </span>
                    <span className="text-slate-900 font-bold">{item.paymentMethod}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-100">
                  <span>{item.date}</span>

                  <button
                    onClick={() =>
                      speakText(
                        `Lot ${item.lotId}. ${item.material} ${item.weightKg} kg. Paid rupees ${item.totalPaid} via ${item.paymentMethod}.`,
                        `hist-${item.id}`
                      )
                    }
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      isPlayingItem ? 'text-emerald-700 animate-pulse' : 'text-slate-500 hover:text-emerald-700'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
