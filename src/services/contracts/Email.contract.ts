import { EmailCategory } from "@/src/types/Email";

export interface ClassifyRequest {
  content?: string;
  file?: File;
  language?: string;
}

export interface Classification {
  category: EmailCategory;
  confidence: number;
  suggested_response: string;
  reasoning: string;
  processed_at: string;
}

export interface ClassifyFileResponse {
  filename: string;
  size: number;
  content_extracted: string;
  classification: Classification;
}

export interface ClassifyTextResponse {
  category: EmailCategory;
  confidence: number;
  suggested_response: string;
  reasoning: string;
  processed_at: string;
}

export type ClassifyResponse = ClassifyFileResponse | ClassifyTextResponse;
