import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

interface RootProviderProps {
  children?: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
      <ClerkProvider>
        <main className="w-full min-h-dvh bg-background text-foreground flex flex-col items-center">
          {children}
        </main>
      </ClerkProvider>
  );
};

export default RootProvider;
