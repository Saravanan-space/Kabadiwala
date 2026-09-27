'use client';

import React, { useState } from 'react';
import {
  Database,
  Download,
  Table,
  Layers,
  Sparkles,
  TrendingUp,
  Building2,
  Users,
  Cpu,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

interface DatasetMeta {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  schemaCount: string;
  headers: string[];
  rows: (string | number | boolean)[][];
}

export function DatasetsTab() {
  const [activeDatasetId, setActiveDatasetId] = useState<string>('all');

  const downloadCSV = (filename: string, headers: string[], rows: (string | number | boolean)[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((val) => {
            const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
            if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
              return `"${strVal.replace(/"/g, '""')}"`;
            }
            return strVal;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const datasets: DatasetMeta[] = [
    {
      id: 'material_dataset',
      title: '1. Material Dataset',
      icon: Layers,
      description: 'Physical & chemical taxonomy of electronic waste, hazard classification, critical mineral contents, and EPR applicability.',
      schemaCount: '6 Columns • 5 Sample Records',
      headers: [
        'material_id',
        'category',
        'subcategory',
        'hazard_level',
        'critical_mineral_content',
        'epr_applicable',
      ],
      rows: [
        ['MAT-001', 'Circuit Boards', 'High-Grade Server PCB', 'medium', 'Ta/Au/Cu', true],
        ['MAT-002', 'Batteries', 'Lithium-Ion EV/Laptop Cells', 'high', 'Li/Co/Ni', true],
        ['MAT-003', 'Cables & Wires', 'Insulated Copper Wires', 'low', 'Cu', true],
        ['MAT-004', 'Displays', 'LCD/OLED Backlit Panels', 'medium', 'In/Ga', true],
        ['MAT-005', 'Motors & Magnets', 'Neodymium Hard Drive Motors', 'low', 'Nd/Dy/Fe', true],
      ],
    },
    {
      id: 'price_dataset',
      title: '2. Price Dataset',
      icon: TrendingUp,
      description: 'District-level time-series scrap market buying rates, sample transaction volume counts, and weekly trend directions.',
      schemaCount: '8 Columns • 5 Sample Records',
      headers: [
        'price_id',
        'material_category',
        'district',
        'rate_inr_per_kg',
        'sample_count',
        'week_start_date',
        'trend_direction',
        'data_source',
      ],
      rows: [
        ['PRC-101', 'Printed Circuit Boards (PCB)', 'Mumbai Suburban', 370.0, 142, '2026-09-21', 'up', 'transaction'],
        ['PRC-102', 'Copper Cables & Wires', 'Bengaluru Urban', 240.0, 89, '2026-09-21', 'stable', 'transaction'],
        ['PRC-103', 'Lithium Battery Packs', 'Pune', 90.0, 64, '2026-09-21', 'up', 'transaction'],
        ['PRC-104', 'Smartphones & Mobiles', 'Hyderabad', 480.0, 115, '2026-09-21', 'down', 'seed'],
        ['PRC-105', 'Laptop Computers', 'Delhi NCR', 530.0, 73, '2026-09-21', 'up', 'transaction'],
      ],
    },
    {
      id: 'recycler_dataset',
      title: '3. Recycler Dataset',
      icon: Building2,
      description: 'Directory of State Pollution Control Board (SPCB/MPCB) & CPCB authorized recyclers, facility GPS, and processing authorization.',
      schemaCount: '10 Columns • 4 Sample Records',
      headers: [
        'recycler_id',
        'facility_name',
        'mpcb_license',
        'cpcb_registration',
        'district',
        'state',
        'accepted_categories',
        'latitude',
        'longitude',
        'authorization_status',
      ],
      rows: [
        ['REC-01', 'GreenCycle Recycling Pvt Ltd', 'MPCB/BO/RO-MUM/E-WASTE/089', 'CPCB-REG-2024-MH-0112', 'Mumbai Suburban', 'Maharashtra', 'PCB, Batteries, IT Scrap', 19.1136, 72.8697, 'Authorized Active'],
        ['REC-02', 'EcoTech E-Waste Recyclers', 'KSPCB/EW/BNG-R/2023-45', 'CPCB-REG-2023-KA-0087', 'Bengaluru Urban', 'Karnataka', 'All E-Waste, Cables, Displays', 12.9716, 77.5946, 'Authorized Active'],
        ['REC-03', 'MahaScrap Formal Dismantlers', 'MPCB/PUNE/EW/2025/11', 'CPCB-REG-2025-MH-0439', 'Pune', 'Maharashtra', 'PCBs, Motors, Telecom Scrap', 18.5204, 73.8567, 'Authorized Active'],
        ['REC-04', 'Telangana Green Ventures', 'TSPCB/HYD/EW-AUTH-902', 'CPCB-REG-2024-TS-0205', 'Hyderabad', 'Telangana', 'Lithium Cells, Laptops, Mobile', 17.385, 78.4867, 'Authorized Active'],
      ],
    },
    {
      id: 'transaction_traceability_dataset',
      title: '4. Transaction & Traceability Dataset',
      icon: Table,
      description: 'End-to-end chain of custody log with GPS geostamps, dual weight verification, payout, and statutory Form 6 manifest numbers.',
      schemaCount: '14 Columns • 4 Sample Records',
      headers: [
        'transaction_id',
        'lot_id',
        'collector_id',
        'recycler_id',
        'material_category',
        'declared_weight_kg',
        'verified_weight_kg',
        'rate_per_kg',
        'total_inr',
        'handover_photo_hash',
        'gps_lat',
        'gps_lng',
        'timestamp',
        'form6_reference',
      ],
      rows: [
        ['TXN-8801', 'KBD-1041', 'COL-042', 'REC-01', 'PCB (Circuit Board)', 12.0, 12.0, 355, 4260, '0x9f8b2c114e', 19.1136, 72.8697, '2026-09-26T14:32:00Z', 'FORM6-MH-2026-0041'],
        ['TXN-8802', 'KBD-1039', 'COL-019', 'REC-01', 'Copper Cables & Power Adapters', 8.4, 8.2, 220, 1804, '0x4a7e3d881c', 19.1205, 72.8542, '2026-09-25T11:15:00Z', 'FORM6-MH-2026-0039'],
        ['TXN-8803', 'KBD-1038', 'COL-088', 'REC-03', 'Lithium Battery Packs', 15.0, 14.8, 95, 1406, '0x1b2c3d4e5f', 18.5312, 73.8445, '2026-09-24T16:45:00Z', 'FORM6-MH-2026-0038'],
        ['TXN-8804', 'KBD-1037', 'COL-031', 'REC-02', 'Laptop Computers', 6.2, 6.2, 520, 3224, '0x7e8f9a0b1c', 12.981, 77.602, '2026-09-24T09:20:00Z', 'FORM6-KA-2026-0037'],
      ],
    },
    {
      id: 'collector_dataset',
      title: '5. Collector Dataset',
      icon: Users,
      description: 'Aggregator & informal collector registry with demographic location, preferred vernacular language, volume metrics, and cumulative earnings.',
      schemaCount: '9 Columns • 4 Sample Records',
      headers: [
        'collector_id',
        'name',
        'district',
        'preferred_language',
        'phone_hash',
        'registration_date',
        'total_lots',
        'total_kg_recycled',
        'total_earnings_inr',
      ],
      rows: [
        ['COL-042', 'Rameshwar Shinde', 'Mumbai Suburban', 'mr', '0x8a92...41bc', '2026-01-15', 34, 428.5, 96450],
        ['COL-019', 'Sunil Kumar Meena', 'Bengaluru Urban', 'kn', '0x3f11...99ef', '2026-02-01', 21, 265.0, 58200],
        ['COL-088', 'Dinesh Solanki', 'Pune', 'hi', '0x7b44...12aa', '2026-02-18', 48, 612.0, 134800],
        ['COL-031', 'Anand R. Verma', 'Delhi NCR', 'hi', '0x2e08...74cd', '2026-03-05', 16, 189.4, 41650],
      ],
    },
    {
      id: 'ml_training_dataset',

      title: '6. ML Training Dataset',
      icon: Cpu,
      description: 'Computer vision training data records containing YOLO inference predictions, human-in-the-loop corrections, and feedback loops.',
      schemaCount: '9 Columns • 4 Sample Records',
      headers: [
        'image_id',
        'lot_id',
        'image_hash',
        'detected_labels',
        'collector_corrections',
        'final_labels',
        'confidence_scores',
        'correction_source',
        'timestamp',
      ],
      rows: [
        ['IMG-901', 'KBD-1042', 'hash_8f902a', '["cable","mouse"]', '[]', '["Copper Cable","Optical Mouse"]', '[0.95,0.92]', 'auto', '2026-09-27T08:12:00Z'],
        ['IMG-902', 'KBD-1041', 'hash_3b29c1', '["pcb","battery"]', '["added:smartphone"]', '["PCB","Lithium Battery","Smartphone"]', '[0.98,0.89,0.91]', 'collector', '2026-09-26T14:10:00Z'],
        ['IMG-903', 'KBD-1040', 'hash_118da4', '["keyboard"]', '[]', '["Computer Keyboard"]', '[0.97]', 'auto', '2026-09-25T17:40:00Z'],
        ['IMG-904', 'KBD-1039', 'hash_55e2d9', '["monitor","laptop"]', '["rate_override:laptop"]', '["Display Panel","Laptop"]', '[0.94,0.96]', 'recycler', '2026-09-25T10:05:00Z'],
      ],
    },
  ];

  const visibleDatasets =
    activeDatasetId === 'all'
      ? datasets
      : datasets.filter((ds) => ds.id === activeDatasetId);

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-sm">
            <Database className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">E-Waste System Datasets</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                6 Standard Schemas
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Structured relational schemas & mock dataset exports for Indian e-waste formalization.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            datasets.forEach((ds) => {
              downloadCSV(ds.id, ds.headers, ds.rows);
            });
          }}
          className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export All CSVs</span>
        </button>
      </div>

      {/* Dataset Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveDatasetId('all')}
          className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            activeDatasetId === 'all'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          All 6 Datasets
        </button>

        {datasets.map((ds) => (
          <button
            key={ds.id}
            onClick={() => setActiveDatasetId(ds.id)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeDatasetId === ds.id
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {ds.title.split('.')[1]?.trim() || ds.title}
          </button>
        ))}
      </div>

      {/* Datasets Container */}
      <div className="space-y-8">
        {visibleDatasets.map((dataset) => {
          const IconComp = dataset.icon;
          return (
            <div
              key={dataset.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 hover:border-emerald-500/40 transition-all"
            >
              {/* Table Header & Download Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {dataset.title}
                      </h3>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {dataset.schemaCount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {dataset.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => downloadCSV(dataset.id, dataset.headers, dataset.rows)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0 active:scale-95"
                  title="Download CSV"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Download CSV</span>
                </button>
              </div>

              {/* Table View */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/90 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      {dataset.headers.map((h) => (
                        <th key={h} className="px-3.5 py-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-800">
                    {dataset.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3.5 py-2.5 whitespace-nowrap">
                            {typeof cell === 'boolean' ? (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  cell
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {cell ? 'TRUE' : 'FALSE'}
                              </span>
                            ) : typeof cell === 'number' && dataset.headers[cIdx].includes('rate') ? (
                              <span className="font-bold text-emerald-800">₹{cell}</span>
                            ) : typeof cell === 'number' && dataset.headers[cIdx].includes('total_inr') ? (
                              <span className="font-black text-emerald-900">₹{cell.toLocaleString('en-IN')}</span>
                            ) : (
                              String(cell)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
