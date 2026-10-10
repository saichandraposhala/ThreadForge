/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getSavedCredentialsVault, deleteCredentialRecord } from '../services/cryptoAuth.ts';
import { SavedCredentialRecord } from '../types.ts';

interface SecurityVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const SecurityVaultModal: React.FC<SecurityVaultModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const [vaultData, setVaultData] = useState<Record<string, SavedCredentialRecord>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setVaultData(getSavedCredentialsVault());
    }
  }, [isOpen]);

  const handleDelete = (email: string) => {
    deleteCredentialRecord(email);
    setVaultData(getSavedCredentialsVault());
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  const records = Object.values(vaultData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#181b25] border border-[#31353f] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-[#4edea3] via-[#4cd7f6] to-[#8083ff]"></div>

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#262a34] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#262a34] border border-[#31353f] flex items-center justify-center text-[#4edea3]">
                <span className="material-symbols-outlined text-[22px]">shield</span>
              </div>
              <div>
                <h3 className="font-['Space_Grotesk'] text-[18px] font-bold text-[#dfe2ef]">
                  Secure Credential Vault
                </h3>
                <p className="font-['Geist'] text-[12px] text-[#c7c4d7]">
                  Hardware-grade encrypted client storage (PBKDF2-SHA256 • 100k rounds)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#908fa0] hover:text-[#dfe2ef] hover:bg-[#262a34] rounded-lg"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Cryptographic Architecture Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-[#0a0e17] rounded-xl border border-[#262a34] font-['JetBrains_Mono'] text-[11px]">
            <div className="flex flex-col">
              <span className="text-[#908fa0] text-[9px] uppercase">Hashing Algorithm</span>
              <span className="text-[#dfe2ef] font-semibold">PBKDF2 / SHA-256</span>
              <span className="text-[#4edea3] text-[9px]">FIPS 140-3 Standard</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#908fa0] text-[9px] uppercase">Derivation Work Factor</span>
              <span className="text-[#dfe2ef] font-semibold">100,000 Iterations</span>
              <span className="text-[#4cd7f6] text-[9px]">Brute-force Resistant</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#908fa0] text-[9px] uppercase">Entropy Salt</span>
              <span className="text-[#dfe2ef] font-semibold">128-bit CSPRNG</span>
              <span className="text-[#c0c1ff] text-[9px]">Unique per account</span>
            </div>
          </div>

          {/* Records List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#c7c4d7] uppercase">
                Stored Vault Accounts ({records.length})
              </span>
              <button
                onClick={onOpenLogin}
                className="text-[11px] font-['Space_Grotesk'] text-[#c0c1ff] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span>Register New Account</span>
              </button>
            </div>

            {records.length === 0 ? (
              <div className="p-8 text-center bg-[#0a0e17] rounded-xl border border-[#262a34] text-[#908fa0] text-[12px]">
                No credentials stored yet. Register a new account or sign in with demo credentials.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {records.map((rec) => (
                  <div
                    key={rec.email}
                    className="p-3.5 rounded-xl bg-[#0a0e17] border border-[#262a34] hover:border-[#31353f] transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                        <span className="font-semibold text-[13px] text-[#dfe2ef]">
                          {rec.fullName || rec.email}
                        </span>
                        <span className="text-[11px] text-[#908fa0] font-['JetBrains_Mono']">
                          ({rec.email})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {rec.rememberMe && (
                          <span className="px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] font-['JetBrains_Mono'] text-[9px]">
                            Remembered
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(rec.email)}
                          className="text-[#ffb4ab] hover:text-[#ffdad6] text-[11px] p-1 rounded hover:bg-[#93000a]/20"
                          title="Delete from Vault"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Cryptographic Preview */}
                    <div className="space-y-1 bg-[#181b25] p-2 rounded-lg font-['JetBrains_Mono'] text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#908fa0]">PBKDF2 Digest (256-bit):</span>
                        <button
                          onClick={() => handleCopy(rec.passwordHash, `hash_${rec.email}`)}
                          className="text-[#4cd7f6] hover:underline flex items-center gap-1"
                        >
                          <span>{copiedKey === `hash_${rec.email}` ? 'Copied!' : 'Copy'}</span>
                          <span className="material-symbols-outlined text-[12px]">content_copy</span>
                        </button>
                      </div>
                      <div className="text-[#c7c4d7] break-all truncate font-mono">
                        {rec.passwordHash}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#262a34]">
                        <span className="text-[#908fa0]">Cryptographic Salt (16-byte):</span>
                        <span className="text-[#c0c1ff] font-mono">{rec.salt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Close */}
          <div className="flex items-center justify-between pt-2 border-t border-[#262a34]">
            <div className="text-[11px] text-[#908fa0] font-['JetBrains_Mono']">
              Local Storage Key: <span className="text-[#dfe2ef]">threadforge_credentials_vault_v1</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] text-[12px] font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
