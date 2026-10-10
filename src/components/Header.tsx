/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudioTab, UserProfile } from '../types.ts';

interface HeaderProps {
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onOpenSecurityVault: () => void;
  onLogout: () => void;
  onTriggerRender: () => void;
  onTriggerPdfExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  onOpenLogin,
  onOpenSecurityVault,
  onLogout,
  onTriggerRender,
  onTriggerPdfExport,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [historyMenuOpen, setHistoryMenuOpen] = useState(false);

  const tabs: { id: StudioTab; label: string }[] = [
    { id: 'design-studio', label: 'Design Studio' },
    { id: 'virtual-model-studio', label: 'Virtual Model Studio' },
    { id: 'tech-pack-and-lookbook', label: 'Tech Pack & Lookbook' },
    { id: 'fabric-and-materials-db', label: 'Fabric & Materials DB' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0e17]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.5)] border-b border-[#262a34]/60">
      <div className="h-14 w-full px-3 sm:px-4 flex items-center justify-between gap-3">
        {/* Left: Brand & File path */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onTabChange('design-studio')}
          >
            <img
              alt="ThreadForge Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1W55ulPeU7dzE2j8NEPRA1bIOQqkMghmlmrfGGYEWX9iwJEpk6MdjBME_N9CicYTMFSoMl0RK4_rRlxobjrvKrgMpbk53vbagXRvNOU5ihGRqS-z8TncZjFpplcsZX0fFkdTbpERtL7zVFcO-R0_LOCwM0vfjoh0TyjUlXG7iYA8Ex4wobWDWBbYiAvh5m59J9tSg0LoHBovf_KGDQy1SSRtDc761VEdOylY35eveiofUi41CEa8-ojju2a"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk'] text-[17px] text-[#dfe2ef] tracking-tight font-bold">
                ThreadForge
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#262a34] text-[#c0c1ff] font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider font-semibold">
                v2.4 Pro
              </span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-[#c7c4d7] font-['JetBrains_Mono'] text-[11px] truncate">
            <span className="opacity-40">/</span>
            <span className="truncate max-w-[240px] text-[#dfe2ef]">
              SS26 Streetwear / Oversized Heavy Boxy Tee #084
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#181b25] border border-[#262a34]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
              Saved (12s ago)
            </span>
          </div>
        </div>

        {/* Center: Navigation tabs */}
        <nav className="hidden lg:flex items-center h-full gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`h-full flex items-center px-3.5 text-[13px] font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'bg-[#262a34]/80 text-[#c0c1ff] border-[#c0c1ff] shadow-[inset_0_-2px_0_#c0c1ff]'
                    : 'text-[#c7c4d7] hover:text-[#dfe2ef] hover:bg-[#181b25]/50 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo / History */}
          <div className="hidden sm:flex items-center gap-0.5 bg-[#181b25] p-0.5 rounded border border-[#262a34]/50">
            <button
              className="p-1.5 text-[#c7c4d7] hover:text-[#dfe2ef] hover:bg-[#262a34] rounded transition-all"
              title="Undo"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">undo</span>
            </button>
            <button
              className="p-1.5 text-[#c7c4d7] hover:text-[#dfe2ef] hover:bg-[#262a34] rounded transition-all"
              title="Redo"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">redo</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setHistoryMenuOpen(!historyMenuOpen)}
                className="p-1.5 text-[#c7c4d7] hover:text-[#dfe2ef] hover:bg-[#262a34] rounded transition-all flex items-center"
                title="Version History"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">history</span>
                <span className="material-symbols-outlined text-[13px]">arrow_drop_down</span>
              </button>
              {historyMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-[#181b25] border border-[#31353f] rounded-lg shadow-2xl p-2 z-50 font-['JetBrains_Mono'] text-[11px]">
                  <div className="px-2 py-1 text-[#c7c4d7] uppercase text-[9px] font-bold border-b border-[#262a34] mb-1">
                    Checkpoint History
                  </div>
                  <button
                    onClick={() => setHistoryMenuOpen(false)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-[#262a34] text-[#dfe2ef] flex justify-between"
                  >
                    <span>v2.4 - Boxy Silhouette</span>
                    <span className="text-[#4edea3]">Active</span>
                  </button>
                  <button
                    onClick={() => setHistoryMenuOpen(false)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-[#262a34] text-[#c7c4d7] flex justify-between"
                  >
                    <span>v2.3 - Sigil Decal v2</span>
                    <span className="text-[#908fa0]">10m ago</span>
                  </button>
                  <button
                    onClick={() => setHistoryMenuOpen(false)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-[#262a34] text-[#c7c4d7] flex justify-between"
                  >
                    <span>v2.2 - 280 GSM Cotton</span>
                    <span className="text-[#908fa0]">1h ago</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="hidden 2xl:flex items-center gap-1.5 px-2 py-1 rounded bg-[#181b25] text-[#4cd7f6] font-['JetBrains_Mono'] text-[11px] border border-[#262a34]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
            <span>Sync: 24ms</span>
          </div>

          {/* Primary Render button */}
          <button
            onClick={onTriggerRender}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-[#494bd6] to-[#8083ff] text-white font-['Space_Grotesk'] text-[12px] font-semibold shadow-[0_0_12px_rgba(99,102,241,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span className="hidden sm:inline">Render On-Model</span>
          </button>

          {/* Export PDF button */}
          <button
            onClick={onTriggerPdfExport}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] font-['Space_Grotesk'] text-[12px] transition-all border border-[#31353f]/50 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span className="hidden lg:inline">Export Spec / PDF</span>
          </button>

          {/* User Profile / Lock Screen Avatar */}
          <div className="relative pl-1">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="relative flex items-center rounded-full ring-1 ring-[#31353f] hover:ring-[#c0c1ff] transition-all p-0.5 focus:outline-none"
              title={currentUser ? `${currentUser.fullName} (${currentUser.email})` : 'Account'}
            >
              <img
                alt="Profile"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                src={
                  currentUser?.avatarUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCdGq3bsv68gwzE6-qDh8faYzQs_leeQl-0GkLhYVBNSW5ZHCbvzO_0jo6Ss2Rzy2jtrM_NRIYwhu40UGvMEnvEDMs14yVFCqVns6xSa9zTDjxgHOlEK3JD9_1edDb9tkusQSTa730AVfzictKwy-RYLzJsc2euYWcXbv2FUbJrnfKL1CvB4mR4WSKs3slo1A6N2l5itlXLX9XdjARwcisCYUGKu92-Dc0VUQ9iRDL0eH4YLXKSUzUngw'
                }
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-[#0a0e17]"></span>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#181b25] border border-[#31353f] rounded-xl shadow-2xl p-2.5 z-50">
                <div className="p-2 border-b border-[#262a34] mb-2 flex items-center gap-2.5">
                  <img
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[#c0c1ff]"
                    src={
                      currentUser?.avatarUrl ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuCdGq3bsv68gwzE6-qDh8faYzQs_leeQl-0GkLhYVBNSW5ZHCbvzO_0jo6Ss2Rzy2jtrM_NRIYwhu40UGvMEnvEDMs14yVFCqVns6xSa9zTDjxgHOlEK3JD9_1edDb9tkusQSTa730AVfzictKwy-RYLzJsc2euYWcXbv2FUbJrnfKL1CvB4mR4WSKs3slo1A6N2l5itlXLX9XdjARwcisCYUGKu92-Dc0VUQ9iRDL0eH4YLXKSUzUngw'
                    }
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] text-[#dfe2ef] truncate">
                      {currentUser?.fullName || 'Alex Vance'}
                    </div>
                    <div className="text-[10px] text-[#4edea3] font-['JetBrains_Mono'] truncate">
                      {currentUser?.role || 'Lead CAD Fashion Engineer'}
                    </div>
                    <div className="text-[10px] text-[#908fa0] truncate">
                      {currentUser?.email || 'designer@threadforge.io'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenSecurityVault();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#262a34] text-[#dfe2ef] text-[12px] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
                      shield_lock
                    </span>
                    <span>Security Vault & Credentials</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#262a34] text-[#dfe2ef] text-[12px] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">
                      lock_reset
                    </span>
                    <span>Lock App / Switch User</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#93000a]/20 text-[#ffb4ab] text-[12px] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Log Out</span>
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-[#262a34] px-2 flex items-center justify-between text-[10px] text-[#908fa0] font-['JetBrains_Mono']">
                  <span>AES-256 / PBKDF2</span>
                  <span className="text-[#4edea3]">Vault Active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex items-center overflow-x-auto border-t border-[#262a34]/60 px-2 py-1 bg-[#181b25] gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm'
                  : 'text-[#c7c4d7] hover:text-[#dfe2ef]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
