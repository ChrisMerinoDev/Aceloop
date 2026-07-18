"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGame, selectReviewQueue } from "@/store/game";
import { QUESTIONS } from "@/content";
import { ACHIEVEMENTS } from "@/content/achievements";
import { nextRank, rankForXp, RANKS } from "@/lib/scoring";
import { todayKey } from "@/lib/utils";
import { PixelBadge, PixelBar, PixelButton, PixelPanel } from "@/components/ui/pixel";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const game = useGame();
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center font-pixel text-[10px] text-ink-dim">
        LOADING STATS<span className="blink">…</span>
      </main>
    );
  }

  const rank = rankForXp(game.xp);
  const next = nextRank(game.xp);
  const prevMin = [...RANKS].reverse().find((r) => r.minXp <= game.xp)?.minXp ?? 0;

  const solved = Object.values(game.progress).filter((p) => p.status === "solved").length;
  const attempts = game.attempts;
  const passRate =
    attempts.length === 0
      ? 0
      : Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100);

  // XP per day, last 14 days.
  const days: { day: string; xp: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    const key = todayKey(d);
    days.push({
      day: key.slice(5),
      xp: attempts
        .filter((a) => a.submittedAt.slice(0, 10) === key)
        .reduce((s, a) => s + a.xpEarned, 0),
    });
  }

  const recentScores = attempts.slice(-20).map((a, i) => ({ n: i + 1, score: a.score }));
  const reviewQueue = selectReviewQueue(game);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 pb-24">
      <h1 className="font-pixel text-xl text-gold text-center">HERO STATS</h1>

      <div className="grid sm:grid-cols-4 gap-3 mt-8">
        <StatCard label="Rank" value={rank} accent="text-gold-2" />
        <StatCard label="Total XP" value={String(game.xp)} accent="text-xpbar" />
        <StatCard label="Streak" value={`🔥 ${game.streakCount}d`} accent="text-hp" />
        <StatCard
          label="Quests Solved"
          value={`${solved}/${QUESTIONS.length}`}
          accent="text-mp"
        />
      </div>

      <PixelPanel title={`Road to ${next?.name ?? "Legend"}`} className="mt-6">
        {next ? (
          <PixelBar
            value={game.xp - prevMin}
            max={next.minXp - prevMin}
            label={`${game.xp} / ${next.minXp} XP`}
          />
        ) : (
          <p className="text-gold-2 font-pixel text-[10px]">
            MAX RANK. You are the final boss now.
          </p>
        )}
        <div className="flex gap-2 mt-3 flex-wrap">
          {RANKS.map((r) => (
            <PixelBadge key={r.name} color={game.xp >= r.minXp ? "gold" : "dim"}>
              {r.name}
            </PixelBadge>
          ))}
        </div>
        <p className="text-ink-dim mt-3">
          Pass rate {passRate}% over {attempts.length} attempts · streak freezes:{" "}
          {"❄️".repeat(game.streakFreezes) || "none"}
        </p>
      </PixelPanel>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <PixelPanel title="XP — last 14 days">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={days}>
                <CartesianGrid stroke="#3c3c64" strokeDasharray="4 4" />
                <XAxis dataKey="day" tick={{ fill: "#9a9ab8", fontSize: 11 }} interval={2} />
                <YAxis tick={{ fill: "#9a9ab8", fontSize: 11 }} width={32} />
                <Tooltip
                  contentStyle={{ background: "#24243e", border: "2px solid #3c3c64" }}
                  labelStyle={{ color: "#e8e8f0" }}
                />
                <Bar dataKey="xp" fill="#92cc41" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PixelPanel>
        <PixelPanel title="Recent scores">
          <div className="h-48">
            {recentScores.length === 0 ? (
              <p className="text-ink-dim grid place-items-center h-full">
                No attempts yet — go fight something.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentScores}>
                  <CartesianGrid stroke="#3c3c64" strokeDasharray="4 4" />
                  <XAxis dataKey="n" tick={{ fill: "#9a9ab8", fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#9a9ab8", fontSize: 11 }} width={32} />
                  <Tooltip
                    contentStyle={{ background: "#24243e", border: "2px solid #3c3c64" }}
                    labelStyle={{ color: "#e8e8f0" }}
                  />
                  <Line type="stepAfter" dataKey="score" stroke="#f8b800" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </PixelPanel>
      </div>

      <PixelPanel title="🏅 Trophy Hall" className="mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ACHIEVEMENTS.map((a) => {
            const earned = a.key in game.achievements;
            return (
              <div
                key={a.key}
                title={a.description}
                className={cn(
                  "border-4 p-3 text-center",
                  earned ? "border-gold bg-gold/10" : "border-border-px bg-panel-2 opacity-50 grayscale"
                )}
              >
                <div className="text-2xl">{a.icon}</div>
                <div className="font-pixel text-[8px] mt-1 leading-relaxed">{a.name}</div>
              </div>
            );
          })}
        </div>
      </PixelPanel>

      {reviewQueue.length > 0 && (
        <PixelPanel title="👻 Review Queue (spaced repetition)" className="mt-6">
          <div className="flex flex-wrap gap-2">
            {reviewQueue.map((slug) => (
              <Link key={slug} href={`/interview/${slug}`}>
                <PixelButton size="sm" variant="purple">
                  {QUESTIONS.find((q) => q.slug === slug)?.title ?? slug}
                </PixelButton>
              </Link>
            ))}
          </div>
        </PixelPanel>
      )}
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="pixel-border bg-panel p-4 text-center">
      <div className="font-pixel text-[8px] text-ink-dim uppercase">{label}</div>
      <div className={`font-pixel text-[14px] mt-2 ${accent}`}>{value}</div>
    </div>
  );
}
