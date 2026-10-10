/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface TechPackProps {
  onExportPdf?: () => void;
}

export const TechPackAndLookbook: React.FC<TechPackProps> = () => {
  const [activeMode, setActiveMode] = useState<'tech' | 'lookbook'>('tech');
  const [currentSheet, setCurrentSheet] = useState<number>(1);
  const [showCompilerDrawer, setShowCompilerDrawer] = useState(false);
  const [compilerProgress, setCompilerProgress] = useState(84);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const triggerExportPdf = () => {
    setShowCompilerDrawer(true);
    setCompilerProgress(20);
    const interval = setInterval(() => {
      setCompilerProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 20;
      });
    }, 300);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="flex flex-col w-full text-[#dfe2ef] pt-14 pb-8">
      {/* Master Control & Mode Switcher Bar */}
      <div className="w-full px-4 py-2.5 bg-[#0a0e17] flex flex-wrap items-center justify-between gap-3 border-b border-[#262a34] shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mode Tabs */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#181b25] border border-[#262a34]">
            <button
              onClick={() => setActiveMode('tech')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeMode === 'tech'
                  ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm'
                  : 'text-[#c7c4d7] hover:text-[#dfe2ef]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">architecture</span>
              <span>Technical Pack (CAD Blueprint)</span>
            </button>
            <button
              onClick={() => setActiveMode('lookbook')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeMode === 'lookbook'
                  ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm'
                  : 'text-[#c7c4d7] hover:text-[#dfe2ef]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">auto_stories</span>
              <span>Editorial Lookbook Poster</span>
            </button>
          </div>

          {/* Page Pagination Pill */}
          <div className="hidden sm:flex items-center gap-1 bg-[#181b25] px-2.5 py-1 rounded border border-[#262a34]">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">SHEET:</span>
            <button
              onClick={() => setCurrentSheet((s) => Math.max(1, s - 1))}
              className="p-0.5 text-[#c7c4d7] hover:text-[#dfe2ef]"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            </button>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#4cd7f6] font-bold px-1">
              0{currentSheet} / 04
            </span>
            <button
              onClick={() => setCurrentSheet((s) => Math.min(4, s + 1))}
              className="p-0.5 text-[#c7c4d7] hover:text-[#dfe2ef]"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>

          {/* Canvas Calibration Zoom */}
          <div className="hidden lg:flex items-center gap-1 bg-[#181b25] px-2.5 py-1 rounded border border-[#262a34]">
            <span className="material-symbols-outlined text-[14px] text-[#4edea3]">
              fit_screen
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#dfe2ef]">
              100% SCALE (1:1 DRAFT)
            </span>
          </div>
        </div>

        {/* Export & Collaboration Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] text-[12px] font-['Space_Grotesk'] font-medium transition-all shadow-sm border border-[#31353f] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">share</span>
            <span className="hidden md:inline">
              {copyFeedback ? 'Link Copied!' : 'Share Factory Link'}
            </span>
          </button>

          <button
            onClick={() => alert('Downloading technical asset package (TF-26-SS-089.zip)...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] text-[12px] font-['Space_Grotesk'] font-medium transition-all shadow-sm border border-[#31353f] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-[#4edea3]">folder_zip</span>
            <span className="hidden md:inline">Tech Pack .ZIP</span>
          </button>

          <button
            onClick={triggerExportPdf}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-gradient-to-r from-[#494bd6] to-[#8083ff] text-white text-[12px] font-['Space_Grotesk'] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            <span>Export PDF (CMYK 300 DPI)</span>
          </button>
        </div>
      </div>

      {/* Main Spec Sheet Canvas Container */}
      <div className="w-full p-4 flex flex-col gap-5">
        {/* CAD Blueprint Sheet Container */}
        {(activeMode === 'tech' || currentSheet === 1) && (
          <div className="w-full bg-[#0a0e17] rounded-xl p-4 sm:p-6 shadow-xl flex flex-col gap-5 border border-[#262a34] relative overflow-hidden">
            {/* Watermark Grid Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(#c0c1ff 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            ></div>

            {/* Top Technical Dossier Banner */}
            <div className="relative w-full bg-[#181b25] rounded-lg p-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border border-[#262a34]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#c0c1ff] text-[#1000a9] font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest">
                    THREADFORGE MFG PROTOCOL
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6] font-semibold">
                    STYLE NO: TF-26-SS-089
                  </span>
                  <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                  <span className="hidden sm:inline font-['JetBrains_Mono'] text-[10px] text-[#4edea3]">
                    REV 3.2 (PRODUCTION READY)
                  </span>
                </div>
                <h1 className="font-['Space_Grotesk'] text-[24px] text-[#dfe2ef] font-bold tracking-tight">
                  Oversized Heavyweight Boxy Tee
                </h1>
                <p className="font-['Geist'] text-[12px] text-[#c7c4d7]">
                  Season: Spring / Summer 2026 • Category: Cut & Sew Luxury Streetwear • Fit Grade:
                  Boxy Drop-Shoulder Relaxed
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 bg-[#1c1f29] rounded-lg p-2.5 text-[#dfe2ef] border border-[#262a34]">
                <div className="flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7] uppercase">
                    Release Date
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] font-semibold">
                    2025-05-18
                  </span>
                </div>
                <div className="w-px h-6 bg-[#31353f]"></div>
                <div className="flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7] uppercase">
                    Factory Unit
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] font-semibold">
                    Porto Atelier #04
                  </span>
                </div>
                <div className="w-px h-6 bg-[#31353f]"></div>
                <div className="flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7] uppercase">
                    Lead Patternmaker
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#c0c1ff] font-semibold">
                    Studio Lead (CAD-09)
                  </span>
                </div>
                <div className="w-px h-6 bg-[#31353f]"></div>
                <div className="flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7] uppercase">
                    Color Standard
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#4edea3] font-semibold">
                    FOGRA39 / TCX
                  </span>
                </div>
              </div>
            </div>

            {/* Dual Main Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative">
              {/* Left 7-Cols: CAD Technical Flats */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="relative w-full rounded-lg bg-[#181b25] p-3 sm:p-4 shadow-inner flex flex-col gap-3 border border-[#262a34]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
                        straighten
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#dfe2ef] font-semibold">
                        Vector Flat Schematic (Scale 1:10 MM)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#31353f] font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
                        Front + Back Projection
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#00885d]/30 text-[#4edea3] font-['JetBrains_Mono'] text-[10px] font-semibold border border-[#4edea3]/30">
                        ISO 2302 Ready
                      </span>
                    </div>
                  </div>

                  {/* CAD Vector Technical Schematic Render */}
                  <div className="relative w-full bg-[#0a0e17] rounded-lg p-2 sm:p-4 overflow-hidden group border border-[#262a34]">
                    <img
                      alt="Technical CAD blueprint schematic of oversized t-shirt"
                      className="w-full h-auto object-contain rounded filter contrast-125 brightness-95 transition-transform duration-300 group-hover:scale-[1.01]"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbQhaotBS8uGX0xoGR9_RhK3QofmCNDevX_12OgnBp-CU5-msq40FcRDIfapJfvYLI6GKs7K04a6vFW7lBDfvedpKvcEcST7-bhevgwmxuYFgj8xamYMQ_IzTwODETIpuzDTWIT2XrZPYroeRJwKVMXmQRWejoiM7STTNkzPGA45ip4l596qXbjorxXZ0uBF9rLI_23xFc7Rq9pZe51aPlEplIDlTaGczeKdhhxqBU3ccfC0_DjLtfoA"
                    />

                    {/* Floating Dynamic Callout Badges */}
                    <div className="absolute top-4 left-4 bg-[#0a0e17]/90 backdrop-blur-md px-2.5 py-1 rounded shadow-md flex items-center gap-1.5 border border-[#4cd7f6]/40">
                      <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping"></span>
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6] font-bold">
                        DIM A: CHEST 72cm
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-[#0a0e17]/90 backdrop-blur-md px-2.5 py-1 rounded shadow-md flex items-center gap-1.5 border border-[#8083ff]/40">
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#c0c1ff] font-bold">
                        DIM B: LENGTH 78cm
                      </span>
                    </div>
                  </div>

                  {/* Seam Engineering Callouts List */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    <div className="p-2.5 rounded bg-[#1c1f29] flex items-start gap-2.5 border border-[#262a34]">
                      <div className="w-5 h-5 rounded-full bg-[#262a34] text-[#c0c1ff] flex items-center justify-center font-['JetBrains_Mono'] text-[11px] font-bold shrink-0 mt-0.5 border border-[#31353f]">
                        1
                      </div>
                      <div>
                        <div className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold">
                          Collar Ribbing Width
                        </div>
                        <div className="font-['Geist'] text-[11px] text-[#c7c4d7]">
                          18.0 cm inner circumference. 1x1 Spandex-Cotton rib, 2.5 cm ribbed band
                          height with clean bound neck seam.
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-[#1c1f29] flex items-start gap-2.5 border border-[#262a34]">
                      <div className="w-5 h-5 rounded-full bg-[#262a34] text-[#c0c1ff] flex items-center justify-center font-['JetBrains_Mono'] text-[11px] font-bold shrink-0 mt-0.5 border border-[#31353f]">
                        2
                      </div>
                      <div>
                        <div className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold">
                          Dropped Shoulder Seam
                        </div>
                        <div className="font-['Geist'] text-[11px] text-[#c7c4d7]">
                          26.0 cm shoulder drop offset from high shoulder point. Reinforced with
                          twin-needle chainstitch tape.
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-[#1c1f29] flex items-start gap-2.5 border border-[#262a34]">
                      <div className="w-5 h-5 rounded-full bg-[#262a34] text-[#4cd7f6] flex items-center justify-center font-['JetBrains_Mono'] text-[11px] font-bold shrink-0 mt-0.5 border border-[#31353f]">
                        3
                      </div>
                      <div>
                        <div className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold">
                          Graphic Placement Metric
                        </div>
                        <div className="font-['Geist'] text-[11px] text-[#c7c4d7]">
                          ‘Cybernetic Sigil’ center graphic placed exactly 8.0 cm below bottom edge
                          of collar ribbing, centered along vertical placket.
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-[#1c1f29] flex items-start gap-2.5 border border-[#262a34]">
                      <div className="w-5 h-5 rounded-full bg-[#262a34] text-[#4edea3] flex items-center justify-center font-['JetBrains_Mono'] text-[11px] font-bold shrink-0 mt-0.5 border border-[#31353f]">
                        4
                      </div>
                      <div>
                        <div className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold">
                          Hem & Sleeve Blind Stitch
                        </div>
                        <div className="font-['Geist'] text-[11px] text-[#c7c4d7]">
                          Double-needle coverstitch with 2.0 cm fold over hem. 6 mm stitch gauge, zero
                          puckering tolerance.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 5-Cols: Factory Specs, BOM & Colorways */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* BOM Table */}
                <div className="w-full bg-[#181b25] rounded-lg p-3.5 shadow-sm flex flex-col gap-2.5 border border-[#262a34]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#4edea3]">
                        inventory_2
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#dfe2ef] font-semibold">
                        Bill of Materials (BOM)
                      </span>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
                      ISO 9001 Compliant
                    </span>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left font-['JetBrains_Mono'] text-[11px]">
                      <thead>
                        <tr className="bg-[#1c1f29] text-[#c7c4d7]">
                          <th className="p-1.5 font-medium">ITEM</th>
                          <th className="p-1.5 font-medium">DESCRIPTION</th>
                          <th className="p-1.5 font-medium">SPEC</th>
                          <th className="p-1.5 font-medium text-right">WEIGHT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-0 text-[#dfe2ef]">
                        <tr className="hover:bg-[#262a34]/40">
                          <td className="p-1.5 font-bold text-[#c0c1ff]">01</td>
                          <td className="p-1.5 font-semibold">Shell Fabric</td>
                          <td className="p-1.5 text-[#c7c4d7]">100% Combed Ringspun Cotton</td>
                          <td className="p-1.5 text-right text-[#4edea3] font-medium">280 GSM</td>
                        </tr>
                        <tr className="hover:bg-[#262a34]/40 bg-[#1c1f29]/30">
                          <td className="p-1.5 font-bold text-[#c0c1ff]">02</td>
                          <td className="p-1.5 font-semibold">Collar Rib</td>
                          <td className="p-1.5 text-[#c7c4d7]">95% Cot / 5% Spandex 1x1</td>
                          <td className="p-1.5 text-right text-[#4edea3] font-medium">340 GSM</td>
                        </tr>
                        <tr className="hover:bg-[#262a34]/40">
                          <td className="p-1.5 font-bold text-[#4cd7f6]">03</td>
                          <td className="p-1.5 font-semibold">Chest Graphic</td>
                          <td className="p-1.5 text-[#c7c4d7]">Plastisol + Soft Water-base</td>
                          <td className="p-1.5 text-right text-[#4cd7f6] font-medium">Micron-L2</td>
                        </tr>
                        <tr className="hover:bg-[#262a34]/40 bg-[#1c1f29]/30">
                          <td className="p-1.5 font-bold text-[#c7c4d7]">04</td>
                          <td className="p-1.5 font-semibold">Neck Label</td>
                          <td className="p-1.5 text-[#c7c4d7]">Woven Damask Satin + QR</td>
                          <td className="p-1.5 text-right text-[#c7c4d7] font-medium">35x25mm</td>
                        </tr>
                        <tr className="hover:bg-[#262a34]/40">
                          <td className="p-1.5 font-bold text-[#c7c4d7]">05</td>
                          <td className="p-1.5 font-semibold">Care Tag</td>
                          <td className="p-1.5 text-[#c7c4d7]">Recycled Micro-Twill</td>
                          <td className="p-1.5 text-right text-[#c7c4d7] font-medium">Left Seam</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Colorways */}
                <div className="w-full bg-[#181b25] rounded-lg p-3.5 shadow-sm flex flex-col gap-2.5 border border-[#262a34]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">
                        palette
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#dfe2ef] font-semibold">
                        Colorway Swatches (Pantone® TCX)
                      </span>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
                      Delta-E &lt; 0.8 Max
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-[#1c1f29] rounded p-2 flex flex-col gap-1.5 border border-[#262a34]">
                      <div className="w-full h-12 rounded bg-[#1A1A1D] shadow-inner flex items-end p-1">
                        <span className="font-['JetBrains_Mono'] text-[8px] text-white/70 uppercase">
                          HEX #1A1A1D
                        </span>
                      </div>
                      <div>
                        <div className="font-['JetBrains_Mono'] text-[10px] text-[#dfe2ef] font-semibold">
                          19-4008 TCX
                        </div>
                        <div className="text-[9px] text-[#c7c4d7]">Ebony Black (Body)</div>
                      </div>
                    </div>

                    <div className="bg-[#1c1f29] rounded p-2 flex flex-col gap-1.5 border border-[#262a34]">
                      <div className="w-full h-12 rounded bg-[#545B66] shadow-inner flex items-end p-1">
                        <span className="font-['JetBrains_Mono'] text-[8px] text-white/70 uppercase">
                          HEX #545B66
                        </span>
                      </div>
                      <div>
                        <div className="font-['JetBrains_Mono'] text-[10px] text-[#dfe2ef] font-semibold">
                          18-4005 TCX
                        </div>
                        <div className="text-[9px] text-[#c7c4d7]">Gray Stone (Print)</div>
                      </div>
                    </div>

                    <div className="bg-[#1c1f29] rounded p-2 flex flex-col gap-1.5 border border-[#262a34]">
                      <div className="w-full h-12 rounded bg-[#F8F9FA] shadow-inner flex items-end p-1">
                        <span className="font-['JetBrains_Mono'] text-[8px] text-black/70 uppercase">
                          HEX #FFFFFF
                        </span>
                      </div>
                      <div>
                        <div className="font-['JetBrains_Mono'] text-[10px] text-[#dfe2ef] font-semibold">
                          11-0601 TCX
                        </div>
                        <div className="text-[9px] text-[#c7c4d7]">Bright White (Ink)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Measurement Grading Table */}
                <div className="w-full bg-[#181b25] rounded-lg p-3.5 shadow-sm flex flex-col gap-2.5 border border-[#262a34]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">
                        tune
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#dfe2ef] font-semibold">
                        Measurement Grading Table (CM)
                      </span>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#4edea3]">
                      Tol: ±0.5 cm
                    </span>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-center font-['JetBrains_Mono'] text-[10px]">
                      <thead>
                        <tr className="bg-[#1c1f29] text-[#c7c4d7]">
                          <th className="p-1 text-left font-medium">POINT OF MEASURE</th>
                          <th className="p-1 font-medium">S</th>
                          <th className="p-1 font-medium">M</th>
                          <th className="p-1 font-bold text-[#c0c1ff] bg-[#c0c1ff]/10">
                            L (SAMPLE)
                          </th>
                          <th className="p-1 font-medium">XL</th>
                          <th className="p-1 font-medium">XXL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-0 text-[#dfe2ef]">
                        <tr className="hover:bg-[#262a34]/40">
                          <td className="p-1 text-left font-medium">Chest Width (1" Below)</td>
                          <td className="p-1 text-[#c7c4d7]">64.0</td>
                          <td className="p-1 text-[#c7c4d7]">68.0</td>
                          <td className="p-1 font-bold text-[#c0c1ff] bg-[#c0c1ff]/10">72.0</td>
                          <td className="p-1 text-[#c7c4d7]">76.0</td>
                          <td className="p-1 text-[#c7c4d7]">80.0</td>
                        </tr>
                        <tr className="hover:bg-[#262a34]/40 bg-[#1c1f29]/30">
                          <td className="p-1 text-left font-medium">Body Length (HSP to Hem)</td>
                          <td className="p-1 text-[#c7c4d7]">74.0</td>
                          <td className="p-1 text-[#c7c4d7]">76.0</td>
                          <td className="p-1 font-bold text-[#c0c1ff] bg-[#c0c1ff]/10">78.0</td>
                          <td className="p-1 text-[#c7c4d7]">80.0</td>
                          <td className="p-1 text-[#c7c4d7]">82.0</td>
                        </tr>
                        <tr className="hover:bg-[#262a34]/40">
                          <td className="p-1 text-left font-medium">Shoulder Drop Length</td>
                          <td className="p-1 text-[#c7c4d7]">24.0</td>
                          <td className="p-1 text-[#c7c4d7]">25.0</td>
                          <td className="p-1 font-bold text-[#c0c1ff] bg-[#c0c1ff]/10">26.0</td>
                          <td className="p-1 text-[#c7c4d7]">27.0</td>
                          <td className="p-1 text-[#c7c4d7]">28.0</td>
                        </tr>
                        <tr className="hover:bg-[#262a34]/40 bg-[#1c1f29]/30">
                          <td className="p-1 text-left font-medium">Sleeve Length (From Drop)</td>
                          <td className="p-1 text-[#c7c4d7]">22.0</td>
                          <td className="p-1 text-[#c7c4d7]">23.0</td>
                          <td className="p-1 font-bold text-[#c0c1ff] bg-[#c0c1ff]/10">24.0</td>
                          <td className="p-1 text-[#c7c4d7]">25.0</td>
                          <td className="p-1 text-[#c7c4d7]">26.0</td>
                        </tr>
                        <tr className="hover:bg-[#262a34]/40">
                          <td className="p-1 text-left font-medium">Collar Width (Seam to Seam)</td>
                          <td className="p-1 text-[#c7c4d7]">17.0</td>
                          <td className="p-1 text-[#c7c4d7]">17.5</td>
                          <td className="p-1 font-bold text-[#c0c1ff] bg-[#c0c1ff]/10">18.0</td>
                          <td className="p-1 text-[#c7c4d7]">18.5</td>
                          <td className="p-1 text-[#c7c4d7]">19.0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multi-Page Spec Filmstrip / Page Drawer */}
        <div className="w-full bg-[#0a0e17] rounded-lg p-3.5 shadow-sm flex flex-col gap-2.5 border border-[#262a34]">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#c7c4d7] uppercase tracking-wider font-semibold">
              Production Dossier Sheets (4-Sheet Package)
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6] font-mono">
              DACK NO: TF-26-089-A
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Page 1 */}
            <div
              onClick={() => {
                setCurrentSheet(1);
                setActiveMode('tech');
              }}
              className={`rounded p-2 flex flex-col gap-1.5 cursor-pointer transition-all border ${
                currentSheet === 1
                  ? 'bg-[#262a34] border-[#c0c1ff] shadow-md'
                  : 'bg-[#181b25] border-[#262a34] hover:bg-[#1c1f29]'
              }`}
            >
              <div className="relative w-full h-24 rounded bg-[#0a0e17] flex items-center justify-center overflow-hidden">
                <img
                  alt="Sheet 1 Flat schematic"
                  className="w-full h-full object-contain p-1 opacity-90"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbQhaotBS8uGX0xoGR9_RhK3QofmCNDevX_12OgnBp-CU5-msq40FcRDIfapJfvYLI6GKs7K04a6vFW7lBDfvedpKvcEcST7-bhevgwmxuYFgj8xamYMQ_IzTwODETIpuzDTWIT2XrZPYroeRJwKVMXmQRWejoiM7STTNkzPGA45ip4l596qXbjorxXZ0uBF9rLI_23xFc7Rq9pZe51aPlEplIDlTaGczeKdhhxqBU3ccfC0_DjLtfoA"
                />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#c0c1ff] text-[#1000a9] font-['JetBrains_Mono'] text-[9px] font-bold">
                  P1 ACTIVE
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold truncate">
                  1. Technical Flats & CAD
                </span>
                <span className="text-[10px] text-[#c7c4d7] truncate">
                  Pattern outlines & dimension markers
                </span>
              </div>
            </div>

            {/* Page 2 */}
            <div
              onClick={() => setCurrentSheet(2)}
              className={`rounded p-2 flex flex-col gap-1.5 cursor-pointer transition-all border ${
                currentSheet === 2
                  ? 'bg-[#262a34] border-[#c0c1ff] shadow-md'
                  : 'bg-[#181b25] border-[#262a34] hover:bg-[#1c1f29]'
              }`}
            >
              <div className="relative w-full h-24 rounded bg-[#0a0e17] flex flex-col items-center justify-center text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[28px] text-[#908fa0]">
                  content_cut
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#908fa0] mt-1">
                  SEAM MACRO
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold truncate">
                  2. Construction & Stitching
                </span>
                <span className="text-[10px] text-[#c7c4d7] truncate">
                  Reinforced tape & twin blind hem
                </span>
              </div>
            </div>

            {/* Page 3 */}
            <div
              onClick={() => setCurrentSheet(3)}
              className={`rounded p-2 flex flex-col gap-1.5 cursor-pointer transition-all border ${
                currentSheet === 3
                  ? 'bg-[#262a34] border-[#c0c1ff] shadow-md'
                  : 'bg-[#181b25] border-[#262a34] hover:bg-[#1c1f29]'
              }`}
            >
              <div className="relative w-full h-24 rounded bg-[#0a0e17] flex flex-col items-center justify-center text-[#c7c4d7]">
                <span className="material-symbols-outlined text-[28px] text-[#4cd7f6]">layers</span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#4cd7f6] mt-1">
                  1:1 COLOR SEPARATIONS
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold truncate">
                  3. Graphic Art Separation
                </span>
                <span className="text-[10px] text-[#c7c4d7] truncate">
                  Plastisol screens & placement grid
                </span>
              </div>
            </div>

            {/* Page 4 */}
            <div
              onClick={() => {
                setCurrentSheet(4);
                setActiveMode('lookbook');
              }}
              className={`rounded p-2 flex flex-col gap-1.5 cursor-pointer transition-all border ${
                currentSheet === 4
                  ? 'bg-[#262a34] border-[#c0c1ff] shadow-md'
                  : 'bg-[#181b25] border-[#262a34] hover:bg-[#1c1f29]'
              }`}
            >
              <div className="relative w-full h-24 rounded bg-[#0a0e17] overflow-hidden">
                <img
                  alt="Editorial lookbook thumbnail"
                  className="w-full h-full object-cover object-top filter brightness-90"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc2TPnIhAnqRQhLHsL8Nhx-2p6zz4N6bwSvIzoylulb8RQa2rTKPVwX8-PsTAe3lseeNEplv5jQcrfl94mvVx6P0QzTdkgkGveD7obI9iaJ9AwvrBxGtanDboRcP1NlWCjC2f-z7CyEplIKHSLHzoMqsE3qpLpxWTORgzDwm9pWhLy08vJsv99HtzJuWo_B3qm_z8nfuC4YUEIUmBXDiJZRaPiCYydfs7P9a-vvSOcmwbpNCtpqfUhtg"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#0a0e17]/80 font-['JetBrains_Mono'] text-[9px] text-[#4edea3]">
                  LOOKBOOK
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold truncate">
                  4. Lookbook & On-Model
                </span>
                <span className="text-[10px] text-[#c7c4d7] truncate">
                  AI draped campaign poster preview
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Lookbook Poster Preview Section */}
        {(activeMode === 'lookbook' || currentSheet === 4) && (
          <div className="w-full bg-[#0a0e17] rounded-xl p-4 sm:p-6 shadow-xl flex flex-col gap-5 border border-[#262a34]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#00885d]/30 text-[#4edea3] font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-wider border border-[#4edea3]/30">
                    CAMPAIGN LOOKBOOK SHEET 04
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
                    SS26 EDITORIAL RUN
                  </span>
                </div>
                <h2 className="font-['Space_Grotesk'] text-[20px] text-[#dfe2ef] font-bold">
                  On-Model Volumetric Drape Study
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Switched lighting profile to High-Key Cyber Neon')}
                  className="px-3 py-1.5 rounded bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] text-[12px] font-['Space_Grotesk'] font-medium transition-all flex items-center gap-1.5 border border-[#31353f] cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">high_density</span>
                  <span>Switch Pose / Lighting</span>
                </button>
                <button
                  onClick={triggerExportPdf}
                  className="px-3 py-1.5 rounded bg-[#262a34] hover:bg-[#353943] text-[#4cd7f6] text-[12px] font-['Space_Grotesk'] font-medium transition-all flex items-center gap-1.5 border border-[#31353f] cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  <span>High-Res TIF (6000x8000)</span>
                </button>
              </div>
            </div>

            {/* Hero Lookbook Display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-5 relative rounded-lg overflow-hidden shadow-2xl bg-[#181b25] max-h-[640px] flex items-center justify-center border border-[#262a34]">
                <img
                  alt="Female model wearing oversized graphic heavy tee in brutalist concrete architecture"
                  className="w-full h-full object-cover object-center max-h-[600px] rounded"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc2TPnIhAnqRQhLHsL8Nhx-2p6zz4N6bwSvIzoylulb8RQa2rTKPVwX8-PsTAe3lseeNEplv5jQcrfl94mvVx6P0QzTdkgkGveD7obI9iaJ9AwvrBxGtanDboRcP1NlWCjC2f-z7CyEplIKHSLHzoMqsE3qpLpxWTORgzDwm9pWhLy08vJsv99HtzJuWo_B3qm_z8nfuC4YUEIUmBXDiJZRaPiCYydfs7P9a-vvSOcmwbpNCtpqfUhtg"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-[#0a0e17]/85 backdrop-blur-md p-2.5 rounded flex items-center justify-between border border-[#262a34]">
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#dfe2ef] font-semibold">
                      MODEL FIT CALIBRATION
                    </span>
                    <span className="text-[10px] text-[#c7c4d7]">
                      Height: 178cm • Sample Size L • Brutalist Concrete Hall
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#4edea3] text-[#002113] font-['JetBrains_Mono'] text-[10px] font-bold">
                    100% DRAPE ACCURATE
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="p-5 rounded-lg bg-[#181b25] flex flex-col gap-4 shadow-sm border border-[#262a34]">
                  <h3 className="font-['Space_Grotesk'] text-[18px] text-[#dfe2ef] font-bold">
                    Volumetric Simulation & Real-World Fall Summary
                  </h3>
                  <p className="font-['Geist'] text-[13px] text-[#c7c4d7] leading-relaxed">
                    The SS26 Oversized Heavyweight Boxy Tee utilizes a high-mass 280 GSM single-jersey
                    yarn structure. The dropped shoulder point is calibrated at exactly 26 cm,
                    preventing standard fabric sleeve collapse and sustaining an architectural
                    geometric posture around the deltoid and upper biceps.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="bg-[#1c1f29] p-4 rounded flex flex-col gap-1 border border-[#262a34]">
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#c0c1ff] font-bold">
                        FABRIC TORQUE RATING
                      </span>
                      <span className="font-['Space_Grotesk'] text-[20px] text-[#dfe2ef] font-bold">
                        0.4% SPIRALITY
                      </span>
                      <span className="font-['Geist'] text-[11px] text-[#c7c4d7]">
                        Pre-shrunk silicone washed wash cycle eliminates vertical seam twisting post
                        laundry.
                      </span>
                    </div>

                    <div className="bg-[#1c1f29] p-4 rounded flex flex-col gap-1 border border-[#262a34]">
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#4edea3] font-bold">
                        STRETCH RECOVERY COEFF
                      </span>
                      <span className="font-['Space_Grotesk'] text-[20px] text-[#dfe2ef] font-bold">
                        97.8% (COLLAR)
                      </span>
                      <span className="font-['Geist'] text-[11px] text-[#c7c4d7]">
                        Spandex core ribbing retains form over 50 industrial washing simulations
                        without baconing.
                      </span>
                    </div>
                  </div>

                  {/* Print Formula */}
                  <div className="bg-[#1c1f29] p-4 rounded flex flex-col gap-2 border border-[#262a34]">
                    <div className="flex items-center justify-between">
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#4cd7f6] font-bold uppercase">
                        Screen-Print Formula: 'Cybernetic Sigil'
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
                        Mesh: 230 Yellow Thread
                      </span>
                    </div>
                    <p className="font-['Geist'] text-[11px] text-[#c7c4d7] leading-relaxed">
                      Base discharge primer layer applied to lift black dye, followed by 2 coats of
                      semi-gloss plastisol and cured through a conveyor tunnel oven at 165°C for 90
                      seconds. Soft-hand emulsion ensures zero chest boardiness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating PDF Generation Drawer */}
      {showCompilerDrawer && (
        <div className="fixed bottom-12 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-[#0a0e17]/95 backdrop-blur-2xl rounded-xl p-4 shadow-2xl flex flex-col gap-2.5 border border-[#31353f] transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[18px] text-[#4edea3] ${
                  compilerProgress < 100 ? 'animate-spin' : ''
                }`}
              >
                {compilerProgress < 100 ? 'refresh' : 'check_circle'}
              </span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-bold uppercase tracking-wider">
                PDF Compiler Pipeline
              </span>
            </div>
            <button
              onClick={() => setShowCompilerDrawer(false)}
              className="text-[#908fa0] hover:text-[#dfe2ef]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div className="w-full bg-[#262a34] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#4cd7f6] to-[#4edea3] h-full transition-all duration-300"
              style={{ width: `${compilerProgress}%` }}
            ></div>
          </div>

          <div className="flex flex-col gap-1 text-[#dfe2ef]">
            <span className="font-['JetBrains_Mono'] text-[11px] font-mono">
              {compilerProgress < 100
                ? 'Compiling vector CAD layers & CMYK assets...'
                : 'Compilation Complete: Ready for Factory Production'}
            </span>
            <span className="text-[10px] text-[#c7c4d7]">
              CMYK FOGRA39 color profile applied. Vector layers embedded with 300 DPI high-pass
              raster flats.
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 font-['JetBrains_Mono'] text-[10px]">
            <span className="text-[#4edea3] font-bold">STATUS: {compilerProgress}% COMPLETE</span>
            <span className="text-[#c7c4d7] font-mono">14.8 MB / PDF-X-4</span>
          </div>
        </div>
      )}
    </div>
  );
};
