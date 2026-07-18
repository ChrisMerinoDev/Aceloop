"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/client";
import { useGame } from "@/store/game";
import { PixelButton, PixelInput, PixelPanel } from "@/components/ui/pixel";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const configured = supabaseConfigured();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { error } = await sb.auth.signUp({
          email,
          password,
          options: { data: { username: username || "Hero" } },
        });
        if (error) throw error;
        if (username) useGame.getState().setUsername(username);
        setMessage(
          "Account created! If email confirmation is enabled, check your inbox — then sign in."
        );
        setMode("signin");
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/arena");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/arena` },
    });
  };

  if (!configured) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <PixelPanel title="Guest Mode Active" className="text-center">
          <p className="text-ink-dim">
            Supabase isn&apos;t configured, so accounts are disabled — but the
            whole game works in guest mode and saves to this browser.
          </p>
          <p className="text-ink-dim mt-3">
            To enable cloud saves and the leaderboard, add your Supabase keys
            to <code className="text-xpbar">.env.local</code> (see the README).
          </p>
          <Link href="/arena" className="inline-block mt-5">
            <PixelButton>Play as Guest</PixelButton>
          </Link>
        </PixelPanel>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <PixelPanel title={mode === "signin" ? "🗝 Sign In" : "✨ Create Account"}>
        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <PixelInput
              placeholder="Hero name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              aria-label="Username"
            />
          )}
          <PixelInput
            type="email"
            required
            placeholder="you@tavern.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
          <PixelInput
            type="password"
            required
            minLength={6}
            placeholder="Password (6+ chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          {message !== null && <p className="text-gold-2">{message}</p>}
          <div className="flex gap-2 pt-1">
            <PixelButton type="submit" disabled={busy} className="flex-1">
              {busy ? "…" : mode === "signin" ? "Sign In" : "Sign Up"}
            </PixelButton>
            <PixelButton type="button" variant="ghost" onClick={() => void google()}>
              Google
            </PixelButton>
          </div>
        </form>
        <button
          className="font-pixel text-[9px] text-mp mt-4 hover:text-gold-2"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setMessage(null);
          }}
        >
          {mode === "signin" ? "New here? Create an account →" : "← Already have an account"}
        </button>
        <p className="text-ink-dim mt-4">
          Your guest progress merges into your account on first sign-in (the
          higher XP wins).
        </p>
      </PixelPanel>
    </main>
  );
}
