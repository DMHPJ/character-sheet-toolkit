"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BackpackRoundedIcon from "@mui/icons-material/BackpackRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SportsMmaRoundedIcon from "@mui/icons-material/SportsMmaRounded";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { Skill, Weapon } from "@/types/character";

const WEAPON_TYPES = ["格斗", "射击", "投掷", "特殊"];

type WeaponFieldValue = string | number | boolean;

export default function CombatPanel() {
  const derived = useCharacterStore((state) => state.derived);
  const skills = useCharacterStore((state) => state.skills);
  const weapons = useCharacterStore((state) => state.weapons);
  const inventory = useCharacterStore((state) => state.inventory);
  const addWeapon = useCharacterStore((state) => state.addWeapon);
  const updateWeapon = useCharacterStore((state) => state.updateWeapon);
  const removeWeapon = useCharacterStore((state) => state.removeWeapon);
  const addInventoryItem = useCharacterStore((state) => state.addInventoryItem);
  const updateInventoryItem = useCharacterStore((state) => state.updateInventoryItem);
  const removeInventoryItem = useCharacterStore((state) => state.removeInventoryItem);

  const combatSkills = skills
    .filter((skill) => skill.category === "战斗")
    .map((skill) => ({
      id: skill.id,
      label: formatSkillLabel(skill),
      total: getSkillTotal(skill),
    }));

  const brawlSkill = skills.find((skill) => skill.id === "fighting_brawl");
  const dodgeSkill = skills.find((skill) => skill.id === "dodge");

  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
        }}>
        <CombatSummaryCard
          title="徒手攻击"
          value={`${getSkillTotal(brawlSkill)} / ${Math.floor(getSkillTotal(brawlSkill) / 2)} / ${Math.floor(getSkillTotal(brawlSkill) / 5)}`}
          description={`伤害 1D3 + ${derived.damageBonus}`}
        />
        <CombatSummaryCard
          title="闪避 Dodge"
          value={`${getSkillTotal(dodgeSkill)} / ${Math.floor(getSkillTotal(dodgeSkill) / 2)} / ${Math.floor(getSkillTotal(dodgeSkill) / 5)}`}
          description="常规 / 困难 / 极限成功率"
        />
        <CombatSummaryCard title="体格与伤害加值" value={`${derived.build}`} description={`Damage Bonus ${derived.damageBonus}`} />
      </Box>

      <Paper sx={{ p: 2.5, backgroundColor: alpha("#0d1110", 0.26) }}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1.5,
              flexDirection: { xs: "column", sm: "row" },
            }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                武器表
              </Typography>
              <Typography variant="body2" color="text.secondary">
                成功率会根据所选技能自动换算为常规 / 困难 / 极限
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={addWeapon}>
              新增武器
            </Button>
          </Box>

          {weapons.length === 0 ? (
            <EmptyHint text="还没有录入武器，先从常用近战或配枪开始" />
          ) : (
            <Box sx={{ display: "grid", gap: 2 }}>
              {weapons.map((weapon, index) => (
                <WeaponEditor
                  key={weapon.id}
                  index={index}
                  weapon={weapon}
                  skillOptions={combatSkills}
                  onChange={(field, value) => updateWeapon(weapon.id, field, value)}
                  onRemove={() => removeWeapon(weapon.id)}
                />
              ))}
            </Box>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 2.5, backgroundColor: alpha("#0d1110", 0.26) }}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1.5,
              flexDirection: { xs: "column", sm: "row" },
            }}>
            <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  随身携带物
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  用于记录状态、位置和跑团中常用的关键物品
                </Typography>
              </Box>
            </Box>
            <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={addInventoryItem}>
              新增物品
            </Button>
          </Box>

          {inventory.length === 0 ? (
            <EmptyHint text="还没有携带物条目，可以先记下证件、武器、药品和关键线索" />
          ) : (
            <Box sx={{ display: "grid", gap: 1.5 }}>
              {inventory.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "grid",
                    gap: 1.25,
                    gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr 0.8fr auto" },
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 0.5,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}>
                  <TextField
                    label={`物品 ${index + 1}`}
                    value={item.name}
                    onChange={(event) => updateInventoryItem(item.id, "name", event.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="状态"
                    value={item.status}
                    onChange={(event) => updateInventoryItem(item.id, "status", event.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="位置"
                    value={item.location}
                    onChange={(event) => updateInventoryItem(item.id, "location", event.target.value)}
                    fullWidth
                    size="small"
                  />
                  <IconButton aria-label="删除物品" color="error" onClick={() => removeInventoryItem(item.id)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

function WeaponEditor({
  index,
  weapon,
  skillOptions,
  onChange,
  onRemove,
}: {
  index: number;
  weapon: Weapon;
  skillOptions: { id: string; label: string; total: number }[];
  onChange: (field: keyof Weapon, value: WeaponFieldValue) => void;
  onRemove: () => void;
}) {
  const selectedSkill = skillOptions.find((option) => option.label === weapon.skill);
  const success = selectedSkill?.total ?? 0;

  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        p: 1.75,
        borderRadius: 0.5,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
      }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          武器 {index + 1}
        </Typography>
        <IconButton aria-label="删除武器" color="error" onClick={onRemove}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 1.25,
          gridTemplateColumns: { xs: "1fr", lg: "1.25fr 0.8fr 1fr 0.8fr" },
        }}>
        <TextField
          label="武器名称"
          value={weapon.name}
          onChange={(event) => onChange("name", event.target.value)}
          fullWidth
          size="small"
        />
        <TextField
          select
          label="类型"
          value={weapon.type}
          onChange={(event) => onChange("type", event.target.value)}
          fullWidth
          size="small">
          {WEAPON_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="使用技能"
          value={weapon.skill}
          onChange={(event) => onChange("skill", event.target.value)}
          fullWidth
          size="small">
          {skillOptions.map((option) => (
            <MenuItem key={option.id} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="伤害"
          value={weapon.damage}
          onChange={(event) => onChange("damage", event.target.value)}
          fullWidth
          size="small"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 1.25,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(5, minmax(0, 1fr))" },
        }}>
        <TextField
          label="射程"
          value={weapon.range}
          onChange={(event) => onChange("range", event.target.value)}
          fullWidth
          size="small"
        />
        <TextField
          label="次数"
          type="number"
          value={weapon.attacksPerRound || ""}
          onChange={(event) => onChange("attacksPerRound", Number(event.target.value) || 0)}
          fullWidth
          size="small"
        />
        <TextField
          label="装弹量"
          value={weapon.ammo}
          onChange={(event) => onChange("ammo", event.target.value)}
          fullWidth
          size="small"
        />
        <TextField
          label="故障值"
          value={weapon.malfunction}
          onChange={(event) => onChange("malfunction", event.target.value)}
          fullWidth
          size="small"
        />
        <TextField
          select
          label="穿刺"
          value={weapon.penetration ? "yes" : "no"}
          onChange={(event) => onChange("penetration", event.target.value === "yes")}
          fullWidth
          size="small">
          <MenuItem value="no">否</MenuItem>
          <MenuItem value="yes">是</MenuItem>
        </TextField>
      </Box>

      <Divider />

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip label={`常规 ${success || "—"}`} variant="outlined" />
        <Chip label={`困难 ${success ? Math.floor(success / 2) : "—"}`} variant="outlined" />
        <Chip label={`极限 ${success ? Math.floor(success / 5) : "—"}`} variant="outlined" />
      </Box>
    </Box>
  );
}

function CombatSummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Paper sx={{ p: 2, backgroundColor: alpha("#0d1110", 0.26) }}>
      <Box sx={{ display: "grid", gap: 0.75 }}>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Paper>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 2,
        borderRadius: 0.5,
        border: (theme) => `1px dashed ${alpha(theme.palette.divider, 0.9)}`,
      }}>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}

function getSkillTotal(skill?: Skill): number {
  if (!skill) {
    return 0;
  }
  return skill.baseValue + skill.growth + skill.occupationPoints + skill.interestPoints;
}

function formatSkillLabel(skill: Skill): string {
  const subName = skill.subName?.trim();
  if (!subName || ["fighting_brawl", "firearms_handgun"].includes(skill.id)) {
    return skill.name;
  }

  const normalizedName = skill.name
    .replace(/[①②③]/g, "")
    .replace(/（.*?）/g, "")
    .replace(/\(.*?\)/g, "")
    .trim();

  if (!normalizedName || normalizedName === subName) {
    return subName;
  }

  return `${normalizedName}：${subName}`;
}
