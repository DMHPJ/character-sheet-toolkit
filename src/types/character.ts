export interface Attributes {
  STR: number;
  DEX: number;
  POW: number;
  CON: number;
  APP: number;
  EDU: number;
  SIZ: number;
  INT: number;
  Luck: number;
}

export type AttributeKey = keyof Attributes;

export interface InvestigatorInfo {
  name: string;
  player: string;
  age: number | "";
  era: string;
  occupation: string;
  occupationId: number | "";
  gender: string;
  nationality: string;
  residence: string;
  birthplace: string;
  portrait: string;
}

export interface DerivedStats {
  maxHP: number;
  maxMP: number;
  maxSAN: number;
  MOV: number;
  damageBonus: string;
  build: number;
  majorWound: number;
}

export interface CurrentStatus {
  currentHP: number;
  currentMP: number;
  currentSAN: number;
  tempHP: number;
  todaySANLoss: number;
  usedMP: number;
  conditions: {
    majorWound: boolean;
    unconscious: boolean;
    dying: boolean;
    tempInsanity: boolean;
    indefInsanity: boolean;
    permInsanity: boolean;
  };
}

export type SkillCategory =
  | "战斗"
  | "交际"
  | "调查"
  | "学术"
  | "行动"
  | "专业"
  | "特殊";

export interface Skill {
  id: string;
  name: string;
  subName?: string;
  category: SkillCategory;
  baseValue: number;
  growth: number;
  occupationPoints: number;
  interestPoints: number;
  isCustom?: boolean;
  cannotAssignOccupation?: boolean;
  cannotAssignInterest?: boolean;
  checked: boolean;
}

export interface Weapon {
  id: string;
  name: string;
  type: string;
  skill: string;
  damage: string;
  range: string;
  penetration: boolean;
  attacksPerRound: number;
  ammo: string;
  malfunction: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  status: string;
  location: string;
}

export interface Assets {
  creditRating: number;
  livingStandard: string;
  spendingLevel: string;
  otherAssets: string;
  currentCash: number;
  currency: string;
  vehicles: string;
  vehiclesValue: number;
  residences: string;
  residencesValue: number;
  luxuries: string;
  luxuriesValue: number;
  securities: string;
  securitiesValue: number;
  other: string;
  otherValue: number;
  overviews: string;
}

export interface Backstory {
  personalDescription: string;
  ideologyBeliefs: string;
  significantPeople: string;
  meaningfulLocations: string;
  treasuredPossessions: string;
  traits: string;
  injuriesScars: string;
  phobiasManias: string;
  overviews: string;
  keyConnection: boolean[];
}

export interface Spell {
  id: string;
  number: string;
  name: string;
  cost: string;
  effect: string;
}

export interface ModuleExperience {
  id: string;
  moduleName: string;
  changes: string;
}

export interface MythosEncounter {
  id: string;
  encountered: string;
  result: string;
  notes: string;
  cumulative: number;
}

export interface OccupationPointPart {
  attribute: AttributeKey;
  multiplier: number;
}

export interface OccupationPointRule {
  label: string;
  fixed: OccupationPointPart[];
  chooseMax?: OccupationPointPart[];
}

export interface OccupationSkillOption {
  id: string;
  skillId: string;
  label: string;
  subName?: string;
}

export interface OccupationChoiceGroup {
  id: string;
  label: string;
  count: number;
  mode: "predefined" | "any";
  options: OccupationSkillOption[];
}

export interface OccupationDefinition {
  id: number;
  name: string;
  creditRatingMin: number;
  creditRatingMax: number;
  pointRule: OccupationPointRule;
  fixedSkills: OccupationSkillOption[];
  choiceGroups: OccupationChoiceGroup[];
  contacts: string;
  description: string;
}

export interface OccupationState {
  occupationId: number | null;
  selectedSkills: Record<string, string[]>;
}

export interface OccupationSummary {
  occupationId: number | null;
  occupationName: string;
  formulaLabel: string;
  contacts: string;
  description: string;
  occupationPointsTotal: number;
  occupationPointsSpent: number;
  occupationPointsRemaining: number;
  interestPointsTotal: number;
  interestPointsSpent: number;
  interestPointsRemaining: number;
  creditRatingMin: number | null;
  creditRatingMax: number | null;
  creditRatingValue: number;
  creditRatingInRange: boolean;
  allowedSkillIds: string[];
  skillSubNames: Record<string, string>;
}

export interface CharacterData {
  info: InvestigatorInfo;
  attributes: Attributes;
  currentStatus: CurrentStatus;
  skills: Skill[];
  weapons: Weapon[];
  inventory: InventoryItem[];
  assets: Assets;
  backstory: Backstory;
  spells: Spell[];
  moduleExperiences: ModuleExperience[];
  mythosEncounters: MythosEncounter[];
  occupationState: OccupationState;
}
