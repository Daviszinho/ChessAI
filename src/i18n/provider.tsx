'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import pt from '@/locales/pt.json';

const translations = { en, es, pt };

export type Locale = keyof typeof translations;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  locales: Locale[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Locale;
    if (Object.keys(translations).includes(browserLang)) {
      setLocale(browserLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[locale];
    for (const k of keys) {
        result = result?.[k];
    }
    
    if (result !== undefined) {
        return result;
    }

    // Fallback to English if translation is missing
    let fallbackResult: any = translations.en;
    for (const fk of keys) {
        fallbackResult = fallbackResult?.[fk];
    }
    return fallbackResult || key;
  };

  const value = {
      locale,
      setLocale,
      t,
      locales: Object.keys(translations) as Locale[],
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
