'use client';

import React from 'react';
import { Recycler } from '../../types/recycler';
import { ShieldCheck, MapPin, Truck, Star, ArrowRight } from 'lucide-react';

interface RecyclerCardProps {
  recycler: Recycler;
  onSelect: (recycler: Recycler) => void;
  onViewDetails: (recycler: Recycler) => void;
}

export const RecyclerCard: React.FC<RecyclerCardProps> = ({
  recycler,
  onSelect,
  onViewDetails,
}) => {
  return (
    <div className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 shadow-sm space-y-4 transition-all">
      {/* Title & Authorization Badge */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">{recycler.name}</h3>
          <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium mt-1">
            <span className="flex items-center text-blue-600 font-bold">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {recycler.distanceKm} km away
            </span>
            <span>•</span>
            <span className="flex items-center text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 mr-1 fill-amber-500" />
              {recycler.rating}
            </span>
          </div>
        </div>

        {recycler.isAuthorized && (
          <div className="bg-emerald-50 text-emerald-700 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized</span>
          </div>
        )}
      </div>

      {/* Facility address & Registration */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
        <p className="text-slate-700 font-medium">{recycler.address}</p>
        <p className="text-[10px] text-slate-400 font-mono">CPCB Reg: {recycler.regNumber}</p>
      </div>

      {/* Accepted materials pills */}
      <div>
        <span className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
          Accepted Materials:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {recycler.acceptedMaterials.map((mat, i) => (
            <span
              key={i}
              className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200"
            >
              {mat}
            </span>
          ))}
        </div>
      </div>

      {/* Pickup status & Offer */}
      <div className="flex items-center justify-between text-xs bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
        <span className="flex items-center text-blue-700 font-bold">
          <Truck className="w-4 h-4 mr-1.5 text-blue-600" />
          {recycler.pickupAvailable ? 'Pickup Available Today' : 'Self Drop-off'}
        </span>
        <span className="text-slate-700 font-bold">
          Top Offer: <span className="text-blue-600 font-black text-sm">₹335/kg</span>
        </span>
      </div>

      {/* Action Blue Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => onViewDetails(recycler)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center border border-slate-300"
        >
          Facility Details
        </button>

        <button
          onClick={() => onSelect(recycler)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          <span>Select Recycler</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
