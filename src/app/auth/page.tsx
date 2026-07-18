"use client";

// Relaxed local auth: any (or empty) credentials "log in" immediately, then
// the user picks a hero name that's tracked in localStorage until they hit
// the log-out button. Strict Supabase credential auth gets rewired later —
// the client/sync code in src/lib/supabase/ is kept ready for it.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGame } from "@/store/game";
import { PixelButton, PixelInput, PixelPanel } from "@/components/ui/pixel";

export default function AuthPage() {
  const router = useRouter();
  const game = useGame();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"login" | "username">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    setMounted(true);
    setName(useGame.getState().username === "Hero" ? "" : useGame.getState().username);
  }, []);

  if (!mounted) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center font-pixel text-[10px] text-ink-dim">
        LOADING<span className="blink">…</span>
      </main>
    );
  }

  if (game.loggedIn && step === "login") {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <PixelPanel title="🗝 Already In" className="text-center">
          <p className="text-ink">
            You&apos;re logged in as{" "}
            <span className="text-gold-2">{game.username}</span>.
          </p>
          <div className="mt-5 flex gap-2 justify-center flex-wrap">
            <Link href="/arena">
              <PixelButton>Enter the Arena</PixelButton>
            </Link>
            <PixelButton variant="ghost" onClick={() => setStep("username")}>
              Change Name
            </PixelButton>
          </div>
        </PixelPanel>
      </main>
    );
  }

  const finishLogin = () => {
    const finalName = name.trim() || "Hero";
    game.setUsername(finalName);
    game.logIn();
    router.push("/arena");
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      {step === "login" ? (
        <PixelPanel title="🗝 Sign In">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep("username");
            }}
            className="space-y-3"
          >
            <PixelInput
              type="email"
              placeholder="Email (optional for now)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />
            <PixelInput
              type="password"
              placeholder="Password (optional for now)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <PixelButton type="submit" className="w-full">
              Log In
            </PixelButton>
          </form>
          <p className="text-ink-dim mt-4">
            Credentials are relaxed while accounts are being set up — leave the
            fields empty and hit Log In. Your progress is saved in this
            browser and stays until you log out.
          </p>
        </PixelPanel>
      ) : (
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
          <PixelPanel title="✨ Name Your Hero">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                finishLogin();
              }}
              className="space-y-3"
            >
              <PixelInput
                autoFocus
                placeholder="e.g. StackSlayer"
                value={name}
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
                aria-label="Hero name"
              />
              <PixelButton type="submit" variant="green" className="w-full">
                {name.trim() ? `Enter as ${name.trim()}` : "Enter as Hero"}
              </PixelButton>
            </form>
            <p className="text-ink-dim mt-4">
              This name shows on your dashboard and the leaderboard. You can
              change it any time from the Hero Forge.
            </p>
          </PixelPanel>
        </motion.div>
      )}
    </main>
  );
}
