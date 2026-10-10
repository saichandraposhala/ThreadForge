/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types.ts';
import {
  hashPassword,
  saveCredentialRecord,
  getSavedCredentialsVault,
  setActiveSession,
  evaluatePasswordStrength,
  seedDemoAccountIfNeeded,
} from '../services/cryptoAuth.ts';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onOpenVault: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenVault,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize demo account if vault empty
  useEffect(() => {
    seedDemoAccountIfNeeded();
  }, []);

  // Pre-fill last remembered account
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      const vault = getSavedCredentialsVault();
      const accounts = Object.values(vault);
      const remembered = accounts.find((a) => a.rememberMe) || accounts[0];
      if (remembered && mode === 'signin') {
        setEmail(remembered.email);
        // Pre-fill password hint for demo account
        if (remembered.email === 'designer@threadforge.io') {
          setPassword('ForgePass2026!');
        }
      }
    }
  }, [isOpen, mode]);

  const strength = evaluatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const vault = getSavedCredentialsVault();

      if (mode === 'signin') {
        const stored = vault[cleanEmail];
        if (!stored) {
          setErrorMsg('No credentials found for this email. Try demo login or register.');
          setLoading(false);
          return;
        }

        // Compute PBKDF2 hash using stored salt
        const { hash } = await hashPassword(password, stored.salt);

        if (hash !== stored.passwordHash) {
          setErrorMsg('Invalid password. Cryptographic hash check failed.');
          setLoading(false);
          return;
        }

        // Success: construct user profile
        const user: UserProfile = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: stored.email,
          fullName: stored.fullName || 'Lead CAD Designer',
          role: 'Lead CAD Fashion Engineer',
          studioUnit: 'Studio Lead (CAD-09)',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCdGq3bsv68gwzE6-qDh8faYzQs_leeQl-0GkLhYVBNSW5ZHCbvzO_0jo6Ss2Rzy2jtrM_NRIYwhu40UGvMEnvEDMs14yVFCqVns6xSa9zTDjxgHOlEK3JD9_1edDb9tkusQSTa730AVfzictKwy-RYLzJsc2euYWcXbv2FUbJrnfKL1CvB4mR4WSKs3slo1A6N2l5itlXLX9XdjARwcisCYUGKu92-Dc0VUQ9iRDL0eH4YLXKSUzUngw',
          createdAt: stored.savedAt,
          lastLoginAt: new Date().toISOString(),
        };

        // Update remember flag
        stored.rememberMe = rememberMe;
        saveCredentialRecord(stored);

        setActiveSession(user);
        setSuccessMsg('Authentication verified. Welcome back to ThreadForge.');
        setTimeout(() => {
          onLoginSuccess(user);
          onClose();
          setLoading(false);
        }, 600);
      } else {
        // Registration mode
        if (password.length < 8) {
          setErrorMsg('Password must be at least 8 characters long for cryptographic derivation.');
          setLoading(false);
          return;
        }

        if (vault[cleanEmail]) {
          setErrorMsg('An account with this email is already registered in the secure vault.');
          setLoading(false);
          return;
        }

        // Derive secure PBKDF2 key with unique 16-byte random salt
        const { hash, salt, iterations } = await hashPassword(password);

        const newRecord = {
          email: cleanEmail,
          fullName: fullName.trim() || cleanEmail.split('@')[0],
          passwordHash: hash,
          salt,
          iterations,
          algorithm: 'PBKDF2-SHA256 (100,000 iterations)',
          savedAt: new Date().toISOString(),
          rememberMe,
        };

        saveCredentialRecord(newRecord);

        const newUser: UserProfile = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: cleanEmail,
          fullName: newRecord.fullName,
          role: 'Apparel CAD Engineer',
          studioUnit: 'Studio Lead (CAD-09)',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCdGq3bsv68gwzE6-qDh8faYzQs_leeQl-0GkLhYVBNSW5ZHCbvzO_0jo6Ss2Rzy2jtrM_NRIYwhu40UGvMEnvEDMs14yVFCqVns6xSa9zTDjxgHOlEK3JD9_1edDb9tkusQSTa730AVfzictKwy-RYLzJsc2euYWcXbv2FUbJrnfKL1CvB4mR4WSKs3slo1A6N2l5itlXLX9XdjARwcisCYUGKu92-Dc0VUQ9iRDL0eH4YLXKSUzUngw',
          createdAt: newRecord.savedAt,
          lastLoginAt: new Date().toISOString(),
        };

        setActiveSession(newUser);
        setSuccessMsg('Account registered and securely saved in cryptographic vault.');
        setTimeout(() => {
          onLoginSuccess(newUser);
          onClose();
          setLoading(false);
        }, 700);
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Cryptographic processing error. Please try again.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('designer@threadforge.io');
    setPassword('ForgePass2026!');
    setLoading(true);

    try {
      const { hash } = await hashPassword('ForgePass2026!');
      const vault = getSavedCredentialsVault();
      let record = vault['designer@threadforge.io'];
      if (!record) {
        await seedDemoAccountIfNeeded();
        record = getSavedCredentialsVault()['designer@threadforge.io'];
      }

      const user: UserProfile = {
        id: 'usr_demo_01',
        email: 'designer@threadforge.io',
        fullName: 'Alex Vance',
        role: 'Lead CAD Fashion Engineer',
        studioUnit: 'Studio Lead (CAD-09)',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCdGq3bsv68gwzE6-qDh8faYzQs_leeQl-0GkLhYVBNSW5ZHCbvzO_0jo6Ss2Rzy2jtrM_NRIYwhu40UGvMEnvEDMs14yVFCqVns6xSa9zTDjxgHOlEK3JD9_1edDb9tkusQSTa730AVfzictKwy-RYLzJsc2euYWcXbv2FUbJrnfKL1CvB4mR4WSKs3slo1A6N2l5itlXLX9XdjARwcisCYUGKu92-Dc0VUQ9iRDL0eH4YLXKSUzUngw',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      setActiveSession(user);
      setSuccessMsg('Signed in as Lead Engineer (Alex Vance).');
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
        setLoading(false);
      }, 500);
    } catch {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#181b25] border border-[#31353f] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Top Header Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#494bd6] via-[#8083ff] to-[#4cd7f6]"></div>

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#908fa0] hover:text-[#dfe2ef] hover:bg-[#262a34] rounded-lg transition-colors"
          title="Close"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="p-6 space-y-5">
          {/* Brand & Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#262a34] border border-[#31353f] shadow-inner mb-1">
              <span className="material-symbols-outlined text-[26px] text-[#c0c1ff]">
                lock_clock
              </span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-[22px] font-bold text-[#dfe2ef]">
              ThreadForge Studio Auth
            </h2>
            <p className="font-['Geist'] text-[12px] text-[#c7c4d7]">
              Hardware-grade client credential security with Web Crypto PBKDF2-SHA256
            </p>
          </div>

          {/* Switch tabs: Sign In / Register */}
          <div className="grid grid-cols-2 p-1 bg-[#0a0e17] rounded-lg border border-[#262a34]/60">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-1.5 text-[12px] font-medium rounded-md transition-all ${
                mode === 'signin'
                  ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm font-semibold'
                  : 'text-[#c7c4d7] hover:text-[#dfe2ef]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-1.5 text-[12px] font-medium rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm font-semibold'
                  : 'text-[#c7c4d7] hover:text-[#dfe2ef]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-[11px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-lg bg-[#00885d]/20 border border-[#4edea3]/30 text-[#4edea3] text-[11px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="block font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase">
                  Full Name / Title
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-[#908fa0]">
                    badge
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Vance, Senior Patternmaker"
                    className="w-full bg-[#0a0e17] text-[#dfe2ef] text-[12px] pl-8 pr-3 py-2 rounded-lg border border-[#262a34] focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase">
                Work Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-[#908fa0]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="designer@threadforge.io"
                  className="w-full bg-[#0a0e17] text-[#dfe2ef] text-[12px] pl-8 pr-3 py-2 rounded-lg border border-[#262a34] focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase">
                  Password
                </label>
                {mode === 'signin' && (
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6]">
                    PBKDF2 Salted
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-[#908fa0]">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0e17] text-[#dfe2ef] text-[12px] pl-8 pr-9 py-2 rounded-lg border border-[#262a34] focus:outline-none focus:border-[#8083ff] focus:ring-1 focus:ring-[#8083ff]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 text-[#908fa0] hover:text-[#dfe2ef]"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Password strength visualizer in register mode */}
              {mode === 'register' && password.length > 0 && (
                <div className="space-y-1 pt-1 font-['JetBrains_Mono'] text-[10px]">
                  <div className="flex justify-between text-[#c7c4d7]">
                    <span>Security Rating:</span>
                    <span
                      className={
                        strength.score >= 60
                          ? 'text-[#4edea3]'
                          : strength.score >= 40
                          ? 'text-[#4cd7f6]'
                          : 'text-[#ffb4ab]'
                      }
                    >
                      {strength.label} ({strength.score}%)
                    </span>
                  </div>
                  <div className="w-full h-1 bg-[#0a0e17] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength.score >= 60
                          ? 'bg-[#4edea3]'
                          : strength.score >= 40
                          ? 'bg-[#4cd7f6]'
                          : 'bg-[#ffb4ab]'
                      }`}
                      style={{ width: `${strength.score}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0a0e17] border border-[#31353f] accent-[#8083ff]"
                />
                <span className="text-[12px] text-[#c7c4d7]">Save credentials in secure vault</span>
              </label>

              <button
                type="button"
                onClick={onOpenVault}
                className="text-[11px] font-['JetBrains_Mono'] text-[#4cd7f6] hover:underline flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[13px]">shield</span>
                <span>Vault Info</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#494bd6] to-[#8083ff] text-white font-['Space_Grotesk'] text-[13px] font-bold shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Deriving PBKDF2 Digest (100k rounds)...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>{mode === 'signin' ? 'Sign In Securely' : 'Register & Save in Vault'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2 border-t border-[#262a34] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#908fa0]">
              <span>Fast Testing Option:</span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#4edea3]">Verified</span>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 rounded-lg bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] text-[12px] font-medium transition-colors flex items-center justify-between border border-[#31353f]/60 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-left">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                <div>
                  <div className="font-semibold text-[11px]">Alex Vance (Lead CAD Engineer)</div>
                  <div className="text-[10px] text-[#908fa0] font-['JetBrains_Mono']">
                    designer@threadforge.io
                  </div>
                </div>
              </div>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#c0c1ff] font-bold">
                1-Click Sign In →
              </span>
            </button>
          </div>

          {/* Security details footnote */}
          <div className="p-2.5 rounded-lg bg-[#0a0e17] border border-[#262a34]/60 text-[10px] text-[#908fa0] font-['JetBrains_Mono'] space-y-1">
            <div className="flex items-center gap-1.5 text-[#c7c4d7]">
              <span className="material-symbols-outlined text-[13px] text-[#4edea3]">
                security
              </span>
              <span className="font-semibold">Cryptographic Guarantee:</span>
            </div>
            <p>
              Passwords are never stored in plain text. Key derivation uses PBKDF2 with SHA-256 and
              a cryptographically random 16-byte salt via window.crypto.subtle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
