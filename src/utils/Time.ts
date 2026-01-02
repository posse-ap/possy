/*
  Format a date string to "M/D" format.
  Example: "2024-07-15" -> "7/15"
*/
export function formatTimeDisplay(date: string): string {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}/${day}`;
}
