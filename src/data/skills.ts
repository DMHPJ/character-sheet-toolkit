/**
 * CoC 7th 标准技能初始数据
 * 包含所有基础技能及其默认初始值
 */
import type { Skill, SkillCategory } from '@/types/character';

/** 创建一个技能条目的快捷工厂函数 */
function s(
  id: string,
  name: string,
  baseValue: number,
  category: SkillCategory,
  options: Partial<Skill> = {}
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

/** 全部标准技能的初始数据列表 */
export const DEFAULT_SKILLS: Skill[] = [
  // ---- 左侧列技能 (原表 B16~B49 区域) ----
  s('accounting',      '会计',         5,   '学术'),
  s('anthropology',    '人类学',       1,   '学术'),
  s('appraise',        '估价',         5,   '调查'),
  s('archaeology',     '考古学',       1,   '学术'),
  s('art_craft_1',     '技艺①',        5,   '专业', { subName: '伪造' }),
  s('art_craft_2',     '技艺②',        5,   '专业', { subName: '' }),
  s('art_craft_3',     '技艺③',        5,   '专业', { subName: '' }),
  s('charm',           '取悦',         15,  '交际'),
  s('climb',           '攀爬',         20,  '行动'),
  s('computer_use',    '计算机使用 Ω', 5,   '专业'),
  s('credit_rating',   '信用评级',     0,   '特殊', { cannotAssignInterest: false }),
  s('cthulhu_mythos',  '克苏鲁神话',   0,   '特殊', {
    cannotAssignOccupation: true,
    cannotAssignInterest: true,
  }),
  s('disguise',        '乔装',         5,   '交际'),
  s('dodge',           '闪避',         0,   '战斗'),   // 初始值 = DEX/2，在 Store 中计算
  s('drive_auto',      '汽车驾驶',     20,  '行动'),
  s('elec_repair',     '电气维修',     10,  '专业'),
  s('electronics',     '电子学 Ω',     1,   '专业'),
  s('fast_talk',       '话术',         5,   '交际'),
  s('fighting_brawl',  '格斗：斗殴',   25,  '战斗', { subName: '斗殴' }),
  s('fighting_1',      '格斗①',        0,   '战斗', { subName: '' }),
  s('fighting_2',      '格斗②',        0,   '战斗', { subName: '' }),
  s('fighting_3',      '格斗③',        0,   '战斗', { subName: '' }),
  s('firearms_handgun','射击：手枪',    20,  '战斗', { subName: '手枪' }),
  s('firearms_1',      '射击①',        0,   '战斗', { subName: '' }),
  s('firearms_2',      '射击②',        0,   '战斗', { subName: '' }),
  s('firearms_3',      '射击③',        0,   '战斗', { subName: '' }),
  s('first_aid',       '急救',         30,  '调查'),
  s('history',         '历史',         5,   '学术'),
  s('intimidate',      '恐吓',         15,  '交际'),
  s('jump',            '跳跃',         20,  '行动'),
  s('lang_other_1',    '外语①',        1,   '学术', { subName: '' }),
  s('lang_other_2',    '外语②',        1,   '学术', { subName: '' }),
  s('lang_other_3',    '外语③',        1,   '学术', { subName: '' }),
  s('lang_own',        '母语',         0,   '学术', { subName: '' }), // 初始值 = EDU

  // ---- 右侧列技能 (原表 AB16~AB49 区域) ----
  s('law',             '法律',         5,   '学术'),
  s('library_use',     '图书馆使用',   20,  '调查'),
  s('listen',          '聆听',         20,  '调查'),
  s('locksmith',       '锁匠',         1,   '专业'),
  s('mech_repair',     '机械维修',     10,  '专业'),
  s('medicine',        '医学',         1,   '学术'),
  s('natural_world',   '博物学',       10,  '学术'),
  s('navigate',        '导航',         10,  '行动'),
  s('occult',          '神秘学',       5,   '学术'),
  s('heavy_machinery', '操作重型机械', 1,   '专业'),
  s('persuade',        '说服',         10,  '交际'),
  s('pilot',           '驾驶：',       1,   '专业', { subName: '' }),
  s('psychoanalysis',  '精神分析',     1,   '学术'),
  s('psychology',      '心理学',       10,  '调查'),
  s('ride',            '骑术',         5,   '行动'),
  s('science_1',       '科学①',        1,   '学术', { subName: '' }),
  s('science_2',       '科学②',        1,   '学术', { subName: '' }),
  s('science_3',       '科学③',        1,   '学术', { subName: '' }),
  s('sleight_of_hand', '妙手',         10,  '专业'),
  s('spot_hidden',     '侦查',         25,  '调查'),
  s('stealth',         '潜行',         20,  '行动'),
  s('survival',        '生存：',       10,  '行动', { subName: '' }),
  s('swim',            '游泳',         20,  '行动'),
  s('throw',           '投掷',         20,  '战斗'),
  s('track',           '追踪',         10,  '调查'),
  s('animal_handling', '驯兽',         5,   '专业'),
  s('diving',          '潜水',         1,   '行动'),
  s('explosives',      '爆破',         1,   '专业'),
  s('lip_reading',     '读唇',         1,   '调查'),
  s('hypnosis',        '催眠',         1,   '专业'),
  s('artillery',       '炮术',         1,   '战斗'),
  s('lore',            '学问：',       1,   '学术', { subName: '' }),
  s('custom_skill',    '自定义技能',   0,   '专业', { subName: '', isCustom: true }),
];

/**
 * 获取需要动态初始值的技能
 * dodge → DEX / 2
 * lang_own → EDU
 */
export function getComputedBaseValue(
  skillId: string,
  attributes: { DEX: number; EDU: number }
): number | null {
  switch (skillId) {
    case 'dodge':
      return Math.floor(attributes.DEX / 2);
    case 'lang_own':
      return attributes.EDU;
    default:
      return null;
  }
}
