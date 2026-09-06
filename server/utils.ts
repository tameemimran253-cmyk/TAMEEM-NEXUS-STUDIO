/**
 * Sanitizes and validates an email string, removing extraneous spaces, quotes, and invalid characters
 */
export function sanitizeEmail(rawEmail?: string, fallback = 'tameemimran253@gmail.com'): string {
  if (!rawEmail || typeof rawEmail !== 'string') return fallback;
  const cleaned = rawEmail.trim().replace(/\s+/g, '').replace(/^["']+|["']+$/g, '').toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : fallback;
}
