"use client";

import { Plus, X, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { AutoComplete, type AutoCompleteOption } from "@/components/AutoComplete/AutoComplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Panel, StatusBadge } from "@/components/SheetPrimitives/SheetPrimitives";
import {
	EXPANDABLE_SKILL_GROUPS,
	formatSkillDisplayName,
	hasAllocatedSkillValue,
} from "@/data/skills";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { CharacterStoreSnapshot } from "@/stores/useCharacterStore";
import type { Skill } from "@/types/character";
import { cn } from "@/lib/utils";

function getSkillSearchText(skill: Skill): string {
	return [
		formatSkillDisplayName(skill),
		skill.name,
		skill.subName ?? "",
		skill.variantBaseName ?? "",
		skill.category,
	]
		.join(" ")
		.toLowerCase();
}

export default function SkillTable({
	readOnly,
	store,
	className,
}: {
	readOnly?: boolean;
	store?: CharacterStoreSnapshot;
	className?: string;
}) {
	const globalReadOnly = useCharacterStore((state) => state.readOnly);
	const globalSkills = useCharacterStore((state) => state.skills);
	const globalOccupationSummary = useCharacterStore((state) => state.occupationSummary);
	const globalSetSkillField = useCharacterStore((state) => state.setSkillField);
	const globalToggleSkillCheck = useCharacterStore((state) => state.toggleSkillCheck);
	const globalAddSkillVariant = useCharacterStore((state) => state.addSkillVariant);
	const globalAddCustomSkill = useCharacterStore((state) => state.addCustomSkill);
	const storeReadOnly = store?.readOnly ?? globalReadOnly;
	const skills = store?.skills ?? globalSkills;
	const occupationSummary = store?.occupationSummary ?? globalOccupationSummary;
	const setSkillField = store?.setSkillField ?? globalSetSkillField;
	const toggleSkillCheck = store?.toggleSkillCheck ?? globalToggleSkillCheck;
	const addSkillVariant = store?.addSkillVariant ?? globalAddSkillVariant;
	const addCustomSkill = store?.addCustomSkill ?? globalAddCustomSkill;
	const [search, setSearch] = useState("");
	const isReadOnly = readOnly ?? storeReadOnly;

	const baseSkills = useMemo(() => {
		return skills.filter((skill) => (isReadOnly ? hasAllocatedSkillValue(skill) : true));
	}, [isReadOnly, skills]);

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
	const mobileFilteredSkills = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) {
			return baseSkills;
		}

		return baseSkills.filter((skill) => getSkillSearchText(skill).includes(query));
	}, [baseSkills, search]);
	const skillSearchOptions = useMemo<AutoCompleteOption[]>(
		() =>
			baseSkills.map((skill) => ({
				value: skill.id,
				label: formatSkillDisplayName(skill),
				description: `${skill.category} / 初始 ${skill.baseValue}`,
				keywords: `${skill.name} ${skill.subName ?? ""} ${skill.variantBaseName ?? ""} ${skill.category}`,
			})),
		[baseSkills],
	);

	const splitIndex = Math.ceil(baseSkills.length / 2);
	const leftSkills = baseSkills.slice(0, splitIndex);
	const rightSkills = baseSkills.slice(splitIndex);

	return (
		<Panel
			title="技能表"
			description={isReadOnly ? undefined : "职业点只允许分配到当前职业模板覆盖的技能，兴趣点按 INT×2 计算"}
			className={cn("min-w-0 overflow-visible 2xl:h-full 2xl:overflow-hidden", className)}
			contentClassName="2xl:min-h-0 2xl:flex-1 2xl:overflow-hidden">
			<div className="grid min-w-0 gap-5 2xl:h-full 2xl:min-h-0 2xl:grid-rows-[auto_minmax(0,1fr)]">
				<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
					<div className="grid gap-3">
						<div className="flex flex-wrap gap-2">
							<StatusBadge tone={occupationSummary.occupationPointsRemaining < 0 ? "danger" : "default"}>
								职业点 {occupationSummary.occupationPointsSpent}/{occupationSummary.occupationPointsTotal}
							</StatusBadge>
							<StatusBadge tone={occupationSummary.interestPointsRemaining < 0 ? "danger" : "default"}>
								兴趣点 {occupationSummary.interestPointsSpent}/{occupationSummary.interestPointsTotal}
							</StatusBadge>
							{occupationSummary.creditRatingMin !== null ? (
								<StatusBadge tone={occupationSummary.creditRatingInRange ? "success" : "warning"}>
									{!occupationSummary.creditRatingInRange ? <TriangleAlert data-icon="inline-start" /> : null}
									信用评级 {occupationSummary.creditRatingValue}（应为 {occupationSummary.creditRatingMin}-{occupationSummary.creditRatingMax}）
								</StatusBadge>
							) : null}
						</div>

						{!isReadOnly ? (
							<div className="flex flex-wrap gap-2">
								{EXPANDABLE_SKILL_GROUPS.map((group) => (
									<Button key={group.id} variant="outline" size="xs" onClick={() => addSkillVariant(group.id)}>
										<Plus data-icon="inline-start" />
										新增{group.label}
									</Button>
								))}
								<Button variant="outline" size="xs" onClick={addCustomSkill}>
									<Plus data-icon="inline-start" />
									新增自定义技能
								</Button>
							</div>
						) : null}
					</div>

					{!isReadOnly ? (
						<AutoComplete
							className="min-w-full md:w-72 md:min-w-72"
							value={search}
							options={skillSearchOptions}
							placeholder="搜索技能或子类"
							onInputChange={setSearch}
							onValueChange={(_, option) => setSearch(option.label)}
						/>
					) : null}
				</div>

				<SkillCardList
					skills={mobileFilteredSkills}
					occupationSkillIds={occupationSummary.allowedSkillIds}
					readOnly={isReadOnly}
					onFieldChange={setSkillField}
					onToggleCheck={toggleSkillCheck}
				/>

				<div className="hidden min-w-0 gap-4 md:grid md:grid-cols-2 2xl:min-h-0">
					<SkillTableSection
						skills={leftSkills}
						occupationSkillIds={occupationSummary.allowedSkillIds}
						highlightedSkillIds={highlightedSkillIds}
						readOnly={isReadOnly}
						onFieldChange={setSkillField}
						onToggleCheck={toggleSkillCheck}
					/>
					<SkillTableSection
						skills={rightSkills}
						occupationSkillIds={occupationSummary.allowedSkillIds}
						highlightedSkillIds={highlightedSkillIds}
						readOnly={isReadOnly}
						onFieldChange={setSkillField}
						onToggleCheck={toggleSkillCheck}
					/>
				</div>
			</div>
		</Panel>
	);
}

function SkillCardList({
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
		<div className="grid min-w-0 gap-3 md:hidden">
			{skills.map((skill) => (
				<SkillCard
					key={skill.id}
					skill={skill}
					isOccupationSkill={occupationSkillIds.includes(skill.id)}
					isHighlighted={false}
					readOnly={readOnly}
					onFieldChange={onFieldChange}
					onToggleCheck={onToggleCheck}
				/>
			))}
		</div>
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
		<div className="min-w-0 overflow-hidden rounded-sm border border-border/60 2xl:min-h-0">
			<Table>
				<TableHeader className="sticky top-0 z-10 bg-card">
					<TableRow className="bg-background/85 backdrop-blur">
						<TableHead className="w-12 text-center">成功</TableHead>
						<TableHead>技能</TableHead>
						<TableHead className="w-14 px-1 text-center">初始</TableHead>
						<TableHead className="w-14 px-1 text-center">成长</TableHead>
						<TableHead className="w-14 px-1 text-center">职业</TableHead>
						<TableHead className="w-14 px-1 text-center">兴趣</TableHead>
						<TableHead className="text-center">常规/困难/极限</TableHead>
					</TableRow>
				</TableHeader>
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
		</div>
	);
}

function SkillCard({
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
	const occupationDisabledReason = skill.cannotAssignOccupation ? "特殊禁用" : !isOccupationSkill ? "非本职" : undefined;
	const interestDisabledReason = skill.cannotAssignInterest ? "特殊禁用" : undefined;

	return (
		<div
			className={cn(
				"grid min-w-0 gap-3 rounded-sm border border-border/60 bg-background/35 p-3",
				isHighlighted && "bg-(--status-warning-bg)",
				skill.checked && "bg-primary/10",
				!skill.checked && isOccupationSkill && "bg-secondary/10",
			)}>
			<div className="flex min-w-0 items-start gap-3">
				<Checkbox
					checked={skill.checked}
					onCheckedChange={() => onToggleCheck(skill.id)}
					disabled={readOnly}
					aria-label={`${formatSkillDisplayName(skill)} 成功标记`}
				/>
				<div className="grid min-w-0 flex-1 gap-2">
					<div className="flex min-w-0 flex-wrap items-center gap-1.5">
						<span className="min-w-0 wrap-break-word font-semibold leading-tight">{formatSkillDisplayName(skill)}</span>
						{hasSubName && !readOnly && !hiddenSubName ? (
							<Input
								className="h-7 w-24 px-2 text-xs"
								value={skill.subName ?? ""}
								onChange={(event) => onFieldChange(skill.id, "subName", event.target.value)}
								placeholder="自定义"
							/>
						) : null}
						{isOccupationSkill ? <StatusBadge tone="default">本职</StatusBadge> : null}
						{isSpecial ? <StatusBadge tone="warning">特殊</StatusBadge> : null}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-1.5">
				<SkillValue label="常规" value={total} />
				<SkillValue label="困难" value={hard} />
				<SkillValue label="极限" value={extreme} />
			</div>

			<div className="grid grid-cols-3 gap-1.5">
				<EditableNumberField
					label="成长"
					value={skill.growth}
					onChange={(value) => onFieldChange(skill.id, "growth", value)}
					readOnly={readOnly}
				/>
				<EditableNumberField
					label="职业"
					value={skill.occupationPoints}
					onChange={(value) => onFieldChange(skill.id, "occupationPoints", value)}
					disabled={occupationDisabled}
					disabledReason={occupationDisabledReason}
					readOnly={readOnly}
				/>
				<EditableNumberField
					label="兴趣"
					value={skill.interestPoints}
					onChange={(value) => onFieldChange(skill.id, "interestPoints", value)}
					disabled={skill.cannotAssignInterest}
					disabledReason={interestDisabledReason}
					readOnly={readOnly}
				/>
			</div>
		</div>
	);
}

function SkillValue({ label, value }: { label: string; value: number }) {
	return (
		<div className="min-w-0 rounded-sm border border-border/50 bg-background/45 px-2 py-1 text-center">
			<div className="truncate text-[0.6875rem] text-muted-foreground">{label}</div>
			<div className="font-semibold tabular-nums leading-tight">{value}</div>
		</div>
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
	const occupationDisabledReason = skill.cannotAssignOccupation ? "特殊禁用" : !isOccupationSkill ? "非本职" : undefined;
	const interestDisabledReason = skill.cannotAssignInterest ? "特殊禁用" : undefined;

	return (
		<TableRow
			className={cn(
				isHighlighted && "bg-(--status-warning-bg)",
				skill.checked && "bg-primary/10",
				!skill.checked && isOccupationSkill && "bg-secondary/10",
			)}>
			<TableCell className="text-center">
				<Checkbox checked={skill.checked} onCheckedChange={() => onToggleCheck(skill.id)} disabled={readOnly} />
			</TableCell>
			<TableCell className="min-w-40 whitespace-normal py-2">
				<div className="grid gap-1">
					<div className="flex flex-wrap items-center gap-2">
						<span className="font-semibold">{formatSkillDisplayName(skill)}</span>
						{isOccupationSkill ? <StatusBadge tone="default">本职</StatusBadge> : null}
						{isSpecial ? <StatusBadge tone="warning">特殊</StatusBadge> : null}
					</div>
					{hasSubName && !readOnly && !hiddenSubName ? (
						<Input
							className="h-8 max-w-36"
							value={skill.subName ?? ""}
							onChange={(event) => onFieldChange(skill.id, "subName", event.target.value)}
							placeholder="自定义"
						/>
					) : null}
				</div>
			</TableCell>
			<TableCell className="w-14 px-1 text-center tabular-nums">{skill.baseValue}</TableCell>
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
			<TableCell className="text-center tabular-nums">
				{total}/{hard}/{extreme}
			</TableCell>
		</TableRow>
	);
}

function EditableNumberField({
	label,
	value,
	onChange,
	disabled = false,
	disabledReason,
	readOnly = false,
}: {
	label: string;
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
	disabledReason?: string;
	readOnly?: boolean;
}) {
	return (
		<label className="grid min-w-0 gap-1">
			<span className="truncate text-center text-[0.6875rem] font-semibold text-muted-foreground">{label}</span>
			{readOnly ? (
				<span className="flex h-8 items-center justify-center rounded-sm border border-border/50 bg-background/45 text-sm tabular-nums">
					{value || "—"}
				</span>
			) : disabled ? (
				<span
					className="flex h-8 items-center justify-center rounded-sm border border-border/50 bg-background/35 text-muted-foreground"
					title={disabledReason}>
					<X />
				</span>
			) : (
				<Input
					type="number"
					min={0}
					value={value || ""}
					onChange={(event) => onChange(Number(event.target.value) || 0)}
					className="h-8 px-2 text-center"
				/>
			)}
		</label>
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
		<TableCell className="w-14 min-w-14 px-1 text-center">
			{readOnly ? (
				<span className="text-sm tabular-nums">{value || "—"}</span>
			) : disabled ? (
				<div className="flex min-h-9 items-center justify-center gap-1 text-muted-foreground" title={disabledReason}>
					<X />
				</div>
			) : (
				<Input
					type="number"
					min={0}
					value={value || ""}
					onChange={(event) => onChange(Number(event.target.value) || 0)}
					className="h-8 w-12 min-w-0 px-2 text-center"
				/>
			)}
		</TableCell>
	);
}
