import type { Skill, SkillCategory } from "@/types/character";

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

export const DEFAULT_SKILLS: Skill[] = [
  createSkill("accounting", "会计", 5, "学术"),
  createSkill("anthropology", "人类学", 1, "学术"),
  createSkill("appraise", "估价", 5, "调查"),
  createSkill("archaeology", "考古学", 1, "学术"),
  createSkill("art_craft_1", "技艺①", 5, "专业", { subName: "" }),
  createSkill("art_craft_2", "技艺②", 5, "专业", { subName: "" }),
  createSkill("art_craft_3", "技艺③", 5, "专业", { subName: "" }),
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
  createSkill("fighting_brawl", "格斗：斗殴", 25, "战斗", { subName: "斗殴" }),
  createSkill("fighting_1", "格斗①", 0, "战斗", { subName: "" }),
  createSkill("fighting_2", "格斗②", 0, "战斗", { subName: "" }),
  createSkill("fighting_3", "格斗③", 0, "战斗", { subName: "" }),
  createSkill("firearms_handgun", "射击：手枪", 20, "战斗", { subName: "手枪" }),
  createSkill("firearms_1", "射击①", 0, "战斗", { subName: "" }),
  createSkill("firearms_2", "射击②", 0, "战斗", { subName: "" }),
  createSkill("firearms_3", "射击③", 0, "战斗", { subName: "" }),
  createSkill("first_aid", "急救", 30, "调查"),
  createSkill("history", "历史", 5, "学术"),
  createSkill("intimidate", "恐吓", 15, "交际"),
  createSkill("jump", "跳跃", 20, "行动"),
  createSkill("lang_other_1", "外语①", 1, "学术", { subName: "" }),
  createSkill("lang_other_2", "外语②", 1, "学术", { subName: "" }),
  createSkill("lang_other_3", "外语③", 1, "学术", { subName: "" }),
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
  createSkill("pilot", "驾驶：", 1, "专业", { subName: "" }),
  createSkill("psychoanalysis", "精神分析", 1, "学术"),
  createSkill("psychology", "心理学", 10, "调查"),
  createSkill("ride", "骑术", 5, "行动"),
  createSkill("science_1", "科学①", 1, "学术", { subName: "" }),
  createSkill("science_2", "科学②", 1, "学术", { subName: "" }),
  createSkill("science_3", "科学③", 1, "学术", { subName: "" }),
  createSkill("sleight_of_hand", "妙手", 10, "专业"),
  createSkill("spot_hidden", "侦查", 25, "调查"),
  createSkill("stealth", "潜行", 20, "行动"),
  createSkill("survival", "生存：", 10, "行动", { subName: "" }),
  createSkill("swim", "游泳", 20, "行动"),
  createSkill("throw", "投掷", 20, "战斗"),
  createSkill("track", "追踪", 10, "调查"),
  createSkill("animal_handling", "驯兽", 5, "专业"),
  createSkill("diving", "潜水", 1, "行动"),
  createSkill("explosives", "爆破", 1, "专业"),
  createSkill("lip_reading", "读唇", 1, "调查"),
  createSkill("hypnosis", "催眠", 1, "专业"),
  createSkill("artillery", "炮术", 1, "战斗"),
  createSkill("lore", "学问：", 1, "学术", { subName: "" }),
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
