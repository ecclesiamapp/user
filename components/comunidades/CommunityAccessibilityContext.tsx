'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type FontScale = 'normal' | 'large' | 'xlarge';

interface CommunityAccessibilityContextType {
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
}

const CommunityAccessibilityContext = createContext<CommunityAccessibilityContextType>({
  fontScale: 'normal',
  setFontScale: () => {},
});

export const useCommunityAccessibility = () => useContext(CommunityAccessibilityContext);

interface CommunityAccessibilityProviderProps {
  children: React.ReactNode;
}

export function CommunityAccessibilityProvider({ children }: CommunityAccessibilityProviderProps) {
  const [fontScale, setFontScaleState] = useState<FontScale>('normal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('ecclesiam_community_font_scale') as FontScale;
      if (saved && (saved === 'normal' || saved === 'large' || saved === 'xlarge')) {
        setFontScaleState(saved);
      }
    } catch {
      // localStorage may fail in restricted/private modes
    }
  }, []);

  const setFontScale = (scale: FontScale) => {
    setFontScaleState(scale);
    try {
      localStorage.setItem('ecclesiam_community_font_scale', scale);
    } catch {
      // ignore
    }
  };

  const scaleClass =
    fontScale === 'large'
      ? 'scale-accessibility-large'
      : fontScale === 'xlarge'
      ? 'scale-accessibility-xlarge'
      : 'scale-accessibility-normal';

  return (
    <CommunityAccessibilityContext.Provider value={{ fontScale, setFontScale }}>
      <div data-font-scale={fontScale} className={`transition-[font-size] duration-200 ${scaleClass}`}>
        {children}
      </div>
    </CommunityAccessibilityContext.Provider>
  );
}
