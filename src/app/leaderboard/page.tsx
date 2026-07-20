"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/client";
import { useGame } from "@/store/game";
import { rankForXp } from "@/lib/scoring";
import { PixelBadge, PixelButton, PixelPanel } from "@/components/ui/pixel";
import { cn } from "@/lib/utils";

interface Row {
  id: string;
  username: string;
  xp: number;
  rank: string;
  streak_count: number;
}

// Module-level cache survives navigation, so returning to this page (or
// toggling scope) paints instantly and only hits the network when stale.
const cache: Partial<Record<"global" | "weekly", { rows: Row[]; at: number }>> = {};
const CACHE_TTL = 60_000; // 1 min

export default function LeaderboardPage() {
  const [scope, setScope] = useState<"global" | "weekly">("global");
  const [rows, setRows] = useState<Row[] | null>(() => cache.global?.rows ?? null);
  const [error, setError] = useState(false);
  const game = useGame();
  const configured = supabaseConfigured();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    let cancelled = false;
    setError(false);

    const cached = cache[scope];
    // Paint cached data immediately (no loading flash); refetch below unless fresh.
    setRows(cached?.rows ?? null);
    if (cached && Date.now() - cached.at < CACHE_TTL) return;

    const load = async () => {
      try {
        if (scope === "global") {
          const { data, error } = await sb
            .from("profiles")
            .select("id, username, xp, rank, streak_count")
            .order("xp", { ascending: false })
            .limit(50);
          if (error) throw error;
          const list = (data as Row[]) ?? [];
          cache.global = { rows: list, at: Date.now() };
          if (!cancelled) setRows(list);
        } else {
          // Weekly: sum xp_earned from this week's attempts, joined to profiles.
          const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
          const { data, error } = await sb
            .from("attempts")
            .select("user_id, xp_earned, submitted_at")
            .gte("submitted_at", weekAgo)
            .limit(2000);
          if (error) throw error;
          const totals = new Map<string, number>();
          for (const a of data ?? []) {
            totals.set(a.user_id, (totals.get(a.user_id) ?? 0) + (a.xp_earned ?? 0));
          }
          const ids = [...totals.keys()];
          if (ids.length === 0) {
            cache.weekly = { rows: [], at: Date.now() };
            if (!cancelled) setRows([]);
            return;
          }
          const { data: profiles } = await sb
            .from("profiles")
            .select("id, username, rank, streak_count")
            .in("id", ids);
          const list: Row[] = (profiles ?? []).map((p) => ({
            id: p.id,
            username: p.username,
            rank: p.rank,
            streak_count: p.streak_count,
            xp: totals.get(p.id) ?? 0,
          }));
          list.sort((a, b) => b.xp - a.xp);
          const top = list.slice(0, 50);
          cache.weekly = { rows: top, at: Date.now() };
          if (!cancelled) setRows(top);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setRows([]);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [scope]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 pb-24">
      <h1 className="font-pixel text-xl text-gold text-center">HALL OF HEROES</h1>

      <div className="flex justify-center gap-2 mt-6">
        <PixelButton
          size="sm"
          variant={scope === "global" ? "gold" : "ghost"}
          onClick={() => setScope("global")}
        >
          All-Time
        </PixelButton>
        <PixelButton
          size="sm"
          variant={scope === "weekly" ? "gold" : "ghost"}
          onClick={() => setScope("weekly")}
        >
          This Week
        </PixelButton>
      </div>

      {!configured ? (
        <PixelPanel title="Offline Arena" className="mt-8 text-center">
          <p className="text-ink-dim">
            The global leaderboard needs Supabase configured (see the README).
            Meanwhile, here&apos;s your local legend:
          </p>
          <div className="mt-4 font-pixel text-[12px] text-gold-2">
            {game.username} — {game.xp} XP — {rankForXp(game.xp)}
          </div>
        </PixelPanel>
      ) : rows === null ? (
        <p className="text-center font-pixel text-[10px] text-ink-dim mt-10">
          SUMMONING HEROES<span className="blink">…</span>
        </p>
      ) : error ? (
        <PixelPanel className="mt-8 text-center">
          <p className="text-hp">Couldn&apos;t reach the Hall. Try again shortly.</p>
        </PixelPanel>
      ) : rows.length === 0 ? (
        <PixelPanel className="mt-8 text-center">
          <p className="text-ink-dim">
            The Hall is empty {scope === "weekly" ? "this week " : ""}— be the first hero on the board.
          </p>
          <Link href="/arena" className="inline-block mt-3">
            <PixelButton>Enter the Arena</PixelButton>
          </Link>
        </PixelPanel>
      ) : (
        <div className="mt-8 space-y-1">
          {rows.map((r, i) => (
            <div
              key={r.id}
              className={cn(
                "flex items-center gap-3 border-4 px-3 py-2",
                i === 0
                  ? "border-gold bg-gold/10"
                  : i < 3
                  ? "border-gold/50 bg-panel"
                  : "border-border-px bg-panel"
              )}
            >
              <span className="font-pixel text-[11px] w-8 text-ink-dim">
                {i === 0 ? "👑" : `#${i + 1}`}
              </span>
              <span className="flex-1 text-lg">{r.username}</span>
              <span className="font-pixel text-[9px] text-hp">🔥{r.streak_count}</span>
              <PixelBadge color="dim">{r.rank}</PixelBadge>
              <span className="font-pixel text-[11px] text-xpbar w-20 text-right">
                {r.xp} XP
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
