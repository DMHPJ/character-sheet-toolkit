/**
 * CoC 7th 人物卡核心状态管理
 * 使用 Zustand 管理角色全部数据及衍生计算
 */
'use client';

import { create } from 'zustand';
import type {
  Attributes,
  AttributeKey,
  InvestigatorInfo,
  CurrentStatus,
  DerivedStats,
  Skill,
  Weapon,
  InventoryItem,
  Assets,
  Backstory,
  Spell,
  ModuleExperience,
  MythosEncounter,
} from '@/types/character';
import { DEFAULT_SKILLS, getComputedBaseValue } from '@/data/skills';

/* ============================================================
   衍生属性计算（纯函数）
   ============================================================ */

/** 计算 HP 最大值 = (CON + SIZ) / 10 */
function calcMaxHP(con: number, siz: number): number {
  return Math.floor((con + siz) / 10);
}

/** 计算 MP 最大值 = POW / 5 */
function calcMaxMP(pow: number): number {
  return Math.floor(pow / 5);
}

/** 计算移动力 MOV */
function calcMOV(str: number, dex: number, siz: number, age: number | ''): number {
  let base: number;
  if (dex < siz && str < siz) {
    base = 7;
  } else if (dex > siz && str > siz) {
    base = 9;
  } else {
    base = 8;
  }
  // 年龄减值
  const ageVal = typeof age === 'number' ? age : 0;
  if (ageVal >= 80) return base - 5;
  if (ageVal >= 70) return base - 4;
  if (ageVal >= 60) return base - 3;
  if (ageVal >= 50) return base - 2;
  if (ageVal >= 40) return base - 1;
  return base;
}

/** 计算伤害加值 DB 和体格 Build */
function calcDBAndBuild(str: number, siz: number): { damageBonus: string; build: number } {
  const total = str + siz;
  if (total <= 64)  return { damageBonus: '-2',   build: -2 };
  if (total <= 84)  return { damageBonus: '-1',   build: -1 };
  if (total <= 124) return { damageBonus: '0',    build: 0 };
  if (total <= 164) return { damageBonus: '+1D4', build: 1 };
  if (total <= 204) return { damageBonus: '+1D6', build: 2 };
  if (total <= 284) return { damageBonus: '+2D6', build: 3 };
  if (total <= 364) return { damageBonus: '+3D6', build: 4 };
  if (total <= 444) return { damageBonus: '+4D6', build: 5 };
  return { damageBonus: '+5D6', build: 6 };
}

/** 计算所有衍生状态 */
function calcDerived(attrs: Attributes, info: InvestigatorInfo, skills: Skill[]): DerivedStats {
  const mythos = skills.find(sk => sk.id === 'cthulhu_mythos');
  const mythosTotal = mythos
    ? mythos.baseValue + mythos.growth + mythos.occupationPoints + mythos.interestPoints
    : 0;
  const { damageBonus, build } = calcDBAndBuild(attrs.STR, attrs.SIZ);
  const maxHP = calcMaxHP(attrs.CON, attrs.SIZ);
  return {
    maxHP,
    maxMP: calcMaxMP(attrs.POW),
    maxSAN: 99 - mythosTotal,
    MOV: calcMOV(attrs.STR, attrs.DEX, attrs.SIZ, info.age),
    damageBonus,
    build,
    majorWound: Math.ceil(maxHP / 2),
  };
}

/* ============================================================
   Store 接口定义
   ============================================================ */

interface CharacterStore {
  // ---- 角色信息 ----
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

  // ---- 衍生值 (getter) ----
  derived: DerivedStats;

  // ---- 基本信息 Actions ----
  setInfo: (field: keyof InvestigatorInfo, value: string | number) => void;

  // ---- 属性 Actions ----
  setAttribute: (key: AttributeKey, value: number) => void;

  // ---- 状态 Actions ----
  setCurrentHP: (value: number) => void;
  setCurrentMP: (value: number) => void;
  setCurrentSAN: (value: number) => void;
  setCondition: (field: keyof CurrentStatus['conditions'], value: boolean) => void;

  // ---- 技能 Actions ----
  setSkillField: (skillId: string, field: 'growth' | 'occupationPoints' | 'interestPoints' | 'subName', value: number | string) => void;
  toggleSkillCheck: (skillId: string) => void;

  // ---- 武器 Actions ----
  addWeapon: () => void;
  updateWeapon: (id: string, field: keyof Weapon, value: string | number | boolean) => void;
  removeWeapon: (id: string) => void;

  // ---- 导入导出 ----
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

/* ============================================================
   初始默认值
   ============================================================ */

const DEFAULT_INFO: InvestigatorInfo = {
  name: '', player: '', age: '', era: '',
  occupation: '', occupationId: '',
  gender: '', nationality: '', residence: '', birthplace: '',
  portrait: '',
};

const DEFAULT_ATTRIBUTES: Attributes = {
  STR: 0, DEX: 0, POW: 0, CON: 0,
  APP: 0, EDU: 0, SIZ: 0, INT: 0, Luck: 0,
};

const DEFAULT_STATUS: CurrentStatus = {
  currentHP: 0, currentMP: 0, currentSAN: 0,
  tempHP: 0, todaySANLoss: 0, usedMP: 0,
  conditions: {
    majorWound: false, unconscious: false, dying: false,
    tempInsanity: false, indefInsanity: false, permInsanity: false,
  },
};

const DEFAULT_ASSETS: Assets = {
  creditRating: 0, livingStandard: '', spendingLevel: '',
  otherAssets: '', currentCash: 0, currency: '美元',
  vehicles: '', residences: '', luxuries: '', securities: '', other: '',
};

const DEFAULT_BACKSTORY: Backstory = {
  personalDescription: '', ideologyBeliefs: '',
  significantPeople: '', meaningfulLocations: '',
  treasuredPossessions: '', traits: '',
  injuriesScars: '', phobiasManias: '',
  keyConnection: [false, false, false, false, false, false],
};

/* ============================================================
   Store 创建
   ============================================================ */

export const useCharacterStore = create<CharacterStore>((set, get) => {
  /** 重算衍生值和动态技能基础值 */
  function recalc(state: Partial<CharacterStore>) {
    const attrs = state.attributes ?? get().attributes;
    const info = state.info ?? get().info;
    const skills = (state.skills ?? get().skills).map(sk => {
      const computed = getComputedBaseValue(sk.id, { DEX: attrs.DEX, EDU: attrs.EDU });
      if (computed !== null) {
        return { ...sk, baseValue: computed };
      }
      return sk;
    });
    const derived = calcDerived(attrs, info, skills);
    return { ...state, skills, derived };
  }

  return {
    // ---- 初始数据 ----
    info: DEFAULT_INFO,
    attributes: DEFAULT_ATTRIBUTES,
    currentStatus: DEFAULT_STATUS,
    skills: [...DEFAULT_SKILLS],
    weapons: [],
    inventory: [],
    assets: DEFAULT_ASSETS,
    backstory: DEFAULT_BACKSTORY,
    spells: [],
    moduleExperiences: [],
    mythosEncounters: [],
    derived: calcDerived(DEFAULT_ATTRIBUTES, DEFAULT_INFO, DEFAULT_SKILLS),

    // ---- 基本信息 ----
    setInfo: (field, value) => set(st => {
      const newInfo = { ...st.info, [field]: value };
      return recalc({ info: newInfo });
    }),

    // ---- 属性 ----
    setAttribute: (key, value) => set(st => {
      const newAttrs = { ...st.attributes, [key]: value };
      return recalc({ attributes: newAttrs });
    }),

    // ---- 当前状态 ----
    setCurrentHP: (value) => set(st => ({ currentStatus: { ...st.currentStatus, currentHP: value } })),
    setCurrentMP: (value) => set(st => ({ currentStatus: { ...st.currentStatus, currentMP: value } })),
    setCurrentSAN: (value) => set(st => ({ currentStatus: { ...st.currentStatus, currentSAN: value } })),
    setCondition: (field, value) => set(st => ({
      currentStatus: {
        ...st.currentStatus,
        conditions: { ...st.currentStatus.conditions, [field]: value },
      },
    })),

    // ---- 技能 ----
    setSkillField: (skillId, field, value) => set(st => {
      const skills = st.skills.map(sk =>
        sk.id === skillId ? { ...sk, [field]: Number(value) > 100 ? 100 : value } : sk
      );
      return recalc({ skills });
    }),
    toggleSkillCheck: (skillId) => set(st => ({
      skills: st.skills.map(sk =>
        sk.id === skillId ? { ...sk, checked: !sk.checked } : sk
      ),
    })),

    // ---- 武器 ----
    addWeapon: () => set(st => ({
      weapons: [...st.weapons, {
        id: `w_${Date.now()}`, name: '', type: '', skill: '',
        damage: '', range: '', penetration: false,
        attacksPerRound: 1, ammo: '', malfunction: '',
      }],
    })),
    updateWeapon: (id, field, value) => set(st => ({
      weapons: st.weapons.map(w =>
        w.id === id ? { ...w, [field]: value } : w
      ),
    })),
    removeWeapon: (id) => set(st => ({
      weapons: st.weapons.filter(w => w.id !== id),
    })),

    // ---- 导入导出 ----
    exportJSON: () => {
      const st = get();
      const data = {
        info: st.info,
        attributes: st.attributes,
        currentStatus: st.currentStatus,
        skills: st.skills,
        weapons: st.weapons,
        inventory: st.inventory,
        assets: st.assets,
        backstory: st.backstory,
        spells: st.spells,
        moduleExperiences: st.moduleExperiences,
        mythosEncounters: st.mythosEncounters,
      };
      return JSON.stringify(data, null, 2);
    },
    importJSON: (json) => {
      try {
        const data = JSON.parse(json);
        set(recalc({
          info: data.info ?? DEFAULT_INFO,
          attributes: data.attributes ?? DEFAULT_ATTRIBUTES,
          currentStatus: data.currentStatus ?? DEFAULT_STATUS,
          skills: data.skills ?? [...DEFAULT_SKILLS],
          weapons: data.weapons ?? [],
          inventory: data.inventory ?? [],
          assets: data.assets ?? DEFAULT_ASSETS,
          backstory: data.backstory ?? DEFAULT_BACKSTORY,
          spells: data.spells ?? [],
          moduleExperiences: data.moduleExperiences ?? [],
          mythosEncounters: data.mythosEncounters ?? [],
        }));
      } catch (e) {
        console.error('导入 JSON 失败:', e);
      }
    },
  };
});
