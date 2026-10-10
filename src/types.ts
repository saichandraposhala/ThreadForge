/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudioTab =
  | 'design-studio'
  | 'virtual-model-studio'
  | 'tech-pack-and-lookbook'
  | 'fabric-and-materials-db';

export interface DecalTransform {
  posX: number; // in mm
  posY: number; // in mm
  width: number; // in mm
  height: number; // in mm
  scale: number; // %
  rotation: number; // deg
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  aspectLocked: boolean;
}

export interface LayerItem {
  id: string;
  name: string;
  category: 'decal' | 'texture' | 'base';
  opacity: number;
  blendMode: string;
  visible: boolean;
  locked: boolean;
}

export interface FabricMaterial {
  id: string;
  name: string;
  category: string;
  gsm: number;
  composition: string;
  weave: string;
  yarnCount: string;
  drapeScore: number; // 0-1
  stretchElasticity: number; // %
  tensileModulus: string;
  spirality: string;
  recommendedNeedle: string;
  certification: string;
  colorHex: string;
  description: string;
}

export interface ColorwaySwatch {
  id: string;
  name: string;
  pantone: string;
  hex: string;
  role: string;
}

export interface VirtualModelConfig {
  gender: 'female' | 'male' | 'andro';
  somaticProfile: 'runway-slim' | 'athletic' | 'streetwear-boxy' | 'petite';
  heightCm: number;
  chestCm: number;
  fitGrade: string;
  phenotype: string;
  poseId: string;
  environmentId: string;
  keyLightAzimuth: number;
  fillTempKelvin: number;
  ambientOcclusion: number;
  controlNetRigidity: number;
  inpaintWeight: number;
  tileDenoise: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  studioUnit: string;
  avatarUrl: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface SavedCredentialRecord {
  email: string;
  fullName: string;
  passwordHash: string; // PBKDF2 SHA-256 hex digest
  salt: string; // Hex-encoded random 16-byte salt
  iterations: number;
  algorithm: string;
  savedAt: string;
  rememberMe: boolean;
}
