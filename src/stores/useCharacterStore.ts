"use client";

import { create } from "zustand";
import {
  createDefaultOccupationSelections,
  getOccupationById,
  getOccupationFormulaLabel,
  getOccupationPoints,
} from "@/data/occupations";
import {
  createDynamicCustomSkill,
  createDynamicSkillVariant,
  DEFAULT_SKILLS,
  getComputedBaseValue,
  getExpandableSkillGroupIdFromSkillId,
} from "@/data/skills";
import type {
  Assets,
  AttributeKey,
  Attributes,
  Backstory,
  CurrentStatus,
  DerivedStats,
  InvestigatorInfo,
  InventoryItem,
  ModuleExperience,
  MythosEncounter,
  OccupationState,
  OccupationSummary,
  OccupationDefinition,
  OccupationSkillOption,
  CharacterData,
  Skill,
  Spell,
  Weapon,
} from "@/types/character";

function calcMaxHP(con: number, siz: number): number {
  return Math.floor((con + siz) / 10);
}

function calcMaxMP(pow: number): number {
  return Math.floor(pow / 5);
}

function calcMOV(str: number, dex: number, siz: number, age: number | ""): number {
  let base = 8;
  if (dex < siz && str < siz) {
    base = 7;
  } else if (dex > siz && str > siz) {
    base = 9;
  }

  const ageValue = typeof age === "number" ? age : 0;
  if (ageValue >= 80) return base - 5;
  if (ageValue >= 70) return base - 4;
  if (ageValue >= 60) return base - 3;
  if (ageValue >= 50) return base - 2;
  if (ageValue >= 40) return base - 1;
  return base;
}

function calcDBAndBuild(str: number, siz: number): { damageBonus: string; build: number } {
  const total = str + siz;
  if (total <= 64) return { damageBonus: "-2", build: -2 };
  if (total <= 84) return { damageBonus: "-1", build: -1 };
  if (total <= 124) return { damageBonus: "0", build: 0 };
  if (total <= 164) return { damageBonus: "+1D4", build: 1 };
  if (total <= 204) return { damageBonus: "+1D6", build: 2 };
  if (total <= 284) return { damageBonus: "+2D6", build: 3 };
  if (total <= 364) return { damageBonus: "+3D6", build: 4 };
  if (total <= 444) return { damageBonus: "+4D6", build: 5 };
  return { damageBonus: "+5D6", build: 6 };
}

function getSkillTotal(skill?: Skill): number {
  if (!skill) {
    return 0;
  }
  return skill.baseValue + skill.growth + skill.occupationPoints + skill.interestPoints;
}

function shouldRevealSkill(): boolean {
  return true;
}

function calcDerived(attrs: Attributes, info: InvestigatorInfo, skills: Skill[]): DerivedStats {
  const mythos = skills.find((skill) => skill.id === "cthulhu_mythos");
  const { damageBonus, build } = calcDBAndBuild(attrs.STR, attrs.SIZ);
  const maxHP = calcMaxHP(attrs.CON, attrs.SIZ);

  return {
    maxHP,
    maxMP: calcMaxMP(attrs.POW),
    maxSAN: 99 - getSkillTotal(mythos),
    MOV: calcMOV(attrs.STR, attrs.DEX, attrs.SIZ, info.age),
    damageBonus,
    build,
    majorWound: Math.ceil(maxHP / 2),
  };
}

function isSkillEmptyForOccupation(skill: Skill): boolean {
  return !skill.subName?.trim() && skill.growth === 0 && skill.occupationPoints === 0 && skill.interestPoints === 0;
}

function insertSkillAfterGroup(skills: Skill[], groupId: string, nextSkill: Skill): Skill[] {
  const insertAfterIndex = skills.reduce((lastIndex, skill, index) => {
    return skill.variantGroup === groupId ? index : lastIndex;
  }, -1);

  if (insertAfterIndex === -1) {
    return [...skills, nextSkill];
  }

  return [
    ...skills.slice(0, insertAfterIndex + 1),
    nextSkill,
    ...skills.slice(insertAfterIndex + 1),
  ];
}

function insertSkillAfterCustomSkills(skills: Skill[], nextSkill: Skill): Skill[] {
  const insertAfterIndex = skills.reduce((lastIndex, skill, index) => {
    return skill.isCustom ? index : lastIndex;
  }, -1);

  if (insertAfterIndex === -1) {
    return [...skills, nextSkill];
  }

  return [
    ...skills.slice(0, insertAfterIndex + 1),
    nextSkill,
    ...skills.slice(insertAfterIndex + 1),
  ];
}

function getNextCustomSkillIndex(skills: Skill[]): number {
  return skills.reduce((nextIndex, skill) => {
    if (!skill.isCustom) {
      return nextIndex;
    }

    const match = /^custom_skill_(\d+)$/.exec(skill.id);
    const index = match ? Number(match[1]) : 1;
    return Math.max(nextIndex, index + 1);
  }, 1);
}

function resolveOccupationOptionSkill(
  skills: Skill[],
  option: OccupationSkillOption,
  claimedSkillIds: Set<string>,
): { skills: Skill[]; skillId: string } {
  const exactSkill = skills.find((skill) => skill.id === option.skillId);
  const groupId = exactSkill?.variantGroup ?? getExpandableSkillGroupIdFromSkillId(option.skillId);
  if (!groupId) {
    return { skills, skillId: option.skillId };
  }

  const groupSkills = skills.filter((skill) => skill.variantGroup === groupId);
  const candidateSkills =
    exactSkill && !groupSkills.some((skill) => skill.id === exactSkill.id)
      ? [exactSkill, ...groupSkills]
      : groupSkills;
  const preferredSkill =
    candidateSkills.find(
      (skill) =>
        skill.id === option.skillId &&
        !claimedSkillIds.has(skill.id) &&
        option.subName !== undefined &&
        skill.subName === option.subName,
    ) ??
    candidateSkills.find(
      (skill) =>
        !claimedSkillIds.has(skill.id) &&
        option.subName !== undefined &&
        skill.subName === option.subName,
    ) ??
    candidateSkills.find((skill) => skill.id === option.skillId && !claimedSkillIds.has(skill.id) && isSkillEmptyForOccupation(skill)) ??
    candidateSkills.find((skill) => !claimedSkillIds.has(skill.id) && isSkillEmptyForOccupation(skill));

  if (preferredSkill) {
    return { skills, skillId: preferredSkill.id };
  }

  const nextSkill = createDynamicSkillVariant(groupId, groupSkills.length + 1);
  return {
    skills: insertSkillAfterGroup(skills, groupId, nextSkill),
    skillId: nextSkill.id,
  };
}

function normalizeOccupationSkills(
  definition: OccupationDefinition | undefined,
  occupationState: OccupationState,
  skills: Skill[],
): { skills: Skill[]; allowedSkillIds: string[]; skillSubNames: Record<string, string> } {
  if (!definition) {
    return { skills, allowedSkillIds: [], skillSubNames: {} };
  }

  let nextSkills = skills;
  const allowed = new Set<string>(["credit_rating"]);
  const skillSubNames: Record<string, string> = {};
  const claimedSkillIds = new Set<string>(["credit_rating"]);

  const applyOption = (option: OccupationSkillOption) => {
    const resolved = resolveOccupationOptionSkill(nextSkills, option, claimedSkillIds);
    nextSkills = resolved.skills;
    allowed.add(resolved.skillId);
    claimedSkillIds.add(resolved.skillId);
    if (option.subName) {
      skillSubNames[resolved.skillId] = option.subName;
    }
  };

  for (const item of definition.fixedSkills) {
    applyOption(item);
  }

  for (const group of definition.choiceGroups) {
    const selected = occupationState.selectedSkills[group.id] ?? [];
    for (const optionId of selected) {
      const option = group.options.find((item) => item.id === optionId);
      if (option) {
        applyOption(option);
      }
    }
  }

  return {
    skills: nextSkills,
    allowedSkillIds: [...allowed],
    skillSubNames,
  };
}

function buildOccupationSummary(
  attrs: Attributes,
  skills: Skill[],
  occupationState: OccupationState,
): OccupationSummary {
  const occupation = getOccupationById(occupationState.occupationId);
  const { allowedSkillIds, skillSubNames } = normalizeOccupationSkills(occupation, occupationState, skills);
  const creditRatingValue = getSkillTotal(skills.find((skill) => skill.id === "credit_rating"));
  const occupationPointsTotal = getOccupationPoints(occupation, attrs);
  const occupationPointsSpent = skills.reduce((sum, skill) => sum + skill.occupationPoints, 0);
  const interestPointsTotal = attrs.INT * 2;
  const interestPointsSpent = skills.reduce((sum, skill) => sum + skill.interestPoints, 0);

  return {
    occupationId: occupation?.id ?? null,
    occupationName: occupation?.name ?? "",
    formulaLabel: getOccupationFormulaLabel(occupation),
    contacts: occupation?.contacts ?? "",
    description: occupation?.description ?? "",
    occupationPointsTotal,
    occupationPointsSpent,
    occupationPointsRemaining: occupationPointsTotal - occupationPointsSpent,
    interestPointsTotal,
    interestPointsSpent,
    interestPointsRemaining: interestPointsTotal - interestPointsSpent,
    creditRatingMin: occupation?.creditRatingMin ?? null,
    creditRatingMax: occupation?.creditRatingMax ?? null,
    creditRatingValue,
    creditRatingInRange:
      !occupation || (creditRatingValue >= occupation.creditRatingMin && creditRatingValue <= occupation.creditRatingMax),
    allowedSkillIds,
    skillSubNames,
  };
}

function sanitizeSkills(skills: Skill[], attrs: Attributes, occupationState: OccupationState): Skill[] {
  const occupation = getOccupationById(occupationState.occupationId);
  const normalized = normalizeOccupationSkills(occupation, occupationState, skills);
  const { allowedSkillIds, skillSubNames } = normalized;

  return normalized.skills.map((skill) => {
    const computedBaseValue = getComputedBaseValue(skill.id, { DEX: attrs.DEX, EDU: attrs.EDU });
    const forcedSubName = skillSubNames[skill.id];
    const isOccupationAllowed = allowedSkillIds.includes(skill.id);

    return {
      ...skill,
      baseValue: computedBaseValue ?? skill.baseValue,
      subName: forcedSubName ?? skill.subName,
      isVisible: shouldRevealSkill(),
      occupationPoints:
        skill.cannotAssignOccupation || !isOccupationAllowed ? 0 : Math.max(0, Math.min(100, skill.occupationPoints)),
      interestPoints: skill.cannotAssignInterest ? 0 : Math.max(0, Math.min(100, skill.interestPoints)),
    };
  });
}

export interface CharacterStore {
  readOnly: boolean;
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
  occupationSummary: OccupationSummary;
  derived: DerivedStats;
  setReadOnly: (value: boolean) => void;
  toggleReadOnly: () => void;
  setInfo: (field: keyof InvestigatorInfo, value: string | number) => void;
  setAttribute: (key: AttributeKey, value: number) => void;
  setOccupation: (occupationId: number | null) => void;
  setOccupationSelection: (groupId: string, values: string[]) => void;
  setCurrentHP: (value: number) => void;
  setCurrentMP: (value: number) => void;
  setCurrentSAN: (value: number) => void;
  setCondition: (field: keyof CurrentStatus["conditions"], value: boolean) => void;
  setSkillField: (
    skillId: string,
    field: "growth" | "occupationPoints" | "interestPoints" | "subName",
    value: number | string,
  ) => void;
  toggleSkillCheck: (skillId: string) => void;
  addSkillVariant: (groupId: string) => void;
  addCustomSkill: () => void;
  addWeapon: (weapon?: Omit<Weapon, "id">) => void;
  updateWeapon: (id: string, field: keyof Weapon, value: string | number | boolean) => void;
  removeWeapon: (id: string) => void;
  addInventoryItem: () => void;
  updateInventoryItem: (id: string, field: keyof InventoryItem, value: string) => void;
  removeInventoryItem: (id: string) => void;
  updateAsset: (field: keyof Assets, value: string | number) => void;
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

type StoreState = Omit<
  CharacterStore,
  | "setReadOnly"
  | "toggleReadOnly"
  | "setInfo"
  | "setAttribute"
  | "setOccupation"
  | "setOccupationSelection"
  | "setCurrentHP"
  | "setCurrentMP"
  | "setCurrentSAN"
  | "setCondition"
  | "setSkillField"
  | "toggleSkillCheck"
  | "addSkillVariant"
  | "addCustomSkill"
  | "addWeapon"
  | "updateWeapon"
  | "removeWeapon"
  | "addInventoryItem"
  | "updateInventoryItem"
  | "removeInventoryItem"
  | "updateAsset"
  | "exportJSON"
  | "importJSON"
>;

export type CharacterStoreSnapshot = CharacterStore;

const DEFAULT_INFO: InvestigatorInfo = {
  name: "",
  player: "",
  age: "",
  era: "",
  occupation: "",
  occupationId: "",
  gender: "",
  nationality: "",
  residence: "",
  birthplace: "",
  portrait: "",
};

const DEFAULT_ATTRIBUTES: Attributes = {
  STR: 0,
  DEX: 0,
  POW: 0,
  CON: 0,
  APP: 0,
  EDU: 0,
  SIZ: 0,
  INT: 0,
  Luck: 0,
};

const DEFAULT_STATUS: CurrentStatus = {
  currentHP: 0,
  currentMP: 0,
  currentSAN: 0,
  tempHP: 0,
  todaySANLoss: 0,
  usedMP: 0,
  conditions: {
    majorWound: false,
    unconscious: false,
    dying: false,
    tempInsanity: false,
    indefInsanity: false,
    permInsanity: false,
  },
};

const DEFAULT_ASSETS: Assets = {
  creditRating: 0,
  livingStandard: "",
  spendingLevel: "",
  otherAssets: "",
  currentCash: 0,
  currency: "美元",
  vehicles: "",
  vehiclesValue: 0,
  residences: "",
  residencesValue: 0,
  luxuries: "",
  luxuriesValue: 0,
  securities: "",
  securitiesValue: 0,
  other: "",
  otherValue: 0,
  overviews: "",
};

const DEFAULT_BACKSTORY: Backstory = {
  personalDescription: "",
  ideologyBeliefs: "",
  significantPeople: "",
  meaningfulLocations: "",
  treasuredPossessions: "",
  traits: "",
  injuriesScars: "",
  phobiasManias: "",
  overviews: "",
  keyConnection: [false, false, false, false, false, false, false],
};

const DEFAULT_OCCUPATION_STATE: OccupationState = {
  occupationId: null,
  selectedSkills: {},
};

const NOOP = () => {};

function areCoreAttributesCompleted(attributes: Attributes): boolean {
  return Object.values(attributes).every((value) => value > 0);
}

function syncCurrentStatusWithDerived(
  currentStatus: CurrentStatus,
  derived: DerivedStats,
  options?: { initializeEmpty?: boolean; initialSAN?: number },
): CurrentStatus {
  const nextStatus = {
    ...currentStatus,
    currentHP: Math.min(currentStatus.currentHP, derived.maxHP),
    currentMP: Math.min(currentStatus.currentMP, derived.maxMP),
    currentSAN: Math.min(currentStatus.currentSAN, derived.maxSAN),
  };

  if (options?.initializeEmpty) {
    nextStatus.currentHP = derived.maxHP;
    nextStatus.currentMP = derived.maxMP;
    nextStatus.currentSAN = Math.min(options.initialSAN ?? derived.maxSAN, derived.maxSAN);
  }

  return nextStatus;
}

function recalcState(state: StoreState): StoreState {
  const skills = sanitizeSkills(state.skills, state.attributes, state.occupationState);
  const occupationSummary = buildOccupationSummary(state.attributes, skills, state.occupationState);
  const derived = calcDerived(state.attributes, state.info, skills);
  const assets = {
    ...state.assets,
    creditRating: getSkillTotal(skills.find((skill) => skill.id === "credit_rating")),
  };

  return {
    ...state,
    skills,
    assets,
    occupationSummary,
    currentStatus: syncCurrentStatusWithDerived(state.currentStatus, derived),
    derived,
  };
}

function getMaxAssignablePoints(
  skills: Skill[],
  skillId: string,
  field: "occupationPoints" | "interestPoints",
  total: number,
): number {
  const currentSkill = skills.find((item) => item.id === skillId);
  if (!currentSkill) {
    return 0;
  }

  const spent = skills.reduce((sum, skill) => sum + skill[field], 0);
  return Math.max(0, total - spent + currentSkill[field]);
}

export function createCharacterStoreSnapshot(
  data: Partial<CharacterData>,
  options?: { readOnly?: boolean },
): CharacterStoreSnapshot {
  const info = data.info ?? DEFAULT_INFO;
  const attributes = data.attributes ?? DEFAULT_ATTRIBUTES;
  const skills = data.skills ?? [...DEFAULT_SKILLS];
  const nextState = recalcState({
    readOnly: options?.readOnly ?? true,
    info,
    attributes,
    currentStatus: data.currentStatus ?? DEFAULT_STATUS,
    skills,
    weapons: data.weapons ?? [],
    inventory: data.inventory ?? [],
    assets: { ...DEFAULT_ASSETS, ...(data.assets ?? {}) },
    backstory: data.backstory ?? DEFAULT_BACKSTORY,
    spells: data.spells ?? [],
    moduleExperiences: data.moduleExperiences ?? [],
    mythosEncounters: data.mythosEncounters ?? [],
    occupationState: data.occupationState ?? DEFAULT_OCCUPATION_STATE,
    occupationSummary: {
      occupationId: null,
      occupationName: "",
      formulaLabel: "",
      contacts: "",
      description: "",
      occupationPointsTotal: 0,
      occupationPointsSpent: 0,
      occupationPointsRemaining: 0,
      interestPointsTotal: 0,
      interestPointsSpent: 0,
      interestPointsRemaining: 0,
      creditRatingMin: null,
      creditRatingMax: null,
      creditRatingValue: 0,
      creditRatingInRange: true,
      allowedSkillIds: [],
      skillSubNames: {},
    },
    derived: calcDerived(attributes, info, skills),
  });

  const shouldInitializeCurrentStatus =
    !data.currentStatus && areCoreAttributesCompleted(nextState.attributes);

  return {
    ...nextState,
    currentStatus: shouldInitializeCurrentStatus
      ? syncCurrentStatusWithDerived(nextState.currentStatus, nextState.derived, {
          initializeEmpty: true,
          initialSAN: nextState.attributes.POW,
        })
      : nextState.currentStatus,
    setReadOnly: NOOP,
    toggleReadOnly: NOOP,
    setInfo: NOOP,
    setAttribute: NOOP,
    setOccupation: NOOP,
    setOccupationSelection: NOOP,
    setCurrentHP: NOOP,
    setCurrentMP: NOOP,
    setCurrentSAN: NOOP,
    setCondition: NOOP,
    setSkillField: NOOP,
    toggleSkillCheck: NOOP,
    addSkillVariant: NOOP,
    addCustomSkill: NOOP,
    addWeapon: NOOP,
    updateWeapon: NOOP,
    removeWeapon: NOOP,
    addInventoryItem: NOOP,
    updateInventoryItem: NOOP,
    removeInventoryItem: NOOP,
    updateAsset: NOOP,
    exportJSON: () => JSON.stringify(data, null, 2),
    importJSON: NOOP,
  };
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  ...recalcState({
    readOnly: false,
    info: DEFAULT_INFO,
    attributes: DEFAULT_ATTRIBUTES,
    currentStatus: DEFAULT_STATUS,
    skills: [...DEFAULT_SKILLS],
    weapons: [],
    inventory: [],
    assets: {
      ...DEFAULT_ASSETS,
      creditRating: getSkillTotal(DEFAULT_SKILLS.find((skill) => skill.id === "credit_rating")),
    },
    backstory: DEFAULT_BACKSTORY,
    spells: [],
    moduleExperiences: [],
    mythosEncounters: [],
    occupationState: DEFAULT_OCCUPATION_STATE,
    occupationSummary: {
      occupationId: null,
      occupationName: "",
      formulaLabel: "",
      contacts: "",
      description: "",
      occupationPointsTotal: 0,
      occupationPointsSpent: 0,
      occupationPointsRemaining: 0,
      interestPointsTotal: 0,
      interestPointsSpent: 0,
      interestPointsRemaining: 0,
      creditRatingMin: null,
      creditRatingMax: null,
      creditRatingValue: 0,
      creditRatingInRange: true,
      allowedSkillIds: [],
      skillSubNames: {},
    },
    derived: calcDerived(DEFAULT_ATTRIBUTES, DEFAULT_INFO, DEFAULT_SKILLS),
  }),

  setReadOnly: (value) => set(() => ({ readOnly: value })),
  toggleReadOnly: () => set((state) => ({ readOnly: !state.readOnly })),

  setInfo: (field, value) =>
    set((state) =>
      recalcState({
        ...state,
        info: { ...state.info, [field]: value },
      }),
    ),

  setAttribute: (key, value) =>
    set((state) => {
      const nextAttributes = { ...state.attributes, [key]: value };
      const shouldInitializeCurrentStatus =
        !areCoreAttributesCompleted(state.attributes) && areCoreAttributesCompleted(nextAttributes);

      const nextState = recalcState({
        ...state,
        attributes: nextAttributes,
      });

      return shouldInitializeCurrentStatus
        ? {
            ...nextState,
            currentStatus: syncCurrentStatusWithDerived(nextState.currentStatus, nextState.derived, {
              initializeEmpty: true,
              initialSAN: nextState.attributes.POW,
            }),
          }
        : nextState;
    }),

  setOccupation: (occupationId) =>
    set((state) => {
      const occupation = getOccupationById(occupationId);
      const occupationState: OccupationState = {
        occupationId,
        selectedSkills: createDefaultOccupationSelections(occupation),
      };

      return recalcState({
        ...state,
        info: {
          ...state.info,
          occupation: occupation?.name ?? "",
          occupationId: occupationId ?? "",
        },
        occupationState,
      });
    }),

  setOccupationSelection: (groupId, values) =>
    set((state) =>
      recalcState({
        ...state,
        occupationState: {
          ...state.occupationState,
          selectedSkills: {
            ...state.occupationState.selectedSkills,
            [groupId]: values,
          },
        },
      }),
    ),

  setCurrentHP: (value) =>
    set((state) => ({ currentStatus: { ...state.currentStatus, currentHP: value } })),
  setCurrentMP: (value) =>
    set((state) => ({ currentStatus: { ...state.currentStatus, currentMP: value } })),
  setCurrentSAN: (value) =>
    set((state) => ({ currentStatus: { ...state.currentStatus, currentSAN: value } })),
  setCondition: (field, value) =>
    set((state) => ({
      currentStatus: {
        ...state.currentStatus,
        conditions: { ...state.currentStatus.conditions, [field]: value },
      },
    })),

  setSkillField: (skillId, field, rawValue) =>
    set((state) => {
      const currentSkill = state.skills.find((skill) => skill.id === skillId);
      if (!currentSkill) {
        return state;
      }

      const value = typeof rawValue === "number" ? Math.max(0, Math.min(100, rawValue)) : rawValue;
      let nextValue = value;

      if (field === "occupationPoints" && typeof nextValue === "number") {
        if (!state.occupationSummary.allowedSkillIds.includes(skillId) || currentSkill.cannotAssignOccupation) {
          return state;
        }
        const maxAssignable = getMaxAssignablePoints(
          state.skills,
          skillId,
          "occupationPoints",
          state.occupationSummary.occupationPointsTotal,
        );
        nextValue = Math.min(nextValue, maxAssignable);
      }

      if (field === "interestPoints" && typeof nextValue === "number") {
        if (currentSkill.cannotAssignInterest) {
          return state;
        }
        const maxAssignable = getMaxAssignablePoints(
          state.skills,
          skillId,
          "interestPoints",
          state.occupationSummary.interestPointsTotal,
        );
        nextValue = Math.min(nextValue, maxAssignable);
      }

      return recalcState({
        ...state,
        skills: state.skills.map((skill) =>
          skill.id === skillId
            ? {
                ...skill,
                [field]: nextValue,
              }
            : skill,
        ),
      });
    }),

  toggleSkillCheck: (skillId) =>
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === skillId ? { ...skill, checked: !skill.checked } : skill,
      ),
    })),

  addSkillVariant: (groupId) =>
    set((state) => {
      const matchingSkills = state.skills.filter((skill) => skill.variantGroup === groupId);
      if (matchingSkills.length === 0) {
        return state;
      }

      const nextIndex = matchingSkills.length + 1;
      const nextSkill = createDynamicSkillVariant(groupId, nextIndex);

      return recalcState({
        ...state,
        skills: insertSkillAfterGroup(state.skills, groupId, nextSkill),
      });
    }),

  addCustomSkill: () =>
    set((state) => {
      const nextSkill = createDynamicCustomSkill(getNextCustomSkillIndex(state.skills));

      return recalcState({
        ...state,
        skills: insertSkillAfterCustomSkills(state.skills, nextSkill),
      });
    }),

  addWeapon: (weapon) =>
    set((state) => ({
      weapons: [
        ...state.weapons,
        weapon
          ? {
              id: `w_${Date.now()}`,
              ...weapon,
            }
          : {
              id: `w_${Date.now()}`,
              name: "",
              type: "",
              skill: "",
              damage: "",
              range: "",
              penetration: false,
              attacksPerRound: "1",
              ammo: "",
              malfunction: "",
            },
      ],
    })),

  updateWeapon: (id, field, value) =>
    set((state) => ({
      weapons: state.weapons.map((weapon) =>
        weapon.id === id ? { ...weapon, [field]: value } : weapon,
      ),
    })),

  removeWeapon: (id) =>
    set((state) => ({
      weapons: state.weapons.filter((weapon) => weapon.id !== id),
    })),

  addInventoryItem: () =>
    set((state) => ({
      inventory: [
        ...state.inventory,
        {
          id: `i_${Date.now()}`,
          name: "",
          status: "",
          location: "",
        },
      ],
    })),

  updateInventoryItem: (id, field, value) =>
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    })),

  removeInventoryItem: (id) =>
    set((state) => ({
      inventory: state.inventory.filter((item) => item.id !== id),
    })),

  updateAsset: (field, value) =>
    set((state) => ({
      assets: { ...state.assets, [field]: value },
    })),

  exportJSON: () => {
    const state = get();
    return JSON.stringify(
      {
        info: state.info,
        attributes: state.attributes,
        currentStatus: state.currentStatus,
        skills: state.skills,
        weapons: state.weapons,
        inventory: state.inventory,
        assets: state.assets,
        backstory: state.backstory,
        spells: state.spells,
        moduleExperiences: state.moduleExperiences,
        mythosEncounters: state.mythosEncounters,
        occupationState: state.occupationState,
      },
      null,
      2,
    );
  },

  importJSON: (json) => {
    try {
      const data = JSON.parse(json);
      set(
        (() => {
          const nextState = recalcState({
          readOnly: get().readOnly,
          info: data.info ?? DEFAULT_INFO,
          attributes: data.attributes ?? DEFAULT_ATTRIBUTES,
          currentStatus: data.currentStatus ?? DEFAULT_STATUS,
          skills: data.skills ?? [...DEFAULT_SKILLS],
          weapons: data.weapons ?? [],
          inventory: data.inventory ?? [],
          assets: { ...DEFAULT_ASSETS, ...(data.assets ?? {}) },
          backstory: data.backstory ?? DEFAULT_BACKSTORY,
          spells: data.spells ?? [],
          moduleExperiences: data.moduleExperiences ?? [],
          mythosEncounters: data.mythosEncounters ?? [],
          occupationState: data.occupationState ?? DEFAULT_OCCUPATION_STATE,
          occupationSummary: get().occupationSummary,
          derived: get().derived,
          });

          const shouldInitializeCurrentStatus =
            !data.currentStatus && areCoreAttributesCompleted(nextState.attributes);

          return shouldInitializeCurrentStatus
            ? {
                ...nextState,
                currentStatus: syncCurrentStatusWithDerived(nextState.currentStatus, nextState.derived, {
                  initializeEmpty: true,
                  initialSAN: nextState.attributes.POW,
                }),
              }
            : nextState;
        })(),
      );
    } catch (error) {
      console.error("导入 JSON 失败:", error);
    }
  },
}));
