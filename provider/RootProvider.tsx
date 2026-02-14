import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";

interface RootProviderProps {
  children?: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
      <ClerkProvider>
      <main className="w-full min-h-dvh bg-background text-foreground flex flex-col items-center">
        <TooltipProvider>
          {children}
        </TooltipProvider>
        </main>
      </ClerkProvider>
  );
};

export default RootProvider;
