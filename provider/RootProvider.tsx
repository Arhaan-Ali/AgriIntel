import React from "react";
import { ThemeProvider } from "./theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

interface RootProviderProps {
  children?: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem >
      <ClerkProvider>
        <main className="w-full min-h-dvh bg-background text-foreground flex flex-col items-center">
          {children}
        </main>
      </ClerkProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
