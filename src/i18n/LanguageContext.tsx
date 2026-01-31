"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Email } from '../types/Email';
import { translations } from "./translations";

interface LanguageContextType {
  language: Email.Language;
  setLanguage: (lang: Email.Language) => void;
  translations: typeof translations[Email.Language];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Email.Language>("pt");

  const currentTranslations = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
