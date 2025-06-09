import { formatDistanceToNow as dateFnsFormatDistanceToNow } from "date-fns";

export function formatDistanceToNow(date) {
  return dateFnsFormatDistanceToNow(new Date(date), { addSuffix: true });
}
