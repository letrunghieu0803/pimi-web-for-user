/**
 * Security utilities for masking sensitive personal information (PII) on the web UI.
 */

export const maskPhoneNumber = (phone?: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 7) return phone;
  return cleaned.substring(0, 3) + '***' + cleaned.substring(cleaned.length - 4);
};

export const maskIdentityCard = (idCard?: string): string => {
  if (!idCard) return '';
  if (idCard.length < 8) return '********';
  return idCard.substring(0, 4) + '******' + idCard.substring(idCard.length - 2);
};

export const maskEmail = (email?: string): string => {
  if (!email || !email.includes('@')) return email || '';
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name[0]}*@${domain}`;
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
};

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
