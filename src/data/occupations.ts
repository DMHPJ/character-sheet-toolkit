import type {
  AttributeKey,
  Attributes,
  OccupationChoiceGroup,
  OccupationDefinition,
  OccupationSkillOption,
  OccupationState,
} from "@/types/character";

function skill(
  skillId: string,
  label: string,
  subName?: string,
): OccupationSkillOption {
  return {
    id: `${skillId}:${subName ?? label}`,
    skillId,
    label,
    subName,
  };
}

function predefinedGroup(
  id: string,
  label: string,
  count: number,
  options: OccupationSkillOption[],
): OccupationChoiceGroup {
  return {
    id,
    label,
    count,
    mode: "predefined",
    options,
  };
}

function anySkillGroup(
  id: string,
  label: string,
  count: number,
  options: OccupationSkillOption[],
): OccupationChoiceGroup {
  return {
    id,
    label,
    count,
    mode: "any",
    options,
  };
}

const SOCIAL_OPTIONS = [
  skill("charm", "取悦"),
  skill("fast_talk", "话术"),
  skill("intimidate", "恐吓"),
  skill("persuade", "说服"),
];

const FIREARM_OPTIONS = [
  skill("firearms_handgun", "射击", "手枪"),
  skill("firearms_1", "射击", "步枪/霰弹枪"),
  skill("firearms_2", "射击", "冲锋枪"),
  skill("firearms_3", "射击", "弓弩"),
];

const FIGHTING_OPTIONS = [
  skill("fighting_brawl", "格斗", "斗殴"),
  skill("fighting_1", "格斗", "剑术"),
  skill("fighting_2", "格斗", "长鞭"),
  skill("fighting_3", "格斗", "绞索"),
];

const ART_OPTIONS = [
  skill("art_craft_1", "技艺（自定义 1）"),
  skill("art_craft_2", "技艺（自定义 2）"),
  skill("art_craft_3", "技艺（自定义 3）"),
];

const PILOT_OPTIONS = [
  skill("pilot_1", "驾驶（自定义 1）"),
  skill("pilot_2", "驾驶（自定义 2）"),
  skill("pilot_3", "驾驶（自定义 3）"),
];

const SCIENCE_OPTIONS = [
  skill("science_1", "科学（自定义 1）"),
  skill("science_2", "科学（自定义 2）"),
  skill("science_3", "科学（自定义 3）"),
];

const LANGUAGE_OPTIONS = [
  skill("lang_other_1", "外语（自定义 1）"),
  skill("lang_other_2", "外语（自定义 2）"),
  skill("lang_other_3", "外语（自定义 3）"),
];

const ANY_SKILL_OPTIONS = [
  skill("accounting", "会计"),
  skill("anthropology", "人类学"),
  skill("appraise", "估价"),
  skill("archaeology", "考古学"),
  ...ART_OPTIONS,
  skill("charm", "取悦"),
  skill("climb", "攀爬"),
  skill("computer_use", "计算机使用"),
  skill("disguise", "乔装"),
  skill("dodge", "闪避"),
  skill("drive_auto", "汽车驾驶"),
  skill("elec_repair", "电气维修"),
  skill("electronics", "电子学"),
  skill("fast_talk", "话术"),
  ...FIGHTING_OPTIONS,
  ...FIREARM_OPTIONS,
  skill("first_aid", "急救"),
  skill("history", "历史"),
  skill("intimidate", "恐吓"),
  skill("jump", "跳跃"),
  ...LANGUAGE_OPTIONS,
  skill("lang_own", "母语"),
  skill("law", "法律"),
  skill("library_use", "图书馆使用"),
  skill("listen", "聆听"),
  skill("locksmith", "锁匠"),
  skill("mech_repair", "机械维修"),
  skill("medicine", "医学"),
  skill("natural_world", "博物学"),
  skill("navigate", "导航"),
  skill("occult", "神秘学"),
  skill("heavy_machinery", "操作重型机械"),
  skill("persuade", "说服"),
  ...PILOT_OPTIONS,
  skill("psychoanalysis", "精神分析"),
  skill("psychology", "心理学"),
  skill("ride", "骑术"),
  ...SCIENCE_OPTIONS,
  skill("sleight_of_hand", "妙手"),
  skill("spot_hidden", "侦查"),
  skill("stealth", "潜行"),
  skill("survival", "生存（自定义）"),
  skill("swim", "游泳"),
  skill("throw", "投掷"),
  skill("track", "追踪"),
  skill("animal_handling", "驯兽"),
  skill("diving", "潜水"),
  skill("explosives", "爆破"),
  skill("lip_reading", "读唇"),
  skill("hypnosis", "催眠"),
  skill("artillery", "炮术"),
  skill("lore", "学问（自定义）"),
  skill("custom_skill", "自定义技能"),
];

const occupation = (
  id: number,
  name: string,
  creditRatingMin: number,
  creditRatingMax: number,
  fixed: { attribute: AttributeKey; multiplier: number }[],
  description: string,
  contacts: string,
  fixedSkills: OccupationSkillOption[],
  choiceGroups: OccupationChoiceGroup[] = [],
  chooseMax?: { attribute: AttributeKey; multiplier: number }[],
): OccupationDefinition => ({
  id,
  name,
  creditRatingMin,
  creditRatingMax,
  pointRule: {
    label: "",
    fixed,
    chooseMax,
  },
  fixedSkills,
  choiceGroups,
  contacts,
  description,
});

export const OCCUPATIONS: OccupationDefinition[] = [
  // TODO: 本职技能：会计，法律，图书馆，聆听，说服，侦查，任意其他两项个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    2,
    "会计师",
    30,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "企业会计或自由会计师，擅长从记录和账目中发现线索。",
    "生意伙伴、法律界、金融业界。",
    [
      skill("accounting", "会计"),
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("persuade", "说服"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "accountant-any",
        "任意其他两项个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),
  // TODO: 本职技能：攀爬，闪避，跳跃，投掷，侦查，游泳，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    3,
    "杂技演员",
    9,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "马戏团、嘉年华或竞技场上的灵活表演者。",
    "业余运动员圈、体育专栏作家、马戏团。",
    [
      skill("climb", "攀爬"),
      skill("dodge", "闪避"),
      skill("jump", "跳跃"),
      skill("throw", "投掷"),
      skill("spot_hidden", "侦查"),
      skill("swim", "游泳"),
    ],
    [
      anySkillGroup(
        "acrobat-any",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [{ attribute: "DEX", multiplier: 2 }],
  ),
  // TODO: 本职技能：技艺（表演），乔装，格斗，历史，两项社交技能（取悦、话术、恐吓、说服），心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌2 (=EDU*2+APP*2)
  occupation(
    4,
    "演员-戏剧演员",
    9,
    40,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "舞台剧演员，重视角色表达与戏剧训练。",
    "戏剧产业、报刊艺术批评家、演员公会。",
    [
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("disguise", "乔装"),
      skill("history", "历史"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("stage-fight", "选择一项格斗技能", 1, FIGHTING_OPTIONS),
      predefinedGroup("stage-social", "选择两项社交技能", 2, SOCIAL_OPTIONS),
      anySkillGroup(
        "stage-any",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),
  // TODO: 本职技能：技艺（表演），乔装，汽车驾驶，两项社交技能（取悦、话术、恐吓、说服），心理学，任意两项其他个人或时代特长（如骑乘或格斗）。
  // TODO: 职业属性：教育×2＋外貌2 (=EDU*2+APP*2)
  occupation(
    5,
    "演员-电影演员",
    20,
    90,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "电影演员，擅长镜头表现与公众形象经营。",
    "电影工作室、媒体评论员、作家。",
    [
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("disguise", "乔装"),
      skill("drive_auto", "汽车驾驶"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("film-social", "选择两项社交技能", 2, SOCIAL_OPTIONS),
      anySkillGroup(
        "film-any",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),
  // TODO: 本职技能：一项社交技能（取悦、话术、恐吓、说服），格斗（斗殴），射击，法律，图书馆，心理学，潜行，追踪。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    6,
    "事务所侦探/保安",
    20,
    45,
    [{ attribute: "EDU", multiplier: 2 }],
    "受雇进行调查或安保的专业人士。",
    "本地执法机构、客户。",
    [
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
      skill("track", "追踪"),
    ],
    [
      predefinedGroup(
        "detective-social",
        "选择一项社交技能",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup(
        "detective-fight",
        "选择一项格斗技能",
        1,
        FIGHTING_OPTIONS,
      ),
      predefinedGroup(
        "detective-firearm",
        "选择一项射击技能",
        1,
        FIREARM_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),
  // TODO: 本职技能：法律，聆听，医学，外语，精神分析，心理学，科学（生物学，化学）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    7,
    "精神病医生（古典）",
    10,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "研究与治疗精神失常的医学专家。",
    "精神病学者、医生、侦探。",
    [
      skill("law", "法律"),
      skill("listen", "聆听"),
      skill("medicine", "医学"),
      skill("lang_other_1", "外语", "拉丁语"),
      skill("psychoanalysis", "精神分析"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("alienist-science", "选择一项科学技能", 1, [
        skill("science_1", "科学", "生物学"),
        skill("science_2", "科学", "化学"),
      ]),
    ],
  ),
  // TODO: 本职技能：跳跃，聆听，自然，心理学，科学（动物学），潜行，追踪，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌或意志×2 (=EDU*2+MAX(APP*2,POW*2))
  occupation(
    8,
    "动物训练师",
    10,
    40,
    [{ attribute: "EDU", multiplier: 2 }],
    "长期与动物相处并进行行为训练的职业者。",
    "动物园、马戏团、赞助人、演员。",
    [
      skill("jump", "跳跃"),
      skill("listen", "聆听"),
      skill("natural_world", "博物学"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "动物学"),
      skill("stealth", "潜行"),
      skill("track", "追踪"),
    ],
    [
      anySkillGroup(
        "animal-any",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "POW", multiplier: 2 },
    ],
  ),
  // TODO: 本职技能：估价，技艺（任一），历史，图书馆，外语，一项社交技能（取悦、话术、恐吓、说服），侦查，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    9,
    "文物学家（原作向）",
    30,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "以收藏、研究与鉴别古老文物为乐的学者或收藏家。",
    "书商、古董收藏者、历史研究学会。",
    [
      skill("appraise", "估价"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("lang_other_1", "外语", "拉丁语"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("antiquarian-art", "选择一项技艺", 1, ART_OPTIONS),
      predefinedGroup(
        "antiquarian-social",
        "选择一项社交技能",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "antiquarian-any",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),
  // TODO: 本职技能：会计，估价，汽车驾驶，两项社交技能（取悦、话术、恐吓、说服），历史，图书馆，导航。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    10,
    "古董商",
    30,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "经营古董交易并具备广泛文物流通知识的商人。",
    "本地历史学家、其他古董商、赝造师。",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("drive_auto", "汽车驾驶"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("navigate", "导航"),
    ],
    [predefinedGroup("antique-social", "选择两项社交技能", 2, SOCIAL_OPTIONS)],
  ),
  // TODO: 本职技能：估价，考古，历史，外语，图书馆，侦查，机械维修，导航或科学（任一：如化学、物理、地理等）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    11,
    "考古学家（原作向）",
    10,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "兼具实地探索和文献研究能力的历史挖掘者。",
    "赞助人、博物馆、大学。",
    [
      skill("appraise", "估价"),
      skill("archaeology", "考古学"),
      skill("history", "历史"),
      skill("lang_other_1", "外语", "拉丁语"),
      skill("library_use", "图书馆使用"),
      skill("spot_hidden", "侦查"),
      skill("mech_repair", "机械维修"),
    ],
    [
      predefinedGroup("archaeology-last", "选择导航或一项科学技能", 1, [
        skill("navigate", "导航"),
        ...SCIENCE_OPTIONS,
      ]),
    ],
  ),
  // TODO: 本职技能：会计，技艺（技术制图），法律，母语，计算机或图书馆，说服，心理学，科学（数学）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    12,
    "建筑师",
    30,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "掌握设计、制图、规划法规与工程沟通的专业人士。",
    "建设和城市规划部门、建筑公司。",
    [
      skill("accounting", "会计"),
      skill("art_craft_1", "技艺", "技术制图"),
      skill("law", "法律"),
      skill("lang_own", "母语"),
      skill("persuade", "说服"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "数学"),
    ],
    [
      predefinedGroup("architect-last", "选择计算机使用或图书馆使用", 1, [
        skill("computer_use", "计算机使用"),
        skill("library_use", "图书馆使用"),
      ]),
    ],
  ),
  // TODO: 本职技能：技艺（任一），历史或自然，一项社交技能（取悦、话术、恐吓、说服），外语，心理学，侦查，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷或意志×2 (=EDU*2+MAX(DEX*2,POW*2))
  occupation(
    13,
    "艺术家",
    9,
    50,
    [{ attribute: "EDU", multiplier: 2 }],
    "靠创作、表现和审美敏感度谋生的艺术从业者。",
    "美术馆、美术批评家、富有赞助人。",
    [
      skill("lang_other_1", "外语", "法语"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("artist-art", "选择一项技艺", 1, ART_OPTIONS),
      predefinedGroup("artist-history", "选择历史或博物学", 1, [
        skill("history", "历史"),
        skill("natural_world", "博物学"),
      ]),
      predefinedGroup("artist-social", "选择一项社交技能", 1, SOCIAL_OPTIONS),
      anySkillGroup(
        "artist-any",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "DEX", multiplier: 2 },
      { attribute: "POW", multiplier: 2 },
    ],
  ),
  // TODO: 本职技能：闪避，格斗（斗殴），急救，两项社交技能（取悦、话术、恐吓、说服），聆听，心理学，潜行。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    14,
    "精神病院看护",
    8,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "在精神病院负责照看、约束与辅助病患的工作人员。",
    "医护人员、患者和患者家属。",
    [
      skill("dodge", "闪避"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("first_aid", "急救"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
    ],
    [predefinedGroup("asylum-social", "选择两项社交技能", 2, SOCIAL_OPTIONS)],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),
  // TODO: 本职技能：攀爬，跳跃，格斗（斗殴），骑乘，一项社交技能（取悦、话术、恐吓、说服），游泳，投掷，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    15,
    "运动员",
    9,
    70,
    [{ attribute: "EDU", multiplier: 2 }],
    "职业或业余运动员，依赖身体素质和公众影响力。",
    "体育界、体育专栏作家、其他明星。",
    [
      skill("climb", "攀爬"),
      skill("jump", "跳跃"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("ride", "骑术"),
      skill("swim", "游泳"),
      skill("throw", "投掷"),
    ],
    [
      predefinedGroup("athlete-social", "选择一项社交技能", 1, SOCIAL_OPTIONS),
      anySkillGroup(
        "athlete-any",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),
  // TODO: 本职技能：技艺（文学），历史，图书馆，自然或神秘学，外语，母语，心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    16,
    "作家（原作向）",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "以写作为核心工作，兼具调查取材与心理观察能力。",
    "出版社、文学评论家、历史学家。",
    [
      skill("art_craft_1", "技艺（文学）", "文学"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("lang_other_1", "外语", "法语"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("writer-middle", "选择博物学或神秘学", 1, [
        skill("natural_world", "博物学"),
        skill("occult", "神秘学"),
      ]),
      anySkillGroup(
        "writer-any",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),
  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），格斗（斗殴），聆听，心理学，侦查，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    17,
    "酒保",
    8,
    25,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "以待客、听取消息和维护场面为主的酒吧从业者。",
    "常客、可能有犯罪组织。",
    [
      skill("accounting", "会计"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "bartender-social",
        "选择两项社交技能",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "bartender-any",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),
  // TODO: 本职技能：射击，聆听或侦查，自然，导航，外语或生存（任一），科学（生物学或植物学），潜行，追踪。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    18,
    "猎人",
    20,
    50,
    [{ attribute: "EDU", multiplier: 2 }],
    "追踪、狩猎与野外生存经验丰富的职业猎手。",
    "外国官员、监管人员、前客户、黑市商人。",
    [
      skill("natural_world", "博物学"),
      skill("navigate", "导航"),
      skill("stealth", "潜行"),
      skill("track", "追踪"),
    ],
    [
      predefinedGroup("hunter-firearm", "选择一项射击技能", 1, FIREARM_OPTIONS),
      predefinedGroup("hunter-listen", "选择聆听或侦查", 1, [
        skill("listen", "聆听"),
        skill("spot_hidden", "侦查"),
      ]),
      predefinedGroup("hunter-lang", "选择外语或生存", 1, [
        skill("lang_other_1", "外语", "英语"),
        skill("survival", "生存", "森林"),
      ]),
      predefinedGroup(
        "hunter-science",
        "选择科学（生物学）或科学（植物学）",
        1,
        [
          skill("science_1", "科学", "生物学"),
          skill("science_1", "科学", "植物学"),
        ],
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),
  // TODO: 本职技能：会计，估价，汽车驾驶，历史，图书馆，母语，外语，一项社交技能（取悦、话术、恐吓、说服）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    19,
    "书商",
    20,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "经营书籍流通并熟悉目录学、估价与收藏市场的人。",
    "目录学家、其他书商、图书馆和大学、客户。",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("drive_auto", "汽车驾驶"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("lang_own", "母语"),
      skill("lang_other_1", "外语", "拉丁语"),
    ],
    [
      predefinedGroup(
        "bookseller-social",
        "选择一项社交技能",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
  ),
  // TODO: 本职技能：汽车驾驶，电子学或电气维修，格斗或射击，一项社交技能（取悦、话术、恐吓、说服），法律，心理学，追踪，潜行。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    20,
    "赏金猎人",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "通过追捕逃犯或完成委托来赚钱的强硬调查者。",
    "保释业者、本地警察、线人。",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("law", "法律"),
      skill("psychology", "心理学"),
      skill("track", "追踪"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup("bounty-tech", "选择电子学或电气维修", 1, [
        skill("electronics", "电子学"),
        skill("elec_repair", "电气维修"),
      ]),
      predefinedGroup("bounty-combat", "选择格斗或射击", 1, [
        ...FIGHTING_OPTIONS,
        ...FIREARM_OPTIONS,
      ]),
      predefinedGroup("bounty-social", "选择一项社交技能", 1, SOCIAL_OPTIONS),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),
  // TODO: 本职技能：闪避，格斗（斗殴），恐吓，跳跃，心理学，侦查，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2+力量×2 (=EDU*2+STR*2)
  occupation(
    21,
    "拳击手/摔跤手",
    9,
    60,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "STR", multiplier: 2 },
    ],
    "依靠身体对抗能力与比赛声望谋生的职业格斗选手。",
    "运动会主办者、记者、犯罪组织、训练人员。",
    [
      skill("dodge", "闪避"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("intimidate", "恐吓"),
      skill("jump", "跳跃"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "fighter-any",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),
  // TODO: 本职技能：会计或估价，技艺（任一：如烹饪、裁缝、理发），急救，聆听，外语，心理学，侦查，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    22,
    "管家/男仆/女仆",
    9,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "服务于雇主家庭或庄园，兼具事务管理与照料能力。",
    "雇主、其他仆役、家庭成员。",
    [
      skill("first_aid", "急救"),
      skill("listen", "聆听"),
      skill("lang_other_1", "外语", "法语"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("servant-finance", "选择会计或估价", 1, [
        skill("accounting", "会计"),
        skill("appraise", "估价"),
      ]),
      predefinedGroup("servant-craft", "选择一项技艺", 1, [
        skill("art_craft_1", "技艺", "烹饪"),
        skill("art_craft_2", "技艺", "裁缝"),
        skill("art_craft_3", "技艺", "理发"),
      ]),
      anySkillGroup(
        "servant-any",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),
  // TODO: 本职技能：计算机，电气维修，电子学、图书馆，科学（数学），侦查，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    24,
    "程序员/电子工程师（现代）",
    10,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "从事程序开发、系统维护或电子工程的现代技术人员。",
    "其他 IT 工作者、同事和上司、专业网络社区。",
    [
      skill("computer_use", "计算机使用"),
      skill("elec_repair", "电气维修"),
      skill("electronics", "电子学"),
      skill("library_use", "图书馆使用"),
      skill("science_1", "科学", "数学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "programmer-any",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),
  // TODO: 本职技能：会计，历史，图书馆，聆听，外语，一项社交技能（取悦、话术、恐吓、说服），心理学，任意一项其他技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    23,
    "神职人员",
    9,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "神职人员通常担任一个教区的牧师，或是经过分配外出传教，尤其是去国外(见传教士)。\n不同的教会工作的侧重点和组织结构各不相同，如天主教会的牧师可能上升到主教、大主教和红衣主教，而一个卫理公会的牧师则会升职到教区主管和主教。\n许多神职人员都接受忏悔(不仅仅是天主教)。虽然不能透露忏悔的内容，但是要怎样利用它们就全凭他们自己了。\n有些教职人员在教堂接受医生、律师、学者的专业培训。这样的调查员应该选择最符合自己工作的职业模板。",
    "教会高层、地方教会、小区领导。",
    [
      skill("accounting", "会计"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-23-lang-1", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-23-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-23-any-3", "任意一项其他技能", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：计算机，电气维修，电子学，图书馆，侦查，一项社交技能（取悦、话术、恐吓、说服），任意两项其他技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    25,
    "黑客/骇客（现代）",
    10,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "计算器黑客利用计算器和计算器网络为手段，进行干扰或破坏以达成政治目的(有时被称为“政治黑客”)或获取非法利益。达成目标的手段主要是非法入侵计算器和其他用户帐户，目的则可能包括篡改网页、人肉搜索、盗取身份信息、垃圾邮件炸弹、拒绝服务攻击等等。",
    "其他IT 工作者，专业网络小区，政治团体，犯罪组织。",
    [
      skill("computer_use", "计算机使用"),
      skill("elec_repair", "电气维修"),
      skill("electronics", "电子学"),
      skill("library_use", "图书馆使用"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-25-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-25-any-2", "任意两项其他技能", 2, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：闪避，格斗或射击，急救或自然，跳跃，骑乘，生存（任一），投掷，追踪。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    26,
    "牛仔",
    9,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "牛仔在西部的牧区和牧场工作。有些人拥有自己的牧场，更多的则是在各处打工为生。想赚大钱的牛仔会去冒着丢胳膊少腿乃至送命的危险参加牛仔巡回赛，通过旅行获取名誉。\n在1920 年代，一些牛仔能在好莱坞找到西部片替身演员和群众演员的工作，例如怀特·厄普就曾为西部电影担任顾问。在现代，有些牧场也对想要体验一把牛仔生活的游客开放。",
    "本地企业家，州农业部门，牛仔比赛主办者，艺人。",
    [
      skill("dodge", "闪避"),
      skill("jump", "跳跃"),
      skill("ride", "骑术"),
      skill("throw", "投掷"),
      skill("track", "追踪"),
    ],
    [
      predefinedGroup("occ-26-choice-1", "格斗或射击", 1, [
        skill("fighting_brawl", "格斗", "斗殴"),
        skill("fighting_1", "格斗", "自定义"),
        skill("firearms_handgun", "射击", "手枪"),
        skill("firearms_1", "射击", "步枪/霰弹枪"),
      ]),
      predefinedGroup("occ-26-choice-2", "急救或自然", 1, [
        skill("first_aid", "急救"),
        skill("natural_world", "博物学"),
      ]),
      predefinedGroup("occ-26-survival-3", "生存（任一）", 1, [
        skill("survival", "生存", "森林"),
        skill("survival", "生存", "海上"),
        skill("survival", "生存", "荒野"),
      ]),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，技艺（任二），机械维修，自然，侦查，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    27,
    "工匠",
    10,
    10,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "工匠也可能被人叫做师傅或大师，是擅长对各种材料进行手工加工的人。通常都是才能出众的人，有的凭借自己的艺术作品出名，有的则会服务于自己的小区。\n可能的行当包括：家具、珠宝、钟表、陶艺、锻造、纺织、书法、裁缝、木工、书籍装裱、玩具制造、彩色玻璃吹制等等。",
    "本地商人，其他工匠和艺术家。",
    [
      skill("accounting", "会计"),
      skill("mech_repair", "机械维修"),
      skill("natural_world", "博物学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-27-art-1", "技艺（任二）", 2, ART_OPTIONS),
      anySkillGroup(
        "occ-27-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：乔装，电气维修，格斗，射击，锁匠，机械维修，潜行，心理学。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    28,
    "罪犯-刺客",
    30,
    60,
    [{ attribute: "EDU", multiplier: 2 }],
    "杀手是地下世界的冷血夺命者。这是一项严谨的活计，他们从外地受雇杀人，接近目标，果断下手，又迅速离开。杀手通常很难融入社会，因为很多杀手行为总是很刻板，其他人很容易以为他们不近人情。但是另一方面，他们也会结婚生子，在其他方面和普通人没有什么不同。",
    "很少，大都是黑社会的人，人们尽量避免和他们交情过深。",
    [
      skill("disguise", "乔装"),
      skill("elec_repair", "电气维修"),
      skill("locksmith", "锁匠"),
      skill("mech_repair", "机械维修"),
      skill("stealth", "潜行"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-28-fight-1", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-28-firearm-2", "射击", 1, FIREARM_OPTIONS),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：汽车驾驶，电气维修或机械维修，格斗，射击，恐吓，锁匠，操作重型机械，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    29,
    "罪犯-银行劫匪",
    5,
    75,
    [{ attribute: "EDU", multiplier: 2 }],
    "罪犯的体格和相貌形形色色，有些是纯粹碰运气伺机行事，比如扒手和暴徒；有些则组成分工明确，会详细调查并制定计划的犯罪组织。后者包括银行劫匪、飞贼、赝造者和诈骗者。\n罪犯可能为别人工作，后者通常是“匪帮”或罪犯家族；也可能单打独斗，如果成功的报酬值得去费力冒险，才会和别人搭伙。自由犯罪者则往往被称为抢劫犯、响马贼和江洋大盗。",
    "同伙(不论是现在还是以前的)，独行罪犯，犯罪组织。",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("intimidate", "恐吓"),
      skill("locksmith", "锁匠"),
      skill("heavy_machinery", "操作重型机械"),
    ],
    [
      predefinedGroup("occ-29-choice-1", "电气维修或机械维修", 1, [
        skill("elec_repair", "电气维修"),
        skill("mech_repair", "机械维修"),
      ]),
      predefinedGroup("occ-29-fight-2", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-29-firearm-3", "射击", 1, FIREARM_OPTIONS),
      anySkillGroup(
        "occ-29-any-4",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：汽车驾驶，格斗，射击，两项社交技能（取悦、话术、恐吓、说服），心理学，潜行，侦查。
  // TODO: 职业属性：教育×2＋力量×2 (=EDU*2+STR*2)
  occupation(
    30,
    "罪犯-打手/暴徒",
    5,
    30,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "STR", multiplier: 2 },
    ],
    "打手、暴徒都是犯罪组织的兵卒。他们被犯罪组织豢养，不过团伙上层出事的时候，倒霉的往往是他们这些喽啰。对于他们来说，嘴紧和忠心属于职业道德。",
    "犯罪组织，本地执法机构，本地企业。",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-30-fight-1", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-30-firearm-2", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup(
        "occ-30-social-3",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：估价，攀爬，电气维修或机械维修，聆听，锁匠，妙手，潜行，侦查。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    31,
    "罪犯-窃贼",
    5,
    40,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "罪犯的体格和相貌形形色色，有些是纯粹碰运气伺机行事，比如扒手和暴徒；有些则组成分工明确，会详细调查并制定计划的犯罪组织。后者包括银行劫匪、飞贼、赝造者和诈骗者。\n罪犯可能为别人工作，后者通常是“匪帮”或罪犯家族；也可能单打独斗，如果成功的报酬值得去费力冒险，才会和别人搭伙。自由犯罪者则往往被称为抢劫犯、响马贼和江洋大盗。",
    "赃物贩子，其他的盗贼。",
    [
      skill("appraise", "估价"),
      skill("climb", "攀爬"),
      skill("listen", "聆听"),
      skill("locksmith", "锁匠"),
      skill("sleight_of_hand", "妙手"),
      skill("stealth", "潜行"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-31-choice-1", "电气维修或机械维修", 1, [
        skill("elec_repair", "电气维修"),
        skill("mech_repair", "机械维修"),
      ]),
    ],
  ),

  // TODO: 本职技能：估价，技艺（表演），法律或外语，聆听，两项社交技能（取悦、话术、恐吓、说服），心理学，妙手。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    32,
    "罪犯-欺诈师",
    10,
    65,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "欺诈师通常都是油嘴滑舌的人物。他们或单独或集体出没在富裕的人家和小区周边，诈取他们来之不易的钱财。许多骗局覆杂精妙，诈骗团伙会倾巢出动乃至租用建筑；有些则不需要这么麻烦，只要一个骗子几分钟就能搞定。",
    "其他的诈骗师，独行罪犯。",
    [
      skill("appraise", "估价"),
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("sleight_of_hand", "妙手"),
    ],
    [
      predefinedGroup("occ-32-choice-1", "法律或外语", 1, [
        skill("law", "法律"),
        skill("lang_other_1", "外语", "英语"),
        skill("lang_other_2", "外语", "法语"),
      ]),
      predefinedGroup(
        "occ-32-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（表演）或乔装，估价，一项社交技能（取悦、话术、恐吓、说服），格斗或射击，锁匠或机械维修，潜行，心理学，侦查。
  // TODO: 职业属性：教育×2＋敏捷或外貌×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    33,
    "罪犯-独行罪犯",
    5,
    65,
    [{ attribute: "EDU", multiplier: 2 }],
    "罪犯的体格和相貌形形色色，有些是纯粹碰运气伺机行事，比如扒手和暴徒；有些则组成分工明确，会详细调查并制定计划的犯罪组织。后者包括银行劫匪、飞贼、赝造者和诈骗者。\n罪犯可能为别人工作，后者通常是“匪帮”或罪犯家族；也可能单打独斗，如果成功的报酬值得去费力冒险，才会和别人搭伙。自由犯罪者则往往被称为抢劫犯、响马贼和江洋大盗。",
    "轻罪罪犯，本地执法机构。",
    [
      skill("appraise", "估价"),
      skill("stealth", "潜行"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-33-choice-1", "技艺（表演）或乔装", 1, [
        skill("art_craft_1", "技艺（表演）", "表演"),
        skill("disguise", "乔装"),
      ]),
      predefinedGroup(
        "occ-33-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-33-choice-3", "格斗或射击", 1, [
        skill("fighting_brawl", "格斗", "斗殴"),
        skill("fighting_1", "格斗", "自定义"),
        skill("firearms_handgun", "射击", "手枪"),
        skill("firearms_1", "射击", "步枪/霰弹枪"),
      ]),
      predefinedGroup("occ-33-choice-4", "锁匠或机械维修", 1, [
        skill("locksmith", "锁匠"),
        skill("mech_repair", "机械维修"),
      ]),
    ],
    [
      { attribute: "DEX", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：技艺（任意），两项社交技能（取悦、话术、恐吓、说服），格斗或射击（手枪），汽车驾驶，聆听，潜行，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    34,
    "罪犯-女飞贼（古典）",
    10,
    80,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "女飞贼是名为专业大盗的女人。大部分都是独立行动，也有对自己的男伴言听计从的时候。\n不过这也不一定，实际上情况可能完全相反，她完全可以在干了某一票以后就卷走所有现金和皮草溜之大吉。",
    "黑帮，执法机构，本地企业",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("listen", "聆听"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup("occ-34-art-1", "技艺（任意）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-34-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-34-choice-3", "格斗或射击（手枪）", 1, [
        skill("fighting_brawl", "格斗", "斗殴"),
        skill("firearms_handgun", "射击", "手枪"),
      ]),
      anySkillGroup(
        "occ-34-any-4",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，估价，技艺（伪造），历史，一项社交技能（取悦、话术、恐吓、说服），图书馆，侦查，任意一项其他技能。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    35,
    "罪犯-赃物贩子",
    20,
    40,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "赃物贩子，顾名思义是买卖偷抢来的财产，通常是收购赃物并转手卖给其他罪犯或(无意中)守法的顾客。主要来说，他们是小偷和买家的中间人，有时也会从交易中收取提成；不过更常见的还是以极低的价格直接收购赃物。",
    "犯罪组织，贸易伙伴，黑市和和守法的买主。",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("art_craft_1", "技艺（伪造）", "伪造"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-35-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-35-any-2", "任意一项其他技能", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：会计，估价，技艺（伪造），历史，图书馆，侦查，妙手，任意一项其他个人或时代特长（如计算机）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    36,
    "罪犯-赝造者",
    20,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "赝造者是地下世界的艺术家，专门从事伪造官方文件、契约、转让书，并提供伪造的签名。初学者只能做做小贼的假身份证，而顶级的赝造者连印假币的铸模都能做。",
    "犯罪组织，商人。",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("art_craft_1", "技艺（伪造）", "伪造"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("spot_hidden", "侦查"),
      skill("sleight_of_hand", "妙手"),
    ],
    [
      anySkillGroup(
        "occ-36-any-1",
        "任意一项其他个人或时代特长（如计算机）",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：射击，聆听，导航，一项社交技能（取悦、话术、恐吓、说服），汽车驾驶或驾驶（飞行器或船），心理学，妙手，侦查。
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    37,
    "罪犯-走私者",
    20,
    60,
    [{ attribute: "EDU", multiplier: 2 }],
    "走私一直是一个有利可图的高风险行当。走私者往往有一个合法的表面职业，比如船长、飞行员或商人，以掩盖他们非法运输的行为。",
    "犯罪组织，海岸卫队，海关官员。",
    [
      skill("listen", "聆听"),
      skill("navigate", "导航"),
      skill("psychology", "心理学"),
      skill("sleight_of_hand", "妙手"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-37-firearm-1", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup(
        "occ-37-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-37-choice-3", "汽车驾驶或驾驶（飞行器或船）", 1, [
        skill("drive_auto", "汽车驾驶"),
        skill("pilot_1", "驾驶", "飞行器"),
        skill("pilot_1", "驾驶", "船"),
      ]),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：攀爬，一项社交技能（取悦、话术、恐吓、说服），格斗，射击，跳跃，妙手，潜行，投掷。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    38,
    "罪犯-混混",
    3,
    10,
    [{ attribute: "EDU", multiplier: 2 }],
    "街头混混一般都是些小年轻，弄不好还在寻觅加入真正黑帮的契机。不过他们的本事也就限于偷车，盗窃商店货物，抢钱或者夜盗。",
    "其他轻罪罪犯，其他混混，本地的赃物贩子，黑帮，当然还有警察。",
    [
      skill("climb", "攀爬"),
      skill("jump", "跳跃"),
      skill("sleight_of_hand", "妙手"),
      skill("stealth", "潜行"),
      skill("throw", "投掷"),
    ],
    [
      predefinedGroup(
        "occ-38-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-38-fight-2", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-38-firearm-3", "射击", 1, FIREARM_OPTIONS),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），神秘学，心理学，侦查，任意其他两项其他个人特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    39,
    "教团首领",
    30,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "美国的新兴宗教层出不穷。直到现在，也还有从新英格兰超验主义到“天父的儿女”等等许多种类。教团首领有的创立了严格的教条并且对信徒推行，另一些则仅仅是垂涎于信徒的金钱和权势。\n在1920 年代，各种诱惑性的新兴宗教团体纷纷涌现。有些采取基督教的形式，有些则混杂了东方的神秘主义和神秘学的仪式。美国西海岸的人对这些教团屡见不鲜，不过其他形式的教团全国各地都存在。在美国南部的“圣经带”，就有许多巡回帐篷演出圣歌、舞蹈，推行信仰覆兴。其他国家也是一样，只要有需要信仰的人，就会有新兴宗教团体。",
    "主要的信徒都是普通人。不过首领的魅力越高，信徒当中有电影明星或者富有的寡妇之类名人的可能性就越大。",
    [
      skill("accounting", "会计"),
      skill("occult", "神秘学"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-39-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-39-any-2",
        "任意其他两项其他个人特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：两项社交技能（取悦、话术、恐吓、说服），汽车驾驶，格斗或射击，历史，神秘学，心理学，潜行。※经KP允许 可用催眠替换其中一项。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    40,
    "除魅师（现代）",
    20,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "除魅师的工作是说服(或者强迫)一个人放弃自己的信仰或是对宗教团体、社会团体的忠心。他们一般受雇于深陷教团之类组织的人的亲属，任务就是解救对方(通常靠绑架)，并通过心理学手段使他们割断与原来教团的联系(“控制”)。\n也有不那么激烈的除魅师，他们的工作对象则是那些自愿离开教团的人，为他们完全地退出教团进行有效的指导。",
    "本地和国家的执法机构，罪犯，宗教团体。",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("history", "历史"),
      skill("occult", "神秘学"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup(
        "occ-40-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-40-choice-2", "格斗或射击", 1, [
        skill("fighting_brawl", "格斗", "斗殴"),
        skill("firearms_handgun", "射击", "手枪"),
        skill("firearms_1", "射击", "步枪/霰弹枪"),
      ]),
    ],
  ),

  // TODO: 本职技能：会计，技艺（摄影），技艺（任一），计算机或图书馆，机械维修，心理学，侦查，任意一项其他个人特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    41,
    "设计师",
    20,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "设计师的工作包括许多方面，从时装到家具或是其他任何东西。他们自由工作，为设计工作室和企业设计产品、流程、法律、游戏、图像等等。\n调查员特定的设计方向也会影响他们对专业技能的选择，如果需要的话要进行调整。",
    "广告业，媒体，家具业，建筑业，其他。",
    [
      skill("accounting", "会计"),
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("mech_repair", "机械维修"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-41-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup("occ-41-choice-2", "计算机使用或图书馆", 1, [
        skill("computer_use", "计算机使用"),
        skill("library_use", "图书馆使用"),
      ]),
      anySkillGroup(
        "occ-41-any-3",
        "任意一项其他个人特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（任一），射击，外语，骑乘，一项社交技能（取悦、话术、恐吓、说服），任意三项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    42,
    "业余艺术爱好者（原作向）",
    50,
    99,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "业余艺术爱好者靠经济自立、遗产继承、信托基金或者其他各种来源保障自己的生活开支，没有必要自己工作。如果经济条件足够好，他们甚至可以雇佣专业的经济顾问来打理自己的产业。他们可能有很高的学历，但不一定是真才实学；优越的经济条件使得他们性情古怪，口无遮拦。\n在1920 年代，这些人可能会被时人称为“摩登女郎”或者“公子哥儿”，当然想当一个社交“名流”其实并不要求他有多有钱。换作现代，“时髦”则是恰如其分的形容词。\n业余艺术爱好者有着大把的时间考虑如何变得潇洒世故，不过花这些时间去做别的事可是违背他们的天性和兴致。",
    "多种多样，但通常是背景和趣味相近的人。同好会组织、波希米亚主义者、上流社会。",
    [skill("ride", "骑术")],
    [
      predefinedGroup("occ-42-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup("occ-42-firearm-2", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup("occ-42-lang-3", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-42-social-4",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-42-any-5",
        "任意三项其他个人或时代特长",
        3,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：潜水，急救，机械维修，驾驶（船），科学（生物），侦查，游泳，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    43,
    "潜水员",
    9,
    30,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "潜水员可能在军队、执法机构或海绵采集、海上救援、环境保护甚至水下寻宝的民间机构工作。",
    "海岸警卫队，船长，军队，执法机构，走私者。",
    [
      skill("diving", "潜水"),
      skill("first_aid", "急救"),
      skill("mech_repair", "机械维修"),
      skill("pilot_1", "驾驶", "船"),
      skill("science_1", "科学", "生物"),
      skill("spot_hidden", "侦查"),
      skill("swim", "游泳"),
    ],
    [
      anySkillGroup(
        "occ-43-any-1",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：急救、医学、外语（拉丁文）、心理学、科学（生物学，制药），任两种其他学术或个人特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    44,
    "医生（原作向）",
    30,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "医生这里可能是指全科医生、外科医生、其他专科医生或者独立医学研究员。除去个人的目标以外，救死扶伤、获得财富和荣誉、提升公众的理性意识和科学素养也常常是医生的理想。\n农村和小城镇的卫生院是全科医生的舞台，而大城市的各大医院则是高手如云，集聚了众多专攻病理学、毒理学、整形外科、脑外科等领域的专家。有些医生也可能担任全职或兼职的法医，进行尸检，并为市、县、州级执法机构出具检验报告。\n在美国，行医资格由各州认证，大多要求最少两年的正规医学院校学习经历。不过这个规定还是比较晚近的，在1920 年代很多年长的医生尽管没受过任何正规专业教育，仍然可以获得医师执照。",
    "其他医生，医护工作者，病人和前病人。",
    [
      skill("first_aid", "急救"),
      skill("medicine", "医学"),
      skill("lang_other_1", "外语", "拉丁文"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "生物学"),
      skill("science_2", "科学", "制药"),
    ],
    [
      anySkillGroup(
        "occ-44-any-2",
        "任两种其他学术或个人特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：攀爬，跳跃，聆听，导航，一项社交技能（取悦、话术、恐吓、说服），潜行，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌或敏捷或力量×2 (=EDU*2+MAX(DEX*2,APP*2,STR*2))
  occupation(
    45,
    "流浪者",
    0,
    5,
    [{ attribute: "EDU", multiplier: 2 }],
    "相对于那些因贫困而苦恼的人，流浪者选择四处漂泊的生活，可能是出于社会、哲学、经济的原因，或只是渴望摆脱社会的约束。\n流浪汉需要工作，有时几天或几个月，但他们应对问题时往往选择流动和孤立，而不是舒适和亲近。在美国，这种情况尤其常见，只要旅行本身没有什么危险，就会有人选择漂泊为生。",
    "其他流浪者，少数友善的铁路工人，城镇里众多的好心人。",
    [
      skill("climb", "攀爬"),
      skill("jump", "跳跃"),
      skill("listen", "聆听"),
      skill("navigate", "导航"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup(
        "occ-45-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-45-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
      { attribute: "STR", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：汽车驾驶，两项社交技能（取悦、话术、恐吓、说服），聆听，机械维修，导航，侦查，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    46,
    "司机-私人司机",
    10,
    40,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "私人司机是直接受雇于个人或企业，或者是专门提供连人带车的私人司机业务的中介机构。",
    "成功商界人士(包括罪犯)，政要。",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("listen", "聆听"),
      skill("mech_repair", "机械维修"),
      skill("navigate", "导航"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-46-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-46-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，汽车驾驶，聆听，一项社交技能（取悦、话术、恐吓、说服），机械维修，导航，心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    47,
    "司机-司机",
    9,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "专职司机可能为企业、个人工作，也可能拥有自己的出租车或货车。通常司机还要通过警方的背景调查，获得特殊的驾驶许可证。",
    "顾客，企业，执法机构和街头路人。",
    [
      skill("accounting", "会计"),
      skill("drive_auto", "汽车驾驶"),
      skill("listen", "聆听"),
      skill("mech_repair", "机械维修"),
      skill("navigate", "导航"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-47-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-47-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，汽车驾驶，电气维修，话术，机械维修，导航，侦查，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    48,
    "司机-出租车司机",
    9,
    30,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "出租车司机可能属于大大小小的出租车公司，也可能靠自己的车和证件运营(在美国，需要出租车牌照)。出租车公司负责为出租车司机登记车辆并分配调度，方便司机自由揽客。出租车上必须统一安装计价器，并由出租车协会进行定期检查。",
    "街头路人，偶尔有一些有名的顾客。",
    [
      skill("accounting", "会计"),
      skill("drive_auto", "汽车驾驶"),
      skill("elec_repair", "电气维修"),
      skill("fast_talk", "话术"),
      skill("mech_repair", "机械维修"),
      skill("navigate", "导航"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "occ-48-any-1",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，历史，母语，两项社交技能（取悦、话术、恐吓、说服），心理学，侦查，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    49,
    "编辑",
    10,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "编辑的工作包括审核记者的稿件，撰写报刊社论，应对各种突发事件、到了截稿时间要催稿，编辑工作只好偶尔为之啦。大型报社的编辑数量众多，包括比起新闻编辑更多参与业务运营的主编。其他编辑专门负责时尚、体育或者其他板块。许多小报可能就只有一个编辑，他甚至有可能就是报社的业主或者唯一的全职员工。",
    "新闻业界，地方政府，专业人士(如时装设计师、运动员、商人)，出版社。",
    [
      skill("accounting", "会计"),
      skill("history", "历史"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-49-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-49-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：取悦，历史，恐吓，话术，聆听，母语，说服，心理学。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    50,
    "政府官员",
    50,
    90,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "以民选方式选举出来的政府官员享有与他们的职位相符的声望。小城市的市长和城镇的镇长之类，他们的影响力基本出不了城镇的范围，而且这样的职务基本上是兼职的，报酬也很少。大城市的市长，工资就相当可观了，而且还能把自己的城市管理得像小王国一样，影响力和权力比所在州的州长还要大。\n州议会的众参两院议员是相当有面子的职位，尤其是在商界和本州岛的其他业界。\n州长负责全州的事务，是联系各州和国家的纽带。\n联邦政府拥有最高等级的影响力。众议院议员由各州按本州岛人口所占比重选派的共400 余名议员组成，任期为两年。参议院则是不论各州大小，每州选派两名议员到花生屯任职。任期长达六年，人数不超过一百，所以参议员更是权倾一方，许多年长的议员能够享受总统级的待遇。\n在英国，下议院议员由选举产生，任期四到五年；上议院议员则不由选举产生，是世袭制或由君主指任。",
    "公务员，政府，新闻媒体，企业，外国政府，可能有犯罪组织。",
    [
      skill("charm", "取悦"),
      skill("history", "历史"),
      skill("intimidate", "恐吓"),
      skill("fast_talk", "话术"),
      skill("listen", "聆听"),
      skill("lang_own", "母语"),
      skill("persuade", "说服"),
      skill("psychology", "心理学"),
    ],
    [],
  ),

  // TODO: 本职技能：技艺（技术制图），电气维修，图书馆，机械维修，操作重型机械，科学（工程学，物理），任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    51,
    "工程师",
    30,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "工程师精通机械和电气设备，可能在民间或军工企业工作，也可能是个发明家。他们擅长应用科学、数学知识和丰富的创造思维，解决各种技术问题。",
    "生意伙伴或部队同事，地方政府，建筑师。",
    [
      skill("art_craft_1", "技艺（技术制图）", "技术制图"),
      skill("elec_repair", "电气维修"),
      skill("library_use", "图书馆使用"),
      skill("mech_repair", "机械维修"),
      skill("heavy_machinery", "操作重型机械"),
      skill("science_1", "科学", "工程学"),
      skill("science_2", "科学", "物理"),
    ],
    [
      anySkillGroup(
        "occ-51-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（表演类，如表演、演唱、喜剧等），乔装，两项社交技能（取悦、话术、恐吓、说服），聆听，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    52,
    "艺人",
    9,
    70,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "艺人包括小丑、歌手、舞蹈演员、喜剧演员、杂耍艺人、魔术师，各种以在人前表演谋生的人。他们乐于向更多的人表现自己的能力，并期待观众回报的掌声。\n在1920 年代，这一职业并不受人尊重。不过1920 年代好莱坞明星的高薪彻底改变了很多人的想法，现在这个职业背景已经通常被视作是优势了。",
    "歌舞杂技团，剧院，电影工作室，娱乐评论家，犯罪组织，电视台(现代)。",
    [
      skill("disguise", "乔装"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-52-art-1",
        "技艺（表演类，如表演，演唱，喜剧等）",
        1,
        ART_OPTIONS,
      ),
      predefinedGroup(
        "occ-52-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-52-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：攀爬或游泳，射击，历史，跳跃，自然，导航，外语，生存。
  // TODO: 职业属性：教育×2＋外貌或敏捷或力量×2 (=EDU*2+MAX(DEX*2,APP*2,STR*2))
  occupation(
    53,
    "探险家（古典）",
    55,
    80,
    [{ attribute: "EDU", multiplier: 2 }],
    "在20 世纪早期，这世界还有许多地区尚未有人涉足，而探索这些地方正是探险家的工作。这种令人兴奋不已的生活方式，其经济来源则是科学界的赞助、私人的捐赠、博物馆的委托和报纸杂志图书电影的版权等等。\n黑非洲的大部分仍然不为人知，同样的地方还包括了南美的马托格罗索高原，澳大利亚的大沙沙漠，撒哈拉和阿拉伯沙漠，和亚洲的茫茫戈壁。尽管南北极点已经被探险家征服了，但周围很大部分的地区仍然是未知的。",
    "大图书馆，大学，博物馆，富有的赞助者，其他探险家，出版社，外国政府官员，本地土著。",
    [
      skill("history", "历史"),
      skill("jump", "跳跃"),
      skill("natural_world", "博物学"),
      skill("navigate", "导航"),
    ],
    [
      predefinedGroup("occ-53-choice-1", "攀爬或游泳", 1, [
        skill("climb", "攀爬"),
        skill("swim", "游泳"),
      ]),
      predefinedGroup("occ-53-firearm-2", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup("occ-53-lang-3", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup("occ-53-survival-4", "生存", 1, [
        skill("survival", "生存", "森林"),
        skill("survival", "生存", "海上"),
        skill("survival", "生存", "荒野"),
      ]),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
      { attribute: "STR", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：技艺（耕作），汽车驾驶（或运货马车），一项社交技能（取悦、话术、恐吓、说服），机械维修，自然，操作重型机械，追踪，任意一项其他个人或时代特长
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    54,
    "农民",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "农民可能自己拥有土地，自己从事农牧业，也可能是受雇在农场工作。农业劳动繁重而枯燥，特别适合那些喜欢户外体力劳动的人。\n1920 年代是美国城镇人口超过农村人口的首个十年。从这时起一直到现在，自耕农民都在受到规模化农业企业和剧烈波动的农产品市场的双重冲击。",
    "地方银行，地方政治家，各州农业部门。",
    [
      skill("art_craft_1", "技艺（耕作）", "耕作"),
      skill("drive_auto", "汽车驾驶"),
      skill("mech_repair", "机械维修"),
      skill("natural_world", "博物学"),
      skill("heavy_machinery", "操作重型机械"),
      skill("track", "追踪"),
    ],
    [
      predefinedGroup(
        "occ-54-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-54-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：汽车驾驶，格斗，射击，法律，说服，潜行，侦查，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    55,
    "联邦探员",
    20,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "联邦执法机构和特工种类各异。有些身着制服，比如美国司法部的人员；另外一些则穿便服，工作内容也类似警探，比如联邦调查局的人员。",
    "联邦司法机构，执法机构，犯罪组织。",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("law", "法律"),
      skill("persuade", "说服"),
      skill("stealth", "潜行"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-55-firearm-1", "射击", 1, FIREARM_OPTIONS),
      anySkillGroup(
        "occ-55-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：攀爬，闪避，汽车驾驶，急救，跳跃，机械维修，操作重型机械，投掷。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    56,
    "消防员",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "消防员是公职人员，通常为所管辖的小区服务。他们夜以继日地工作，或者连续几天的倒班工作，吃住包括娱乐活动都要局限在消防局里。消防员的管理结构类似军队，职位包括中尉、上尉和局长等等。",
    "市政工人，医务人员，执法机构。",
    [
      skill("climb", "攀爬"),
      skill("dodge", "闪避"),
      skill("drive_auto", "汽车驾驶"),
      skill("first_aid", "急救"),
      skill("jump", "跳跃"),
      skill("mech_repair", "机械维修"),
      skill("heavy_machinery", "操作重型机械"),
      skill("throw", "投掷"),
    ],
    [],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：历史，外语，母语，聆听，两项社交技能（取悦、话术、恐吓、说服），心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    57,
    "驻外记者",
    10,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "驻外记者是新闻界的精英人才。他们拿着固定工资,靠报销单环游全世界。在 1920 年代,驻外记者通常供职于大型报社、广播电台、或者国家级通讯社。当代的驻外记者也可能自由撰稿或 者为电视台、网络通讯社和国际新闻通讯社工作。\n这个职业的工作内容五花八门,经常能激动人心。不过博物学灾害、政治动荡和战争也会成为驻外记者报导的主要内容,工作也不总是一帆风 顺。",
    "国内外新闻界，外国政府，军队。",
    [
      skill("history", "历史"),
      skill("lang_own", "母语"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-57-lang-1", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-57-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-57-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：外语（拉丁文），图书馆，医学，说服，科学（生物学，鉴证，制药），侦查。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    58,
    "法医",
    40,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "法医是一个高度专门化的职业,大多数法医为市、县或州执法机构工作。工作内容包括尸体解剖,推定死因,并为公诉人提供建议。法医也常常会在刑事审判中出庭提供证言。",
    "实验室工作人员，执法机构，医护人员。",
    [
      skill("lang_other_1", "外语", "拉丁文"),
      skill("library_use", "图书馆使用"),
      skill("medicine", "医学"),
      skill("persuade", "说服"),
      skill("spot_hidden", "侦查"),
      skill("science_1", "科学", "生物学"),
      skill("science_2", "科学", "鉴证"),
      skill("science_3", "科学", "制药"),
    ],
  ),

  // TODO: 本职技能：会计，技艺（表演），两项社交技能（取悦、话术、恐吓、说服），聆听，心理学，妙手，侦查。
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    59,
    "赌徒",
    8,
    50,
    [{ attribute: "EDU", multiplier: 2 }],
    "赌徒是罪犯世界里最花哨的一群人。他们衣 着光鲜,不论朴实还是华丽都魅力四射。不论是靠赛马、纸牌游戏还是其他赌博方式,他们总是要凭自己的运气过活。\n老练的赌徒会频繁地光顾犯罪组织开设的地 下赌场。少数赌场高手可能经常参加漫长而又一掷千金的豪赌,甚至可能有外部利益集团作为后台。\n低级的赌徒则出入于狭窄的小巷,在骰子房 耍弄灌铅的骰子,或者是挤坐在阴暗的台球室里。",
    "其他赌徒，犯罪组织，街头路人。",
    [
      skill("accounting", "会计"),
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("sleight_of_hand", "妙手"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-59-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：格斗，射击，法律，聆听，两项社交技能（取悦、话术、恐吓、说服），心理学，侦查。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    60,
    "黑帮-黑帮老大",
    60,
    95,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "黑帮可能是整个城市、一部分城市的大佬, 也可能只是给这些大佬打工的马仔。马仔们通常 有自己的保护范围,比如监管非法运输和收取保 护费等等。老板总管业务,负责交易,并要就各 种各样的问题给马仔们拿主意。更重要的是,老 板可以各种高人一等,只要能找到马仔或者小弟 去干的事,他基本是不肯污了自己的手去做的。\n黑社会在 1920 年代上升为突出的社会问题。本来仅限于在本地收收保护费和管管赌场的外国 裔黑帮,不约而同地发现了贩卖私酒带来的巨大 利润。没过多久,他们就掌控了城市的大片区域, 并在街上和其他黑帮火并。虽然大部分黑帮是按 来源的民族划分——如爱尔兰裔、意大利裔、非 洲裔和犹太裔,黑帮的成员仍然可能是任何民族。\n如今,贩毒则取代其他,成为多数黑帮中来 钱最快的犯罪门路。和 1920 年代前辈的工作方法 类似,现在的黑帮老大也需要大量的小弟来负责 保卫、推广、在街道里推行自己的业务。\n除去贩私酒和贩毒以外,卖淫、保护、赌博、 腐败等等都是这些犯罪组织的业务范围。",
    "犯罪组织，街头罪犯，警察，地方政府，政治家，法官，工会，律师，同民族的代表。",
    [
      skill("law", "法律"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-60-fight-1", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-60-firearm-2", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup(
        "occ-60-social-3",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：汽车驾驶，格斗，射击，两项社交技能（取悦、话术、恐吓、说服），心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    61,
    "黑帮-马仔",
    9,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "黑帮可能是整个城市、一部分城市的大佬, 也可能只是给这些大佬打工的马仔。马仔们通常 有自己的保护范围,比如监管非法运输和收取保 护费等等。老板总管业务,负责交易,并要就各 种各样的问题给马仔们拿主意。更重要的是,老 板可以各种高人一等,只要能找到马仔或者小弟 去干的事,他基本是不肯污了自己的手去做的。\n黑社会在 1920 年代上升为突出的社会问题。本来仅限于在本地收收保护费和管管赌场的外国 裔黑帮,不约而同地发现了贩卖私酒带来的巨大 利润。没过多久,他们就掌控了城市的大片区域, 并在街上和其他黑帮火并。虽然大部分黑帮是按 来源的民族划分——如爱尔兰裔、意大利裔、非 洲裔和犹太裔,黑帮的成员仍然可能是任何民族。\n如今,贩毒则取代其他,成为多数黑帮中来 钱最快的犯罪门路。和 1920 年代前辈的工作方法 类似,现在的黑帮老大也需要大量的小弟来负责 保卫、推广、在街道里推行自己的业务。\n除去贩私酒和贩毒以外,卖淫、保护、赌博、 腐败等等都是这些犯罪组织的业务范围。",
    "街头罪犯，警察，企业，同民族的代表。",
    [skill("drive_auto", "汽车驾驶"), skill("psychology", "心理学")],
    [
      predefinedGroup("occ-61-fight-1", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-61-firearm-2", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup(
        "occ-61-social-3",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-61-any-4",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：技艺（任一），两项社交技能（取悦、话术、恐吓、说服），射击（步枪/霰弹枪），历史，外语（任一），导航，骑乘。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    62,
    "绅士/淑女",
    40,
    90,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "绅士淑女指的是有良好的教养品行、举止彬彬有礼的人。通常用来称呼上流社会(通过继承 或津贴)拥有相当财富的人。\n在上世纪 20 年代,这样的人至少要有一个仆 人(管家、男仆、女仆、私人司机),还要有城 市或乡村的宅第。家庭的富有并不重要,因为家庭的社会地位往往比财产更被上流社会所看重。",
    "上流社会和乡绅，政治家，仆人和农民。",
    [
      skill("firearms_1", "射击", "步枪/霰弹枪"),
      skill("history", "历史"),
      skill("navigate", "导航"),
      skill("ride", "骑术"),
    ],
    [
      predefinedGroup("occ-62-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-62-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-62-lang-3", "外语（任一）", 1, LANGUAGE_OPTIONS),
    ],
  ),

  // TODO: 本职技能：技艺（任一），攀爬，跳跃，聆听，锁匠或妙手，导航，潜行，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    63,
    "游民",
    0,
    5,
    [{ attribute: "EDU", multiplier: 2 }],
    "游民只有少数的人愿意去当,虽然失业的人、 醉倒在阴沟里的醉鬼到处都是。和流浪者只会在 必需时才工作不同,游民的工作本身就是流浪。\n他们不断地坐火车旅行,从一个城市辗转到 另一个城市,他们是身无分文的诗人、漂泊者, 铁路上的探索者、冒险者和盗贼。但是铁路上的生活一样充满危险。且不说穷困潦倒、无家可归, 还要面对来自警察、周围居民和铁路员工的敌意。另外在深夜中跳车并不是一件容易的事,在跳车的时候被车厢夹断过手脚的人可是不可胜数。",
    "其他游民，少数友好的铁路员工，许多城镇里的好心人。",
    [
      skill("climb", "攀爬"),
      skill("jump", "跳跃"),
      skill("listen", "聆听"),
      skill("navigate", "导航"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup("occ-63-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup("occ-63-choice-2", "锁匠或妙手", 1, [
        skill("locksmith", "锁匠"),
        skill("sleight_of_hand", "妙手"),
      ]),
      anySkillGroup(
        "occ-63-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：电气维修，一项社交技能（取悦、话术、恐吓、说服），格斗，急救，聆听，机械维修，心理学，潜行。
  // TODO: 职业属性：教育×2＋力量×2 (=EDU*2+STR*2)
  occupation(
    64,
    "勤杂护工",
    6,
    15,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "STR", multiplier: 2 },
    ],
    "勤杂护工在医院的工作包括倒垃圾、打扫房间、运送病人,还有一些其他乱七八糟的工作。总之对他们的要求不比对看门人多多少。",
    "其他医疗人员，病人。允许接触医疗记录、药品等等。",
    [
      skill("elec_repair", "电气维修"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("first_aid", "急救"),
      skill("listen", "聆听"),
      skill("mech_repair", "机械维修"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup(
        "occ-64-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（艺术或摄影），一项社交技能（取悦、话术、恐吓、说服），历史，图书馆，母语，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    65,
    "记者(原作向)-调查记者",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "记者用文字对当天的新闻事件进行报导与评 论,一天之内就要完成一个作家一周的工作量。他们通常为报纸、杂志、广播电台、电视台或者新闻网站撰稿。\n优秀的调查记者在报导事件的同时,即使面对丑恶,也能保持自身的清廉正直。恶心的记者则被现实所压倒,最终丧失自己的节操,肆意操纵文字歪曲真相。",
    "新闻界，政治家，街头罪犯和执法机构。",
    [
      skill("art_craft_1", "技艺（艺术或摄影）", "艺术或摄影"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-65-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-65-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（表演），历史，聆听，母语，一项社交技能（取悦、话术、恐吓、说服），心理学，潜行，侦查。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    66,
    "记者(原作向)-通讯记者",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "通讯记者则是新闻传媒行业大军中的一员, 不管是自由撰稿或是在报社、杂志社、新闻网站、 通讯社工作。大部分记者从事实地工作,包括走 访见证人、查看记录、收集叙述。有些记者被安 排专门追踪警界、体育界或商界的热点新闻,其他人则是负责社会事件乃至园艺俱乐部之类的事情。\n通讯记者都会携带记者证,不过记者证除了 各通讯社(主要是报社)用来识别自己的雇员以 外没有太大的作用。实际上记者的工作内容更像 私家侦探,有时为了获得第一手消息也难免使点嘴上花招。",
    "新闻媒体，政治团体与政府，商界，执法机构，街头罪犯，上流社会。",
    [
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("history", "历史"),
      skill("listen", "聆听"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-66-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：历史，恐吓，法律，图书馆，聆听，母语，说服，心理学。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    67,
    "法官",
    50,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "法官是主持审判全过程的人,可能单独工作或是和同事组成合议庭。一般是推选或任命制, 工作年限也分定期和终身。有的人是初出茅庐就当了法官,而其余的绝大多数,不论是在联邦最高法院还是遥远西部小镇的法官,其实至少都是经过注册的律师。",
    "法律界，可能有犯罪组织。",
    [
      skill("history", "历史"),
      skill("intimidate", "恐吓"),
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("lang_own", "母语"),
      skill("persuade", "说服"),
      skill("psychology", "心理学"),
    ],
    [],
  ),

  // TODO: 本职技能：计算机或图书馆，电气维修，外语，科学（化学和任意两项），侦查，任意一项其他个人特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    68,
    "实验室助理",
    10,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "实验室助理在科研环境中工作,在首席科学家的监督下进行实验和行政工作。\n研究内容可能依首席科学家的研究学科而变 化。但基本都包括取样、测试、记录和分析数据、 调整和进行实验、制备标本和样品、管理实验室的日常工作,和保护工作人员的健康与安全。",
    "大学，科学家，图书馆。",
    [
      skill("elec_repair", "电气维修"),
      skill("science_1", "科学", "化学"),
      skill("science_2", "科学"),
      skill("science_3", "科学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-68-choice-1", "计算机使用或图书馆", 1, [
        skill("computer_use", "计算机使用"),
        skill("library_use", "图书馆使用"),
      ]),
      predefinedGroup("occ-68-lang-2", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-68-any-4",
        "任意一项其他个人特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：汽车驾驶，电气维修，格斗，急救，机械维修，操作重型机械，投掷，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    69,
    "工人-非熟练工人",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "工人这一大类职业包括工厂工人、纺织工人、 码头工人、养路工人、矿工、建筑工人等等。工人分为两种类型:熟练工和非熟练工。普通的工人虽然技术不熟练,但是仍然长于使用电动工具、 起重机和其他工厂设备。",
    "其他工人和行业主管",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("elec_repair", "电气维修"),
      skill("first_aid", "急救"),
      skill("mech_repair", "机械维修"),
      skill("heavy_machinery", "操作重型机械"),
      skill("throw", "投掷"),
    ],
    [
      predefinedGroup("occ-69-fight-1", "格斗", 1, FIGHTING_OPTIONS),
      anySkillGroup(
        "occ-69-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：攀爬，闪避，格斗（电锯），急救，跳跃，机械维修，自然或科学（生物学或植物学），投掷。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    70,
    "工人-伐木工",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "工人这一大类职业包括工厂工人、纺织工人、 码头工人、养路工人、矿工、建筑工人等等。工人分为两种类型:熟练工和非熟练工。普通的工人虽然技术不熟练,但是仍然长于使用电动工具、 起重机和其他工厂设备。",
    "林业工人，野外向导和环境保护者。",
    [
      skill("climb", "攀爬"),
      skill("dodge", "闪避"),
      skill("fighting_1", "格斗", "电锯"),
      skill("first_aid", "急救"),
      skill("jump", "跳跃"),
      skill("mech_repair", "机械维修"),
      skill("throw", "投掷"),
    ],
    [
      predefinedGroup("occ-70-choice-1", "自然或科学（生物学或植物学）", 1, [
        skill("natural_world", "博物学"),
        skill("science_1", "科学", "生物学"),
        skill("science_1", "科学", "植物学"),
      ]),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：攀爬，科学（地质），跳跃，机械维修，操作重型机械，潜行，侦查，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    71,
    "工人-矿工",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "工人这一大类职业包括工厂工人、纺织工人、 码头工人、养路工人、矿工、建筑工人等等。工人分为两种类型:熟练工和非熟练工。普通的工人虽然技术不熟练,但是仍然长于使用电动工具、 起重机和其他工厂设备。",
    "工会干部，政治团体。",
    [
      skill("climb", "攀爬"),
      skill("science_1", "科学", "地质"),
      skill("jump", "跳跃"),
      skill("mech_repair", "机械维修"),
      skill("heavy_machinery", "操作重型机械"),
      skill("stealth", "潜行"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "occ-71-any-1",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，法律，图书馆，两项社交技能（取悦、话术、恐吓、说服），心理学，两项其他技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    72,
    "律师",
    30,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "律师或法律顾问精通他们所在地区的法律，擅长把抽象的法学理论知识联系起来，为客户解决法律方面的疑难，担任辩护代理、法律顾问的工作，为客户提供解决办法。可能受托处理个人案件、接受法院指定，也可能专门为某个富裕客户或公司服务。\n在美国，“律师”一词一般只指辩护律师。在英国，“律师”一词则包括高级律师、初级律师还有一些执法机构。\n假如碰上好客户的话，律师自己也可以一战成名，少数律师还能以自己在政治经济方面的获益吸引媒体的关注。",
    "犯罪组织，资本家，检察官和法官。",
    [
      skill("accounting", "会计"),
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-72-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-72-any-2", "两项其他技能", 2, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：会计，图书馆，外语，母语，任意四项其他个人特长或专业书籍主题。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    73,
    "图书馆管理员（原作向）",
    9,
    35,
    [{ attribute: "EDU", multiplier: 4 }],
    "图书馆管理员在公共机构和图书馆工作，负责管理图书目录和书库，并处理图书借阅等。在现代，图书馆管理员还要负责管理视听数据、电子书库。\n一些大公司可能聘用图书馆管理员管理书库，偶尔还会有富有的图书藏家招收他们管理自己的私人藏书。",
    "书商，社会团体，专业研究人员。",
    [
      skill("accounting", "会计"),
      skill("library_use", "图书馆使用"),
      skill("lang_own", "母语"),
    ],
    [
      predefinedGroup("occ-73-lang-1", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-73-any-2",
        "任意四项其他个人特长或专业书籍主题",
        4,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（木工、焊接、管道工等），攀爬，汽车驾驶，电气维修，机械维修，操作重型机械，任意两项其他个人或时代或技术特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    74,
    "技师",
    9,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "技师包括所有需要专业训练和作为学徒或实习生工作经验的职业，例如木工、石工、管道工、电气维修、设备安装工人、机修工人等等这些需要技术资质的职业。通常这些工人有自己的工会组织，会和承包人和雇主争取自己的权益。",
    "工会成员，其他专业技术人员。",
    [
      skill(
        "art_craft_1",
        "技艺（木工，焊接，管道工等）",
        "木工，焊接，管道工等",
      ),
      skill("climb", "攀爬"),
      skill("drive_auto", "汽车驾驶"),
      skill("elec_repair", "电气维修"),
      skill("mech_repair", "机械维修"),
      skill("heavy_machinery", "操作重型机械"),
    ],
    [
      anySkillGroup(
        "occ-74-any-1",
        "任意两项其他个人或时代或技术特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，射击，导航，急救，两项社交技能（取悦、话术、恐吓、说服），心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    75,
    "军官",
    20,
    70,
    [{ attribute: "EDU", multiplier: 2 }],
    "军官有严格的等级，许多等级还需要高等教育学历。各国武装部队都建立了人才培养系统，其中包括大学教育。在美国，许多大学开设军校生训练项目，可以让学员同时接受文化教育和军事训练。毕业的学员可以授以陆军或海军少尉军衔，并分派到各驻地。他们通常会为国家服役四年，之后可以退役覆员。许多人有专门的任命，作为医生、律师和工程师工作。\n寻求军旅生涯的人会为进入西点军校和美国海军军官学校这样的著名军校而努力，拥有这些名校学历很容易得到其他军官的尊敬。离开学校以后，许多军官也会选择接受飞行训练等特殊训练。\n富有经验，特别值得提升的士兵会被破例提拔为一级准尉。虽然在名义上位列最末，获得这一军衔所需要的时间和经验意味着他们远比普通的初中级军官更受尊敬。绝大多数军衔是终身荣誉，退役多年的军官仍然可以自称上尉或者将军。",
    "部队，联邦政府。",
    [
      skill("accounting", "会计"),
      skill("navigate", "导航"),
      skill("first_aid", "急救"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-75-firearm-1", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup(
        "occ-75-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-75-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：技艺（任一），急救，机械维修，医学，自然，一项社交技能（取悦、话术、恐吓、说服），任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    76,
    "传教士",
    0,
    30,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "传教士云游到世界的各个角落，传播神的旨意，在文明的地方拯救“不幸的原始人”和“迷途的灵魂”。他们可能属于天主教、新教、伊斯兰教或者其他信仰系统，比如后期圣徒教会(摩门教)在欧美就有专门的传道所。\n有的传教士只凭自己的意志独立行动，有的则可能有教会以外的组织支持。\n基督教、伊斯兰教的传教者，佛教、印度教的法师，在全世界各个时代都能遇到。",
    "教会阶层，外国官员。",
    [
      skill("first_aid", "急救"),
      skill("mech_repair", "机械维修"),
      skill("medicine", "医学"),
      skill("natural_world", "博物学"),
    ],
    [
      predefinedGroup("occ-76-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-76-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-76-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：攀爬，急救，跳跃，聆听，导航，外语，生存（阿尔卑斯或类似），追踪。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    77,
    "登山家",
    30,
    60,
    [{ attribute: "EDU", multiplier: 2 }],
    "登山家一般都是利用业余时间和假期的运动员，只有少数攀登著名高山的人才会去寻找财力和设备的赞助。\n19 世纪登山运动开始兴起，到了1920 年代，所有美洲和阿尔卑斯地区的主要山峰都被一一征服。经过与西藏人的冗长谈判之后，外国登山队终于获准进入喜马拉雅山的高峰地区。作为世界上最后未被征服的高峰，对珠峰的进军经常被电台和报纸报道。不过1921、1922、1924 年的三次远征都没能达到峰顶，还造成了13 人死亡。\n到了现代，登山可以是休闲运动或职业选择。如果是后者，则工作内容包括教练、向导、运动员或救生员等。\n(译注：1920 年代的登山队都是取道中国境内的北坡，故正是与西藏地方政府进行的商谈。)",
    "其他登山者，环境保护者，赞助人，担保人，本地救援队或执法机构，护林员，运动俱乐部。",
    [
      skill("climb", "攀爬"),
      skill("first_aid", "急救"),
      skill("jump", "跳跃"),
      skill("listen", "聆听"),
      skill("navigate", "导航"),
      skill("survival", "生存", "阿尔卑斯或类似"),
      skill("track", "追踪"),
    ],
    [predefinedGroup("occ-77-lang-1", "外语", 1, LANGUAGE_OPTIONS)],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，估价，考古，历史，图书馆，神秘学，外语，侦查。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    78,
    "博物馆管理员",
    10,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "博物馆管理员可能负责大学或其他公共机构的大型设施，也可能负责小一些的博物馆，往往对本地的地质或者其他的内容颇有研究。",
    "本地的大学和学者，出版社，博物馆赞助者。",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("archaeology", "考古学"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("occult", "神秘学"),
      skill("spot_hidden", "侦查"),
    ],
    [predefinedGroup("occ-78-lang-1", "外语", 1, LANGUAGE_OPTIONS)],
  ),

  // TODO: 本职技能：技艺（乐器），一项社交技能（取悦、话术、恐吓、说服），聆听，心理学，四项其他技能。
  // TODO: 职业属性：教育×2＋意志或敏捷×2 (=EDU*2+MAX(POW*2,DEX*2))
  occupation(
    79,
    "音乐家",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "音乐家可能加入乐团、乐队或者独奏，演奏的乐器则可以是任何你能想象的种类。音乐家想出人头地十分困难，签约发布唱片就更难了。所以绝大多数音乐家都贫穷又无人关注，只靠街头卖艺勉强维持生计。少数幸运儿可以找到固定工作，比如在酒吧、宾馆或者市交响乐团弹钢琴。对更少的人来说，在正确的时间出现在正确的地点，再加上一点点天赋，就能获得巨大的成功和可观的财富。\n1920 年代是爵士乐的年代，众多的音乐家在美国各地的大中城市、城镇里的爵士乐队和交响乐队工作。少数音乐家住在芝加哥和纽约之类的大城市并在那里打拼，而大部分的人靠巴士、汽车或者火车过着旅行生活。",
    "俱乐部老板，音乐家协会，犯罪组织，街头罪犯。",
    [
      skill("art_craft_1", "技艺（乐器）", "乐器"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-79-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-79-any-2", "四项其他技能", 4, ANY_SKILL_OPTIONS),
    ],
    [
      { attribute: "POW", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：急救，聆听，医学，一项社交技能（取悦、话术、恐吓、说服），心理学，科学（生物学，化学），侦查。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    80,
    "护士",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "护士是专业的医疗助理，通常在医院和疗养院之类的地方工作，或者和全科医生一起合作。一般来说，护士会协助健康人或病人进行保健或康复活动(或者临终关怀)，虽然其他人若是有足够的力量、意志或者知识，完全不需要护士帮助的康复也是可能的。",
    "护工，医生，小区工作人员。",
    [
      skill("first_aid", "急救"),
      skill("listen", "聆听"),
      skill("medicine", "医学"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
      skill("science_1", "科学", "生物学"),
      skill("science_2", "科学", "化学"),
    ],
    [
      predefinedGroup(
        "occ-80-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：人类学，历史，图书馆，一项社交技能（取悦、话术、恐吓、说服），神秘学，外语，科学（天文），任意一项其他个人或时代特长 ※经KP允许 可以包含克苏鲁神话
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    81,
    "神秘学家",
    9,
    65,
    [{ attribute: "EDU", multiplier: 4 }],
    "神秘学家是钻研深奥秘密和神秘魔法的人。他们对超博物学能力深信不疑，并竭尽所能靠他们的能力去了解这些东西。许多人对不同神秘哲学和魔法理论的知识面都相当广泛，有些甚至相信自己专注研究三十年真的成为了魔法师——到底是真是假就交由KP 来决断了。\n需要指出的是，神秘学家熟知的基本上是“表面的魔法”——克苏鲁神话魔法的秘密对他们仍然是未知的，或者不过是古书上描述那些诱人的线索而已。",
    "图书馆员，神秘学学会或者同好会，其他神秘学家。",
    [
      skill("anthropology", "人类学"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("occult", "神秘学"),
      skill("science_1", "科学", "天文"),
    ],
    [
      predefinedGroup(
        "occ-81-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-81-lang-2", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-81-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：射击，急救，聆听，自然，导航，侦查，生存（任一），追踪。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    82,
    "旅行家",
    5,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "旅行家爱好户外，他们一年中大部分时间都呆在户外，并且一出门就是相当长的时间；通常有相当的捕鱼和狩猎技术，能在最恶劣的环境之中幸存下来。擅长的技术可能包括登山、捕鱼、滑雪、皮划艇、攀登和露营。\n旅行家可能在国家公园或素质拓展中心做野外向导和护林员，也可能是有其他经济来源能让他们不用工作就能以这种方式生活，说不定还可能是一个隐士，只有在需要的时候才会回到文明社会。",
    "本地居民，土著，贸易商。",
    [
      skill("first_aid", "急救"),
      skill("listen", "聆听"),
      skill("natural_world", "博物学"),
      skill("navigate", "导航"),
      skill("spot_hidden", "侦查"),
      skill("track", "追踪"),
    ],
    [
      predefinedGroup("occ-82-firearm-1", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup("occ-82-survival-2", "生存（任一）", 1, [
        skill("survival", "生存", "森林"),
        skill("survival", "生存", "海上"),
        skill("survival", "生存", "荒野"),
      ]),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：人类学，技艺（摄影），历史，图书馆，神秘学，外语，心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    83,
    "超心理学家",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "超心理学家从不打算欣赏超常现象。相反，他们试图去观察，记录并研究这些实例。被叫做“捉鬼人”的他们利用技术手段来获取某人或某地点的超博物学活动的证据，当然比起收集到实在的证据，更多的时候他们是在揭穿假冒和误认的超常现象。\n一些超心理学家专门研究特定的现象，例如超感官、心灵致动、闹鬼等等。\n名牌大学是没有超心理学学位的。这个领域成就的评判标准完全是基于个人声誉，所以一般有相近学科学历比如物理学、心理学和医学的人会比较有说服力。\n选择研究这个的人往往对不可视的神秘力量抱有相当的同情态度，并希望其他的科学家也能满意地点头肯定。这就表现出了一种既相信又怀疑的奇异的迭加态——恐怕超心理学家自己也难解决这个问题。一个对观察实验证明不感兴趣的人是个神秘学家而不是个科学家。",
    "大学，超心理学刊物。",
    [
      skill("anthropology", "人类学"),
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("occult", "神秘学"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-83-lang-1", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-83-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，急救，外语（拉丁文），图书馆，一项社交技能（取悦、话术、恐吓、说服），心理学，科学（制药，化学）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    84,
    "药剂师",
    35,
    75,
    [{ attribute: "EDU", multiplier: 4 }],
    "药剂师的管理一直以来都比医生更严格。所有的药剂师都要在各州注册，注册的条件则是高中毕业并至少在药学院学习三年。他们可能在医院或者药房工作，也可能自己开药房。",
    "本地小区，本地医生，医院和病人。能获得各种药品和化学品。",
    [
      skill("accounting", "会计"),
      skill("first_aid", "急救"),
      skill("lang_other_1", "外语", "拉丁文"),
      skill("library_use", "图书馆使用"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "制药"),
      skill("science_2", "科学", "化学"),
    ],
    [
      predefinedGroup(
        "occ-84-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（摄影），一项社交技能（取悦、话术、恐吓、说服），心理学，科学（化学），潜行，侦查，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    85,
    "摄影师-摄影师",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "摄影师大部分是自由工作者，可能制作广告电影或者在照相馆做肖像拍摄。其他一些摄像师则在报纸、电视和电影产业工作。\n摄影作为一种艺术形式已经产生相当长的时间了，精英的摄影师可以从艺术、新闻报道、野生动物保护等多种角度出发创作他们的作品。不管是哪种立意，他们都能获得名誉和报酬。\n摄影记者本质上就是拿照相机，为拍摄的照片写配文的记者。在1920 年代，新闻短片走上历史舞台。笨重的35mm 摄像装备走遍全球各地，搜寻有价值的新闻轶事、体育赛事和泳装选美比赛。新闻片制作人员一般分为三类：一类是画面中的记者，另两个人则负责摄像和灯光等等。新闻中的声音则是在新闻稿完成以后在录音棚中录入完成的。",
    "广告业，本地客户(包括政治团体和报纸)。",
    [
      skill("art_craft_1", "技艺", "摄影"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "化学"),
      skill("stealth", "潜行"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-85-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-85-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（摄影），攀爬，一项社交技能（取悦、话术、恐吓、说服），外语，心理学，科学（化学），任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    86,
    "摄影师-摄影记者",
    10,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "摄影师大部分是自由工作者，可能制作广告电影或者在照相馆做肖像拍摄。其他一些摄像师则在报纸、电视和电影产业工作。\n摄影作为一种艺术形式已经产生相当长的时间了，精英的摄影师可以从艺术、新闻报道、野生动物保护等多种角度出发创作他们的作品。不管是哪种立意，他们都能获得名誉和报酬。\n摄影记者本质上就是拿照相机，为拍摄的照片写配文的记者。在1920 年代，新闻短片走上历史舞台。笨重的35mm 摄像装备走遍全球各地，搜寻有价值的新闻轶事、体育赛事和泳装选美比赛。新闻片制作人员一般分为三类：一类是画面中的记者，另两个人则负责摄像和灯光等等。新闻中的声音则是在新闻稿完成以后在录音棚中录入完成的。",
    "新闻业，电影工作室(1920 年代)，外国政府和官方。",
    [
      skill("art_craft_1", "技艺", "摄影"),
      skill("climb", "攀爬"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "化学"),
    ],
    [
      predefinedGroup(
        "occ-86-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-86-lang-2", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-86-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：电气维修，机械维修，导航，操作重型机械，驾驶（飞行器），科学（天文），任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    87,
    "飞行员-飞行员",
    20,
    70,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "飞行员可以在美国邮政这样的企业工作，也可以在大大小小的民航公司做飞行人员。\n美国1926 年之前没有对飞行员的职业要求，1926 年航空商业法案通过之后才要求有执照。这个时代的多数飞行员从事嘉年华表演、特技飞行表演、乘飞机游玩或是小机场的空中的士等服务。\n也有飞行员在部队服现役。许多特技飞行员是在服役期间学会的驾驶飞机，有时仍然会被军队委派任务。",
    "前部队关系人，乘务员，机械师，机场地勤人员，嘉年华主办者。",
    [
      skill("elec_repair", "电气维修"),
      skill("mech_repair", "机械维修"),
      skill("navigate", "导航"),
      skill("heavy_machinery", "操作重型机械"),
      skill("pilot_1", "驾驶", "飞行器"),
      skill("science_1", "科学", "天文"),
    ],
    [
      anySkillGroup(
        "occ-87-any-1",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，电气维修，聆听，机械维修，导航，驾驶（飞行器），侦查，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    88,
    "飞行员-特技飞行员（古典）",
    30,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "特技飞行员在嘉年华工作或者为大胆的消费者进行休闲飞行服务。参加有组织的飞行表演赛，不论是固定路线还是越野赛，往往都可以增加自己的知名度。在1920 年代，好莱坞常常使用特技飞行员，飞机制造商也会录用一些飞行员为新机作测试。许多特技飞行员是在一次大战中掌握的飞行技术，所以许多人仍然在陆海空军或海岸警卫队服役；年轻的飞行员则基本上是在和平时期接受的训练或是自学成才。\n参加过一战的王牌飞行员“现在”还活跃在公众视野中的包括：埃迪·里肯巴克，现在在克赖斯勒公司工作；汤米·希区柯克，“现在”是马球赛场的明星；里德·兰迪斯，美国职棒大联盟执行长凯纳索·蒙顿·兰迪斯的儿子。",
    "前部队关系人，其他飞行员，机场地勤技术人员，商人。",
    [
      skill("accounting", "会计"),
      skill("elec_repair", "电气维修"),
      skill("listen", "聆听"),
      skill("mech_repair", "机械维修"),
      skill("navigate", "导航"),
      skill("pilot_1", "驾驶", "飞行器"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "occ-88-any-1",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（表演）或乔装，射击，法律，聆听，一项社交技能（取悦、话术、恐吓、说服），心理学，侦查，一项其他技能。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    89,
    "警方(原作向)-警探",
    20,
    50,
    [{ attribute: "EDU", multiplier: 2 }],
    "便衣警察的工作是检查犯罪现场、收集证据、询问证人以解决凶杀、盗窃等重大案件。他们在现场办案中往往与穿制服的巡警密切合作。\n警探可能指挥他的下属进行详尽的调查，但是很难有机会集中精力对付单独一个事件，在美国他们很可能要同时处理数十乃至上百的案件。警探工作最关键的部分是通过梳理证词、重建现场情况，摒弃伪证，从而收集足够逮捕嫌疑人的证据，进而促成成功的刑事审判。警探和检察官的职责是分开的，这样可以保证证据在审判之前被独立地对待。\n尽管现在警探通常会参加警察学校课程并获得学位、参加特殊训练或公务员培训，他们最主要的经验还是来源于担任基层警官或者普通巡警时的工作经历。",
    "执法机构，街头罪犯，尸检部门，司法部门，犯罪组织。",
    [
      skill("law", "法律"),
      skill("listen", "聆听"),
      skill("firearms_handgun", "射击", "手枪"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-89-choice-1", "技艺（表演）或乔装", 1, [
        skill("art_craft_1", "技艺（表演）", "表演"),
        skill("disguise", "乔装"),
      ]),
      predefinedGroup("occ-89-firearm-2", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup(
        "occ-89-social-3",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-89-any-4", "一项其他技能", 1, ANY_SKILL_OPTIONS),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：格斗，射击，急救，一项社交技能（取悦、话术、恐吓、说服），法律，心理学，侦查和下面的一种个人特长：汽车驾驶或骑乘。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    90,
    "警方(原作向)-巡警",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "巡警属于市、城镇、县治安部门或州、地区的警察机关。他们工作时可能步行、驾驶巡逻车，或者干脆坐办公室。",
    "执法机构，本地企业与居民，街头罪犯，犯罪组织。",
    [
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("first_aid", "急救"),
      skill("law", "法律"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-90-firearm-1", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup(
        "occ-90-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup(
        "occ-90-choice-3",
        "侦查和下面的一种个人特长：汽车驾驶或骑乘",
        1,
        [skill("ride", "骑术")],
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：技艺（摄影），乔装，法律，图书馆，一项社交技能（取悦、话术、恐吓、说服），心理学，侦查，一项其他个人或时代特长（如计算机、锁匠、格斗、射击）。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    91,
    "私家侦探",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "私家侦探通常在警察不出手的地方活跃，包括收集证据为客户准备民事诉讼，追查跑路的配偶或生意伙伴，或者代理刑事案件的私人辩护。他们和任何专业人员一样，私家侦探从不顾及自己的私人情感，只要付钱，不管是有罪还是无罪的一方的委托他们都乐得接受。\n私家侦探过去可能在警察队伍里工作，利用以前的业务关系为现在工作谋求优势；然而事实并非总是如此。在许多地方私家侦探必须持证上岗，假如被发现有违法行为，就会撤销执照——侦探生涯也就到此为止。",
    "执法机构，客户。",
    [
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("disguise", "乔装"),
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-91-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-91-any-2",
        "一项其他个人或时代特长（如计算机，锁匠，格斗，射击）",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：图书馆，外语，母语，心理学，任意四项其他学术、时代或个人特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    92,
    "教授（原作向）",
    20,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "教授是受聘于高等院校的学者。大公司也可 能聘请他们以开展学术研究与产品开发。独立的学者也靠开办业余课程作为经济来源。\n最重要的一点,这一职业代表了 PhD(博士) 的荣誉称号,意味着可以在世界各地的大学任终身教职。教授的专长是教学和专业研究,往往在自己的专业领域内有着可圈可点的学术成就。",
    "学者，大学，图书馆。",
    [
      skill("library_use", "图书馆使用"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-92-lang-1", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup("occ-92-any-2", "任意四项其他学术", 4, ANY_SKILL_OPTIONS),
      anySkillGroup("occ-92-any-3", "时代或个人特长", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：攀爬、急救、历史、机械维修、导航、科学（地质），侦查，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    93,
    "淘金客",
    0,
    10,
    [{ attribute: "EDU", multiplier: 2 }],
    "淘金客一直是美国西部的特色,即便在加利福尼亚淘金热和内华达康姆斯塔克发现金银矿的日子早已经过去的现在。他们无休止地在山间漫游,寻找能使自己一夜暴富的矿脉。而且现在发现石油和发现金子一样给力。",
    "本地企业和居民。",
    [
      skill("climb", "攀爬"),
      skill("first_aid", "急救"),
      skill("history", "历史"),
      skill("mech_repair", "机械维修"),
      skill("navigate", "导航"),
      skill("science_1", "科学", "地质"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "occ-93-any-1",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：技艺（任一），两项社交技能（取悦、话术、恐吓、说服），闪避，心理学，妙手，潜行，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    94,
    "性工作者",
    5,
    50,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "性工作者根据场合、背景和教养,从超级值钱的应召小姐到牛郎再到站街女都有可能。往往入这一行都是权宜之计,许多人梦想有朝一日能够脱身。少数人能够自己接客,不过绝大多数人 基本都是被只认钱不认人的老鸨和皮条客逼迫着 工作。",
    "街头路人，警察，可能有犯罪组织，私人客户。",
    [
      skill("dodge", "闪避"),
      skill("psychology", "心理学"),
      skill("sleight_of_hand", "妙手"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup("occ-94-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-94-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-94-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：外语，聆听，医学，说服，精神分析，心理学，科学（生物学，化学）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    95,
    "精神病学家",
    30,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "精神病学家是在现代专门从事精神失常诊断和治疗的医生。精神病学家掌握着精神药理学的 治疗方法,使用精神类药物的资质,还能整理脑电图并对其进行计算器分析。\n在十九二十世纪之交,精神分析理论刚刚产 生,试图解释一些现在认为实际上是生物学范畴的现象。所以,精神分析学家们努力寻求获得自 己的医疗证书。与此同时,各种不同的精神失常诊断与治疗理论开始起步。到 1930 年代,任何一个医生都可以以精神病学家的身份进入美国医学协会名录中了。",
    "其他精神疾病领域的专家，医生，可能有法律人士。",
    [
      skill("listen", "聆听"),
      skill("medicine", "医学"),
      skill("persuade", "说服"),
      skill("psychoanalysis", "精神分析"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "生物学"),
      skill("science_2", "科学", "化学"),
    ],
    [
      predefinedGroup("occ-95-lang-1", "外语", 1, LANGUAGE_OPTIONS),
    ],
  ),

  // TODO: 本职技能：会计，图书馆，聆听，说服，精神分析，心理学，任意两项其他学术、个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    96,
    "心理学家/精神分析学家",
    10,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "心理学家虽然也经常被叫做心理治疗师和心理咨询师,不过这些工作都只是心理学的分支。其他的还有为企业和政府提供顾问的组织管理心 理学家,进行研究并在学校教授心理学的学术型心理学家等等。\n临床心理学家可能实际接触病人,并且运用各种可能的心理治疗方法。注意心理学家和专业的精神病学家的区别,后者本质上还是医生。\n在1920 年代,对人类行为的研究还是一个新兴的领域,主要的理论还是弗洛伊德心理学。",
    "心理学家团体，病人。",
    [
      skill("accounting", "会计"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("persuade", "说服"),
      skill("psychoanalysis", "精神分析"),
      skill("psychology", "心理学"),
    ],
    [
      anySkillGroup("occ-96-any-1", "任意两项其他学术", 2, ANY_SKILL_OPTIONS),
      anySkillGroup("occ-96-any-2", "个人或时代特长", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：历史，图书馆，一项社交技能（取悦、话术、恐吓、说服），外语，侦查，任意三项其他学术领域。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    97,
    "研究员",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "学术界的研究课题不计其数,尤其是在天文 学、物理学和其他理论领域。私人或企业也雇用 了成千上万的研究员,重点在化学、制药和工程 领域。石油公司则会聘用专业的地质学家,不一 而足。研究员大部分的时间都在室内工作和写作, 不过有的则会经常外出考察。\n考察研究员通常经验丰富,思想独立又足智 多谋,可能受雇于私人或者为大学进行学术研究。\n石油公司会派出地质学家探索潜在的油田, 人类学家则是调查地球被人遗忘角落的原始部落, 考古学家则竭数年之力挖掘沙漠丛林之中的宝藏, 还要和工人与地方政府打交道。",
    "学者和其他学术界人士，大型企业，外国政府和个人。",
    [
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-97-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-97-lang-2", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-97-any-3",
        "任意三项其他学术领域",
        3,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：电工或机械维修，格斗，射击，急救，导航，驾驶（船），生存（海上），游泳。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    98,
    "海员-军舰海员",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "新入伍的海员像陆军的同行一样,开始时需 要接受基本的训练。这之后他们获得军衔,并被 分配到各镇守府。虽然很多海员担任像水手长副手和司炉工(管理引擎)这样的传统角色,但是也有很多经过专门训练的机械师、无线电操作员、通风管理员之类。海员们最高的军衔是士官长, 达到了这个军衔连高级将领都要礼让三分。在美国,海员通常要服四年的现役和后两年的后备役, 即在国家发布动员令时有应召服役的义务。",
    "军队，退伍军人协会。",
    [
      skill("first_aid", "急救"),
      skill("navigate", "导航"),
      skill("pilot_1", "驾驶", "船"),
      skill("survival", "生存", "海上"),
      skill("swim", "游泳"),
    ],
    [
      predefinedGroup("occ-98-choice-1", "电工或机械维修", 1, [
        skill("elec_repair", "电气维修"),
        skill("mech_repair", "机械维修"),
      ]),
      predefinedGroup("occ-98-fight-2", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-98-firearm-3", "射击", 1, FIREARM_OPTIONS),
    ],
  ),

  // TODO: 本职技能：急救，机械维修，自然，导航，一项社交技能（取悦、话术、恐吓、说服），驾驶（船），侦查，游泳。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    99,
    "海员-民船海员",
    20,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "民用船海员可能在渔船、客船,或运输原油或商品的运输船上工作。在美国,客船活跃在东西海岸和五大湖,运送渔民和游客。目前佛罗里达州在墨西哥湾和大西洋海岸拥有最多数量的客 船。\n在禁酒令期间,许多客船船长发现把急切想 喝酒的顾客运到 3 海里外,外国船只允许卖酒的地方是一桩赚钱的买卖。当然走私酒也报酬丰厚, 但是危险就高多了。",
    "海岸警卫队，走私者，犯罪组织。",
    [
      skill("first_aid", "急救"),
      skill("mech_repair", "机械维修"),
      skill("natural_world", "博物学"),
      skill("navigate", "导航"),
      skill("pilot_1", "驾驶", "船"),
      skill("spot_hidden", "侦查"),
      skill("swim", "游泳"),
    ],
    [
      predefinedGroup(
        "occ-99-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），汽车驾驶，聆听，心理学，潜行或妙手，一项其他技能。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    100,
    "推销员",
    9,
    40,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "推销员是商务工作的必需一环,他们的工作就是推广和销售公司的产品或服务。大部分推销员的时间要用来旅行、开会、和客户应酬(在报销限额之内)。有些则主要坐办公室用电话联系 潜在客户,还有的会在各小区巡回,挨家挨户上门推销。\n1920 年代是企业家的年代,旅行推销成了一种日常生活方式。这些人有些直接现货交易,有些通过托销交易,当然不管黑猫白猫,拿到订单的才是好猫,推销员要用强烈的销售策略才能说得客户,至于价钱就不是他们考虑的范围了。有些推销员在固定的地区工作,有些则可以自由漫 游,寻找任何地方可能出现的商机。如果是上门推销,那商品可能就是刷子、吸尘器或者百科全书之类的各种对象了。",
    "同行企业，感兴趣的顾客。",
    [
      skill("accounting", "会计"),
      skill("drive_auto", "汽车驾驶"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-100-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-100-choice-2", "潜行或妙手", 1, [
        skill("stealth", "潜行"),
        skill("sleight_of_hand", "妙手"),
      ]),
      anySkillGroup("occ-100-any-3", "一项其他技能", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：任意三项科学专业领域，计算机或图书馆，外语，母语，一项社交技能（取悦、话术、恐吓、说服），侦查。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    101,
    "科学家",
    9,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "科学家是在追求知识的过程中挖掘真理的人。如果想要利用科学知识制造有用的物品,需要的 是工程师;而如果想要扩展“可能”这个概念的范围,那就是科学家的工作了。\n科学家们通常在企业和大学工作,以进行他们的研究。\n虽然主攻一个科学领域,但是真正称职的科 学家一般也能达到通晓其他数个科学领域的水平。他们对自己的母语也能使用自如,学历也相当高, 甚至拥有博士学位。",
    "其他科学家和学术界人士，大学，所在企业和前员工。",
    [skill("lang_own", "母语"), skill("spot_hidden", "侦查")],
    [
      anySkillGroup(
        "occ-101-any-1",
        "任意三项科学专业领域",
        3,
        ANY_SKILL_OPTIONS,
      ),
      predefinedGroup("occ-101-choice-2", "计算机使用或图书馆", 1, [
        skill("computer_use", "计算机使用"),
        skill("library_use", "图书馆使用"),
      ]),
      predefinedGroup("occ-101-lang-3", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-101-social-4",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，技艺（打字或速记），两项社交技能（取悦、话术、恐吓、说服），母语，图书馆或计算机，心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷或外貌×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    102,
    "秘书",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "秘书的范围是从高薪的私人管理助理到普通的打字员。这份工作的重点在于以自己各种沟通 协调能力,支持主管和经理人员。\n因为身处企业流程的中心,许多秘书比老板对企业的内部运作和经营还要熟悉。\n在 1920 年代,秘书工作主要是通信工作,例如听写打印信件,整理文文件系统,并为老板安排 会议时间。有的情况下,秘书还会负责老板的生活, 比如安排假期、为老板和家人置办礼物,还有保 护老板的安全。",
    "其他办公室人员，客户公司的高管。",
    [
      skill("accounting", "会计"),
      skill("art_craft_1", "技艺（打字或速记）", "打字或速记"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-102-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-102-choice-2", "图书馆或计算机使用使用", 1, [
        skill("library_use", "图书馆使用"),
      ]),
      anySkillGroup(
        "occ-102-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "DEX", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），电气维修，聆听，机械维修，心理学，侦查。
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    103,
    "店老板",
    20,
    40,
    [{ attribute: "EDU", multiplier: 2 }],
    "店老板经营小店、市场摊位或者是小饭馆。这种店往往都是小本自营,不过也有为其他东家照顾生意的。不少店是家族式管理,工作人员大 部分都有亲属关系,其他的雇员即便有也很少。\n在 1920 年代,还有不少的老板娘开起了自己的理发店和帽店。",
    "本地的居民企业，本地警察，地方政府，顾客。",
    [
      skill("accounting", "会计"),
      skill("elec_repair", "电气维修"),
      skill("listen", "聆听"),
      skill("mech_repair", "机械维修"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-103-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：攀爬或游泳，闪避，格斗，射击，潜行，生存，下面任选两项：急救、机械维修、外语。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    104,
    "士兵/海军陆战队士兵",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "士兵指的是从列兵到士官长(美国军衔制) 的统称。尽管名义上比起最新的次级少尉还低, 即便高级军官也往往对他们给予尊重。在美国, 标准的服役期限是六年,包括四年现役和两年后 备役。\n所有应征人员首先要在“训练营(新兵连)” 接受基本训练,在训练营中新兵将学习如何行军、 射击和敬礼。结束训练营的训练后,大部分的新兵会分配到步兵营,虽然也有分配到炮兵营和坦 克营的。少部分会接受非战斗的训练,例如通风 系统、机械装备、文职甚至军官接待。海军陆战队名义上属于海军,但是和陆军士兵在背景、训练方式和技能方面都很相近。",
    "军队，退伍军人协会。",
    [
      skill("dodge", "闪避"),
      skill("stealth", "潜行"),
      skill("mech_repair", "机械维修"),
    ],
    [
      predefinedGroup("occ-104-choice-1", "攀爬或游泳", 1, [
        skill("climb", "攀爬"),
        skill("swim", "游泳"),
      ]),
      predefinedGroup("occ-104-fight-2", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-104-firearm-3", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup("occ-104-survival-4", "生存", 1, [
        skill("survival", "生存", "森林"),
        skill("survival", "生存", "海上"),
        skill("survival", "生存", "荒野"),
      ]),
      predefinedGroup("occ-104-prompt-5", "下面任选两项：急救", 2, [
        skill("first_aid", "急救"),
      ]),
      predefinedGroup("occ-104-lang-6", "外语", 1, LANGUAGE_OPTIONS),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：技艺（表演）或乔装，射击，聆听，外语，一项社交技能（取悦、话术、恐吓、说服），心理学，妙手，潜行。
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    105,
    "间谍",
    20,
    60,
    [{ attribute: "EDU", multiplier: 2 }],
    "间谍为国家和组织的情报部门卖命。他们能以从大使到厨房清洁工的任何职业身份作为掩饰,刺探他们所需的情报。有些间谍数年如一日的持续着卧底工作,另一些穿个马甲就换一个身份。\n在本国委任的间谍通常会去往外国工作。间谍除了情报收集和反情报收集的主要工作, 也会被委派其他任务,例如招募新间谍和国家批 准的暗杀等。",
    "一般只有自己的上线，可能还有其他的秘密关系人。",
    [
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("sleight_of_hand", "妙手"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup("occ-105-choice-1", "技艺（表演）或乔装", 1, [
        skill("art_craft_1", "技艺（表演）", "表演"),
        skill("disguise", "乔装"),
      ]),
      predefinedGroup("occ-105-firearm-2", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup("occ-105-lang-3", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-105-social-4",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：语言（母语或外语），图书馆，聆听，三个学习的专业，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    106,
    "学生/实习生",
    5,
    10,
    [{ attribute: "EDU", multiplier: 4 }],
    "学生可能在大学或学院学习,实习生则是正在接受宝贵的入职培训,获得最低报酬的公司员 工。",
    "学院、其他学生，实习生也可能有商人等。",
    [skill("library_use", "图书馆使用"), skill("listen", "聆听")],
    [
      predefinedGroup("occ-106-lang-1", "外语（母语或外语）", 1, [
        skill("lang_own", "母语"),
        skill("lang_other_1", "外语", "英语"),
        skill("lang_other_2", "外语", "法语"),
      ]),
      anySkillGroup("occ-106-any-2", "三个学习的专业", 1, ANY_SKILL_OPTIONS),
      anySkillGroup(
        "occ-106-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：攀爬，闪避，电气维修或机械维修，格斗，急救，跳跃，游泳，下面任选一项：潜水、汽车驾驶、驾驶（任一），骑乘。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    107,
    "替身演员",
    10,
    50,
    [{ attribute: "EDU", multiplier: 2 }],
    "替身演员在电影和电视剧工业中活跃,专门 模拟坠楼、车祸等灾难场景。他们通常会接受格 斗技巧和舞台格斗的训练。任何的替身特技表演 都是有风险的,所以健康和安全是这个工作的核心元素。\n在现代,替身演员基本都是工会的成员,想要加入工会,他们必须有证明自己能力的证书(例 如高级驾驶执照,潜水执照等等)。而且,所有 的特技场景还要有特技总监负责指导动作。但是在 1920 年代,这些演员组织、行业规范根本就没有成型,所以事故率和死亡率居高不下。",
    "电影和电视剧工作室，爆炸品和烟花生产企业，演员和导演。",
    [
      skill("climb", "攀爬"),
      skill("dodge", "闪避"),
      skill("first_aid", "急救"),
      skill("jump", "跳跃"),
      skill("swim", "游泳"),
      skill("drive_auto", "汽车驾驶"),
      skill("pilot_1", "驾驶"),
      skill("ride", "骑术"),
    ],
    [
      predefinedGroup("occ-107-choice-1", "电气维修或机械维修", 1, [
        skill("elec_repair", "电气维修"),
        skill("mech_repair", "机械维修"),
      ]),
      predefinedGroup("occ-107-fight-2", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-107-prompt-3", "下面任选一项：潜水", 1, [
        skill("diving", "潜水"),
      ]),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：攀爬，格斗或投掷，聆听，自然，神秘学，侦查，游泳，生存（任一）。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    108,
    "部落成员",
    0,
    15,
    [{ attribute: "EDU", multiplier: 2 }],
    "至少,从家族忠诚来说,部落文化无处不在。在部落中,亲属关系和传统习俗的首䙳地位是不言而喻的。一个部落通常来说是一个相对较小的群体。相比起法律和个人权利,部落更加依据个人荣耀而裁定行为。崇拜、复仇、嘉奖以及荣耀－－所有的一切都是部落成员个人所有的,而如果领袖或是仇敌被视为有荣耀的人,那么他们个人也必然在某种程度上十分有名。在这样的环境下, 放逐是有着实际的效用在的。",
    "其他部落成员。",
    [
      skill("climb", "攀爬"),
      skill("listen", "聆听"),
      skill("natural_world", "博物学"),
      skill("occult", "神秘学"),
      skill("spot_hidden", "侦查"),
      skill("swim", "游泳"),
    ],
    [
      predefinedGroup("occ-108-choice-1", "格斗或投掷", 1, [
        skill("fighting_brawl", "格斗", "斗殴"),
        skill("fighting_1", "格斗", "自定义"),
        skill("throw", "投掷"),
      ]),
      predefinedGroup("occ-108-survival-2", "生存（任一）", 1, [
        skill("survival", "生存", "森林"),
        skill("survival", "生存", "海上"),
        skill("survival", "生存", "荒野"),
      ]),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，汽车驾驶，一项社交技能（取悦、话术、恐吓、说服），历史，神秘学，心理学，科学（生物学，化学）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    109,
    "殡葬师",
    20,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "殡葬师又叫殡葬业者或葬礼主持人,是负责运行丧葬仪式的职业。工作也包含土葬和火化等内容。在葬礼上,殡葬师要进行防腐、裹衣、入殓、 遗体美容等等工作。\n殡葬师的执照由各州发放。他们可能自己拥有殡仪馆,或者在别人的殡仪馆工作。",
    "没有什么关系人。",
    [
      skill("accounting", "会计"),
      skill("drive_auto", "汽车驾驶"),
      skill("history", "历史"),
      skill("occult", "神秘学"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "生物学"),
      skill("science_2", "科学", "化学"),
    ],
    [
      predefinedGroup(
        "occ-109-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），格斗，法律，聆听，操作重型机械，心理学。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    110,
    "工会活动家",
    5,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "工会活动家是组织者、领导者,有时也是空 想者或者别有用心的抗议者,通常是工人的伙伴、 老板的对头。各行各业都有工会,不论是码头工人、 建筑工人、矿工还是演员。\n在 20 世纪早期,工会活动家所在的工会面临着诸多危险。大企业想要毁掉它,政治家在支持它和谴责它之间摇摆不定,社会主义者和共产主义者试图影响它,还有犯罪组织试图夺取它。",
    "其他劳动领袖,政治伙伴，可能有犯罪组织。在 1920 年代，还有社会主义者、 共产主义者、无政府主义者。",
    [
      skill("accounting", "会计"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("law", "法律"),
      skill("listen", "聆听"),
      skill("heavy_machinery", "操作重型机械"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-110-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，技艺（任一），闪避，聆听，两项社交技能（取悦、话术、恐吓、说服），心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    111,
    "服务生",
    9,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "服务生在酒店、酒吧或者其他餐饮业场所服务顾客。通常薪酬很低,不过通过对顾客良好服务, 可以得到他们给的小费。\n在禁酒令时期,售酒场所的服务员是非法职业。不过犯罪组织把控的地下酒吧中仍然存在许多工作机会。",
    "顾客，犯罪组织。",
    [
      skill("accounting", "会计"),
      skill("dodge", "闪避"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-111-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-111-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-111-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，语言，法律，图书馆或计算机，聆听，一项社交技能（取悦、话术、恐吓、说服），任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    112,
    "白领工人-职员/主管",
    9,
    20,
    [{ attribute: "EDU", multiplier: 4 }],
    "白领工人可能是从最低等级的白领职员到中层或高层的管理人员。所属单位则可能从小型中型的本地企业直到大型的国家级甚至跨国公司。\n职员被扣工资是家常便饭,工作也往往单调乏味。不过如果在工作中展现出了天分,那也会被看上,将来会得到提拔。",
    "其他办公室职员。",
    [
      skill("accounting", "会计"),
      skill("law", "法律"),
      skill("listen", "聆听"),
    ],
    [
      predefinedGroup("occ-112-lang-1", "语言", 1, [
        skill("lang_own", "母语"),
        skill("lang_other_1", "外语", "英语"),
        skill("lang_other_2", "外语", "法语"),
      ]),
      predefinedGroup("occ-112-choice-2", "图书馆或计算机使用使用", 1, [
        skill("library_use", "图书馆使用"),
      ]),
      predefinedGroup(
        "occ-112-social-3",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-112-any-4",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，外语，法律，两项社交技能（取悦、话术、恐吓、说服），心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    113,
    "白领工人-中高层管理人员",
    20,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "白领工人可能是从最低等级的白领职员到中层或高层的管理人员。所属单位则可能从小型中型的本地企业直到大型的国家级甚至跨国公司。\n中高层管理人员的工 资比较高,当然责任也比较重,要负责管理公司的日常事务。虽然未婚的白领并不少见,但很多管理人员还是很顾家,家里一般会有配偶和孩子——家庭通常是他们的期望。",
    "旧时大学同学，共济会和其他兄弟会组织，地方和联邦政府，媒体和销售人员。",
    [
      skill("accounting", "会计"),
      skill("law", "法律"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-113-lang-1", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-113-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-113-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：历史，两项社交技能（取悦、话术、恐吓、说服），心理学，潜行，任意三项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌或意志×2 (=EDU*2+MAX(APP*2,POW*2))
  occupation(
    114,
    "狂热者",
    0,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "热情而有动力、鄙视安逸的生活,狂热者们为人类更好的生活或者为人类中最精华部分的利益而躁动不安。一些狂热者通过暴力推进他们的信仰,但是并不能说采取和平方式的就比他们好说话,他们每个人都梦想着为自己的理想辩护。",
    "宗教或兄弟会团体，新闻媒体。",
    [
      skill("history", "历史"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup(
        "occ-114-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-114-any-2",
        "任意三项其他个人或时代特长",
        3,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "POW", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：驯兽，会计，闪避，急救，自然，医学，科学（制药，动物学）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    115,
    "饲养员",
    9,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "饲养员负责动物的喂养和看护,场地管理员和服务员管理其他杂务。通常饲养员会专门照看某一种动物,可以对动物使用「医学」技能。",
    "科学家，环保主义者。",
    [
      skill("animal_handling", "驯兽"),
      skill("accounting", "会计"),
      skill("dodge", "闪避"),
      skill("first_aid", "急救"),
      skill("natural_world", "博物学"),
      skill("medicine", "医学"),
      skill("science_1", "科学", "制药"),
      skill("science_2", "科学", "动物学"),
    ],
  ),

  // TODO: 本职技能：取悦，历史，恐吓，话术，聆听，母语，说服，心理学。(用一到两种外语取代前面两种技能)
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    116,
    "大使",
    50,
    90,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "联邦政府，新闻媒体，外国政府",
    [
      skill("charm", "取悦"),
      skill("history", "历史"),
      skill("intimidate", "恐吓"),
      skill("fast_talk", "话术"),
      skill("listen", "聆听"),
      skill("lang_own", "母语"),
      skill("persuade", "说服"),
      skill("psychology", "心理学"),
    ],
    [],
  ),

  // TODO: 本职技能：攀爬，跳跃，格斗，外语，一项社交技能（取悦、话术、恐吓、说服），游泳，投掷，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    117,
    "运动员（游泳/潜水）",
    9,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "体育界，体育专栏作家，其他明星。",
    [
      skill("climb", "攀爬"),
      skill("jump", "跳跃"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("swim", "游泳"),
      skill("throw", "投掷"),
    ],
    [
      predefinedGroup("occ-117-lang-1", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-117-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-117-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：攀爬，跳跃，格斗，骑术，一项社交技能（取悦、话术、恐吓、说服），游泳，投掷，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    118,
    "运动员（高尔夫）",
    50,
    70,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "其他高尔夫球手，体育专栏作家，俱乐部同好。",
    [
      skill("climb", "攀爬"),
      skill("jump", "跳跃"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("ride", "骑术"),
      skill("swim", "游泳"),
      skill("throw", "投掷"),
    ],
    [
      predefinedGroup(
        "occ-118-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-118-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：跳跃，格斗，闪避，一项社交技能（取悦、话术、恐吓、说服），心理学，侦察，投掷，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    119,
    "运动员（网球）",
    30,
    70,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "其他网球选手，体育专栏作家，俱乐部同好。",
    [
      skill("jump", "跳跃"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("dodge", "闪避"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
      skill("throw", "投掷"),
    ],
    [
      predefinedGroup(
        "occ-119-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-119-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：攀爬，跳跃，格斗，外语，一项社交技能（取悦、话术、恐吓、说服），闪避，投掷，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    120,
    "运动员（田径）",
    9,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "其他田径选手，体育专栏作家。",
    [
      skill("climb", "攀爬"),
      skill("jump", "跳跃"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("dodge", "闪避"),
      skill("throw", "投掷"),
    ],
    [
      predefinedGroup("occ-120-lang-1", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-120-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-120-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：乔装，闪避，三项社交技能（取悦、话术、恐吓、说服），心理学，外语，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    121,
    "发言人",
    50,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "政府官员，企业家，可能的犯罪组织",
    [
      skill("disguise", "乔装"),
      skill("dodge", "闪避"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-121-social-1",
        "三项社交技能（取悦，话术，恐吓，说服）",
        3,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-121-lang-2", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-121-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），法律，图书馆，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    122,
    "保释担保人",
    50,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "警察，法庭，街头路人，犯罪组织，赏金猎人。",
    [
      skill("accounting", "会计"),
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-122-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-122-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，母语，外语(拉丁文)，图书馆，神秘学，一项社交技能（取悦、话术、恐吓、说服），心理学，任意一项其他技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    123,
    "神职人员(天主教牧师)",
    20,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "教会高层、地方教会、小区领导。",
    [
      skill("accounting", "会计"),
      skill("lang_own", "母语"),
      skill("lang_other_1", "外语", "拉丁文"),
      skill("library_use", "图书馆使用"),
      skill("occult", "神秘学"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-123-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-123-any-2", "任意一项其他技能", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：会计，历史，图书馆，聆听，外语，一项社交技能（取悦、话术、恐吓、说服），心理学，任意一项其他技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    124,
    "神职人员(新教牧师)",
    9,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "教会高层、地方教会、小区领导。",
    [
      skill("accounting", "会计"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-124-lang-1", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-124-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-124-any-3", "任意一项其他技能", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：母语，外语（希伯来语），历史，图书馆，神秘学，一项社交技能（取悦、话术、恐吓、说服），心理学，任意一项其他技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    125,
    "神职人员(犹太教拉比)",
    9,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "犹太学者，地方犹太人团体",
    [
      skill("lang_own", "母语"),
      skill("lang_other_1", "外语", "希伯来语"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("occult", "神秘学"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-125-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-125-any-2", "任意一项其他技能", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：乔装，一项社交技能（取悦、话术、恐吓、说服），历史或图书馆，母语，外语，心理学，潜行。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    126,
    "专栏作家",
    30,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "世界传媒业，外国政府，军队或者其他。",
    [
      skill("disguise", "乔装"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup(
        "occ-126-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-126-choice-2", "历史或图书馆", 1, [
        skill("history", "历史"),
        skill("library_use", "图书馆使用"),
      ]),
      predefinedGroup("occ-126-lang-3", "外语", 1, LANGUAGE_OPTIONS),
    ],
  ),

  // TODO: 本职技能：格斗，两项社交技能（取悦、话术、恐吓、说服），射击（手枪），外语，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌或意志×2 (=EDU*2+MAX(APP*2,POW*2))
  occupation(
    127,
    "社会主义者/激进主义者",
    0,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "其他激进分子，艺术家和作家，工会。",
    [
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("firearms_handgun", "射击", "手枪"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-127-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-127-lang-2", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-127-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "POW", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：母语，艺术（文学），两项社交技能（取悦、话术、恐吓、说服），历史，图书馆，聆听，心理学。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    128,
    "撰稿人",
    20,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "地方新闻业，记者和特别的编辑。",
    [
      skill("lang_own", "母语"),
      skill("art_craft_1", "技艺（文学）", "文学"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-128-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计,两项社交技能（取悦、话术、恐吓、说服）,心理学，侦察，妙手，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷或外貌×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    129,
    "罪犯（赌博庄家）",
    50,
    80,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "犯罪组织，赌徒，警察，体育界",
    [
      skill("accounting", "会计"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
      skill("sleight_of_hand", "妙手"),
    ],
    [
      predefinedGroup(
        "occ-129-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-129-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "DEX", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，估价，两项社交技能（取悦、话术、恐吓、说服）,心理学，侦察，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷或外貌×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    130,
    "罪犯（放高利贷者）",
    50,
    80,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "犯罪组织，赌徒，警察，欠自己债的人。",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-130-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-130-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "DEX", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：乔装，一项社交技能（取悦、话术、恐吓、说服）,潜行，聆听，心理学，侦察，妙手，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    131,
    "罪犯（扒手）",
    9,
    30,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "路人，也有一些从前打过交道的警察。",
    [
      skill("disguise", "乔装"),
      skill("stealth", "潜行"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
      skill("sleight_of_hand", "妙手"),
    ],
    [
      predefinedGroup(
        "occ-131-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-131-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，法律，图书馆，聆听，说服，侦察，任意其他两项个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    132,
    "罪犯（地下钱庄）",
    30,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "犯罪组织，金融业界，地方检察官和法官。",
    [
      skill("accounting", "会计"),
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("persuade", "说服"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "occ-132-any-1",
        "任意其他两项个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，法律，图书馆，两项社交技能（取悦、话术、恐吓、说服），心理学，两项其他技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    133,
    "罪犯（黑律师）",
    30,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "犯罪组织，金融业界，地方检察官和法官。",
    [
      skill("accounting", "会计"),
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-133-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-133-any-2", "两项其他技能", 2, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：急救、医学、外语（拉丁文）、心理学、科学（生物学，制药），任两种其他学术或个人特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    134,
    "牙医",
    30,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "其他医生，医护工作者，病人和前病人。",
    [
      skill("first_aid", "急救"),
      skill("medicine", "医学"),
      skill("lang_other_1", "外语", "拉丁文"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "生物学"),
      skill("science_2", "科学", "制药"),
    ],
    [
      anySkillGroup(
        "occ-134-any-2",
        "任两种其他学术或个人特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：急救、医学、外语（拉丁文）、心理学、科学（生物学，制药），任两种其他学术或个人特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    135,
    "外科医生/内科医生",
    50,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "其他医生，医护工作者，病人和前病人。",
    [
      skill("first_aid", "急救"),
      skill("medicine", "医学"),
      skill("lang_other_1", "外语", "拉丁文"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "生物学"),
      skill("science_2", "科学", "制药"),
    ],
    [
      anySkillGroup(
        "occ-135-any-2",
        "任两种其他学术或个人特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：急救、医学、外语（拉丁文）、心理学、科学（生物学，制药），任两种其他学术或个人特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    136,
    "整形医生",
    30,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "医疗专家，好莱坞，可能有罪犯。",
    [
      skill("first_aid", "急救"),
      skill("medicine", "医学"),
      skill("lang_other_1", "外语", "拉丁文"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "生物学"),
      skill("science_2", "科学", "制药"),
    ],
    [
      anySkillGroup(
        "occ-136-any-2",
        "任两种其他学术或个人特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，汽车驾驶，电气维修，机械维修，领航，一项社交技能（取悦、话术、恐吓、说服），心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    137,
    "司机-公交司机",
    30,
    50,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "很少。",
    [
      skill("accounting", "会计"),
      skill("drive_auto", "汽车驾驶"),
      skill("elec_repair", "电气维修"),
      skill("mech_repair", "机械维修"),
      skill("navigate", "导航"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-137-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-137-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，攀爬或跳跃，急救，图书馆，外语，一项社交技能（取悦、话术、恐吓、说服），两项研究领域相关技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    138,
    "实地调研员",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "学界的其他学者，研究基金会，新闻媒体，外国政府官员。",
    [
      skill("accounting", "会计"),
      skill("first_aid", "急救"),
      skill("library_use", "图书馆使用"),
    ],
    [
      predefinedGroup("occ-138-choice-1", "攀爬或跳跃", 1, [
        skill("climb", "攀爬"),
        skill("jump", "跳跃"),
      ]),
      predefinedGroup("occ-138-lang-2", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-138-social-3",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-138-any-4",
        "两项研究领域相关技能",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术/工艺(任一,如摄影)，攀爬，汽车驾驶，电气维修，机械维修，一项社交技能（取悦、话术、恐吓、说服），任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋意志或敏捷×2 (=EDU*2+MAX(DEX*2,POW*2))
  occupation(
    139,
    "电影摄制人员",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "电影业，相关公会。",
    [
      skill("climb", "攀爬"),
      skill("drive_auto", "汽车驾驶"),
      skill("elec_repair", "电气维修"),
      skill("mech_repair", "机械维修"),
    ],
    [
      predefinedGroup("occ-139-art-1", "技艺（任一，如摄影）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-139-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-139-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "POW", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：艺术（摄影），医学，法律，科学（化学，司法科学，药学），侦察，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    140,
    "司法科学家",
    30,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "执法部门，地方实验室和化学品供应商",
    [
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("medicine", "医学"),
      skill("law", "法律"),
      skill("spot_hidden", "侦查"),
      skill("science_1", "科学", "化学"),
      skill("science_2", "科学", "司法科学"),
      skill("science_3", "科学", "药学"),
    ],
    [
      anySkillGroup(
        "occ-140-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，格斗，闪避，两项社交技能（取悦、话术、恐吓、说服），急救，心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    141,
    "运动经理",
    20,
    70,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "体育界，体育专栏作家，运动员时期的朋友。",
    [
      skill("accounting", "会计"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("dodge", "闪避"),
      skill("first_aid", "急救"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-141-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-141-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：人类学，攀爬，电气维修或机械维修，跳跃，操作重型机械，外语，生存（海上），任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    142,
    "商船队船员",
    20,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "海员公会，走私者。",
    [
      skill("anthropology", "人类学"),
      skill("climb", "攀爬"),
      skill("jump", "跳跃"),
      skill("heavy_machinery", "操作重型机械"),
      skill("survival", "生存", "海上"),
    ],
    [
      predefinedGroup("occ-142-choice-1", "电气维修或机械维修", 1, [
        skill("elec_repair", "电气维修"),
        skill("mech_repair", "机械维修"),
      ]),
      predefinedGroup("occ-142-lang-2", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-142-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，技艺（乐器），一项社交技能（取悦、话术、恐吓、说服），聆听，心理学，三项其他技能。
  // TODO: 职业属性：教育×2＋意志或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    143,
    "古典音乐家",
    30,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "其他音乐家，音乐家公会，赞助人。",
    [
      skill("accounting", "会计"),
      skill("art_craft_1", "技艺（乐器）", "乐器"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-143-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-143-any-2", "三项其他技能", 3, ANY_SKILL_OPTIONS),
    ],
    [
      { attribute: "POW", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：汽车驾驶，电气维修，机械维修，驾驶（船），心理学，侦察，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    144,
    "赛车手/ 赛艇手",
    70,
    70,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "汽车业/ 船舶业，电影行业。",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("elec_repair", "电气维修"),
      skill("mech_repair", "机械维修"),
      skill("pilot_1", "驾驶", "船"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "occ-144-any-1",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（表演），母语，取悦，话术，说服，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    145,
    "电台播音员",
    80,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "广播新闻界，可能有好莱坞，根据广播节目的内容决定。",
    [
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("lang_own", "母语"),
      skill("charm", "取悦"),
      skill("fast_talk", "话术"),
      skill("persuade", "说服"),
      skill("psychology", "心理学"),
    ],
    [
      anySkillGroup(
        "occ-145-any-1",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），汽车驾驶，聆听，心理学，潜行或妙手，一项其他技能。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    146,
    "推销员（圣经推销员）",
    40,
    40,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "信教顾客。",
    [
      skill("accounting", "会计"),
      skill("drive_auto", "汽车驾驶"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-146-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-146-choice-2", "潜行或妙手", 1, [
        skill("stealth", "潜行"),
        skill("sleight_of_hand", "妙手"),
      ]),
      anySkillGroup("occ-146-any-3", "一项其他技能", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），汽车驾驶，领航，聆听，心理学，一项其他技能。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    147,
    "推销员（旅行推销员）",
    30,
    30,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "很少。",
    [
      skill("accounting", "会计"),
      skill("drive_auto", "汽车驾驶"),
      skill("navigate", "导航"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-147-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-147-any-2", "一项其他技能", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），心理学，四项经营业务相关技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    148,
    "小企业家",
    50,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "业务相关人士：银行家，供货商，顾客，等等。",
    [skill("accounting", "会计"), skill("psychology", "心理学")],
    [
      predefinedGroup(
        "occ-148-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-148-any-2",
        "四项经营业务相关技能",
        4,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术/ 工艺（任一），母语，两项社交技能（取悦、话术、恐吓、说服），乔装，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    149,
    "舞台工作人员",
    9,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "演剧业，演员公会。",
    [
      skill("lang_own", "母语"),
      skill("disguise", "乔装"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-149-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-149-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-149-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，估价，母语，两项社交技能（取悦、话术、恐吓、说服），心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    150,
    "证券经纪人",
    60,
    90,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "商界，饥渴的投资人。",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-150-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-150-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，艺术（摄影），图书馆，博物学，领航，生存（任一），侦察，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    151,
    "勘测员",
    20,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "州和地方档案局。",
    [
      skill("accounting", "会计"),
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("library_use", "图书馆使用"),
      skill("natural_world", "博物学"),
      skill("navigate", "导航"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-151-survival-1", "生存（任一）", 1, [
        skill("survival", "生存", "森林"),
        skill("survival", "生存", "海上"),
        skill("survival", "生存", "荒野"),
      ]),
      anySkillGroup(
        "occ-151-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：母语，外语，两项社交技能（取悦、话术、恐吓、说服），聆听，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    152,
    "电话接线员",
    20,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "同事，不过他们可以听到对话的内容，从而掌握公司的情报。",
    [
      skill("lang_own", "母语"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-152-lang-1", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-152-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-152-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），法律，心理学，侦察，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    153,
    "星探",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "出版业，电影业等等。",
    [
      skill("accounting", "会计"),
      skill("law", "法律"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-153-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-153-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（摄影），电气维修，图书馆，机械维修，医学，科学（生物，化学，药学）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    154,
    "医疗技术员",
    30,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "医院和医疗机构实验室器械、药品、化学品。",
    [
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("elec_repair", "电气维修"),
      skill("library_use", "图书馆使用"),
      skill("mech_repair", "机械维修"),
      skill("medicine", "医学"),
      skill("science_1", "科学", "生物"),
      skill("science_2", "科学", "化学"),
      skill("science_3", "科学", "药学"),
    ],
  ),

  // TODO: 本职技能：两项社交技能（取悦、话术、恐吓、说服），急救，医学，科学（药学），心理学，侦察，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    155,
    "队医",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "体育界。",
    [
      skill("first_aid", "急救"),
      skill("medicine", "医学"),
      skill("science_1", "科学", "药学"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-155-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-155-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：估价，攀爬，汽车驾驶或驾驶（飞行器或船），电气维修或机械维修，历史，跳跃，一项社交技能（取悦、话术、恐吓、说服），侦察。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    156,
    "寻宝猎人",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁的呼唤调查员伴侣》职业，使用前请征得KP同意。",
    "投资者，寻宝猎人伙伴，地方政府，外国政府，海岸卫队，地方执法部门。",
    [
      skill("appraise", "估价"),
      skill("climb", "攀爬"),
      skill("history", "历史"),
      skill("jump", "跳跃"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-156-choice-1", "汽车驾驶或驾驶（飞行器或船）", 1, [
        skill("drive_auto", "汽车驾驶"),
        skill("pilot_1", "驾驶", "飞行器"),
        skill("pilot_1", "驾驶", "船"),
      ]),
      predefinedGroup("occ-156-choice-2", "电气维修或机械维修", 1, [
        skill("elec_repair", "电气维修"),
        skill("mech_repair", "机械维修"),
      ]),
      predefinedGroup(
        "occ-156-social-3",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：汽车驾驶，射击（任一），格斗（斗殴，鞭），法律，说服或心理学，骑术，追踪。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    157,
    "西部治安官",
    20,
    50,
    [{ attribute: "EDU", multiplier: 2 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "地方官员，本地居民，本地罪犯。",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("fighting_1", "格斗", "鞭"),
      skill("firearms_1", "射击"),
      skill("law", "法律"),
      skill("ride", "骑术"),
      skill("track", "追踪"),
    ],
    [
      predefinedGroup("occ-157-choice-1", "说服或心理学", 1, [
        skill("persuade", "说服"),
        skill("psychology", "心理学"),
      ]),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：格斗，汽车驾驶，机械维修，话术，恐吓，任意三项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    158,
    "暴走族",
    5,
    10,
    [{ attribute: "EDU", multiplier: 2 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "黑帮，其他暴走族和警察。",
    [
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("drive_auto", "汽车驾驶"),
      skill("mech_repair", "机械维修"),
      skill("fast_talk", "话术"),
      skill("intimidate", "恐吓"),
    ],
    [
      anySkillGroup(
        "occ-158-any-1",
        "任意三项其他个人或时代特长",
        3,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：艺术（书法），历史或图书馆，外语（汉语或梵语），学问（佛教），一项社交技能（取悦、话术、恐吓、说服），心理学，聆听，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    159,
    "神职人员(和尚,尼姑)",
    5,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "社区领袖，殡葬业者等。",
    [
      skill("art_craft_1", "技艺（书法）", "书法"),
      skill("lore", "学问（佛教）", "佛教"),
      skill("psychology", "心理学"),
      skill("listen", "聆听"),
    ],
    [
      predefinedGroup("occ-159-choice-1", "历史或图书馆", 1, [
        skill("history", "历史"),
        skill("library_use", "图书馆使用"),
      ]),
      predefinedGroup("occ-159-lang-2", "外语（汉语或梵语）", 1, [
        skill("lang_other_1", "外语", "汉语"),
        skill("lang_other_2", "外语", "梵语"),
      ]),
      predefinedGroup(
        "occ-159-social-3",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-159-any-4",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（书法，另任一），图书馆，神秘学，学问（神道教），一项社交技能（取悦、话术、恐吓、说服），心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    160,
    "神职人员(神官,巫女)",
    20,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "教会高层、地方教会、小区领导。",
    [
      skill("art_craft_1", "技艺（书法）", "书法"),
      skill("library_use", "图书馆使用"),
      skill("occult", "神秘学"),
      skill("lore", "学问（神道教）", "神道教"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-160-art-1", "技艺（书法，另任一）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-160-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-160-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（任一），图书馆，神秘学，学问（道教），一项社交技能（取悦、话术、恐吓、说服），科学（天文，地质），任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    161,
    "风水师",
    20,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "",
    [
      skill("library_use", "图书馆使用"),
      skill("occult", "神秘学"),
      skill("lore", "学问（道教）", "道教"),
      skill("science_1", "科学", "天文"),
      skill("science_2", "科学", "地质"),
    ],
    [
      predefinedGroup("occ-161-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-161-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-161-any-4",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：格斗，博物学，神秘学，学问（佛教或神道教），心理学，潜行，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    162,
    "家传降妖人",
    9,
    20,
    [{ attribute: "EDU", multiplier: 2 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "",
    [
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("natural_world", "博物学"),
      skill("occult", "神秘学"),
      skill("lore", "学问（佛教或神道教）", "佛教或神道教"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
    ],
    [
      anySkillGroup(
        "occ-162-any-1",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：攀爬、潜行、跳跃、图书馆、格斗（任一）、母语、科学（任一）或历史、外语（英语或其他）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    163,
    "高中生(教育60以下)",
    5,
    10,
    [{ attribute: "EDU", multiplier: 4 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "其他学生，教师。",
    [
      skill("climb", "攀爬"),
      skill("stealth", "潜行"),
      skill("jump", "跳跃"),
      skill("library_use", "图书馆使用"),
      skill("fighting_1", "格斗"),
      skill("lang_own", "母语"),
    ],
    [
      predefinedGroup("occ-163-choice-1", "科学（任一）或历史", 1, [
        skill("science_1", "科学"),
        skill("history", "历史"),
      ]),
      predefinedGroup("occ-163-lang-2", "外语（英语或其他）", 1, [
        skill("lang_other_1", "外语", "英语"),
        skill("lang_other_2", "外语", "其他"),
      ]),
    ],
  ),

  // TODO: 本职技能：艺术（表演），聆听，学问（神道教），神秘学，历史，话术或说服，心理学，任意一项特长。※经KP同意，可以用「灵媒」技能代替一项自选技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    164,
    "市子（盲人）",
    5,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("listen", "聆听"),
      skill("lore", "学问（神道教）", "神道教"),
      skill("occult", "神秘学"),
      skill("history", "历史"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-164-choice-1", "话术或说服", 1, [
        skill("fast_talk", "话术"),
        skill("persuade", "说服"),
      ]),
      anySkillGroup("occ-164-any-2", "任意一项特长", 1, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：艺术（书法，另任一），历史或图书馆，母语，学问（阴阳道），科学（天文），神秘学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    165,
    "言灵师/阴阳师",
    9,
    20,
    [{ attribute: "EDU", multiplier: 4 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺", "书法"),
      skill("art_craft_2", "技艺"),
      skill("lang_own", "母语"),
      skill("lore", "学问", "阴阳道"),
      skill("science_1", "科学", "天文"),
      skill("occult", "神秘学"),
    ],
    [
      predefinedGroup("occ-165-choice-2", "历史或图书馆", 1, [
        skill("history", "历史"),
        skill("library_use", "图书馆使用"),
      ]),
      anySkillGroup(
        "occ-165-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：图书馆，医学，神秘学，科学（化学），博物学，学问（道教），外语（汉语），急救或精神分析。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    166,
    "炼丹师",
    30,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "",
    [
      skill("library_use", "图书馆使用"),
      skill("medicine", "医学"),
      skill("occult", "神秘学"),
      skill("science_1", "科学", "化学"),
      skill("natural_world", "博物学"),
      skill("lore", "学问", "道教"),
      skill("lang_other_1", "外语", "汉语"),
    ],
    [
      predefinedGroup("occ-166-choice-1", "急救或精神分析", 1, [
        skill("first_aid", "急救"),
        skill("psychoanalysis", "精神分析"),
      ]),
    ],
  ),

  // TODO: 本职技能：历史，聆听，母语，心理学，两项社交技能（取悦、话术、恐吓、说服），任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    167,
    "外语教师",
    30,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "语言学校，学生和其他教育者。",
    [
      skill("history", "历史"),
      skill("listen", "聆听"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-167-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-167-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：乔装，话术，聆听，侦察，潜行，妙手，心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    168,
    "非法移民",
    0,
    5,
    [{ attribute: "EDU", multiplier: 2 }],
    "《日本秘史》职业，使用前请征得KP同意。",
    "其他非法移民，蛇头。",
    [
      skill("disguise", "乔装"),
      skill("fast_talk", "话术"),
      skill("listen", "聆听"),
      skill("spot_hidden", "侦查"),
      skill("stealth", "潜行"),
      skill("sleight_of_hand", "妙手"),
      skill("psychology", "心理学"),
    ],
    [
      anySkillGroup(
        "occ-168-any-1",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：闪避，格斗，恐吓，跳跃，心理学，侦察，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋力量×2 (=EDU*2+STR*2)
  occupation(
    169,
    "相扑力士",
    9,
    60,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "STR", multiplier: 2 },
    ],
    "《日本秘史》职业，使用前请征得KP同意。",
    "",
    [
      skill("dodge", "闪避"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("intimidate", "恐吓"),
      skill("jump", "跳跃"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "occ-169-any-1",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：机械维修，操作重型机械，游泳，驾驶（船），科学（天文），领航，博物学，侦察。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    170,
    "渔民",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "日系特定规则《克苏鲁2010》职业，使用前请征得KP同意。",
    "地方渔业部门，海警，养殖业者，潜水员。",
    [
      skill("mech_repair", "机械维修"),
      skill("heavy_machinery", "操作重型机械"),
      skill("swim", "游泳"),
      skill("pilot_1", "驾驶", "船"),
      skill("science_1", "科学", "天文"),
      skill("navigate", "导航"),
      skill("natural_world", "博物学"),
      skill("spot_hidden", "侦查"),
    ],
    [],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：艺术（任一），两项社交技能（取悦、话术、恐吓、说服），法律，外语，心理学，精神分析，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    171,
    "心理治疗师",
    30,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2010》职业，使用前请征得KP同意。",
    "精神病学家，心理学家，患者和咨询顾客，企业与学校等。",
    [
      skill("law", "法律"),
      skill("psychology", "心理学"),
      skill("psychoanalysis", "精神分析"),
    ],
    [
      predefinedGroup("occ-171-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-171-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-171-lang-3", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-171-any-4",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：一项社交技能（取悦、话术、恐吓、说服），自行车驾驶，急救，聆听，艺术/ 工艺（任一），图书馆，格斗（矛）或射击（弓），外语（任一）。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    172,
    "女学生",
    5,
    10,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁与帝国》职业，使用前请征得KP同意。",
    "",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("first_aid", "急救"),
      skill("listen", "聆听"),
      skill("library_use", "图书馆使用"),
    ],
    [
      predefinedGroup(
        "occ-172-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-172-art-2", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup("occ-172-choice-3", "格斗（矛）或射击（弓）", 1, [
        skill("fighting_1", "格斗", "矛"),
        skill("firearms_1", "射击", "弓"),
      ]),
      predefinedGroup("occ-172-lang-4", "外语（任一）", 1, LANGUAGE_OPTIONS),
    ],
  ),

  // TODO: 本职技能：急救，会计，手艺（木匠），说服，图书馆，外语（任一），任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    173,
    "寄居学生",
    5,
    10,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁与帝国》职业，使用前请征得KP同意。",
    "寄宿家庭，赞助人，同乡会等。",
    [
      skill("first_aid", "急救"),
      skill("accounting", "会计"),
      skill("art_craft_1", "技艺（木匠）", "木匠"),
      skill("persuade", "说服"),
      skill("library_use", "图书馆使用"),
    ],
    [
      predefinedGroup("occ-173-lang-1", "外语（任一）", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-173-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：聆听，心理学，精神分析，科学（动物学），跳跃，追踪，博物学，任意一项其他个人或时代特长。 跳跃，追踪，博物学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌或意志×2 (=EDU*2+MAX(APP*2,POW*2))
  occupation(
    174,
    "动物辅助治疗师",
    30,
    50,
    [{ attribute: "EDU", multiplier: 2 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("psychoanalysis", "精神分析"),
      skill("science_1", "科学", "动物学"),
      skill("jump", "跳跃"),
      skill("track", "追踪"),
      skill("natural_world", "博物学"),
      skill("track", "追踪"),
      skill("natural_world", "博物学"),
    ],
    [
      anySkillGroup(
        "occ-174-any-1",
        "任意一项其他个人或时代特长。 跳跃",
        1,
        ANY_SKILL_OPTIONS,
      ),
      anySkillGroup(
        "occ-174-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "POW", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：医学，急救，科学（化学），锁匠，机械维修，电气维修，攀爬，跳跃。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    175,
    "急诊医生/救援队员",
    10,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("medicine", "医学"),
      skill("first_aid", "急救"),
      skill("science_1", "科学", "化学"),
      skill("locksmith", "锁匠"),
      skill("mech_repair", "机械维修"),
      skill("elec_repair", "电气维修"),
      skill("climb", "攀爬"),
      skill("jump", "跳跃"),
    ],
    [],
  ),

  // TODO: 本职技能：医学，急救，会计，一项社交技能（取悦、话术、恐吓、说服），法律，科学（药学），外语，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    176,
    "密医",
    10,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("medicine", "医学"),
      skill("first_aid", "急救"),
      skill("accounting", "会计"),
      skill("law", "法律"),
      skill("science_1", "科学", "药学"),
    ],
    [
      predefinedGroup(
        "occ-176-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-176-lang-2", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-176-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（摄影），医学，法律，科学（化学，司法科学，药学），侦察，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    177,
    "科学搜查研究员",
    30,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "执法部门，地方实验室和化学品供应商",
    [
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("medicine", "医学"),
      skill("law", "法律"),
      skill("spot_hidden", "侦查"),
      skill("science_1", "科学", "化学"),
      skill("science_2", "科学", "司法科学"),
      skill("science_3", "科学", "药学"),
    ],
    [
      anySkillGroup(
        "occ-177-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：急救，聆听，跳跃，追踪，攀爬，领航，生存（山地），外语。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    178,
    "山岳救援队员",
    10,
    50,
    [{ attribute: "EDU", multiplier: 2 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("first_aid", "急救"),
      skill("listen", "聆听"),
      skill("jump", "跳跃"),
      skill("track", "追踪"),
      skill("climb", "攀爬"),
      skill("navigate", "导航"),
      skill("survival", "生存", "山地"),
    ],
    [predefinedGroup("occ-178-lang-1", "外语", 1, LANGUAGE_OPTIONS)],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：技艺（表演类，如表演、演唱、喜剧等），乔装，两项社交技能（取悦、话术、恐吓、说服），聆听，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    179,
    "舞者",
    9,
    70,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("disguise", "乔装"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-179-art-1",
        "技艺（表演类，如表演，演唱，喜剧等）",
        1,
        ART_OPTIONS,
      ),
      predefinedGroup(
        "occ-179-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-179-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，技艺（摄影），技艺（任一），计算机或图书馆，乔装，心理学，侦察，任意一项其他个人特长。※可以通过成功的「侦察」检定，从对方的服饰判定其地位和收入等。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    180,
    "服装设计师",
    20,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("accounting", "会计"),
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("disguise", "乔装"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-180-art-1", "技艺（任一）", 1, ART_OPTIONS),
      predefinedGroup("occ-180-choice-2", "计算机使用或图书馆", 1, [
        skill("computer_use", "计算机使用"),
        skill("library_use", "图书馆使用"),
      ]),
      anySkillGroup(
        "occ-180-any-3",
        "任意一项其他个人特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：电气维修或机械维修，格斗，射击，急救，领航，驾驶（船），生存（海上），游泳。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    181,
    "海上自卫队员",
    9,
    30,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("first_aid", "急救"),
      skill("navigate", "导航"),
      skill("pilot_1", "驾驶", "船"),
      skill("survival", "生存", "海上"),
      skill("swim", "游泳"),
    ],
    [
      predefinedGroup("occ-181-choice-1", "电气维修或机械维修", 1, [
        skill("elec_repair", "电气维修"),
        skill("mech_repair", "机械维修"),
      ]),
      predefinedGroup("occ-181-fight-2", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-181-firearm-3", "射击", 1, FIREARM_OPTIONS),
    ],
  ),

  // TODO: 本职技能：急救，机械维修，博物学，领航，一项社交技能（取悦、话术、恐吓、说服），驾驶（船），侦察，游泳。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    182,
    "海警",
    20,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("first_aid", "急救"),
      skill("mech_repair", "机械维修"),
      skill("natural_world", "博物学"),
      skill("navigate", "导航"),
      skill("pilot_1", "驾驶", "船"),
      skill("spot_hidden", "侦查"),
      skill("swim", "游泳"),
    ],
    [
      predefinedGroup(
        "occ-182-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：攀爬或游泳，闪避，格斗，射击，潜行，生存，下面任选两项：急救、机械维修、外语。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    183,
    "陆上自卫队员",
    9,
    60,
    [{ attribute: "EDU", multiplier: 2 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("dodge", "闪避"),
      skill("stealth", "潜行"),
      skill("mech_repair", "机械维修"),
    ],
    [
      predefinedGroup("occ-183-choice-1", "攀爬或游泳", 1, [
        skill("climb", "攀爬"),
        skill("swim", "游泳"),
      ]),
      predefinedGroup("occ-183-fight-2", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-183-firearm-3", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup("occ-183-survival-4", "生存", 1, [
        skill("survival", "生存", "森林"),
        skill("survival", "生存", "海上"),
        skill("survival", "生存", "荒野"),
      ]),
      predefinedGroup("occ-183-prompt-5", "下面任选两项：急救", 2, [
        skill("first_aid", "急救"),
      ]),
      predefinedGroup("occ-183-lang-6", "外语", 1, LANGUAGE_OPTIONS),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：攀爬或游泳，闪避，格斗，射击，潜行，生存，下面任选两项：急救、机械维修、外语。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    184,
    "私人军事公司成员",
    9,
    60,
    [{ attribute: "EDU", multiplier: 2 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("dodge", "闪避"),
      skill("stealth", "潜行"),
      skill("mech_repair", "机械维修"),
    ],
    [
      predefinedGroup("occ-184-choice-1", "攀爬或游泳", 1, [
        skill("climb", "攀爬"),
        skill("swim", "游泳"),
      ]),
      predefinedGroup("occ-184-fight-2", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-184-firearm-3", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup("occ-184-survival-4", "生存", 1, [
        skill("survival", "生存", "森林"),
        skill("survival", "生存", "海上"),
        skill("survival", "生存", "荒野"),
      ]),
      predefinedGroup("occ-184-prompt-5", "下面任选两项：急救", 2, [
        skill("first_aid", "急救"),
      ]),
      predefinedGroup("occ-184-lang-6", "外语", 1, LANGUAGE_OPTIONS),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：攀爬或游泳，射击，历史，跳跃，博物学，领航，外语，生存。
  // TODO: 职业属性：教育×2＋外貌或敏捷或力量×2 (=EDU*2+MAX(DEX*2,APP*2,STR*2))
  occupation(
    185,
    "冒险家教授",
    55,
    80,
    [{ attribute: "EDU", multiplier: 2 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("history", "历史"),
      skill("jump", "跳跃"),
      skill("natural_world", "博物学"),
      skill("navigate", "导航"),
    ],
    [
      predefinedGroup("occ-185-choice-1", "攀爬或游泳", 1, [
        skill("climb", "攀爬"),
        skill("swim", "游泳"),
      ]),
      predefinedGroup("occ-185-firearm-2", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup("occ-185-lang-3", "外语", 1, LANGUAGE_OPTIONS),
      predefinedGroup("occ-185-survival-4", "生存", 1, [
        skill("survival", "生存", "森林"),
        skill("survival", "生存", "海上"),
        skill("survival", "生存", "荒野"),
      ]),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
      { attribute: "STR", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：乔装，一项社交技能（取悦、话术、恐吓、说服），历史或图书馆，母语，外语，心理学，潜行。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    186,
    "评论家",
    30,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("disguise", "乔装"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
    ],
    [
      predefinedGroup(
        "occ-186-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-186-choice-2", "历史或图书馆", 1, [
        skill("history", "历史"),
        skill("library_use", "图书馆使用"),
      ]),
      predefinedGroup("occ-186-lang-3", "外语", 1, LANGUAGE_OPTIONS),
    ],
  ),

  // TODO: 本职技能：技艺（表演,歌唱,舞蹈），乔装，两项社交技能（取悦、话术、恐吓、说服），聆听，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    187,
    "偶像",
    9,
    70,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（表演，歌唱，舞蹈）", "表演，歌唱，舞蹈"),
      skill("disguise", "乔装"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-187-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-187-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（歌唱,舞蹈,乐器），乔装，两项社交技能（取悦、话术、恐吓、说服），聆听，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    188,
    "歌手",
    9,
    70,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（歌唱，舞蹈，乐器）", "歌唱，舞蹈，乐器"),
      skill("disguise", "乔装"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-188-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-188-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（表演,杂技,喜剧），乔装，两项社交技能（取悦、话术、恐吓、说服），聆听，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    189,
    "搞笑艺人",
    9,
    70,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（表演，杂技，喜剧）", "表演，杂技，喜剧"),
      skill("disguise", "乔装"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-189-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-189-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：攀爬，闪避，跳跃，投掷，侦察，游泳，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    190,
    "运动员艺人",
    9,
    20,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("climb", "攀爬"),
      skill("dodge", "闪避"),
      skill("jump", "跳跃"),
      skill("throw", "投掷"),
      skill("spot_hidden", "侦查"),
      skill("swim", "游泳"),
    ],
    [
      anySkillGroup(
        "occ-190-any-1",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（表演），母语，取悦，话术，说服，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    191,
    "播音员",
    50,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("lang_own", "母语"),
      skill("charm", "取悦"),
      skill("fast_talk", "话术"),
      skill("persuade", "说服"),
      skill("psychology", "心理学"),
    ],
    [
      anySkillGroup(
        "occ-191-any-1",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（表演），母语，取悦，话术，说服，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    192,
    "主持人",
    50,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("lang_own", "母语"),
      skill("charm", "取悦"),
      skill("fast_talk", "话术"),
      skill("persuade", "说服"),
      skill("psychology", "心理学"),
    ],
    [
      anySkillGroup(
        "occ-192-any-1",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（表演），母语，取悦，话术，说服，心理学，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    193,
    "电视解说员",
    50,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("lang_own", "母语"),
      skill("charm", "取悦"),
      skill("fast_talk", "话术"),
      skill("persuade", "说服"),
      skill("psychology", "心理学"),
    ],
    [
      anySkillGroup(
        "occ-193-any-1",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：技艺（表演，歌唱，喜剧），乔装，两项社交技能（取悦、话术、恐吓、说服），聆听，心理学，计算机，电气维修。
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    194,
    "网络明星",
    9,
    70,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（表演，歌唱，喜剧）", "表演，歌唱，喜剧"),
      skill("disguise", "乔装"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("computer_use", "计算机使用"),
      skill("elec_repair", "电气维修"),
    ],
    [
      predefinedGroup(
        "occ-194-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：汽车驾驶、两项社交技能（取悦、话术、恐吓、说服），潜行，聆听，法律，任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    195,
    "经纪人",
    30,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("drive_auto", "汽车驾驶"),
      skill("stealth", "潜行"),
      skill("listen", "聆听"),
      skill("law", "法律"),
    ],
    [
      predefinedGroup(
        "occ-195-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-195-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：神秘学，科学（物理，化学，生物），机械维修，艺术（摄影），电气维修，一项社交技能（取悦、话术、恐吓、说服）。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    196,
    "捉鬼人",
    9,
    30,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("occult", "神秘学"),
      skill("mech_repair", "机械维修"),
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("elec_repair", "电气维修"),
      skill("science_1", "科学", "物理"),
      skill("science_2", "科学", "化学"),
      skill("science_3", "科学", "生物"),
    ],
    [
      predefinedGroup(
        "occ-196-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（表演），历史，图书馆，两项社交技能（取悦、话术、恐吓、说服），神秘学，心理学，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋教育或外貌×2 (=EDU*2+MAX(EDU*2,APP*2))
  occupation(
    197,
    "占卜师/灵媒师",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（表演）", "表演"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("occult", "神秘学"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-197-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-197-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：技艺（木工、焊接、管道工等），攀爬，汽车驾驶，电气维修，机械维修，操作重型机械，任意两项其他个人或时代或技术特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    198,
    "机械师",
    9,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill(
        "art_craft_1",
        "技艺（木工，焊接，管道工等）",
        "木工，焊接，管道工等",
      ),
      skill("climb", "攀爬"),
      skill("drive_auto", "汽车驾驶"),
      skill("elec_repair", "电气维修"),
      skill("mech_repair", "机械维修"),
      skill("heavy_machinery", "操作重型机械"),
    ],
    [
      anySkillGroup(
        "occ-198-any-1",
        "任意两项其他个人或时代或技术特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：手艺（烹饪），科学（生物，化学），格斗，博物学，侦察，外语，任意一项其他个人或时代特长。
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    199,
    "厨师",
    9,
    30,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺", "烹饪"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("natural_world", "博物学"),
      skill("spot_hidden", "侦查"),
      skill("science_1", "科学", "生物"),
      skill("science_2", "科学", "化学"),
    ],
    [
      predefinedGroup("occ-199-lang-2", "外语", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-199-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：计算机，电气维修，电子学，图书馆，侦察，一项社交技能（取悦、话术、恐吓、说服），任意两项其他技能。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    200,
    "网络犯罪者",
    10,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("computer_use", "计算机使用"),
      skill("elec_repair", "电气维修"),
      skill("electronics", "电子学"),
      skill("library_use", "图书馆使用"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-200-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup("occ-200-any-2", "任意两项其他技能", 2, ANY_SKILL_OPTIONS),
    ],
  ),

  // TODO: 本职技能：攀爬或游泳，闪避，格斗，射击，潜行，生存，下面任选两项：急救、机械维修、外语。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    201,
    "佣兵",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("dodge", "闪避"),
      skill("stealth", "潜行"),
      skill("mech_repair", "机械维修"),
    ],
    [
      predefinedGroup("occ-201-choice-1", "攀爬或游泳", 1, [
        skill("climb", "攀爬"),
        skill("swim", "游泳"),
      ]),
      predefinedGroup("occ-201-fight-2", "格斗", 1, FIGHTING_OPTIONS),
      predefinedGroup("occ-201-firearm-3", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup("occ-201-survival-4", "生存", 1, [
        skill("survival", "生存", "森林"),
        skill("survival", "生存", "海上"),
        skill("survival", "生存", "荒野"),
      ]),
      predefinedGroup("occ-201-prompt-5", "下面任选两项：急救", 2, [
        skill("first_aid", "急救"),
      ]),
      predefinedGroup("occ-201-lang-6", "外语", 1, LANGUAGE_OPTIONS),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：计算机，聆听，潜行，图书馆，母语，任意三项符合尼特族形象的特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    202,
    "自宅警备员",
    1,
    10,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("computer_use", "计算机使用"),
      skill("listen", "聆听"),
      skill("stealth", "潜行"),
      skill("library_use", "图书馆使用"),
      skill("lang_own", "母语"),
    ],
    [
      anySkillGroup(
        "occ-202-any-1",
        "任意三项符合尼特族形象的特长",
        3,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：格斗，射击，急救，一项社交技能（取悦、话术、恐吓、说服），法律，心理学，侦察和下面的一种个人特长：汽车驾驶或骑术。
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    203,
    "壮汉保镖",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("first_aid", "急救"),
      skill("law", "法律"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-203-firearm-1", "射击", 1, FIREARM_OPTIONS),
      predefinedGroup(
        "occ-203-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup(
        "occ-203-choice-3",
        "侦察和下面的一种个人特长：汽车驾驶或骑术",
        1,
        [skill("ride", "骑术")],
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：手艺（游戏），计算机，电气维修，电子学，聆听，一项社交技能（取悦、话术、恐吓、说服），任意两项其他个人或时代特长。
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    204,
    "游戏测试员",
    9,
    20,
    [{ attribute: "EDU", multiplier: 4 }],
    "日系特定规则《克苏鲁2015》职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（游戏）", "游戏"),
      skill("computer_use", "计算机使用"),
      skill("elec_repair", "电气维修"),
      skill("electronics", "电子学"),
      skill("listen", "聆听"),
    ],
    [
      predefinedGroup(
        "occ-204-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-204-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（任意），估价，潜行，一项社交技能（取悦、话术、恐吓、说服），急救，其他语言（欧洲），心理学，骑术，（乔装、钳工）中的一种，任意一项其他个人或时代特长
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    205,
    "交际花",
    9,
    30,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("appraise", "估价"),
      skill("stealth", "潜行"),
      skill("first_aid", "急救"),
      skill("psychology", "心理学"),
      skill("ride", "骑术"),
    ],
    [
      predefinedGroup("occ-205-art-1", "技艺（任意）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-205-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-205-lang-3", "外语（任一）", 1, LANGUAGE_OPTIONS),
      predefinedGroup("occ-205-prompt-4", "（乔装，钳工）中的一种", 1, [
        skill("disguise", "乔装"),
      ]),
      anySkillGroup(
        "occ-205-any-5",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，艺术（任意），估价，历史，图书馆，其他语言（欧洲），一项社交技能（取悦、话术、恐吓、说服），心理学，侦查，任意两项其他个人或时代特长
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    206,
    "考古学家",
    30,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-206-art-1", "技艺（任意）", 1, ART_OPTIONS),
      predefinedGroup("occ-206-lang-2", "外语（任一）", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-206-social-3",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-206-any-4",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：拉丁语，法律，其他语言（欧洲），一项社交技能（取悦、话术、恐吓、说服），骑术，射击（霰弹枪），任意三项其他个人或时代特长
  // TODO: 职业属性：教育×2＋教育或外貌×2 (=EDU*2+MAX(EDU*2,APP*2))
  occupation(
    207,
    "贵族",
    70,
    99,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("lang_other_1", "外语", "拉丁文"),
      skill("law", "法律"),
      skill("ride", "骑术"),
      skill("firearms_1", "射击", "霰弹枪"),
    ],
    [
      predefinedGroup("occ-207-lang-1", "外语（任一）", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-207-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-207-any-3",
        "任意三项其他个人或时代特长",
        3,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：艺术及手艺（任意多种），估价，历史，图书馆，其他语言（欧洲），侦查，任意两项其他个人或时代特长
  // TODO: 职业属性：教育×2＋敏捷或意志×2 (=EDU*2+MAX(DEX*2,POW*2))
  occupation(
    208,
    "艺术家",
    10,
    40,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("appraise", "估价"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup("occ-208-any-1", "技艺（任意多种）", 1, ANY_SKILL_OPTIONS),
      predefinedGroup("occ-208-lang-2", "外语（任一）", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-208-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "DEX", multiplier: 2 },
      { attribute: "POW", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：艺术（写作），历史，图书馆，其他语言（欧洲），母语，一项社交技能（取悦、话术、恐吓、说服），心理学，任意两项其他个人或时代特长
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    209,
    "作家",
    10,
    40,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("art_craft_1", "技艺（写作）", "写作"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup("occ-209-lang-1", "外语（任一）", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-209-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-209-any-3",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：闪避，马车驾驶，跳跃，聆听，机械维修，博物学，导航，一项社交技能（取悦、话术、恐吓、说服），侦查，格斗（鞭），任意一项其他个人或时代特长
  // TODO: 职业属性：教育×2＋敏捷×2 (=EDU*2+DEX*2)
  occupation(
    210,
    "马车夫",
    3,
    10,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("dodge", "闪避"),
      skill("drive_auto", "汽车驾驶"),
      skill("jump", "跳跃"),
      skill("listen", "聆听"),
      skill("mech_repair", "机械维修"),
      skill("natural_world", "博物学"),
      skill("navigate", "导航"),
      skill("spot_hidden", "侦查"),
      skill("fighting_1", "格斗", "鞭"),
    ],
    [
      predefinedGroup(
        "occ-210-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-210-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：历史，拉丁语，图书馆，一项社交技能（取悦、话术、恐吓、说服），心理学，任意两项其他个人或时代特长
  // TODO: 职业属性：教育×2＋外貌或意志×2 (=EDU*2+MAX(APP*2,POW*2))
  occupation(
    211,
    "牧师",
    20,
    65,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("history", "历史"),
      skill("lang_other_1", "外语", "拉丁文"),
      skill("library_use", "图书馆使用"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-211-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-211-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "POW", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：人类学，估价，科学（化学），急救，历史，法律，图书馆，聆听，心理学，其他语言（任意），侦查，追踪，任意两项其他个人或时代特长
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    212,
    "咨询侦探",
    10,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("anthropology", "人类学"),
      skill("appraise", "估价"),
      skill("science_1", "科学", "化学"),
      skill("first_aid", "急救"),
      skill("history", "历史"),
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
      skill("track", "追踪"),
    ],
    [
      anySkillGroup("occ-212-any-1", "其他外语（任意）", 1, LANGUAGE_OPTIONS),
      anySkillGroup(
        "occ-212-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，估价，手艺（任意多种），机械维修，一项社交技能（取悦、话术、恐吓、说服），侦查，任意一项其他个人或时代特长
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    213,
    "工匠",
    9,
    35,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("mech_repair", "机械维修"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup("occ-213-any-1", "技艺（任意多种）", 1, ANY_SKILL_OPTIONS),
      predefinedGroup(
        "occ-213-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-213-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：估价，乔装，一项社交技能（取悦、话术、恐吓、说服），潜行，锁匠，格斗（任意两项），任意一项其他个人或时代特长
  // TODO: 职业属性：教育×2＋外貌或敏捷或力量×2 (=EDU*2+MAX(DEX*2,APP*2,STR*2))
  occupation(
    214,
    "罪犯",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("appraise", "估价"),
      skill("disguise", "乔装"),
      skill("stealth", "潜行"),
      skill("locksmith", "锁匠"),
      skill("fighting_1", "格斗"),
      skill("fighting_2", "格斗"),
    ],
    [
      predefinedGroup(
        "occ-214-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-214-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
      { attribute: "STR", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：任意六项个人或时代特长
  // TODO: 职业属性：教育×2＋外貌×2 (=EDU*2+APP*2)
  occupation(
    215,
    "业余艺术爱好者",
    10,
    70,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "APP", multiplier: 2 },
    ],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [],
    [
      anySkillGroup(
        "occ-215-any-1",
        "任意六项个人或时代特长",
        6,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：艺术（任意多种），乔装，闪避，两项社交技能（取悦、话术、恐吓、说服），聆听，母语，心理学，任意三项其他个人或时代特长
  // TODO: 职业属性：教育×2＋外貌或意志×2 (=EDU*2+MAX(APP*2,POW*2))
  occupation(
    216,
    "艺人",
    10,
    40,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("disguise", "乔装"),
      skill("dodge", "闪避"),
      skill("listen", "聆听"),
      skill("lang_own", "母语"),
      skill("psychology", "心理学"),
    ],
    [
      anySkillGroup("occ-216-any-1", "技艺（任意多种）", 1, ANY_SKILL_OPTIONS),
      predefinedGroup(
        "occ-216-social-2",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-216-any-3",
        "任意三项其他个人或时代特长",
        3,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "POW", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：潜行，急救，射击（手枪、来复枪）,导航，其他语言（任意）,一项社交技能（取悦、话术、恐吓、说服）,心理学，骑术,格斗（剑），侦查，（攀爬、游泳）中的一种
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    217,
    "退役军官",
    40,
    75,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("stealth", "潜行"),
      skill("first_aid", "急救"),
      skill("firearms_handgun", "射击", "手枪"),
      skill("firearms_1", "射击", "来复枪"),
      skill("navigate", "导航"),
      skill("psychology", "心理学"),
      skill("ride", "骑术"),
      skill("fighting_1", "格斗", "剑"),
      skill("spot_hidden", "侦查"),
      skill("lang_other_1", "外语"),
    ],
    [
      predefinedGroup(
        "occ-217-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-217-prompt-3", "（攀爬，游泳）中的一种", 1, [
        skill("climb", "攀爬"),
        skill("swim", "游泳"),
      ]),
    ],
  ),

  // TODO: 本职技能：人类学，考古学，估价，科学（生物学），攀爬，急救，射击（手枪、来复枪），格斗，博物学，导航，其他语言（任意），驾驶（小艇，船，热气球），骑术，潜行，侦查，游泳，追踪
  // TODO: 职业属性：教育×2＋外貌或敏捷或力量×2 (=EDU*2+MAX(DEX*2,APP*2,STR*2))
  occupation(
    218,
    "探险家",
    45,
    70,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("anthropology", "人类学"),
      skill("archaeology", "考古学"),
      skill("appraise", "估价"),
      skill("science_1", "科学", "生物学"),
      skill("climb", "攀爬"),
      skill("first_aid", "急救"),
      skill("firearms_handgun", "射击", "手枪"),
      skill("firearms_1", "射击", "来复枪"),
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("natural_world", "博物学"),
      skill("navigate", "导航"),
      skill("pilot_1", "驾驶", "小艇"),
      skill("pilot_2", "驾驶", "船"),
      skill("pilot_3", "驾驶", "热气球"),
      skill("ride", "骑术"),
      skill("stealth", "潜行"),
      skill("spot_hidden", "侦查"),
      skill("swim", "游泳"),
      skill("track", "追踪"),
    ],
    [anySkillGroup("occ-218-any-1", "其他外语（任意）", 1, LANGUAGE_OPTIONS)],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
      { attribute: "STR", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，两项社交技能（取悦、话术、恐吓、说服），法律，图书馆，聆听，锁匠，艺术及手艺（摄影），侦查，任意一项其他个人或时代特长
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    219,
    "私家侦探",
    9,
    40,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("accounting", "会计"),
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("locksmith", "锁匠"),
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-219-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-219-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：估价，闪避，两项社交技能（取悦、话术、恐吓、说服），图书馆，聆听，其他语言（欧洲），母语，艺术及手艺（摄影），心理学，侦查。
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(DEX*2,APP*2))
  occupation(
    220,
    "记者",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("appraise", "估价"),
      skill("dodge", "闪避"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("lang_own", "母语"),
      skill("art_craft_1", "技艺（摄影）", "摄影"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-220-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-220-lang-2", "外语（任一）", 1, LANGUAGE_OPTIONS),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：估价，一项社交技能（取悦、话术、恐吓、说服），闪避，急救，机械维修，重型机械操作，任意一项其他个人或时代特长，以及从以下任选两种：（攀爬，斗殴，手艺（任意），马车驾驶，驾驶：船）
  // TODO: 职业属性：教育×2＋力量×2 (=EDU*2+STR*2)
  occupation(
    221,
    "劳工",
    0,
    10,
    [
      { attribute: "EDU", multiplier: 2 },
      { attribute: "STR", multiplier: 2 },
    ],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("appraise", "估价"),
      skill("dodge", "闪避"),
      skill("first_aid", "急救"),
      skill("mech_repair", "机械维修"),
      skill("heavy_machinery", "操作重型机械"),
    ],
    [
      predefinedGroup(
        "occ-221-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-221-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
      anySkillGroup(
        "occ-221-any-3",
        "以及从以下任选两种：（攀爬，斗殴，技艺（任意），汽车驾驶，驾驶：船）",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：会计，估价，两项社交技能（取悦、话术、恐吓、说服），历史，拉丁语，法律，图书馆，聆听，心理学，任意两项其他个人或时代特长
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    222,
    "律师",
    20,
    80,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("history", "历史"),
      skill("lang_other_1", "外语", "拉丁文"),
      skill("law", "法律"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
    ],
    [
      predefinedGroup(
        "occ-222-social-1",
        "两项社交技能（取悦，话术，恐吓，说服）",
        2,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-222-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：科学（生物学、药剂学），急救，拉丁语，图书馆，医学，心理学，任意两项其他个人或时代特长
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    223,
    "医生",
    30,
    70,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("first_aid", "急救"),
      skill("lang_other_1", "外语", "拉丁文"),
      skill("library_use", "图书馆使用"),
      skill("medicine", "医学"),
      skill("psychology", "心理学"),
      skill("science_1", "科学", "生物学"),
      skill("science_2", "科学", "药剂学"),
    ],
    [
      anySkillGroup(
        "occ-223-any-2",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：格斗，闪避，一项社交技能（取悦、话术、恐吓、说服），急救，射击（手枪），法律，聆听，心理学，潜行，侦查
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    224,
    "警察",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("fighting_brawl", "格斗", "斗殴"),
      skill("dodge", "闪避"),
      skill("first_aid", "急救"),
      skill("firearms_handgun", "射击", "手枪"),
      skill("law", "法律"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("stealth", "潜行"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup(
        "occ-224-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：图书馆，其他语言（欧洲），一项社交技能（取悦、话术、恐吓、说服），心理学，至多六种额外的学问技巧作为个人专长
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    225,
    "教授/学者",
    20,
    50,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [skill("library_use", "图书馆使用"), skill("psychology", "心理学")],
    [
      predefinedGroup("occ-225-lang-1", "外语（任一）", 1, LANGUAGE_OPTIONS),
      predefinedGroup(
        "occ-225-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-225-any-3",
        "至多六种额外的学问技巧作为个人专长",
        6,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：手艺（任意），历史，图书馆，机械维修，一项社交技能（取悦、话术、恐吓、说服），侦查，至多六种其他学问技巧作为个人专长
  // TODO: 职业属性：教育×4 (=EDU*4)
  occupation(
    226,
    "科学家",
    10,
    60,
    [{ attribute: "EDU", multiplier: 4 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("mech_repair", "机械维修"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-226-art-1", "技艺（任意）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-226-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-226-any-3",
        "至多六种其他学问技巧作为个人专长",
        6,
        ANY_SKILL_OPTIONS,
      ),
    ],
  ),

  // TODO: 本职技能：手艺（任意），闪避，聆听，潜行，任意一项其他个人或时代特长，以及从以下中最多选取三个：（会计，估价，马车驾驶，礼仪，急救，其他语言（欧洲），说服）
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(APP*2,DEX*2))
  occupation(
    227,
    "佣人",
    0,
    10,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [skill("dodge", "闪避"), skill("listen", "聆听"), skill("stealth", "潜行")],
    [
      predefinedGroup("occ-227-art-1", "技艺（任意）", 1, ART_OPTIONS),
      anySkillGroup(
        "occ-227-any-2",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
      predefinedGroup(
        "occ-227-prompt-3",
        "以及从以下中最多选取三个：（会计，估价，汽车驾驶，礼仪，急救，外语（任一），说服）",
        3,
        [
          skill("accounting", "会计"),
          skill("appraise", "估价"),
          skill("drive_auto", "汽车驾驶"),
          skill("first_aid", "急救"),
          skill("persuade", "说服"),
        ],
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：会计，估价，手艺（任意），聆听，一项社交技能（取悦、话术、恐吓、说服），心理学，侦查，任意一项其他个人或时代特长
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(APP*2,DEX*2))
  occupation(
    228,
    "店主",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("accounting", "会计"),
      skill("appraise", "估价"),
      skill("listen", "聆听"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
    ],
    [
      predefinedGroup("occ-228-art-1", "技艺（任意）", 1, ART_OPTIONS),
      predefinedGroup(
        "occ-228-social-2",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      anySkillGroup(
        "occ-228-any-3",
        "任意一项其他个人或时代特长",
        1,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：闪避，急救，潜行，聆听，机械维修，射击（来复枪），潜行，侦查，任意两项其他个人或时代特长
  // TODO: 职业属性：教育×2＋力量或敏捷×2 (=EDU*2+MAX(STR*2,DEX*2))
  occupation(
    229,
    "士兵",
    9,
    30,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("dodge", "闪避"),
      skill("first_aid", "急救"),
      skill("stealth", "潜行"),
      skill("listen", "聆听"),
      skill("mech_repair", "机械维修"),
      skill("firearms_1", "射击", "来复枪"),
      skill("stealth", "潜行"),
      skill("spot_hidden", "侦查"),
    ],
    [
      anySkillGroup(
        "occ-229-any-1",
        "任意两项其他个人或时代特长",
        2,
        ANY_SKILL_OPTIONS,
      ),
    ],
    [
      { attribute: "STR", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),

  // TODO: 本职技能：乔装，一项社交技能（取悦、话术、恐吓、说服），潜行，历史，图书馆，聆听，锁匠，导航，其他语言（欧洲），心理学，侦查，格斗（任意）
  // TODO: 职业属性：教育×2＋外貌或敏捷×2 (=EDU*2+MAX(APP*2,DEX*2))
  occupation(
    230,
    "密探",
    30,
    70,
    [{ attribute: "EDU", multiplier: 2 }],
    "《克苏鲁煤气灯》1980s职业，使用前请征得KP同意。",
    "",
    [
      skill("disguise", "乔装"),
      skill("stealth", "潜行"),
      skill("history", "历史"),
      skill("library_use", "图书馆使用"),
      skill("listen", "聆听"),
      skill("locksmith", "锁匠"),
      skill("navigate", "导航"),
      skill("psychology", "心理学"),
      skill("spot_hidden", "侦查"),
      skill("fighting_1", "格斗"),
    ],
    [
      predefinedGroup(
        "occ-230-social-1",
        "一项社交技能（取悦，话术，恐吓，说服）",
        1,
        SOCIAL_OPTIONS,
      ),
      predefinedGroup("occ-230-lang-2", "外语（任一）", 1, LANGUAGE_OPTIONS),
    ],
    [
      { attribute: "APP", multiplier: 2 },
      { attribute: "DEX", multiplier: 2 },
    ],
  ),
];

export function getOccupationById(
  occupationId: number | null | "",
): OccupationDefinition | undefined {
  if (occupationId === null || occupationId === "") {
    return undefined;
  }
  return OCCUPATIONS.find((item) => item.id === occupationId);
}

export function getOccupationPoints(
  definition: OccupationDefinition | undefined,
  attributes: Attributes,
): number {
  if (!definition) {
    return 0;
  }

  const fixed = definition.pointRule.fixed.reduce(
    (sum, part) => sum + attributes[part.attribute] * part.multiplier,
    0,
  );
  const chooseMax =
    definition.pointRule.chooseMax?.reduce(
      (max, part) =>
        Math.max(max, attributes[part.attribute] * part.multiplier),
      0,
    ) ?? 0;

  return fixed + chooseMax;
}

export function getOccupationFormulaLabel(
  definition: OccupationDefinition | undefined,
): string {
  if (!definition) {
    return "";
  }
  const fixed = definition.pointRule.fixed.map(
    (part) => `${part.attribute}×${part.multiplier}`,
  );
  const chooseMax =
    definition.pointRule.chooseMax?.map(
      (part) => `${part.attribute}×${part.multiplier}`,
    ) ?? [];
  return [...fixed, chooseMax.length > 0 ? chooseMax.join(" 或 ") : ""]
    .filter(Boolean)
    .join(" ＋ ");
}

export function getResolvedOccupationSkills(
  definition: OccupationDefinition | undefined,
  occupationState: OccupationState,
): { allowedSkillIds: string[]; skillSubNames: Record<string, string> } {
  if (!definition) {
    return { allowedSkillIds: [], skillSubNames: {} };
  }

  const allowed = new Set<string>(["credit_rating"]);
  const skillSubNames: Record<string, string> = {};

  for (const item of definition.fixedSkills) {
    allowed.add(item.skillId);
    if (item.subName) {
      skillSubNames[item.skillId] = item.subName;
    }
  }

  for (const group of definition.choiceGroups) {
    const selected = occupationState.selectedSkills[group.id] ?? [];
    for (const optionId of selected) {
      const option = group.options.find((item) => item.id === optionId);
      if (!option) {
        continue;
      }
      allowed.add(option.skillId);
      if (option.subName) {
        skillSubNames[option.skillId] = option.subName;
      }
    }
  }

  return {
    allowedSkillIds: [...allowed],
    skillSubNames,
  };
}

export function createDefaultOccupationSelections(
  definition: OccupationDefinition | undefined,
): Record<string, string[]> {
  if (!definition) {
    return {};
  }

  return Object.fromEntries(
    definition.choiceGroups.map((group) => [group.id, []]),
  );
}
