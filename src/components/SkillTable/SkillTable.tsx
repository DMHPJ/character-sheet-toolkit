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
import ReadOnlyField from "@/components/ReadOnlyField/ReadOnlyField";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { Skill } from "@/types/character";

export default function SkillTable() {
	const readOnly = useCharacterStore((state) => state.readOnly);
	const skills = useCharacterStore((state) => state.skills);
	const occupationSummary = useCharacterStore((state) => state.occupationSummary);
	const setSkillField = useCharacterStore((state) => state.setSkillField);
	const toggleSkillCheck = useCharacterStore((state) => state.toggleSkillCheck);
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const baseSkills = readOnly
			? skills.filter(
					(skill) => skill.growth > 0 || skill.occupationPoints > 0 || skill.interestPoints > 0,
				)
			: skills;

		if (!search.trim()) {
			return baseSkills;
		}

		const query = search.trim().toLowerCase();
		return baseSkills.filter((skill) => formatSkillLabel(skill).toLowerCase().includes(query));
	}, [readOnly, search, skills]);

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
					}}>
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
									icon={
										!occupationSummary.creditRatingInRange ? <WarningAmberRoundedIcon /> : undefined
									}
									label={`信用评级 ${occupationSummary.creditRatingValue}（应为 ${occupationSummary.creditRatingMin}-${occupationSummary.creditRatingMax}）`}
									color={occupationSummary.creditRatingInRange ? "success" : "warning"}
									variant="outlined"
								/>
							)}
						</Box>
					</Box>

					{readOnly ? (
						<ReadOnlyField
							label="显示范围"
							value="仅展示已投入成长、职业或兴趣点的技能"
							minHeight={56}
						/>
					) : (
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
					)}
				</Box>

				<Box
					sx={{
						display: "grid",
						gap: 2,
						gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1fr)" },
						alignItems: "start",
					}}>
					<SkillTableSection
						skills={leftSkills}
						occupationSkillIds={occupationSummary.allowedSkillIds}
						readOnly={readOnly}
						onFieldChange={setSkillField}
						onToggleCheck={toggleSkillCheck}
					/>
					<SkillTableSection
						skills={rightSkills}
						occupationSkillIds={occupationSummary.allowedSkillIds}
						readOnly={readOnly}
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
	readOnly,
	onFieldChange,
	onToggleCheck,
}: {
	skills: Skill[];
	occupationSkillIds: string[];
	readOnly: boolean;
	onFieldChange: (
		id: string,
		field: "growth" | "occupationPoints" | "interestPoints" | "subName",
		value: number | string,
	) => void;
	onToggleCheck: (id: string) => void;
}) {
	return (
		<TableContainer
			sx={{ borderRadius: 0.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
			<Table stickyHeader size="small">
				<TableHead>
					<TableRow>
						<TableCell padding="checkbox">成长</TableCell>
						<TableCell sx={{ p: "2px" }}>技能</TableCell>
						<TableCell sx={{ p: "2px" }} align="center">
							初始
						</TableCell>
						<TableCell sx={{ p: "2px" }} align="center">
							成长
						</TableCell>
						<TableCell sx={{ p: "2px" }} align="center">
							职业
						</TableCell>
						<TableCell sx={{ p: "2px" }} align="center">
							兴趣
						</TableCell>
						<TableCell sx={{ minWidth: 128 }} align="center">
							常规/困难/极限
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{skills.map((skill) => (
						<SkillRow
							key={skill.id}
							skill={skill}
							isOccupationSkill={occupationSkillIds.includes(skill.id)}
							readOnly={readOnly}
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
	readOnly,
	onFieldChange,
	onToggleCheck,
}: {
	skill: Skill;
	isOccupationSkill: boolean;
	readOnly: boolean;
	onFieldChange: (
		id: string,
		field: "growth" | "occupationPoints" | "interestPoints" | "subName",
		value: number | string,
	) => void;
	onToggleCheck: (id: string) => void;
}) {
	const total = skill.baseValue + skill.growth + skill.occupationPoints + skill.interestPoints;
	const hard = Math.floor(total / 2);
	const extreme = Math.floor(total / 5);
	const isSpecial = skill.id === "cthulhu_mythos" || skill.id === "credit_rating";
	const hiddenSubName = skill.id === "fighting_brawl" || skill.id === "firearms_handgun";
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
			}}>
			<TableCell sx={{ minWidth: 60 }} padding="checkbox">
				<Checkbox
					checked={skill.checked}
					onChange={() => onToggleCheck(skill.id)}
					color="primary"
					disabled={readOnly}
				/>
			</TableCell>
			<TableCell sx={{ minWidth: 120, p: "6px 2px" }}>
				<Box sx={{ display: "grid", gap: 0.25 }}>
					<Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
						<Typography variant="body2" sx={{ fontWeight: 700 }}>
							{formatSkillLabel(skill)}
						</Typography>
						{isOccupationSkill && (
							<Chip label="本职" size="small" color="secondary" variant="outlined" />
						)}
						{isSpecial && <Chip label="特殊" size="small" color="warning" variant="outlined" />}
					</Box>
					{hasSubName && !readOnly && !hiddenSubName && (
						<TextField
							sx={{ minWidth: 80, maxWidth: 128 }}
							value={skill.subName ?? ""}
							onChange={(event) => onFieldChange(skill.id, "subName", event.target.value)}
							placeholder="自定义"
							size="small"
							fullWidth
						/>
					)}
				</Box>
			</TableCell>
			<TableCell align="center" sx={{ minWidth: 40, p: "6px 2px" }}>
				{skill.baseValue}
			</TableCell>
			<EditableNumberCell
				value={skill.growth}
				onChange={(value) => onFieldChange(skill.id, "growth", value)}
				readOnly={readOnly}
			/>
			<EditableNumberCell
				value={skill.occupationPoints}
				onChange={(value) => onFieldChange(skill.id, "occupationPoints", value)}
				disabled={occupationDisabled}
				readOnly={readOnly}
			/>
			<EditableNumberCell
				value={skill.interestPoints}
				onChange={(value) => onFieldChange(skill.id, "interestPoints", value)}
				disabled={skill.cannotAssignInterest}
				readOnly={readOnly}
			/>
			<TableCell align="center" sx={{ minWidth: 128, p: "6px 2px" }}>
				{total}/{hard}/{extreme}
			</TableCell>
		</TableRow>
	);
}

function EditableNumberCell({
	value,
	onChange,
	disabled = false,
	readOnly = false,
}: {
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
	readOnly?: boolean;
}) {
	return (
		<TableCell align="center" sx={{ minWidth: 80, p: "6px 2px" }}>
			{readOnly ? (
				<Typography variant="body2">{value || "—"}</Typography>
			) : (
				<TextField
					type="number"
					value={value || ""}
					onChange={(event) => onChange(Number(event.target.value) || 0)}
					size="small"
					disabled={disabled}
					slotProps={{ htmlInput: { min: 0 } }}
				/>
			)}
		</TableCell>
	);
}

function formatSkillLabel(skill: Skill): string {
	const subName = skill.subName?.trim();
	if (!subName) {
		return skill.name;
	}
	return `${skill.name}：${subName}`;
}
