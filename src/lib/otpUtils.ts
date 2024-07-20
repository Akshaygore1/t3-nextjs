export function obfuscateEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  if (localPart.length < 5) return email;

  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-3);
  const hiddenPart = "*".repeat(localPart.length - 2);

  const obfuscatedLocalPart = `${visibleStart}${hiddenPart}${visibleEnd}`;

  return `${obfuscatedLocalPart}@${domain}`;
}

export function generateOtp(): string {
  const otp = Math.floor(10000000 + Math.random() * 90000000); // Ensure 8 digits
  return otp.toString();
}
