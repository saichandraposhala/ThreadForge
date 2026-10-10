/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SavedCredentialRecord, UserProfile } from '../types.ts';

const VAULT_STORAGE_KEY = 'threadforge_credentials_vault_v1';
const SESSION_STORAGE_KEY = 'threadforge_auth_session_v1';
const PBKDF2_ITERATIONS = 100000;

// Utility: ArrayBuffer to Hex string
function buf2hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

// Utility: Hex string to Uint8Array
function hex2buf(hex: string): Uint8Array {
  const buf = new ArrayBuffer(Math.ceil(hex.length / 2));
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Derives a secure PBKDF2-SHA-256 password hash using standard Web Crypto API.
 */
export async function hashPassword(
  password: string,
  saltHex?: string
): Promise<{ hash: string; salt: string; iterations: number }> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  let saltBuffer: Uint8Array;
  let saltString: string;

  if (saltHex) {
    saltBuffer = hex2buf(saltHex);
    saltString = saltHex;
  } else {
    const rawBuffer = new ArrayBuffer(16);
    saltBuffer = new Uint8Array(rawBuffer);
    window.crypto.getRandomValues(saltBuffer as any);
    saltString = buf2hex(rawBuffer);
  }

  // Import key material from raw password bytes
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Derive 256 bits (32 bytes) with PBKDF2 SHA-256
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer as unknown as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    256
  );

  const hash = buf2hex(derivedBits);
  return {
    hash,
    salt: saltString,
    iterations: PBKDF2_ITERATIONS,
  };
}

/**
 * Constant-time comparison simulation for password hashes.
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Returns all saved credential records in the local secure vault.
 */
export function getSavedCredentialsVault(): Record<string, SavedCredentialRecord> {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load credentials vault:', err);
    return {};
  }
}

/**
 * Saves a user credential record in the vault.
 */
export function saveCredentialRecord(record: SavedCredentialRecord): void {
  const vault = getSavedCredentialsVault();
  vault[record.email.toLowerCase()] = record;
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
}

/**
 * Deletes a user credential record from the vault.
 */
export function deleteCredentialRecord(email: string): void {
  const vault = getSavedCredentialsVault();
  delete vault[email.toLowerCase()];
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault));
}

/**
 * Gets currently active session.
 */
export function getActiveSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session.user || null;
  } catch (err) {
    console.error('Failed to parse active session:', err);
    return null;
  }
}

/**
 * Sets active session.
 */
export function setActiveSession(user: UserProfile | null): void {
  if (!user) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } else {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        user,
        token: 'tf_sec_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
        savedAt: new Date().toISOString(),
      })
    );
  }
}

/**
 * Evaluates password strength (0 to 100).
 */
export function evaluatePasswordStrength(password: string): {
  score: number;
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  feedback: string[];
} {
  const feedback: string[] = [];
  if (password.length < 8) feedback.push('Minimum 8 characters');
  if (!/[A-Z]/.test(password)) feedback.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) feedback.push('At least one lowercase letter');
  if (!/[0-9]/.test(password)) feedback.push('At least one number');
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push('At least one symbol (!@#$%^&*)');

  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;

  let label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong' = 'Very Weak';
  if (score >= 80) label = 'Very Strong';
  else if (score >= 60) label = 'Strong';
  else if (score >= 40) label = 'Medium';
  else if (score >= 20) label = 'Weak';

  return { score: Math.min(100, score), label, feedback };
}

/**
 * Seeds a default verified demo account if the vault is empty.
 */
export async function seedDemoAccountIfNeeded(): Promise<void> {
  const vault = getSavedCredentialsVault();
  const demoEmail = 'designer@threadforge.io';
  if (!vault[demoEmail]) {
    const demoPassword = 'ForgePass2026!';
    const { hash, salt, iterations } = await hashPassword(demoPassword);
    saveCredentialRecord({
      email: demoEmail,
      fullName: 'Alex Vance',
      passwordHash: hash,
      salt,
      iterations,
      algorithm: 'PBKDF2-SHA256 (100,000 iterations)',
      savedAt: new Date().toISOString(),
      rememberMe: true,
    });
  }
}
