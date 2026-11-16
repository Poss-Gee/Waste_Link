import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WasteAppProvider } from "@/context/WasteAppContext";
import DemoBanner from "@/components/common/DemoBanner";

export const metadata: Metadata = {
  title: "WasteLink Ghana — Smart Household Waste Collection & Negotiated Payments",
  description: "Connecting Homes. Empowering Collectors. Cleaner Communities. Independent tricycle waste collection platform in Ghana.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#14532D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-[#F7F9F5] text-[#17231B] antialiased flex flex-col selection:bg-eco-light selection:text-forest">
        <WasteAppProvider>
          <DemoBanner />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </WasteAppProvider>
      </body>
    </html>
  );
}
