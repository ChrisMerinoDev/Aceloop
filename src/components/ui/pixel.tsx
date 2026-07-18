"use client";

import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "green" | "blue" | "red" | "purple" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  gold: "bg-gold text-black hover:bg-gold-2",
  green: "bg-xpbar text-black hover:brightness-110",
  blue: "bg-mp text-black hover:brightness-110",
  red: "bg-hp text-black hover:brightness-110",
  purple: "bg-purple text-black hover:brightness-110",
  ghost: "bg-panel-2 text-ink hover:bg-border-px",
};

export interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  function PixelButton({ className, variant = "gold", size = "md", ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          "pixel-btn inline-flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer",
          size === "sm" && "px-3 py-1.5 text-[9px]",
          size === "md" && "px-4 py-2.5 text-[11px]",
          size === "lg" && "px-6 py-3.5 text-[13px]",
          VARIANT_CLASSES[variant],
          className
        )}
        {...props}
      />
    );
  }
);

export function PixelPanel({
  className,
  title,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { title?: string }) {
  return (
    <div className={cn("pixel-border bg-panel p-4", className)} {...props}>
      {title !== undefined && (
        <div className="font-pixel text-[11px] text-gold-2 mb-3 uppercase tracking-wide">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export function PixelBadge({
  className,
  color = "gold",
  children,
}: {
  className?: string;
  color?: "gold" | "green" | "blue" | "red" | "purple" | "dim";
  children: React.ReactNode;
}) {
  const colors = {
    gold: "bg-gold text-black",
    green: "bg-xpbar text-black",
    blue: "bg-mp text-black",
    red: "bg-hp text-black",
    purple: "bg-purple text-black",
    dim: "bg-panel-2 text-ink-dim",
  };
  return (
    <span
      className={cn(
        "font-pixel inline-block px-2 py-1 text-[8px] uppercase border-2 border-black",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}

export function PixelBar({
  value,
  max,
  color = "var(--color-xpbar)",
  label,
  className,
}: {
  value: number;
  max: number;
  color?: string;
  label?: string;
  className?: string;
}) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      {label !== undefined && (
        <div className="font-pixel text-[8px] text-ink-dim mb-1 flex justify-between">
          <span>{label}</span>
          <span>
            {Math.round(value)}/{max}
          </span>
        </div>
      )}
      <div
        className="h-4 border-2 border-black bg-panel-2"
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? "progress"}
      >
        <div
          className="h-full transition-[width] duration-500"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.25), inset 0 4px 0 rgba(255,255,255,0.3)",
          }}
        />
      </div>
    </div>
  );
}

export const PixelInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function PixelInput({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "bg-panel-2 border-4 border-border-px px-3 py-2 text-ink outline-none",
          "focus:border-gold placeholder:text-ink-dim w-full",
          className
        )}
        {...props}
      />
    );
  }
);
