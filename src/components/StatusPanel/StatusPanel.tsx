"use client";

import { Button } from "@/components/ui/button";
import { Panel, SubPanel } from "@/components/SheetPrimitives/SheetPrimitives";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { cn } from "@/lib/utils";

export default function StatusPanel({ readOnly }: { readOnly?: boolean }) {
	const storeReadOnly = useCharacterStore((state) => state.readOnly);
	const derived = useCharacterStore((state) => state.derived);
	const status = useCharacterStore((state) => state.currentStatus);
	const setCurrentHP = useCharacterStore((state) => state.setCurrentHP);
	const setCurrentMP = useCharacterStore((state) => state.setCurrentMP);
	const setCurrentSAN = useCharacterStore((state) => state.setCurrentSAN);
	const setCondition = useCharacterStore((state) => state.setCondition);
	const isReadOnly = readOnly ?? storeReadOnly;

	return (
		<div className="grid gap-4">
			<StatBlock
				label="体力 HP"
				current={status.currentHP}
				max={derived.maxHP}
				extra={`重伤阈值 ${derived.majorWound}`}
				tone="danger"
				onChange={setCurrentHP}
				readOnly={isReadOnly}
			/>
			<div className="grid gap-4 md:grid-cols-2">
				<StatBlock
					label="理智 SAN"
					current={status.currentSAN}
					max={derived.maxSAN}
					tone="info"
					onChange={setCurrentSAN}
					readOnly={isReadOnly}
				/>
				<StatBlock
					label="魔法 MP"
					current={status.currentMP}
					max={derived.maxMP}
					tone="primary"
					onChange={setCurrentMP}
					readOnly={isReadOnly}
				/>
			</div>

			<SubPanel>
				<div className="grid gap-3">
					<h3 className="font-semibold">异常状态</h3>
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						<ConditionToggle label="重伤" checked={status.conditions.majorWound} onChange={(value) => setCondition("majorWound", value)} tone="danger" disabled={isReadOnly} />
						<ConditionToggle label="昏迷" checked={status.conditions.unconscious} onChange={(value) => setCondition("unconscious", value)} tone="warning" disabled={isReadOnly} />
						<ConditionToggle label="濒死" checked={status.conditions.dying} onChange={(value) => setCondition("dying", value)} tone="danger" disabled={isReadOnly} />
						<ConditionToggle label="临时疯狂" checked={status.conditions.tempInsanity} onChange={(value) => setCondition("tempInsanity", value)} tone="warning" disabled={isReadOnly} />
						<ConditionToggle label="不定疯狂" checked={status.conditions.indefInsanity} onChange={(value) => setCondition("indefInsanity", value)} tone="danger" disabled={isReadOnly} />
						<ConditionToggle label="永久疯狂" checked={status.conditions.permInsanity} onChange={(value) => setCondition("permInsanity", value)} tone="danger" disabled={isReadOnly} />
					</div>
				</div>
			</SubPanel>
		</div>
	);
}

function StatBlock({
	label,
	current,
	max,
	extra,
	tone,
	onChange,
	readOnly,
}: {
	label: string;
	current: number;
	max: number;
	extra?: string;
	tone: "primary" | "info" | "danger";
	onChange: (value: number) => void;
	readOnly: boolean;
}) {
	const progress = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;
	const indicatorClass = {
		primary: "bg-primary",
		info: "bg-sky-300",
		danger: "bg-destructive",
	}[tone];

	return (
		<Panel>
			<div className="grid gap-4">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h3 className="font-semibold">{label}</h3>
						<div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
							<span>最大值 {max}</span>
							{extra ? <span>{extra}</span> : null}
						</div>
					</div>
					<div className="text-2xl font-semibold tabular-nums">{current}</div>
				</div>

				<div className="h-2 bg-muted">
					<div className={cn("h-full transition-all", indicatorClass)} style={{ width: `${progress}%` }} />
				</div>

				<div className="flex items-center justify-center gap-2">
					<Button variant="outline" size="sm" onClick={() => onChange(Math.max(0, current - 1))} disabled={readOnly}>
						-1
					</Button>
					<div className="min-w-24 border border-border/60 bg-background/40 px-5 py-2 text-center text-lg font-semibold tabular-nums">
						{current}
					</div>
					<Button variant="outline" size="sm" onClick={() => onChange(Math.min(max, current + 1))} disabled={readOnly}>
						+1
					</Button>
				</div>
			</div>
		</Panel>
	);
}

function ConditionToggle({
	label,
	checked,
	onChange,
	tone,
	disabled = false,
}: {
	label: string;
	checked: boolean;
	onChange: (value: boolean) => void;
	tone: "danger" | "warning";
	disabled?: boolean;
}) {
	return (
		<Button
			variant={checked ? (tone === "danger" ? "destructive" : "secondary") : "outline"}
			className={cn("justify-start", checked && tone === "warning" && "bg-amber-500 text-black hover:bg-amber-400")}
			onClick={() => onChange(!checked)}
			disabled={disabled}>
			{label}
		</Button>
	);
}
