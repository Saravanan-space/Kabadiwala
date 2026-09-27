'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../common/Header';
import {
  User,
  CheckCircle2,
  DollarSign,
  Wallet,
  Smartphone,
  Banknote,
  QrCode,
} from 'lucide-react';

import { StatusConfirmationModal } from '../common/StatusConfirmationModal';

interface VerifyHandoverScreenProps {
  onBack: () => void;
  onHandoverComplete: () => void;
  lotId?: string;
  yourWeight?: number;
  verifiedWeight?: number;
  finalPricePerKg?: number;
}

export function VerifyHandoverScreen({
  onBack,
  onHandoverComplete,
  lotId = 'KBD-1042',
  yourWeight = 0.5,
  verifiedWeight = 7.8,
  finalPricePerKg = 210,
}: VerifyHandoverScreenProps) {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<'digital' | 'cash'>('digital');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const totalAmount = Math.round(verifiedWeight * finalPricePerKg); // 7.8 * 210 = 1638

  const handleConfirm = () => {
    setShowStatusModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Header
        title={t('verify_handover_title')}
        subtitle=""
        showBack
        onBack={onBack}
        pageAudioText={`${t('verify_handover_title')}. Lot ID ${lotId}. Verified weight ${verifiedWeight} kg. Total amount ₹${totalAmount}.`}
      />

      <div className="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: QR Code Card */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center flex flex-col items-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Scan at Collection Point
            </span>

            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-inner flex items-center justify-center">
              {/* SVG QR Code Simulation */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 bg-slate-900 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-12 h-12 border-4 border-white bg-slate-900 rounded-md p-1">
                    <div className="w-full h-full bg-white rounded-xs" />
                  </div>
                  <div className="w-12 h-12 border-4 border-white bg-slate-900 rounded-md p-1">
                    <div className="w-full h-full bg-white rounded-xs" />
                  </div>
                </div>
                <div className="flex items-center justify-center text-white">
                  <QrCode className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="flex justify-between">
                  <div className="w-12 h-12 border-4 border-white bg-slate-900 rounded-md p-1">
                    <div className="w-full h-full bg-white rounded-xs" />
                  </div>
                  <div className="w-8 h-8 bg-white rounded-md" />
                </div>
              </div>
            </div>

            <span className="text-lg font-bold text-slate-900 font-mono">
              {t('lot_id_label')}: {lotId}
            </span>
          </div>

          {/* Right Column: Verification Summary & Payment */}
          <div className="md:col-span-7 space-y-5">
            {/* Verification Summary Breakdown Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Handover Verification Breakdown
              </h3>

              {/* Your Weight */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-600 font-semibold text-sm">
                  <User className="w-5 h-5 text-slate-400" />
                  <span>{t('your_weight')}</span>
                </div>
                <span className="text-base font-bold text-slate-900">
                  {yourWeight} kg
                </span>
              </div>

              {/* Verified Weight */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-600 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{t('verified_weight')}</span>
                </div>
                <span className="text-base font-extrabold text-emerald-700">
                  {verifiedWeight} kg
                </span>
              </div>

              {/* Final Price */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-600 font-semibold text-sm">
                  <DollarSign className="w-5 h-5 text-slate-400" />
                  <span>{t('final_price')}</span>
                </div>
                <span className="text-base font-bold text-slate-900">
                  ₹{finalPricePerKg} / kg
                </span>
              </div>

              {/* Total Amount */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5 text-slate-700 font-bold text-base">
                  <Wallet className="w-6 h-6 text-emerald-700" />
                  <span>{t('total_amount')}</span>
                </div>
                <span className="text-3xl font-black text-emerald-700">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                {t('payment_method')}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {/* Digital Pay */}
                <button
                  onClick={() => setPaymentMethod('digital')}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all ${
                    paymentMethod === 'digital'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                  <span>{t('digital_pay')}</span>
                </button>

                {/* Cash */}
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-slate-600" />
                  <span>{t('cash_pay')}</span>
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-6 h-6 text-white" />
              <span>{t('confirm_handover_btn')}</span>
            </button>

            {/* Force User OK Status Popup Modal */}
            <StatusConfirmationModal
              isOpen={showStatusModal}
              title="Handover Confirmed & Payout Settled"
              subtitle="The digital scale weighing and physical handover have been verified. Payment has been processed."
              type="success"
              details={[
                { label: 'Lot Identifier', value: lotId },
                { label: 'Verified Scale Weight', value: `${verifiedWeight} kg` },
                { label: 'Settlement Rate', value: `₹${finalPricePerKg} / kg` },
                { label: 'Total Payout Amount', value: `₹${totalAmount.toLocaleString('en-IN')}` },
                { label: 'Payment Channel', value: paymentMethod === 'digital' ? 'Digital Pay (Instant UPI)' : 'Cash on Handover' },
              ]}
              buttonText="OK, View Updated Status"
              onConfirm={() => {
                setShowStatusModal(false);
                onHandoverComplete();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
