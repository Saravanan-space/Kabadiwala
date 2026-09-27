'use client';

import React from 'react';
import { WasteLot } from '../../types/lot';
import { ChevronRight, Calendar, MapPin, Package, Lock } from 'lucide-react';

interface LotCardProps {
  lot: WasteLot;
  onSelect: (lot: WasteLot) => void;
}

export const LotCard: React.FC<LotCardProps> = ({ lot, onSelect }) => {
  const getStatusBadge = () => {
    switch (lot.status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Quote Locked':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Quote Declined':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Payment Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Handed Over':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Recycler Selected':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const primaryItem = lot.items[0] || { material: 'E-Waste Scrap', weightKg: lot.totalWeightKg };
  const totalDisplayVal = lot.quotedTotal || lot.totalEstimatedValue || 0;

  return (
    <div
      onClick={() => onSelect(lot)}
      className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-sm transition-all cursor-pointer space-y-4 group"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
              {lot.id}
            </h4>
            <span className="text-xs text-slate-500 flex items-center space-x-1 font-medium mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{lot.createdAt}</span>
            </span>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${getStatusBadge()}`}>
          {lot.status === 'Quote Locked' ? (
            <>
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Quote Locked · ₹{totalDisplayVal.toLocaleString('en-IN')}</span>
            </>
          ) : lot.status === 'Quote Declined' ? (
            <span>Quote Declined — Finding New Recycler</span>
          ) : (
            <span>{lot.status}</span>
          )}
        </span>
      </div>



      <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm">
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Material</span>
          <span className="font-extrabold text-slate-900 truncate block">{primaryItem.material}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Weight</span>
          <span className="font-extrabold text-slate-800">{lot.totalWeightKg} kg</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Value</span>
          <span className="font-black text-blue-600">₹{lot.totalEstimatedValue.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-500 font-medium">
        <span className="flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>{lot.location}</span>
        </span>
        <span className="text-blue-600 font-bold flex items-center group-hover:translate-x-1 transition-transform">
          <span>View Details</span>
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </span>
      </div>
    </div>
  );
};
