"use client";

import { useMemo, useState } from "react";
import { AutoComplete, type AutoCompleteOption } from "@/components/AutoComplete/AutoComplete";
import { EmptyHint, Panel, StatusBadge } from "@/components/SheetPrimitives/SheetPrimitives";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WEAPON_CATALOG, type WeaponCatalogEntry } from "@/data/weapons";
import { cn } from "@/lib/utils";

const WEAPON_COLUMNS = [
	{ label: "武器名称", className: "min-w-36" },
	{ label: "技能", className: "min-w-28" },
	{ label: "伤害", className: "min-w-32" },
	{ label: "射程", className: "min-w-24" },
	{ label: "是否贯穿", className: "min-w-24 text-center" },
	{ label: "每轮次数", className: "min-w-24 text-center" },
	{ label: "装弹量", className: "min-w-24 text-center" },
	{ label: "故障值", className: "min-w-24 text-center" },
	{ label: "常见时代", className: "min-w-36" },
	{ label: "价格（1920s/现代）", className: "min-w-40" },
	{ label: "发明时间", className: "min-w-28" },
];

const WEAPON_OPTIONS: AutoCompleteOption[] = WEAPON_CATALOG.map((weapon) => ({
	value: weapon.id,
	label: weapon.name,
	description: `${weapon.category} / ${weapon.skill} / ${weapon.damage}`,
	keywords: getWeaponSearchText(weapon),
}));

export default function CombatTable() {
	const [search, setSearch] = useState("");

	const filteredWeapons = useMemo(() => {
		const query = normalizeSearchText(search);
		if (!query) {
			return WEAPON_CATALOG;
		}

		return WEAPON_CATALOG.filter((weapon) => getWeaponSearchText(weapon).includes(query));
	}, [search]);

	return (
		<div className="mx-auto min-h-svh h-svh w-full max-w-450 p-3 md:p-5">
			<Panel
				title="武器列表"
				description="规则书武器资料速查。"
				className="h-full"
				contentClassName="overflow-hidden flex-1"
				action={
					<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:min-w-96">
						<AutoComplete
							value={search}
							options={WEAPON_OPTIONS}
							placeholder="搜索武器、技能、伤害或时代"
							onInputChange={setSearch}
							onValueChange={(_, option) => setSearch(option.label)}
						/>
						<StatusBadge tone="muted">
							显示 {filteredWeapons.length} / {WEAPON_CATALOG.length} 件武器
						</StatusBadge>
					</div>
				}>
				{filteredWeapons.length > 0 ? (
					<div className="overflow-hidden border border-border/60 bg-background/30 h-full">
						<Table className="text-xs md:text-sm">
							<TableHeader className="sticky top-0 z-10 bg-card shadow-[0_1px_0_var(--border)]">
								<TableRow className="hover:bg-transparent">
									{WEAPON_COLUMNS.map((column) => (
										<TableHead key={column.label} className={cn("h-10 px-2", column.className)}>
											{column.label}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredWeapons.map((row) => (
									<WeaponRow key={row.id} row={row} />
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<EmptyHint>没有匹配的武器资料。</EmptyHint>
				)}
			</Panel>
		</div>
	);
}

function WeaponRow({ row }: { row: WeaponCatalogEntry }) {
	return (
		<TableRow>
			<TableCell className="px-2 py-2 font-medium">{formatValue(row.name, "未命名")}</TableCell>
			<TableCell className="px-2 py-2">{formatValue(row.skill)}</TableCell>
			<TableCell className="px-2 py-2 font-mono text-[13px]">{formatValue(row.damage)}</TableCell>
			<TableCell className="px-2 py-2">{formatValue(row.range)}</TableCell>
			<TableCell className="px-2 py-2 text-center">{row.penetration ? "是" : "否"}</TableCell>
			<TableCell className="px-2 py-2 text-center">{formatValue(row.attacksPerRound)}</TableCell>
			<TableCell className="px-2 py-2 text-center">{formatValue(row.ammo)}</TableCell>
			<TableCell className="px-2 py-2 text-center">{formatValue(row.malfunction)}</TableCell>
			<TableCell className="px-2 py-2">{formatValue(row.eras)}</TableCell>
			<TableCell className="px-2 py-2">{formatValue(row.price)}</TableCell>
			<TableCell className="px-2 py-2">{formatValue(row.invention)}</TableCell>
		</TableRow>
	);
}

function formatValue(value: string, fallback = "—") {
	return value || fallback;
}

function getWeaponSearchText(weapon: WeaponCatalogEntry) {
	return normalizeSearchText(
		[
			weapon.name,
			weapon.category,
			weapon.skill,
			weapon.damage,
			weapon.range,
			weapon.attacksPerRound,
			weapon.ammo,
			weapon.malfunction,
			weapon.eras,
			weapon.price,
			weapon.invention,
			weapon.kind,
			weapon.notes,
		].join(" "),
	);
}

function normalizeSearchText(value: string) {
	return value.trim().toLowerCase();
}
