/**
 * Sanitizes and validates an email or identifier string
 */
export function sanitizeEmail(rawEmail?: string, fallback = 'user@example.com'): string {
  if (!rawEmail || typeof rawEmail !== 'string') return fallback;
  const cleaned = rawEmail.trim().replace(/\s+/g, '').replace(/^["']+|["']+$/g, '').toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(cleaned)) {
    return cleaned;
  }
  // If it's a social username or identifier without @, normalize it
  if (cleaned.length > 0) {
    const cleanId = cleaned.replace(/https?:\/\/(www\.)?facebook\.com\//, '').replace(/[^a-z0-9._-]/g, '');
    return `${cleanId || 'member'}@facebook.user`;
  }
  return fallback;
}
