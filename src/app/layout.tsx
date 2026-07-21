import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { CharacterOverlay } from "@/components/character/CharacterOverlay";
import { MusicController } from "@/components/audio/MusicController";
import { LogoutCorner } from "@/components/LogoutCorner";

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AceLoop, 8-bit Interview Quest",
  description:
    "A retro RPG that trains you on the most-asked DSA and senior frontend interview questions. Solve timed challenges, earn XP, level up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart.variable} ${vt323.variable} antialiased scanlines min-h-screen`}
      >
        <Nav />
        {children}
        <CharacterOverlay />
        <MusicController />
        <LogoutCorner />
      </body>
    </html>
  );
}
