import { format, parseISO } from 'date-fns';

export default function  formatDate(dateString: string, formatString: string): string {
    return format(parseISO(dateString), formatString)
}