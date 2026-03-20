import type { ReactNode } from 'react';

export interface Product {
  tagline?: ReactNode;
  id: string;
  name: string;
  title: string;
  price?: number;
  subtitle?: string;
  description: string;
  images?: string[];
  imageAlts?: string[];
  features?: string[];
  specs?: { label: string; value: string }[];
  aiPromptDescription?: string;
  isMultiSpeaker?: boolean;
}
