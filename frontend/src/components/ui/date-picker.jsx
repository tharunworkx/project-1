import React, { useState, useEffect, useRef } from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "cn";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * Calendar - Standalone calendar component matching the reference design
 * Features:
 * - Left/Right chevrons for month navigation
 * - Month and Year dropdown pickers
 * - Weekday row: Su Mo Tu We Th Fr Sa
 * - Previous & Next month trailing days dimmed
 * - Selected day in modern rounded squircle
 * - Full 5-6 week complete grid rendering
 */
export function Calendar({
  selectedDate,
  onSelectDate,
  className,
}) {
  const parsedDate = selectedDate ? new Date(selectedDate) : new Date();
  const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  const [currentYear, setCurrentYear] = useState(validDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(validDate.getMonth()); // 0-11
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);

  // Sync with prop when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
      }
    }
  }, [selectedDate]);

  const handlePrevMonth = (e) => {
    e?.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setShowMonthSelect(false);
    setShowYearSelect(false);
  };

  const handleNextMonth = (e) => {
    e?.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setShowMonthSelect(false);
    setShowYearSelect(false);
  };

  // Days calculations
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 for Sun
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Selected date components
  const selYear = validDate.getFullYear();
  const selMonth = validDate.getMonth();
  const selDay = validDate.getDate();

  // Build grid days
  const calendarCells = [];

  // Trailing days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    calendarCells.push({
      day: dayNum,
      isCurrentMonth: false,
      year: prevYear,
      month: prevMonthIdx,
    });
  }

  // Days in current month
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      year: currentYear,
      month: currentMonth,
    });
  }

  // Complete the grid so all weeks are fully rendered (35 cells for 5 weeks, or 42 for 6 weeks)
  const targetTotalCells = calendarCells.length > 35 ? 42 : 35;
  const remainingCells = targetTotalCells - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      year: nextYear,
      month: nextMonthIdx,
    });
  }

  const handleDayClick = (cell, e) => {
    e?.stopPropagation();
    const formattedMonth = String(cell.month + 1).padStart(2, "0");
    const formattedDay = String(cell.day).padStart(2, "0");
    const dateStr = `${cell.year}-${formattedMonth}-${formattedDay}`;
    if (onSelectDate) {
      onSelectDate(dateStr);
    }
  };

  const yearsList = [];
  const startYear = Math.max(2020, currentYear - 5);
  for (let y = startYear; y <= startYear + 11; y++) {
    yearsList.push(y);
  }

  return (
    <div
      className={cn(
        "w-76 rounded-2xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 p-4 text-zinc-900 dark:text-zinc-100 shadow-2xl select-none font-sans transition-all overflow-visible",
        className
      )}
    >
      {/* Header with Prev, Month, Year, Next */}
      <div className="relative flex items-center justify-between pb-3.5 pt-1">
        <button
          type="button"
          onClick={handlePrevMonth}
          aria-label="Previous month"
          className="flex size-7 items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-4.5" />
        </button>

        {/* Center: Month and Year Dropdowns */}
        <div className="flex items-center gap-2 text-base font-semibold">
          {/* Month toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMonthSelect(!showMonthSelect);
                setShowYearSelect(false);
              }}
              className="flex items-center gap-1.5 hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer px-1 py-0.5 rounded-md"
            >
              <span>{MONTH_NAMES[currentMonth]}</span>
              <ChevronDown className="size-3.5 opacity-80" />
            </button>

            {showMonthSelect && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 w-32 max-h-48 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-xl text-xs">
                {MONTH_NAMES.map((m, idx) => (
                  <button
                    key={m}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMonth(idx);
                      setShowMonthSelect(false);
                    }}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer",
                      currentMonth === idx
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    {FULL_MONTH_NAMES[idx]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowYearSelect(!showYearSelect);
                setShowMonthSelect(false);
              }}
              className="flex items-center gap-1.5 hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors cursor-pointer px-1 py-0.5 rounded-md"
            >
              <span>{currentYear}</span>
              <ChevronDown className="size-3.5 opacity-80" />
            </button>

            {showYearSelect && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 w-24 max-h-48 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-xl text-xs">
                {yearsList.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentYear(y);
                      setShowYearSelect(false);
                    }}
                    className={cn(
                      "w-full text-center px-2 py-1.5 rounded-lg transition-colors cursor-pointer",
                      currentYear === y
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          aria-label="Next month"
          className="flex size-7 items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
        >
          <ChevronRight className="size-4.5" />
        </button>
      </div>

      {/* Weekday Row: Su Mo Tu We Th Fr Sa */}
      <div className="grid grid-cols-7 text-center pb-2 pt-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid - All dates fully visible */}
      <div className="grid grid-cols-7 gap-y-1.5 text-center text-sm font-normal">
        {calendarCells.map((cell, idx) => {
          const isSelected =
            cell.day === selDay &&
            cell.month === selMonth &&
            cell.year === selYear;

          return (
            <div key={idx} className="flex items-center justify-center p-0.5">
              <button
                type="button"
                onClick={(e) => handleDayClick(cell, e)}
                className={cn(
                  "size-8.5 flex items-center justify-center rounded-xl text-xs transition-all duration-150 cursor-pointer",
                  // Selected: white pill in dark mode / black pill in light mode
                  isSelected &&
                    "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md scale-105",
                  // Non-selected current month
                  !isSelected && cell.isCurrentMonth &&
                    "text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 font-medium",
                  // Non-selected other month (dimmed)
                  !isSelected && !cell.isCurrentMonth &&
                    "text-zinc-400/50 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-xs"
                )}
              >
                {cell.day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * CustomDatePicker - Input wrapper with interactive floating calendar
 * Uses Radix Popover Portal so the calendar popup is NEVER clipped by parent containers or cards!
 */
export function CustomDatePicker({
  value,
  onChange,
  name,
  id,
  className,
  placeholder = "Select date",
  required = false,
}) {
  const [open, setOpen] = useState(false);

  const handleSelectDate = (dateStr) => {
    if (onChange) {
      onChange({
        target: { name: name || id || "date", value: dateStr },
        currentTarget: { name: name || id || "date", value: dateStr },
        value: dateStr,
      });
    }
    setOpen(false);
  };

  // Display date formatting
  let displayLabel = value || placeholder;
  if (value) {
    const parts = value.split("-");
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      if (MONTH_NAMES[monthIdx]) {
        displayLabel = `${day} ${MONTH_NAMES[monthIdx]} ${year}`;
      }
    }
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          id={id}
          name={name}
          type="button"
          className={cn(
            "w-full h-10 px-3 flex items-center justify-between rounded-lg border border-border bg-card text-xs sm:text-sm text-foreground hover:bg-muted/30 focus:outline-none focus:ring-1 focus:ring-ring transition-colors cursor-pointer font-medium",
            className
          )}
        >
          <span className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-muted-foreground shrink-0" />
            <span className={cn(!value && "text-muted-foreground")}>{displayLabel}</span>
          </span>
          <ChevronDown className="size-3.5 text-muted-foreground opacity-70" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 p-0 outline-none animate-in fade-in-80 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <Calendar
            selectedDate={value}
            onSelectDate={handleSelectDate}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
