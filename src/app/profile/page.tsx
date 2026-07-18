"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "@/store/settings";
import { useGame } from "@/store/game";
import { useAuth } from "@/lib/supabase/useAuth";
import { getSupabase } from "@/lib/supabase/client";
import { PixelSprite } from "@/components/character/PixelSprite";
import { PixelButton, PixelInput, PixelPanel } from "@/components/ui/pixel";
import type { CharacterConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

const HAIR_STYLES: CharacterConfig["hairStyle"][] = ["spiky", "bowl", "long", "mohawk", "bald"];
const WEAPONS: { id: CharacterConfig["weapon"]; label: string }[] = [
  { id: "laptop", label: "💻 Laptop" },
  { id: "keyboard", label: "⌨️ Keyboard" },
  { id: "coffee", label: "☕ Coffee" },
  { id: "sword", label: "🗡 Sword" },
  { id: "wand", label: "🪄 Wand" },
  { id: "none", label: "✊ Fists" },
];
const HAIR_COLORS = ["#8b4513", "#111111", "#f4d03f", "#c0392b", "#95a5a6", "#8e44ad", "#27ae60"];
const SKIN_TONES = ["#eab88a", "#d9a066", "#a7683f", "#7c4a26", "#f7d7b6"];
const SHIRT_COLORS = ["#2563eb", "#dc2626", "#16a34a", "#7c3aed", "#f59e0b", "#0d9488", "#111827"];
const PANTS_COLORS = ["#374151", "#1e3a8a", "#78350f", "#3f6212", "#111111"];
const SHOE_COLORS = ["#7c2d12", "#111111", "#b91c1c", "#f8f8f8", "#1e40af"];

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { character, setCharacter, characterHidden, toggleCharacterHidden } = useSettings();
  const game = useGame();
  const { user, configured } = useAuth();
  const [name, setName] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setMounted(true);
    setName(useGame.getState().username);
  }, []);

  if (!mounted) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center font-pixel text-[10px] text-ink-dim">
        LOADING HERO<span className="blink">…</span>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 pb-24">
      <h1 className="font-pixel text-xl text-gold text-center">HERO FORGE</h1>

      <div className="grid md:grid-cols-[280px_1fr] gap-6 mt-8">
        {/* Preview */}
        <PixelPanel title="Your Hero" className="text-center h-fit">
          <div className="flex justify-center py-4 bg-panel-2 border-2 border-border-px">
            <PixelSprite config={character} scale={9} />
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <PixelInput
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => name.trim() && game.setUsername(name.trim())}
              aria-label="Hero name"
              className="text-center"
            />
            <PixelButton size="sm" variant="ghost" onClick={toggleCharacterHidden}>
              {characterHidden ? "Show hero on screen" : "Hide hero on screen"}
            </PixelButton>
          </div>
        </PixelPanel>

        {/* Customizer */}
        <div className="space-y-4">
          <PixelPanel title="Hairstyle">
            <div className="flex flex-wrap gap-2">
              {HAIR_STYLES.map((h) => (
                <PixelButton
                  key={h}
                  size="sm"
                  variant={character.hairStyle === h ? "gold" : "ghost"}
                  onClick={() => setCharacter({ hairStyle: h })}
                >
                  {h}
                </PixelButton>
              ))}
            </div>
            <Swatches
              label="Hair color"
              colors={HAIR_COLORS}
              value={character.hairColor}
              onPick={(c) => setCharacter({ hairColor: c })}
            />
            <Swatches
              label="Skin tone"
              colors={SKIN_TONES}
              value={character.skinTone}
              onPick={(c) => setCharacter({ skinTone: c })}
            />
          </PixelPanel>

          <PixelPanel title="Outfit">
            <Swatches
              label="Shirt"
              colors={SHIRT_COLORS}
              value={character.shirtColor}
              onPick={(c) => setCharacter({ shirtColor: c })}
            />
            <Swatches
              label="Pants"
              colors={PANTS_COLORS}
              value={character.pantsColor}
              onPick={(c) => setCharacter({ pantsColor: c })}
            />
            <Swatches
              label="Shoes"
              colors={SHOE_COLORS}
              value={character.shoesColor}
              onPick={(c) => setCharacter({ shoesColor: c })}
            />
          </PixelPanel>

          <PixelPanel title="Weapon of Choice">
            <div className="flex flex-wrap gap-2">
              {WEAPONS.map((w) => (
                <PixelButton
                  key={w.id}
                  size="sm"
                  variant={character.weapon === w.id ? "gold" : "ghost"}
                  onClick={() => setCharacter({ weapon: w.id })}
                >
                  {w.label}
                </PixelButton>
              ))}
            </div>
            <p className="text-ink-dim mt-3">
              Tip: turn on <span className="text-xpbar">Game Mode</span> in the
              top bar, then walk your hero around with WASD or the arrow keys.
            </p>
          </PixelPanel>

          <PixelPanel title="Account">
            {!configured ? (
              <p className="text-ink-dim">
                Playing in guest mode — progress lives in this browser. Add
                Supabase keys (see README) to enable cloud saves and the
                leaderboard.
              </p>
            ) : user ? (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-ink">{user.email}</span>
                <PixelButton
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await getSupabase()?.auth.signOut();
                  }}
                >
                  Sign Out
                </PixelButton>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-ink-dim">Guest mode — sign in to save to the cloud.</span>
                <Link href="/auth">
                  <PixelButton size="sm">Sign In</PixelButton>
                </Link>
              </div>
            )}
            <div className="mt-4 border-t-2 border-border-px pt-3">
              {confirmReset ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-hp">Erase all local progress?</span>
                  <PixelButton
                    size="sm"
                    variant="red"
                    onClick={() => {
                      game.resetAll();
                      setConfirmReset(false);
                    }}
                  >
                    Yes, wipe it
                  </PixelButton>
                  <PixelButton size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                    Cancel
                  </PixelButton>
                </div>
              ) : (
                <PixelButton size="sm" variant="ghost" onClick={() => setConfirmReset(true)}>
                  Reset local progress
                </PixelButton>
              )}
            </div>
          </PixelPanel>
        </div>
      </div>
    </main>
  );
}

function Swatches({
  label,
  colors,
  value,
  onPick,
}: {
  label: string;
  colors: string[];
  value: string;
  onPick: (c: string) => void;
}) {
  return (
    <div className="mt-3">
      <div className="font-pixel text-[8px] text-ink-dim uppercase mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c}
            aria-label={`${label} ${c}`}
            onClick={() => onPick(c)}
            className={cn(
              "w-8 h-8 border-4",
              value === c ? "border-gold" : "border-black"
            )}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}
