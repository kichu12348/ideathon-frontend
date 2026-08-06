/**
 * Format date string into YYYY-MM-DDTHH:mm:ss string expected by backend.
 * Example: "2026-08-20T20:59:59"
 */
export function formatToDatetimeLocal(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // Fallback if raw string matches YYYY-MM-DDTHH:mm:ss
      return dateStr;
    }
    const pad = (num: number) => String(num).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  } catch {
    return dateStr || "";
  }
}

/**
 * Format string for backend API.
 * Ensures format is YYYY-MM-DDTHH:mm:ss.
 */
export function formatToBackendString(dateValue: string): string {
  if (!dateValue) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateValue)) {
    return `${dateValue}:00`;
  }
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return dateValue;
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function ordinalSuffix(day: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = day % 100;
  return day + (suffixes[(v - 20) % 10] || suffixes[v] || "th");
}

export function getFormatedHumanDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHours = hour % 12 === 0 ? 12 : hour % 12;

  return `${ordinalSuffix(day)} ${month} ${year} at ${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}
