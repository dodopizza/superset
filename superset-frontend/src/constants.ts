// DODO-changed
export const DATETIME_WITH_TIME_ZONE = 'YYYY-MM-DD HH:mm:ssZ';
export const TIME_WITH_MS = 'HH:mm:ss.SSS';

export const BOOL_TRUE_DISPLAY = 'True';
export const BOOL_FALSE_DISPLAY = 'False';

/*
 ** APP VERSION BASE is a base from which the app inherited the code base
 ** (i.e. 1.3 => was inherited from Superset 1.3)
*/
const APP_VERSION_BASE = '1.3';
const date = new Date();
const month = date.getMonth();
const day = date.getDate();
const hours = date.getHours();
export const APP_VERSION = `${APP_VERSION_BASE}.${month}-${day}:${hours}`;

export const URL_PARAMS = {
  standalone: {
    name: 'standalone',
    type: 'number',
  },
  preselectFilters: {
    name: 'preselect_filters',
    type: 'object',
  },
  nativeFilters: {
    name: 'native_filters',
    type: 'rison',
  },
  filterSet: {
    name: 'filter_set',
    type: 'string',
  },
  showFilters: {
    name: 'show_filters',
    type: 'boolean',
  },
} as const;

/**
 * Faster debounce delay for inputs without expensive operation.
 */
export const FAST_DEBOUNCE = 250;

/**
 * Slower debounce delay for inputs with expensive API calls.
 */
export const SLOW_DEBOUNCE = 500;
