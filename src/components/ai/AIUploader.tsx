'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  Image as ImageIcon,
  RefreshCw,
  AlertTriangle,
  Cpu,
  Zap,
  BatteryCharging,
  ArrowLeft,
} from 'lucide-react';

import { analyzeWaste } from '../../services/aiService';
import {
  WasteDetectionResponse,
  Detection,
  AIState,
} from '../../types/ai';

import { DetectionOverlay } from './DetectionOverlay';
import { DetectionResultCard } from './DetectionResultCard';
import { ValueSummary } from './ValueSummary';
import { useTranslation } from '../../i18n/useTranslation';

interface AIUploaderProps {
  isOffline: boolean;
  onLotCreated: (lotId: string) => void;
  onBackToHome?: () => void;
}

export const AIUploader: React.FC<AIUploaderProps> = ({
  isOffline,
  onLotCreated,
  onBackToHome,
}) => {
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [aiState, setAiState] = useState<AIState>('IDLE');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [detections, setDetections] = useState<Detection[]>([]);
  const [selectedDetectionId, setSelectedDetectionId] = useState<number | undefined>(undefined);

  const samplePresets = [
    {
      name: 'Computer PCB Scrap',
      icon: Cpu,
      imgUri:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      sampleDetections: [
        {
          class_id: 0,
          class_name: 'PCB',
          confidence: 0.94,
          bbox: { x1: 50, y1: 40, x2: 450, y2: 360 },
          weight_estimate_kg: 2.5,
          price_per_kg: 320,
          estimated_value: 800,
        },
      ],
    },
    {
      name: 'Copper Cables & Wires',
      icon: Zap,
      imgUri:
        'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&auto=format&fit=crop&q=80',
      sampleDetections: [
        {
          class_id: 1,
          class_name: 'Cable',
          confidence: 0.91,
          bbox: { x1: 80, y1: 60, x2: 520, y2: 420 },
          weight_estimate_kg: 4.2,
          price_per_kg: 610,
          estimated_value: 2562,
        },
      ],
    },
    {
      name: 'Mixed E-Waste (PCB + Battery)',
      icon: BatteryCharging,
      imgUri:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      sampleDetections: [
        {
          class_id: 0,
          class_name: 'PCB',
          confidence: 0.94,
          bbox: { x1: 40, y1: 30, x2: 380, y2: 320 },
          weight_estimate_kg: 1.5,
          price_per_kg: 320,
          estimated_value: 480,
        },
        {
          class_id: 2,
          class_name: 'Battery',
          confidence: 0.87,
          bbox: { x1: 400, y1: 150, x2: 600, y2: 400 },
          weight_estimate_kg: 2.0,
          price_per_kg: 95,
          estimated_value: 190,
        },
      ],
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setImageFile(file);
    setDetections([]);
    setSelectedDetectionId(undefined);
    setImageWidth(0);
    setImageHeight(0);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setAiState('IDLE');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setSelectedImage(preset.imgUri);
    setImageFile(null);
    setDetections(preset.sampleDetections);
    setSelectedDetectionId(undefined);
    setAiState('IDLE');
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageWidth(img.naturalWidth);
    setImageHeight(img.naturalHeight);
  };

  const handleRunAnalysis = async () => {
    if (!selectedImage && !imageFile) return;

    if (isOffline) {
      setAiState('OFFLINE');
      return;
    }

    setAiState('UPLOADING');
    setErrorMessage('');
    setSelectedDetectionId(undefined);

    setTimeout(async () => {
      setAiState('ANALYZING');

      try {
        if (imageFile) {
          const res: WasteDetectionResponse = await analyzeWaste(imageFile, isOffline);

          if (res.success && res.detections.length > 0) {
            setDetections(res.detections);
            setAiState('RESULT');
          } else {
            setDetections([]);
            setAiState('NO_DETECTION');
          }
        } else {
          setTimeout(() => {
            if (detections.length > 0) {
              setAiState('RESULT');
            } else {
              setAiState('NO_DETECTION');
            }
          }, 1000);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('Could not analyze this image.');
        }
        setAiState('ERROR');
      }
    }, 800);
  };

  const handleUpdateDetection = (index: number, updated: Detection) => {
    const next = [...detections];
    next[index] = updated;
    setDetections(next);
  };

  const handleManualCategoryFallback = (catName: string, rate: number) => {
    const fallbackDet: Detection = {
      class_id: 99,
      class_name: catName,
      confidence: 1.0,
      bbox: { x1: 50, y1: 50, x2: 550, y2: 450 },
      weight_estimate_kg: 2.0,
      price_per_kg: rate,
      estimated_value: Math.round(2.0 * rate),
    };
    setDetections([fallbackDet]);
    setAiState('RESULT');
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageFile(null);
    setImageWidth(0);
    setImageHeight(0);
    setDetections([]);
    setSelectedDetectionId(undefined);
    setErrorMessage('');
    setAiState('IDLE');
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Title & Back Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          {onBackToHome && (
            <button onClick={onBackToHome} className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="font-extrabold text-lg text-slate-900">{t('aiScannerTitle')}</h2>
            <p className="text-xs text-slate-500">{t('aiScannerSubtitle')}</p>
          </div>
        </div>
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
          YOLO Model Connected
        </span>
      </div>

      {/* Main Scanner Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />

        {/* Image Area */}
        <div className="relative aspect-[4/3] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shadow-inner">
          {selectedImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Selected E-Waste"
                className="w-full h-full object-contain"
                onLoad={handleImageLoad}
              />

              {/* YOLO Bounding Box Layer */}
              {aiState === 'RESULT' && detections.length > 0 && imageWidth > 0 && imageHeight > 0 && (
                <DetectionOverlay
                  detections={detections}
                  imageWidth={imageWidth}
                  imageHeight={imageHeight}
                  onSelectDetection={(det) => setSelectedDetectionId(det.class_id)}
                  selectedDetectionId={selectedDetectionId}
                />
              )}

              {/* Analyzing Loader */}
              {(aiState === 'UPLOADING' || aiState === 'ANALYZING') && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-30 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-600 flex items-center justify-center animate-spin">
                    <RefreshCw className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-center px-4">
                    <p className="font-extrabold text-sm text-blue-700">
                      {aiState === 'UPLOADING' ? t('uploadingImage') : t('analyzingWaste')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Running YOLO Model Inference...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600 shadow-xs">
                <Camera className="w-8 h-8 stroke-[2]" />
              </div>
              <div>
                <p className="font-bold text-base text-slate-900">No image selected</p>
                <p className="text-xs text-slate-500 mt-1">Take a picture of e-waste to identify material & estimated value</p>
              </div>
            </div>
          )}
        </div>

        {/* Primary Camera/Upload Buttons with Vibrant Blue */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-5 rounded-xl text-sm sm:text-base flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Camera className="w-5 h-5 stroke-[2.5]" />
            <span>{t('btnTakePhoto')}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 px-5 rounded-xl text-sm sm:text-base flex items-center justify-center space-x-2 border border-slate-300 active:scale-95 transition-all"
          >
            <ImageIcon className="w-5 h-5 stroke-2 text-blue-600" />
            <span>{t('btnUploadImage')}</span>
          </button>
        </div>

        {/* Analyze / Retake Buttons */}
        {selectedImage && aiState !== 'UPLOADING' && aiState !== 'ANALYZING' && (
          <div className="flex items-center space-x-3 pt-3 border-t border-slate-200">
            <button
              onClick={handleRunAnalysis}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20"
            >
              <Cpu className="w-5 h-5 stroke-[2.5]" />
              <span>{t('btnAnalyzeWaste')}</span>
            </button>

            <button
              onClick={handleReset}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 border border-slate-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('btnRetake')}</span>
            </button>
          </div>
        )}

        {/* Sample Photo Presets */}
        {!selectedImage && (
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Or Try Quick Sample E-Waste Photos:
            </span>
            <div className="grid grid-cols-3 gap-3">
              {samplePresets.map((preset, i) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectPreset(preset)}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left flex flex-col items-center text-center space-y-1.5 transition-all group"
                  >
                    <Icon className="w-6 h-6 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 line-clamp-1">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* AI State Results */}
      {aiState === 'RESULT' && detections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-lg text-slate-900">{t('detectedMaterials')}</h3>
            <span className="text-xs text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {detections.length} item(s) detected
            </span>
          </div>

          {detections.map((det, idx) => (
            <DetectionResultCard
              key={idx}
              detection={det}
              onUpdateDetection={(updated) => handleUpdateDetection(idx, updated)}
            />
          ))}

          <ValueSummary
            detections={detections}
            onCreateLot={() =>
              onLotCreated(`LOT-EW-2026-${Math.floor(1000 + Math.random() * 9000)}`)
            }
          />
        </div>
      )}

      {/* No Detection Fallback State */}
      {aiState === 'NO_DETECTION' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">{t('noDetectionTitle')}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{t('noDetectionDesc')}</p>
          </div>
          <div className="pt-2 grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <button onClick={() => setAiState('IDLE')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs sm:text-sm border border-slate-300">
              {t('btnTryAgain')}
            </button>
            <button onClick={() => handleManualCategoryFallback('PCB', 320)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-sm">
              {t('btnChooseManually')}
            </button>
          </div>
        </div>
      )}

      {/* Error / Offline Display */}
      {(aiState === 'ERROR' || aiState === 'OFFLINE') && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
          <h4 className="font-bold text-base text-red-900">
            {aiState === 'OFFLINE' ? t('offlineMode') : 'Analysis Error'}
          </h4>
          <p className="text-xs sm:text-sm text-red-700">{errorMessage || 'AI analysis requires an active internet connection.'}</p>
          <button onClick={() => setAiState('IDLE')} className="mt-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 px-5 rounded-xl">
            {t('btnTryAgain')}
          </button>
        </div>
      )}
    </div>
  );
};