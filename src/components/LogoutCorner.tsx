"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGame } from "@/store/game";
import { useSettings } from "@/store/settings";

/**
 * Small corner widget: shows who's logged in and a log-out button.
 * The eye toggle hides it (re-enable from Profile → Account). Logging out
 * only ever happens from an explicit click here or on the profile page.
 */
export function LogoutCorner() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, username, logOut } = useGame();
  const { logoutCornerHidden, toggleLogoutCorner } = useSettings();

  useEffect(() => setMounted(true), []);

  if (!mounted || !loggedIn || logoutCornerHidden) return null;
  if (pathname?.startsWith("/interview/")) return null; // keep the room distraction-free

  return (
    <div className="fixed bottom-3 right-3 z-40 flex items-center gap-1">
      <button
        onClick={toggleLogoutCorner}
        title="Hide this button (re-enable in Profile → Account)"
        aria-label="Hide log out button"
        className="font-pixel text-[9px] px-2 py-2 bg-panel-2 border-2 border-black text-ink-dim hover:text-ink cursor-pointer"
      >
        🫥
      </button>
      <button
        onClick={() => {
          logOut();
          router.push("/");
        }}
        title={`Log out ${username}`}
        className="pixel-btn font-pixel text-[9px] px-3 py-2 bg-hp text-black uppercase cursor-pointer"
      >
        ⎋ Log out
      </button>
    </div>
  );
}
