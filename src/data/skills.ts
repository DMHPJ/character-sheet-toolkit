import type { Skill, SkillCategory } from "@/types/character";

export interface ExpandableSkillGroup {
  id: string;
  label: string;
  category: SkillCategory;
  baseValue: number;
}

export const EXPANDABLE_SKILL_GROUPS: ExpandableSkillGroup[] = [
  { id: "art_craft", label: "技艺", category: "专业", baseValue: 5 },
  { id: "fighting", label: "格斗", category: "战斗", baseValue: 0 },
  { id: "firearms", label: "射击", category: "战斗", baseValue: 0 },
  { id: "lang_other", label: "外语", category: "学术", baseValue: 1 },
  { id: "pilot", label: "驾驶", category: "专业", baseValue: 1 },
  { id: "science", label: "科学", category: "学术", baseValue: 1 },
];

const EXPANDABLE_GROUP_MAP = Object.fromEntries(
  EXPANDABLE_SKILL_GROUPS.map((group) => [group.id, group]),
) as Record<string, ExpandableSkillGroup>;

function createSkill(
  id: string,
  name: string,
  baseValue: number,
  category: SkillCategory,
  options: Partial<Skill> = {},
): Skill {
  return {
    id,
    name,
    baseValue,
    category,
    growth: 0,
    occupationPoints: 0,
    interestPoints: 0,
    checked: false,
    ...options,
  };
}

function createVariantSkill(groupId: string, index: number, options: Partial<Skill> = {}): Skill {
  const group = EXPANDABLE_GROUP_MAP[groupId];

  return createSkill(`${groupId}_${index}`, `${group.label}${toCircledNumber(index)}`, group.baseValue, group.category, {
    subName: "",
    variantGroup: group.id,
    variantBaseName: group.label,
    ...options,
  });
}

export function createDynamicSkillVariant(groupId: string, index: number): Skill {
  const group = EXPANDABLE_GROUP_MAP[groupId];
  if (!group) {
    throw new Error(`Unknown expandable skill group: ${groupId}`);
  }

  return createSkill(`${groupId}_custom_${index}`, `${group.label}${toCircledNumber(index)}`, group.baseValue, group.category, {
    subName: "",
    variantGroup: group.id,
    variantBaseName: group.label,
  });
}

export function isExpandableSkillGroup(groupId: string): boolean {
  return groupId in EXPANDABLE_GROUP_MAP;
}

export function getExpandableSkillGroup(groupId: string): ExpandableSkillGroup | null {
  return EXPANDABLE_GROUP_MAP[groupId] ?? null;
}

export function getExpandableSkillGroupIdFromSkillId(skillId: string): string | null {
  for (const groupId of Object.keys(EXPANDABLE_GROUP_MAP)) {
    if (skillId === groupId || skillId.startsWith(`${groupId}_`)) {
      return groupId;
    }
  }

  return null;
}

export function formatSkillDisplayName(skill: Skill): string {
  const subName = skill.subName?.trim();
  const baseName = skill.variantBaseName ?? skill.name;

  if (!subName) {
    return skill.variantBaseName ? baseName : skill.name;
  }

  return `${baseName}：${subName}`;
}

export function hasAllocatedSkillValue(skill: Skill): boolean {
  return skill.growth > 0 || skill.occupationPoints > 0 || skill.interestPoints > 0;
}

function toCircledNumber(value: number): string {
  const digits = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
  return digits[value - 1] ?? ` ${value}`;
}

export const DEFAULT_SKILLS: Skill[] = [
  createSkill("accounting", "会计", 5, "学术"),
  createSkill("anthropology", "人类学", 1, "学术"),
  createSkill("appraise", "估价", 5, "调查"),
  createSkill("archaeology", "考古学", 1, "学术"),
  createVariantSkill("art_craft", 1),
  createVariantSkill("art_craft", 2),
  createSkill("charm", "取悦", 15, "交际"),
  createSkill("climb", "攀爬", 20, "行动"),
  createSkill("computer_use", "计算机使用", 5, "专业"),
  createSkill("credit_rating", "信用评级", 0, "特殊", { cannotAssignInterest: true }),
  createSkill("cthulhu_mythos", "克苏鲁神话", 0, "特殊", {
    cannotAssignOccupation: true,
    cannotAssignInterest: true,
  }),
  createSkill("disguise", "乔装", 5, "交际"),
  createSkill("dodge", "闪避", 0, "战斗"),
  createSkill("drive_auto", "汽车驾驶", 20, "行动"),
  createSkill("elec_repair", "电气维修", 10, "专业"),
  createSkill("electronics", "电子学", 1, "专业"),
  createSkill("fast_talk", "话术", 5, "交际"),
  createSkill("fighting_brawl", "格斗", 25, "战斗", { subName: "斗殴" }),
  createVariantSkill("fighting", 1),
  createVariantSkill("fighting", 2),
  createSkill("firearms_handgun", "射击", 20, "战斗", { subName: "手枪" }),
  createVariantSkill("firearms", 1),
  createVariantSkill("firearms", 2),
  createSkill("first_aid", "急救", 30, "调查"),
  createSkill("history", "历史", 5, "学术"),
  createSkill("intimidate", "恐吓", 15, "交际"),
  createSkill("jump", "跳跃", 20, "行动"),
  createVariantSkill("lang_other", 1),
  createVariantSkill("lang_other", 2),
  createSkill("lang_own", "母语", 0, "学术", { subName: "" }),
  createSkill("law", "法律", 5, "学术"),
  createSkill("library_use", "图书馆使用", 20, "调查"),
  createSkill("listen", "聆听", 20, "调查"),
  createSkill("locksmith", "锁匠", 1, "专业"),
  createSkill("mech_repair", "机械维修", 10, "专业"),
  createSkill("medicine", "医学", 1, "学术"),
  createSkill("natural_world", "博物学", 10, "学术"),
  createSkill("navigate", "导航", 10, "行动"),
  createSkill("occult", "神秘学", 5, "学术"),
  createSkill("heavy_machinery", "操作重型机械", 1, "专业"),
  createSkill("persuade", "说服", 10, "交际"),
  createVariantSkill("pilot", 1),
  createVariantSkill("pilot", 2),
  createSkill("psychoanalysis", "精神分析", 1, "学术"),
  createSkill("psychology", "心理学", 10, "调查"),
  createSkill("ride", "骑术", 5, "行动"),
  createVariantSkill("science", 1),
  createVariantSkill("science", 2),
  createSkill("sleight_of_hand", "妙手", 10, "专业"),
  createSkill("spot_hidden", "侦查", 25, "调查"),
  createSkill("stealth", "潜行", 20, "行动"),
  createSkill("survival", "生存", 10, "行动", { subName: "" }),
  createSkill("swim", "游泳", 20, "行动"),
  createSkill("throw", "投掷", 20, "战斗"),
  createSkill("track", "追踪", 10, "调查"),
  createSkill("animal_handling", "驯兽", 5, "专业"),
  createSkill("diving", "潜水", 1, "行动"),
  createSkill("explosives", "爆破", 1, "专业"),
  createSkill("lip_reading", "读唇", 1, "调查"),
  createSkill("hypnosis", "催眠", 1, "专业"),
  createSkill("artillery", "炮术", 1, "战斗"),
  createSkill("lore", "学问", 1, "学术", { subName: "" }),
  createSkill("custom_skill", "自定义技能", 0, "专业", { subName: "", isCustom: true }),
];

export function getComputedBaseValue(
  skillId: string,
  attributes: { DEX: number; EDU: number },
): number | null {
  switch (skillId) {
    case "dodge":
      return Math.floor(attributes.DEX / 2);
    case "lang_own":
      return attributes.EDU;
    default:
      return null;
  }
}
