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
		<div className="grid min-w-0 gap-4">
			<StatBlock
				label="体力 HP"
				current={status.currentHP}
				max={derived.maxHP}
				extra={`重伤阈值 ${derived.majorWound}`}
				tone="danger"
				onChange={setCurrentHP}
				readOnly={isReadOnly}
			/>
			<div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(13.5rem,1fr))]">
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
				<div className="grid min-w-0 gap-3">
					<h3 className="font-semibold">异常状态</h3>
					<div className="grid gap-2 grid-cols-2 md:grid-cols-3">
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
		info: "bg-[color:var(--status-info)]",
		danger: "bg-destructive",
	}[tone];

	return (
		<Panel contentClassName="px-4">
			<div className="grid min-w-0 gap-4">
				<div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
					<div className="min-w-0">
						<h3 className="font-semibold">{label}</h3>
						<div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
							<span>最大值 {max}</span>
							{extra ? <span>{extra}</span> : null}
						</div>
					</div>
					<div className="shrink-0 text-2xl font-semibold tabular-nums">{current}</div>
				</div>

				<div className="h-2 overflow-hidden rounded-full bg-muted">
					<div className={cn("h-full transition-all", indicatorClass)} style={{ width: `${progress}%` }} />
				</div>

				<div className="grid min-w-0 grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,0.7fr)] items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="w-full px-0"
						onClick={() => onChange(Math.max(0, current - 1))}
						disabled={readOnly}>
						-1
					</Button>
					<div className="min-w-0 rounded-sm border border-border/60 bg-background/45 px-2 py-2 text-center text-lg font-semibold tabular-nums">
						{current}
					</div>
					<Button
						variant="outline"
						size="sm"
						className="w-full px-0"
						onClick={() => onChange(Math.min(max, current + 1))}
						disabled={readOnly}>
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
			className={cn(
				"justify-start",
				checked &&
					tone === "warning" &&
					"bg-[color:var(--status-warning)] text-background hover:opacity-90",
			)}
			onClick={() => onChange(!checked)}
			disabled={disabled}>
			{label}
		</Button>
	);
}
