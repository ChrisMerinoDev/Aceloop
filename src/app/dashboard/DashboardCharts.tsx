"use client";

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

/**
 * Recharts is heavy (~40KB gzipped) and only used on this page. It lives in
 * its own module so the dashboard can lazy-load it with next/dynamic, keeping
 * it out of every other route's bundle.
 */

export function XpBarChart({ data }: { data: { day: string; xp: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
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
  );
}

export function ScoreLineChart({ data }: { data: { n: number; score: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
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
  );
}
