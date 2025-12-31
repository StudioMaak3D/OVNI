import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UFO Sightings Database List | Search French GEIPAN Cases",
  description: "Search and filter 3,200+ French UFO cases. Advanced filters by shape, color, classification, and witness testimonies. Official GEIPAN database.",
  keywords: [
    "UFO database search",
    "recherche OVNI France",
    "GEIPAN case list",
    "UFO sightings filter",
    "witness testimonies UFO",
    "témoignages OVNI",
    "UAP case database",
    "French UFO archive",
  ],
  openGraph: {
    title: "UFO Sightings Database | Search GEIPAN Cases",
    description: "Search and filter 3,200+ French UFO cases with advanced filters. Explore witness testimonies and detailed reports.",
    url: "https://studiomaak3d.github.io/OVNI/map/list",
  },
};

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
