import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import RootProvider from "@/provider/RootProvider";


export const metadata: Metadata = {
  title: "App",
  description: "Your application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className="antialiased w-full min-h-dvh bg-background text-neutral-900">
          <RootProvider>
            {children}
          </RootProvider>
        </body>
      </html>
  );
}
