"use client";

import { TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { AutoComplete, type AutoCompleteOption } from "@/components/AutoComplete/AutoComplete";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import {
	MetricTile,
	Notice,
	Panel,
	StatusBadge,
	SubPanel,
} from "@/components/SheetPrimitives/SheetPrimitives";
import { OCCUPATIONS, getOccupationById } from "@/data/occupations";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { OccupationChoiceGroup, OccupationSkillOption } from "@/types/character";

const EMPTY_SELECTION = "__none__";

export default function OccupationPanel({
	inDialog = false,
	readOnly,
}: {
	inDialog?: boolean;
	readOnly?: boolean;
}) {
	const storeReadOnly = useCharacterStore((state) => state.readOnly);
	const info = useCharacterStore((state) => state.info);
	const occupationState = useCharacterStore((state) => state.occupationState);
	const occupationSummary = useCharacterStore((state) => state.occupationSummary);
	const setOccupation = useCharacterStore((state) => state.setOccupation);
	const setOccupationSelection = useCharacterStore((state) => state.setOccupationSelection);
	const isReadOnly = readOnly ?? storeReadOnly;
	const occupation = getOccupationById(occupationState.occupationId);
	const [query, setQuery] = useState(occupation ? `${occupation.id}. ${occupation.name}` : "");

	const occupationOptions = useMemo<AutoCompleteOption[]>(
		() =>
			OCCUPATIONS.map((item) => ({
				value: String(item.id),
				label: `${item.id}. ${item.name}`,
				description: `信用评级 ${item.creditRatingMin}-${item.creditRatingMax}`,
				keywords: `${item.name} ${item.id} ${item.description} ${item.contacts}`,
			})),
		[],
	);

	const content = (
		<div className="grid min-w-0 gap-5">
			<h2 className="text-base font-semibold uppercase tracking-widest">职业模板</h2>

			<div className="grid min-w-0 gap-2">
				<AutoComplete
					label="职业"
					placeholder="搜索职业名称或编号"
					value={query}
					disabled={isReadOnly}
					options={occupationOptions}
					onInputChange={setQuery}
					onValueChange={(value, option) => {
						setOccupation(Number(value));
						setQuery(option.label);
					}}
				/>
			</div>

			{occupation ? (
				<>
					<div className="grid min-w-0 gap-3">
						<MetricTile label="职业点公式" value={occupationSummary.formulaLabel} />
						<div className="grid gap-3 sm:grid-cols-2">
							<MetricTile label="职业点 / 已分配" value={`${occupationSummary.occupationPointsTotal} / ${occupationSummary.occupationPointsSpent}`} />
							<MetricTile label="兴趣点 / 已分配" value={`${occupationSummary.interestPointsTotal} / ${occupationSummary.interestPointsSpent}`} />
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<StatusBadge tone={occupationSummary.creditRatingInRange ? "success" : "warning"}>
							信用评级 {occupationSummary.creditRatingMin}-{occupationSummary.creditRatingMax}
						</StatusBadge>
						<StatusBadge tone="muted">当前职业：{info.occupation || "未选择"}</StatusBadge>
						<StatusBadge tone={occupationSummary.occupationPointsRemaining < 0 ? "danger" : "default"}>
							剩余职业点 {Math.max(0, occupationSummary.occupationPointsRemaining)}
						</StatusBadge>
					</div>

					<div className="grid min-w-0 gap-1 text-sm break-words text-muted-foreground">
						<p>{occupation.description}</p>
						<p>推荐关系人：{occupation.contacts}</p>
					</div>

					{occupation.choiceGroups.map((group) => (
						<OccupationChoiceSelectGroup
							key={group.id}
							group={group}
							selected={occupationState.selectedSkills[group.id] ?? []}
							disabled={isReadOnly}
							onChange={setOccupationSelection}
						/>
					))}

					{!occupationSummary.creditRatingInRange ? (
						<Notice title="信用评级不符合职业要求" tone="warning">
							当前信用评级为 {occupationSummary.creditRatingValue}，未落在该职业要求的{" "}
							{occupationSummary.creditRatingMin}-{occupationSummary.creditRatingMax} 区间内。
						</Notice>
					) : null}
				</>
			) : (
				<div className="flex gap-2 text-sm text-muted-foreground">
					<TriangleAlert className="mt-0.5" />
					<span>先选择职业，再进入技能表分配本职技能点。未选择职业时，职业点输入将保持锁定。</span>
				</div>
			)}
		</div>
	);

	if (inDialog) {
		return content;
	}

	return <Panel>{content}</Panel>;
}

function OccupationChoiceSelectGroup({
	group,
	selected,
	disabled,
	onChange,
}: {
	group: OccupationChoiceGroup;
	selected: string[];
	disabled: boolean;
	onChange: (groupId: string, selectedSkillIds: string[]) => void;
}) {
	const multiple = group.count > 1;
	const selectedLabel = selected.length
		? selected
				.map((optionId) => group.options.find((option) => option.id === optionId))
				.filter((option): option is OccupationSkillOption => Boolean(option))
				.map(formatOccupationSkillOption)
				.join("、")
		: "";

	return (
		<SubPanel className="grid gap-3">
			<div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
				<div className="min-w-0 font-semibold break-words">{group.label}</div>
				<StatusBadge tone="muted">
					{selected.length}/{group.count}
				</StatusBadge>
			</div>
			<Select
				multiple={multiple}
				value={multiple ? selected : selected[0] ?? EMPTY_SELECTION}
				onValueChange={(value) => {
					if (Array.isArray(value)) {
						onChange(group.id, value.slice(0, group.count));
						return;
					}
					onChange(group.id, value && value !== EMPTY_SELECTION ? [value] : []);
				}}
				disabled={disabled}>
				<SelectTrigger className="w-full min-w-0">
					<span className={selectedLabel ? "truncate" : "truncate text-muted-foreground"}>
						{selectedLabel || (multiple ? `请选择 ${group.count} 项` : "请选择")}
					</span>
				</SelectTrigger>
				<SelectContent align="start" alignItemWithTrigger={false}>
					<SelectGroup>
						{!multiple ? <SelectItem value={EMPTY_SELECTION}>未选择</SelectItem> : null}
						{group.options.map((option) => {
							const active = selected.includes(option.id);
							const disabledByLimit = multiple && !active && selected.length >= group.count;

							return (
								<SelectItem key={option.id} value={option.id} disabled={disabledByLimit}>
									{formatOccupationSkillOption(option)}
								</SelectItem>
							);
						})}
					</SelectGroup>
				</SelectContent>
			</Select>
		</SubPanel>
	);
}

function formatOccupationSkillOption(option: OccupationSkillOption): string {
	return `${option.label}${option.subName ? `（${option.subName}）` : ""}`;
}
