"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Countdown driven by wall-clock time (not tick accumulation) so it stays
 * accurate in background tabs. Fires warnings at 50% / 90% elapsed and
 * onExpire exactly once at zero.
 */
export function useCountdown(opts: {
  totalSeconds: number;
  running: boolean;
  onExpire: () => void;
}) {
  const { totalSeconds, running, onExpire } = opts;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const startRef = useRef<number | null>(null);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    expiredRef.current = false;
    setSecondsLeft(totalSeconds);

    const t = setInterval(() => {
      const elapsed = (Date.now() - (startRef.current ?? Date.now())) / 1000;
      const left = Math.max(0, totalSeconds - elapsed);
      setSecondsLeft(left);
      if (left <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(t);
        onExpireRef.current();
      }
    }, 250);
    return () => clearInterval(t);
  }, [running, totalSeconds]);

  const elapsed = totalSeconds - secondsLeft;
  const fraction = totalSeconds > 0 ? elapsed / totalSeconds : 0;
  return {
    secondsLeft,
    elapsedSeconds: elapsed,
    warn50: fraction >= 0.5,
    warn90: fraction >= 0.9,
  };
}
