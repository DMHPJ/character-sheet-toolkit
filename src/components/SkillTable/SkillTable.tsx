"use client";

import { useMemo, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
	Autocomplete,
	Box,
	Button,
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
import {
	EXPANDABLE_SKILL_GROUPS,
	formatSkillDisplayName,
	hasAllocatedSkillValue,
} from "@/data/skills";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { Skill } from "@/types/character";

export default function SkillTable() {
	const readOnly = useCharacterStore((state) => state.readOnly);
	const skills = useCharacterStore((state) => state.skills);
	const occupationSummary = useCharacterStore((state) => state.occupationSummary);
	const setSkillField = useCharacterStore((state) => state.setSkillField);
	const toggleSkillCheck = useCharacterStore((state) => state.toggleSkillCheck);
	const addSkillVariant = useCharacterStore((state) => state.addSkillVariant);
	const [search, setSearch] = useState("");

	const baseSkills = useMemo(() => {
		return skills.filter((skill) => (readOnly ? hasAllocatedSkillValue(skill) : true));
	}, [readOnly, skills]);

	const highlightedSkillIds = useMemo(() => {
		if (!search.trim()) {
			return new Set<string>();
		}

		const query = search.trim().toLowerCase();
		return new Set(
			baseSkills
				.filter((skill) => formatSkillDisplayName(skill).toLowerCase().includes(query))
				.map((skill) => skill.id),
		);
	}, [baseSkills, search]);

	const searchOptions = useMemo(() => {
		return Array.from(new Set(baseSkills.map((skill) => formatSkillDisplayName(skill))));
	}, [baseSkills]);

	const splitIndex = Math.ceil(baseSkills.length / 2);
	const leftSkills = baseSkills.slice(0, splitIndex);
	const rightSkills = baseSkills.slice(splitIndex);

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
						{!readOnly && (
							<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
								{EXPANDABLE_SKILL_GROUPS.map((group) => (
									<Button
										key={group.id}
										variant="outlined"
										size="small"
										startIcon={<AddRoundedIcon />}
										onClick={() => addSkillVariant(group.id)}>
										新增{group.label}
									</Button>
								))}
							</Box>
						)}
					</Box>

					{readOnly ? (
						<ReadOnlyField
							label="显示范围"
							value="仅展示已投入成长、职业或兴趣点的技能"
							minHeight={56}
						/>
					) : (
						<Autocomplete
							freeSolo
							options={searchOptions}
							inputValue={search}
							onInputChange={(_, value) => setSearch(value)}
							sx={{ minWidth: { xs: "100%", md: 280 } }}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="搜索技能或子类"
									size="small"
									slotProps={{
										...params.slotProps,
										input: {
											...params.slotProps?.input,
											startAdornment: (
												<>
													<InputAdornment position="start">
														<SearchRoundedIcon fontSize="small" />
													</InputAdornment>
													{params.slotProps?.input?.startAdornment}
												</>
											),
										},
									}}
								/>
							)}
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
						highlightedSkillIds={highlightedSkillIds}
						readOnly={readOnly}
						onFieldChange={setSkillField}
						onToggleCheck={toggleSkillCheck}
					/>
					<SkillTableSection
						skills={rightSkills}
						occupationSkillIds={occupationSummary.allowedSkillIds}
						highlightedSkillIds={highlightedSkillIds}
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
	highlightedSkillIds,
	readOnly,
	onFieldChange,
	onToggleCheck,
}: {
	skills: Skill[];
	occupationSkillIds: string[];
	highlightedSkillIds: Set<string>;
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
						<TableCell padding="checkbox">成功</TableCell>
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
							isHighlighted={highlightedSkillIds.has(skill.id)}
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
	isHighlighted,
	readOnly,
	onFieldChange,
	onToggleCheck,
}: {
	skill: Skill;
	isOccupationSkill: boolean;
	isHighlighted: boolean;
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
	const hasSubName = Boolean(
		skill.variantGroup || /（.*）|\(|[①②③：]/.test(skill.name) || skill.isCustom,
	);
	const occupationDisabled = skill.cannotAssignOccupation || !isOccupationSkill;
	const occupationDisabledReason = skill.cannotAssignOccupation
		? "特殊禁用"
		: !isOccupationSkill
			? "非本职"
			: undefined;
	const interestDisabledReason = skill.cannotAssignInterest ? "特殊禁用" : undefined;

	return (
		<TableRow
			hover
			sx={{
				backgroundColor: (theme) => {
					if (isHighlighted) {
						return alpha(theme.palette.warning.main, 0.2);
					}

					if (skill.checked) {
						return alpha(theme.palette.primary.main, 0.08);
					}

					if (isOccupationSkill) {
						return alpha(theme.palette.secondary.main, 0.06);
					}

					return undefined;
				},
				transition: (theme) =>
					theme.transitions.create("background-color", {
						duration: theme.transitions.duration.shorter,
					}),
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
							{formatSkillDisplayName(skill)}
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
				disabledReason={occupationDisabledReason}
				readOnly={readOnly}
			/>
			<EditableNumberCell
				value={skill.interestPoints}
				onChange={(value) => onFieldChange(skill.id, "interestPoints", value)}
				disabled={skill.cannotAssignInterest}
				disabledReason={interestDisabledReason}
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
	disabledReason,
	readOnly = false,
}: {
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
	disabledReason?: string;
	readOnly?: boolean;
}) {
	return (
		<TableCell align="center" sx={{ minWidth: 80, p: "6px 2px" }}>
			{readOnly ? (
				<Typography variant="body2">{value || "—"}</Typography>
			) : disabled ? (
				<Box
					sx={{
						width: "100%",
						minHeight: 40,
						px: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 1,
						color: "text.disabled",
					}}>
					<Box
						sx={{
							display: "flex",
							alignItems: "end",
							justifyContent: "center",
							gap: 0.5,
							textAlign: "center",
						}}>
						<ClearRoundedIcon sx={{ fontSize: 18, flexShrink: 0 }} />
						{disabledReason && (
							<Typography
								variant="caption"
								color="text.disabled"
								sx={{
									fontSize: 14,
									lineHeight: "18px",
									display: { xs: "none", xl: "inline" },
									whiteSpace: "nowrap",
								}}>
								{disabledReason}
							</Typography>
						)}
					</Box>
				</Box>
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
