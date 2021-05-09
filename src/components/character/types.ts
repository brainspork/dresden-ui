export enum AspectEnum {
  HIGH_CONCEPT,
  TROUBLE,
  OTHER
}

export enum StressEnum {
  MILD = 2,
  MODERATE = 4,
  SEVERE = 6,
  EXTREME = 8
}

export enum StressCategory {
  ANY,
  P,
  M,
  S
}

export type CharacterType = {
  userId: number;
  characterId: number;
  characterVersionId: number;
  name: string;
  notes?: string;
  physicalStressBoxes: number;
  mentalStressBoxes: number;
  socialStressBoxes: number;
  physicalStressTaken?: number;
  mentalStressTaken?: number;
  socialStressTaken?: number;
  baseRefresh: number;
  aspects: AspectType[];
  skills: SkillType[];
  stunts: StuntType[];
  consequences: ConsequenceType[];
  temporaryAspects: TemporaryAspectType[];
  characterCreateUtc: Date;
  characterUpdateUtc?: Date;
  characterDeleteUtc?: Date;
  characterVersionCreateUtc: Date;
  characterVersionDeleteUtc?: Date;
};

export type AspectType = {
  aspectType: AspectEnum;
  name: string;
};

export type SkillType = {
  skillLevel: number;
  skillId: number;
  name: string;
};

export type StuntType = {
  stuntId: number;
  notes?: string;
  name: string;
  description: string;
  cost: number;
};

export type ConsequenceType = {
  id: number;
  stressType: StressEnum;
  stressCategory: StressCategory;
  aspect: string;
};

export type TemporaryAspectType = {
  id: number;
  name: string;
};

export type CharacterPatch = {
  name: string;
  notes?: string;
  physicalStressTaken?: number;
  mentalStressTaken?: number;
  socialStressTaken?: number;
  consequences: ConsequenceType[];
  temporaryAspects: TemporaryAspectType[];
}