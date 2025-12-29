import type { Metadata } from "next";
import MobileWarning from "@/components/MobileWarning";
import ChunkErrorHandler from "@/components/ChunkErrorHandler";
import "./globals.css";

export const metadata: Metadata = {
  title: "OVNI Explorer - French UFO Observations",
  description: "Explore and visualize French OVNI observations from GEIPAN - Interactive database with AI-generated reconstructions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ChunkErrorHandler />
        <MobileWarning />
        {children}
      </body>
    </html>
  );
}
