import { ImageResponse } from "next/og";

// The browser-tab icon reuses the sword that marks an unlocked level
// (lvl.1 — Novice Meadows) in the Arena.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 26,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        🗡
      </div>
    ),
    { ...size, emoji: "twemoji" }
  );
}
