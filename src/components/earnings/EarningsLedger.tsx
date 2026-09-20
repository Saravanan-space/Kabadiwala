'use client';

import React, { useState } from 'react';
import { calculateEarnings, getStoredTransactions } from '../../services/transactionService';
import { Wallet } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export const EarningsLedger: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending'>('All');

  const stats = calculateEarnings();
  const txns = getStoredTransactions();

  const filteredTxns = txns.filter((t) => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Earnings Overview Card */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-xl text-slate-900">Earnings Ledger</h2>
              <p className="text-xs text-slate-500 font-medium">Total Revenue & Payment History</p>
            </div>
          </div>

          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
            {stats.completedCount} Payments Settled
          </span>
        </div>

        {/* Big Today's Earnings highlight */}
        <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Today's Total Revenue
          </span>
          <div className="text-4xl font-black text-blue-600 tracking-tight">
            ₹{stats.today.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Secondary stats grid */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs sm:text-sm">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold uppercase block">This Week</span>
            <span className="font-extrabold text-slate-900 text-base">₹{stats.thisWeek.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold uppercase block">This Month</span>
            <span className="font-extrabold text-slate-900 text-base">₹{stats.thisMonth.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-amber-600 font-bold uppercase block">Pending</span>
            <span className="font-extrabold text-amber-600 text-base">₹{stats.pending.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-lg text-slate-900">Recent Transactions</h3>

          <div className="flex items-center space-x-2">
            {(['All', 'Completed', 'Pending'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction list cards */}
        <div className="space-y-3">
          {filteredTxns.map((txn) => (
            <div
              key={txn.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between text-xs sm:text-sm space-x-4"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black ${
                    txn.status === 'Completed'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {txn.paymentMethod === 'UPI' ? 'UPI' : '₹'}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{txn.material}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                      {txn.paymentMethod}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {txn.recyclerName} • {txn.weightKg} kg
                  </div>
                  <div className="text-[11px] text-slate-400">{txn.date} at {txn.time}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base sm:text-lg font-black text-blue-600">
                  +₹{txn.amount.toLocaleString('en-IN')}
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-0.5 border ${
                    txn.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
