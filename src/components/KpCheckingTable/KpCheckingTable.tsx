"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ChevronDown, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EmptyHint, Panel, StatusBadge } from "@/components/SheetPrimitives/SheetPrimitives";
import {
	createCharacterStoreSnapshot,
	type CharacterStoreSnapshot,
} from "@/stores/useCharacterStore";
import type { CharacterData } from "@/types/character";
import ReadOnlyCharacterSheet from "../CharacterSheet/ReadOnlyCharacterSheet";

interface ImportedCharacterRow {
	id: string;
	fileName: string;
	store: CharacterStoreSnapshot;
}

export default function KpCheckingTable() {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [rows, setRows] = useState<ImportedCharacterRow[]>([]);

	const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files ?? []);
		if (files.length === 0) {
			return;
		}

		const nextRows: ImportedCharacterRow[] = [];
		const errors: string[] = [];

		for (const file of files) {
			try {
				const text = await file.text();
				const items = parseImportedCharacters(text);
				for (const [index, item] of items.entries()) {
					const suffix = items.length > 1 ? ` #${index + 1}` : "";
					nextRows.push({
						id: `${file.name}-${index}-${Date.now()}`,
						fileName: `${file.name}${suffix}`,
						store: createCharacterStoreSnapshot(item, { readOnly: true }),
					});
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : "未知错误";
				errors.push(`${file.name}: ${message}`);
			}
		}

		if (nextRows.length > 0) {
			setRows((current) => [...current, ...nextRows]);
			toast.success(`已导入 ${nextRows.length} 张角色卡`);
		}

		if (errors.length > 0) {
			toast.error(errors.join("；"));
		}

		event.target.value = "";
	};

	return (
		<div className="mx-auto w-full max-w-[1800px] p-3 md:p-5">
			<Panel
				title="人物卡表"
				description="支持同时导入多张角色卡，每一张角色卡会追加为一行。"
				action={
					<div className="flex flex-wrap items-center gap-2">
						<StatusBadge tone="muted">当前已导入 {rows.length} 张角色卡</StatusBadge>
						<Button variant="outline" onClick={() => fileInputRef.current?.click()}>
							<Download data-icon="inline-start" />
							导入人物卡
						</Button>
					</div>
				}>
				<input
					ref={fileInputRef}
					type="file"
					accept=".json,application/json"
					multiple
					hidden
					onChange={handleImport}
				/>

				{rows.length > 0 ? (
					<div className="overflow-hidden border border-border/60">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-24 text-center">展开详情</TableHead>
									<TableHead>姓名</TableHead>
									<TableHead>玩家</TableHead>
									<TableHead className="text-center">年龄</TableHead>
									<TableHead className="text-center">性别</TableHead>
									<TableHead>国籍</TableHead>
									<TableHead>住地</TableHead>
									<TableHead>职业</TableHead>
									<TableHead>来源</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((row) => (
									<CharacterRow key={row.id} row={row} />
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<EmptyHint>还没有导入人物卡，请先选择一张或多张角色卡文件。</EmptyHint>
				)}
			</Panel>
		</div>
	);
}

function CharacterRow({ row }: { row: ImportedCharacterRow }) {
	const [open, setOpen] = useState(false);
	const { info } = row.store;

	return (
		<>
			<TableRow>
				<TableCell className="text-center">
					<Button variant="ghost" size="icon-xs" aria-label="展开详情" onClick={() => setOpen(!open)}>
						{open ? <ChevronDown /> : <ChevronRight />}
					</Button>
				</TableCell>
				<TableCell>{info.name || "未命名"}</TableCell>
				<TableCell>{info.player || "—"}</TableCell>
				<TableCell className="text-center">{info.age || "—"}</TableCell>
				<TableCell className="text-center">{info.gender || "—"}</TableCell>
				<TableCell>{info.nationality || "—"}</TableCell>
				<TableCell>{info.residence || "—"}</TableCell>
				<TableCell>{info.occupation || "—"}</TableCell>
				<TableCell>
					<Tooltip>
						<TooltipTrigger render={<span className="block max-w-48 truncate text-sm" />}>
							{row.fileName}
						</TooltipTrigger>
						<TooltipContent>{row.fileName}</TooltipContent>
					</Tooltip>
				</TableCell>
			</TableRow>
			{open ? (
				<TableRow>
					<TableCell colSpan={9} className="bg-background/35 p-4">
						<ReadOnlyCharacterSheet store={row.store} />
					</TableCell>
				</TableRow>
			) : null}
		</>
	);
}

function parseImportedCharacters(jsonText: string): CharacterData[] {
	const parsed: unknown = JSON.parse(jsonText);

	if (Array.isArray(parsed)) {
		return parsed as CharacterData[];
	}

	if (isCharacterCollection(parsed)) {
		return parsed.characters;
	}

	if (parsed && typeof parsed === "object") {
		return [parsed as CharacterData];
	}

	throw new Error("JSON 内容不是有效的人物卡数据");
}

function isCharacterCollection(value: unknown): value is { characters: CharacterData[] } {
	return (
		value !== null &&
		typeof value === "object" &&
		"characters" in value &&
		Array.isArray((value as { characters?: CharacterData[] }).characters)
	);
}
