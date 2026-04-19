"use client";

import {
	alpha,
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { WEAPON_CATALOG, WeaponCatalogEntry } from "@/data/weapons";

export default function KpCheckingTable() {

	return (
		<Paper sx={{ p: 2, mx: 2, backgroundColor: alpha("#171d1b", 0.84), height: "100%", overflow: "hidden" }}>

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
							武器列表
						</Typography>
					</Box>
				</Box>
			</Box>

			<TableContainer
				sx={{ borderRadius: 0.5, border: (theme) => `1px solid ${theme.palette.divider}`, height: "calc(100% - 36px)" }}>
				<Table aria-label="collapsible table" stickyHeader size="small">
					<TableHead>
						<TableRow>
							<TableCell sx={{ p: "6px", minWidth: "5rem" }}>武器类型</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>技能</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>伤害</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "3rem" }}>射程</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "3rem" }} align="center">是否贯穿</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }} align="center">每轮次数</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }} align="center">装弹量</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }} align="center">故障值</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>常见时代</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>价格（1920s/现代）</TableCell>
							<TableCell sx={{ p: "2px", minWidth: "6.5rem" }}>发明时间</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{WEAPON_CATALOG.map((row) => <CharacterRow key={row.id} row={row} />)}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}

function CharacterRow({ row }: { row: WeaponCatalogEntry }) {

	return (
		<TableRow>
			<TableCell sx={{ p: "6px" }}>{ row.name || "未命名" }</TableCell>
			<TableCell sx={{ p: "2px" }}>{ row.skill || "—" }</TableCell>
			<TableCell sx={{ p: "2px" }}>{ row.damage || "—" }</TableCell>
			<TableCell sx={{ p: "2px" }}>{ row.range || "—" }</TableCell>
			<TableCell sx={{ p: "2px" }} align="center">{ row.penetration ? "是" : "否" }</TableCell>
			<TableCell sx={{ p: "2px" }} align="center">{ row.attacksPerRound || "—" }</TableCell>
			<TableCell sx={{ p: "2px" }} align="center">{ row.ammo || "—" }</TableCell>
			<TableCell sx={{ p: "2px" }} align="center">{ row.malfunction || "—" }</TableCell>
			<TableCell sx={{ p: "2px" }}>{ row.eras || "—" }</TableCell>
			<TableCell sx={{ p: "2px" }}>{ row.price || "—" }</TableCell>
			<TableCell sx={{ p: "2px" }}>{ row.invention || "—" }</TableCell>
		</TableRow>
	);
}
