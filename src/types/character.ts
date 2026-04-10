/* ============================================================
   TypeScript 类型定义 — CoC 7th 人物卡数据模型
   ============================================================ */

/** 八大核心属性 + 幸运 */
export interface Attributes {
  STR: number; // 力量
  DEX: number; // 敏捷
  POW: number; // 意志
  CON: number; // 体质
  APP: number; // 外貌
  EDU: number; // 教育
  SIZ: number; // 体型
  INT: number; // 智力/灵感
  Luck: number; // 幸运
}

export type AttributeKey = keyof Attributes;

/** 调查员基础个人信息 */
export interface InvestigatorInfo {
  name: string;       // 姓名
  player: string;     // 玩家
  age: number | '';    // 年龄
  era: string;        // 时代
  occupation: string; // 职业
  occupationId: number | ''; // 职业序号
  gender: string;     // 性别/性取向
  nationality: string;// 国籍
  residence: string;  // 住地
  birthplace: string; // 故乡
  portrait: string;   // 头像 URL（可选）
}

/** 衍生状态 (自动计算，不可手动输入) */
export interface DerivedStats {
  maxHP: number;        // (CON + SIZ) / 10 取整
  maxMP: number;        // POW / 5 取整
  maxSAN: number;       // 99 - 克苏鲁神话技能
  MOV: number;          // 移动力
  damageBonus: string;  // 伤害加值 (e.g. "-1", "0", "+1D4")
  build: number;        // 体格
  majorWound: number;   // 重伤值 = ceil(maxHP / 2)
}

/** 当前变动状态 */
export interface CurrentStatus {
  currentHP: number;
  currentMP: number;
  currentSAN: number;
  tempHP: number;        // 临时体力值
  todaySANLoss: number;  // 今日SAN损失
  usedMP: number;        // 已使用魔法值
  conditions: {
    majorWound: boolean;      // 重伤
    unconscious: boolean;     // 昏迷
    dying: boolean;           // 濒死
    tempInsanity: boolean;    // 临时疯狂
    indefInsanity: boolean;   // 不定性疯狂
    permInsanity: boolean;    // 永久疯狂
  };
}

/** 单项技能 */
export interface Skill {
  id: string;
  name: string;           // 技能名称
  subName?: string;        // 子技能名称 (例如：外语① → 英语)
  category: SkillCategory;
  baseValue: number;       // 初始值
  growth: number;          // 成长/经历
  occupationPoints: number;// 职业点
  interestPoints: number;  // 兴趣点
  isCustom?: boolean;      // 是否为自定义技能
  cannotAssignOccupation?: boolean; // 不能分配职业点 (克苏鲁神话)
  cannotAssignInterest?: boolean;   // 不能分配兴趣点 (克苏鲁神话)
  checked: boolean;        // 成长标记 ☐ / ☑
}

export type SkillCategory =
  | '战斗'
  | '交际'
  | '调查'
  | '学术'
  | '行动'
  | '专业'
  | '特殊';

/** 武器条目 */
export interface Weapon {
  id: string;
  name: string;
  type: string;        // 肉搏 / 射击
  skill: string;       // 使用技能
  damage: string;      // 伤害公式
  range: string;       // 射程
  penetration: boolean;// 穿刺
  attacksPerRound: number; // 每轮次数
  ammo: string;        // 装弹量
  malfunction: string; // 故障值
}

/** 随身物品 */
export interface InventoryItem {
  id: string;
  name: string;
  status: string;     // 状态
  location: string;   // 部位/背包
}

/** 资产信息 */
export interface Assets {
  creditRating: number;
  livingStandard: string;
  spendingLevel: string;
  otherAssets: string;
  currentCash: number;
  currency: string;
  vehicles: string;
  residences: string;
  luxuries: string;
  securities: string;
  other: string;
}

/** 背景故事 */
export interface Backstory {
  personalDescription: string;  // 个人描述/角色外貌
  ideologyBeliefs: string;      // 思想与信念
  significantPeople: string;    // 重要之人
  meaningfulLocations: string;  // 意义非凡之地
  treasuredPossessions: string; // 宝贵之物
  traits: string;               // 特质
  injuriesScars: string;        // 伤口和疤痕
  phobiasManias: string;        // 恐惧症和狂躁症
  keyConnection: boolean[];     // 是否为关键连接 [对应6个背景条目]
}

/** 法术记录 */
export interface Spell {
  id: string;
  number: string;     // 编号
  name: string;       // 法术名称
  cost: string;       // 使用代价
  effect: string;     // 作用
}

/** 模组经历 */
export interface ModuleExperience {
  id: string;
  moduleName: string;
  changes: string;
}

/** 神话遭遇 */
export interface MythosEncounter {
  id: string;
  encountered: string;  // 遇到了
  result: string;       // 获得的结果
  notes: string;        // 备注
  cumulative: number;   // 累计
}

/** 完整的角色数据 */
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
}
