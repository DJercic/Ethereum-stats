import moment from 'moment-timezone';

moment.tz.setDefault('UTC');

export type StartEnd = {
  start: number;
  end: number;
};

export function dayTimestamps(date: Date): StartEnd {
  /**
   * Return start and end timestamps for a day in seconds. Date is transformed in UTC timezone.
   */

  const d = moment(date).utc();
  const start = d.startOf('day').unix();
  const end = d.endOf('day').unix();

  return { start, end };
}

export function previousDay(): Date {
  /**
   * Return Date of the previous day when function is called. Use now as relative point in time.
   */
  const dateNow = moment.now();
  return moment(dateNow).subtract(1, 'days').toDate();
}

export function previousDayTimestamps(): StartEnd {
  return dayTimestamps(previousDay());
}

export function toPreferredDateFormat(date: Date): string {
  return moment(date).format('YYYY-MM-DD');
}
