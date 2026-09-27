'use client';

import React from 'react';
import {
  EPRInvoiceData,
  buildEPRInvoiceDataFromLot,
  generateEPRInvoicePDF,
} from '../../services/eprPdfService';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building2,
  User,
} from 'lucide-react';

interface EPRInvoiceModalProps {
  lot: any;
  onClose: () => void;
}

export const EPRInvoiceModal: React.FC<EPRInvoiceModalProps> = ({ lot, onClose }) => {
  if (!lot) return null;

  const invoiceData: EPRInvoiceData = buildEPRInvoiceDataFromLot(lot);

  const handleDownloadPDF = async () => {
    await generateEPRInvoicePDF(invoiceData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white border border-slate-300 w-full max-w-4xl rounded-2xl max-h-[94vh] overflow-y-auto shadow-2xl text-slate-900 flex flex-col">
        {/* Top Control Bar */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 text-slate-300 shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 truncate">
                Form 6: Statutory E-Waste Manifest & EPR Recycling Certificate
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Manifest Ref: {invoiceData.invoiceNumber} | Lot: {invoiceData.lotId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formal Report Sheet (A4 Proportionate Preview) */}
        <div className="p-6 sm:p-10 space-y-5 bg-white text-slate-900 border-x border-b border-slate-200">
          {/* Document Header */}
          <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
            <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-slate-950">
              KABADIWALA CIRCULAR RECOVERY & RECYCLING NETWORK
            </h2>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 uppercase">
              FORM 6: E-WASTE MANIFEST, EPR DISPOSAL & RECYCLING CERTIFICATE
            </h1>
            <p className="text-[11px] text-slate-600 font-serif italic">
              [Prescribed under Rule 19(1) of E-Waste (Management) Rules, 2022 | Ministry of Environment, Forest and Climate Change, Govt. of India]
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-slate-400 bg-slate-50/70 divide-x divide-y sm:divide-y-0 divide-slate-300 text-xs">
            <div className="p-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Invoice / Manifest No.</span>
              <span className="font-mono font-bold text-slate-900">{invoiceData.invoiceNumber}</span>
            </div>
            <div className="p-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Date of Issue</span>
              <span className="font-semibold text-slate-900">{invoiceData.issueDate}</span>
            </div>
            <div className="p-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">CPCB EPR Auth Ref</span>
              <span className="font-mono text-[11px] font-bold text-slate-900 truncate block">
                {invoiceData.recycler.cpcbAuthNumber}
              </span>
            </div>
            <div className="p-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Digital Lot UID</span>
              <span className="font-mono font-bold text-slate-900">{invoiceData.lotId}</span>
            </div>
          </div>

          {/* Section 1, 2 & Photographic Evidence Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 border border-slate-400 divide-y md:divide-y-0 md:divide-x divide-slate-300 text-xs">
            {/* Section 1: Consignor */}
            <div className="md:col-span-4 p-3.5 space-y-1 bg-white">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1">
                SECTION 1: CONSIGNOR (SELLER)
              </span>
              <p className="font-bold text-slate-900 text-sm">{invoiceData.seller.name}</p>
              <p className="text-slate-600">Seller Ref: <span className="font-mono font-bold">{invoiceData.seller.sellerId}</span></p>
              <p className="text-slate-600">Contact: {invoiceData.seller.phone}</p>
              <p className="text-slate-600">Location: {invoiceData.seller.pickupAddress}</p>
              <p className="text-slate-600 capitalize">
                Logistics: {invoiceData.seller.pickupType === 'home' ? 'Doorstep Pickup' : invoiceData.seller.pickupType === 'self' ? 'Direct Center Drop' : 'Mutual Logistics'}
              </p>
            </div>

            {/* Section 2: Consignee */}
            <div className="md:col-span-5 p-3.5 space-y-1 bg-white">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1">
                SECTION 2: CONSIGNEE (RECYCLER)
              </span>
              <p className="font-bold text-slate-900 text-sm">{invoiceData.recycler.name}</p>
              <p className="text-slate-600">{invoiceData.recycler.facilityType}</p>
              <p className="text-slate-600">GSTIN: <span className="font-mono font-bold">{invoiceData.recycler.gstin}</span> | SPCB: {invoiceData.recycler.spcbConsentNumber}</p>
              <p className="text-slate-600">Facility: {invoiceData.recycler.address}</p>
              <p className="text-slate-600">Contact: {invoiceData.recycler.contactPhone}</p>
            </div>

            {/* Photographic Evidence Box */}
            <div className="md:col-span-3 p-3 bg-slate-50 flex flex-col items-center justify-between text-center space-y-1.5">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-700 block w-full border-b border-slate-200 pb-1">
                PHOTOGRAPHIC EVIDENCE
              </span>
              <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-300 bg-slate-200 flex items-center justify-center">
                <img
                  src={invoiceData.uploadedImageUrl || '/demo-scrap.jpg'}
                  alt="E-Waste Lot Reference Scan"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold text-emerald-800">
                AI Verified Inspection Scan
              </span>
            </div>
          </div>

          {/* Section 3: Itemized Inventory Table */}
          <div className="space-y-1.5">
            <div className="bg-slate-100 border border-slate-400 px-3 py-1.5 font-bold text-[11px] uppercase tracking-wider text-slate-900">
              SECTION 3: ITEM-WISE E-WASTE PHYSICAL AUDIT & PURCHASE VALUATION SCHEDULE
            </div>

            <div className="overflow-x-auto border border-slate-400">
              <table className="w-full text-left text-xs border-collapse divide-y divide-slate-300">
                <thead className="bg-slate-100 text-slate-900 font-bold text-[11px]">
                  <tr className="divide-x divide-slate-300">
                    <th className="py-2 px-3 w-10 text-center">S.No.</th>
                    <th className="py-2 px-3">Material Description</th>
                    <th className="py-2 px-3 w-28">Category (Sch-I)</th>
                    <th className="py-2 px-3 w-20">HSN Code</th>
                    <th className="py-2 px-3 w-24 text-right">Weight (kg)</th>
                    <th className="py-2 px-3 w-24 text-right">Rate (INR/kg)</th>
                    <th className="py-2 px-3 w-24 text-right">EPR Credit</th>
                    <th className="py-2 px-3 w-28 text-right">Value (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-normal text-slate-800">
                  {invoiceData.items.map((item) => (
                    <tr key={item.itemNo} className="divide-x divide-slate-200 hover:bg-slate-50">
                      <td className="py-2 px-3 text-center font-bold text-slate-500">{item.itemNo}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{item.description}</td>
                      <td className="py-2 px-3 font-mono text-[11px]">{item.eWasteCategory}</td>
                      <td className="py-2 px-3 font-mono text-[11px]">{item.hsnCode}</td>
                      <td className="py-2 px-3 text-right font-medium">{item.weightKg.toFixed(1)}</td>
                      <td className="py-2 px-3 text-right font-mono">{item.ratePerKg.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-medium">{item.eprCreditsKg.toFixed(1)} kg</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-950">
                        {item.amount.toLocaleString('en-IN')}.00
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 border-t-2 border-slate-400 font-bold text-slate-900 divide-x divide-slate-300 text-xs">
                  <tr>
                    <td colSpan={4} className="py-2.5 px-3 uppercase tracking-wider">
                      TOTAL RECYCLED BATCH QUANTITY & PURCHASE VALUE:
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      {invoiceData.totalWeightKg.toFixed(1)} kg
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 text-[10px]">—</td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      {invoiceData.totalWeightKg.toFixed(1)} kg
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-sm text-slate-950">
                      INR {invoiceData.totalGrossAmount.toLocaleString('en-IN')}.00
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Section 4 & 5: Settlement & Environmental Mass Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border border-slate-400 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 text-xs">
            {/* Section 4: Settlement */}
            <div className="p-3.5 space-y-1.5 bg-white">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1">
                SECTION 4: PAYMENT & DISBURSEMENT SETTLEMENT
              </span>
              <div className="flex justify-between text-slate-700">
                <span>Total Purchase Amount:</span>
                <span className="font-mono font-bold text-slate-900">INR {invoiceData.totalGrossAmount.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Purchase Compliance:</span>
                <span className="font-semibold text-slate-900">Statutory E-Waste Acquisition</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Payment Channel:</span>
                <span className="font-medium text-slate-900">{invoiceData.paymentMode}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Bank UTR Reference:</span>
                <span className="font-mono text-slate-900 font-bold">{invoiceData.paymentTxnRef}</span>
              </div>
              <div className="pt-1 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                <span>Settlement Status:</span>
                <span className="text-emerald-800 uppercase font-black">FULLY SETTLED & DISBURSED</span>
              </div>
            </div>

            {/* Section 5: Environmental Record */}
            <div className="p-3.5 space-y-1.5 bg-white">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1">
                SECTION 5: QUANTIFIED ENVIRONMENTAL IMPACT RECORD
              </span>
              <div className="flex justify-between text-slate-700">
                <span>1. GHG Emissions Avoided:</span>
                <span className="font-bold text-slate-900">{invoiceData.environmentalImpact.co2SavedKg} kg CO₂ eq</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>2. Heavy Metals Diverted (Pb/Cd):</span>
                <span className="font-bold text-slate-900">{invoiceData.environmentalImpact.leadDivertedGrams} g</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>3. Strategic Secondary Metals Recovered:</span>
                <span className="font-bold text-slate-900">{invoiceData.environmentalImpact.copperRecoveredKg} kg</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>4. Landfill Divergence Factor:</span>
                <span className="font-bold text-slate-900">{invoiceData.environmentalImpact.landfillDivertedKg} kg (100% Channelized)</span>
              </div>
            </div>
          </div>

          {/* Section 6: Statutory Undertaking */}
          <div className="border border-slate-400 p-3 bg-slate-50 text-xs space-y-1">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900 block">
              SECTION 6: STATUTORY UNDERTAKING & RECYCLER CERTIFICATION
            </span>
            <p className="text-[11px] leading-relaxed text-slate-700">
              We hereby certify that the electronic waste items detailed herein have been physically received, weighed, and verified in accordance with the provisions of the E-Waste (Management) Rules, 2022. The material shall be scientifically dismantled and recycled with environmentally sound management practices at our CPCB/SPCB authorized facility without illegal dumping or uncontrolled open burning.
            </p>
            <p className="font-mono text-[10px] text-slate-500 pt-1">
              SHA-256 Verification Hash: {invoiceData.verificationHash}
            </p>
          </div>

          {/* Section 7: Dual Signature Blocks */}
          <div className="grid grid-cols-2 border border-slate-400 divide-x divide-slate-300 text-xs p-4 bg-white">
            <div className="space-y-6">
              <span className="font-bold text-[10px] text-slate-500 uppercase block">Signature of Consignor / Seller</span>
              <div>
                <p className="font-bold text-slate-900 text-xs">{invoiceData.seller.name}</p>
                <p className="text-[10px] text-slate-500">Digital KYC Confirmed: {invoiceData.issueDate}</p>
              </div>
            </div>

            <div className="pl-4 space-y-6">
              <span className="font-bold text-[10px] text-slate-500 uppercase block">For Authorized Recycler (Consignee)</span>
              <div>
                <p className="font-bold text-slate-900 text-xs">{invoiceData.recycler.authorizedSignatory}</p>
                <p className="text-[10px] font-bold text-slate-700">[Authorized Signatory & CPCB Registered Seal: {invoiceData.recycler.name}]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-600 font-medium">
            Generated by Kabadiwala Statutory E-Waste Framework. Clean formal report format.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
