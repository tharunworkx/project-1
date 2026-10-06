import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "cn";

export const Checkbox = React.forwardRef(function Checkbox(
  {
    checked = false,
    onChange,
    onCheckedChange,
    className,
    id,
    disabled = false,
    ...props
  },
  ref
) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    const nextVal = !checked;
    onCheckedChange?.(nextVal);
    onChange?.({ target: { checked: nextVal, id } });
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "peer size-4.5 shrink-0 rounded-[5px] border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer inline-flex items-center justify-center select-none",
        checked
          ? "bg-primary text-primary-foreground border-primary shadow-xs"
          : "bg-background border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500",
        className
      )}
      {...props}
    >
      {checked && <Check className="size-3.5 stroke-[2.5] stroke-current" />}
    </button>
  );
});

Checkbox.displayName = "Checkbox";
export default Checkbox;
