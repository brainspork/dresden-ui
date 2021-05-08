export enum AspectEnum {
  HIGH_CONCEPT,
  TROUBLE,
  OTHER
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
  cost: number;
};

export type ConsequenceType = {
  id: number;
  stressAmount: number;
  aspect: string;
};

export type TemporaryAspectType = {
  id: number;
  name: string;
};
