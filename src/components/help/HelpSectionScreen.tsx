'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Header } from '../common/Header';
import {
  Camera,
  Scale,
  Building2,
  Wallet,
  Volume2,
  ChevronRight,
} from 'lucide-react';

interface HelpSectionScreenProps {
  onBack: () => void;
}

export function HelpSectionScreen({ onBack }: HelpSectionScreenProps) {
  const { t, speakText, isSpeaking, speakingId } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);

  const helpSteps = [
    {
      id: 'step1',
      icon: Camera,
      title: t('help_step_1_title'),
      desc: t('help_step_1_desc'),
    },
    {
      id: 'step2',
      icon: Scale,
      title: t('help_step_2_title'),
      desc: t('help_step_2_desc'),
    },
    {
      id: 'step3',
      icon: Building2,
      title: t('help_step_3_title'),
      desc: t('help_step_3_desc'),
    },
    {
      id: 'step4',
      icon: Wallet,
      title: t('help_step_4_title'),
      desc: t('help_step_4_desc'),
    },
  ];

  const currentStep = helpSteps[activeStep];
  const IconComp = currentStep.icon;
  const isPlayingCurrentAudio = isSpeaking && speakingId === `help-${currentStep.id}`;

  const handleNext = () => {
    if (activeStep < helpSteps.length - 1) {
      const nextIdx = activeStep + 1;
      setActiveStep(nextIdx);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 flex flex-col justify-between">
      <Header
        title={t('help')}
        subtitle=""
        showBack
        onBack={onBack}
        pageAudioText={`${currentStep.title}. ${currentStep.desc}`}
      />

      {/* Main Content matching reference UI */}
      <div className="max-w-md sm:max-w-2xl md:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col items-center text-center my-auto space-y-6 sm:space-y-8 w-full">
        {/* Big Circular Green Icon Container matching reference image */}
        <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-emerald-600/30 bg-emerald-100/80 flex items-center justify-center shadow-lg">
          <IconComp className="w-24 h-24 sm:w-28 sm:h-28 text-emerald-800 stroke-[1.8]" />
        </div>

        {/* Title & Description */}
        <div className="space-y-3 px-2 max-w-xl">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {currentStep.title}
          </h2>
          <p className="text-slate-600 font-medium text-sm sm:text-lg leading-relaxed">
            {currentStep.desc}
          </p>
        </div>

        {/* Audio Button */}
        <button
          onClick={() =>
            speakText(`${currentStep.title}. ${currentStep.desc}`, `help-${currentStep.id}`)
          }
          className={`p-4 rounded-full border-2 transition-all shadow-sm ${
            isPlayingCurrentAudio
              ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse scale-105'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 active:scale-95'
          }`}
          title={t('read_aloud')}
        >
          <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
        </button>

        {/* Pagination Dots Indicator */}
        <div className="flex items-center gap-2 pt-2 sm:pt-4">
          {helpSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-3 rounded-full transition-all duration-300 ${
                idx === activeStep ? 'w-8 bg-emerald-700' : 'w-3 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Primary Button */}
      <div className="max-w-md sm:max-w-2xl md:max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-lg shadow-lg shadow-emerald-800/25 flex items-center justify-center gap-2 transition-all"
        >
          <span>{activeStep < helpSteps.length - 1 ? t('next') : 'Done'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
