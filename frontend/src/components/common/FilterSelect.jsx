import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';

export const FilterSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  className = '',
  align = 'start',
  widthClass = 'w-full',
}) => {
  const currentOption = options.find((opt) => String(opt.value) === String(value));
  const displayLabel = currentOption ? currentOption.label : placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`${widthClass} h-8 px-2.5 rounded-md border border-border/80 bg-muted/40 hover:bg-muted/70 text-xs text-foreground flex items-center justify-between font-normal cursor-pointer focus-visible:ring-1 focus-visible:ring-ring transition-colors ${className}`}
        >
          <span className="truncate text-xs">{displayLabel}</span>
          <ChevronDown className="size-3 text-muted-foreground ml-1.5 shrink-0 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="w-(--radix-dropdown-menu-trigger-width) min-w-44 max-h-64 overflow-y-auto p-1 shadow-xl bg-popover border border-border text-popover-foreground rounded-lg z-50"
      >
        {options.map((opt) => {
          const isSelected = String(opt.value) === String(value);
          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`text-xs cursor-pointer px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                isSelected
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-muted focus:bg-muted'
              }`}
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

