import { CalendarDay } from './page';
import {
  DateSource,
  DateOptions,
  SimpleDateParts,
  DayOfWeek,
  TimeNames,
  daysInWeek,
  getDateParts,
  getDateFromParts,
  getDayNames,
  getMonthNames,
  getMonthParts,
  getThisMonthParts,
  getPrevMonthParts,
  getNextMonthParts,
  formatDate,
  parseDate,
  toDate,
  fromDate,
  getHourDates,
  getRelativeTimeNames,
} from './date/helpers';
import { DateRange, DateRangeSource, DateRangeOptions } from './date/range';
import { defaultLocales } from './defaults';
import { isString, isObject, has, clamp, defaultsDeep } from './helpers';

export interface LocaleConfig {
  id: string;
  firstDayOfWeek: DayOfWeek;
  masks: any;
}

export function resolveConfig(
  config: string | Partial<LocaleConfig> | undefined,
  locales: any,
) {
  // Get the detected locale string
  const detLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
  // Resolve the locale id
  let id;
  if (isString(config)) {
    id = config;
  } else if (has(config, 'id')) {
    id = config!.id;
  }
  id = (id || detLocale).toLowerCase();
  const localeKeys = Object.keys(locales);
  const validKey = (k: string) => localeKeys.find(lk => lk.toLowerCase() === k);
  id = validKey(id) || validKey(id.substring(0, 2)) || detLocale;
  // Add fallback and spread default locale to prevent repetitive update loops
  const defLocale = { ...locales['en-IE'], ...locales[id], id };
  // Assign or merge defaults with provided config
  const result: LocaleConfig = isObject(config)
    ? defaultsDeep(config, defLocale)
    : defLocale;
  // Return resolved config
  return result;
}

export default class Locale {
  id: any;
  daysInWeek: number;
  firstDayOfWeek: DayOfWeek;
  masks: any;
  timezone: string | undefined;
  hourLabels: string[];
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesShorter: string[];
  dayNamesNarrow: string[];
  monthNames: string[];
  monthNamesShort: string[];
  relativeTimeNames: TimeNames;
  amPm: [string, string] = ['am', 'pm'];
  monthCache: any;
  pageCache: any;

  constructor(
    config: Partial<LocaleConfig> | string | undefined = undefined,
    timezone?: string,
  ) {
    const { id, firstDayOfWeek, masks } = resolveConfig(
      config,
      defaultLocales.value,
    );
    this.id = id;
    this.daysInWeek = daysInWeek;
    this.firstDayOfWeek = clamp(firstDayOfWeek, 1, daysInWeek) as DayOfWeek;
    this.masks = masks;
    this.timezone = timezone || undefined;
    this.hourLabels = this.getHourLabels();
    this.dayNames = getDayNames('long', this.id);
    this.dayNamesShort = getDayNames('short', this.id);
    this.dayNamesShorter = this.dayNamesShort.map(s => s.substring(0, 2));
    this.dayNamesNarrow = getDayNames('narrow', this.id);
    this.monthNames = getMonthNames('long', this.id);
    this.monthNamesShort = getMonthNames('short', this.id);
    this.relativeTimeNames = getRelativeTimeNames(this.id);
    this.monthCache = {};
    this.pageCache = {};
  }

  formatDate(date: DateSource, masks: string | string[]) {
    return formatDate(date, masks, {
      locale: this,
      timezone: this.timezone,
    });
  }

  parseDate(dateString: string, mask: string | string[]) {
    return parseDate(dateString, mask, {
      locale: this,
      timezone: this.timezone,
    });
  }

  toDate(
    d: Partial<SimpleDateParts> | DateSource,
    options: Partial<DateOptions> = {},
  ) {
    return toDate(d, {
      ...options,
      locale: this,
      timezone: this.timezone,
    });
  }

  fromDate(date: Date, options: Partial<DateOptions> = {}) {
    return fromDate(date, {
      ...options,
      locale: this,
      timezone: this.timezone,
    });
  }

  getDateRanges(
    ranges: DateRangeSource | DateRangeSource[],
    opts: Partial<DateRangeOptions> = {},
  ) {
    opts.firstDayOfWeek = this.firstDayOfWeek;
    opts.timezone = this.timezone;
    return DateRange.fromMany(ranges, opts);
  }

  getDateParts(date: Date) {
    return getDateParts(date, this.firstDayOfWeek, this.timezone);
  }

  getDateFromParts(parts: Partial<SimpleDateParts>) {
    return getDateFromParts(parts, this.timezone);
  }

  getDateFromParams(
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
  ) {
    return this.getDateFromParts({
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
      milliseconds,
    });
  }

  getMonthParts(month: number, year: number) {
    return getMonthParts(month, year, this.firstDayOfWeek);
  }

  getThisMonthParts() {
    return getThisMonthParts(this.firstDayOfWeek);
  }

  getPrevMonthParts(month: number, year: number) {
    return getPrevMonthParts(month, year, this.firstDayOfWeek);
  }

  getNextMonthParts(month: number, year: number) {
    return getNextMonthParts(month, year, this.firstDayOfWeek);
  }

  getHourLabels() {
    return getHourDates().map(d => {
      return this.formatDate(d, this.masks.hours);
    });
  }

  getWeekdayLabels(days: CalendarDay[]) {
    return days.map(d => {
      return this.formatDate(d.date, this.masks.weekdays);
    });
  }

  getDayId(date: Date) {
    return this.formatDate(date, 'YYYY-MM-DD');
  }
}
