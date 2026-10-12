import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "cn";

/**
 * ModeToggle
 * Inspired by Jitter's "On / Off Toggle" template (artboard 3F-MYqkbWgRUaqYL7w-By):
 * - Clean, satisfying snap physics between states (anticipation squash, elastic overshoot & snap)
 * - Morphing rotating Sun & Moon icons with spring dynamics
 * - Day / Night interactive atmosphere with twinkling stars and subtle clouds
 * - Sleek, neutral color palette in white mode tailored for the dashboard
 */
export default function ModeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [snapDirection, setSnapDirection] = React.useState(null);

  const handleToggle = () => {
    setSnapDirection(isDark ? "to-light" : "to-dark");
    toggleTheme();
  };

  return (
    <button
      type="button"
      role="switch"
      aria-label="Toggle theme (Light / Dark mode)"
      aria-checked={isDark}
      onClick={handleToggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group relative inline-flex h-[30px] w-[58px] shrink-0 cursor-pointer items-center rounded-full p-[3px] select-none",
        "transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        "active:scale-95 hover:scale-[1.03] overflow-hidden shadow-inner",
        isDark
          ? "bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-500/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
          : "bg-zinc-200/90 hover:bg-zinc-200 border border-zinc-300/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      {/* Background Atmosphere - Stars in Dark Mode, Clouds in Light Mode */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-300">
        {isDark ? (
          /* Twinkling Night Stars */
          <div className="relative w-full h-full">
            <span
              className="absolute left-2 top-2 size-1 rounded-full bg-indigo-200 animate-jitter-sparkle"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="absolute left-4.5 top-4 size-1.5 rounded-full bg-white/90 animate-jitter-sparkle"
              style={{ animationDelay: "300ms" }}
            />
            <span
              className="absolute left-3 top-5 size-0.5 rounded-full bg-indigo-300 animate-jitter-sparkle"
              style={{ animationDelay: "600ms" }}
            />
          </div>
        ) : (
          /* Soft Daylight Clouds */
          <div className="relative w-full h-full">
            <span className="absolute right-2 top-1.5 size-2.5 rounded-full bg-white/80" />
            <span className="absolute right-3.5 top-2.5 size-2 rounded-full bg-white/70" />
            <span className="absolute right-1 top-3.5 size-2 rounded-full bg-white/60" />
          </div>
        )}
      </div>

      {/* Thumb / Knob with Jitter Satisfying Snap Physics */}
      <span
        className={cn(
          "pointer-events-none relative z-10 flex size-[24px] items-center justify-center rounded-full shadow-md",
          "transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          snapDirection === "to-dark"
            ? "animate-jitter-snap-on"
            : snapDirection === "to-light"
            ? "animate-jitter-snap-off"
            : isDark
            ? "translate-x-[26px]"
            : "translate-x-0",
          isDark
            ? "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 text-indigo-950 ring-1 ring-white/30 shadow-black/50"
            : "bg-white text-amber-500 ring-1 ring-zinc-300/80 shadow-md shadow-zinc-400/20"
        )}
      >
        {isDark ? (
          <Moon
            className="size-3.5 fill-indigo-950 text-indigo-950 animate-jitter-moon stroke-[2.2]"
          />
        ) : (
          <Sun
            className="size-3.5 fill-amber-400 text-amber-500 animate-jitter-sun stroke-[2.2]"
          />
        )}
      </span>

      <span className="sr-only">Toggle theme (current: {theme})</span>
    </button>
  );
}
