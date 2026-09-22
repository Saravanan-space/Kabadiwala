'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isLanguageSelected: boolean;
  selectLanguage: (lang: Language) => void;
  openLanguageSelector: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  speakText: (text: string, elementId?: string, overrideLang?: Language) => void;
  stopSpeech: () => void;
  isSpeaking: boolean;
  speakingId: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('hi');
  const [isLanguageSelected, setIsLanguageSelected] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage on mount
    const savedLang = localStorage.getItem('kabadiwala_lang') as Language;
    const isSelected = localStorage.getItem('kabadiwala_lang_selected') === 'true';

    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    }
    setIsLanguageSelected(isSelected);

    // Warm up TTS voices loading in background
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kabadiwala_lang', lang);
  };

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLanguageSelected(true);
    localStorage.setItem('kabadiwala_lang_selected', 'true');
  };

  const openLanguageSelector = () => {
    setIsLanguageSelected(false);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingId(null);
  };

  const speakText = (text: string, elementId?: string, overrideLang?: Language) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Stop ongoing speech
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') return;

    const targetLang = overrideLang || language;
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLang);
    const targetBcp = langObj?.bcp47 || 'hi-IN';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetBcp;
    utterance.rate = 0.9; // slightly slower for better clarity for elderly/illiterate users
    utterance.pitch = 1.0;

    // Dynamically match system voices for target language (e.g. Kannada, Marathi, Hindi)
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const primaryLang = targetLang.toLowerCase();
      const targetBcpClean = targetBcp.toLowerCase().replace('_', '-');

      // 1. Exact BCP-47 match e.g. 'kn-in', 'mr-in', 'hi-in'
      let selectedVoice = voices.find(
        v => v.lang.toLowerCase().replace('_', '-') === targetBcpClean
      );

      // 2. Prefix match e.g. 'kn', 'mr', 'hi'
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(primaryLang));
      }

      // 3. Match by name (e.g. "Kannada", "ಕನ್ನಡ", "Marathi", "मराठी", "Hindi", "हिंदी")
      if (!selectedVoice) {
        const nameKeywords: Record<string, string[]> = {
          kn: ['kannada', 'ಕನ್ನಡ', 'kn'],
          mr: ['marathi', 'मराठी', 'mr'],
          hi: ['hindi', 'हिंदी', 'hi'],
          ta: ['tamil', 'தமிழ்', 'ta'],
          te: ['telugu', 'తెలుగు', 'te'],
          gu: ['gujarati', 'ગુજરાતી', 'gu'],
          bn: ['bengali', 'বাংলা', 'bn'],
          en: ['english', 'en'],
        };
        const keywords = nameKeywords[primaryLang] || [];
        selectedVoice = voices.find(v => {
          const vName = v.name.toLowerCase();
          return keywords.some(kw => vName.includes(kw));
        });
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingId(elementId || 'global');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.hi;
    let str = langDict[key] || translations.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        str = str.replace(`{${pKey}}`, String(pVal));
      });
    }

    return str;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isLanguageSelected,
        selectLanguage,
        openLanguageSelector,
        t,
        speakText,
        stopSpeech,
        isSpeaking,
        speakingId,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
