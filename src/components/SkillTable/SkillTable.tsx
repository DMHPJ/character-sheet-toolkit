"use client";

import { useMemo, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Checkbox,
  Chip,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { Skill } from "@/types/character";

export default function SkillTable() {
  const skills = useCharacterStore((state) => state.skills);
  const occupationSummary = useCharacterStore((state) => state.occupationSummary);
  const setSkillField = useCharacterStore((state) => state.setSkillField);
  const toggleSkillCheck = useCharacterStore((state) => state.toggleSkillCheck);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return skills;
    }
    const query = search.trim().toLowerCase();
    return skills.filter((skill) => `${skill.name} ${skill.subName ?? ""}`.toLowerCase().includes(query));
  }, [search, skills]);

  const splitIndex = Math.ceil(filtered.length / 2);
  const leftSkills = filtered.slice(0, splitIndex);
  const rightSkills = filtered.slice(splitIndex);

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, backgroundColor: alpha("#171d1b", 0.84) }}>
      <Box sx={{ display: "grid", gap: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ display: "grid", gap: 1 }}>
            <Box>
              <Typography variant="h2" sx={{ fontSize: "1.15rem" }}>
                技能表
              </Typography>
              <Typography variant="body2" color="text.secondary">
                职业点只允许分配到当前职业模板覆盖的技能，兴趣点按 `INT×2` 计算
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={`职业点 ${occupationSummary.occupationPointsSpent}/${occupationSummary.occupationPointsTotal}`}
                color={occupationSummary.occupationPointsRemaining < 0 ? "error" : "secondary"}
                variant="outlined"
              />
              <Chip
                label={`兴趣点 ${occupationSummary.interestPointsSpent}/${occupationSummary.interestPointsTotal}`}
                color={occupationSummary.interestPointsRemaining < 0 ? "error" : "primary"}
                variant="outlined"
              />
              {occupationSummary.creditRatingMin !== null && (
                <Chip
                  icon={!occupationSummary.creditRatingInRange ? <WarningAmberRoundedIcon /> : undefined}
                  label={`信用评级 ${occupationSummary.creditRatingValue}（应为 ${occupationSummary.creditRatingMin}-${occupationSummary.creditRatingMax}）`}
                  color={occupationSummary.creditRatingInRange ? "success" : "warning"}
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜索技能或子类"
            size="small"
            sx={{ minWidth: { xs: "100%", md: 280 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1fr)" },
            alignItems: "start",
          }}
        >
          <SkillTableSection
            skills={leftSkills}
            occupationSkillIds={occupationSummary.allowedSkillIds}
            onFieldChange={setSkillField}
            onToggleCheck={toggleSkillCheck}
          />
          <SkillTableSection
            skills={rightSkills}
            occupationSkillIds={occupationSummary.allowedSkillIds}
            onFieldChange={setSkillField}
            onToggleCheck={toggleSkillCheck}
          />
        </Box>
      </Box>
    </Paper>
  );
}

function SkillTableSection({
  skills,
  occupationSkillIds,
  onFieldChange,
  onToggleCheck,
}: {
  skills: Skill[];
  occupationSkillIds: string[];
  onFieldChange: (id: string, field: "growth" | "occupationPoints" | "interestPoints" | "subName", value: number | string) => void;
  onToggleCheck: (id: string) => void;
}) {
  return (
    <TableContainer sx={{ borderRadius: 0.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">成长</TableCell>
            <TableCell>技能</TableCell>
            <TableCell align="center">初始</TableCell>
            <TableCell align="center">成长</TableCell>
            <TableCell align="center">职业</TableCell>
            <TableCell align="center">兴趣</TableCell>
            <TableCell align="center">常规</TableCell>
            <TableCell align="center">困难</TableCell>
            <TableCell align="center">极限</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skills.map((skill) => (
            <SkillRow
              key={skill.id}
              skill={skill}
              isOccupationSkill={occupationSkillIds.includes(skill.id)}
              onFieldChange={onFieldChange}
              onToggleCheck={onToggleCheck}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function SkillRow({
  skill,
  isOccupationSkill,
  onFieldChange,
  onToggleCheck,
}: {
  skill: Skill;
  isOccupationSkill: boolean;
  onFieldChange: (id: string, field: "growth" | "occupationPoints" | "interestPoints" | "subName", value: number | string) => void;
  onToggleCheck: (id: string) => void;
}) {
  const total = skill.baseValue + skill.growth + skill.occupationPoints + skill.interestPoints;
  const hard = Math.floor(total / 2);
  const extreme = Math.floor(total / 5);
  const isSpecial = skill.id === "cthulhu_mythos" || skill.id === "credit_rating";
  const hasSubName = /（.*）|\(|[①②③：]/.test(skill.name) || skill.isCustom;
  const occupationDisabled = skill.cannotAssignOccupation || !isOccupationSkill;

  return (
    <TableRow
      hover
      sx={{
        backgroundColor: skill.checked
          ? (theme) => alpha(theme.palette.primary.main, 0.08)
          : isOccupationSkill
            ? (theme) => alpha(theme.palette.secondary.main, 0.06)
            : undefined,
      }}
    >
      <TableCell sx={{minWidth: 60}} padding="checkbox">
        <Checkbox checked={skill.checked} onChange={() => onToggleCheck(skill.id)} color="primary" />
      </TableCell>
      <TableCell sx={{ minWidth: 100, p: "6px" }}>
        <Box sx={{ display: "grid", gap: 0.75 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {skill.name}
            </Typography>
            {isOccupationSkill && <Chip label="本职" size="small" color="secondary" variant="outlined" />}
            {isSpecial && <Chip label="特殊" size="small" color="warning" variant="outlined" />}
          </Box>
          {hasSubName && (
            <TextField
              sx={{ maxWidth: "16rem" }}
              value={skill.subName ?? ""}
              onChange={(event) => onFieldChange(skill.id, "subName", event.target.value)}
              placeholder="自定义"
              size="small"
              fullWidth
            />
          )}
        </Box>
      </TableCell>
      <TableCell align="center" sx={{ minWidth: 60, p: "6px" }}>
        {skill.baseValue}
      </TableCell>
      <EditableNumberCell value={skill.growth} onChange={(value) => onFieldChange(skill.id, "growth", value)} />
      <EditableNumberCell
        value={skill.occupationPoints}
        onChange={(value) => onFieldChange(skill.id, "occupationPoints", value)}
        disabled={occupationDisabled}
      />
      <EditableNumberCell
        value={skill.interestPoints}
        onChange={(value) => onFieldChange(skill.id, "interestPoints", value)}
        disabled={skill.cannotAssignInterest}
      />
      <TableCell align="center" sx={{ minWidth: 60, p: "6px" }}>
        {total}
      </TableCell>
      <TableCell align="center" sx={{ minWidth: 60, p: "6px" }}>
        {hard}
      </TableCell>
      <TableCell align="center" sx={{ minWidth: 60, p: "6px" }}>
        {extreme}
      </TableCell>
    </TableRow>
  );
}

function EditableNumberCell({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <TableCell align="center" sx={{ minWidth: 88, p: "6px" }}>
      <TextField
        type="number"
        value={value || ""}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        size="small"
        disabled={disabled}
        slotProps={{ htmlInput: { min: 0, style: { textAlign: "center" } } }}
        sx={{ width: 70 }}
      />
    </TableCell>
  );
}
