'use client';

import React from 'react';
import { ShieldAlert, Volume2, Battery, Cpu, Tv, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';

const AUDIO_GUIDES: Record<string, Record<Language, string>> = {
  battery: {
    kn: 'ಬ್ಯಾಟರಿ ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶನ: ಲಿಥಿಯಂ ಬ್ಯಾಟರಿಯನ್ನು ಎಂದಿಗೂ ಬೆಂಕಿಯಲ್ಲಿ ಸುಡಬೇಡಿ ಮತ್ತು ಒಡೆಯಬೇಡಿ.',
    mr: 'बॅटरी सुरक्षा सूचना: लिथियम बॅटरी कधीही जाळू नका किंवा फोडू नका.',
    hi: 'बैटरी सुरक्षा निर्देश: लिथियम बैटरी को कभी न जलाएं और न ही पंचर करें।',
    en: 'Battery safety: Never burn lithium battery packs or break casing.',
    ta: 'பேட்டரி பாதுகாப்பு: லித்தியம் பேட்டரிகளை எரிக்கவேண்டாம்.',
    te: 'బ్యాటరీ భద్రత: లిథియం బ్యాటరీలను నిప్పులో కాల్చవద్దు.',
    gu: 'બેટરી સુરક્ષા: લિથિયમ બેટરીને ક્યારેય બાળશો નહીં.',
    bn: 'ব্যাটারি সুরক্ষা: লিথিয়াম ব্যাটারি কখনো আগুনে পোড়াবেন না।',
  },
  pcb: {
    kn: 'ಸರ್ಕ್ಯೂಟ್ ಬೋರ್ಡ್ ಸುರಕ್ಷತೆ: ಸುರಕ್ಷತಾ ಉಪಕರಣಗಳಿಲ್ಲದೆ ರಾಸಾಯನಿಕ ಬಳಕೆಯನ್ನು ಮಾಡಬೇಡಿ.',
    mr: 'सर्किट बोर्ड सुरक्षा: सुरक्षा साधनांशिवाय रसायनांचा वापर करू नका.',
    hi: 'सर्किट बोर्ड सुरक्षा: बिना सुरक्षा उपकरणों के रसायन का प्रयोग न करें।',
    en: 'Circuit board safety: Avoid acid leaching without protective equipment.',
    ta: 'சர்க்யூட் போர்டு பாதுகாப்பு: ரசாயனங்களை கவனமாக பயன்படுத்தவும்.',
    te: 'సర్క్యూట్ బోర్డ్ భద్రత: రసాయనాలను జాగ్రత్తగా ఉపయోగించండి.',
    gu: 'સર્કિટ બોર્ડ સુરક્ષા: રક્ષણાત્મક સાધનો વગર કેમિકલ વાપરશો નહીં.',
    bn: 'সার্কিট বোর্ড সুরক্ষা: রাসায়নিক ব্যবহারের সময় সুরক্ষামূলক সরঞ্জাম ব্যবহার করুন।',
  },
  cable: {
    kn: 'ಕೇಬಲ್ ಸುರಕ್ಷತೆ: ತಾಮ್ರ ತೆಗೆಯಲು ಕೇಬಲ್ ಸುಡಬೇಡಿ, ವೈರ್ ಸ್ಟ್ರಿಪ್ಪರ್ ಬಳಸಿ.',
    mr: 'केबल सुरक्षा: तांबे काढण्यासाठी केबल जाळू नका, स्ट्रिपिंग साधन वापरा.',
    hi: 'केबल सुरक्षा: तांबा निकालने के लिए केबल न जलाएं, स्ट्रिपिंग टूल का उपयोग करें।',
    en: 'Cable safety: Do not burn PVC cables to recover copper wire.',
    ta: 'கேபிள் பாதுகாப்பு: தாமிரம் எடுக்க கேபிள்களை எரிக்க வேண்டாம்.',
    te: 'కేబుల్ భద్రత: రాగి కోసం కేబుళ్లను కాల్చవద్దు.',
    gu: 'કેબલ સુરક્ષા: તાંબુ કાઢવા કેબલ બાળશો નહીં.',
    bn: 'কেবল সুরক্ষা: তামা বের করতে কেবল পোড়াবেন না।',
  },
  crt: {
    kn: 'ಸಿಆರ್‌ಟಿ ಗ್ಲಾಸ್ ಸುರಕ್ಷತೆ: ಟಿವಿ ಪಿಕ್ಚರ್ ಟ್ಯೂಬ್ ಗಾಜನ್ನು ಜಾಗರೂಕತೆಯಿಂದ ನಿರ್ವಹಿಸಿ.',
    mr: 'सीआरटी ग्लास सुरक्षा: टीव्ही पिक्चर ट्यूबची काच काळजीपूर्वक हाताळा.',
    hi: 'सीआरटी ग्लास सुरक्षा: टीवी पिक्चर ट्यूब के शीशे को सावधानी से संभालें।',
    en: 'CRT glass safety: Handle TV and monitor glass tubes with care.',
    ta: 'சிஆர்டி பாதுகாப்பு: டிவி கிளாஸ் டியூப்களை கவனமாக கையாளவும்.',
    te: 'సిఆర్‌టి భద్రత: టీవీ పిక్చర్ ట్యూబ్ గాజును జాగ్రత్తగా నిర్వహించండి.',
    gu: 'સીઆરટી ગ્લાસ સુરક્ષા: ટીવી પિક્ચર ટ્યુબ કાચ સાચવીને વાપરો.',
    bn: 'সিআরটি সুরক্ষা: টিভি পিকচার টিউব কাঁচ সাবধানে নাড়াচাড়া করুন।',
  },
};

export const SafetyCenter: React.FC = () => {
  const { t, speakText, language, isSpeaking, speakingId } = useLanguage();

  const safetyGuides = [
    {
      id: 'battery',
      title: 'Lithium Battery Safety',
      icon: Battery,
      severity: 'HIGH RISK ⚠️',
      rules: [
        '🔥 NEVER burn lithium battery packs in open fire.',
        '☠️ DO NOT puncture, crush, or break casing.',
        '🔋 Store in cool, dry shadow away from combustible materials.',
        '🧤 Wear insulating rubber gloves while handling damaged cells.',
      ],
      audioText: 'बैटरी सुरक्षा निर्देश: लिथियम बैटरी को कभी न जलाएं और न ही पंचर करें।',
    },
    {
      id: 'pcb',
      title: 'PCB & Circuit Board Safety',
      icon: Cpu,
      severity: 'CHEMICAL HAZARD ☠️',
      rules: [
        '☠️ Avoid open acid leaching or informal chemical baths.',
        '🔥 Avoid open burning of plastic solder boards.',
        '🧤 Use protective face masks to avoid toxic solder fumes.',
      ],
      audioText: 'सर्किट बोर्ड सुरक्षा: बिना सुरक्षा उपकरणों के रसायन का प्रयोग न करें।',
    },
    {
      id: 'cable',
      title: 'Copper Cable & Wire Safety',
      icon: Zap,
      severity: 'ENVIRONMENTAL CODE ⚠️',
      rules: [
        '🔥 DO NOT burn PVC cables to recover copper wiring.',
        '✂️ Use mechanical wire strippers or cable peeling machines.',
        '🌱 Burning cables emits cancer-causing dioxin fumes.',
      ],
      audioText: 'केबल सुरक्षा: तांबा निकालने के लिए केबल न जलाएं, स्ट्रिपिंग टूल का उपयोग करें।',
    },
    {
      id: 'crt',
      title: 'CRT Display Tube Safety',
      icon: Tv,
      severity: 'IMPLOSION RISK ⚠️',
      rules: [
        '📺 Handle old TV & monitor glass tubes with care.',
        '💥 Vacuum implosion risk if neck glass breaks suddenly.',
        '🧤 Always wear thick leather gloves and eye goggles.',
      ],
      audioText: 'सीआरटी ग्लास सुरक्षा: टीवी पिक्चर ट्यूब के शीशे को सावधानी से संभालें।',
    },
  ];

  const handlePlayAudio = (id: string, defaultText: string) => {
    const textToSpeak = AUDIO_GUIDES[id]?.[language] || defaultText;
    speakText(textToSpeak, `safety-${id}`);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-xl text-slate-900">E-Waste Safety Center</h2>
            <p className="text-xs text-slate-500 font-medium">Protect Yourself & The Environment</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          Follow responsible recycling guidelines to prevent toxic chemical exposure, fire hazards, and injury.
        </p>
      </div>

      {/* Safety Cards List */}
      <div className="space-y-4">
        {safetyGuides.map((guide) => {
          const Icon = guide.icon;
          const isPlaying = isSpeaking && speakingId === `safety-${guide.id}`;

          return (
            <div
              key={guide.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">{guide.title}</h3>
                </div>

                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {guide.severity}
                </span>
              </div>

              {/* Rules list */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                {guide.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-slate-800 font-semibold">
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              {/* Vernacular Audio Guidance Blue Button */}
              <button
                onClick={() => handlePlayAudio(guide.id, guide.audioText)}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                  isPlaying
                    ? 'bg-blue-700 text-white shadow-md animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
                <span>{isPlaying ? t('playing_audio') : `${t('read_aloud')}`}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
