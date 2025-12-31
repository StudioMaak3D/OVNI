import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive UFO Map France | GEIPAN Sightings by Department",
  description: "Explore French UFO sightings on an interactive map. Filter by classification, year, and department. Visualize 3,200+ GEIPAN cases across France.",
  keywords: [
    "UFO map France",
    "carte OVNI France",
    "interactive UFO visualization",
    "GEIPAN map",
    "French UFO sightings by region",
    "UAP heat map",
    "département OVNI",
    "unexplained phenomena France",
  ],
  openGraph: {
    title: "Interactive UFO Map France | GEIPAN Database",
    description: "Explore 3,200+ French UFO sightings on an interactive map. Filter by classification, year, and department.",
    url: "https://studiomaak3d.github.io/OVNI/map",
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
