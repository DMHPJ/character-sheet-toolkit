import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/AppSider/AppSider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

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
			<body className="min-h-screen bg-background text-foreground antialiased">
				<SidebarProvider>
					<AppSidebar />
					<main className="min-h-screen flex-1 overflow-x-hidden">
						<div className="sticky top-0 z-20 flex h-12 items-center border-b border-border/60 bg-background/85 px-3 backdrop-blur md:hidden">
							<SidebarTrigger />
						</div>
						{children}
					</main>
					<Toaster richColors />
				</SidebarProvider>
			</body>
		</html>
	);
}
