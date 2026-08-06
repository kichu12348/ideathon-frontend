import React, { useState } from "react";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { Popover } from "../Popover";
import { Select, type SelectOption } from "../Select";
import styles from "./DateTimePicker.module.css";

// Generate 15-minute time intervals from 00:00 to 23:45 plus 23:59
function generateTimeOptions(): SelectOption[] {
  const options: SelectOption[] = [];
  const pad = (n: number) => String(n).padStart(2, "0");

  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const timeStr = `${pad(hour)}:${pad(min)}`;
      options.push({ value: timeStr, label: timeStr });
    }
  }

  // Ensure 23:59 is explicitly present
  if (!options.some((opt) => opt.value === "23:59")) {
    options.push({ value: "23:59", label: "23:59" });
  }

  return options;
}

const TIME_OPTIONS = generateTimeOptions();

export interface DateTimePickerProps {
  value: string; // YYYY-MM-DDTHH:mm:ss or empty
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Parse initial date & time from value
  const parsedDate = value ? new Date(value) : null;
  const validDate =
    parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;

  const initialYear = validDate
    ? validDate.getFullYear()
    : new Date().getFullYear();
  const initialMonth = validDate ? validDate.getMonth() : new Date().getMonth();

  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  // Date parts
  const selectedDateStr = validDate
    ? `${validDate.getFullYear()}-${String(validDate.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(validDate.getDate()).padStart(2, "0")}`
    : "";

  const selectedTimeStr = validDate
    ? `${String(validDate.getHours()).padStart(2, "0")}:${String(
        validDate.getMinutes(),
      ).padStart(2, "0")}`
    : "12:00";

  // Ensure selectedTimeStr is in options if custom
  const effectiveTimeOptions = React.useMemo(() => {
    if (!selectedTimeStr) return TIME_OPTIONS;
    if (TIME_OPTIONS.some((opt) => opt.value === selectedTimeStr)) {
      return TIME_OPTIONS;
    }
    return [
      { value: selectedTimeStr, label: selectedTimeStr },
      ...TIME_OPTIONS,
    ];
  }, [selectedTimeStr]);

  const formatPayloadString = (dateStr: string, timeStr: string) => {
    const seconds = timeStr === "23:59" ? "59" : "00";
    return `${dateStr}T${timeStr}:${seconds}`;
  };

  const handleDateSelect = (day: number) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const newDateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
    const timeToUse = selectedTimeStr || "12:00";
    onChange(formatPayloadString(newDateStr, timeToUse));
    setPopoverOpen(false);
  };

  const handleTimeChange = (newTime: string) => {
    if (selectedDateStr) {
      onChange(formatPayloadString(selectedDateStr, newTime));
    } else {
      const today = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
        today.getDate(),
      )}`;
      onChange(formatPayloadString(todayStr, newTime));
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pickerRow}>
        {/* Radix Popover Date Trigger Button */}
        <Popover
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          trigger={
            <button
              type="button"
              className={styles.dateTrigger}
              disabled={disabled}
            >
              <FiCalendar size={16} className={styles.fieldIcon} />
              <span className={styles.dateText}>
                {selectedDateStr ? selectedDateStr : "Select date"}
              </span>
            </button>
          }
        >
          {/* Radix Calendar Dropdown */}
          <div className={styles.calendarContainer}>
            <div className={styles.calendarHeader}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={prevMonth}
                title="Previous Month"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className={styles.monthLabel}>
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button
                type="button"
                className={styles.navBtn}
                onClick={nextMonth}
                title="Next Month"
              >
                <FiChevronRight size={16} />
              </button>
            </div>

            <div className={styles.weekHeader}>
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <span key={d} className={styles.weekDay}>
                  {d}
                </span>
              ))}
            </div>

            <div className={styles.daysGrid}>
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className={styles.emptyDay} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const pad = (n: number) => String(n).padStart(2, "0");
                const thisDateStr = `${currentYear}-${pad(
                  currentMonth + 1,
                )}-${pad(dayNum)}`;
                const isSelected = selectedDateStr === thisDateStr;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    className={`${styles.dayBtn} ${
                      isSelected ? styles.selectedDay : ""
                    }`}
                    onClick={() => handleDateSelect(dayNum)}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>
        </Popover>

        {/* Radix Select Time Dropdown (00:00 to 23:59) */}
        <div className={styles.timeSelectWrapper}>
          <Select
            value={selectedTimeStr}
            onValueChange={handleTimeChange}
            options={effectiveTimeOptions}
            placeholder="Time"
            disabled={disabled}
            ariaLabel="Select Time"
          />
        </div>

        {/* Compact Square Clear Button */}
        {value && !disabled && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            title="Clear date and time"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
