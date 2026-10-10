/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { StudioTab, DecalTransform, UserProfile, FabricMaterial } from './types.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { DesignStudio } from './components/DesignStudio.tsx';
import { VirtualModelStudio } from './components/VirtualModelStudio.tsx';
import { TechPackAndLookbook } from './components/TechPackAndLookbook.tsx';
import { FabricDatabase } from './components/FabricDatabase.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { SecurityVaultModal } from './components/SecurityVaultModal.tsx';
import {
  getActiveSession,
  setActiveSession,
  seedDemoAccountIfNeeded,
} from './services/cryptoAuth.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<StudioTab>('design-studio');

  // Authentication & Credentials state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [securityVaultOpen, setSecurityVaultOpen] = useState(false);

  // Decal transform state shared across views
  const [transform, setTransform] = useState<DecalTransform>({
    posX: 142.4,
    posY: 88.0,
    width: 210.0,
    height: 185.0,
    scale: 125,
    rotation: 0.0,
    blendMode: 'normal',
    aspectLocked: true,
  });

  const [activeSubstrate, setActiveSubstrate] = useState<string>('Heavyweight Cotton 280 GSM');

  // Initialize session and seed demo account
  useEffect(() => {
    seedDemoAccountIfNeeded().then(() => {
      const session = getActiveSession();
      if (session) {
        setCurrentUser(session);
      } else {
        // Automatically authenticate initial session with lead designer
        const defaultUser: UserProfile = {
          id: 'usr_lead_01',
          email: 'designer@threadforge.io',
          fullName: 'Alex Vance',
          role: 'Lead CAD Fashion Engineer',
          studioUnit: 'Studio Lead (CAD-09)',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCdGq3bsv68gwzE6-qDh8faYzQs_leeQl-0GkLhYVBNSW5ZHCbvzO_0jo6Ss2Rzy2jtrM_NRIYwhu40UGvMEnvEDMs14yVFCqVns6xSa9zTDjxgHOlEK3JD9_1edDb9tkusQSTa730AVfzictKwy-RYLzJsc2euYWcXbv2FUbJrnfKL1CvB4mR4WSKs3slo1A6N2l5itlXLX9XdjARwcisCYUGKu92-Dc0VUQ9iRDL0eH4YLXKSUzUngw',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setActiveSession(defaultUser);
        setCurrentUser(defaultUser);
      }
    });
  }, []);

  const handleLogout = () => {
    setActiveSession(null);
    setCurrentUser(null);
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setLoginModalOpen(false);
  };

  const handleSelectFabric = (fabric: FabricMaterial) => {
    setActiveSubstrate(`${fabric.name} ${fabric.gsm} GSM`);
  };

  const handleTriggerRender = () => {
    setActiveTab('virtual-model-studio');
  };

  const handleTriggerPdfExport = () => {
    setActiveTab('tech-pack-and-lookbook');
  };

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ef] flex flex-col antialiased">
      {/* Global Application Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        currentUser={currentUser}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenSecurityVault={() => setSecurityVaultOpen(true)}
        onLogout={handleLogout}
        onTriggerRender={handleTriggerRender}
        onTriggerPdfExport={handleTriggerPdfExport}
      />

      {/* Main Tab Content View */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'design-studio' && (
          <DesignStudio
            transform={transform}
            onTransformChange={setTransform}
            onNavigateToVirtualModel={() => setActiveTab('virtual-model-studio')}
          />
        )}

        {activeTab === 'virtual-model-studio' && (
          <VirtualModelStudio onNavigateTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'tech-pack-and-lookbook' && (
          <TechPackAndLookbook onExportPdf={() => setActiveTab('tech-pack-and-lookbook')} />
        )}

        {activeTab === 'fabric-and-materials-db' && (
          <FabricDatabase
            onSelectFabric={handleSelectFabric}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Global Application Footer Status Bar */}
      <Footer
        transform={transform}
        substrateName={activeSubstrate}
        activePatternIsland="Front Chest (Mesh Lod-0)"
      />

      {/* Functioning Secure Login & Credential Vault Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenVault={() => {
          setLoginModalOpen(false);
          setSecurityVaultOpen(true);
        }}
      />

      {/* Cryptographic Security Vault Inspector */}
      <SecurityVaultModal
        isOpen={securityVaultOpen}
        onClose={() => setSecurityVaultOpen(false)}
        onOpenLogin={() => {
          setSecurityVaultOpen(false);
          setLoginModalOpen(true);
        }}
      />
    </div>
  );
}
