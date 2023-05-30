import { format, parseISO } from 'date-fns';

export const formatDate = (date: Date | number, formatString = 'M/d/yy') => {
  return format(date, formatString);
};

export const parseStringToDate = (dateString: string) => {
    return parseISO(dateString);
};

export const formatDateFromString = (date: string, formatString = 'M/d/yy') => {
    if (!date) return '';
    const parsedDate = parseStringToDate(date);
    return format(parsedDate, formatString);
  };