"use client";

import { TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	MetricTile,
	Notice,
	Panel,
	StatusBadge,
	SubPanel,
	TextInput,
} from "@/components/SheetPrimitives/SheetPrimitives";
import { OCCUPATIONS, getOccupationById } from "@/data/occupations";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { cn } from "@/lib/utils";

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

	const filteredOccupations = useMemo(() => {
		const text = query.trim().toLowerCase();
		if (!text) return OCCUPATIONS.slice(0, 12);
		return OCCUPATIONS.filter((item) => `${item.id}. ${item.name}`.toLowerCase().includes(text)).slice(0, 12);
	}, [query]);

	const content = (
		<div className="grid gap-5">
			<h2 className="text-base font-semibold uppercase tracking-widest">职业模板</h2>

			<div className="grid gap-2">
				<TextInput
					label="职业"
					placeholder="搜索职业名称或编号"
					value={query}
					disabled={isReadOnly}
					onChange={(event) => setQuery(event.target.value)}
				/>
				{!isReadOnly ? (
					<div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto border border-border/60 bg-background/30 p-2">
						{filteredOccupations.map((item) => (
							<Button
								key={item.id}
								type="button"
								size="xs"
								variant={occupation?.id === item.id ? "secondary" : "outline"}
								onClick={() => {
									setOccupation(item.id);
									setQuery(`${item.id}. ${item.name}`);
								}}>
								{item.id}. {item.name}
							</Button>
						))}
					</div>
				) : null}
			</div>

			{occupation ? (
				<>
					<div className="grid gap-3 md:grid-cols-3">
						<MetricTile label="职业点公式" value={occupationSummary.formulaLabel} />
						<MetricTile label="职业点 / 已分配" value={`${occupationSummary.occupationPointsTotal} / ${occupationSummary.occupationPointsSpent}`} />
						<MetricTile label="兴趣点 / 已分配" value={`${occupationSummary.interestPointsTotal} / ${occupationSummary.interestPointsSpent}`} />
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

					<div className="grid gap-1 text-sm text-muted-foreground">
						<p>{occupation.description}</p>
						<p>推荐关系人：{occupation.contacts}</p>
					</div>

					{occupation.choiceGroups.map((group) => {
						const selected = occupationState.selectedSkills[group.id] ?? [];

						return (
							<SubPanel key={group.id} className="grid gap-3">
								<div className="flex items-center justify-between gap-3">
									<div className="font-semibold">{group.label}</div>
									<StatusBadge tone="muted">
										{selected.length}/{group.count}
									</StatusBadge>
								</div>
								<div className="flex flex-wrap gap-2">
									{group.options.map((option) => {
										const active = selected.includes(option.id);
										const disabled = isReadOnly || (!active && selected.length >= group.count);

										return (
											<Button
												key={option.id}
												type="button"
												size="xs"
												variant={active ? "secondary" : "outline"}
												disabled={disabled}
												className={cn(disabled && !active && "opacity-45")}
												onClick={() => {
													if (active) {
														setOccupationSelection(
															group.id,
															selected.filter((item) => item !== option.id),
														);
														return;
													}
													if (group.count === 1) {
														setOccupationSelection(group.id, [option.id]);
														return;
													}
													setOccupationSelection(group.id, [...selected, option.id].slice(0, group.count));
												}}>
												{option.label}
												{option.subName ? `（${option.subName}）` : ""}
											</Button>
										);
									})}
								</div>
							</SubPanel>
						);
					})}

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
