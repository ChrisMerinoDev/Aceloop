import type { Achievement } from "@/lib/types";

export const ACHIEVEMENTS: Achievement[] = [
  { key: "first-blood", name: "First Blood", description: "Solve your first question.", icon: "🗡️" },
  { key: "speed-demon", name: "Speed Demon", description: "Solve a question in under 5 minutes.", icon: "⚡" },
  { key: "no-hints", name: "No Hints", description: "Solve a question without revealing the solution.", icon: "🧠" },
  { key: "streak-7", name: "Week Warrior", description: "Keep a 7-day streak alive.", icon: "🔥" },
  { key: "streak-30", name: "Monthly Monk", description: "Keep a 30-day streak alive.", icon: "🏮" },
  { key: "pattern-sliding-window", name: "Pattern Master: Sliding Window", description: "Solve every sliding-window question.", icon: "🪟" },
  { key: "pattern-two-pointers", name: "Pattern Master: Two Pointers", description: "Solve every two-pointers question.", icon: "🤞" },
  { key: "pattern-dynamic-programming", name: "Pattern Master: DP", description: "Solve every dynamic-programming question.", icon: "🧩" },
  { key: "combo-3", name: "Combo x3", description: "Pass 3 questions in a row without failing.", icon: "🎯" },
  { key: "combo-5", name: "Unstoppable", description: "Pass 5 questions in a row without failing.", icon: "🌟" },
  { key: "perfect-score", name: "Perfectionist", description: "Score a perfect 100 on any question.", icon: "💯" },
  { key: "frontend-five", name: "Pixel Pusher", description: "Solve 5 frontend questions.", icon: "🎨" },
  { key: "dsa-ten", name: "Algorithm Knight", description: "Solve 10 DSA questions.", icon: "⚔️" },
  { key: "level-3", name: "Dungeon Delver", description: "Unlock Level 3 of the arena.", icon: "🏰" },
  { key: "rank-gold", name: "Golden Age", description: "Reach Gold rank.", icon: "🥇" },
  { key: "night-owl", name: "Night Owl", description: "Solve a question between midnight and 5am.", icon: "🦉" },
];
