"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "cn"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground shadow-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 cursor-pointer transition-colors duration-150",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-3.5 shrink-0 text-muted-foreground opacity-70 transition-transform duration-200" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="size-4 text-muted-foreground" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="size-4 text-muted-foreground" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef(({ className, children, position = "popper", sideOffset = 5, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-80 min-w-[8rem] overflow-hidden rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-xl shadow-black/10 dark:shadow-black/40 backdrop-blur-md animate-in fade-in-80 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      sideOffset={sideOffset}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1.5",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2.5 py-1.5 text-xs font-semibold text-muted-foreground", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-2.5 pr-8 text-xs sm:text-sm font-medium outline-none transition-colors duration-100 hover:bg-muted/80 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-primary font-bold" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border/60", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

/**
 * CustomSelect - High-level, modern rounded dropdown component
 * Eliminates OS-native boxy select popups with a smooth, styled floating menu.
 */
function CustomSelect({
  value,
  defaultValue,
  onChange,
  onValueChange,
  name,
  id,
  placeholder = "Select an option",
  options = [],
  children,
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
}) {
  const handleValueChange = (newVal) => {
    if (onValueChange) {
      onValueChange(newVal);
    }
    if (onChange) {
      const syntheticEvent = {
        target: { name: name || id || "", value: newVal },
        currentTarget: { name: name || id || "", value: newVal },
        value: newVal,
        toString: () => newVal,
        valueOf: () => newVal,
      };
      onChange(syntheticEvent);
    }
  };

  const strValue = value !== undefined && value !== null ? String(value) : undefined;
  const strDefaultValue = defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : undefined;

  return (
    <Select
      value={strValue}
      defaultValue={strDefaultValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      name={name}
    >
      <SelectTrigger
        id={id}
        className={cn(
          "w-full rounded-xl border border-border bg-background text-xs sm:text-sm font-medium text-foreground hover:bg-muted/30 focus:ring-1 focus:ring-ring cursor-pointer transition-all",
          triggerClassName || className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {Array.isArray(options) && options.length > 0
          ? options.map((opt) => {
              const optVal = typeof opt === "object" ? String(opt.value) : String(opt);
              const optLabel = typeof opt === "object" ? opt.label : opt;
              return (
                <SelectItem key={optVal} value={optVal}>
                  {optLabel}
                </SelectItem>
              );
            })
          : children}
      </SelectContent>
    </Select>
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  CustomSelect,
}
