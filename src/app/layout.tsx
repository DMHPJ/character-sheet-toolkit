/* eslint-disable @next/next/no-page-custom-font */
import { Box } from "@mui/material";
import type { Metadata } from "next";
import AppSider from "@/components/AppSider/AppSider";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import "./globals.css";

export const metadata: Metadata = {
	title: "CoC 7th 调查员工具箱",
	description: "基于克苏鲁的呼唤第七版规则的在线人物卡创建与管理工具",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-CN">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>
				<ThemeRegistry>
					<Box
						sx={{
							display: "flex",
							alignItems: "stretch",
              height: "100vh",
						}}>
						<AppSider />
						<Box
							component="main"
							sx={{ flex: 1, minWidth: 0, overflow: "auto", height: "100%", py: 2 }}>
							{children}
						</Box>
					</Box>
				</ThemeRegistry>
			</body>
		</html>
	);
}
