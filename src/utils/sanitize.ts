// ─── Lightweight HTML Sanitizer ─────────────────────────────────────────────
// Strips script tags, inline event handlers, and javascript: URLs from email
// HTML before rendering. Stands in for DOMPurify in the demo bundle.

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1=$2#$2');
}
