"use client";

import { useRef, useState, type ChangeEvent } from "react";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowRightRounded from "@mui/icons-material/KeyboardArrowRightRounded";
import GetAppRoundedIcon from "@mui/icons-material/GetAppRounded";
import {
	Alert,
	alpha,
	Box,
	Button,
	Collapse,
	IconButton,
	Paper,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
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
	const [errorMessage, setErrorMessage] = useState("");

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
		}

		if (errors.length > 0) {
			setErrorMessage(errors.join("；"));
		}

		event.target.value = "";
	};

	return (
		<Paper sx={{ p: 2, mx: 2, backgroundColor: alpha("#171d1b", 0.84) }}>
			<Snackbar
				open={Boolean(errorMessage)}
				autoHideDuration={4000}
				onClose={() => setErrorMessage("")}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}>
				<Alert severity="error" variant="outlined" onClose={() => setErrorMessage("")}>
					{errorMessage}
				</Alert>
			</Snackbar>

			<Box
				sx={{
					display: "flex",
					gap: 1.5,
					justifyContent: "space-between",
					flexDirection: { xs: "column", md: "row" },
					mb: 1,
				}}>
				<Box sx={{ display: "grid", gap: 1 }}>
					<Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
						<Typography variant="h2" sx={{ fontSize: "1.15rem" }}>
							人物卡表
						</Typography>
						<Typography variant="body2" color="text.secondary">
							支持同时导入多张角色卡，每一张角色卡会追加为一行。
						</Typography>
            <Typography variant="body2" color="text.secondary">
							当前已导入 {rows.length} 张角色卡
						</Typography>
					</Box>
					<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
						<Button
							variant="outlined"
							startIcon={<GetAppRoundedIcon />}
							onClick={() => fileInputRef.current?.click()}>
							导入人物卡
						</Button>
					</Box>
				</Box>
			</Box>

			<input
				ref={fileInputRef}
				type="file"
				accept=".json,application/json"
				multiple
				hidden
				onChange={handleImport}
			/>

			<TableContainer
				sx={{ borderRadius: 0.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
				<Table aria-label="collapsible table" stickyHeader size="small">
					<TableHead>
						<TableRow>
							<TableCell sx={{ p: "6px", width: "5rem", minWidth: "5rem" }} align="center">展开详情</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>姓名</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>玩家</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "3rem" }} align="center">年龄</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "3rem" }} align="center">性别</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>国籍</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>住地</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>职业</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>来源</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.length > 0 ? (
							rows.map((row) => <CharacterRow key={row.id} row={row} />)
						) : (
							<TableRow>
								<TableCell colSpan={9} align="center" sx={{ py: 4 }}>
									<Typography color="text.secondary">
										还没有导入人物卡，请先选择一张或多张角色卡文件。
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}

function CharacterRow({ row }: { row: ImportedCharacterRow }) {
	const [open, setOpen] = useState(false);
	const { info } = row.store;

	return (
		<>
			<TableRow>
				<TableCell align="center" sx={{maxWidth: 120}}>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowDownRounded /> : <KeyboardArrowRightRounded />}
					</IconButton>
				</TableCell>
				<TableCell sx={{ p: "2px" }}>{info.name || "未命名"}</TableCell>
				<TableCell sx={{ p: "2px" }}>{info.player || "—"}</TableCell>
				<TableCell sx={{ p: "2px" }} align="center">{info.age || "—"}</TableCell>
				<TableCell sx={{ p: "2px" }} align="center">{info.gender || "—"}</TableCell>
				<TableCell sx={{ p: "2px" }}>{info.nationality || "—"}</TableCell>
				<TableCell sx={{ p: "2px" }}>{info.residence || "—"}</TableCell>
				<TableCell sx={{ p: "2px" }}>{info.occupation || "—"}</TableCell>
				<TableCell sx={{ p: "2px" }}>
					<Tooltip title={row.fileName}>
						<Typography variant="body2" noWrap>
							{row.fileName}
						</Typography>
					</Tooltip>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<ReadOnlyCharacterSheet store={row.store} />
					</Collapse>
				</TableCell>
			</TableRow>
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
