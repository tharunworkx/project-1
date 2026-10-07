import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FilterSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  className = '',
  buttonClassName = '',
  align = 'start',
  widthClass = 'w-full',
  icon = null,
}) => {
  // Normalize options to { value, label }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : (opt.id ?? opt.name),
        label: opt.label !== undefined ? opt.label : (opt.name ?? String(opt.value)),
      };
    }
    return { value: opt, label: String(opt) };
  });

  const currentOption = normalizedOptions.find((opt) => String(opt.value) === String(value));
  const displayLabel = currentOption ? currentOption.label : (value || placeholder);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            widthClass,
            "h-8 px-2.5 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted/70 text-xs text-foreground flex items-center justify-between font-normal cursor-pointer focus-visible:ring-1 focus-visible:ring-ring transition-colors shadow-2xs",
            buttonClassName,
            className
          )}
        >
          <div className="flex items-center gap-1.5 truncate">
            {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
            <span className="truncate text-xs">{displayLabel}</span>
          </div>
          <ChevronDown className="size-3 text-muted-foreground ml-1.5 shrink-0 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-44 max-h-64 overflow-y-auto p-1.5 shadow-xl bg-popover border border-border/80 text-popover-foreground rounded-xl z-50 backdrop-blur-md"
      >
        {normalizedOptions.map((opt) => {
          const isSelected = String(opt.value) === String(value);
          return (
            <DropdownMenuItem
              key={String(opt.value)}
              onClick={() => onChange(opt.value)}
              className={cn(
                "text-xs cursor-pointer px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors",
                isSelected
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted focus:bg-muted"
              )}
            >
              <span className="truncate">{opt.label}</span>
              {isSelected && <Check className="size-3 text-primary shrink-0 ml-2" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterSelect;
