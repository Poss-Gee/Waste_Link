import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WasteLink Ghana — Smart Household Waste Collection & Negotiated Payments",
  description: "Connecting Homes. Empowering Collectors. Cleaner Communities. Independent tricycle waste collection platform in Ghana.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#123B66",
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
        <link rel="icon" href="/logo-symbol.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-symbol.png" />
      </head>
      <body className="min-h-screen bg-[#F5F8FC] text-[#172B43] antialiased flex flex-col selection:bg-[#DBEAFE] selection:text-[#123B66]">
        {children}
      </body>
    </html>
  );
}
