import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../common/Header';
import { analyzeWaste } from '../../services/aiService';
import { Detection } from '../../types/ai';
import {
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Truck,
  Building2,
  TrendingUp,
  PlusCircle,
  Calculator,
  Info,
  ChevronRight,
  Layers,
  Zap,
  Plus,
  Minus,
  Trash2,
  Package,
  ArrowLeftRight,
  MapPin,
} from 'lucide-react';
import { InteractiveGPSMapPicker } from '../map/InteractiveGPSMapPicker';
import { LocationCoordinate, DEFAULT_LOCATION } from '../../services/mapService';

interface SellMaterialFlowProps {
  onBackToHome: () => void;
  onLotCreated: (lotData: any) => void;
  onFindRecyclersForLot: (lotId: string) => void;
}

export interface ConfiguredMaterial {
  id: string;
  name: string;
  priceRange: string;
  offerPrice: number;
  image: string;
  weightKg: number;
  confidence?: number;
  bbox?: { x1: number; y1: number; x2: number; y2: number };
}

const MATERIAL_PRESETS = [
  { id: 'keyboard', name: 'Computer Keyboard', priceRange: '₹100–130/kg', offerPrice: 120, defaultWeight: 1.2, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80' },
  { id: 'smartphone', name: 'Smartphones & Mobile Devices', priceRange: '₹420–480/kg', offerPrice: 450, defaultWeight: 0.6, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
  { id: 'mouse', name: 'Optical Mouse', priceRange: '₹90–120/kg', offerPrice: 100, defaultWeight: 0.4, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80' },
  { id: 'cable', name: 'Copper Cables & Power Adapters', priceRange: '₹180–240/kg', offerPrice: 220, defaultWeight: 1.1, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80' },
  { id: 'camera', name: 'Digital Cameras', priceRange: '₹300–400/kg', offerPrice: 350, defaultWeight: 0.6, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80' },
  { id: 'calculator', name: 'Calculator & Power Bank', priceRange: '₹120–180/kg', offerPrice: 150, defaultWeight: 0.6, image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&q=80' },
  { id: 'monitor', name: 'Tablet Screen & Display Panels', priceRange: '₹70–100/kg', offerPrice: 80, defaultWeight: 1.5, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80' },
  { id: 'media', name: 'Floppy Disks / VHS Media', priceRange: '₹40–60/kg', offerPrice: 50, defaultWeight: 0.8, image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&q=80' },
  { id: 'laptop', name: 'Laptop Computers', priceRange: '₹500–550/kg', offerPrice: 520, defaultWeight: 2.2, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80' },
  { id: 'pcb', name: 'Printed Circuit Boards (PCB)', priceRange: '₹340–370/kg', offerPrice: 380, defaultWeight: 1.0, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
  { id: 'battery', name: 'Lithium Battery Packs', priceRange: '₹60–90/kg', offerPrice: 100, defaultWeight: 1.0, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80' },
  { id: 'motor', name: 'Copper Motors & Compressors', priceRange: '₹120–160/kg', offerPrice: 170, defaultWeight: 3.5, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80' },
];

// Color palette for detection bounding boxes
const BBOX_COLORS = [
  { border: 'border-emerald-500', bg: 'bg-emerald-500/20', badge: 'bg-emerald-600', text: 'text-emerald-700' },
  { border: 'border-blue-500', bg: 'bg-blue-500/20', badge: 'bg-blue-600', text: 'text-blue-700' },
  { border: 'border-purple-500', bg: 'bg-purple-500/20', badge: 'bg-purple-600', text: 'text-purple-700' },
  { border: 'border-amber-500', bg: 'bg-amber-500/20', badge: 'bg-amber-600', text: 'text-amber-700' },
  { border: 'border-rose-500', bg: 'bg-rose-500/20', badge: 'bg-rose-600', text: 'text-rose-700' },
  { border: 'border-cyan-500', bg: 'bg-cyan-500/20', badge: 'bg-cyan-600', text: 'text-cyan-700' },
  { border: 'border-indigo-500', bg: 'bg-indigo-500/20', badge: 'bg-indigo-600', text: 'text-indigo-700' },
  { border: 'border-teal-500', bg: 'bg-teal-500/20', badge: 'bg-teal-600', text: 'text-teal-700' },
];

export function SellMaterialFlow({
  onBackToHome,
  onLotCreated,
  onFindRecyclersForLot,
}: SellMaterialFlowProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiConfidencePercent, setAiConfidencePercent] = useState<number>(96);
  const [pickupType, setPickupType] = useState<'home' | 'self' | 'both'>('home');
  const [selectedGPSLocation, setSelectedGPSLocation] = useState<LocationCoordinate>(DEFAULT_LOCATION);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [createdLotId, setCreatedLotId] = useState<string>('KBD-1042');
  
  // Configured multiple materials with individual weights
  const [configuredMaterials, setConfiguredMaterials] = useState<ConfiguredMaterial[]>([
    {
      id: 'keyboard',
      name: 'Computer Keyboard',
      priceRange: '₹100–130/kg',
      offerPrice: 120,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
      weightKg: 1.2,
      confidence: 0.98,
    }
  ]);

  const [detectedItems, setDetectedItems] = useState<Detection[]>([]);
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed totals across all selected materials
  const totalWeight = Math.round(configuredMaterials.reduce((sum, m) => sum + (m.weightKg || 0), 0) * 10) / 10;
  const totalValuation = configuredMaterials.reduce(
    (sum, m) => sum + Math.round((m.weightKg || 0) * (m.offerPrice || 0)),
    0
  );

  const triggerNextStep = (nextStepNum: number) => {
    setStep(nextStepNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      await runAIDetection(file);
    }
  };

  const handleDemoScrapSelect = async () => {
    setImagePreview('/demo-scrap.png');
    setIsScanning(true);
    triggerNextStep(2);

    try {
      const response = await fetch('/demo-scrap.png');
      const blob = await response.blob();
      const demoFile = new File([blob], 'demo-scrap.png', { type: 'image/png' });
      await runAIDetection(demoFile);
    } catch (err) {
      console.warn('Could not load demo image file directly, calling fallback detector:', err);
      const demoBlob = new Blob([], { type: 'image/png' });
      const demoFile = new File([demoBlob], 'demo-scrap.png', { type: 'image/png' });
      await runAIDetection(demoFile);
    }
  };

  const runAIDetection = async (file?: File) => {
    setIsScanning(true);
    triggerNextStep(2);

    try {
      if (file) {
        const res = await analyzeWaste(file);
        if (res.success && res.detections && res.detections.length > 0) {
          setDetectedItems(res.detections);

          // Map detections to configurable materials with individual weights
          const mapped: ConfiguredMaterial[] = res.detections.map((det, idx) => {
            const matchedPreset = MATERIAL_PRESETS.find(
              (p) => p.name.toLowerCase().includes(det.class_name.toLowerCase()) || det.class_name.toLowerCase().includes(p.id)
            );

            return {
              id: `item_${idx}_${det.class_name.toLowerCase().replace(/\s+/g, '_')}`,
              name: det.class_name,
              priceRange: matchedPreset ? matchedPreset.priceRange : `₹${Math.round((det.price_per_kg || 150) * 0.9)}–${Math.round((det.price_per_kg || 150) * 1.1)}/kg`,
              offerPrice: det.price_per_kg || matchedPreset?.offerPrice || 150,
              image: matchedPreset?.image || imagePreview || '/demo-scrap.png',
              weightKg: det.weight_estimate_kg || 1.0,
              confidence: det.confidence || 0.95,
              bbox: det.bbox,
            };
          });

          setConfiguredMaterials(mapped);
          setAiConfidencePercent(Math.round((res.detections[0]?.confidence || 0.95) * 100));
        }
      }
    } catch (err) {
      console.warn('AI analysis error, using fallback:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Toggle selection of a preset material
  const togglePresetMaterial = (preset: typeof MATERIAL_PRESETS[0]) => {
    const isAlreadySelected = configuredMaterials.some((m) => m.name.toLowerCase() === preset.name.toLowerCase());
    
    if (isAlreadySelected) {
      // Don't remove if it's the last one
      if (configuredMaterials.length > 1) {
        setConfiguredMaterials(configuredMaterials.filter((m) => m.name.toLowerCase() !== preset.name.toLowerCase()));
      }
    } else {
      setConfiguredMaterials([
        ...configuredMaterials,
        {
          id: preset.id,
          name: preset.name,
          priceRange: preset.priceRange,
          offerPrice: preset.offerPrice,
          image: preset.image,
          weightKg: preset.defaultWeight,
          confidence: 0.95,
        },
      ]);
    }
  };

  // Update weight for a specific item
  const handleUpdateItemWeight = (itemId: string, newWeight: number) => {
    const sanitized = Math.max(0.1, Math.round(newWeight * 10) / 10);
    setConfiguredMaterials((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, weightKg: sanitized } : m))
    );
  };

  // Remove a material from the list
  const handleRemoveItem = (itemId: string) => {
    if (configuredMaterials.length > 1) {
      setConfiguredMaterials((prev) => prev.filter((m) => m.id !== itemId));
    }
  };

  const handleCreateLot = () => {
    const newLotId = `KBD-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedLotId(newLotId);

    const materialSummary =
      configuredMaterials.length > 1
        ? `Mixed E-Waste (${configuredMaterials.length} Items: ${configuredMaterials.map((m) => m.name).join(', ')})`
        : configuredMaterials[0]?.name || 'E-Waste Scrap';

    const lotObj = {
      id: newLotId,
      material: materialSummary,
      weight: totalWeight,
      totalEstimatedValue: totalValuation,
      itemizedBreakdown: configuredMaterials.map((m) => ({
        name: m.name,
        weightKg: m.weightKg,
        offerPrice: m.offerPrice,
        subtotal: Math.round(m.weightKg * m.offerPrice),
      })),
      pickupType,
      location: selectedGPSLocation.address,
      customerAddress: selectedGPSLocation.address,
      gpsLocation: selectedGPSLocation,
      status: 'Created',
      timestamp: new Date().toISOString(),
    };

    onLotCreated(lotObj);
    triggerNextStep(7);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Dynamic Header */}
      <Header
        title={t('sell_material_step', { step })}
        subtitle=""
        showBack
        onBack={() => {
          if (step > 1 && step < 7) {
            triggerNextStep(step - 1);
          } else {
            onBackToHome();
          }
        }}
        pageAudioText={
          step === 1
            ? `${t('take_photo_title')}. ${t('take_photo_desc')}`
            : step === 4
            ? `Enter weight for each of the ${configuredMaterials.length} materials.`
            : step === 6
            ? `Fair Price confirmation. Total valuation ₹${totalValuation}.`
            : undefined
        }
      />

      <div className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Progress Bar Pills (1 of 7) */}
        <div className="flex items-center gap-1.5 w-full">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: TAKE PHOTO */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 pt-2 max-w-lg mx-auto">
            {/* Camera Green Icon Card */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-emerald-100/90 border border-emerald-200/80 flex items-center justify-center shadow-inner">
              <Camera className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-800 stroke-[1.8]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {t('take_photo_title')}
              </h2>
              <p className="text-slate-600 font-medium text-sm sm:text-base px-4">
                {t('take_photo_desc')}
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              className="hidden"
            />

            <div className="w-full space-y-3 pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-base sm:text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-3 transition-all"
              >
                <Camera className="w-6 h-6" />
                <span>{t('btn_take_photo')}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 rounded-2xl bg-white border-2 border-emerald-800/30 hover:border-emerald-800 text-emerald-800 font-bold text-base shadow-sm flex items-center justify-center gap-3 transition-all"
              >
                <ImageIcon className="w-5 h-5 text-emerald-700" />
                <span>{t('btn_choose_gallery')}</span>
              </button>

              {/* DEMO SCRAP IMAGE QUICK TEST BUTTON */}
              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={handleDemoScrapSelect}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-400/80 hover:border-emerald-600 shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 text-left group"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-emerald-300 shrink-0 bg-slate-900">
                    <img
                      src="/demo-scrap.png"
                      alt="Demo E-Waste Scrap"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-emerald-900/10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-700 fill-emerald-600" />
                      <span className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider">
                        Demo Scrap Image (Instant AI)
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
                      Mixed E-Waste Collection (8 Items)
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Keyboard, Phones, Cables, Cameras & more • ₹1,066 Est.
                    </p>
                  </div>
                  <div className="px-2.5 py-1.5 rounded-xl bg-emerald-800 text-white font-bold text-xs shrink-0 group-hover:bg-emerald-900">
                    Try Demo →
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: AI DETECTION WITH MULTI-ITEM BOUNDING BOXES & VALUATION */}
        {step === 2 && (
          <div className="space-y-6 pt-2">
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-xl font-black text-slate-900 animate-pulse">
                    {t('ai_detecting')}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">
                    Scanning & identifying all e-waste items in the image...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header Summary Banner */}
                <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Multi-Item Recognition Complete</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      {configuredMaterials.length > 1
                        ? `${configuredMaterials.length} E-Waste Items Identified`
                        : configuredMaterials[0]?.name}
                    </h3>
                    <p className="text-emerald-100/90 text-sm font-medium mt-0.5">
                      Estimated Combined Weight: <strong className="text-white">{totalWeight} kg</strong>
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3.5 rounded-2xl text-left sm:text-right">
                    <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider block">
                      Total Estimated Value
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-emerald-300">
                      ₹{totalValuation}
                    </span>
                  </div>
                </div>

                {/* Main Content: Interactive Image with Bounding Boxes & Item Breakdown List */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Image with Bounding Box Overlays */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-600 shadow-md bg-slate-950 aspect-[4/3] flex items-center justify-center select-none group">
                      <img
                        src={imagePreview || configuredMaterials[0]?.image || '/demo-scrap.png'}
                        alt="E-Waste Detections"
                        className="w-full h-full object-contain"
                      />

                      {/* Render Bounding Boxes */}
                      {detectedItems.map((item, idx) => {
                        const color = BBOX_COLORS[idx % BBOX_COLORS.length];
                        const isHovered = hoveredBoxIndex === idx;
                        const { x1, y1, x2, y2 } = item.bbox;
                        const width = x2 - x1;
                        const height = y2 - y1;

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredBoxIndex(idx)}
                            onMouseLeave={() => setHoveredBoxIndex(null)}
                            style={{
                              left: `${x1}%`,
                              top: `${y1}%`,
                              width: `${width}%`,
                              height: `${height}%`,
                            }}
                            className={`absolute border-2 transition-all duration-200 cursor-pointer rounded-lg ${
                              color.border
                            } ${
                              isHovered
                                ? `${color.bg} ring-4 ring-white/50 scale-[1.02] z-20`
                                : 'bg-black/10 hover:bg-black/20 z-10'
                            }`}
                          >
                            <div
                              className={`absolute -top-3.5 left-1 px-2 py-0.5 rounded-md text-[11px] font-black text-white shadow-md flex items-center gap-1 ${
                                color.badge
                              }`}
                            >
                              <span>#{idx + 1}</span>
                              <span className="hidden sm:inline truncate max-w-[120px]">
                                {item.class_name}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Top Right Confidence Badge */}
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{aiConfidencePercent}% Accuracy</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 text-center font-medium">
                      💡 Hover over or tap an item card to highlight its location on the scrap image.
                    </p>
                  </div>

                  {/* Right Column: Itemized Breakdown List */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-emerald-700" />
                          <h4 className="font-extrabold text-slate-900 text-base">
                            Identified Items Breakdown
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          {configuredMaterials.length} Items
                        </span>
                      </div>

                      {/* Items list */}
                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                        {configuredMaterials.map((item, idx) => {
                          const color = BBOX_COLORS[idx % BBOX_COLORS.length];
                          const isHovered = hoveredBoxIndex === idx;

                          return (
                            <div
                              key={item.id}
                              onMouseEnter={() => setHoveredBoxIndex(idx)}
                              onMouseLeave={() => setHoveredBoxIndex(null)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isHovered
                                  ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-6 h-6 rounded-lg text-white font-black text-xs flex items-center justify-center shrink-0 ${color.badge}`}
                                >
                                  {idx + 1}
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-sm font-bold text-slate-900 truncate">
                                    {item.name}
                                  </h5>
                                  <p className="text-xs text-slate-500 font-medium">
                                    {item.weightKg} kg @ ₹{item.offerPrice}/kg
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-sm font-black text-emerald-800 block">
                                  ₹{Math.round(item.weightKg * item.offerPrice)}
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-600">
                                  {Math.round((item.confidence || 0.9) * 100)}% match
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total Bar */}
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Total Valuation
                          </span>
                          <p className="text-xs text-slate-600 font-medium">
                            {totalWeight} kg combined e-waste
                          </p>
                        </div>
                        <span className="text-2xl font-black text-emerald-700">
                          ₹{totalValuation}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerNextStep(3)}
                      className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                    >
                      <span>{t('confirm_material')}</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: MULTI-MATERIAL SELECTION / TOGGLE */}
        {step === 3 && (
          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Select E-Waste Materials
                </h3>
                <p className="text-sm text-slate-600 font-medium">
                  Select one or multiple materials included in your scrap batch.
                </p>
              </div>
              <div className="bg-emerald-100 text-emerald-900 px-4 py-2 rounded-2xl font-bold text-sm shrink-0 flex items-center gap-2 self-start sm:self-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{configuredMaterials.length} Materials Selected</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {MATERIAL_PRESETS.map((preset) => {
                const isSelected = configuredMaterials.some(
                  (m) => m.name.toLowerCase() === preset.name.toLowerCase()
                );

                return (
                  <button
                    key={preset.id}
                    onClick={() => togglePresetMaterial(preset)}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={preset.image}
                      alt={preset.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {preset.name}
                      </h4>
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                        {preset.priceRange} (₹{preset.offerPrice}/kg)
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-semibold text-slate-500">
                {configuredMaterials.length} items ready for weight entry
              </span>
              <button
                onClick={() => triggerNextStep(4)}
                className="py-4 px-8 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center gap-2"
              >
                <span>Enter Weights ({configuredMaterials.length})</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ENTER WEIGHT FOR EACH MATERIAL INDIVIDUALLY */}
        {step === 4 && (
          <div className="space-y-6 pt-2">
            {/* Header with combined totals */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Enter Weight for Each Material
                </h2>
                <p className="text-slate-600 text-sm font-medium mt-1">
                  Adjust or enter the exact weight (in kg) for each selected item.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200/80 px-5 py-3 rounded-2xl shrink-0">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                    Combined Weight
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-900">
                    {totalWeight} <span className="text-base font-bold">kg</span>
                  </span>
                </div>
                <div className="h-10 w-px bg-emerald-200" />
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                    Total Estimated Value
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                    ₹{totalValuation}
                  </span>
                </div>
              </div>
            </div>

            {/* List of item weight cards */}
            <div className="space-y-4">
              {configuredMaterials.map((item, idx) => {
                const subtotal = Math.round((item.weightKg || 0) * item.offerPrice);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Item info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-md">
                              #{idx + 1}
                            </span>
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                              {item.name}
                            </h4>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-emerald-700 mt-0.5">
                            Rate: ₹{item.offerPrice}/kg ({item.priceRange})
                          </p>
                        </div>
                      </div>

                      {/* Item subtotal value */}
                      <div className="text-left sm:text-right bg-emerald-50/80 border border-emerald-200/60 px-4 py-2 rounded-2xl shrink-0 self-start sm:self-auto">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                          Subtotal Value
                        </span>
                        <span className="text-xl font-black text-emerald-700">
                          ₹{subtotal}
                        </span>
                      </div>
                    </div>

                    {/* Weight Controls & Quick Presets */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-3 border-t border-slate-100">
                      {/* Stepper + Input */}
                      <div className="md:col-span-6 flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateItemWeight(item.id, item.weightKg - 0.5)}
                          disabled={item.weightKg <= 0.1}
                          className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 disabled:opacity-40 text-slate-800 font-black text-xl flex items-center justify-center transition-all shrink-0"
                          title="Decrease weight by 0.5 kg"
                        >
                          <Minus className="w-5 h-5" />
                        </button>

                        <div className="relative flex-1">
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="500"
                            value={item.weightKg}
                            onChange={(e) =>
                              handleUpdateItemWeight(item.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-full text-center py-2.5 px-3 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-xl font-black text-slate-900"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">
                            kg
                          </span>
                        </div>

                        <button
                          onClick={() => handleUpdateItemWeight(item.id, item.weightKg + 0.5)}
                          className="w-11 h-11 rounded-xl bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-800 font-black text-xl flex items-center justify-center transition-all shrink-0"
                          title="Increase weight by 0.5 kg"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quick Weight Pills */}
                      <div className="md:col-span-5 flex items-center gap-1.5 flex-wrap">
                        {[0.5, 1, 2, 5, 10].map((w) => (
                          <button
                            key={w}
                            onClick={() => handleUpdateItemWeight(item.id, w)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              item.weightKg === w
                                ? 'bg-emerald-800 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {w} kg
                          </button>
                        ))}
                      </div>

                      {/* Remove item button (if >1 item) */}
                      {configuredMaterials.length > 1 && (
                        <div className="md:col-span-1 text-right">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Remove this item from batch"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom action row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => triggerNextStep(3)}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white border-2 border-slate-300 text-slate-700 font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>+ Add / Change Materials</span>
              </button>

              <button
                onClick={() => triggerNextStep(5)}
                className="w-full sm:flex-1 py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>Continue to Pickup Preference ({totalWeight} kg • ₹{totalValuation})</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PICKUP PREFERENCE */}
        {step === 5 && (
          <div className="space-y-6 pt-2 max-w-3xl mx-auto">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t('pickup_method_title')}
              </h2>
              <p className="text-slate-600 text-sm font-medium">
                Choose how you would like to hand over your e-waste scrap.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Home Pickup */}
              <button
                onClick={() => setPickupType('home')}
                className={`p-5 sm:p-6 rounded-3xl border-2 flex flex-col items-start gap-3 text-left transition-all ${
                  pickupType === 'home'
                    ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {t('home_pickup')}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {t('home_pickup_desc')}
                  </p>
                </div>
              </button>

              {/* Self Drop-off */}
              <button
                onClick={() => setPickupType('self')}
                className={`p-5 sm:p-6 rounded-3xl border-2 flex flex-col items-start gap-3 text-left transition-all ${
                  pickupType === 'self'
                    ? 'border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-13 h-13 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {t('self_drop')}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {t('self_drop_desc')}
                  </p>
                </div>
              </button>

              {/* Both Pickup & Drop-off */}
              <button
                onClick={() => setPickupType('both')}
                className={`p-5 sm:p-6 rounded-3xl border-2 flex flex-col items-start gap-3 text-left transition-all relative ${
                  pickupType === 'both'
                    ? 'border-purple-600 bg-purple-50/90 shadow-md ring-2 ring-purple-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="absolute top-3 right-3 bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-200">
                  Flexible
                </div>
                <div className="w-13 h-13 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Both Pickup & Drop-off
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Doorstep pickup or center drop-off based on convenience.
                  </p>
                </div>
              </button>
            </div>

            {/* GPS Map & Address Selector when Home Pickup or Both is chosen */}
            {(pickupType === 'home' || pickupType === 'both') && (
              <div className="pt-2">
                <InteractiveGPSMapPicker
                  initialLocation={selectedGPSLocation}
                  onLocationSelect={(loc) => setSelectedGPSLocation(loc)}
                  title="Pickup Location & Map Pinpoint"
                  subtitle="Verify or drag the pin to set the exact spot where the collector will arrive"
                />
              </div>
            )}

            <button
              onClick={() => triggerNextStep(6)}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2"
            >
              <span>{t('next')}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 6: FAIR PRICE & ESTIMATION */}
        {step === 6 && (
          <div className="space-y-6 pt-2 max-w-2xl mx-auto">
            {/* Header summary of batch */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Package className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      {configuredMaterials.length > 1
                        ? `Mixed E-Waste Batch (${configuredMaterials.length} Materials)`
                        : configuredMaterials[0]?.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-500">
                      {totalWeight} kg Total •{' '}
                      {pickupType === 'home'
                        ? 'Home Pickup'
                        : pickupType === 'self'
                        ? 'Self Drop'
                        : 'Both Pickup & Drop-off'}
                    </p>
                  </div>
                </div>
                <span className="text-xl font-black text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
                  ₹{totalValuation}
                </span>
              </div>

              {/* Itemized list in review */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                {configuredMaterials.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-700 font-medium">
                      {m.name} ({m.weightKg} kg @ ₹{m.offerPrice}/kg)
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{Math.round(m.weightKg * m.offerPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fair Price Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">
                {t('fair_price_title')}
              </h3>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <span className="text-slate-500 font-medium">{t('local_range')}</span>
                  <span className="font-bold text-slate-900">
                    ₹{Math.round(totalValuation * 0.9)}–₹{Math.round(totalValuation * 1.05)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm sm:text-base">
                  <span className="text-slate-600 font-medium">{t('offer_price')}</span>
                  <span className="font-extrabold text-emerald-700 text-lg sm:text-xl">
                    ₹{totalValuation} Total Offer
                  </span>
                </div>

                {/* Above local range badge */}
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>{t('above_local_range')}</span>
                  </span>
                </div>
              </div>

              {/* Estimated Value */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-500 block">
                    {t('estimated_value')}
                  </span>
                  <span className="text-3xl font-black text-emerald-700">
                    ₹{totalValuation}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Calculator className="w-7 h-7 stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Note banner */}
            <div className="flex items-start gap-2.5 bg-emerald-50/80 border border-emerald-200/60 p-4 rounded-2xl text-xs sm:text-sm text-slate-600">
              <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <span>{t('price_note')}</span>
            </div>

            {/* Create Lot Button */}
            <button
              onClick={handleCreateLot}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2 transition-all"
            >
              <PlusCircle className="w-6 h-6" />
              <span>{t('create_lot')}</span>
            </button>
          </div>
        )}

        {/* STEP 7: SUCCESS CONFIRMATION */}
        {step === 7 && (
          <div className="flex flex-col items-center text-center space-y-6 pt-6 max-w-lg mx-auto">
            <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md animate-bounce">
              <CheckCircle2 className="w-16 h-16 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">
                {t('lot_created_success')}
              </h2>
              <div className="inline-block bg-slate-100 px-5 py-2.5 rounded-2xl border border-slate-200 text-xl font-mono font-bold text-slate-800">
                {t('lot_id_label')}: {createdLotId}
              </div>
              <p className="text-sm font-semibold text-slate-600">
                {totalWeight} kg Total • ₹{totalValuation} Estimated Value
              </p>
            </div>

            <div className="w-full space-y-3 pt-4">
              <button
                onClick={() => onFindRecyclersForLot(createdLotId)}
                className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2"
              >
                <span>{t('find_recycler_now')}</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={onBackToHome}
                className="w-full py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-base hover:bg-slate-50 transition-all"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
