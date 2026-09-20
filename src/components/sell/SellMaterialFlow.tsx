import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../common/Header';
import { analyzeWaste } from '../../services/aiService';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SellMaterialFlowProps {
  onBackToHome: () => void;
  onLotCreated: (lotData: any) => void;
  onFindRecyclersForLot: (lotId: string) => void;
}

const MATERIAL_PRESETS = [
  { id: 'smartphone', name: 'Smartphone', priceRange: '₹420–480/kg', offerPrice: 450, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' },
  { id: 'laptop', name: 'Laptop', priceRange: '₹500–550/kg', offerPrice: 520, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80' },
  { id: 'cable', name: 'Cable', priceRange: '₹180–220/kg', offerPrice: 365, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80' },
  { id: 'pcb', name: 'PCB (Circuit Board)', priceRange: '₹340–370/kg', offerPrice: 380, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
  { id: 'monitor', name: 'Monitor Screen', priceRange: '₹75–90/kg', offerPrice: 85, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80' },
  { id: 'keyboard', name: 'Keyboard / Mouse', priceRange: '₹100–130/kg', offerPrice: 120, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80' },
  { id: 'battery', name: 'Lithium Battery', priceRange: '₹60–90/kg', offerPrice: 100, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80' },
  { id: 'motor', name: 'Copper Motor', priceRange: '₹120–160/kg', offerPrice: 170, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80' },
];

const WEIGHT_PRESETS = [1, 2, 3, 5, 8, 10, 15, 20, 25, 30];

export function SellMaterialFlow({
  onBackToHome,
  onLotCreated,
  onFindRecyclersForLot,
}: SellMaterialFlowProps) {
  const { t, speakText } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIAL_PRESETS[0]);
  const [aiConfidencePercent, setAiConfidencePercent] = useState<number>(96);
  const [weightKg, setWeightKg] = useState<number>(9);
  const [pickupType, setPickupType] = useState<'home' | 'self'>('home');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [createdLotId, setCreatedLotId] = useState<string>('KBD-1042');

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const runAIDetection = async (file?: File) => {
    setIsScanning(true);
    triggerNextStep(2);

    try {
      if (file) {
        const res = await analyzeWaste(file);
        if (res.success && res.detections && res.detections.length > 0) {
          const topDet = res.detections[0];
          const rawName = topDet.class_name.toLowerCase();
          
          // Match detected class to preset or create custom preset
          const matchedPreset = MATERIAL_PRESETS.find((p) =>
            p.name.toLowerCase().includes(rawName) || p.id.toLowerCase().includes(rawName)
          );

          if (matchedPreset) {
            setSelectedMaterial(matchedPreset);
          } else {
            // Build dynamic material entry
            const price = topDet.price_per_kg || 250;
            setSelectedMaterial({
              id: topDet.class_name.toLowerCase(),
              name: topDet.class_name,
              priceRange: `₹${Math.round(price * 0.9)}–${Math.round(price * 1.1)}/kg`,
              offerPrice: price,
              image: imagePreview || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
            });
          }

          setAiConfidencePercent(Math.round((topDet.confidence || 0.92) * 100));
        }
      }
    } catch (err) {
      console.warn('AI analysis error, using fallback:', err);
    } finally {
      setIsScanning(false);
      const currentMat = selectedMaterial;
      speakText(`${t('ai_detected_title')}: ${currentMat.name}. ${currentMat.priceRange}`);
    }
  };


  const handleCreateLot = () => {
    const newLotId = `KBD-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedLotId(newLotId);
    
    const lotObj = {
      id: newLotId,
      material: selectedMaterial.name,
      weight: weightKg,
      priceRange: selectedMaterial.priceRange,
      offerPrice: selectedMaterial.offerPrice,
      pickupType,
      status: 'Created',
      timestamp: new Date().toISOString(),
    };

    onLotCreated(lotObj);

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

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
            ? `${t('approx_weight_title')}. ${t('approx_weight_desc')}`
            : step === 6
            ? `${t('fair_price_title')}. ${selectedMaterial.name}. ${selectedMaterial.priceRange}`
            : undefined
        }
      />

      <div className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Progress Bar Pills (1 of 7) */}
        <div className="flex items-center gap-1.5 w-full">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: TAKE PHOTO */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 pt-4">
            {/* Camera Green Icon Card */}
            <div className="w-56 h-56 rounded-3xl bg-emerald-100/90 border border-emerald-200/80 flex items-center justify-center shadow-inner">
              <Camera className="w-24 h-24 text-emerald-800 stroke-[1.8]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {t('take_photo_title')}
              </h2>
              <p className="text-slate-600 font-medium text-base px-6">
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

            <div className="w-full space-y-3 pt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-3 transition-all"
              >
                <Camera className="w-6 h-6" />
                <span>{t('btn_take_photo')}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-2xl bg-white border-2 border-emerald-800/30 hover:border-emerald-800 text-emerald-800 font-bold text-base shadow-sm flex items-center justify-center gap-3 transition-all"
              >
                <ImageIcon className="w-5 h-5 text-emerald-700" />
                <span>{t('btn_choose_gallery')}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AI DETECTION */}
        {step === 2 && (
          <div className="space-y-6 pt-2">
            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-lg font-bold text-slate-800 animate-pulse">
                  {t('ai_detecting')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Image preview & badge */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-900 aspect-video flex items-center justify-center">
                  <img
                    src={imagePreview || selectedMaterial.image}
                    alt={selectedMaterial.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-4 h-4" />
                    <span>{aiConfidencePercent}% {t('ai_confidence')}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">
                    {t('ai_detected_title')}
                  </span>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900">
                      {selectedMaterial.name}
                    </h3>
                    <span className="text-lg font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                      {selectedMaterial.priceRange}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => triggerNextStep(3)}
                  className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2"
                >
                  <span>{t('confirm_material')}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: CATEGORY SELECTION / CONFIRMATION */}
        {step === 3 && (
          <div className="space-y-5 pt-2">
            <h3 className="text-xl font-bold text-slate-900">
              Select or Change E-Waste Material
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {MATERIAL_PRESETS.map((m) => {
                const isSel = selectedMaterial.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMaterial(m);
                      speakText(`${m.name}. ${m.priceRange}`);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      isSel
                        ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-slate-900">{m.name}</h4>
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                        {m.priceRange}
                      </p>
                    </div>
                    {isSel && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => triggerNextStep(4)}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-lg shadow-lg shadow-emerald-800/25"
            >
              {t('next')} →
            </button>
          </div>
        )}

        {/* STEP 4: APPROXIMATE WEIGHT (Matching Enter wieght.png) */}
        {step === 4 && (
          <div className="space-y-6 pt-2 text-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {t('approx_weight_title')}
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-1">
                {t('approx_weight_desc')}
              </p>
            </div>

            {/* Big Circular Weight Display */}
            <div className="mx-auto w-48 h-48 rounded-full border-4 border-emerald-600 bg-emerald-100/70 flex flex-col items-center justify-center shadow-inner">
              <span className="text-5xl font-black text-emerald-900 leading-none">
                {weightKg}
              </span>
              <span className="text-xl font-bold text-emerald-800 mt-1">
                {t('kg')}
              </span>
            </div>

            {/* Slider */}
            <div className="px-4">
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                className="w-full accent-emerald-700 h-3 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Presets Grid */}
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('select_weight')}
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {WEIGHT_PRESETS.map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setWeightKg(w);
                      speakText(`${w} ${t('kg')}`);
                    }}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                      weightKg === w
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {w} kg
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => triggerNextStep(5)}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2"
            >
              <span>{t('next')}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 5: PICKUP PREFERENCE */}
        {step === 5 && (
          <div className="space-y-6 pt-2">
            <h2 className="text-2xl font-black text-slate-900 text-center">
              {t('pickup_method_title')}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {/* Home Pickup */}
              <button
                onClick={() => setPickupType('home')}
                className={`p-5 rounded-2xl border-2 flex items-start gap-4 text-left transition-all ${
                  pickupType === 'home'
                    ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-600/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
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
                className={`p-5 rounded-2xl border-2 flex items-start gap-4 text-left transition-all ${
                  pickupType === 'self'
                    ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-600/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {t('self_drop')}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {t('self_drop_desc')}
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={() => triggerNextStep(6)}
              className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2"
            >
              <span>{t('next')}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 6: FAIR PRICE & ESTIMATION (Matching Screenshot 2026-09-20 184348.png) */}
        {step === 6 && (
          <div className="space-y-5 pt-2">
            {/* Header item preview */}
            <div className="flex items-center gap-4 bg-white p-3.5 rounded-2xl border border-slate-200">
              <img
                src={selectedMaterial.image}
                alt={selectedMaterial.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedMaterial.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {weightKg} kg
                </p>
              </div>
            </div>

            {/* Fair Price Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  {t('fair_price_title')}
                </h3>
              </div>

              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">{t('local_range')}</span>
                  <span className="font-bold text-slate-900">{selectedMaterial.priceRange}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">{t('offer_price')}</span>
                  <span className="font-extrabold text-emerald-700 text-base">
                    ₹{selectedMaterial.offerPrice}/kg
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
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    {t('estimated_value')}
                  </span>
                  <span className="text-2xl font-black text-emerald-700">
                    ₹{Math.round(weightKg * 180)}–₹{Math.round(weightKg * selectedMaterial.offerPrice)}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Calculator className="w-6 h-6 stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Note banner */}
            <div className="flex items-start gap-2.5 bg-emerald-50/70 border border-emerald-200/60 p-3.5 rounded-2xl text-xs text-slate-600">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
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
          <div className="flex flex-col items-center text-center space-y-6 pt-6">
            <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md animate-bounce">
              <CheckCircle2 className="w-16 h-16 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">
                {t('lot_created_success')}
              </h2>
              <div className="inline-block bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 text-lg font-mono font-bold text-slate-800">
                {t('lot_id_label')}: {createdLotId}
              </div>
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
                className="w-full py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-base"
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
