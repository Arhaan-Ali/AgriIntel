import "./globals.css";
import type { Metadata } from "next";
import RootProvider from "@/provider/RootProvider";
import { ThemeProvider } from "@/provider/theme-provider";

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
          <ThemeProvider>{children}</ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
