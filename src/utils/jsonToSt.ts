/** 人物卡属性的类型。 */
interface CharacterAttributes {
  STR?: number;
  DEX?: number;
  POW?: number;
  CON?: number;
  APP?: number;
  EDU?: number;
  SIZ?: number;
  INT?: number;
  Luck?: number;
}

/** 技能的类型。 */
interface CharacterSkill {
  name?: string;
  baseValue?: number;
  growth?: number;
  occupationPoints?: number;
  interestPoints?: number;
  subName?: string;
}

/** 人物卡导出 JSON 的类型。 */
interface CharacterCardExport {
  attributes?: CharacterAttributes;
  skills?: CharacterSkill[];
}

/** 段定义。 */
interface SegmentDefinition {
  labels: string[];
  getValue: (card: CharacterCardExport) => number;
}

/** 属性段定义。 */
const ATTRIBUTE_SEGMENTS: SegmentDefinition[] = [
  { labels: ["力量", "str"], getValue: (card) => getRequiredNumber(card.attributes?.STR, "attributes.STR") },
  { labels: ["敏捷", "dex"], getValue: (card) => getRequiredNumber(card.attributes?.DEX, "attributes.DEX") },
  { labels: ["意志", "pow"], getValue: (card) => getRequiredNumber(card.attributes?.POW, "attributes.POW") },
  { labels: ["体质", "con"], getValue: (card) => getRequiredNumber(card.attributes?.CON, "attributes.CON") },
  { labels: ["外貌", "app"], getValue: (card) => getRequiredNumber(card.attributes?.APP, "attributes.APP") },
  { labels: ["教育", "edu"], getValue: (card) => getRequiredNumber(card.attributes?.EDU, "attributes.EDU") },
  { labels: ["体型", "siz"], getValue: (card) => getRequiredNumber(card.attributes?.SIZ, "attributes.SIZ") },
  { labels: ["智力", "灵感", "int"], getValue: (card) => getRequiredNumber(card.attributes?.INT, "attributes.INT") },
  {
    labels: ["san", "san值", "理智", "理智值"],
    // 参考示例指令，这里导出的是角色卡基础理智值，而不是 currentStatus 里的临时当前值。
    getValue: (card) => getRequiredNumber(card.attributes?.POW, "attributes.POW")
  },
  { labels: ["幸运", "运气"], getValue: (card) => getRequiredNumber(card.attributes?.Luck, "attributes.Luck") },
  {
    labels: ["mp", "魔法"],
    getValue: (card) => Math.floor(getRequiredNumber(card.attributes?.POW, "attributes.POW") / 5)
  },
  {
    labels: ["hp", "体力"],
    getValue: (card) => {
      const con = getRequiredNumber(card.attributes?.CON, "attributes.CON");
      const siz = getRequiredNumber(card.attributes?.SIZ, "attributes.SIZ");
      return Math.floor((con + siz) / 10);
    }
  }
];

/**
 * 将车卡项目导出的 JSON 字符串转换成骰娘可用的 `.st` 指令。
 *
 * 规则：
 * 1. 固定属性会按示例中的顺序输出，并补上常见的中英文别名。
 * 2. 技能值会使用 `baseValue + growth + occupationPoints + interestPoints`。
 * 3. 技能存在非空 `subName` 时，优先使用 `subName` 作为指令中的技能名。
 * 4. 总值小于等于 0 的技能会被跳过，避免把无意义的 0 值写入指令。
 */
export function convertCharacterJsonToSt(jsonText: string): string {
  // 解析 反序列化 JSON 字符串。
  const card = parseCharacterCard(jsonText);

  // 构建属性段。
  const attributeSegments = ATTRIBUTE_SEGMENTS.map((segment) =>
    buildLabelsSegment(segment.labels, segment.getValue(card))
  );

  // 构建技能段。
  const skillSegments = (card.skills ?? [])
    .map((skill) => {
      // 总值小于等于 0 的技能会被跳过
      const total = getSkillTotal(skill);
      if (total <= 0) {
        return "";
      }

      const skillName = getSkillDisplayName(skill);
      if (!skillName) {
        return "";
      }

      return `${skillName}${total}`;
    })
    .filter(Boolean);

  // 合并属性段和技能段，并返回结果。
  return `.st ${[...attributeSegments, ...skillSegments].join("")}`;
}

/**
 * 解析人物卡导出 JSON 字符串。
 * @param jsonText - 人物卡导出 JSON 字符串。
 * @returns 解析后的人物卡导出对象。
 */
function parseCharacterCard(jsonText: string): CharacterCardExport {
  try {
    console.log("parseCharacterCard ===>", jsonText)
    const parsed = JSON.parse(jsonText) as CharacterCardExport;
    if (!parsed || typeof parsed !== "object") {
      throw new Error("JSON 根节点不是对象。");
    }

    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    throw new Error(`无法解析人物卡 JSON：${message}`);
  }
}

/**
 * 获取必需的数值。
 * @param value - 数值。
 * @param fieldName - 字段名。
 * @returns 必需的数值。
 */
function getRequiredNumber(value: number | undefined, fieldName: string): number {
  // 如果数值不是数字或 NaN，则抛出错误。
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`人物卡缺少有效数值字段：${fieldName}`);
  }

  return Math.trunc(value);
}

/**
 * 构建标签段。
 * @param labels - 标签。
 * @param value - 数值。
 * @returns 标签段。
 */
function buildLabelsSegment(labels: string[], value: number): string {
  return labels.map((label) => `${label}${value}`).join("");
}

/**
 * 获取技能显示名称。
 * @param skill - 技能。
 * @returns 技能显示名称。
 */
function getSkillDisplayName(skill: CharacterSkill): string {
  const subName = skill.subName?.trim();
  if (subName) {
    return subName;
  }

  const rawName = skill.name?.trim() ?? "";

  // “技能① / 技能② / 技能③”在骰娘指令中只保留基础名称。
  return rawName.replace(/[①②③]$/u, "").trim();
}

/**
 * 获取技能总值。
 * @param skill - 技能。
 * @returns 技能总值。
 */
function getSkillTotal(skill: CharacterSkill): number {
  return [
    skill.baseValue ?? 0,
    skill.growth ?? 0,
    skill.occupationPoints ?? 0,
    skill.interestPoints ?? 0
  ].reduce((sum, value) => sum + value, 0);
}
