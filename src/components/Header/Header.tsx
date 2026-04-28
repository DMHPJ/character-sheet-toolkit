"use client";

import { Download, FileJson, UserRound, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ReadOnlyBox, StatusBadge } from "@/components/SheetPrimitives/SheetPrimitives";
import ReadOnlyField from "@/components/ReadOnlyField/ReadOnlyField";
import { useCharacterStore } from "@/stores/useCharacterStore";
import { convertCharacterJsonToSt } from "@/utils/jsonToSt";

export default function Header({
	onOpenInfo,
	readOnly,
}: {
	onOpenInfo: () => void;
	readOnly?: boolean;
}) {
	const [, setClipboardTick] = useState(0);
	const storeReadOnly = useCharacterStore((state) => state.readOnly);
	const info = useCharacterStore((state) => state.info);
	const attrs = useCharacterStore((state) => state.attributes);
	const derived = useCharacterStore((state) => state.derived);
	const status = useCharacterStore((state) => state.currentStatus);
	const exportJSON = useCharacterStore((state) => state.exportJSON);
	const importJSON = useCharacterStore((state) => state.importJSON);
	const isReadOnly = readOnly ?? storeReadOnly;

	const conditions = [
		status.conditions.majorWound ? "重伤" : null,
		status.conditions.dying ? "濒死" : null,
		status.conditions.unconscious ? "昏迷" : null,
		status.conditions.tempInsanity ? "临时疯狂" : null,
		status.conditions.indefInsanity ? "不定疯狂" : null,
		status.conditions.permInsanity ? "永久疯狂" : null,
	].filter(Boolean) as string[];

	const handleJsonToSt = () => {
		const json = exportJSON();
		const stInfo = convertCharacterJsonToSt(json);
		navigator.clipboard.writeText(stInfo).catch(() => {
			const el = document.createElement("textarea");
			el.value = stInfo;
			document.body.appendChild(el);
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
		});
		setClipboardTick((value) => value + 1);
		toast.success("已复制到剪切板");
	};

	const handleExport = () => {
		const json = exportJSON();
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `${info.name || "character"}.json`;
		anchor.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (!file) {
				return;
			}
			importJSON(await file.text());
			toast.success("人物卡已导入");
		};
		input.click();
	};

	return (
		<header className="relative min-w-0 overflow-hidden rounded-md border border-border/70 bg-card/90 p-3 shadow-[var(--panel-shadow)] backdrop-blur md:p-4">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right_top,color-mix(in_oklab,var(--accent)_24%,transparent),transparent_28rem)]" />
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/45" />

			<div className="relative grid min-w-0 gap-4 xl:grid-cols-[minmax(280px,1.15fr)_minmax(320px,1fr)_minmax(260px,0.85fr)] xl:items-center">
				<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch">
					<Avatar className="size-20 shrink-0 rounded-sm border border-primary/35 bg-muted shadow-sm sm:size-24">
						{info.portrait ? <AvatarImage src={info.portrait} alt={info.name || "调查员头像"} /> : null}
						<AvatarFallback>
							<UserRound className="size-12"/>
						</AvatarFallback>
					</Avatar>

					<div className="min-w-0 flex-1">
						{isReadOnly ? (
							<ReadOnlyField
								label="调查员"
								value={info.name}
								placeholder="未填写调查员姓名"
								onClick={onOpenInfo}
							/>
						) : (
							<ReadOnlyBox label="调查员" value={info.name} placeholder="调查员姓名" onClick={onOpenInfo} />
						)}

						<div className="mt-2 flex flex-wrap items-center gap-1.5">
							<StatusBadge tone="default">{info.occupation || "未设置职业"}</StatusBadge>
							<StatusBadge tone="muted">{info.era || "未设置时代"}</StatusBadge>
							<StatusBadge tone="muted">{info.player || "未填写玩家"}</StatusBadge>
						</div>
					</div>
				</div>

				<div className="grid min-w-0 grid-cols-1 gap-2 min-[480px]:grid-cols-2 sm:grid-cols-4">
					<VitalGauge label="HP" current={status.currentHP} max={derived.maxHP} tone="danger" />
					<VitalGauge label="SAN" current={status.currentSAN} max={derived.maxSAN} tone="info" />
					<VitalGauge label="MP" current={status.currentMP} max={derived.maxMP} tone="primary" />
					<VitalGauge label="Luck" current={attrs.Luck} max={99} tone="warning" />
				</div>

				<div className="grid min-w-0 gap-2">
					<div className="flex flex-wrap gap-1.5">
						{conditions.length > 0 ? (
							conditions.map((condition) => (
								<StatusBadge
									key={condition}
									tone={condition.includes("疯狂") || condition === "昏迷" ? "warning" : "danger"}>
									{condition}
								</StatusBadge>
							))
						) : (
							<StatusBadge tone="success">状态稳定</StatusBadge>
						)}
					</div>

					<div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-3">
						<MiniStat label="MOV" value={derived.MOV} />
						<MiniStat label="DB" value={derived.damageBonus} />
						<MiniStat label="Build" value={derived.build} />
					</div>

					{!isReadOnly ? (
						<div className="flex flex-wrap gap-1.5">
							<Button variant="outline" size="xs" onClick={handleImport}>
								<Download data-icon="inline-start" />
								导入
							</Button>
							<Button size="xs" onClick={handleExport}>
								<Upload data-icon="inline-start" />
								导出
							</Button>
							<Button variant="outline" size="xs" onClick={handleJsonToSt}>
								<FileJson data-icon="inline-start" />
								骰娘格式
							</Button>
						</div>
					) : null}
				</div>
			</div>
		</header>
	);
}

function VitalGauge({
	label,
	current,
	max,
	tone,
}: {
	label: string;
	current: number;
	max: number;
	tone: "primary" | "info" | "danger" | "warning";
}) {
	const pct = max > 0 ? Math.min(100, Math.max(0, (current / max) * 100)) : 0;
	const color = {
		primary: "bg-primary",
		info: "bg-[color:var(--status-info)]",
		danger: "bg-destructive",
		warning: "bg-[color:var(--status-warning)]",
	}[tone];

	return (
		<div className="grid gap-1.5 rounded-sm border border-border/60 bg-background/45 p-2 text-center shadow-inner shadow-foreground/5">
			<div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
			<div className="text-lg font-semibold leading-none tabular-nums">{current}</div>
			<div className="h-1 overflow-hidden rounded-full bg-muted">
				<div className={color} style={{ width: `${pct}%`, height: "100%" }} />
			</div>
			<div className="text-[0.6875rem] leading-none text-muted-foreground">/ {max}</div>
		</div>
	);
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="rounded-sm border border-border/60 bg-background/45 px-2 py-1.5">
			<div className="text-[0.6875rem] uppercase tracking-widest text-muted-foreground">{label}</div>
			<div className="font-semibold leading-tight tabular-nums">{value}</div>
		</div>
	);
}
