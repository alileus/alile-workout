'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { defaultBodyVariant, type BodyVariant } from '../body-variants';

const BodyVariantContext = createContext<{
  bodyVariant: BodyVariant;
  setBodyVariant: (variant: BodyVariant) => void;
} | null>(null);

export function BodyVariantProvider({ children }: { children: ReactNode }) {
  const [bodyVariant, setBodyVariant] = useState<BodyVariant>(defaultBodyVariant);
  return (
    <BodyVariantContext.Provider value={{ bodyVariant, setBodyVariant }}>
      {children}
    </BodyVariantContext.Provider>
  );
}

export function useBodyVariant() {
  const value = useContext(BodyVariantContext);
  if (!value) throw new Error('Body variant controls require BodyVariantProvider.');
  return value;
}
