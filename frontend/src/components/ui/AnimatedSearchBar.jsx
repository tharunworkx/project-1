import React, { useState, useRef, useId, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from 'cn';

/**
 * AnimatedSearchBar
 * Inspired by Jitter's "Animated Search Bar" (artboard 2:54):
 * - Energetic grow-in entry animation
 * - Animated popping & tilting search icon
 * - Staggered letter-reveal "textIn" placeholder animation (slide up + appear)
 * - Smooth pill expansion & glow on focus
 * - Quick-clear (X) button with pop-in transition
 * - Native dark & light mode styling with zero lag
 */
const AnimatedSearchBar = React.forwardRef(function AnimatedSearchBar(
  {
    value = '',
    onChange,
    onClear,
    placeholder = 'Search...',
    className,
    containerClassName,
    size = 'sm', // 'sm' (h-8) or 'md' (h-9)
    expandOnFocus = false,
    disabled = false,
    autoFocus = false,
    id,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isFocused, setIsFocused] = useState(false);
  const internalInputRef = useRef(null);

  // Combine forwarded ref and internal ref
  const setInputRef = (node) => {
    internalInputRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const hasValue = Boolean(value && String(value).length > 0);

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onChange) {
      onChange({ target: { value: '' } });
    }
    if (onClear) {
      onClear();
    }
    if (internalInputRef.current) {
      internalInputRef.current.focus();
    }
  };

  // Split placeholder for the staggered "textIn" effect (first 45 chars for smoothness)
  const placeholderChars = useMemo(() => {
    if (!placeholder) return [];
    return placeholder.slice(0, 48).split('');
  }, [placeholder]);

  const sizeClasses = size === 'md' ? 'h-9 text-xs pl-9 pr-8' : 'h-8 text-xs pl-8 pr-7';
  const iconSize = size === 'md' ? 'size-4 left-3' : 'size-3.5 left-2.5';

  return (
    <div
      className={cn(
        'group relative flex items-center w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] animate-jitter-grow',
        expandOnFocus && isFocused ? 'flex-1 md:max-w-md' : '',
        containerClassName
      )}
    >
      {/* Pill Container Box with glowing focus ring */}
      <div
        className={cn(
          'relative w-full flex items-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'bg-card/75 dark:bg-muted/30 backdrop-blur-xs shadow-xs',
          'border-border/80 dark:border-border/60 hover:border-border',
          isFocused
            ? 'border-primary/50 dark:border-primary/50 ring-2 ring-primary/20 dark:ring-primary/25 shadow-md bg-card dark:bg-muted/50'
            : 'hover:shadow-sm'
        )}
      >
        {/* Animated Search Icon */}
        <Search
          aria-hidden="true"
          className={cn(
            'absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 text-muted-foreground animate-jitter-icon',
            iconSize,
            isFocused
              ? 'text-primary scale-110 -rotate-6'
              : 'group-hover:text-foreground group-hover:scale-105'
          )}
        />

        {/* Real Input Field */}
        <input
          ref={setInputRef}
          id={inputId}
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholder={isFocused ? placeholder : ''}
          className={cn(
            'w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none rounded-full transition-colors',
            sizeClasses,
            className
          )}
          {...props}
        />

        {/* Animated Staggered TextIn Placeholder (displayed when unfocused and empty) */}
        {!hasValue && !isFocused && (
          <div
            aria-hidden="true"
            onClick={() => internalInputRef.current?.focus()}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 pointer-events-none select-none text-muted-foreground/75 truncate pr-6 overflow-hidden flex items-center',
              size === 'md' ? 'left-9 text-xs' : 'left-8 text-xs'
            )}
          >
            {placeholderChars.map((char, index) => (
              <span
                key={index}
                className="animate-jitter-letter"
                style={{
                  animationDelay: `${Math.min(index * 22, 600)}ms`,
                  whiteSpace: char === ' ' ? 'pre' : 'normal',
                }}
              >
                {char}
              </span>
            ))}
          </div>
        )}

        {/* Animated Pop-in Clear Button */}
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 focus:outline-none transition-all duration-200 cursor-pointer animate-jitter-grow',
              size === 'md' ? 'size-5' : 'size-4'
            )}
            tabIndex={-1}
          >
            <X className={size === 'md' ? 'size-3.5' : 'size-3'} />
          </button>
        )}
      </div>
    </div>
  );
});

export default AnimatedSearchBar;
export { AnimatedSearchBar };

