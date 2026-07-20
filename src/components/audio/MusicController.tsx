"use client";

import { useEffect } from "react";
import { useSettings } from "@/store/settings";
import { chiptune } from "./chiptune";

/** Starts/stops the background theme and switches tracks from settings. */
export function MusicController() {
  const muted = useSettings((s) => s.muted);
  const musicTrack = useSettings((s) => s.musicTrack);

  // Keep the engine's active track in sync with the setting (works while playing).
  useEffect(() => {
    chiptune.setTrack(musicTrack);
  }, [musicTrack]);

  useEffect(() => {
    if (muted) {
      chiptune.stop();
    } else {
      chiptune.start();
    }
    return () => chiptune.stop();
  }, [muted]);

  return null;
}
