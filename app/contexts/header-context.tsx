// context/header-context.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface HeaderContextType {
  headerVisible: boolean;
  setHeaderVisible: (v: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  headerVisible: true,
  setHeaderVisible: () => {},
});

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerVisible, setHeaderVisible] = useState(true);
  return (
    <HeaderContext.Provider value={{ headerVisible, setHeaderVisible }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  return useContext(HeaderContext);
}