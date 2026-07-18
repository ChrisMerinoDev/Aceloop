"use client";

import { useEffect } from "react";
import { useSettings } from "@/store/settings";
import { chiptune } from "./chiptune";

/** Starts/stops the background theme when the mute toggle changes. */
export function MusicController() {
  const muted = useSettings((s) => s.muted);

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
