'use client';

import '@/styles/technical-map.css';

export default function TechnicalGrid() {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
    >
      {/* Vertical grid lines */}
      {Array.from({ length: 20 }, (_, i) => i * 5).map((x) => (
        <line
          key={`v-${x}`}
          x1={`${x}%`}
          y1="0"
          x2={`${x}%`}
          y2="100%"
          className="grid-line"
        />
      ))}

      {/* Horizontal grid lines */}
      {Array.from({ length: 20 }, (_, i) => i * 5).map((y) => (
        <line
          key={`h-${y}`}
          x1="0"
          y1={`${y}%`}
          x2="100%"
          y2={`${y}%`}
          className="grid-line"
        />
      ))}

      {/* Corner brackets - Top Left */}
      <g className="corner-bracket">
        <path d="M 30,30 L 30,80" />
        <path d="M 30,30 L 80,30" />
      </g>

      {/* Technical annotations */}
      <text
        x="20"
        y="25"
        className="terminal-text text-tech-grey"
        fontSize="10"
        opacity="0.6"
      >
        LAT: 47°N
      </text>
      <text
        x="20"
        y="40"
        className="terminal-text text-tech-grey"
        fontSize="10"
        opacity="0.6"
      >
        LON: 2.5°E
      </text>

      {/* Scale marker */}
      <text
        x="20"
        y="96%"
        className="terminal-text text-tech-grey"
        fontSize="10"
        opacity="0.6"
      >
        SCALE: 1:1900
      </text>
    </svg>
  );
}
