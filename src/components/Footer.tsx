/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DecalTransform } from '../types.ts';

interface FooterProps {
  transform: DecalTransform;
  substrateName?: string;
  activePatternIsland?: string;
  onOpenShortcuts?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  transform,
  substrateName = 'Heavyweight Cotton 280 GSM',
  activePatternIsland = 'Front Chest (Mesh Lod-0)',
  onOpenShortcuts,
}) => {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  return (
    <>
      <footer className="fixed bottom-0 w-full z-40 bg-[#0a0e17]/95 backdrop-blur-md border-t border-[#262a34]/70 shadow-[0_-1px_6px_rgba(0,0,0,0.4)]">
        <div className="h-8 w-full px-3 sm:px-4 flex items-center justify-between font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
          {/* Left: Active Tool & Coordinates */}
          <div className="flex items-center gap-3 truncate">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[#4cd7f6] font-semibold">TOOL:</span>
              <span className="text-[#dfe2ef] font-medium truncate">
                Decal Transform Matrix (X: {transform.posX.toFixed(0)}mm, Y:{' '}
                {transform.posY.toFixed(0)}mm, W: {transform.width.toFixed(0)}mm)
              </span>
            </div>
            <span className="opacity-20 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-1.5 truncate">
              <span className="text-[#4edea3]">PBR:</span>
              <span className="text-[#dfe2ef] truncate">{substrateName}</span>
            </div>
            <span className="opacity-20 hidden lg:inline">|</span>
            <div className="hidden lg:flex items-center gap-1.5 truncate">
              <span className="text-[#c0c1ff]">UV:</span>
              <span className="text-[#dfe2ef] truncate">{activePatternIsland}</span>
            </div>
          </div>

          {/* Right: Metrics & System Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[#4edea3]">
              <span className="material-symbols-outlined text-[12px]">speed</span>
              <span>60 FPS</span>
            </div>
            <span className="opacity-20 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-[#c7c4d7]">Worker:</span>
              <span className="text-[#4edea3]">Idle (0)</span>
            </div>
            <span className="opacity-20 hidden sm:inline">|</span>
            <div className="flex items-center gap-1">
              <span className="text-[#dfe2ef]">100%</span>
            </div>
            <span className="opacity-20">|</span>
            <button
              onClick={() => (onOpenShortcuts ? onOpenShortcuts() : setShowShortcutsModal(true))}
              className="hover:text-[#dfe2ef] flex items-center gap-0.5 text-[#c0c1ff] hover:underline cursor-pointer"
              type="button"
              title="Keyboard Shortcuts"
            >
              <span className="material-symbols-outlined text-[13px]">keyboard</span>
              <span>[?]</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#181b25] border border-[#31353f] rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262a34] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#c0c1ff]">
                  keyboard
                </span>
                <h3 className="font-['Space_Grotesk'] text-[16px] font-bold text-[#dfe2ef]">
                  ThreadForge Studio Hotkeys
                </h3>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="text-[#908fa0] hover:text-[#dfe2ef]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2 font-['JetBrains_Mono'] text-[11px]">
              <div className="flex justify-between items-center py-1 border-b border-[#262a34]/50">
                <span className="text-[#c7c4d7]">Fit Pattern to Viewport</span>
                <kbd className="px-2 py-0.5 rounded bg-[#262a34] text-[#c0c1ff]">F</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#262a34]/50">
                <span className="text-[#c7c4d7]">Flatten Mesh Geometry</span>
                <kbd className="px-2 py-0.5 rounded bg-[#262a34] text-[#c0c1ff]">Ctrl + E</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#262a34]/50">
                <span className="text-[#c7c4d7]">Toggle 2D / 3D Split View</span>
                <kbd className="px-2 py-0.5 rounded bg-[#262a34] text-[#c0c1ff]">Tab</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#262a34]/50">
                <span className="text-[#c7c4d7]">Snapshot 3D Model Angle</span>
                <kbd className="px-2 py-0.5 rounded bg-[#262a34] text-[#c0c1ff]">S</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#262a34]/50">
                <span className="text-[#c7c4d7]">Generate 4K Inference</span>
                <kbd className="px-2 py-0.5 rounded bg-[#262a34] text-[#c0c1ff]">Ctrl + Enter</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#c7c4d7]">Export Spec / PDF Sheet</span>
                <kbd className="px-2 py-0.5 rounded bg-[#262a34] text-[#c0c1ff]">Ctrl + P</kbd>
              </div>
            </div>

            <button
              onClick={() => setShowShortcutsModal(false)}
              className="w-full py-2 rounded-lg bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] text-[12px] font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
