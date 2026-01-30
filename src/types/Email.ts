export type Language = "pt" | "en" | "es";

export type EmailCategory = 'Productive' | 'Unproductive';

export interface EmailModel {
  id: string;
  content: string;
  category: EmailCategory;
  suggestion: string;
  reasoning: string;
  confidence: number;
  createdAt: Date;
}

export interface EmailState {
  currentEmail: EmailModel | null;
  isLoading: boolean;
  error: string | null;
}