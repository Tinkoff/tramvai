import { format } from 'date-fns';

export function formatDate(timeFormat, date) {
  return format(date, timeFormat);
}
