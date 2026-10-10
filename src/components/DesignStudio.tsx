/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { DecalTransform, LayerItem } from '../types.ts';

interface DesignStudioProps {
  transform: DecalTransform;
  onTransformChange: (t: DecalTransform) => void;
  onNavigateToVirtualModel: () => void;
}

export const DesignStudio: React.FC<DesignStudioProps> = ({
  transform,
  onTransformChange,
  onNavigateToVirtualModel,
}) => {
  // Viewport mode: split, 2d, 3d
  const [viewportMode, setViewportMode] = useState<'split' | '2d' | '3d'>('split');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // CAD parameters
  const [activeSilhouette, setActiveSilhouette] = useState('Oversized Boxy Tee');
  const [activeIsland, setActiveIsland] = useState('Front Panel');
  const [activeFabric, setActiveFabric] = useState('Heavy Cotton');
  const [gsm, setGsm] = useState<number>(280);
  const [activeDye, setActiveDye] = useState('#121316');
  const [patternTiling, setPatternTiling] = useState('None');
  const [tilingRot, setTilingRot] = useState(45);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [lightPreset, setLightPreset] = useState<'5400K' | '6500K' | '3200K'>('5400K');

  // Turntable 3D Orbit state
  const [turntableRotation, setTurntableRotation] = useState<number>(0);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const orbitStartX = useRef<number>(0);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  // Layers stack
  const [layers, setLayers] = useState<LayerItem[]>([
    {
      id: 'l1',
      name: 'Cybernetic Sigil',
      category: 'decal',
      opacity: 100,
      blendMode: 'Normal',
      visible: true,
      locked: false,
    },
    {
      id: 'l2',
      name: 'Washed Acid Fade',
      category: 'texture',
      opacity: 35,
      blendMode: 'Multiply',
      visible: true,
      locked: true,
    },
    {
      id: 'l3',
      name: 'Heavyweight Cotton',
      category: 'base',
      opacity: 100,
      blendMode: 'Solid Base',
      visible: true,
      locked: true,
    },
  ]);

  // PBR physics sliders
  const [roughness, setRoughness] = useState<number>(0.82);
  const [sheen, setSheen] = useState<number>(0.15);
  const [bumpDepth, setBumpDepth] = useState<number>(0.4);
  const [stretchElasticity, setStretchElasticity] = useState<number>(2.0);

  // Decal drag in 2D flat pattern
  const [isDraggingDecal, setIsDraggingDecal] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPosX: number; startPosY: number }>({
    x: 0,
    y: 0,
    startPosX: 142.4,
    startPosY: 88.0,
  });

  // Calculate collar distance in cm based on posY
  const collarDistanceCm = (transform.posY / 10.7).toFixed(1);

  // Turntable mouse events
  const handleTurntableMouseDown = (e: React.MouseEvent) => {
    setIsOrbiting(true);
    orbitStartX.current = e.clientX;
  };

  const handleTurntableMouseMove = (e: React.MouseEvent) => {
    if (!isOrbiting) return;
    const delta = e.clientX - orbitStartX.current;
    setTurntableRotation((prev) => (prev + delta * 0.5) % 360);
    orbitStartX.current = e.clientX;
  };

  const handleTurntableMouseUp = () => {
    setIsOrbiting(false);
  };

  // 2D Decal drag handlers
  const handleDecalMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingDecal(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPosX: transform.posX,
      startPosY: transform.posY,
    };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isDraggingDecal) {
      const dx = (e.clientX - dragStartRef.current.x) * 0.8;
      const dy = (e.clientY - dragStartRef.current.y) * 0.8;
      const newX = Math.max(60, Math.min(220, dragStartRef.current.startPosX + dx));
      const newY = Math.max(40, Math.min(180, dragStartRef.current.startPosY + dy));
      onTransformChange({
        ...transform,
        posX: Math.round(newX * 10) / 10,
        posY: Math.round(newY * 10) / 10,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingDecal(false);
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers(
      layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const triggerSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2200);
  };

  return (
    <div className="flex flex-col w-full text-[#dfe2ef] select-none pt-14 pb-8">
      {/* CAD Studio Workspace Container */}
      <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-5.5rem)] overflow-hidden bg-[#0a0e17]">
        {/* ========================================== */}
        {/* 1. LEFT TOOL RAIL & CAD PARAMETRIC DOCK    */}
        {/* ========================================== */}
        <aside className="w-full lg:w-[320px] shrink-0 flex flex-col bg-[#181b25] border-r border-[#262a34] overflow-y-auto z-20 shadow-xl">
          {/* Section Header */}
          <div className="px-3.5 py-2.5 bg-[#1c1f29] flex items-center justify-between border-b border-[#262a34]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">
                architecture
              </span>
              <span className="font-['Space_Grotesk'] text-[13px] tracking-wide text-[#dfe2ef] uppercase font-semibold">
                Garment Architect
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-[#31353f] text-[#4edea3] font-['JetBrains_Mono'] text-[10px] tracking-wider font-semibold">
              PARAMETRIC
            </span>
          </div>

          {/* Silhouette Presets & Panel Tabs */}
          <div className="p-3.5 space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-['JetBrains_Mono'] text-[#c7c4d7] uppercase text-[10px]">
                  Silhouette Base
                </span>
                <span className="font-['JetBrains_Mono'] text-[#4cd7f6] text-[10px]">
                  Tops / Relaxed
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  'Oversized Boxy Tee',
                  'Drop-shoulder Hoodie',
                  'Tailored Chinos',
                  'Wide-leg Cargo',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveSilhouette(item)}
                    type="button"
                    className={`px-2.5 py-1.5 rounded text-left font-['Geist'] text-[11px] font-medium transition-all truncate flex items-center justify-between cursor-pointer ${
                      activeSilhouette === item
                        ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm ring-1 ring-[#c0c1ff]/30'
                        : 'bg-[#1c1f29] text-[#c7c4d7] hover:text-[#dfe2ef] hover:bg-[#262a34]'
                    }`}
                  >
                    <span className="truncate">{item}</span>
                    {activeSilhouette === item && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff] shrink-0"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* UV Panel Segmentation Selector */}
            <div>
              <span className="block font-['JetBrains_Mono'] text-[#c7c4d7] uppercase text-[10px] mb-1.5">
                Active Pattern Island (UV)
              </span>
              <div className="flex flex-wrap gap-1 p-1 rounded bg-[#0a0e17] border border-[#262a34]/60">
                {['Front Panel', 'Back Panel', 'L Sleeve', 'R Sleeve', 'Collar Rib'].map(
                  (island) => (
                    <button
                      key={island}
                      onClick={() => setActiveIsland(island)}
                      type="button"
                      className={`px-2 py-1 rounded font-['JetBrains_Mono'] text-[10px] font-medium transition-all cursor-pointer ${
                        activeIsland === island
                          ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm'
                          : 'text-[#c7c4d7] hover:bg-[#1c1f29] hover:text-[#dfe2ef]'
                      }`}
                    >
                      {island}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Material & GSM Physics */}
            <div className="p-2.5 rounded bg-[#1c1f29] space-y-2 border border-[#262a34]/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#4edea3]">
                    texture
                  </span>
                  <span className="text-[12px] font-medium text-[#dfe2ef]">Substrate Fabric</span>
                </div>
                <span className="font-['JetBrains_Mono'] text-[#4edea3] text-[10px]">PBR v4.2</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[
                  {
                    name: 'Heavy Cotton',
                    desc: '280 GSM • Single Jersey',
                    targetGsm: 280,
                  },
                  {
                    name: 'Raw Denim',
                    desc: '13.5 oz • 3x1 Twill',
                    targetGsm: 380,
                  },
                  {
                    name: 'Micro-Fleece',
                    desc: '320 GSM • Brushed',
                    targetGsm: 320,
                  },
                  {
                    name: 'Nylon Ripstop',
                    desc: '70D • DWR Coated',
                    targetGsm: 110,
                  },
                ].map((mat) => (
                  <div
                    key={mat.name}
                    onClick={() => {
                      setActiveFabric(mat.name);
                      setGsm(mat.targetGsm);
                    }}
                    className={`p-2 rounded cursor-pointer transition-all ${
                      activeFabric === mat.name
                        ? 'bg-[#262a34] shadow-sm ring-1 ring-[#c0c1ff]/40'
                        : 'bg-[#0a0e17] hover:bg-[#31353f]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`font-['JetBrains_Mono'] text-[11px] truncate font-medium ${
                          activeFabric === mat.name ? 'text-[#c0c1ff]' : 'text-[#dfe2ef]'
                        }`}
                      >
                        {mat.name}
                      </span>
                      {activeFabric === mat.name && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>
                      )}
                    </div>
                    <span className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7] block truncate">
                      {mat.desc}
                    </span>
                  </div>
                ))}
              </div>

              {/* GSM Scrubber */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[10px]">
                  <span className="text-[#c7c4d7]">Fabric Grammage (GSM)</span>
                  <span className="text-[#4edea3] font-mono">{gsm} g/m²</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="450"
                  value={gsm}
                  onChange={(e) => setGsm(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#0a0e17] rounded-full accent-[#4edea3] cursor-pointer"
                />
              </div>
            </div>

            {/* Graphics & Decal Library */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-[#c7c4d7] uppercase text-[10px]">
                  Applied Decals & Graphics
                </span>
                <label className="text-[#4cd7f6] font-['JetBrains_Mono'] text-[10px] hover:underline flex items-center gap-0.5 cursor-pointer">
                  <span className="material-symbols-outlined text-[12px]">upload</span> Upload SVG
                  <input
                    type="file"
                    accept=".svg,.png"
                    className="hidden"
                    onChange={() => {
                      alert('Custom vector graphic uploaded and mapped to UV coordinate origin.');
                    }}
                  />
                </label>
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-2 top-2 text-[15px] text-[#908fa0]">
                  search
                </span>
                <input
                  type="text"
                  readOnly
                  value="Cybernetic Sigil"
                  className="w-full bg-[#0a0e17] text-[#dfe2ef] text-[11px] font-['JetBrains_Mono'] pl-7 pr-2.5 py-1.5 rounded border border-[#262a34] focus:outline-none focus:bg-[#31353f]"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between p-2 rounded bg-[#262a34] shadow-sm border border-[#31353f]/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded bg-[#0a0e17] flex items-center justify-center text-[#c0c1ff] shrink-0 border border-[#262a34]">
                      <span className="material-symbols-outlined text-[16px]">token</span>
                    </div>
                    <div className="truncate">
                      <div className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] font-medium truncate">
                        Cybernetic Sigil v2
                      </div>
                      <div className="font-['JetBrains_Mono'] text-[9px] text-[#4cd7f6]">
                        Vector Screenprint • Chest Center
                      </div>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#c0c1ff]/10 text-[#c0c1ff] font-['JetBrains_Mono'] text-[9px] font-semibold">
                    ACTIVE
                  </span>
                </div>

                <div
                  onClick={() => alert('Switched active decal to Tokyo Typography Vector')}
                  className="flex items-center justify-between p-2 rounded bg-[#1c1f29] hover:bg-[#31353f] cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded bg-[#0a0e17] flex items-center justify-center text-[#c7c4d7] shrink-0">
                      <span className="material-symbols-outlined text-[16px]">draw</span>
                    </div>
                    <div className="truncate">
                      <div className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] truncate">
                        Tokyo Typography Vector
                      </div>
                      <div className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                        Direct-to-Garment (DTG)
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-[#908fa0]">add</span>
                </div>

                <div
                  onClick={() => alert('Switched active decal to Acid Wash Noise Map')}
                  className="flex items-center justify-between p-2 rounded bg-[#1c1f29] hover:bg-[#31353f] cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded bg-[#0a0e17] flex items-center justify-center text-[#c7c4d7] shrink-0">
                      <span className="material-symbols-outlined text-[16px]">grain</span>
                    </div>
                    <div className="truncate">
                      <div className="font-['JetBrains_Mono'] text-[11px] text-[#dfe2ef] truncate">
                        Acid Wash Noise Map
                      </div>
                      <div className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                        Subtractive Bleach Map
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-[#908fa0]">add</span>
                </div>
              </div>
            </div>

            {/* Pantone Dye Spec */}
            <div className="p-2.5 rounded bg-[#1c1f29] space-y-2 border border-[#262a34]/70">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-[#c7c4d7] uppercase text-[10px]">
                  Pantone Dye Spec
                </span>
                <span className="font-['JetBrains_Mono'] text-[#c0c1ff] text-[10px]">
                  19-4008 TCX
                </span>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { hex: '#121316', title: 'Ebony Black (Active)' },
                  { hex: '#E8E6DF', title: 'Off-White 11-0601' },
                  { hex: '#CCFF00', title: 'Cyber Lime' },
                  { hex: '#494BD6', title: 'Deep Indigo' },
                ].map((swatch) => (
                  <button
                    key={swatch.hex}
                    onClick={() => setActiveDye(swatch.hex)}
                    style={{ backgroundColor: swatch.hex }}
                    type="button"
                    title={swatch.title}
                    className={`relative w-8 h-8 rounded shadow-inner flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                      activeDye === swatch.hex ? 'ring-2 ring-[#c0c1ff]' : ''
                    }`}
                  >
                    {activeDye === swatch.hex && (
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          swatch.hex === '#E8E6DF' ? 'text-black' : 'text-[#c0c1ff]'
                        }`}
                      >
                        check
                      </span>
                    )}
                  </button>
                ))}

                {/* Custom Color Input */}
                <label className="w-8 h-8 rounded bg-[#31353f] hover:bg-[#353943] flex items-center justify-center text-[#c7c4d7] hover:text-[#dfe2ef] transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">palette</span>
                  <input
                    type="color"
                    value={activeDye}
                    onChange={(e) => setActiveDye(e.target.value)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Pattern Procedural Tiling Engine */}
            <div className="space-y-1.5 pb-2">
              <div className="flex items-center justify-between font-['JetBrains_Mono'] text-[10px]">
                <span className="text-[#c7c4d7] uppercase">Pattern Tiling Engine</span>
                <span className="text-[#4cd7f6] font-mono">Rot: {tilingRot}°</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center font-['JetBrains_Mono'] text-[9px]">
                {['None', 'Tartan', 'Hound', 'Monogram'].map((pattern) => (
                  <button
                    key={pattern}
                    type="button"
                    onClick={() => setPatternTiling(pattern)}
                    className={`py-1 rounded transition-all cursor-pointer ${
                      patternTiling === pattern
                        ? 'bg-[#31353f] text-[#c0c1ff] font-semibold ring-1 ring-[#c0c1ff]/30'
                        : 'bg-[#1c1f29] text-[#c7c4d7] hover:text-[#dfe2ef]'
                    }`}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ======================================================= */}
        {/* 2. CENTRAL WORKSPACE: DUAL VIEWPORT SPLIT SCREEN        */}
        {/* ======================================================= */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0a0e17] overflow-hidden">
          {/* Top Control Bar: Split / Alignment / Grid Modes */}
          <div className="h-10 px-3.5 bg-[#181b25] flex items-center justify-between shrink-0 z-10 border-b border-[#262a34] shadow-sm">
            <div className="flex items-center gap-2">
              {/* Viewport Mode Buttons */}
              <div className="flex items-center p-0.5 rounded bg-[#0a0e17] border border-[#262a34]/60">
                <button
                  type="button"
                  onClick={() => setViewportMode('split')}
                  className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                    viewportMode === 'split'
                      ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm'
                      : 'text-[#c7c4d7] hover:text-[#dfe2ef]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">vertical_split</span> Split
                  2D / 3D
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('2d')}
                  className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                    viewportMode === '2d'
                      ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm'
                      : 'text-[#c7c4d7] hover:text-[#dfe2ef]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">crop_free</span> 2D Only
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('3d')}
                  className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                    viewportMode === '3d'
                      ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm'
                      : 'text-[#c7c4d7] hover:text-[#dfe2ef]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">view_in_ar</span> 3D Only
                </button>
              </div>

              <div className="h-3.5 w-[1px] bg-[#31353f] mx-1 hidden sm:block"></div>

              {/* Toggles */}
              <div className="hidden md:flex items-center gap-1 font-['JetBrains_Mono'] text-[10px]">
                <span className="px-2 py-0.5 rounded bg-[#1c1f29] text-[#4edea3] flex items-center gap-1 border border-[#262a34]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> Snap (8px)
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1c1f29] text-[#4cd7f6] flex items-center gap-1 border border-[#262a34]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]"></span> Symmetry Lock
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1c1f29] text-[#c7c4d7] border border-[#262a34]">
                  Bleed: 3.0mm
                </span>
              </div>
            </div>

            {/* Canvas Zoom / Center Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  onTransformChange({
                    ...transform,
                    posX: 142.4,
                    posY: 88.0,
                    scale: 125,
                    rotation: 0,
                  });
                  setZoomLevel(100);
                }}
                className="p-1 rounded text-[#c7c4d7] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
                title="Reset Camera & Decal"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">filter_center_focus</span>
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                className="p-1 rounded text-[#c7c4d7] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
                title="Zoom In"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">zoom_in</span>
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                className="p-1 rounded text-[#c7c4d7] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
                title="Zoom Out"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">zoom_out</span>
              </button>
              <span className="px-1.5 py-0.5 rounded bg-[#1c1f29] text-[#dfe2ef] font-['JetBrains_Mono'] text-[10px] border border-[#262a34]">
                {zoomLevel}%
              </span>
            </div>
          </div>

          {/* Viewport Grid Container */}
          <div
            className={`flex-1 grid ${
              viewportMode === 'split'
                ? 'grid-cols-1 md:grid-cols-2'
                : viewportMode === '2d'
                ? 'grid-cols-1'
                : 'grid-cols-0 hidden'
            } relative overflow-hidden`}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          >
            {/* ============================================== */}
            {/* LEFT HALF: 2D FLAT PATTERN CANVAS (UV UNWRAP) */}
            {/* ============================================== */}
            <div className="relative bg-[#0a0e17] overflow-hidden flex flex-col justify-between p-3 select-none border-r border-[#262a34]/60">
              {/* CAD Coordinate Rulers & Panel Tag */}
              <div className="flex items-center justify-between z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#262a34]/90 backdrop-blur text-[#c0c1ff] font-['JetBrains_Mono'] text-[10px] uppercase font-bold tracking-wider border border-[#31353f]">
                    UV Island #01 // Front Chest
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[#908fa0] text-[10px]">
                    X: {transform.posX.toFixed(1)}mm ~ Y: {transform.posY.toFixed(1)}mm
                  </span>
                </div>
                <div className="font-['JetBrains_Mono'] text-[10px] text-[#4edea3] bg-[#4edea3]/10 px-1.5 py-0.5 rounded border border-[#4edea3]/20">
                  UV SCALE 1:1
                </div>
              </div>

              {/* 2D Canvas SVG Vector Tailoring Surface */}
              <div
                className="relative flex-1 flex items-center justify-center my-2"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
              >
                {/* Background CAD Millimeter Grid */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(192, 193, 255, 0.4) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                ></div>

                {/* Pattern Piece Outer Geometry (Tee Front Unwrap) */}
                <div className="relative w-full max-w-[340px] aspect-[4/5] flex items-center justify-center">
                  <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 400 500">
                    {/* Outer Bleed Margin Line */}
                    <path
                      d="M 120 40 C 160 55 240 55 280 40 L 370 120 L 320 180 L 290 160 L 290 460 L 110 460 L 110 160 L 80 180 L 30 120 Z"
                      fill="none"
                      stroke="rgba(99, 102, 241, 0.25)"
                      strokeDasharray="3,3"
                      strokeWidth="1"
                    />

                    {/* True Cut Seam (Pattern Boundary) */}
                    <path
                      d="M 125 45 C 160 60 240 60 275 45 L 360 120 L 315 175 L 285 155 L 285 450 L 115 450 L 115 155 L 85 175 L 40 120 Z"
                      fill="#12141c"
                      stroke="#464554"
                      strokeWidth="1.5"
                    />

                    {/* Ribbed Collar Seam Line */}
                    <path
                      d="M 125 45 C 160 85 240 85 275 45"
                      fill="none"
                      stroke="#606275"
                      strokeDasharray="2,2"
                      strokeWidth="1.5"
                    />

                    {/* Vertical Center Symmetry Line */}
                    <line
                      stroke="rgba(76, 215, 246, 0.35)"
                      strokeDasharray="4,4"
                      strokeWidth="1"
                      x1="200"
                      x2="200"
                      y1="40"
                      y2="455"
                    />

                    {/* Distance from collar callout line */}
                    <line
                      stroke="#4edea3"
                      strokeWidth="1"
                      x1="200"
                      x2="200"
                      y1="65"
                      y2={65 + (transform.posY - 10)}
                    />
                    <circle cx="200" cy="65" fill="#4edea3" r="2.5" />
                    <circle cx="200" cy={65 + (transform.posY - 10)} fill="#4edea3" r="2.5" />

                    {/* Decal Placement Bounding Box (Draggable) */}
                    <g
                      transform={`translate(${transform.posX}, ${transform.posY}) rotate(${
                        transform.rotation
                      }, 60, 47.5)`}
                      onMouseDown={handleDecalMouseDown}
                      className="cursor-move"
                    >
                      <rect
                        fill="rgba(99, 102, 241, 0.12)"
                        height={transform.height * 0.51}
                        width={transform.width * 0.57}
                        rx="3"
                        stroke="#8083ff"
                        strokeDasharray="3,2"
                        strokeWidth="1.25"
                      />

                      {/* CAD Corner Handles */}
                      <rect fill="#c0c1ff" height="6" width="6" x="-3" y="-3" />
                      <rect
                        fill="#c0c1ff"
                        height="6"
                        width="6"
                        x={transform.width * 0.57 - 3}
                        y="-3"
                      />
                      <rect
                        fill="#c0c1ff"
                        height="6"
                        width="6"
                        x="-3"
                        y={transform.height * 0.51 - 3}
                      />
                      <rect
                        fill="#c0c1ff"
                        height="6"
                        width="6"
                        x={transform.width * 0.57 - 3}
                        y={transform.height * 0.51 - 3}
                      />

                      {/* Central Decal Vector Graphic Representation */}
                      <g transform="translate(10, 15) scale(0.9)">
                        <path
                          d="M 20 25 Q 50 5 80 25 Q 65 40 50 35 Q 35 40 20 25 Z"
                          fill="#c7c4d7"
                          opacity="0.95"
                        />
                        <path
                          d="M 35 15 L 65 45 M 65 15 L 35 45"
                          stroke="#0f131c"
                          strokeWidth="2"
                        />
                        <circle
                          cx="50"
                          cy="30"
                          fill="none"
                          r="14"
                          stroke="#c7c4d7"
                          strokeDasharray="2,2"
                          strokeWidth="1.5"
                        />
                        <path d="M 10 32 L 25 32 M 75 32 L 90 32" stroke="#4cd7f6" strokeWidth="1.5" />
                      </g>
                    </g>
                  </svg>

                  {/* Floating CAD Placement Pill */}
                  <div
                    className="absolute px-2 py-0.5 rounded bg-[#262a34]/95 backdrop-blur text-[#4edea3] font-['JetBrains_Mono'] text-[10px] shadow-lg flex items-center gap-1 border border-[#31353f] pointer-events-none transition-all duration-75"
                    style={{
                      top: `${Math.min(75, Math.max(20, (transform.posY / 500) * 100 + 12))}%`,
                      left: '58%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <span className="material-symbols-outlined text-[11px]">straighten</span>
                    <span>{collarDistanceCm} cm below collar seam</span>
                  </div>
                </div>
              </div>

              {/* 2D Viewport HUD Controls Footer */}
              <div className="flex items-center justify-between text-[#c7c4d7] font-['JetBrains_Mono'] text-[10px] z-10 bg-[#181b25]/80 backdrop-blur px-2.5 py-1.5 rounded border border-[#262a34]">
                <div className="flex items-center gap-2">
                  <span className="text-[#4cd7f6] font-medium">DECAL:</span>
                  <span>
                    W: {transform.width.toFixed(0)}mm × H: {transform.height.toFixed(0)}mm
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    onClick={() =>
                      onTransformChange({
                        ...transform,
                        width: 240,
                        height: 200,
                        scale: 140,
                      })
                    }
                    className="hover:text-[#dfe2ef] cursor-pointer"
                  >
                    Fit Pattern [F]
                  </span>
                  <span
                    onClick={() =>
                      onTransformChange({
                        ...transform,
                        rotation: 0,
                      })
                    }
                    className="hover:text-[#dfe2ef] cursor-pointer"
                  >
                    Flatten [Ctrl+E]
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================== */}
            {/* RIGHT HALF: 3D REAL-TIME VISUALIZER VIEWPORT   */}
            {/* ============================================== */}
            {(viewportMode === 'split' || viewportMode === '3d') && (
              <div
                className="relative bg-[#1c1f29] overflow-hidden flex flex-col justify-between p-3 select-none cursor-grab active:cursor-grabbing"
                onMouseDown={handleTurntableMouseDown}
                onMouseMove={handleTurntableMouseMove}
                onMouseUp={handleTurntableMouseUp}
              >
                {/* 3D Header HUD */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#31353f]/90 backdrop-blur text-[#4cd7f6] font-['JetBrains_Mono'] text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 border border-[#464554]/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                      WebGL 2.0 Real-time PBR
                    </span>
                    <span className="font-['JetBrains_Mono'] text-[#c7c4d7] text-[10px] hidden sm:inline">
                      Lighting: Studio Softbox
                    </span>
                  </div>

                  {/* Wireframe & Lighting Presets */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setWireframeMode(!wireframeMode)}
                      className={`px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] flex items-center gap-1 transition-all ${
                        wireframeMode
                          ? 'bg-[#c0c1ff] text-[#07006c] font-semibold'
                          : 'bg-[#31353f] hover:bg-[#353943] text-[#dfe2ef]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">grid_4x4</span> Wireframe
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next =
                          lightPreset === '5400K'
                            ? '6500K'
                            : lightPreset === '6500K'
                            ? '3200K'
                            : '5400K';
                        setLightPreset(next);
                      }}
                      className="px-2 py-0.5 rounded bg-[#31353f] hover:bg-[#353943] text-[#dfe2ef] font-['JetBrains_Mono'] text-[10px] flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[12px]">wb_sunny</span>{' '}
                      {lightPreset}
                    </button>
                  </div>
                </div>

                {/* 3D Garment Turntable Asset */}
                <div className="relative flex-1 flex items-center justify-center my-1 overflow-hidden group">
                  {/* Photo Turntable */}
                  <div
                    className="relative w-full h-full max-h-[500px] flex items-center justify-center transition-transform duration-75"
                    style={{
                      transform: `rotateY(${turntableRotation}deg)`,
                      filter: wireframeMode
                        ? 'invert(1) grayscale(1) contrast(1.5)'
                        : lightPreset === '3200K'
                        ? 'sepia(0.25) contrast(1.05)'
                        : lightPreset === '6500K'
                        ? 'saturate(0.9) hue-rotate(5deg)'
                        : 'none',
                    }}
                  >
                    <img
                      alt="Technical CAD 3D studio render of an oversized heavy boxy black washed t-shirt displayed on a matte black headless mannequin pedestal"
                      className="object-contain max-h-full max-w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-lg pointer-events-none"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLLHE3qM5uLPQ_vpS0OOQ_JUuwpn4UTwJFmS8FqxbsRH229ER02Mlg5sJZDBYnhOJLn43MVB5oI7qzovTLGD1g2y-C2ZQEnzJRx5YLlxnQS2ajbHh2QtV-uNfM3peSvmMVgQB8JC6EcFRjcPBgwGeFUZRfgY6qfl8EUUUiz9OLx6gSnbb-MP7TDrr93ftSgX8s_Fba5hjiHCBQrUSzfFA3Iv8f5fbyr-PS6tqxl6d8loIIw1l-4yioKA"
                    />

                    {/* Snapshot Flash Overlay */}
                    {snapshotTaken && (
                      <div className="absolute inset-0 bg-white/70 animate-ping rounded-lg pointer-events-none"></div>
                    )}

                    {/* CAD Floating Crosshairs & Turntable Gizmo */}
                    <div className="absolute inset-x-6 bottom-4 pointer-events-none flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a0e17]/80 backdrop-blur font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] border border-[#262a34]">
                        <span className="material-symbols-outlined text-[12px] text-[#4edea3]">
                          360
                        </span>
                        <span>Drag to Orbit: {Math.round(turntableRotation)}°</span>
                      </div>
                      <div className="font-['JetBrains_Mono'] text-[10px] text-[#c0c1ff] bg-[#0a0e17]/80 backdrop-blur px-2 py-1 rounded border border-[#262a34]">
                        CAM: [0.0, 1.2, 2.4] • FOV 45°
                      </div>
                    </div>
                  </div>

                  {/* Floating 3D Navigation Controls */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 bg-[#0a0e17]/90 backdrop-blur-md p-1 rounded-lg shadow-xl border border-[#262a34]">
                    <button
                      onClick={() => setTurntableRotation((r) => (r + 45) % 360)}
                      className="p-1.5 rounded hover:bg-[#1c1f29] text-[#c7c4d7] hover:text-[#c0c1ff] transition-all"
                      title="Orbit Model +45°"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">cached</span>
                    </button>
                    <button
                      onClick={() => setTurntableRotation((r) => (r - 45 + 360) % 360)}
                      className="p-1.5 rounded hover:bg-[#1c1f29] text-[#c7c4d7] hover:text-[#c0c1ff] transition-all"
                      title="Orbit Model -45°"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">pan_tool</span>
                    </button>
                    <button
                      onClick={() => setTurntableRotation(0)}
                      className="p-1.5 rounded hover:bg-[#1c1f29] text-[#c7c4d7] hover:text-[#c0c1ff] transition-all"
                      title="Reset Camera Angle"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    </button>
                    <div className="w-full h-[1px] bg-[#31353f] my-0.5"></div>
                    <button
                      onClick={triggerSnapshot}
                      className="p-1.5 rounded hover:bg-[#1c1f29] text-[#4cd7f6] hover:brightness-110 transition-all cursor-pointer"
                      title="Snapshot High-Res Angle"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </button>
                  </div>
                </div>

                {/* 3D Viewport Footer HUD */}
                <div className="flex items-center justify-between text-[#c7c4d7] font-['JetBrains_Mono'] text-[10px] z-10 bg-[#181b25]/80 backdrop-blur px-2.5 py-1.5 rounded border border-[#262a34]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                    <span className="text-[#dfe2ef]">PBR Shader: Tri-planar Projection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>
                      Tension Stress:{' '}
                      <span className="text-[#4edea3]">Nominal (0.12 MPa)</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ======================================================= */}
        {/* 3. RIGHT INSPECTOR & PROPERTIES RAIL                    */}
        {/* ======================================================= */}
        <aside className="w-full lg:w-[300px] shrink-0 flex flex-col bg-[#181b25] border-l border-[#262a34] overflow-y-auto z-20 shadow-xl">
          {/* Panel Header */}
          <div className="px-3.5 py-2.5 bg-[#1c1f29] flex items-center justify-between border-b border-[#262a34]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">tune</span>
              <span className="font-['Space_Grotesk'] text-[13px] tracking-wide text-[#dfe2ef] uppercase font-semibold">
                Properties & Stack
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#4edea3] font-mono">
              LOD-0
            </span>
          </div>

          <div className="p-3.5 space-y-3.5">
            {/* Layer Manager (Z-Index Stack) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-['JetBrains_Mono'] text-[#c7c4d7] uppercase text-[10px]">
                  Layer Composite Stack
                </span>
                <span
                  onClick={() => alert('New layer added to stack')}
                  className="material-symbols-outlined text-[14px] text-[#908fa0] cursor-pointer hover:text-[#dfe2ef]"
                >
                  add_box
                </span>
              </div>
              <div className="space-y-1">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`flex items-center justify-between p-2 rounded transition-all ${
                      layer.id === 'l1'
                        ? 'bg-[#262a34] shadow-sm border border-[#31353f]'
                        : 'bg-[#1c1f29] hover:bg-[#31353f]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[14px] text-[#908fa0] cursor-grab">
                        drag_indicator
                      </span>
                      <span
                        className={`material-symbols-outlined text-[15px] ${
                          layer.id === 'l1' ? 'text-[#c0c1ff]' : 'text-[#c7c4d7]'
                        }`}
                      >
                        {layer.category === 'decal'
                          ? 'image'
                          : layer.category === 'texture'
                          ? 'gradient'
                          : 'layers'}
                      </span>
                      <div className="truncate">
                        <div
                          className={`font-['JetBrains_Mono'] text-[11px] font-medium truncate ${
                            layer.id === 'l1' ? 'text-[#c0c1ff]' : 'text-[#dfe2ef]'
                          }`}
                        >
                          {layer.name}
                        </div>
                        <div className="font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                          {layer.category} • {layer.opacity}% ({layer.blendMode})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className={`material-symbols-outlined text-[14px] cursor-pointer ${
                          layer.visible ? 'text-[#c0c1ff]' : 'text-[#908fa0] opacity-40'
                        }`}
                      >
                        {layer.visible ? 'visibility' : 'visibility_off'}
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-[#908fa0]">
                        {layer.locked ? 'lock' : 'lock_open'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transform Matrix Coordinates */}
            <div className="p-2.5 rounded bg-[#1c1f29] space-y-2 border border-[#262a34]/70">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-[#c7c4d7] uppercase text-[10px]">
                  Transform Matrix (Decal)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onTransformChange({
                      ...transform,
                      aspectLocked: !transform.aspectLocked,
                    })
                  }
                  className="text-[#4cd7f6] font-['JetBrains_Mono'] text-[10px] flex items-center gap-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[12px]">link</span>{' '}
                  {transform.aspectLocked ? 'Aspect Lock' : 'Free Scale'}
                </button>
              </div>

              {/* Position Coordinates */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-1.5 rounded bg-[#0a0e17] border border-[#262a34]/50">
                  <span className="block font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                    POS X (mm)
                  </span>
                  <input
                    type="number"
                    step="2"
                    value={transform.posX}
                    onChange={(e) =>
                      onTransformChange({
                        ...transform,
                        posX: Number(e.target.value),
                      })
                    }
                    className="w-full bg-transparent font-['JetBrains_Mono'] text-[12px] text-[#dfe2ef] focus:outline-none"
                  />
                </div>
                <div className="p-1.5 rounded bg-[#0a0e17] border border-[#262a34]/50">
                  <span className="block font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                    POS Y (mm)
                  </span>
                  <input
                    type="number"
                    step="2"
                    value={transform.posY}
                    onChange={(e) =>
                      onTransformChange({
                        ...transform,
                        posY: Number(e.target.value),
                      })
                    }
                    className="w-full bg-transparent font-['JetBrains_Mono'] text-[12px] text-[#dfe2ef] focus:outline-none"
                  />
                </div>
              </div>

              {/* Scale & Dimension */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-1.5 rounded bg-[#0a0e17] border border-[#262a34]/50">
                  <span className="block font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                    WIDTH
                  </span>
                  <input
                    type="number"
                    step="5"
                    value={transform.width}
                    onChange={(e) => {
                      const w = Number(e.target.value);
                      const h = transform.aspectLocked ? (w / 210) * 185 : transform.height;
                      onTransformChange({ ...transform, width: w, height: Math.round(h) });
                    }}
                    className="w-full bg-transparent font-['JetBrains_Mono'] text-[12px] text-[#dfe2ef] focus:outline-none"
                  />
                </div>
                <div className="p-1.5 rounded bg-[#0a0e17] border border-[#262a34]/50">
                  <span className="block font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                    HEIGHT
                  </span>
                  <input
                    type="number"
                    step="5"
                    value={transform.height}
                    onChange={(e) => {
                      const h = Number(e.target.value);
                      const w = transform.aspectLocked ? (h / 185) * 210 : transform.width;
                      onTransformChange({ ...transform, height: h, width: Math.round(w) });
                    }}
                    className="w-full bg-transparent font-['JetBrains_Mono'] text-[12px] text-[#dfe2ef] focus:outline-none"
                  />
                </div>
              </div>

              {/* Scale Factor & Rotation */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-1.5 rounded bg-[#0a0e17] border border-[#262a34]/50">
                  <span className="block font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                    SCALE
                  </span>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      step="5"
                      value={transform.scale}
                      onChange={(e) =>
                        onTransformChange({
                          ...transform,
                          scale: Number(e.target.value),
                        })
                      }
                      className="w-full bg-transparent font-['JetBrains_Mono'] text-[12px] text-[#4cd7f6] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#4cd7f6]">%</span>
                  </div>
                </div>
                <div className="p-1.5 rounded bg-[#0a0e17] border border-[#262a34]/50">
                  <span className="block font-['JetBrains_Mono'] text-[9px] text-[#c7c4d7]">
                    ROTATION
                  </span>
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      step="5"
                      value={transform.rotation}
                      onChange={(e) =>
                        onTransformChange({
                          ...transform,
                          rotation: Number(e.target.value),
                        })
                      }
                      className="w-full bg-transparent font-['JetBrains_Mono'] text-[12px] text-[#dfe2ef] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#c7c4d7]">°</span>
                  </div>
                </div>
              </div>

              {/* Blend Mode Selection */}
              <div className="pt-1">
                <span className="block font-['JetBrains_Mono'] text-[10px] text-[#c7c4d7] mb-1">
                  Blend Mode
                </span>
                <div className="grid grid-cols-4 gap-1 text-center font-['JetBrains_Mono'] text-[10px]">
                  {['normal', 'multiply', 'screen', 'overlay'].map((bm) => (
                    <button
                      key={bm}
                      type="button"
                      onClick={() =>
                        onTransformChange({
                          ...transform,
                          blendMode: bm as DecalTransform['blendMode'],
                        })
                      }
                      className={`py-1 rounded capitalize transition-all cursor-pointer ${
                        transform.blendMode === bm
                          ? 'bg-[#262a34] text-[#c0c1ff] font-medium ring-1 ring-[#c0c1ff]/30'
                          : 'bg-[#0a0e17] text-[#c7c4d7] hover:text-[#dfe2ef]'
                      }`}
                    >
                      {bm}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PBR Fabric Physics Parameters */}
            <div className="space-y-2 p-2.5 rounded bg-[#1c1f29] border border-[#262a34]/70">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-[#c7c4d7] uppercase text-[10px]">
                  PBR Physics & Shading
                </span>
                <span className="font-['JetBrains_Mono'] text-[#4edea3] text-[10px]">
                  Cloth Engine
                </span>
              </div>

              <div className="space-y-2 pt-1 font-['JetBrains_Mono'] text-[10px]">
                {/* Roughness */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#c7c4d7]">Roughness</span>
                    <span className="text-[#dfe2ef] font-mono">{roughness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={roughness}
                    onChange={(e) => setRoughness(Number(e.target.value))}
                    className="w-full h-1 bg-[#0a0e17] rounded-full accent-[#8083ff] cursor-pointer"
                  />
                </div>

                {/* Sheen Intensity */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#c7c4d7]">Sheen Intensity</span>
                    <span className="text-[#dfe2ef] font-mono">{sheen.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={sheen}
                    onChange={(e) => setSheen(Number(e.target.value))}
                    className="w-full h-1 bg-[#0a0e17] rounded-full accent-[#4cd7f6] cursor-pointer"
                  />
                </div>

                {/* Bump Weave Depth */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#c7c4d7]">Bump / Weave Depth</span>
                    <span className="text-[#dfe2ef] font-mono">{bumpDepth.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={bumpDepth}
                    onChange={(e) => setBumpDepth(Number(e.target.value))}
                    className="w-full h-1 bg-[#0a0e17] rounded-full accent-[#4edea3] cursor-pointer"
                  />
                </div>

                {/* Stretch Elasticity */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[#c7c4d7]">Stretch Elasticity</span>
                    <span className="text-[#dfe2ef] font-mono">{stretchElasticity.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={stretchElasticity}
                    onChange={(e) => setStretchElasticity(Number(e.target.value))}
                    className="w-full h-1 bg-[#0a0e17] rounded-full accent-[#908fa0] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Geometry Sync Status & Call to Action */}
            <div className="space-y-2 pt-1 pb-2">
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#0a0e17] text-[#4edea3] font-['JetBrains_Mono'] text-[10px] border border-[#262a34]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                  <span>Mesh LOD-0 in sync</span>
                </div>
                <span className="font-mono text-[#c7c4d7]">12,480 Polys</span>
              </div>

              {/* High-Priority Workflow Next Action CTA */}
              <button
                type="button"
                onClick={onNavigateToVirtualModel}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-['Space_Grotesk'] text-[12px] font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-md cursor-pointer"
              >
                <span>Send to Virtual Model Studio</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
