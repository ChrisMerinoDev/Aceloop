"use client";

import { useMemo } from "react";
import type { CharacterConfig } from "@/lib/types";

/**
 * 16x22 pixel-map hero sprite rendered as SVG rects.
 * Map legend: . empty, S skin, E eye, T shirt, A arm(skin), P pants,
 * O shoes, H hair. Weapons are drawn from absolute pixel lists.
 */
const BASE: string[] = [
  "................",
  "................",
  ".....SSSSSS.....",
  "....SSSSSSSS....",
  "....SSSSSSSS....",
  "....SESSSSES....",
  "....SSSSSSSS....",
  ".....SSSSSS.....",
  "......SSSS......",
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "...ATTTTTTTTA...",
  "...ATTTTTTTTA...",
  "....TTTTTTTT....",
  "....TTTTTTTT....",
  ".....PPPPPP.....",
  ".....PPPPPP.....",
  ".....PP..PP.....",
  ".....PP..PP.....",
  ".....PP..PP.....",
  "....OOO..OOO....",
  "....OOO..OOO....",
];

/** Walking frame: legs apart, arms swing. */
const WALK_LEGS: string[] = [
  "....PPP..PPP....",
  "....PPP..PPP....",
  "...PPP....PPP...",
  "...PP......PP...",
  "...PP......PP...",
  "..OOO......OOO..",
  "..OOO......OOO..",
];

const HAIR: Record<CharacterConfig["hairStyle"], string[]> = {
  spiky: [
    "....H.HH.H.H....",
    "...HHHHHHHHHH...",
    "...HHHHHHHHHH...",
    "....HHHHHHHH....",
    "....HH....HH....",
  ],
  bowl: [
    "................",
    ".....HHHHHH.....",
    "....HHHHHHHH....",
    "....HHHHHHHH....",
    "....HH....HH....",
  ],
  long: [
    "................",
    ".....HHHHHH.....",
    "....HHHHHHHH....",
    "...HHHHHHHHHH...",
    "...HH......HH...",
    "...HH......HH...",
    "...HH......HH...",
    "...H........H...",
  ],
  mohawk: [
    "......HHHH......",
    "......HHHH......",
    "......HHHH......",
    "....S.HHHH.S....",
    "................",
  ],
  bald: [],
};

type Px = [number, number, string];

function weaponPixels(weapon: CharacterConfig["weapon"]): Px[] {
  switch (weapon) {
    case "laptop":
      return [
        // held to the hero's right (viewer left), rows 10-13
        [0, 9, "#9ca3af"], [1, 9, "#9ca3af"], [2, 9, "#9ca3af"],
        [0, 10, "#9ca3af"], [1, 10, "#38bdf8"], [2, 10, "#9ca3af"],
        [0, 11, "#9ca3af"], [1, 11, "#38bdf8"], [2, 11, "#9ca3af"],
        [0, 12, "#6b7280"], [1, 12, "#6b7280"], [2, 12, "#6b7280"],
      ];
    case "keyboard":
      return [
        [0, 11, "#374151"], [1, 11, "#374151"], [2, 11, "#374151"], [3, 11, "#374151"],
        [0, 12, "#e5e7eb"], [1, 12, "#9ca3af"], [2, 12, "#e5e7eb"], [3, 12, "#9ca3af"],
      ];
    case "coffee":
      return [
        [1, 9, "#f5f5f4"], [2, 9, "#f5f5f4"],
        [1, 10, "#78350f"], [2, 10, "#78350f"], [3, 10, "#f5f5f4"],
        [1, 11, "#f5f5f4"], [2, 11, "#f5f5f4"], [3, 11, "#f5f5f4"],
        [1, 8, "#d6d3d1"], [2, 8, "#d6d3d1"],
      ];
    case "sword":
      return [
        [1, 5, "#e5e7eb"], [1, 6, "#e5e7eb"], [1, 7, "#e5e7eb"], [1, 8, "#e5e7eb"],
        [1, 9, "#e5e7eb"], [0, 10, "#f8b800"], [1, 10, "#f8b800"], [2, 10, "#f8b800"],
        [1, 11, "#92400e"], [1, 12, "#92400e"],
      ];
    case "wand":
      return [
        [1, 6, "#fde047"], [0, 7, "#fde047"], [2, 7, "#fde047"], [1, 7, "#fff"],
        [1, 8, "#fde047"],
        [1, 9, "#7c3aed"], [1, 10, "#7c3aed"], [1, 11, "#7c3aed"], [1, 12, "#7c3aed"],
      ];
    case "none":
      return [];
  }
}

export function PixelSprite({
  config,
  scale = 4,
  walking = false,
  facing = "right",
  className,
}: {
  config: CharacterConfig;
  scale?: number;
  walking?: boolean;
  facing?: "left" | "right";
  className?: string;
}) {
  const pixels = useMemo(() => {
    const grid: (string | null)[][] = BASE.map((row) =>
      row.split("").map((c) => {
        switch (c) {
          case "S":
          case "A":
            return config.skinTone;
          case "E":
            return "#1c1917";
          case "T":
            return config.shirtColor;
          case "P":
            return config.pantsColor;
          case "O":
            return config.shoesColor;
          default:
            return null;
        }
      })
    );

    if (walking) {
      // Replace rows 15-21 with the stride frame.
      for (let i = 0; i < WALK_LEGS.length; i++) {
        grid[15 + i] = WALK_LEGS[i].split("").map((c) => {
          if (c === "P") return config.pantsColor;
          if (c === "O") return config.shoesColor;
          return null;
        });
      }
    }

    const hair = HAIR[config.hairStyle];
    for (let y = 0; y < hair.length; y++) {
      const row = hair[y];
      for (let x = 0; x < row.length; x++) {
        if (row[x] === "H") grid[y][x] = config.hairColor;
        if (row[x] === "S") grid[y][x] = config.skinTone;
      }
    }

    const out: Px[] = [];
    grid.forEach((row, y) =>
      row.forEach((color, x) => {
        if (color) out.push([x, y, color]);
      })
    );
    for (const [x, y, c] of weaponPixels(config.weapon)) out.push([x, y, c]);
    return out;
  }, [config, walking]);

  const W = 16;
  const H = 22;

  return (
    <svg
      width={W * scale}
      height={H * scale}
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      className={className}
      style={{
        imageRendering: "pixelated",
        transform: facing === "left" ? "scaleX(-1)" : undefined,
      }}
      aria-label="your 8-bit hero"
      role="img"
    >
      {pixels.map(([x, y, color], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={color} />
      ))}
    </svg>
  );
}
