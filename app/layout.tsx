import type { Metadata } from "next";
import MobileWarning from "@/components/MobileWarning";
import ChunkErrorHandler from "@/components/ChunkErrorHandler";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "OVNI Explorer - French UFO/UAP Database | GEIPAN Sightings Visualization",
  description: "Explore 3,200+ official French UFO sightings from GEIPAN. Interactive map, AI-generated 3D reconstructions, and detailed witness testimonies of unexplained aerial phenomena.",
  keywords: [
    // English keywords
    "UFO sightings",
    "UAP database",
    "French UFO reports",
    "GEIPAN data",
    "UFO visualization",
    "unexplained aerial phenomena",
    "UFO interactive map",
    "witness testimonies",
    "3D UFO reconstruction",
    "official UFO database",
    // French keywords
    "observations OVNI",
    "phénomènes aérospatiaux non identifiés",
    "base de données OVNI France",
    "GEIPAN",
    "carte interactive OVNI",
    "témoignages OVNI",
    "visualisation données UFO",
    "phénomènes inexpliqués",
    "PAN France",
  ],
  authors: [{ name: "OVNI Explorer" }],
  creator: "OVNI Explorer",
  publisher: "OVNI Explorer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: "https://studiomaak3d.github.io/OVNI/",
    siteName: "OVNI Explorer",
    title: "OVNI Explorer - French UFO/UAP Database | GEIPAN Official Data",
    description: "Explore 3,200+ official French UFO sightings from GEIPAN. Interactive map, AI-generated 3D reconstructions, and detailed witness testimonies.",
    images: [
      {
        url: "https://studiomaak3d.github.io/OVNI/og-image.png",
        width: 1200,
        height: 630,
        alt: "OVNI Explorer - French UFO Database Visualization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OVNI Explorer - French UFO/UAP Database",
    description: "Explore 3,200+ official French UFO sightings with interactive visualization and AI-generated 3D reconstructions.",
    images: ["https://studiomaak3d.github.io/OVNI/og-image.png"],
  },
  alternates: {
    canonical: "https://studiomaak3d.github.io/OVNI/",
    languages: {
      'fr': 'https://studiomaak3d.github.io/OVNI/',
      'en': 'https://studiomaak3d.github.io/OVNI/',
    },
  },
  verification: {
    google: "tqRHhG05OB2--AcFFEZdJ1o01l3bQ-Gd8LfBYMTAjBA",
  },
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
        <ClientProviders>
          <ChunkErrorHandler />
          <MobileWarning />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
