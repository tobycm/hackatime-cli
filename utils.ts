export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffSec < 60) return formatter.format(-diffSec, "seconds");
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return formatter.format(-diffMin, "minutes");
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return formatter.format(-diffHours, "hours");
  const diffDays = Math.floor(diffHours / 24);
  return formatter.format(-diffDays, "days");
}
