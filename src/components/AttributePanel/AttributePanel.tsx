"use client";

import { Panel, ReadOnlyBox, StatusBadge, TextInput } from "@/components/SheetPrimitives/SheetPrimitives";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { CharacterStoreSnapshot } from "@/stores/useCharacterStore";
import type { AttributeKey } from "@/types/character";

const ATTR_META: { key: AttributeKey; label: string; en: string }[] = [
	{ key: "STR", label: "力量", en: "STR" },
	{ key: "DEX", label: "敏捷", en: "DEX" },
	{ key: "POW", label: "意志", en: "POW" },
	{ key: "CON", label: "体质", en: "CON" },
	{ key: "APP", label: "外貌", en: "APP" },
	{ key: "EDU", label: "教育", en: "EDU" },
	{ key: "SIZ", label: "体型", en: "SIZ" },
	{ key: "INT", label: "智力", en: "INT" },
	{ key: "Luck", label: "幸运", en: "Luck" },
];

function getAttrDescription(key: AttributeKey, value: number): string {
	if (value <= 0) return "尚未录入";
	const map: Record<AttributeKey, string[]> = {
		STR: ["体能非常薄弱", "力气偏弱", "常人水准", "力量出众", "足以称得上怪力"],
		DEX: ["动作迟缓", "不够灵活", "反应正常", "身手敏捷", "快得惊人"],
		POW: ["意志薄弱", "容易动摇", "自制力正常", "意志坚定", "近乎钢铁意志"],
		CON: ["经常抱恙", "体质较差", "健康正常", "体格强健", "异常耐久"],
		APP: ["不太起眼", "形象普通", "谈吐得体", "颇具魅力", "极具吸引力"],
		EDU: ["教育程度有限", "基础教育", "受过良好教育", "高等教育背景", "学识非常广博"],
		SIZ: ["体格瘦小", "偏小身材", "中等身材", "高大魁梧", "体型巨大"],
		INT: ["思考较慢", "理解力一般", "思维正常", "头脑聪明", "非常敏锐"],
		Luck: ["最近不太走运", "运势平平", "普通运气", "幸运加身", "命运偏爱"],
	};
	if (value <= 20) return map[key][0];
	if (value <= 40) return map[key][1];
	if (value <= 60) return map[key][2];
	if (value <= 80) return map[key][3];
	return map[key][4];
}

export default function AttributePanel({
	readOnly,
	store,
}: {
	readOnly?: boolean;
	store?: CharacterStoreSnapshot;
}) {
	const globalReadOnly = useCharacterStore((state) => state.readOnly);
	const globalAttributes = useCharacterStore((state) => state.attributes);
	const globalSetAttribute = useCharacterStore((state) => state.setAttribute);
	const storeReadOnly = store?.readOnly ?? globalReadOnly;
	const attributes = store?.attributes ?? globalAttributes;
	const setAttribute = store?.setAttribute ?? globalSetAttribute;
	const isReadOnly = readOnly ?? storeReadOnly;

	const totalPoints = ATTR_META.filter((attribute) => attribute.key !== "Luck").reduce(
		(sum, attribute) => sum + attributes[attribute.key],
		0,
	);

	if (isReadOnly) {
		return (
			<div className="mb-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{ATTR_META.map(({ key, label, en }) => {
					const value = attributes[key];
					const half = value > 0 ? Math.floor(value / 2) : "—";
					const fifth = value > 0 ? Math.floor(value / 5) : "—";

					return (
						<ReadOnlyBox
							key={key}
							label={`${label} ${en}`}
							value={`${value || "—"} / ${half} / ${fifth}`}
						/>
					);
				})}
			</div>
		);
	}

	return (
		<Panel
			title={
				<div className="flex min-w-0 flex-wrap items-center gap-2">
					<span>核心属性</span>
					<StatusBadge tone="default">总点数 {totalPoints}</StatusBadge>
				</div>
			}>
			<div className="grid min-w-0 grid-cols-2 gap-2">
				{ATTR_META.map(({ key, label, en }) => {
					const value = attributes[key];
					const half = value > 0 ? Math.floor(value / 2) : "—";
					const fifth = value > 0 ? Math.floor(value / 5) : "—";

					return (
						<div
							key={key}
							className="grid min-w-0 gap-2 rounded-sm border border-border/60 bg-background/35 px-2.5 py-2.5 sm:px-3">
							<div className="flex min-w-0 items-start justify-between gap-2">
								<div className="min-w-0 leading-tight">
									<div className="truncate font-semibold">{label}</div>
									<div className="text-[0.6875rem] uppercase tracking-widest text-muted-foreground">{en}</div>
								</div>
								<div
									className="min-w-0 truncate text-right text-[0.6875rem] text-muted-foreground"
									title={getAttrDescription(key, value)}>
									{getAttrDescription(key, value)}
								</div>
							</div>
							<TextInput
								className="[&_input]:h-8"
								type="number"
								min={0}
								max={99}
								value={value || ""}
								onChange={(event) => {
									const next = Number(event.target.value) || 0;
									setAttribute(key, Math.max(0, Math.min(99, next)));
								}}
							/>
							<div className="grid grid-cols-2 gap-1.5 text-xs">
								<div className="flex min-w-0 items-center justify-between gap-1 rounded-sm border border-border/50 bg-background/35 px-2 py-1">
									<span className="truncate text-muted-foreground">困难</span>
									<span className="shrink-0 font-semibold tabular-nums">{half}</span>
								</div>
								<div className="flex min-w-0 items-center justify-between gap-1 rounded-sm border border-border/50 bg-background/35 px-2 py-1">
									<span className="truncate text-muted-foreground">极限</span>
									<span className="shrink-0 font-semibold tabular-nums">{fifth}</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</Panel>
	);
}
