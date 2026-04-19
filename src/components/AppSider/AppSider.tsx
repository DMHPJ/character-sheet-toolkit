"use client";

import { FolderSharedRounded, GavelRounded, PortraitRounded } from "@mui/icons-material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Paper, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactElement } from "react";

const SIDER_WIDTH = 320;
const SIDER_COLLAPSED_WIDTH = 88;

const NAV_SECTIONS: {
	title?: string;
	items: {
		href: string;
		label: string;
		description: string;
		icon: ReactElement;
	}[];
}[] = [
	{
		items: [
			{
				href: "/",
				label: "角色卡",
				description: "调查员创建与管理",
				icon: <FolderSharedRounded />,
			},
			{
				href: "/simplify/",
				label: "简化卡",
				description: "调查员信息简化展示",
				icon: <PortraitRounded />,
			},
		],
	},
	{
		title: "通用数据",
		items: [
			{
				href: "/combatList/",
				label: "武器列表",
				description: "已有的武器内容列表",
				icon: <GavelRounded />,
			},
		],
	},
	{
		title: "KP功能",
		items: [
			{
				href: "/kpChecking/",
				label: "KP审卡",
				description: "守秘人审核角色卡",
				icon: <DescriptionRoundedIcon />,
			},
		],
	},
];

export default function AppSider() {
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(false);

	return (
		<Paper
			component="aside"
			sx={(theme) => ({
				width: { xs: 0, lg: collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH },
				flexShrink: 0,
				px: { xs: 0, lg: collapsed ? 1 : 2 },
				py: { xs: 0, lg: 2 },
				border: { xs: "none" },
				backgroundColor: alpha("#171d1b", 0.9),
				overflow: "hidden",
				transition: theme.transitions.create(["width", "padding"], {
					duration: theme.transitions.duration.standard,
					easing: theme.transitions.easing.easeInOut,
				}),
			})}>
			<Box
				sx={{
					display: { xs: "none", lg: "flex" },
					height: "100%",
					minWidth: 0,
					flexDirection: "column",
				}}>
				<Box
					sx={{
						display: "flex",
						alignItems: "flex-start",
						justifyContent: collapsed ? "center" : "space-between",
						gap: 1,
						px: collapsed ? 0 : 1,
						pt: 1,
						pb: 2.5,
					}}>
					<Box
						sx={{
							minWidth: 0,
							opacity: collapsed ? 0 : 1,
							width: collapsed ? 0 : "auto",
							overflow: "hidden",
							whiteSpace: "nowrap",
							transition: (theme) =>
								theme.transitions.create(["opacity", "width"], {
									duration: theme.transitions.duration.shorter,
								}),
						}}>
						<Typography variant="overline" color="secondary.main" sx={{ letterSpacing: "0.18em" }}>
							Navigation
						</Typography>
						<Typography variant="h2" sx={{ fontSize: "1.2rem", mt: 0.5 }}>
							功能导航
						</Typography>
					</Box>

					<Tooltip title={collapsed ? "展开侧栏" : "收起侧栏"} placement="right">
						<IconButton
							aria-label={collapsed ? "展开侧栏" : "收起侧栏"}
							onClick={() => setCollapsed((value) => !value)}
							size="small"
							sx={{
								flexShrink: 0,
								border: (theme) => `1px solid ${theme.palette.divider}`,
								backgroundColor: alpha("#0d1110", 0.56),
								"&:hover": {
									backgroundColor: alpha("#3fa17b", 0.16),
								},
							}}>
							{collapsed ? <ChevronRightRoundedIcon fontSize="small" /> : <ChevronLeftRoundedIcon fontSize="small" />}
						</IconButton>
					</Tooltip>
				</Box>

				<List sx={{ p: 0, display: "grid", gap: 1, overflowY: "auto", overflowX: "hidden" }}>
					{NAV_SECTIONS.map((section, sectionIndex) => (
						<Box key={section.title ?? `section-${sectionIndex}`} sx={{ display: "grid", gap: 1 }}>
							{section.title && !collapsed && (
								<Typography
									variant="overline"
									color="text.secondary"
									sx={{ px: 1, pt: sectionIndex > 0 ? 1 : 0, letterSpacing: "0.12em" }}>
									{section.title}
								</Typography>
							)}

							{section.items.map((item) => {
								const isActive = pathname === item.href;
								const itemButton = (
									<ListItemButton
										key={item.href}
										component={Link}
										href={item.href}
										selected={isActive}
										sx={{
											minHeight: 56,
											borderRadius: 0.5,
											justifyContent: collapsed ? "center" : "flex-start",
											px: collapsed ? 1 : 2,
										}}>
										<ListItemIcon
											sx={{
												minWidth: collapsed ? 0 : 40,
												color: isActive ? "primary.main" : "text.secondary",
												justifyContent: "center",
											}}>
											{item.icon}
										</ListItemIcon>
										<ListItemText
											primary={item.label}
											secondary={item.description}
											sx={{
												display: collapsed ? "none" : "block",
												m: 0,
												whiteSpace: "nowrap",
											}}
										/>
									</ListItemButton>
								);

								return collapsed ? (
									<Tooltip key={item.href} title={item.label} placement="right">
										{itemButton}
									</Tooltip>
								) : (
									itemButton
								);
							})}
						</Box>
					))}
				</List>
			</Box>
		</Paper>
	);
}
