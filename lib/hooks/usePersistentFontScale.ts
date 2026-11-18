'use client';

import { useState, useEffect, useCallback } from 'react';

export type FontSizeLevel = 'sm' | 'md' | 'lg';

const STORAGE_KEY = 'ecclesiam_font_scale_v1';
const STORAGE_VERSION = 1;

const SCALE_PERCENT_MAP: Record<FontSizeLevel, string> = {
  sm: '87.5%',
  md: '100%',
  lg: '112.5%',
};

function applyRootFontScale(level: FontSizeLevel): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (level === 'md') {
    root.style.fontSize = '';
  } else {
    root.style.fontSize = SCALE_PERCENT_MAP[level];
  }
}

function readStoredFontScale(): FontSizeLevel {
  if (typeof window === 'undefined') return 'md';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 'md';
    const parsed = JSON.parse(raw) as { v?: number; level?: string };
    if (
      parsed.v === STORAGE_VERSION &&
      (parsed.level === 'sm' || parsed.level === 'md' || parsed.level === 'lg')
    ) {
      return parsed.level;
    }
  } catch {
    // Fallback silencioso em navegadores restritos
  }
  return 'md';
}

/**
 * [TASK-58] Hook com persistência versionada do controle A- / A / A+ em escala relativa (%).
 */
export function usePersistentFontScale() {
  const [fontSizeLevel, setFontSizeLevel] = useState<FontSizeLevel>('md');

  useEffect(() => {
    const saved = readStoredFontScale();
    if (saved !== 'md') {
      setFontSizeLevel(saved);
    }
    applyRootFontScale(saved);
  }, []);

  const handleFontSizeChange = useCallback((level: FontSizeLevel) => {
    setFontSizeLevel(level);
    applyRootFontScale(level);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ v: STORAGE_VERSION, level })
      );
    } catch {
      // Ignora erro de cota em modo anônimo
    }
  }, []);

  return { fontSizeLevel, handleFontSizeChange };
}
