"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CharacterConfig } from "@/lib/types";

export const DEFAULT_CHARACTER: CharacterConfig = {
  hairStyle: "spiky",
  hairColor: "#8b4513",
  skinTone: "#eab88a",
  shirtColor: "#2563eb",
  pantsColor: "#374151",
  shoesColor: "#7c2d12",
  weapon: "laptop",
};

interface SettingsState {
  muted: boolean;
  gameMode: boolean;
  characterHidden: boolean;
  /** Hides the floating corner log-out button (re-enable from Profile). */
  logoutCornerHidden: boolean;
  character: CharacterConfig;
  toggleMuted: () => void;
  toggleGameMode: () => void;
  toggleCharacterHidden: () => void;
  toggleLogoutCorner: () => void;
  setCharacter: (patch: Partial<CharacterConfig>) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      muted: true,
      gameMode: false,
      characterHidden: false,
      logoutCornerHidden: false,
      character: DEFAULT_CHARACTER,
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
      toggleGameMode: () => set((s) => ({ gameMode: !s.gameMode })),
      toggleCharacterHidden: () =>
        set((s) => ({ characterHidden: !s.characterHidden })),
      toggleLogoutCorner: () =>
        set((s) => ({ logoutCornerHidden: !s.logoutCornerHidden })),
      setCharacter: (patch) =>
        set((s) => ({ character: { ...s.character, ...patch } })),
    }),
    { name: "aceloop-settings" }
  )
);
