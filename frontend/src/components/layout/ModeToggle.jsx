import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "cn";

export default function ModeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-label="Toggle theme"
      aria-checked={isDark}
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex h-[28px] w-[54px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none",
        isDark
          ? "bg-[#252528] border border-white/10"
          : "bg-zinc-200 border border-zinc-300",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none flex size-[22px] items-center justify-center rounded-full shadow-sm transition-transform duration-300 ease-in-out",
          isDark
            ? "translate-x-0 bg-[#d8dadf] text-[#252528]"
            : "translate-x-[26px] bg-white text-amber-500"
        )}
      >
        {isDark ? (
          <Moon className="size-3.5 fill-[#252528] text-[#252528]" />
        ) : (
          <Sun className="size-3.5 fill-amber-400 text-amber-500" />
        )}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
