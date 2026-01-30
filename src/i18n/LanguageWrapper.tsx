"use client";

import { useEffect } from "react";
import { useTranslation } from "./LanguageContext";

export function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useTranslation();

  useEffect(() => {
    const langMap: Record<string, string> = {
      pt: "pt-BR",
      en: "en-US",
      es: "es-ES",
    };
    
    document.documentElement.lang = langMap[language] || "pt-BR";
  }, [language]);

  return <>{children}</>;
}
