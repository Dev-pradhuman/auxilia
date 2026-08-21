import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/layout/AppProvider";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auxilia - Adaptive Universal Reality Assistant",
  description: "One app. A more accessible world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AppProvider>
          <main className="flex-1 overflow-y-auto pb-20">
            {children}
          </main>
          <BottomNavigation />
        </AppProvider>
      </body>
    </html>
  );
}
