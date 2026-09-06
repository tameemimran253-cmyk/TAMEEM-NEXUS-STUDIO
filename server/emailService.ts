import type { AuthEvent, ProjectLead } from './db';
import { sanitizeEmail } from './utils';

export { sanitizeEmail };

// Throttling map: key = `${email}_${eventType}`, value = timestamp
const throttleMap = new Map<string, number>();
const THROTTLE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes for returning logins

export class EmailService {
  private adminEmail: string;
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.adminEmail = sanitizeEmail(process.env.ADMIN_NOTIFICATION_EMAIL, 'tameemimran253@gmail.com');
    this.apiKey = (process.env.EMAIL_PROVIDER_API_KEY || '').trim();
    this.fromEmail = (process.env.EMAIL_FROM || '').trim();
  }

  /**
   * Send notification for user authentication (Sign up or Login)
   */
  public async sendAuthNotification(event: AuthEvent): Promise<boolean> {
    const cleanUserEmail = sanitizeEmail(event.email);
    const throttleKey = `${cleanUserEmail}_${event.eventType}`;
    const now = Date.now();
    const lastSent = throttleMap.get(throttleKey);

    // Throttle returning logins to avoid inbox spamming
    if (!event.isNewUser && lastSent && now - lastSent < THROTTLE_WINDOW_MS) {
      console.log(`[EmailService] Throttling repeat login notification for ${cleanUserEmail}`);
      return true;
    }

    throttleMap.set(throttleKey, now);

    const subject = event.isNewUser
      ? `✨ NEW USER SIGNUP: ${event.name} on Tameem Nexus Studio`
      : `🔑 USER LOGIN: ${event.name} (${cleanUserEmail})`;

    const textBody = `
NEW USER AUTHENTICATION

Name:
${event.name}

Email:
${cleanUserEmail}

Authentication:
${event.provider.toUpperCase()}

Status:
${event.isNewUser ? 'NEW USER' : 'RETURNING USER'}

Time:
${new Date(event.timestamp).toLocaleString('en-US', { timeZoneName: 'short' })}

Requested Page:
${event.requestedPage || '/'}

A new potential visitor has entered Tameem Nexus Studio.
Follow up with the visitor if they are interested in a project.
    `.trim();

    return this.dispatchEmail({
      to: this.adminEmail,
      subject,
      text: textBody,
    });
  }

  /**
   * Send notification for a new project inquiry / lead
   */
  public async sendProjectLeadNotification(lead: ProjectLead): Promise<boolean> {
    const cleanLeadEmail = sanitizeEmail(lead.email);
    const subject = `🚀 NEW PROJECT INQUIRY — TAMEEM NEXUS STUDIO (${lead.name})`;

    const textBody = `
NEW PROJECT INQUIRY

Name:
${lead.name}

Email:
${cleanLeadEmail}

Project Type:
${lead.projectType}

Budget Range:
${lead.budget}

Timeline:
${lead.timeline}

Project Description:
${lead.description}

Submission Time:
${new Date(lead.createdAt).toLocaleString('en-US', { timeZoneName: 'short' })}

Status:
${lead.status}
    `.trim();

    return this.dispatchEmail({
      to: this.adminEmail,
      subject,
      text: textBody,
    });
  }

  /**
   * Dispatch email via external provider (e.g. Resend, SendGrid) or robust simulated server log delivery
   */
  private async dispatchEmail(payload: { to: string; subject: string; text: string }): Promise<boolean> {
    const cleanTo = sanitizeEmail(payload.to, this.adminEmail);

    try {
      console.log(`\n========================================================`);
      console.log(`[EMAIL DISPATCH TO ADMIN] Target: ${cleanTo}`);
      console.log(`Subject: ${payload.subject}`);
      console.log(`--------------------------------------------------------`);
      console.log(payload.text);
      console.log(`========================================================\n`);

      // If Resend / Sendgrid API key is provided
      if (this.apiKey) {
        if (this.apiKey.startsWith('re_')) {
          // Determine initial sender
          const isFreemail =
            !this.fromEmail ||
            this.fromEmail.includes('@gmail.com') ||
            this.fromEmail.includes('@yahoo.com') ||
            this.fromEmail.includes('@hotmail.com') ||
            this.fromEmail.includes('@outlook.com');

          // Resend requires verified custom domain or onboarding@resend.dev
          const initialFrom = isFreemail
            ? 'Tameem Nexus Studio <onboarding@resend.dev>'
            : this.fromEmail;

          const sendWithResend = async (sender: string) => {
            return await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
              },
              body: JSON.stringify({
                from: sender,
                to: [cleanTo],
                reply_to: cleanTo,
                subject: payload.subject,
                text: payload.text,
              }),
            });
          };

          let response = await sendWithResend(initialFrom);

          // If custom domain unverified (403), auto-fallback to onboarding@resend.dev
          if (!response.ok && initialFrom !== 'Tameem Nexus Studio <onboarding@resend.dev>') {
            const err = await response.text();
            console.warn('[EmailService] Initial Resend sender failed, falling back to verified default:', err);
            response = await sendWithResend('Tameem Nexus Studio <onboarding@resend.dev>');
          }

          if (!response.ok) {
            const err = await response.text();
            console.error('[EmailService] Resend dispatch failed:', err);
          } else {
            console.log(`[EmailService] Email successfully delivered to ${cleanTo} via Resend API`);
            return true;
          }
        }
      }

      return true;
    } catch (error) {
      console.error('[EmailService] Error dispatching email notification to admin:', error);
      // Never throw or crash user flows
      return false;
    }
  }
}

export const emailService = new EmailService();

