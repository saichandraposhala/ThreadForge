/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudioTab } from '../types.ts';

interface VirtualModelStudioProps {
  onNavigateTab: (tab: StudioTab) => void;
}

export const VirtualModelStudio: React.FC<VirtualModelStudioProps> = ({ onNavigateTab }) => {
  // Model setup
  const [selectedGender, setSelectedGender] = useState<'Female' | 'Male' | 'Andro'>('Female');
  const [somaticProfile, setSomaticProfile] = useState('Runway Slim');
  const [heightCm, setHeightCm] = useState(178.5);
  const [chestCm, setChestCm] = useState(88.0);
  const [phenotype, setPhenotype] = useState('Euro Minimal');
  const [activePose, setActivePose] = useState('Editorial Brutalist Stance');

  // Environment & Lighting
  const [environment, setEnvironment] = useState('Brutalist Concrete Gallery');
  const [keyLightAzimuth, setKeyLightAzimuth] = useState(45);
  const [fillKelvin, setFillKelvin] = useState(4800);
  const [ambientOcclusion, setAmbientOcclusion] = useState(0.62);

  // ControlNet
  const [inpaintWeight, setInpaintWeight] = useState(0.88);
  const [tileDenoise, setTileDenoise] = useState(0.35);

  // Inspection pins
  const [showPins, setShowPins] = useState(true);
  const [activePin, setActivePin] = useState<number | null>(null);

  // View mode
  const [viewLayout, setViewLayout] = useState<'single' | 'grid' | 'split'>('single');

  // Active Variant index
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  // Generation simulation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const variants = [
    {
      id: 0,
      title: 'Front 3/4 • Concrete',
      sub: 'Active Viewport',
      score: '99.4%',
      gender: 'Female',
      pose: 'Editorial Brutalist Architectural Stance',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAc2TPnIhAnqRQhLHsL8Nhx-2p6zz4N6bwSvIzoylulb8RQa2rTKPVwX8-PsTAe3lseeNEplv5jQcrfl94mvVx6P0QzTdkgkGveD7obI9iaJ9AwvrBxGtanDboRcP1NlWCjC2f-z7CyEplIKHSLHzoMqsE3qpLpxWTORgzDwm9pWhLy08vJsv99HtzJuWo_B3qm_z8nfuC4YUEIUmBXDiJZRaPiCYydfs7P9a-vvSOcmwbpNCtpqfUhtg',
    },
    {
      id: 1,
      title: 'Runway Walking Stride',
      sub: 'Tokyo Industrial',
      score: '98.9%',
      gender: 'Male',
      pose: 'Tokyo Runway High-Stride Walk',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBZoL99-2YVsW0GGnt8W2lLvu6rAkK48T-o0q5wyfx45m2eQyAV2M0zZJCkuYolAWQRTp72jvzy9ErDxLW8ZOFPZKiUFoGxqfvXZ6UHJunLk8n_iAU1iDiqiKN_qmHQVPUEEK8a2GnkZ9hSZjMZUZW9lldzUpmwn3peHDnr_wW8gfkH7xDH4JoDQgwGooFBFOGSYm44Mm1nWlQRILSrMR2mXaElYNxgoGbVXxGi5IDJM03L5zMAun44pg',
    },
    {
      id: 2,
      title: 'Macro Ribbing & Collar',
      sub: 'Extreme Detail',
      score: '99.8%',
      gender: 'Female',
      pose: 'Macro Collar Construction Zoom',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAc2TPnIhAnqRQhLHsL8Nhx-2p6zz4N6bwSvIzoylulb8RQa2rTKPVwX8-PsTAe3lseeNEplv5jQcrfl94mvVx6P0QzTdkgkGveD7obI9iaJ9AwvrBxGtanDboRcP1NlWCjC2f-z7CyEplIKHSLHzoMqsE3qpLpxWTORgzDwm9pWhLy08vJsv99HtzJuWo_B3qm_z8nfuC4YUEIUmBXDiJZRaPiCYydfs7P9a-vvSOcmwbpNCtpqfUhtg',
    },
    {
      id: 3,
      title: 'Rear Graphic Drape',
      sub: 'Queue #1 (Processing)',
      score: '97.2%',
      gender: 'Female',
      pose: 'Low-Angle Hero Stride',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCLLHE3qM5uLPQ_vpS0OOQ_JUuwpn4UTwJFmS8FqxbsRH229ER02Mlg5sJZDBYnhOJLn43MVB5oI7qzovTLGD1g2y-C2ZQEnzJRx5YLlxnQS2ajbHh2QtV-uNfM3peSvmMVgQB8JC6EcFRjcPBgwGeFUZRfgY6qfl8EUUUiz9OLx6gSnbb-MP7TDrr93ftSgX8s_Fba5hjiHCBQrUSzfFA3Iv8f5fbyr-PS6tqxl6d8loIIw1l-4yioKA',
    },
  ];

  const currentVariant = variants[activeVariantIndex];

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenProgress(10);
    const interval = setInterval(() => {
      setGenProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 0;
        }
        return prev + 18;
      });
    }, 400);
  };

  return (
    <div className="flex flex-col w-full text-[#dfe2ef] pt-14 pb-8">
      {/* Sub-Header Studio Ribbon */}
      <div className="w-full bg-[#0a0e17]/80 backdrop-blur-md px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-[#262a34]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.6)]"></span>
            <span className="font-['Space_Grotesk'] text-[15px] tracking-tight font-semibold text-[#dfe2ef]">
              Outlook Inference Pipeline
            </span>
          </div>
          <div className="h-4 w-[1px] bg-[#31353f] hidden md:block"></div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#262a34] text-[#c0c1ff] font-['JetBrains_Mono'] text-[10px]">
            <span className="material-symbols-outlined text-[13px] text-[#4cd7f6]">memory</span>
            <span>Flux.1 Schnell + ControlNet Tile v1.4</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#181b25] text-[#4edea3] font-['JetBrains_Mono'] text-[10px] border border-[#262a34]">
            <span className="material-symbols-outlined text-[13px]">lock</span>
            <span>Fidelity Lock: Enabled (High Garment Transfer)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode buttons */}
          <div className="flex items-center bg-[#262a34] rounded p-0.5 border border-[#31353f]/60">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewLayout === 'grid' ? 'bg-[#181b25] text-[#c0c1ff]' : 'text-[#c7c4d7]'
              }`}
              title="2x2 Grid View"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewLayout('single')}
              className={`p-1.5 rounded transition-colors ${
                viewLayout === 'single' ? 'bg-[#181b25] text-[#c0c1ff]' : 'text-[#c7c4d7]'
              }`}
              title="Single Inspector (Active)"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">crop_free</span>
            </button>
            <button
              onClick={() => setViewLayout('split')}
              className={`p-1.5 rounded transition-colors ${
                viewLayout === 'split' ? 'bg-[#181b25] text-[#c0c1ff]' : 'text-[#c7c4d7]'
              }`}
              title="Split Before/After UV"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">vertical_split</span>
            </button>
          </div>

          <button
            onClick={() => alert('Exporting 4K Lossless RGBA EXR render package...')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] text-[12px] font-['Space_Grotesk'] font-medium transition-all border border-[#31353f] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            <span>4K EXR / PNG</span>
          </button>

          <button
            onClick={() => onNavigateTab('tech-pack-and-lookbook')}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#494bd6]/25 text-[#c0c1ff] hover:bg-[#494bd6]/40 text-[12px] font-['Space_Grotesk'] font-medium transition-all border border-[#494bd6]/40 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">collections_bookmark</span>
            <span>Export to Lookbook</span>
          </button>
        </div>
      </div>

      {/* Studio Main Workstation Grid */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-3.5 px-4 py-3">
        {/* LEFT CONFIGURATION SIDEBAR (xl:col-span-4) */}
        <aside className="xl:col-span-4 2xl:col-span-3 flex flex-col gap-3">
          {/* Model Archetype */}
          <section className="bg-[#1c1f29] rounded-xl p-3.5 shadow-md flex flex-col gap-3 border border-[#262a34]">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-[#c7c4d7] flex items-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[15px] text-[#c0c1ff]">
                  person_outline
                </span>
                Model Archetype
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6]">
                EU 38 / Runway
              </span>
            </div>

            {/* Gender Switcher */}
            <div className="grid grid-cols-3 gap-1 bg-[#0a0e17] p-1 rounded-lg font-['Geist'] text-[12px] border border-[#262a34]/60">
              {(['Female', 'Male', 'Andro'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setSelectedGender(g);
                    if (g === 'Male') setActiveVariantIndex(1);
                    else setActiveVariantIndex(0);
                  }}
                  className={`py-1 text-center rounded transition-all cursor-pointer ${
                    selectedGender === g
                      ? 'bg-[#c0c1ff] text-[#1000a9] font-semibold shadow-sm'
                      : 'text-[#c7c4d7] hover:text-[#dfe2ef]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Somatic Profile */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase">
                Somatic Profile
              </label>
              <div className="flex flex-wrap gap-1">
                {['Runway Slim', 'Athletic', 'Streetwear Boxy', 'Petite'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSomaticProfile(p)}
                    className={`px-2 py-1 rounded text-[11px] font-['Geist'] transition-colors cursor-pointer ${
                      somaticProfile === p
                        ? 'bg-[#494bd6]/30 text-[#c0c1ff] border border-[#8083ff]/40 font-medium'
                        : 'bg-[#262a34] text-[#c7c4d7] hover:text-[#dfe2ef]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Measurement HUD Scrubbers */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-[#0a0e17] p-2 rounded flex flex-col border border-[#262a34]/50">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">HEIGHT</span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold">
                  {heightCm} cm
                </span>
              </div>
              <div className="bg-[#0a0e17] p-2 rounded flex flex-col border border-[#262a34]/50">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">CHEST</span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold">
                  {chestCm} cm
                </span>
              </div>
              <div className="bg-[#0a0e17] p-2 rounded flex flex-col border border-[#262a34]/50">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">FIT FIT</span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#4cd7f6] font-semibold">
                  Oversize M
                </span>
              </div>
            </div>

            {/* Ethnicity / Phenotype */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] uppercase">
                Phenotype Preset
              </label>
              <div className="grid grid-cols-2 gap-1.5 font-['JetBrains_Mono'] text-[10px]">
                <button
                  type="button"
                  onClick={() => setPhenotype('East Asian #04')}
                  className={`px-2 py-1.5 rounded flex items-center justify-between cursor-pointer ${
                    phenotype === 'East Asian #04'
                      ? 'bg-[#494bd6]/30 text-[#c0c1ff] border border-[#8083ff]/40'
                      : 'bg-[#262a34] text-[#dfe2ef]'
                  }`}
                >
                  <span>East Asian #04</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhenotype('Euro Minimal')}
                  className={`px-2 py-1.5 rounded flex items-center justify-between cursor-pointer ${
                    phenotype === 'Euro Minimal'
                      ? 'bg-[#494bd6]/30 text-[#c0c1ff] border border-[#8083ff]/40'
                      : 'bg-[#262a34] text-[#dfe2ef]'
                  }`}
                >
                  <span>Euro Minimal</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>
                </button>
              </div>
            </div>
          </section>

          {/* Pose & Motion Engine */}
          <section className="bg-[#1c1f29] rounded-xl p-3.5 shadow-md flex flex-col gap-3 border border-[#262a34]">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-[#c7c4d7] flex items-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">
                  accessibility_new
                </span>
                Pose & Motion Engine
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#4edea3]">Rig ID: #RK-902</span>
            </div>

            <div className="space-y-1.5">
              {/* Active Pose Card */}
              <div className="p-2 rounded-lg bg-[#262a34] shadow-xs flex items-center justify-between border border-[#31353f]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">man</span>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium text-[#dfe2ef]">
                      {activePose}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                      Front 3/4 • Weight shifted left • Natural drape
                    </span>
                  </div>
                </div>
                <span className="font-['JetBrains_Mono'] text-[9px] px-1.5 py-0.5 rounded bg-[#c0c1ff]/20 text-[#c0c1ff] font-semibold">
                  Active
                </span>
              </div>

              {/* Other Pose Options */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {[
                  { title: 'Tokyo Runway', desc: 'Dynamic walk', varIdx: 1 },
                  { title: 'Macro Seam', desc: 'Chest zoom', varIdx: 2 },
                  { title: 'Low-Angle', desc: 'Hero Stride', varIdx: 3 },
                ].map((pose) => (
                  <button
                    key={pose.title}
                    type="button"
                    onClick={() => {
                      setActivePose(pose.title);
                      setActiveVariantIndex(pose.varIdx);
                    }}
                    className="p-2 rounded bg-[#0a0e17] hover:bg-[#262a34] text-left transition-colors flex flex-col border border-[#262a34]/60 cursor-pointer"
                  >
                    <span className="text-[11px] font-medium text-[#dfe2ef] truncate">
                      {pose.title}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                      {pose.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Environment & HDRI */}
          <section className="bg-[#1c1f29] rounded-xl p-3.5 shadow-md flex flex-col gap-3 border border-[#262a34]">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-[#c7c4d7] flex items-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[15px] text-[#4edea3]">
                  wb_sunny
                </span>
                Environment & HDRI
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6]">
                {fillKelvin}K Diffused
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between bg-[#0a0e17] px-2.5 py-1.5 rounded border border-[#262a34]">
                <span className="text-[11px] text-[#dfe2ef]">{environment}</span>
                <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">
                  check_circle
                </span>
              </div>

              {/* Sliders */}
              <div className="space-y-2 pt-1 font-['JetBrains_Mono'] text-[10px]">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[#c7c4d7]">
                    <span>Key Light Azimuth</span>
                    <span className="text-[#dfe2ef]">{keyLightAzimuth.toFixed(1)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={keyLightAzimuth}
                    onChange={(e) => setKeyLightAzimuth(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#0a0e17] rounded-full accent-[#4cd7f6] cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[#c7c4d7]">
                    <span>Fill Temperature (Kelvin)</span>
                    <span className="text-[#dfe2ef]">{fillKelvin.toLocaleString()} K</span>
                  </div>
                  <input
                    type="range"
                    min="2700"
                    max="6500"
                    step="100"
                    value={fillKelvin}
                    onChange={(e) => setFillKelvin(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#0a0e17] rounded-full accent-[#4edea3] cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[#c7c4d7]">
                    <span>Ambient Contact Occlusion</span>
                    <span className="text-[#dfe2ef]">{ambientOcclusion.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={ambientOcclusion}
                    onChange={(e) => setAmbientOcclusion(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#0a0e17] rounded-full accent-[#8083ff] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ControlNet Conditioning */}
          <section className="bg-[#1c1f29] rounded-xl p-3.5 shadow-md flex flex-col gap-3 border border-[#262a34]">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-[#c7c4d7] flex items-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[15px] text-[#c0c1ff]">grain</span>
                ControlNet Conditioning
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#4edea3]">Rigidity 95%</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-[#0a0e17] p-1.5 rounded flex flex-col items-center text-center border border-[#262a34]/60">
                <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">
                  texture
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#dfe2ef] truncate">
                  UV Map 4K
                </span>
                <span className="text-[9px] text-[#4edea3] font-['JetBrains_Mono']">Bound</span>
              </div>
              <div className="bg-[#0a0e17] p-1.5 rounded flex flex-col items-center text-center border border-[#262a34]/60">
                <span className="material-symbols-outlined text-[14px] text-[#c0c1ff]">masks</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#dfe2ef] truncate">
                  Alpha Rig
                </span>
                <span className="text-[9px] text-[#4edea3] font-['JetBrains_Mono']">100%</span>
              </div>
              <div className="bg-[#0a0e17] p-1.5 rounded flex flex-col items-center text-center border border-[#262a34]/60">
                <span className="material-symbols-outlined text-[14px] text-[#c7c4d7]">layers</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#dfe2ef] truncate">
                  Displace PBR
                </span>
                <span className="text-[9px] text-[#4cd7f6] font-['JetBrains_Mono']">280 GSM</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[#c7c4d7] font-['JetBrains_Mono'] text-[10px]">
              <div className="bg-[#0a0e17] px-2 py-1 rounded flex justify-between border border-[#262a34]/50">
                <span>Inpaint W:</span>
                <span className="text-[#dfe2ef] font-medium">{inpaintWeight}</span>
              </div>
              <div className="bg-[#0a0e17] px-2 py-1 rounded flex justify-between border border-[#262a34]/50">
                <span>Tile Denoise:</span>
                <span className="text-[#dfe2ef] font-medium">{tileDenoise}</span>
              </div>
            </div>
          </section>

          {/* Primary Tactical Action: Render CTA */}
          <div className="pt-1">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#494bd6] via-[#8083ff] to-[#03b5d3] text-white font-['Space_Grotesk'] text-[14px] font-bold shadow-[0_4px_24px_rgba(99,102,241,0.45)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              type="button"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Synthesizing Geometry & Photons ({genProgress}%)...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-pulse">
                    auto_awesome
                  </span>
                  <span>Generate 4K On-Model Renders</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#0a0e17]/40 font-['JetBrains_Mono'] text-[10px]">
                    4 CR
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1.5 px-1 font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
              <span>Est. Latency: ~5.8s</span>
              <span className="text-[#4edea3] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                Node Worker Ready
              </span>
            </div>
          </div>
        </aside>

        {/* CENTER & RIGHT MAIN STAGE (xl:col-span-8) */}
        <main className="xl:col-span-8 2xl:col-span-9 flex flex-col gap-3">
          {/* Primary Editorial Viewport Card */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-[#0a0e17] shadow-2xl flex flex-col justify-end min-h-[580px] lg:min-h-[640px] xl:min-h-[700px] border border-[#262a34]">
            {/* Model Image */}
            <div className="absolute inset-0 w-full h-full">
              <img
                alt="High-fashion model wearing the oversized cyberpunk boxy t-shirt"
                className="w-full h-full object-cover object-center filter saturate-[0.96] transition-opacity duration-300"
                src={currentVariant.image}
              />
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-transparent opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e17]/30 via-transparent to-transparent"></div>
            </div>

            {/* Top Floating Viewport HUD */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
              <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0a0e17]/85 backdrop-blur-xl shadow-lg border border-[#262a34]">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-semibold">
                  VIEWPORT 01: 3840 x 2160 (Lossless RGBA)
                </span>
                <span className="text-[#c7c4d7]/40">/</span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6]">
                  Focal: 50mm f/2.8
                </span>
              </div>

              <div className="pointer-events-auto flex items-center gap-1 bg-[#0a0e17]/85 backdrop-blur-xl rounded-lg p-1 border border-[#262a34]">
                <button
                  onClick={() => setShowPins(!showPins)}
                  className={`px-2 py-1 rounded font-['JetBrains_Mono'] text-[11px] flex items-center gap-1 transition-colors ${
                    showPins ? 'bg-[#262a34] text-[#c0c1ff]' : 'text-[#c7c4d7]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">adjust</span>
                  <span>Inspection Pins</span>
                </button>
                <button
                  onClick={() => alert('Fitted image to canvas')}
                  className="p-1 text-[#c7c4d7] hover:text-[#dfe2ef] rounded"
                  title="Zoom Fit"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">fit_screen</span>
                </button>
                <button
                  onClick={() => alert('Fullscreen inspector toggled')}
                  className="p-1 text-[#c7c4d7] hover:text-[#dfe2ef] rounded"
                  title="Full Screen"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                </button>
              </div>
            </div>

            {/* Interactive Vector / Garment Inspection Pins Layer */}
            {showPins && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Pin 1: Chest Decal Fidelity */}
                <div className="absolute top-[38%] left-[48%] pointer-events-auto group">
                  <div className="relative flex items-center justify-center">
                    <span className="w-4 h-4 rounded-full bg-[#4cd7f6]/30 animate-ping absolute"></span>
                    <button
                      onClick={() => setActivePin(activePin === 1 ? null : 1)}
                      className="w-6 h-6 rounded-full bg-[#4cd7f6] text-[#003640] flex items-center justify-center shadow-lg hover:scale-125 transition-transform cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">my_location</span>
                    </button>

                    {/* Popover Card */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 p-3 rounded-lg bg-[#0a0e17]/95 backdrop-blur-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0 z-30 border border-[#31353f]">
                      <div className="flex items-center justify-between text-[#4cd7f6] font-['JetBrains_Mono'] text-[10px] mb-1">
                        <span className="font-bold">CHEST DECAL SPEC</span>
                        <span>100% Vector Lock</span>
                      </div>
                      <p className="text-[11px] text-[#dfe2ef] leading-snug">
                        Zero pixel warping or seam stretching under garment fold simulation. Tile Scale: 1.00x.
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[9px] font-['JetBrains_Mono'] text-[#c7c4d7] pt-1 border-t border-[#262a34]">
                        <span>Delta E: 0.12 (Exact)</span>
                        <span className="text-[#4edea3]">UV LOD-0 Matched</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pin 2: Shoulder Seam Drape */}
                <div className="absolute top-[31%] left-[39%] pointer-events-auto group">
                  <div className="relative flex items-center justify-center">
                    <button
                      onClick={() => setActivePin(activePin === 2 ? null : 2)}
                      className="w-6 h-6 rounded-full bg-[#c0c1ff] text-[#07006c] flex items-center justify-center shadow-lg hover:scale-125 transition-transform cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">tune</span>
                    </button>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 p-3 rounded-lg bg-[#0a0e17]/95 backdrop-blur-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0 z-30 border border-[#31353f]">
                      <div className="flex items-center justify-between text-[#c0c1ff] font-['JetBrains_Mono'] text-[10px] mb-1">
                        <span className="font-bold">SHOULDER DRAPE SIM</span>
                        <span>280 GSM</span>
                      </div>
                      <p className="text-[11px] text-[#dfe2ef] leading-snug">
                        Natural drop-shoulder crease curvature physics with heavyweight cotton tensile resistance.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pin 3: Hem Stitching Integrity */}
                <div className="absolute top-[62%] left-[45%] pointer-events-auto group">
                  <div className="relative flex items-center justify-center">
                    <button
                      onClick={() => setActivePin(activePin === 3 ? null : 3)}
                      className="w-6 h-6 rounded-full bg-[#4edea3] text-[#002113] flex items-center justify-center shadow-lg hover:scale-125 transition-transform cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">straighten</span>
                    </button>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 p-3 rounded-lg bg-[#0a0e17]/95 backdrop-blur-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0 z-30 border border-[#31353f]">
                      <div className="flex items-center justify-between text-[#4edea3] font-['JetBrains_Mono'] text-[10px] mb-1">
                        <span className="font-bold">DOUBLE-NEEDLE HEM</span>
                        <span>Preserved</span>
                      </div>
                      <p className="text-[11px] text-[#dfe2ef] leading-snug">
                        Twin needle 6mm spacing intact along bottom rim with zero displacement bleed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Viewport Bottom Status Bar Ribbon */}
            <div className="relative z-20 w-full p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/90 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-['Space_Grotesk'] text-[16px] font-semibold text-[#dfe2ef]">
                    Pose: {currentVariant.pose}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[11px] text-[#4edea3] flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Garment Integrity Validated • {currentVariant.score} Surface Match
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-3 px-3 py-1 rounded-lg bg-[#262a34]/80 backdrop-blur-md font-['JetBrains_Mono'] text-[11px] border border-[#31353f]">
                  <span className="text-[#c7c4d7]">
                    Inference: <strong className="text-[#dfe2ef]">5.84s</strong>
                  </span>
                  <span className="text-[#c7c4d7]">
                    VRAM: <strong className="text-[#4cd7f6]">18.2 / 24 GB</strong>
                  </span>
                  <span className="text-[#c7c4d7]">
                    Seeds: <strong className="text-[#dfe2ef]">#48190392</strong>
                  </span>
                </div>
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2 rounded-lg transition-colors border border-[#31353f] cursor-pointer ${
                    bookmarked ? 'bg-[#c0c1ff] text-[#07006c]' : 'bg-[#262a34] text-[#dfe2ef]'
                  }`}
                  title="Bookmark / Star"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {bookmarked ? 'bookmark_added' : 'bookmark'}
                  </span>
                </button>
                <button
                  onClick={() => alert('Snapshot link copied to clipboard')}
                  className="p-2 rounded-lg bg-[#262a34] hover:bg-[#353943] text-[#dfe2ef] transition-colors border border-[#31353f] cursor-pointer"
                  title="Share Model Snapshot"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Queue / Multi-Angle Variant Filmstrip */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-[#c7c4d7]">
                  Batch Variant Queue
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#262a34] text-[#dfe2ef] font-['JetBrains_Mono'] text-[10px]">
                  4 Renders
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
                Click to load into inspector
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {variants.map((v, idx) => (
                <div
                  key={v.id}
                  onClick={() => setActiveVariantIndex(idx)}
                  className={`group relative rounded-xl overflow-hidden p-1.5 cursor-pointer shadow-md transition-all ${
                    activeVariantIndex === idx
                      ? 'bg-[#262a34] ring-2 ring-[#c0c1ff]'
                      : 'bg-[#181b25] hover:bg-[#1c1f29]'
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#0a0e17]">
                    <img
                      alt={v.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      src={v.image}
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#0a0e17]/80 backdrop-blur-md text-[#4edea3] font-['JetBrains_Mono'] text-[9px] flex items-center gap-1 border border-[#262a34]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                      <span>{v.score}</span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 px-1.5 py-1 rounded bg-[#0a0e17]/90 backdrop-blur-md border border-[#262a34]">
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#dfe2ef] font-medium block truncate">
                        {v.title}
                      </span>
                      <span
                        className={`font-['JetBrains_Mono'] text-[9px] block ${
                          activeVariantIndex === idx ? 'text-[#c0c1ff]' : 'text-[#c7c4d7]'
                        }`}
                      >
                        {activeVariantIndex === idx ? 'Active Viewport' : v.sub}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Live Pipeline Telemetry & API Payload Drawer */}
          <section className="rounded-xl bg-[#0a0e17] p-3.5 shadow-md border border-[#262a34]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#262a34]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">
                  terminal
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] font-semibold text-[#dfe2ef]">
                  INFERENCE WORKER TELEMETRY
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7]">
                Node-US-East-4 ComfyUI Pod
              </span>
            </div>
            <div className="bg-[#1c1f29] p-2.5 rounded-lg font-['JetBrains_Mono'] text-[11px] text-[#c7c4d7] space-y-1 overflow-x-auto border border-[#262a34]/60">
              <div className="flex items-center gap-2">
                <span className="text-[#4edea3] font-bold">POST</span>
                <span className="text-[#dfe2ef]">/api/v1/projects/render-avatar</span>
                <span className="text-[#4cd7f6] ml-auto">HTTP/2.0 200 OK (5.84s)</span>
              </div>
              <div className="text-[10px] text-[#c7c4d7]/80 font-mono">
                {`{ "archetype": "${currentVariant.gender.toLowerCase()}_runway_01", "height_cm": ${heightCm}, "controlnet": { "tile_denoise": ${tileDenoise}, "inpainting_weight": ${inpaintWeight}, "rigidity": 0.95 }, "conditioning": ["front_decal_uv4k", "alpha_cloth_drape_sim_280gsm"], "render_lod": "4K_Lossless" }`}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
