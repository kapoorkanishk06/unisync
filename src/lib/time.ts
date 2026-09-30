import { format, isPast, isToday, isTomorrow, isThisWeek } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Kolkata";

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(toZonedTime(d, TIMEZONE), "MMM d, h:mm a");
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(toZonedTime(d, TIMEZONE), "MMM d");
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isPast(d)) {
    return "Overdue";
  }
  
  if (isToday(d)) {
    return `Today, ${format(toZonedTime(d, TIMEZONE), "h:mm a")}`;
  }
  
  if (isTomorrow(d)) {
    return `Tomorrow, ${format(toZonedTime(d, TIMEZONE), "h:mm a")}`;
  }
  
  if (isThisWeek(d)) {
    return format(toZonedTime(d, TIMEZONE), "EEEE, h:mm a");
  }
  
  return format(toZonedTime(d, TIMEZONE), "MMM d, h:mm a");
}

export function formatCountdown(dueAt: string | Date): string {
  const d = typeof dueAt === "string" ? new Date(dueAt) : dueAt;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  
  if (diffMs < 0) {
    const overdueMs = Math.abs(diffMs);
    const hours = Math.floor(overdueMs / (1000 * 60 * 60));
    const minutes = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d overdue`;
    }
    return `${hours}h ${minutes}m overdue`;
  }
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}

export function getHoursUntil(dueAt: string | Date): number {
  const d = typeof dueAt === "string" ? new Date(dueAt) : dueAt;
  const now = new Date();
  return (d.getTime() - now.getTime()) / (1000 * 60 * 60);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatHours(hours: number): string {
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return `${mins}m`;
  }
  const wholeHours = Math.floor(hours);
  const mins = Math.round((hours - wholeHours) * 60);
  return mins > 0 ? `${wholeHours}h ${mins}m` : `${wholeHours}h`;
}
