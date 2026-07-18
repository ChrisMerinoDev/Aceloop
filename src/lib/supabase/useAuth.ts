"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured } from "./client";
import { loadRemoteState } from "./sync";
import { useGame } from "@/store/game";

/**
 * Tracks the Supabase session and hydrates the game store from the
 * user's saved progress when they sign in.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured());
  const setUserId = useGame((s) => s.setUserId);
  const hydrate = useGame((s) => s.hydrateFromRemote);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const apply = async (u: User | null) => {
      if (cancelled) return;
      setUser(u);
      setUserId(u?.id ?? null);
      if (u) {
        const remote = await loadRemoteState(u.id);
        if (remote && !cancelled) {
          // Remote wins if it has more XP than local guest progress.
          const localXp = useGame.getState().xp;
          if (remote.xp >= localXp) hydrate(remote);
        }
      }
      setLoading(false);
    };

    void sb.auth.getUser().then(({ data }) => apply(data.user));
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      void apply(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [setUserId, hydrate]);

  return { user, loading, configured: supabaseConfigured() };
}
