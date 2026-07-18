"use client";

import type { AttemptRecord, QuestionProgress, RankName } from "@/lib/types";
import { rankForXp } from "@/lib/scoring";
import { getSupabase } from "./client";

interface SyncableState {
  userId: string | null;
  username: string;
  xp: number;
  streakCount: number;
  streakFreezes: number;
  lastActiveDay: string | null;
  achievements: Record<string, string>;
  progress: Record<string, QuestionProgress>;
}

/** Push profile fields (xp, streak, rank) to Supabase. No-op for guests. */
export async function syncProfile(s: SyncableState): Promise<void> {
  const sb = getSupabase();
  if (!sb || !s.userId) return;
  try {
    await sb.from("profiles").upsert({
      id: s.userId,
      username: s.username,
      xp: s.xp,
      rank: rankForXp(s.xp) satisfies RankName,
      streak_count: s.streakCount,
      streak_freezes: s.streakFreezes,
      last_active_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("[sync] profile push failed", e);
  }
}

/** Persist an attempt + per-question progress after a submit. */
export async function syncAfterAttempt(
  s: SyncableState,
  attempt: AttemptRecord,
  slug: string
): Promise<void> {
  const sb = getSupabase();
  if (!sb || !s.userId) return;
  try {
    await Promise.all([
      sb.from("attempts").insert({
        user_id: s.userId,
        question_slug: attempt.questionSlug,
        passed: attempt.passed,
        score: attempt.score,
        tests_passed: attempt.testsPassed,
        tests_total: attempt.testsTotal,
        time_taken_seconds: attempt.timeTakenSeconds,
        xp_earned: attempt.xpEarned,
        submitted_at: attempt.submittedAt,
      }),
      sb.from("progress").upsert({
        user_id: s.userId,
        question_slug: slug,
        status: s.progress[slug]?.status ?? "unlocked",
        best_score: s.progress[slug]?.bestScore ?? 0,
        times_attempted: s.progress[slug]?.timesAttempted ?? 1,
        last_attempted_at: s.progress[slug]?.lastAttemptedAt,
        review_due_at: s.progress[slug]?.reviewDueAt,
      }),
      syncProfile(s),
    ]);
  } catch (e) {
    console.warn("[sync] attempt push failed", e);
  }
}

export interface RemoteState {
  username: string;
  xp: number;
  streakCount: number;
  streakFreezes: number;
  progress: Record<string, QuestionProgress>;
  attempts: AttemptRecord[];
}

/** Pull the signed-in user's saved state; used on login to hydrate the store. */
export async function loadRemoteState(userId: string): Promise<RemoteState | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const [profileRes, progressRes, attemptsRes] = await Promise.all([
      sb.from("profiles").select("*").eq("id", userId).maybeSingle(),
      sb.from("progress").select("*").eq("user_id", userId),
      sb
        .from("attempts")
        .select("*")
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false })
        .limit(200),
    ]);
    const p = profileRes.data;
    if (!p) return null;

    const progress: Record<string, QuestionProgress> = {};
    for (const row of progressRes.data ?? []) {
      progress[row.question_slug as string] = {
        status: row.status,
        bestScore: row.best_score ?? 0,
        timesAttempted: row.times_attempted ?? 0,
        lastAttemptedAt: row.last_attempted_at ?? null,
        reviewDueAt: row.review_due_at ?? null,
      };
    }

    const attempts: AttemptRecord[] = (attemptsRes.data ?? []).map((r) => ({
      id: String(r.id),
      questionSlug: r.question_slug,
      code: "",
      passed: r.passed,
      score: r.score,
      testsPassed: r.tests_passed,
      testsTotal: r.tests_total,
      timeTakenSeconds: r.time_taken_seconds,
      xpEarned: r.xp_earned ?? 0,
      submittedAt: r.submitted_at,
    }));

    return {
      username: p.username ?? "Hero",
      xp: p.xp ?? 0,
      streakCount: p.streak_count ?? 0,
      streakFreezes: p.streak_freezes ?? 1,
      progress,
      attempts: attempts.reverse(),
    };
  } catch (e) {
    console.warn("[sync] remote load failed", e);
    return null;
  }
}
