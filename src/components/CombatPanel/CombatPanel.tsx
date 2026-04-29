"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AutoComplete, type AutoCompleteOption } from "@/components/AutoComplete/AutoComplete";
import {
	EmptyHint,
	MetricTile,
	Panel,
	StatusBadge,
	SubPanel,
	TextInput,
} from "@/components/SheetPrimitives/SheetPrimitives";
import { formatSkillDisplayName } from "@/data/skills";
import { createWeaponFromCatalog, WEAPON_CATALOG } from "@/data/weapons";
import type { WeaponCatalogEntry } from "@/data/weapons";
import { useCharacterStore } from "@/stores/useCharacterStore";
import type { CharacterStoreSnapshot } from "@/stores/useCharacterStore";
import type { InventoryItem, Skill, Weapon } from "@/types/character";

const WEAPON_TYPES = ["格斗", "射击", "投掷", "特殊"];
const WEAPON_OPTIONS: AutoCompleteOption[] = WEAPON_CATALOG.map((weapon) => ({
	value: weapon.id,
	label: weapon.name,
	description: `${weapon.category} / ${weapon.skill} / ${weapon.damage}`,
	keywords: [
		weapon.name,
		weapon.category,
		weapon.skill,
		weapon.damage,
		weapon.range,
		weapon.eras,
		weapon.price,
		weapon.invention,
		weapon.kind,
	].join(" "),
}));

const WEAPON_SKILL_ALIASES: Record<string, string[]> = {
	斗殴: ["格斗：斗殴"],
	手枪: ["射击：手枪"],
	投掷: ["投掷"],
	爆破: ["爆破"],
	电气维修: ["电气维修"],
	炮术: ["炮术"],
};

type WeaponFieldValue = string | number | boolean;
type SkillOption = { id: string; label: string; total: number };

export default function CombatPanel({
	readOnly,
	store,
}: {
	readOnly?: boolean;
	store?: CharacterStoreSnapshot;
}) {
	const globalReadOnly = useCharacterStore((state) => state.readOnly);
	const globalDerived = useCharacterStore((state) => state.derived);
	const globalSkills = useCharacterStore((state) => state.skills);
	const globalWeapons = useCharacterStore((state) => state.weapons);
	const globalInventory = useCharacterStore((state) => state.inventory);
	const globalAddWeapon = useCharacterStore((state) => state.addWeapon);
	const globalUpdateWeapon = useCharacterStore((state) => state.updateWeapon);
	const globalRemoveWeapon = useCharacterStore((state) => state.removeWeapon);
	const globalAddInventoryItem = useCharacterStore((state) => state.addInventoryItem);
	const globalUpdateInventoryItem = useCharacterStore((state) => state.updateInventoryItem);
	const globalRemoveInventoryItem = useCharacterStore((state) => state.removeInventoryItem);
	const storeReadOnly = store?.readOnly ?? globalReadOnly;
	const derived = store?.derived ?? globalDerived;
	const skills = store?.skills ?? globalSkills;
	const weapons = store?.weapons ?? globalWeapons;
	const inventory = store?.inventory ?? globalInventory;
	const addWeapon = store?.addWeapon ?? globalAddWeapon;
	const updateWeapon = store?.updateWeapon ?? globalUpdateWeapon;
	const removeWeapon = store?.removeWeapon ?? globalRemoveWeapon;
	const addInventoryItem = store?.addInventoryItem ?? globalAddInventoryItem;
	const updateInventoryItem = store?.updateInventoryItem ?? globalUpdateInventoryItem;
	const removeInventoryItem = store?.removeInventoryItem ?? globalRemoveInventoryItem;
	const isReadOnly = readOnly ?? storeReadOnly;

	const skillOptions = skills
		.map((skill) => ({
			id: skill.id,
			label: formatSkillLabel(skill),
			total: getSkillTotal(skill),
		}));

	const brawlSkill = skills.find((skill) => skill.id === "fighting_brawl");
	const dodgeSkill = skills.find((skill) => skill.id === "dodge");

	if (isReadOnly) {
		return (
			<div className="mb-4 grid min-w-0 gap-4">
				<div className="grid min-w-0 gap-3 sm:grid-cols-3">
					<CombatSummaryCard
						title="徒手攻击"
						value={`${getSkillTotal(brawlSkill)} / ${Math.floor(getSkillTotal(brawlSkill) / 2)} / ${Math.floor(getSkillTotal(brawlSkill) / 5)}`}
						description={`伤害 1D3 + ${derived.damageBonus}`}
					/>
					<CombatSummaryCard
						title="闪避"
						value={`${getSkillTotal(dodgeSkill)} / ${Math.floor(getSkillTotal(dodgeSkill) / 2)} / ${Math.floor(getSkillTotal(dodgeSkill) / 5)}`}
						description="常规 / 困难 / 极限成功率"
					/>
					<CombatSummaryCard
						title="体格与伤害加值"
						value={`${derived.build}`}
						description={`Damage Bonus ${derived.damageBonus}`}
					/>
				</div>
				<Panel>
					<div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:items-start">
						<ReadonlyWeaponTable weapons={weapons} skillOptions={skillOptions} />
						<ReadonlyInventoryTable inventory={inventory} />
					</div>
				</Panel>
			</div>
		);
	}

	return (
		<div className="grid min-w-0 gap-4">
			<div className="grid min-w-0 gap-3 md:grid-cols-3">
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
				<CombatSummaryCard
					title="体格与伤害加值"
					value={`${derived.build}`}
					description={`Damage Bonus ${derived.damageBonus}`}
				/>
			</div>

			<Panel
				title="武器表"
				description="成功率会根据技能自动换算为常规 / 困难 / 极限"
				action={
					<Button variant="outline" size="sm" onClick={addWeapon}>
						<Plus data-icon="inline-start" />
						新增武器
					</Button>
				}>
				{weapons.length === 0 ? (
					<EmptyHint>还没有录入武器，先从常用近战或配枪开始</EmptyHint>
				) : (
					<div className="grid min-w-0 gap-3">
						{weapons.map((weapon, index) => (
							<WeaponEditor
								key={weapon.id}
								index={index}
								weapon={weapon}
								skillOptions={skillOptions}
								readOnly={false}
								onChange={(field, value) => updateWeapon(weapon.id, field, value)}
								onRemove={() => removeWeapon(weapon.id)}
							/>
						))}
					</div>
				)}
			</Panel>

			<Panel
				title="随身携带物"
				description="用于记录状态、位置和跑团中常用的关键物品"
				action={
					<Button variant="outline" size="sm" onClick={addInventoryItem}>
						<Plus data-icon="inline-start" />
						新增物品
					</Button>
				}>
				{inventory.length === 0 ? (
					<EmptyHint>还没有携带物条目，可以先记下证件、武器、药品和关键线索</EmptyHint>
				) : (
					<div className="grid min-w-0 gap-3">
						{inventory.map((item, index) => (
							<SubPanel
								key={item.id}
								className="grid min-w-0 gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto] lg:items-end">
								<TextInput
									label={`物品 ${index + 1}`}
									value={item.name}
									onChange={(event) => updateInventoryItem(item.id, "name", event.target.value)}
								/>
								<TextInput
									label="状态"
									value={item.status}
									onChange={(event) => updateInventoryItem(item.id, "status", event.target.value)}
								/>
								<TextInput
									label="位置"
									value={item.location}
									onChange={(event) => updateInventoryItem(item.id, "location", event.target.value)}
								/>
								<Button variant="destructive" size="icon-sm" aria-label="删除物品" onClick={() => removeInventoryItem(item.id)}>
									<Trash2 />
								</Button>
							</SubPanel>
						))}
					</div>
				)}
			</Panel>
		</div>
	);
}

function ReadonlyWeaponTable({
	weapons,
	skillOptions,
}: {
	weapons: Weapon[];
	skillOptions: SkillOption[];
}) {
	return (
		<div className="grid min-w-0 gap-3">
			<h3 className="font-semibold">武器表</h3>
			<div className="min-w-0 overflow-hidden border border-border/60">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>武器名称</TableHead>
							<TableHead>类型</TableHead>
							<TableHead>使用技能</TableHead>
							<TableHead className="text-center">伤害</TableHead>
							<TableHead className="text-center">常规/困难/极限</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{weapons.map((weapon) => (
							<WeaponRow key={weapon.id} weapon={weapon} skillOptions={skillOptions} />
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

function ReadonlyInventoryTable({ inventory }: { inventory: InventoryItem[] }) {
	return (
		<div className="grid min-w-0 gap-3">
			<h3 className="font-semibold">随身物品表</h3>
			<div className="min-w-0 overflow-hidden border border-border/60">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>物品名称</TableHead>
							<TableHead>状态</TableHead>
							<TableHead>位置</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{inventory.map((item) => (
							<InventoryItemRow key={item.id} inventory={item} />
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

function WeaponRow({
	weapon,
	skillOptions,
}: {
	weapon: Weapon;
	skillOptions: SkillOption[];
}) {
	const selectedSkill = skillOptions.find((option) => option.label === weapon.skill);
	const success = selectedSkill?.total ?? 0;

	return (
		<TableRow>
			<TableCell>{weapon.name}</TableCell>
			<TableCell>{weapon.type}</TableCell>
			<TableCell>{weapon.skill}</TableCell>
			<TableCell className="text-center">{weapon.damage}</TableCell>
			<TableCell className="text-center tabular-nums">
				{success || "—"}/{success ? Math.floor(success / 2) : "—"}/{success ? Math.floor(success / 5) : "—"}
			</TableCell>
		</TableRow>
	);
}

function InventoryItemRow({ inventory }: { inventory: InventoryItem }) {
	return (
		<TableRow>
			<TableCell>{inventory.name}</TableCell>
			<TableCell>{inventory.status}</TableCell>
			<TableCell>{inventory.location}</TableCell>
		</TableRow>
	);
}

function WeaponEditor({
	index,
	weapon,
	skillOptions,
	readOnly,
	onChange,
	onRemove,
}: {
	index: number;
	weapon: Weapon;
	skillOptions: SkillOption[];
	readOnly: boolean;
	onChange: (field: keyof Weapon, value: WeaponFieldValue) => void;
	onRemove: () => void;
}) {
	const selectedSkill = skillOptions.find((option) => option.label === weapon.skill);
	const success = selectedSkill?.total ?? 0;
	const effectiveSkillOptions = getWeaponSkillOptions(skillOptions, weapon);

	return (
		<SubPanel className="grid gap-4">
			<div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
				<h3 className="font-semibold">武器 {index + 1}</h3>
				<Button variant="destructive" size="icon-sm" aria-label="删除武器" onClick={onRemove} disabled={readOnly}>
					<Trash2 />
				</Button>
			</div>

			<div className="grid min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
				<AutoComplete
					label="武器名称"
					value={weapon.name}
					options={WEAPON_OPTIONS}
					placeholder="搜索或输入武器"
					onInputChange={(value) => onChange("name", value)}
					onValueChange={(value) => {
						const catalogWeapon = WEAPON_CATALOG.find((entry) => entry.id === value);
						if (!catalogWeapon) {
							return;
						}
						applyCatalogWeapon(catalogWeapon, skillOptions, onChange);
					}}
				/>
				<PlainSelectField label="类型" value={weapon.type} onChange={(value) => onChange("type", value)} options={WEAPON_TYPES.map((type) => ({ value: type, label: type }))} />
				<SelectField
					label="使用技能"
					value={weapon.skill}
					onChange={(value) => onChange("skill", value)}
					options={effectiveSkillOptions.map((option) => ({
						value: option.label,
						label: option.label,
						description: `常规 ${option.total}`,
					}))}
				/>
				<TextInput label="伤害" value={weapon.damage} onChange={(event) => onChange("damage", event.target.value)} />
			</div>

			<div className="grid min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-[repeat(auto-fit,minmax(8rem,1fr))_minmax(5.5rem,auto)]">
				<TextInput label="射程" value={weapon.range} onChange={(event) => onChange("range", event.target.value)} />
				<TextInput label="次数" value={weapon.attacksPerRound || ""} onChange={(event) => onChange("attacksPerRound", event.target.value)} />
				<TextInput label="装弹量" value={weapon.ammo} onChange={(event) => onChange("ammo", event.target.value)} />
				<TextInput label="故障值" value={weapon.malfunction} onChange={(event) => onChange("malfunction", event.target.value)} />
				<label className="flex h-10 min-w-0 items-center justify-center gap-2 self-end rounded-sm border border-border/60 bg-background/45 px-3 py-2">
					<Checkbox checked={weapon.penetration} onCheckedChange={(checked) => onChange("penetration", Boolean(checked))} />
					<span className="text-sm">穿刺</span>
				</label>
			</div>

			<Separator />
			<div className="flex flex-wrap gap-2">
				<StatusBadge tone="muted">常规 {success || "—"}</StatusBadge>
				<StatusBadge tone="muted">困难 {success ? Math.floor(success / 2) : "—"}</StatusBadge>
				<StatusBadge tone="muted">极限 {success ? Math.floor(success / 5) : "—"}</StatusBadge>
			</div>
		</SubPanel>
	);
}

function applyCatalogWeapon(
	entry: WeaponCatalogEntry,
	skillOptions: SkillOption[],
	onChange: (field: keyof Weapon, value: WeaponFieldValue) => void,
) {
	const weapon = createWeaponFromCatalog(entry, resolveCatalogSkill(entry, skillOptions));

	onChange("name", weapon.name);
	onChange("type", weapon.type);
	onChange("skill", weapon.skill);
	onChange("damage", weapon.damage);
	onChange("range", weapon.range);
	onChange("penetration", weapon.penetration);
	onChange("attacksPerRound", weapon.attacksPerRound);
	onChange("ammo", weapon.ammo);
	onChange("malfunction", weapon.malfunction);
}

function resolveCatalogSkill(entry: WeaponCatalogEntry, skillOptions: SkillOption[]): string {
	const aliases = WEAPON_SKILL_ALIASES[entry.skill] ?? [];
	const candidates = [
		entry.skill,
		...aliases,
		`${entry.category}：${entry.skill}`,
		entry.category === "射击" ? `射击：${entry.skill}` : "",
		entry.category === "格斗" ? `格斗：${entry.skill}` : "",
	].filter(Boolean);
	const exact = skillOptions.find((option) => candidates.includes(option.label));
	if (exact) {
		return exact.label;
	}

	const emptyVariant = skillOptions.find((option) => option.label === entry.category);
	if (emptyVariant) {
		return emptyVariant.label;
	}

	const categoryFallback = skillOptions.find((option) => option.label.startsWith(`${entry.category}：`));
	if (categoryFallback) {
		return categoryFallback.label;
	}

	const namedFallback = skillOptions.find((option) => option.label === entry.skill);
	return namedFallback?.label ?? entry.skill;
}

function getWeaponSkillOptions(skillOptions: SkillOption[], weapon: Weapon): SkillOption[] {
	if (!weapon.skill || skillOptions.some((option) => option.label === weapon.skill)) {
		return skillOptions;
	}

	return [
		...skillOptions,
		{
			id: `${weapon.id}_imported_skill`,
			label: weapon.skill,
			total: 0,
		},
	];
}

function SelectField({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<AutoComplete
			label={label}
			value={value}
			options={options}
			placeholder="请选择"
			onInputChange={onChange}
			onValueChange={(nextValue) => onChange(nextValue)}
		/>
	);
}

function PlainSelectField({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<label className="grid min-w-0 gap-1.5">
			<span className="text-xs font-semibold uppercase tracking-widest break-words text-muted-foreground">{label}</span>
			<Select value={value || undefined} onValueChange={(nextValue) => onChange(nextValue ?? "")}>
				<SelectTrigger className="w-full min-w-0">
					<SelectValue placeholder="请选择" />
				</SelectTrigger>
				<SelectContent align="start" alignItemWithTrigger={false}>
					<SelectGroup>
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</label>
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
	return <MetricTile label={title} value={value} description={description} />;
}

function getSkillTotal(skill?: Skill): number {
	if (!skill) {
		return 0;
	}
	return skill.baseValue + skill.growth + skill.occupationPoints + skill.interestPoints;
}

function formatSkillLabel(skill: Skill): string {
	return formatSkillDisplayName(skill);
}
