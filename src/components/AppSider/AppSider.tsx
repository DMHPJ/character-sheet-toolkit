"use client";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Box,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const NAV_ITEMS = [
	{
		href: "/",
		label: "角色卡",
		description: "调查员创建与管理",
		icon: <DescriptionRoundedIcon />,
	},
  {
		href: "/simplify/",
		label: "简化卡",
		description: "调查员信息简化展示",
		icon: <DescriptionRoundedIcon />,
	},
	{
		href: "/kpChecking/",
		label: "KP审卡",
		description: "守秘人审核角色卡",
		icon: <DescriptionRoundedIcon />,
	},
];

export default function AppSider() {
	const pathname = usePathname();

	return (
		<Paper
			component="aside"
			sx={{
				width: { xs: 0, lg: 320 },
				px: { xs: 0, lg: 2 },
        border: { xs: "none" },
				backgroundColor: alpha("#171d1b", 0.9),
        overflow: "hidden",
			}}>
			<Box sx={{ px: 1, pt: 1, pb: 2.5 }}>
				<Typography variant="overline" color="secondary.main" sx={{ letterSpacing: "0.18em" }}>
					Navigation
				</Typography>
				<Typography variant="h2" sx={{ fontSize: "1.2rem", mt: 0.5 }}>
					功能导航
				</Typography>
			</Box>

			<List sx={{ p: 0, display: "grid", gap: 1 }}>
				{NAV_ITEMS.map((item) => {
					const isActive = pathname === item.href;

					return (
						<ListItemButton
							key={item.href}
							component={Link}
							href={item.href}
							selected={isActive}
							sx={{
								borderRadius: 0.5,
							}}>
							<ListItemIcon
								sx={{
									minWidth: 40,
									color: isActive ? "primary.main" : "text.secondary",
									mt: 0.25,
								}}>
								{item.icon}
							</ListItemIcon>
							<ListItemText primary={item.label} secondary={item.description} />
						</ListItemButton>
					);
				})}
			</List>
		</Paper>
	);
}
