import React, { createContext, useContext, useMemo, useState } from 'react';

interface AppThemeContextValue {
  dark: boolean;
  setDark: (dark: boolean) => void;
  toggleDark: () => void;
}

const AppThemeCtx = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);

  const value = useMemo(
    () => ({
      dark,
      setDark,
      toggleDark: () => setDark((d) => !d),
    }),
    [dark],
  );

  return <AppThemeCtx.Provider value={value}>{children}</AppThemeCtx.Provider>;
}

export function useAppTheme(): AppThemeContextValue {
  const ctx = useContext(AppThemeCtx);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
}
