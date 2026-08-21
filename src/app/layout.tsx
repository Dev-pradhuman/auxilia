import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/layout/AppProvider";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auxilia - Accessibility Companion",
  description: "One app. A more accessible world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen flex flex-col antialiased selection:bg-primary/20`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppProvider>
              <div className="flex-1 relative flex flex-col max-w-md mx-auto w-full bg-background shadow-2xl min-h-screen">
                <main className="flex-1 overflow-y-auto pb-28 custom-scrollbar">
                  {children}
                </main>
                <BottomNavigation />
              </div>
            </AppProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
