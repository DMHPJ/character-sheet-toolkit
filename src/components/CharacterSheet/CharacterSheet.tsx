"use client";

import { useMemo, useState } from "react";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import HistoryEduRoundedIcon from "@mui/icons-material/HistoryEduRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import {
	Alert,
	Box,
	Chip,
	Dialog,
	DialogContent,
	Paper,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactElement } from "react";
import AttributePanel from "@/components/AttributePanel/AttributePanel";
import BackstoryPanel from "@/components/BackstoryPanel/BackstoryPanel";
import Header from "@/components/Header/Header";
import InfoPanel from "@/components/InfoPanel/InfoPanel";
import SkillTable from "@/components/SkillTable/SkillTable";
import StatusPanel from "@/components/StatusPanel/StatusPanel";
import { useCharacterStore } from "@/stores/useCharacterStore";

type TabId = "status" | "backstory" | "combat" | "rules";

const TABS: { id: TabId; label: string; icon: ReactElement }[] = [
	{ id: "status", label: "状态", icon: <Inventory2RoundedIcon fontSize="small" /> },
	{ id: "backstory", label: "背景故事", icon: <HistoryEduRoundedIcon fontSize="small" /> },
	{ id: "combat", label: "战斗装备", icon: <GavelRoundedIcon fontSize="small" /> },
	{ id: "rules", label: "规则速查", icon: <MenuBookRoundedIcon fontSize="small" /> },
];

export default function CharacterSheet() {
	const [activeTab, setActiveTab] = useState<TabId>("status");
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);
	const exportJSON = useCharacterStore((s) => s.exportJSON);
	const importJSON = useCharacterStore((s) => s.importJSON);
	const info = useCharacterStore((s) => s.info);
	const derived = useCharacterStore((s) => s.derived);

	const handleExport = () => {
		const json = exportJSON();
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${info.name || "character"}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;
			importJSON(await file.text());
		};
		input.click();
	};

	const tabContent = useMemo(() => {
		if (activeTab === "status") return <StatusPanel />;
		if (activeTab === "backstory") return <BackstoryPanel />;
		if (activeTab === "combat") {
			return (
				<PlaceholderPanel
					title="战斗与装备模块"
					description="这里适合继续接入武器列表、伤害公式、随身物品和战斗轮次记录。"
					chips={["武器列表", "伤害公式", "携带物"]}
				/>
			);
		}

		return (
			<PlaceholderPanel
				title="规则速查模块"
				description="这里可以继续加入理智检定、追逐规则和常用参考表，作为跑团时的辅助区域。"
				chips={["属性检定", "SAN 损失", "追逐规则"]}
			/>
		);
	}, [activeTab]);

	return (
		<Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
			<Box sx={{ mx: "5vw" }}>
				<Box sx={{ display: "grid", gap: 3 }}>
					<Header onOpenInfo={() => setInfoDialogOpen(true)} />
          
					<Box
						sx={{
							display: "grid",
							gap: 3,
							gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.55fr) minmax(360px, 0.68fr)" },
							alignItems: "start",
						}}>
						<SkillTable />
						{/* <Box
							sx={{
								display: "flex",
								gap: 1.25,
								flexDirection: { xs: "column", sm: "row" },
								width: { xs: "100%", md: "auto" },
							}}>
							<Button variant="outlined" startIcon={<UploadRoundedIcon />} onClick={handleImport}>
								导入人物卡
							</Button>
							<Button
								variant="contained"
								startIcon={<DownloadRoundedIcon />}
								onClick={handleExport}>
								导出人物卡
							</Button>
						</Box> */}

						<Box sx={{ display: "grid", gap: 3 }}>
							<AttributePanel />

							<Paper sx={{ overflow: "hidden", backgroundColor: alpha("#171d1b", 0.86) }}>
								<Box
									sx={{
										px: { xs: 2, md: 3 },
										pt: 2,
										borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
									}}>
									<Box
										sx={{
											display: "flex",
											gap: 1.5,
											justifyContent: "space-between",
											alignItems: { xs: "flex-start", md: "center" },
											flexDirection: { xs: "column", md: "row" },
										}}>
										<Box>
											<Typography variant="h2" sx={{ fontSize: "1.15rem" }}>
												状态、背景与扩展
											</Typography>
											<Typography variant="body2" color="text.secondary">
												当前最大体力 {derived.maxHP}，最大理智 {derived.maxSAN}，最大魔法值{" "}
												{derived.maxMP}
											</Typography>
										</Box>
										<Chip
											color="secondary"
											variant="outlined"
											label={`当前页: ${TABS.find((tab) => tab.id === activeTab)?.label}`}
										/>
									</Box>

									<Tabs
										value={activeTab}
										onChange={(_, value: TabId) => setActiveTab(value)}
										variant="scrollable"
										allowScrollButtonsMobile
										sx={{ mt: 2 }}>
										{TABS.map((tab) => (
											<Tab
												key={tab.id}
												icon={tab.icon}
												iconPosition="start"
												label={tab.label}
												value={tab.id}
											/>
										))}
									</Tabs>
								</Box>

								<Box sx={{ p: { xs: 2, md: 3 } }}>{tabContent}</Box>
							</Paper>
						</Box>
					</Box>
				</Box>
			</Box>

			<Dialog
				open={infoDialogOpen}
				onClose={() => setInfoDialogOpen(false)}
				maxWidth="md"
				fullWidth>
				<DialogContent sx={{ pt: 1, marginTop: "1rem" }}>
					<InfoPanel inDialog />
				</DialogContent>
			</Dialog>
		</Box>
	);
}

function PlaceholderPanel({
	title,
	description,
	chips,
}: {
	title: string;
	description: string;
	chips: string[];
}) {
	return (
		<Alert
			severity="info"
			sx={{
				alignItems: "flex-start",
				border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.24)}`,
				backgroundColor: (theme) => alpha(theme.palette.info.main, 0.08),
			}}>
			<Box sx={{ display: "grid", gap: 2 }}>
				<Box>
					<Typography variant="h6">{title}</Typography>
					<Typography variant="body2" color="text.secondary">
						{description}
					</Typography>
				</Box>
				<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
					{chips.map((chip) => (
						<Chip key={chip} label={chip} variant="outlined" size="small" />
					))}
				</Box>
			</Box>
		</Alert>
	);
}
