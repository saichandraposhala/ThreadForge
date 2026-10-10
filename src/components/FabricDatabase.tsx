/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FabricMaterial, StudioTab } from '../types.ts';

interface FabricDatabaseProps {
  onSelectFabric: (fabric: FabricMaterial) => void;
  onNavigateTab: (tab: StudioTab) => void;
}

export const FabricDatabase: React.FC<FabricDatabaseProps> = ({
  onSelectFabric,
  onNavigateTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFabricId, setActiveFabricId] = useState<string>('fab_01');

  const materials: FabricMaterial[] = [
    {
      id: 'fab_01',
      name: 'Heavyweight Single Jersey',
      category: 'Jersey / Knits',
      gsm: 280,
      composition: '100% Combed Ringspun Long-Staple Cotton',
      weave: 'Single Jersey Knit 24/1 Ne',
      yarnCount: '24s Combed Compact',
      drapeScore: 0.82,
      stretchElasticity: 2.0,
      tensileModulus: '420 N/5cm',
      spirality: '0.4% post-wash',
      recommendedNeedle: '75/11 Ballpoint (SES)',
      certification: 'OEKO-TEX Standard 100 • GOTS Organic',
      colorHex: '#1A1A1D',
      description:
        'Architectural boxy drape profile engineered specifically for oversized streetwear silhouettes. Substantial weight minimizes torso cling while holding geometric drop shoulders.',
    },
    {
      id: 'fab_02',
      name: 'Heavy Ribbed Spandex-Cotton',
      category: 'Ribbing',
      gsm: 340,
      composition: '95% Combed Cotton / 5% Elastane (Lycra®)',
      weave: '1x1 Circular Rib Knit',
      yarnCount: '30s/2 + 40D Spandex',
      drapeScore: 0.95,
      stretchElasticity: 8.5,
      tensileModulus: '680 N/5cm',
      spirality: '0.1%',
      recommendedNeedle: '80/12 Ballpoint',
      certification: 'OEKO-TEX Standard 100',
      colorHex: '#12141C',
      description:
        'Industrial resilience collar and cuff ribbing designed to prevent baconing across 50+ wash cycles. High-recovery spandex core.',
    },
    {
      id: 'fab_03',
      name: 'Raw Japanese Selvedge Denim',
      category: 'Woven / Twill',
      gsm: 410,
      composition: '100% Indigo-dyed Organic Cotton',
      weave: '3x1 Right Hand Twill • Red-line Selvedge',
      yarnCount: '7s x 6s Ring Spun',
      drapeScore: 0.35,
      stretchElasticity: 0.8,
      tensileModulus: '1150 N/5cm',
      spirality: '1.2% (Unsanforized)',
      recommendedNeedle: '110/18 Jeans (Jeans/Denim)',
      certification: 'Better Cotton Initiative (BCI)',
      colorHex: '#1E2538',
      description:
        'Stiff architectural denim loomed on vintage shuttle looms. High shear resistance ideal for structured outerwear and wide-leg workwear silhouettes.',
    },
    {
      id: 'fab_04',
      name: 'Micro-Fleece Technical Brushed',
      category: 'Fleece / Technical',
      gsm: 320,
      composition: '100% Recycled Polyester (rPET)',
      weave: 'Double-sided Low-pill Shearling Knit',
      yarnCount: '150D/144F Microfiber',
      drapeScore: 0.65,
      stretchElasticity: 4.2,
      tensileModulus: '530 N/5cm',
      spirality: '0.2%',
      recommendedNeedle: '80/12 Microtex',
      certification: 'GRS (Global Recycled Standard)',
      colorHex: '#252932',
      description:
        'Hydrophobic insulating fleece with ultra-soft handfeel and rapid moisture transport. Designed for drop-shoulder techwear hoodies and midlayers.',
    },
    {
      id: 'fab_05',
      name: 'Nylon Ripstop DWR Coated',
      category: 'Technical Synthetics',
      gsm: 110,
      composition: '100% High-Tenacity Cordura® Nylon 6,6',
      weave: '70D x 70D Crosshatch Grid Ripstop',
      yarnCount: '70 Denier Textured',
      drapeScore: 0.48,
      stretchElasticity: 1.2,
      tensileModulus: '980 N/5cm',
      spirality: '0.0%',
      recommendedNeedle: '70/10 Microtex Sharp',
      certification: 'Bluesign® Approved System',
      colorHex: '#1C2229',
      description:
        'Ultra-light weather-shielding shell with PFC-free C0 durable water repellent finish. Puncture and tear-resistant cross-grid weaving.',
    },
    {
      id: 'fab_06',
      name: 'Heavy French Terry Loopback',
      category: 'Jersey / Knits',
      gsm: 450,
      composition: '100% Organic Pima Cotton',
      weave: '3-End Unbrushed Loopback Terry',
      yarnCount: '16s Face / 30s Tie / 10s Loop',
      drapeScore: 0.74,
      stretchElasticity: 3.0,
      tensileModulus: '620 N/5cm',
      spirality: '0.5%',
      recommendedNeedle: '85/13 Ballpoint',
      certification: 'GOTS Organic Certified',
      colorHex: '#2B2D38',
      description:
        'Ultra-dense luxury loopback knit providing thermal mass and clean drape fall lines. Zero torquing on hem stitches.',
    },
  ];

  const categories = [
    'all',
    'Jersey / Knits',
    'Ribbing',
    'Woven / Twill',
    'Fleece / Technical',
    'Technical Synthetics',
  ];

  const filteredMaterials = materials.filter((m) => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesQuery =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const activeMaterial = materials.find((m) => m.id === activeFabricId) || materials[0];

  const handleApplyToGarment = (mat: FabricMaterial) => {
    onSelectFabric(mat);
    onNavigateTab('design-studio');
  };

  return (
    <div className="flex flex-col w-full text-[#dfe2ef] pt-14 pb-8">
      {/* Top Header Ribbon */}
      <div className="w-full bg-[#0a0e17] px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#262a34]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#4edea3]">
              inventory
            </span>
            <h2 className="font-['Space_Grotesk'] text-[18px] font-bold text-[#dfe2ef]">
              Fabric & Materials Database
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#262a34] text-[#c0c1ff] font-['JetBrains_Mono'] text-[10px]">
            {materials.length} Verified Physical Substrates
          </span>
        </div>

        {/* Search */}
        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-[16px] text-[#908fa0]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search GSM, weave, fiber, certification..."
            className="w-full bg-[#181b25] text-[#dfe2ef] text-[11px] font-['JetBrains_Mono'] pl-8 pr-3 py-1.5 rounded-lg border border-[#262a34] focus:outline-none focus:border-[#8083ff]"
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* Left List (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-['JetBrains_Mono'] text-[11px] capitalize transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#262a34] text-[#c0c1ff] shadow-sm font-semibold border border-[#31353f]'
                    : 'bg-[#181b25] text-[#c7c4d7] hover:text-[#dfe2ef] border border-[#262a34]'
                }`}
              >
                {cat === 'all' ? 'All Substrates' : cat}
              </button>
            ))}
          </div>

          {/* Cards List */}
          <div className="space-y-2.5">
            {filteredMaterials.map((mat) => {
              const isSelected = mat.id === activeFabricId;
              return (
                <div
                  key={mat.id}
                  onClick={() => setActiveFabricId(mat.id)}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#1c1f29] border-[#c0c1ff] shadow-lg ring-1 ring-[#c0c1ff]/30'
                      : 'bg-[#181b25] border-[#262a34] hover:bg-[#1c1f29]/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg shadow-inner border border-[#31353f] shrink-0"
                        style={{ backgroundColor: mat.colorHex }}
                      ></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#dfe2ef]">
                            {mat.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded bg-[#0a0e17] text-[#4edea3] font-['JetBrains_Mono'] text-[10px] font-bold border border-[#262a34]">
                            {mat.gsm} GSM
                          </span>
                        </div>
                        <p className="font-['Geist'] text-[12px] text-[#c7c4d7] mt-0.5">
                          {mat.composition}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6] block">
                        {mat.category}
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[9px] text-[#908fa0]">
                        {mat.weave}
                      </span>
                    </div>
                  </div>

                  <p className="font-['Geist'] text-[11px] text-[#908fa0] mt-2 line-clamp-2">
                    {mat.description}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#262a34] text-[10px] font-['JetBrains_Mono'] text-[#c7c4d7]">
                    <div className="flex items-center gap-3">
                      <span>Drape: {(mat.drapeScore * 100).toFixed(0)}%</span>
                      <span>Stretch: {mat.stretchElasticity}%</span>
                      <span>Spirality: {mat.spirality}</span>
                    </div>
                    <span className="text-[#4edea3]">{mat.certification.split('•')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Inspector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-[#181b25] rounded-xl p-5 border border-[#262a34] shadow-xl sticky top-20 space-y-4">
            <div className="flex items-start justify-between border-b border-[#262a34] pb-4">
              <div>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#4cd7f6] uppercase tracking-wider">
                  Technical Spec Sheet
                </span>
                <h3 className="font-['Space_Grotesk'] text-[20px] font-bold text-[#dfe2ef]">
                  {activeMaterial.name}
                </h3>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#4edea3]">
                  {activeMaterial.gsm} g/m² • {activeMaterial.weave}
                </span>
              </div>

              <div
                className="w-12 h-12 rounded-xl shadow-inner border border-[#31353f]"
                style={{ backgroundColor: activeMaterial.colorHex }}
              ></div>
            </div>

            <p className="font-['Geist'] text-[12px] text-[#c7c4d7] leading-relaxed">
              {activeMaterial.description}
            </p>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-2 gap-2 font-['JetBrains_Mono'] text-[11px]">
              <div className="bg-[#0a0e17] p-2.5 rounded-lg border border-[#262a34]">
                <span className="text-[#908fa0] text-[9px] uppercase block">Tensile Modulus</span>
                <span className="text-[#dfe2ef] font-semibold">
                  {activeMaterial.tensileModulus}
                </span>
              </div>
              <div className="bg-[#0a0e17] p-2.5 rounded-lg border border-[#262a34]">
                <span className="text-[#908fa0] text-[9px] uppercase block">Yarn Count</span>
                <span className="text-[#dfe2ef] font-semibold">{activeMaterial.yarnCount}</span>
              </div>
              <div className="bg-[#0a0e17] p-2.5 rounded-lg border border-[#262a34]">
                <span className="text-[#908fa0] text-[9px] uppercase block">
                  Recommended Needle
                </span>
                <span className="text-[#c0c1ff] font-semibold">
                  {activeMaterial.recommendedNeedle}
                </span>
              </div>
              <div className="bg-[#0a0e17] p-2.5 rounded-lg border border-[#262a34]">
                <span className="text-[#908fa0] text-[9px] uppercase block">Spirality Torque</span>
                <span className="text-[#4edea3] font-semibold">{activeMaterial.spirality}</span>
              </div>
            </div>

            {/* Drape Physics Progress */}
            <div className="space-y-2 pt-1 font-['JetBrains_Mono'] text-[11px]">
              <div>
                <div className="flex justify-between text-[#c7c4d7] mb-1">
                  <span>Drape Stiffness Falloff</span>
                  <span>{(activeMaterial.drapeScore * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0e17] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8083ff] rounded-full"
                    style={{ width: `${activeMaterial.drapeScore * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#c7c4d7] mb-1">
                  <span>Weft / Warp Elastic Recovery</span>
                  <span>{activeMaterial.stretchElasticity}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0e17] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4cd7f6] rounded-full"
                    style={{ width: `${Math.min(100, activeMaterial.stretchElasticity * 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Certification Badge */}
            <div className="p-2.5 rounded-lg bg-[#00885d]/15 border border-[#4edea3]/30 text-[#4edea3] text-[11px] font-['JetBrains_Mono'] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{activeMaterial.certification}</span>
            </div>

            {/* Apply Action */}
            <button
              type="button"
              onClick={() => handleApplyToGarment(activeMaterial)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#494bd6] to-[#8083ff] text-white font-['Space_Grotesk'] text-[13px] font-bold shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Apply to Active CAD Garment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
