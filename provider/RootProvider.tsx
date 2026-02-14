import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";

interface RootProviderProps {
  children?: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <ClerkProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ClerkProvider>
  );
};

export default RootProvider;
