import { formatDistanceToNow, format } from 'date-fns';

/** Copies text to clipboard and returns success boolean */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  }
}

/** Truncates a URL for display */
export function truncateUrl(url: string, maxLen = 55): string {
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen - 3) + '…';
}

/** Relative time string e.g. "3 hours ago" */
export function relativeTime(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

/** Formatted date string e.g. "Jan 23, 2025" */
export function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

/** Strip protocol from URL for compact display */
export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '');
}
