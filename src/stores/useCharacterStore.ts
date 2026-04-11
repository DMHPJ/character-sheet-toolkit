"use client";

import { create } from "zustand";
import { DEFAULT_SKILLS, getComputedBaseValue } from "@/data/skills";
import type {
  Assets,
  Attributes,
  AttributeKey,
  Backstory,
  CurrentStatus,
  DerivedStats,
  InvestigatorInfo,
  InventoryItem,
  ModuleExperience,
  MythosEncounter,
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
  let base: number;
  if (dex < siz && str < siz) {
    base = 7;
  } else if (dex > siz && str > siz) {
    base = 9;
  } else {
    base = 8;
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

interface CharacterStore {
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
  derived: DerivedStats;
  setInfo: (field: keyof InvestigatorInfo, value: string | number) => void;
  setAttribute: (key: AttributeKey, value: number) => void;
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
  addWeapon: () => void;
  updateWeapon: (id: string, field: keyof Weapon, value: string | number | boolean) => void;
  removeWeapon: (id: string) => void;
  addInventoryItem: () => void;
  updateInventoryItem: (id: string, field: keyof InventoryItem, value: string) => void;
  removeInventoryItem: (id: string) => void;
  updateAsset: (field: keyof Assets, value: string | number) => void;
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

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

export const useCharacterStore = create<CharacterStore>((set, get) => {
  function recalc(state: Partial<CharacterStore>) {
    const attrs = state.attributes ?? get().attributes;
    const info = state.info ?? get().info;
    const skills = (state.skills ?? get().skills).map((skill) => {
      const computed = getComputedBaseValue(skill.id, { DEX: attrs.DEX, EDU: attrs.EDU });
      if (computed === null) {
        return skill;
      }
      return { ...skill, baseValue: computed };
    });

    const assets = {
      ...(state.assets ?? get().assets),
      creditRating: getSkillTotal(skills.find((skill) => skill.id === "credit_rating")),
    };

    return {
      ...state,
      skills,
      assets,
      derived: calcDerived(attrs, info, skills),
    };
  }

  return {
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
    derived: calcDerived(DEFAULT_ATTRIBUTES, DEFAULT_INFO, DEFAULT_SKILLS),

    setInfo: (field, value) =>
      set((state) => {
        const info = { ...state.info, [field]: value };
        return recalc({ info });
      }),

    setAttribute: (key, value) =>
      set((state) => {
        const attributes = { ...state.attributes, [key]: value };
        return recalc({ attributes });
      }),

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

    setSkillField: (skillId, field, value) =>
      set((state) => {
        const skills = state.skills.map((skill) => {
          if (skill.id !== skillId) {
            return skill;
          }
          return {
            ...skill,
            [field]: typeof value === "number" ? Math.min(100, value) : value,
          };
        });
        return recalc({ skills });
      }),
    toggleSkillCheck: (skillId) =>
      set((state) => ({
        skills: state.skills.map((skill) =>
          skill.id === skillId ? { ...skill, checked: !skill.checked } : skill,
        ),
      })),

    addWeapon: () =>
      set((state) => ({
        weapons: [
          ...state.weapons,
          {
            id: `w_${Date.now()}`,
            name: "",
            type: "",
            skill: "",
            damage: "",
            range: "",
            penetration: false,
            attacksPerRound: 1,
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
        },
        null,
        2,
      );
    },

    importJSON: (json) => {
      try {
        const data = JSON.parse(json);
        set(
          recalc({
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
          }),
        );
      } catch (error) {
        console.error("导入 JSON 失败:", error);
      }
    },
  };
});
