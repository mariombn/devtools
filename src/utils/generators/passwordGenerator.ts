export interface PasswordOptions {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  special?: boolean;
}

export function generatePassword(options: PasswordOptions = {}): string {
  const {
    length = 12,
    uppercase = true,
    lowercase = true,
    numbers = true,
    special = true,
  } = options;

  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charset = '';
  if (uppercase) charset += uppercaseChars;
  if (lowercase) charset += lowercaseChars;
  if (numbers) charset += numberChars;
  if (special) charset += specialChars;

  if (charset === '') {
    charset = lowercaseChars; // Fallback
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
