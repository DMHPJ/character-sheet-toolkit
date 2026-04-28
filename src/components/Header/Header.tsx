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
		<header className="relative overflow-hidden border border-border/70 bg-card/90 p-5 shadow-sm shadow-black/20 backdrop-blur md:p-6">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right_top,rgba(195,165,95,0.14),transparent_28rem)]" />

			<div className="relative grid gap-6 xl:grid-cols-[minmax(280px,1.15fr)_minmax(320px,1fr)_minmax(260px,0.85fr)] xl:items-center">
				<div className="flex items-center gap-4">
					<Avatar className="size-20 border border-primary/30 bg-muted" size="lg">
						{info.portrait ? <AvatarImage src={info.portrait} alt={info.name || "调查员头像"} /> : null}
						<AvatarFallback>
							<UserRound />
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

						<div className="mt-3 flex flex-wrap items-center gap-2">
							<StatusBadge tone="default">{info.occupation || "未设置职业"}</StatusBadge>
							<StatusBadge tone="muted">{info.era || "未设置时代"}</StatusBadge>
							<StatusBadge tone="muted">{info.player || "未填写玩家"}</StatusBadge>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					<VitalGauge label="HP" current={status.currentHP} max={derived.maxHP} tone="danger" />
					<VitalGauge label="SAN" current={status.currentSAN} max={derived.maxSAN} tone="info" />
					<VitalGauge label="MP" current={status.currentMP} max={derived.maxMP} tone="primary" />
					<VitalGauge label="Luck" current={attrs.Luck} max={99} tone="warning" />
				</div>

				<div className="grid gap-3">
					<div className="flex flex-wrap gap-2">
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

					<div className="grid grid-cols-3 gap-2">
						<MiniStat label="MOV" value={derived.MOV} />
						<MiniStat label="DB" value={derived.damageBonus} />
						<MiniStat label="Build" value={derived.build} />
					</div>

					{!isReadOnly ? (
						<div className="flex flex-wrap gap-2">
							<Button variant="outline" size="sm" onClick={handleImport}>
								<Download data-icon="inline-start" />
								导入
							</Button>
							<Button size="sm" onClick={handleExport}>
								<Upload data-icon="inline-start" />
								导出
							</Button>
							<Button variant="outline" size="sm" onClick={handleJsonToSt}>
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
		info: "bg-sky-300",
		danger: "bg-destructive",
		warning: "bg-amber-300",
	}[tone];

	return (
		<div className="grid gap-2 border border-border/60 bg-background/35 p-3 text-center">
			<div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
			<div className="text-xl font-semibold tabular-nums">{current}</div>
			<div className="h-1.5 bg-muted">
				<div className={color} style={{ width: `${pct}%`, height: "100%" }} />
			</div>
			<div className="text-xs text-muted-foreground">/ {max}</div>
		</div>
	);
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="border border-border/60 bg-background/35 p-2">
			<div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
			<div className="mt-1 font-semibold tabular-nums">{value}</div>
		</div>
	);
}
